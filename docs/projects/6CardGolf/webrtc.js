// WebRTC configuration
const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// Game state management (global, to be shared with game.js and ui.js)
const gameState = {
  pc: null,
  dc: null,
  isHost: false,
  gameStarted: false,
  isMyTurn: false,
  roundEnded: false,
  selectedCard: null,
  drawnCard: null,
  deck: [],
  drawPile: [],
  discardPile: [],
  playerHand: [],
  opponentHand: [],
  iceCandidates: [],
  connectionEstablished: false,
  // Add missing game state variables
  flippedInitialCards: 0,
  flippedOpponentInitialCards: 0,
  flippedHostInitialCards: 0,
  // Track if we've already sent our final hand to avoid resend loops
  sentFinalHand: false,
  // Track if a player has closed (all cards face up)
  closer: false,
  opponentClosed: false,
};

/**
 * Initiates the WebRTC connection as the host (Step 1).
 * Creates an offer and displays it for the client.
 */
async function createGame() {
  try {
    elements.createGameBtn.disabled = true;
    gameState.isHost = true;
    gameState.pc = new RTCPeerConnection(rtcConfig);
    setupPeerConnection("P1 (Host)");

    gameState.dc = gameState.pc.createDataChannel("game");
    setupDataChannel("P1 (Host)");

    const offer = await gameState.pc.createOffer();
    await gameState.pc.setLocalDescription(offer);
    console.log("P1 (Host): Set local description (offer).");

    await waitForIceGathering();

    const connectionData = {
      offer: gameState.pc.localDescription,
      candidates: gameState.iceCandidates,
    };
    elements.offerCode.value = btoa(JSON.stringify(connectionData));
    elements.hostStep2.style.display = "block";
  } catch (error) {
    handleError("Failed to create game", error);
  }
}

/**
 * Joins a game as the client (Step 2).
 * Processes the host's offer and generates an answer to send back.
 */
async function joinGame() {
  try {
    elements.joinGameBtn.disabled = true;
    const offerCode = elements.pastedOfferCode.value.trim();
    if (!offerCode) throw new Error("Please paste the Offer Code first");

    const connectionData = JSON.parse(atob(offerCode));
    const { offer, candidates } = connectionData;

    gameState.pc = new RTCPeerConnection(rtcConfig);
    setupPeerConnection("P2 (Client)");

    gameState.pc.ondatachannel = (event) => {
      gameState.dc = event.channel;
      setupDataChannel("P2 (Client)");
    };

    await gameState.pc.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("P2 (Client): Set remote description from HOST's offer.");

    for (const candidate of candidates) {
      await gameState.pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
    console.log("P2 (Client): Added all host ICE candidates.");

    const answer = await gameState.pc.createAnswer();
    await gameState.pc.setLocalDescription(answer);
    console.log("P2 (Client): Set local description (answer).");

    await waitForIceGathering();

    const answerData = {
      answer: gameState.pc.localDescription,
      candidates: gameState.iceCandidates,
    };
    elements.generatedAnswerCode.value = btoa(JSON.stringify(answerData));
    elements.joinStep2.style.display = "block";
  } catch (error) {
    handleError("Failed to join game", error);
  }
}

/**
 * Host completes the connection (Step 3).
 * Processes the client's answer to establish the connection.
 */
async function completeConnection() {
  if (!gameState.isHost) return;
  try {
    const answerCode = elements.answerCode.value.trim();
    if (!answerCode) throw new Error("Please paste the Answer Code first");

    const connectionData = JSON.parse(atob(answerCode));
    const { answer, candidates } = connectionData;

    await gameState.pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("P1 (Host): Set remote description from CLIENT's answer.");

    for (const candidate of candidates) {
      await gameState.pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
    console.log(
      "P1 (Host): Added all client ICE candidates. Connection should now establish.",
    );

    updateGameStatus("Finalizing connection...");
  } catch (error) {
    handleError("Failed to complete connection", error);
  }
}

function setupPeerConnection(peerId) {
  gameState.pc.onicegatheringstatechange = () =>
    console.log(
      `${peerId}: ICE gathering state:`,
      gameState.pc.iceGatheringState,
    );

  gameState.pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(`${peerId}: ICE candidate found:`, event.candidate);
      gameState.iceCandidates.push(event.candidate);
    }
  };

  gameState.pc.onconnectionstatechange = () => {
    console.log(`${peerId}: Connection state:`, gameState.pc.connectionState);
    updateConnectionStatus();
    if (
      gameState.pc.connectionState === "disconnected" ||
      gameState.pc.connectionState === "failed"
    ) {
      updateGameStatus("Connection lost. Please refresh to reconnect.");
      gameState.connectionEstablished = false;
      addChatMessage("system", "Connection lost. Please refresh to reconnect.");
    } else if (gameState.pc.connectionState === "connected") {
      gameState.connectionEstablished = true;
      addChatMessage("system", "Connection established successfully!");
    }
  };

  // Add error handling for peer connection
  gameState.pc.oniceconnectionstatechange = () => {
    console.log(`${peerId}: ICE connection state:`, gameState.pc.iceConnectionState);
    if (gameState.pc.iceConnectionState === "failed") {
      updateGameStatus("ICE connection failed. Please check your network connection.");
      addChatMessage("system", "ICE connection failed. Please check your network connection.");
    }
  };
}

function setupDataChannel(peerId) {
  gameState.dc.onopen = () => {
    console.log(`${peerId}: Data channel opened`);
    gameState.connectionEstablished = true;
    showGameInterface();
    updateConnectionStatus();
    addChatMessage("system", "Connected! You can now chat and play together.");
    startHeartbeat(); // Start heartbeat when connection is established
    if (gameState.isHost) {
      console.log("Host is starting a new game now that channel is open.");
      startNewGame();
    }
  };

  gameState.dc.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log(`${peerId}: Received message:`, message.type);
      handleMessage(message);
    } catch (e) {
      console.error(`${peerId}: Error parsing message:`, e);
      addChatMessage("system", "Error receiving message from opponent.");
    }
  };
  
  gameState.dc.onclose = () => {
    console.log(`${peerId}: Data channel closed`);
    gameState.connectionEstablished = false;
    stopHeartbeat(); // Stop heartbeat when connection closes
    updateConnectionStatus();
    updateGameStatus("Connection lost. Please refresh to reconnect.");
    addChatMessage("system", "Connection lost. Please refresh to reconnect.");
  };
  
  gameState.dc.onerror = (error) => {
    console.error(`${peerId}: Data channel error:`, error);
    handleError("Connection error", error);
    addChatMessage("system", "Connection error occurred.");
  };
}

function waitForIceGathering() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.warn("ICE gathering timed out, proceeding anyway...");
      resolve();
    }, 10000); // 10 second timeout

    if (gameState.pc.iceGatheringState === "complete") {
      clearTimeout(timeout);
      resolve();
    } else {
      const checkState = () => {
        if (gameState.pc.iceGatheringState === "complete") {
          clearTimeout(timeout);
          gameState.pc.removeEventListener(
            "icegatheringstatechange",
            checkState,
          );
          resolve();
        }
      };
      gameState.pc.addEventListener("icegatheringstatechange", checkState);
    }
  });
}

function sendMessage(message) {
  if (gameState.dc && gameState.dc.readyState === "open") {
    try {
      gameState.dc.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error sending message:", error);
      addChatMessage("system", "Error sending message to opponent.");
    }
  } else {
    console.warn("Data channel not open. Ready state:", gameState.dc?.readyState);
    addChatMessage("system", "Cannot send message - connection not ready.");
  }
}

// Heartbeat mechanism to detect connection issues
let heartbeatInterval = null;

function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  
  heartbeatInterval = setInterval(() => {
    if (gameState.connectionEstablished && gameState.dc?.readyState === "open") {
      sendMessage({ type: "heartbeat", timestamp: Date.now() });
    }
  }, 30000); // Send heartbeat every 30 seconds
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function handleMessage(message) {
  try {
    switch (message.type) {
      case "gameStart":
        handleGameStart(message.data);
        break;
      case "gameAction":
        handleGameAction(message.data);
        break;
      case "chat":
        addChatMessage("opponent", message.data.text);
        break;
      case "newGameRequest":
        if (gameState.isHost) {
          startNewGame();
        } else {
          updateGameStatus(
            "Opponent requested a new game. Waiting for host to start...",
          );
        }
        break;
      case "heartbeat":
        // Respond to heartbeat to confirm connection is alive
        sendMessage({ type: "heartbeat", timestamp: Date.now() });
        break;
      default:
        console.warn("Unknown message type:", message.type);
    }
  } catch (error) {
    console.error("Error handling message:", error);
    addChatMessage("system", `Error processing message: ${error.message}`);
    
    // Log the error but don't automatically reset the game
    // Let the user decide if they want to continue or request a new game
    console.warn("Game message error occurred. Game will continue but may have issues.");
  }
}

function disconnect() {
  stopHeartbeat(); // Stop heartbeat when disconnecting
  if (gameState.dc) gameState.dc.close();
  if (gameState.pc) gameState.pc.close();
  resetGameState(); // Resets game state to initial values
  showConnectionSetup(); // Shows the connection setup UI
  updateConnectionStatus(); // Updates connection status display
  updateGameStatus("Disconnected. Create or Join a new game.");
  addChatMessage("system", "Disconnected from opponent.");
  // Restore original UI for connection setup
  elements.initialView.style.display = "block";
  elements.hostView.style.display = "none";
  elements.joinView.style.display = "none";
  elements.hostStep2.style.display = "none";
  elements.joinStep2.style.display = "none";
  elements.createGameBtn.disabled = false;
  elements.joinGameBtn.disabled = false;
}

// Function to reset game state, ensuring it's available globally
function resetGameState(keepConnection = false) {
  Object.assign(gameState, {
    pc: keepConnection ? gameState.pc : null,
    dc: keepConnection ? gameState.dc : null,
    isHost: keepConnection ? gameState.isHost : false,
    connectionEstablished: keepConnection
      ? gameState.connectionEstablished
      : false,
    gameStarted: false,
    isMyTurn: false,
    roundEnded: false,
    selectedCard: null,
    drawnCard: null,
    deck: [],
    drawPile: [],
    discardPile: [],
    playerHand: [],
    opponentHand: [],
    iceCandidates: [],
    // Reset the new game state variables
    flippedInitialCards: 0,
    flippedOpponentInitialCards: 0,
    flippedHostInitialCards: 0,
    sentFinalHand: false,
    closer: false,
    opponentClosed: false,
  });
  if (!keepConnection) {
    elements.chatMessages.innerHTML = "";
    updateGameStatus("Connect with a friend to start playing!");
  }
  updateScoreDisplay();
}

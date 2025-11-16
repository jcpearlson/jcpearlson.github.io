// DOM elements references
const elements = {
  connectionSetup: document.getElementById("connectionSetup"),
  gameContainer: document.getElementById("gameContainer"),
  initialView: document.getElementById("initialView"),
  hostView: document.getElementById("hostView"),
  joinView: document.getElementById("joinView"),
  showHostViewBtn: document.getElementById("showHostViewBtn"),
  showJoinViewBtn: document.getElementById("showJoinViewBtn"),
  hostStep2: document.getElementById("hostStep2"),
  joinStep2: document.getElementById("joinStep2"),
  offerCode: document.getElementById("offerCode"),
  answerCode: document.getElementById("answerCode"),
  pastedOfferCode: document.getElementById("pastedOfferCode"),
  generatedAnswerCode: document.getElementById("generatedAnswerCode"),
  copyOfferBtn: document.getElementById("copyOfferBtn"),
  copyAnswerBtn: document.getElementById("copyAnswerBtn"),
  connectionStatus: document.getElementById("connectionStatus"),
  turnIndicator: document.getElementById("turnIndicator"),
  gameStatus: document.getElementById("gameStatus"),
  playerHand: document.getElementById("playerHand"),
  opponentHand: document.getElementById("opponentHand"),
  drawPile: document.getElementById("drawPile"),
  discardPile: document.getElementById("discardPile"),
  drawnCardDisplay: document.getElementById("drawnCardDisplay"), // New element reference
  playerScore: document.getElementById("playerScore"),
  opponentScore: document.getElementById("opponentScore"),
  chatMessages: document.getElementById("chatMessages"),
  chatInput: document.getElementById("chatInput"),
  takeDiscardBtn: document.getElementById("takeDiscardBtn"),
  takeDrawBtn: document.getElementById("takeDrawBtn"),
  endTurnBtn: document.getElementById("endTurnBtn"),
  flipCardsBtn: document.getElementById("flipCardsBtn"),
  newGameBtn: document.getElementById("newGameBtn"),
  createGameBtn: document.getElementById("createGameBtn"),
  joinGameBtn: document.getElementById("joinGameBtn"),
  confirmConnectionBtn: document.getElementById("confirmConnectionBtn"),
  disconnectBtn: document.getElementById("disconnectBtn"),
  chatSendBtn: document.getElementById("chatSendBtn"),
  controls: document.getElementById("controls") || document.querySelector(".controls"), // Add fallback to find by class
};




/**
 * Utility to copy text from a textarea to the clipboard
 */
function copyToClipboard(elementId) {
  const textarea = document.getElementById(elementId);
  textarea.select();
  document.execCommand("copy");
  alert("Code copied to clipboard!");
}

function showGameInterface() {
  elements.connectionSetup.style.display = "none";
  elements.gameContainer.classList.add("active", "fade-in");
}

function showConnectionSetup() {
  elements.connectionSetup.style.display = "block";
  elements.gameContainer.classList.remove("active");
}

function updateConnectionStatus() {
  const s = elements.connectionStatus;
  if (gameState.connectionEstablished) {
    s.textContent = "Connected";
    s.className = "connection-status connected";
  } else {
    s.textContent = "Disconnected";
    s.className = "connection-status disconnected";
  }
}

// Counter for validation frequency
let validationCounter = 0;

function updateGameUI() {
  // Safety check: ensure DOM elements are ready
  if (!elements.playerHand || !elements.opponentHand) {
    console.warn("DOM elements not ready, skipping UI update");
    return;
  }
  
  // Only validate game state occasionally, not on every UI update
  // This prevents excessive validation that could cause false positives
  validationCounter++;
  if (gameState.gameStarted && validationCounter % 50 === 0) { // Only validate every 50 UI updates (much less frequent)
    const isValid = validateGameState();
    if (!isValid) {
      // If validation fails, log it but don't stop the UI update
      console.error("Game state validation failed, but continuing UI update");
    }
    // Debug logging to help track card issues
    if (typeof debugGameState === 'function') {
      debugGameState();
    }
  }
  
  updateHandDisplay();
  updatePileDisplay();
  updateTurnIndicator();
  updateControlButtons();
  updateScoreDisplay();
}

function updateHandDisplay() {
  elements.playerHand.innerHTML = "";
  elements.opponentHand.innerHTML = "";
  
  // Create grid layout for player hand (2x3)
  const playerGrid = document.createElement("div");
  playerGrid.className = "hand-grid";
  playerGrid.style.display = "grid";
  playerGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
  playerGrid.style.gridTemplateRows = "repeat(2, 1fr)";
  playerGrid.style.gap = "10px";
  
  gameState.playerHand.forEach((c, i) => {
    const e = createCardElement(c, true);
    e.onclick = () => handleCardClick(i);
    e.style.width = "100%";
    e.style.height = "100%";
    playerGrid.appendChild(e);
  });
  elements.playerHand.appendChild(playerGrid);
  
  // Create grid layout for opponent hand (2x3)
  const opponentGrid = document.createElement("div");
  opponentGrid.className = "hand-grid";
  opponentGrid.style.display = "grid";
  opponentGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
  opponentGrid.style.gridTemplateRows = "repeat(2, 1fr)";
  opponentGrid.style.gap = "10px";
  
  gameState.opponentHand.forEach((c) => {
    const e = createCardElement(c, false);
    e.style.width = "100%";
    e.style.height = "100%";
    opponentGrid.appendChild(e);
  });
  elements.opponentHand.appendChild(opponentGrid);
}

function createCardElement(c, isPlayerHand) {
  const e = document.createElement("div");
  e.className = "card";
  if (c.faceUp) {
    const { suit: s, value: v } = c.card;
    e.textContent = v + s;
    e.classList.add(s === "♥" || s === "♦" ? "red" : "black");
  } else {
    e.textContent = "?";
    e.classList.add("face-down");
  }
  const canSelectToReplace =
    gameState.isMyTurn &&
    gameState.drawnCard &&
    isPlayerHand &&
    !gameState.roundEnded;
  const canFlipInitial =
    gameState.isMyTurn === false && // during initial flip phase, isMyTurn is false
    !gameState.drawnCard &&
    isPlayerHand &&
    !c.faceUp &&
    !gameState.roundEnded &&
    gameState.flippedInitialCards < 2; // Only allow flipping if less than 2 flipped
  if (canSelectToReplace || canFlipInitial) {
    e.classList.add("selectable");
  } else {
    e.classList.remove("selectable");
  }
  return e;
}

function updatePileDisplay() {
  elements.drawPile.innerHTML = `<div>📚<br>Draw (${gameState.drawPile.length})</div>`;
  elements.discardPile.innerHTML = `<div>🗑️<br>Discard</div>`;

  // Display drawn card
  elements.drawnCardDisplay.innerHTML = `<div>✨<br>Drawn</div>`;
  if (gameState.drawnCard) {
    const drawnCardElement = createCardElement(
      { card: gameState.drawnCard, faceUp: true },
      false,
    );
    drawnCardElement.classList.remove("selectable");
    elements.drawnCardDisplay.innerHTML = ""; // Clear initial text
    elements.drawnCardDisplay.appendChild(drawnCardElement);
  }

  if (gameState.discardPile.length > 0) {
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    const cardElement = createCardElement(
      { card: topCard, faceUp: true },
      false,
    );
    cardElement.classList.remove("selectable"); // Discard pile card should not be selectable in the same way as hand cards
    elements.discardPile.appendChild(cardElement);
  }

  // Add/remove clickable class for draw and discard piles
  if (
    gameState.isMyTurn &&
    !gameState.drawnCard &&
    gameState.gameStarted &&
    !gameState.roundEnded
  ) {
    elements.drawPile.classList.add("clickable");
    if (gameState.discardPile.length > 0) {
      elements.discardPile.classList.add("clickable");
    } else {
      elements.discardPile.classList.remove("clickable");
    }
    elements.drawnCardDisplay.classList.remove("clickable"); // Drawn card display is not clickable for taking
  } else if (
    gameState.isMyTurn &&
    gameState.drawnCard &&
    gameState.gameStarted &&
    !gameState.roundEnded
  ) {
    // If a card is drawn, make discard pile clickable to discard drawn card
    elements.discardPile.classList.add("clickable");
    elements.drawPile.classList.remove("clickable");
    elements.drawnCardDisplay.classList.remove("clickable");
  } else {
    elements.drawPile.classList.remove("clickable");
    elements.discardPile.classList.remove("clickable");
    elements.drawnCardDisplay.classList.remove("clickable");
  }

  // Assign click handlers directly
  elements.drawPile.onclick = takeFromDraw;
  elements.discardPile.onclick = () => {
    // If a card is drawn, clicking discard pile discards it
    if (gameState.drawnCard && gameState.isMyTurn && !gameState.roundEnded) {
      discardDrawnCard();
    } else {
      // Otherwise, it's for taking from discard
      takeFromDiscard();
    }
  };
}

function updateTurnIndicator() {
  if (!gameState.gameStarted) {
    elements.turnIndicator.textContent = "Waiting to start game...";
    elements.turnIndicator.style.color = "";
  } else if (gameState.roundEnded) {
    elements.turnIndicator.textContent = "Round Over!";
    elements.turnIndicator.style.color = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--primary-color");
  } else if (gameState.isMyTurn) {
    elements.turnIndicator.textContent = "Your Turn!";
    elements.turnIndicator.style.color = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--accent-color");
  } else if (gameState.flippedInitialCards < INITIAL_FLIP_COUNT && !gameState.roundEnded) {
    // During initial flip phase, show appropriate message
    // Host always starts flipping first, client waits for host
    if (gameState.isHost || gameState.flippedInitialCards > 0) {
      // Host can flip immediately, or player has started flipping
      elements.turnIndicator.textContent = "Your Turn (Flipping Cards)";
    } else {
      // Client is waiting for host to finish flipping
      elements.turnIndicator.textContent = "Waiting to flip cards...";
    }
    elements.turnIndicator.style.color = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--accent-color");
  } else {
    elements.turnIndicator.textContent = "Opponent's Turn";
    elements.turnIndicator.style.color = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--primary-color");
  }
}

function updateGameStatus(message) {
  elements.gameStatus.textContent = message;
}

function updateControlButtons() {
  // Reset all buttons to hidden state
  elements.takeDiscardBtn.style.display = "none";
  elements.takeDrawBtn.style.display = "none";
  elements.endTurnBtn.style.display = "none";
  elements.flipCardsBtn.style.display = "none";
  elements.newGameBtn.style.display = "none";

  if (!gameState.gameStarted || gameState.roundEnded) {
    if (gameState.connectionEstablished && gameState.gameStarted) {
      // Only show New Game if connected and a game has been played
      elements.newGameBtn.style.display = "inline-block";
    }
    return;
  }

  if (gameState.isMyTurn) {
    const flippedCount = gameState.playerHand.filter((c) => c.faceUp).length;
    if (flippedCount < 2) {
      elements.flipCardsBtn.style.display = "inline-block"; // Keep flip button visible until 2 cards are flipped
      elements.flipCardsBtn.textContent = `Flip ${2 - flippedCount} card(s)`;
    } else if (!gameState.drawnCard) {
      elements.takeDrawBtn.style.display = "inline-block";
      if (gameState.discardPile.length > 0) {
        elements.takeDiscardBtn.style.display = "inline-block";
      }
    } else {
      elements.endTurnBtn.style.display = "inline-block";
      elements.endTurnBtn.textContent = "Discard Drawn Card";
    }
  } else if (gameState.isMyTurn === false && gameState.gameStarted && !gameState.roundEnded) {
    // During initial flip phase, show flip button if needed
    const flippedCount = gameState.playerHand.filter((c) => c.faceUp).length;
    if (flippedCount < 2) {
      elements.flipCardsBtn.style.display = "inline-block";
      elements.flipCardsBtn.textContent = `Flip ${2 - flippedCount} card(s)`;
    }
  }
  
  // Show reset game button only when the round has ended
  let recoveryBtn = document.getElementById("recoveryBtn");
  if (gameState.gameStarted && gameState.roundEnded) {
    // Add recovery button if it doesn't exist
    if (!recoveryBtn) {
      recoveryBtn = document.createElement("button");
      recoveryBtn.id = "recoveryBtn";
      recoveryBtn.textContent = "🔄 Reset Game";
      recoveryBtn.className = "button-warning";
      recoveryBtn.onclick = () => {
        if (typeof manualGameRecovery === 'function') {
          manualGameRecovery();
        }
      };
      // Safety check to ensure controls element exists
      if (elements.controls) {
        elements.controls.appendChild(recoveryBtn);
      } else {
        console.warn("Controls element not found, cannot add recovery button");
      }
    }
    if (recoveryBtn) {
      recoveryBtn.style.display = "inline-block";
    }
  } else {
    // Hide the button during active gameplay
    if (recoveryBtn) {
      recoveryBtn.style.display = "none";
    }
  }
}

function updateScoreDisplay() {
  if (!gameState.gameStarted) {
    if (elements.playerScore) elements.playerScore.textContent = "Your Score: ?";
    if (elements.opponentScore) elements.opponentScore.textContent = "Opponent Score: ?";
    return;
  }
  
  // Calculate and display scores continuously during gameplay based on face-up cards
  // calculateScore() only considers face-up cards, so it automatically handles partial information
  const playerScore = calculateScore(gameState.playerHand);
  const opponentScore = calculateScore(gameState.opponentHand);
  
  // Count visible opponent cards to show if score is partial
  const visibleOpponentCards = gameState.opponentHand.filter(c => c.faceUp).length;
  
  if (elements.playerScore) {
    // Always show player's current score based on face-up cards
    elements.playerScore.textContent = `Your Score: ${playerScore}`;
  }
  
  if (elements.opponentScore) {
    // Show opponent's score based on visible cards
    if (visibleOpponentCards === 0) {
      elements.opponentScore.textContent = "Opponent Score: ?";
    } else {
      // Show score even if partial (calculateScore already only uses face-up cards)
      elements.opponentScore.textContent = `Opponent Score: ${opponentScore}`;
    }
  }
  
  // If round ended, use the full score calculation with win/loss message
  if (gameState.roundEnded) {
    calculateAndDisplayScores();
  }
}

function addChatMessage(sender, text) {
  if (!elements.chatMessages) {
    console.warn("Chat messages element not found");
    return;
  }
  
  const m = document.createElement("div");
  // Map sender names to CSS classes
  let cssClass = sender;
  if (sender === "opponent") {
    cssClass = "other"; // Use "other" class for opponent messages
  }
  m.classList.add("chat-message", cssClass);
  m.textContent = text;
  elements.chatMessages.appendChild(m);
  
  // Scroll to bottom to show latest message
  // Use setTimeout to ensure DOM update is complete
  setTimeout(() => {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }, 0);
}

function handleError(context, error) {
  console.error(`${context}:`, error);
  if (typeof updateGameStatus === 'function') {
    updateGameStatus(`Error: ${context}. Check console for details.`);
  }
  if (typeof addChatMessage === 'function') {
    addChatMessage("system", `An error occurred: ${context}`);
  }
}

// Function to verify all required DOM elements are loaded
function verifyDOMElements() {
  const requiredElements = [
    'connectionSetup', 'gameContainer', 'playerHand', 'opponentHand',
    'drawPile', 'discardPile', 'turnIndicator', 'gameStatus', 'controls'
  ];
  
  const missingElements = [];
  
  requiredElements.forEach(id => {
    let element = document.getElementById(id);
    if (!element) {
      // Try to find by class as fallback
      element = document.querySelector(`.${id}`);
    }
    if (!element) {
      // Try to find by class containing the id
      element = document.querySelector(`[class*="${id}"]`);
    }
    if (!element) {
      missingElements.push(id);
    }
  });
  
  if (missingElements.length > 0) {
    console.warn("Missing DOM elements:", missingElements);
    
    // Try to find elements by class as fallback
    missingElements.forEach(id => {
      const element = document.querySelector(`[class*="${id}"]`);
      if (element) {
        console.log(`Found element with class containing "${id}":`, element);
      }
    });
    
    return false;
  }
  
  return true;
}

// Function to create missing elements if they don't exist
function createMissingElements() {
  const missingElements = [];
  
  // Check for controls element
  if (!document.getElementById("controls")) {
    const controlsDiv = document.createElement("div");
    controlsDiv.id = "controls";
    controlsDiv.className = "controls";
    
    // Find the game-area to insert controls
    const gameArea = document.querySelector(".game-area");
    if (gameArea) {
      gameArea.appendChild(controlsDiv);
      console.log("Created missing controls element");
    } else {
      missingElements.push("controls");
    }
  }
  
  return missingElements.length === 0;
}

// Function to refresh elements object after creating missing elements
function refreshElements() {
  // Re-query for elements that might have been created
  elements.controls = document.getElementById("controls") || document.querySelector(".controls");
  
  // Log the current state
  console.log("Elements refresh - controls:", elements.controls);
}

// Initialize UI after DOM is fully loaded
function initializeUI() {
  if (!verifyDOMElements()) {
    console.warn("Some DOM elements are missing, attempting to create them...");
    if (createMissingElements()) {
      console.log("Successfully created missing elements");
      // Refresh elements object after creating missing elements
      refreshElements();
    } else {
      console.warn("Could not create all missing elements, retrying in 100ms...");
      setTimeout(initializeUI, 100);
      return;
    }
  }
  
  console.log("All required DOM elements loaded, initializing UI...");
  
  // Set up event listeners
  setupEventListeners();
  
  // Show initial view
  if (elements.connectionSetup) {
    elements.connectionSetup.style.display = "block";
  }
}

// Set up event listeners
function setupEventListeners() {
  if (elements.showHostViewBtn) {
    elements.showHostViewBtn.onclick = () => {
      if (elements.initialView && elements.hostView) {
        elements.initialView.style.display = "none";
        elements.hostView.style.display = "block";
      }
    };
  }

  if (elements.showJoinViewBtn) {
    elements.showJoinViewBtn.onclick = () => {
      if (elements.initialView && elements.joinView) {
        elements.initialView.style.display = "none";
        elements.joinView.style.display = "block";
      }
    };
  }

  if (elements.createGameBtn) elements.createGameBtn.onclick = createGame; // Function from webrtc.js
  if (elements.joinGameBtn) elements.joinGameBtn.onclick = joinGame; // Function from webrtc.js
  if (elements.confirmConnectionBtn) elements.confirmConnectionBtn.onclick = completeConnection; // Function from webrtc.js
  if (elements.copyOfferBtn) elements.copyOfferBtn.onclick = () => copyToClipboard("offerCode");
  if (elements.copyAnswerBtn) elements.copyAnswerBtn.onclick = () => copyToClipboard("generatedAnswerCode");

  if (elements.disconnectBtn) elements.disconnectBtn.onclick = disconnect; // Function from webrtc.js
  if (elements.takeDiscardBtn) elements.takeDiscardBtn.onclick = takeFromDiscard; // Function from game.js
  if (elements.takeDrawBtn) elements.takeDrawBtn.onclick = takeFromDraw; // Function from game.js
  if (elements.endTurnBtn) elements.endTurnBtn.onclick = discardDrawnCard; // Function from game.js
  if (elements.flipCardsBtn) elements.flipCardsBtn.onclick = flipInitialCards; // Function from game.js
  if (elements.newGameBtn) elements.newGameBtn.onclick = requestNewGame; // Function from game.js
  if (elements.chatSendBtn) elements.chatSendBtn.onclick = sendChatMessage; // Function from game.js

  if (elements.chatInput) {
    elements.chatInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (typeof sendChatMessage === 'function') {
          sendChatMessage(); // Function from game.js
        }
      }
    };
  }
}

// Add keyboard shortcuts for debugging
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+D (or Cmd+Shift+D on Mac) to run debug
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    if (typeof debugGameState === 'function') {
      console.log("Debug shortcut triggered");
      debugGameState();
    }
  }
  
  // Ctrl+Shift+T (or Cmd+Shift+T on Mac) to run integrity test
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
    e.preventDefault();
    if (typeof runGameIntegrityTest === 'function') {
      console.log("Integrity test shortcut triggered");
      runGameIntegrityTest();
    }
  }
});

// Initialize UI when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  // DOM is already loaded
  initializeUI();
}

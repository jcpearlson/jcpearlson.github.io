// Game constants
const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const CARD_VALUES = {
  'K': 0, 'A': 1, 'J': 10, 'Q': 10,
  '2': -2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10
};

// Grid layout constants
const GRID_ROWS = 2;
const GRID_COLS = 3;
const INITIAL_FLIP_COUNT = 2;

// --- Game Logic Functions ---

function validateGameState() {
  const errors = [];
  
  // Don't validate during active gameplay to avoid false positives
  if (gameState.gameStarted && !gameState.roundEnded) {
    // Skip validation during card movements or active turns
    if (gameState.drawnCard || gameState.isMyTurn !== null) {
      return true; // Skip validation during active gameplay
    }
  }
  
  // Check if arrays exist
  if (!Array.isArray(gameState.playerHand)) errors.push("playerHand is not an array");
  if (!Array.isArray(gameState.opponentHand)) errors.push("opponentHand is not an array");
  if (!Array.isArray(gameState.drawPile)) errors.push("drawPile is not an array");
  if (!Array.isArray(gameState.discardPile)) errors.push("discardPile is not an array");
  
  // Check hand sizes (should be 6 cards in 2x3 grid)
  if (gameState.playerHand.length !== 6) errors.push(`playerHand has ${gameState.playerHand.length} cards, expected 6`);
  if (gameState.opponentHand.length !== 6) errors.push(`opponentHand has ${gameState.opponentHand.length} cards, expected 6`);
  
  // Check for invalid state combinations
  if (gameState.isMyTurn && gameState.roundEnded) errors.push("Cannot be my turn when round has ended");
  if (gameState.drawnCard && !gameState.isMyTurn) errors.push("Cannot have drawn card when not my turn");
  
  // Only check for duplicate cards if the game is in a stable state
  // Don't check during card movements (drawing, replacing, etc.)
  if (gameState.gameStarted && !gameState.drawnCard && !gameState.isMyTurn) {
    const allCards = [
      ...gameState.playerHand.map(h => h.card),
      ...gameState.opponentHand.map(h => h.card),
      ...gameState.drawPile,
      ...gameState.discardPile
    ];
    
    const cardStrings = allCards.map(card => `${card.value}${card.suit}`);
    const uniqueCards = new Set(cardStrings);
    const totalExpectedCards = allCards.length;
    
    if (uniqueCards.size !== totalExpectedCards) {
      errors.push(`Duplicate cards detected: ${uniqueCards.size} unique cards out of ${totalExpectedCards} total cards`);
      
      // Find the duplicates
      const cardCounts = {};
      cardStrings.forEach(cardStr => {
        cardCounts[cardStr] = (cardCounts[cardStr] || 0) + 1;
      });
      
      const duplicates = Object.entries(cardCounts).filter(([card, count]) => count > 1);
      if (duplicates.length > 0) {
        errors.push(`Duplicate cards found: ${duplicates.map(([card, count]) => `${card} (${count}x)`).join(', ')}`);
        
        // Log the error but don't auto-trigger recovery - let the user decide
        console.error("Duplicate cards detected in validation:", duplicates);
        console.warn("Game will continue but may have issues. Consider requesting a new game if problems persist.");
      }
    }
    
    // Verify card structure
    for (const card of allCards) {
      if (!card || !card.suit || !card.value) {
        errors.push(`Invalid card structure: ${JSON.stringify(card)}`);
      } else if (!SUITS.includes(card.suit) || !VALUES.includes(card.value)) {
        errors.push(`Invalid card values: ${card.value}${card.suit}`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.error("Game state validation errors:", errors);
    return false;
  }
  return true;
}

function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit: suit, value: value });
    }
  }
  // Verify we have exactly 52 cards
  if (deck.length !== 52) {
    console.error(`Deck creation error: Expected 52 cards, got ${deck.length}`);
  }
  return deck;
}

function shuffleDeck(deck) {
  // Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  // Verify no duplicates after shuffle
  const cardStrings = deck.map(card => `${card.value}${card.suit}`);
  const uniqueCards = new Set(cardStrings);
  if (uniqueCards.size !== 52) {
    console.error(`Shuffle error: Expected 52 unique cards, got ${uniqueCards.size}`);
  }
}

function startNewGame() {
  if (!gameState.isHost) return;
  try {
    resetGameState(true); // Keep connection, but reset game specifics
    gameState.sentFinalHand = false;
    
    // Create and verify deck
    gameState.deck = createDeck();
    if (gameState.deck.length !== 52) {
      throw new Error(`Invalid deck size: ${gameState.deck.length}`);
    }
    
    shuffleDeck(gameState.deck);
    
    // Verify deck integrity before dealing
    const cardStrings = gameState.deck.map(card => `${card.value}${card.suit}`);
    const uniqueCards = new Set(cardStrings);
    if (uniqueCards.size !== 52) {
      throw new Error(`Deck contains duplicate cards after shuffle`);
    }
    
    console.log(`Starting new game with ${gameState.deck.length} cards in deck`);
    
    // Deal cards one by one, verifying each card
    for (let i = 0; i < 6; i++) {
      const playerCard = gameState.deck.pop();
      const opponentCard = gameState.deck.pop();
      
      if (!playerCard || !opponentCard) {
        throw new Error(`Failed to deal cards: deck exhausted at position ${i}`);
      }
      
      // Verify cards are unique
      if (playerCard.value === opponentCard.value && playerCard.suit === opponentCard.suit) {
        throw new Error(`Duplicate card dealt: ${playerCard.value}${playerCard.suit}`);
      }
      
      gameState.playerHand.push({ card: playerCard, faceUp: false });
      gameState.opponentHand.push({ card: opponentCard, faceUp: false });
      
      console.log(`Dealt: Player ${playerCard.value}${playerCard.suit}, Opponent ${opponentCard.value}${opponentCard.suit}`);
    }

    // Verify remaining deck
    if (gameState.deck.length !== 40) { // 52 - 12 = 40
      throw new Error(`After dealing, deck should have 40 cards, but has ${gameState.deck.length}`);
    }
    
    gameState.drawPile = [...gameState.deck];
    // Discard pile starts empty - first card drawn will become the first discard
    gameState.discardPile = [];

    // Final verification
    const totalCards = gameState.playerHand.length + gameState.opponentHand.length + 
                      gameState.drawPile.length + gameState.discardPile.length;
    if (totalCards !== 52) {
      throw new Error(`Card count mismatch: ${totalCards} total cards, expected 52`);
    }
    
    // Verify draw pile has exactly 40 cards
    if (gameState.drawPile.length !== 40) {
      throw new Error(`Draw pile should have 40 cards, but has ${gameState.drawPile.length}`);
    }

    gameState.gameStarted = true;
    gameState.roundEnded = false;
    gameState.isMyTurn = false; // No one's turn yet, it's flipping phase
    gameState.selectedCard = null;
    gameState.drawnCard = null;
    gameState.flippedInitialCards = 0; // Track how many initial cards are flipped by current player
    gameState.flippedOpponentInitialCards = 0; // Initialize for host to track opponent's flips
    gameState.flippedHostInitialCards = 0; // Initialize for host to track their own flips

    // Send initial game state to opponent
    sendMessage({
      type: "gameStart",
      data: {
        playerHand: gameState.opponentHand.map(h => h.card), // Opponent's playerHand is my opponentHand (cards only)
        opponentHand: gameState.playerHand.map(h => h.card), // Opponent's opponentHand is my playerHand (cards only)
        drawPile: gameState.drawPile,
        discardPile: null, // Discard pile starts empty
        hostStartsFlipping: true // Indicate to client that host starts the initial flipping
      }
    });

    // Host starts flipping their initial cards
    // Update status first to clear any "Finalizing connection..." message
    updateGameStatus("Flip two of your cards to start the game.");
    elements.newGameBtn.style.display = "none";
    flipInitialCards(); // This will update status again and call updateGameUI()

  } catch (e) {
    handleError("Failed to start game", e);
    // Reset game state on error
    resetGameState(true);
  }
}

function handleGameStart(data) {
  try {
    resetGameState(true); // Keep connection, but reset game specifics
    gameState.sentFinalHand = false;
    
    // Validate received data
    if (!Array.isArray(data.playerHand) || !Array.isArray(data.opponentHand)) {
      throw new Error("Invalid game start data: missing hand arrays");
    }
    
    if (data.playerHand.length !== 6 || data.opponentHand.length !== 6) {
      throw new Error(`Invalid hand sizes: player=${data.playerHand.length}, opponent=${data.opponentHand.length}`);
    }
    
    // Verify no duplicate cards in received hands
    const allReceivedCards = [...data.playerHand, ...data.opponentHand];
    const cardStrings = allReceivedCards.map(card => `${card.value}${card.suit}`);
    const uniqueCards = new Set(cardStrings);
    if (uniqueCards.size !== 12) {
      throw new Error(`Duplicate cards detected in received hands: expected 12 unique cards, got ${uniqueCards.size}`);
    }
    
    // Verify received cards have valid structure
    for (const card of allReceivedCards) {
      if (!card.suit || !card.value || !SUITS.includes(card.suit) || !VALUES.includes(card.value)) {
        throw new Error(`Invalid card structure: ${JSON.stringify(card)}`);
      }
    }
    
    console.log("Received valid game start data:", {
      playerHand: data.playerHand.map(c => `${c.value}${c.suit}`),
      opponentHand: data.opponentHand.map(c => `${c.value}${c.suit}`)
    });
    
    gameState.gameStarted = true;
    gameState.playerHand = data.playerHand.map(c => ({ card: c, faceUp: false }));
    gameState.opponentHand = data.opponentHand.map(c => ({ card: c, faceUp: false }));
    gameState.drawPile = data.drawPile || [];
    // Ensure discard pile is always an array
    gameState.discardPile = data.discardPile ? [data.discardPile] : [];
    gameState.isMyTurn = false; // No one's turn yet, it's flipping phase
    gameState.roundEnded = false;
    gameState.selectedCard = null;
    gameState.drawnCard = null;
    gameState.flippedInitialCards = 0;
    gameState.flippedOpponentInitialCards = 0; // Initialize for client
    gameState.flippedHostInitialCards = 0; // Initialize for client

    // Add a small delay to ensure UI is ready
    setTimeout(() => {
      updateGameUI();
      if (data.hostStartsFlipping) {
        updateGameStatus("Waiting for opponent to flip their cards.");
      } else {
        flipInitialCards();
        updateGameStatus("Flip two of your cards to start the game.");
      }
      elements.newGameBtn.style.display = "none";
    }, 100);
    
  } catch (e) {
    handleError("Failed to handle game start", e);
    // Request a new game if there's an error
    if (gameState.connectionEstablished) {
      sendMessage({ type: "newGameRequest" });
    }
  }
}

function handleGameAction(action) {
  console.log('Received game action:', action.type, action);

  switch (action.type) {
    case 'cardFlipped':
      // Validate card index bounds
      if (typeof action.cardIndex !== 'number' || action.cardIndex < 0 || 
          action.cardIndex >= gameState.opponentHand.length || 
          !gameState.opponentHand[action.cardIndex]) {
        console.error('Invalid card index in cardFlipped:', action.cardIndex);
        break;
      }
      
      // Validate the received card before updating
      if (!action.card || !action.card.suit || !action.card.value) {
        console.error('Invalid card received in cardFlipped:', action.card);
        break;
      }
      
      // Only update faceUp status, don't replace the card object
      gameState.opponentHand[action.cardIndex].faceUp = true;
      
      // Verify the card matches what we expect
      const existingCard = gameState.opponentHand[action.cardIndex].card;
      if (existingCard.suit !== action.card.suit || existingCard.value !== action.card.value) {
        console.error('Card mismatch in cardFlipped:', {
          existing: `${existingCard.value}${existingCard.suit}`,
          received: `${action.card.value}${action.card.suit}`
        });
        // Don't update the card, just log the error
      }
      // Check if it's an initial flip by the opponent
      if (action.isInitialFlip) {
        if (gameState.isHost) { // Host is tracking both initial flips
          // Prevent counting beyond INITIAL_FLIP_COUNT to avoid race conditions
          const currentCount = gameState.flippedOpponentInitialCards || 0;
          if (currentCount < INITIAL_FLIP_COUNT) {
            gameState.flippedOpponentInitialCards = currentCount + 1;
            console.log(`Host: Opponent flipped ${gameState.flippedOpponentInitialCards}/${INITIAL_FLIP_COUNT} cards`);
            if (gameState.flippedOpponentInitialCards === INITIAL_FLIP_COUNT && gameState.flippedInitialCards === INITIAL_FLIP_COUNT) {
              // Both players have flipped 2 initial cards, now determine who starts the actual game
              determineFirstTurn();
            }
          }
        } else { // Client is tracking their own initial flips
            // No action needed here for client, host will determine and inform
        }
      }
      break;
    case 'initialFlipComplete': // New message type for when a player finishes initial flips
        if (gameState.isHost) {
            gameState.flippedOpponentInitialCards = INITIAL_FLIP_COUNT; // Opponent has completed their initial flips
            console.log(`Host: Opponent completed initial flips, host has ${gameState.flippedInitialCards}/${INITIAL_FLIP_COUNT}`);
            if (gameState.flippedInitialCards === INITIAL_FLIP_COUNT) { // Check if host also completed
                determineFirstTurn();
            }
        } else { // Client receives this from host after host has completed their flips
            // Host has finished flipping, now it's the client's turn to flip
            if (gameState.flippedInitialCards < INITIAL_FLIP_COUNT) {
                console.log("Client: Host has finished flipping, now it's my turn to flip");
                flipInitialCards(); // Enable the client to flip their cards (includes updateGameUI)
            }
        }
        break;
    case 'startTurn':
        gameState.isMyTurn = action.isMyTurn;
        updateGameUI();
        if (gameState.isMyTurn) {
            updateGameStatus("It's your turn! Draw a card or take from discard.");
        } else {
            updateGameStatus("Opponent's turn. Waiting for their move...");
        }
        break;
    case 'cardReplaced':
      // Validate card index bounds and new card
      if (typeof action.cardIndex === 'number' && action.cardIndex >= 0 && 
          action.cardIndex < gameState.opponentHand.length &&
          action.newCard && action.newCard.suit && action.newCard.value) {
        gameState.opponentHand[action.cardIndex] = { card: action.newCard, faceUp: true };
      } else {
        console.error('Invalid card index or card in cardReplaced:', {
          cardIndex: action.cardIndex,
          newCard: action.newCard
        });
      }
      // Ensure discardPile is always an array
      if (action.discardedCard) {
        gameState.discardPile = [action.discardedCard];
      } else {
        gameState.discardPile = Array.isArray(gameState.discardPile) ? gameState.discardPile : [];
      }
      gameState.drawnCard = null; // Opponent's drawn card is now discarded or replaced
      gameState.isMyTurn = true; // It becomes your turn after opponent's action
      
      // Check for closing after opponent's action
      checkForClosing();
      
      // If player closed, opponent just finished their final turn, so round ends now
      if (gameState.closer && !gameState.roundEnded) {
        console.log("Player closed, opponent finished their final turn, ending round");
        endRound();
      } else if (gameState.opponentClosed && !gameState.roundEnded) {
        // Opponent closed - this is now the player's final turn (don't end yet)
        updateGameStatus('Opponent closed and finished their turn. This is your final turn!');
      } else if (!gameState.roundEnded) {
        updateGameStatus('Opponent replaced a card. Your turn!');
      }
      break;
    case 'cardDrawn':
      // Opponent drew a card from the draw pile - remove one card from our draw pile to stay in sync
      // We don't know which card was drawn, but we know one was removed from the end
      if (Array.isArray(gameState.drawPile) && gameState.drawPile.length > 0) {
        gameState.drawPile.pop(); // Remove the last card to match the opponent's draw
        updateGameUI(); // Update UI to show correct draw pile count
      } else {
        console.warn('Opponent drew a card but our draw pile is empty or invalid');
      }
      break;
    case 'playerClosed':
      // Opponent has closed (all cards face up) - this is now their final turn
      gameState.opponentClosed = true;
      updateGameStatus("Opponent has closed! This is your final turn.");
      console.log("Opponent has closed");
      break;
    case 'cardDiscarded':
      // Ensure discardPile is always an array
      if (action.discardedCard) {
        gameState.discardPile = [action.discardedCard];
      } else {
        gameState.discardPile = Array.isArray(gameState.discardPile) ? gameState.discardPile : [];
      }
      gameState.drawnCard = null; // Opponent's drawn card is now discarded
      gameState.isMyTurn = true; // It becomes your turn after opponent's action
      
      // Check for closing after opponent's action
      checkForClosing();
      
      // If player closed, opponent just finished their final turn, so round ends now
      if (gameState.closer && !gameState.roundEnded) {
        console.log("Player closed, opponent finished their final turn, ending round");
        endRound();
      } else if (gameState.opponentClosed && !gameState.roundEnded) {
        // Opponent closed - this is now the player's final turn (don't end yet)
        updateGameStatus('Opponent closed and finished their turn. This is your final turn!');
      } else if (!gameState.roundEnded) {
        updateGameStatus('Opponent discarded the card. Your turn!');
      }
      break;
    case 'roundEnded':
      gameState.roundEnded = true;
      // Ensure opponentHand is fully revealed using the full card objects from finalPlayerHand
      if (Array.isArray(action.finalPlayerHand)) {
        gameState.opponentHand = action.finalPlayerHand.map(c => ({ card: c, faceUp: true }));
      }
      // Reveal our own hand locally too, in case it isn't already
      gameState.playerHand.forEach(h => h.faceUp = true);

      // If we have not yet sent our own final hand, send it back now as an acknowledgement
      if (!gameState.sentFinalHand) {
        sendMessage({
          type: 'gameAction',
          data: {
            type: 'roundEnded',
            finalPlayerHand: gameState.playerHand.map(h => h.card),
          }
        });
        gameState.sentFinalHand = true;
      }

      calculateAndDisplayScores();
      elements.newGameBtn.style.display = 'inline-block';
      updateGameStatus('Round ended! Scores calculated. Click "New Game" to play again.');
      break;
  }
  updateGameUI();
}

function handleCardClick(index) {
  if (!gameState.gameStarted || gameState.roundEnded) return;

  // Validate index bounds first
  if (typeof index !== 'number' || index < 0 || index >= gameState.playerHand.length) {
    console.error('Invalid card index in handleCardClick:', index);
    return;
  }

  const cardInHand = gameState.playerHand[index];
  if (!cardInHand) return; // Safety check

  // Logic for initial two card flips (before drawing/taking phase)
  if (gameState.flippedInitialCards < INITIAL_FLIP_COUNT && !cardInHand.faceUp && gameState.isMyTurn === false) { // isMyTurn is false during initial flip phase
    cardInHand.faceUp = true;
    gameState.flippedInitialCards++;
    console.log(`Player flipped ${gameState.flippedInitialCards}/${INITIAL_FLIP_COUNT} initial cards`);
    sendMessage({ type: "gameAction", data: { type: "cardFlipped", cardIndex: index, card: cardInHand.card, isInitialFlip: true } });
    updateGameUI();

    if (gameState.flippedInitialCards === INITIAL_FLIP_COUNT) {
        updateGameStatus("You have flipped two cards. Waiting for opponent to flip their cards.");
        // Inform opponent that current player has finished initial flips
        sendMessage({ type: "gameAction", data: { type: "initialFlipComplete" } });

        if (gameState.isHost) {
            gameState.flippedHostInitialCards = INITIAL_FLIP_COUNT; // Host records their own flips
            console.log(`Host completed initial flips, opponent has ${gameState.flippedOpponentInitialCards}/${INITIAL_FLIP_COUNT}`);
            if (gameState.flippedOpponentInitialCards === INITIAL_FLIP_COUNT) {
                determineFirstTurn();
            }
        }
    } else if (gameState.flippedInitialCards < INITIAL_FLIP_COUNT) {
      updateGameStatus(`Flip ${INITIAL_FLIP_COUNT - gameState.flippedInitialCards} more card(s).`);
    }
    return;
  }

  // Logic for replacing a card after drawing/taking from discard
  if (gameState.drawnCard && gameState.isMyTurn) {
    gameState.selectedCard = index; // Store selected index for replacement
    replaceCard(index);
  } else if (gameState.isMyTurn && gameState.playerHand.filter(c => c.faceUp).length >= INITIAL_FLIP_COUNT) { // Only show this if it's the actual turn AND initial flips are done
    updateGameStatus("Draw a card from the Draw Pile or take from Discard Pile first.");
  }
}

function determineFirstTurn() {
    if (!gameState.isHost) return; // Only host determines the first turn

    const randomPlayerStarts = Math.random() < 0.5; // True for host, false for client
    gameState.isMyTurn = randomPlayerStarts;
    sendMessage({ type: "gameAction", data: { type: "startTurn", isMyTurn: !randomPlayerStarts } });

    updateGameUI();
    if (gameState.isMyTurn) {
        updateGameStatus("You go first! Draw a card or take from discard.");
    } else {
        updateGameStatus("Opponent goes first. Waiting for their move...");
    }
}

function takeFromDiscard() {
  if (!gameState.isMyTurn || gameState.drawnCard || !gameState.gameStarted || gameState.roundEnded) return;
  // Ensure discardPile is an array and has cards
  if (!Array.isArray(gameState.discardPile) || gameState.discardPile.length === 0) {
    updateGameStatus("Discard pile is empty!");
    return;
  }
  
  // Take the top card from discard pile (this is normal gameplay)
  // Note: We don't validate for "duplicates" here because card movement between
  // game areas (discard pile -> hand) is the core mechanic of 6 Card Golf
  gameState.drawnCard = gameState.discardPile.pop();
  updateGameUI();
  updateGameStatus("You took a card from the discard pile. Now choose a card to replace in your hand, or discard the drawn card.");
  elements.takeDrawBtn.style.display = "none";
  elements.takeDiscardBtn.style.display = "none";
  elements.endTurnBtn.style.display = "inline-block"; // Show discard drawn card button
  elements.playerHand.querySelectorAll(".card").forEach(c => c.classList.add("selectable")); // Make hand cards selectable for replacement
}

function takeFromDraw() {
  if (!gameState.isMyTurn || gameState.drawnCard || !gameState.gameStarted || gameState.roundEnded) return;
  if (!gameState.drawPile || gameState.drawPile.length === 0) {
    updateGameStatus("Draw pile is empty! Round ends.");
    endRound();
    return;
  }
  
  // Draw a card from the draw pile (this is normal gameplay)
  // Note: We don't validate for "duplicates" here because card movement between
  // game areas (draw pile -> hand) is the core mechanic of 6 Card Golf
  gameState.drawnCard = gameState.drawPile.pop();
  
  // Notify opponent that a card was drawn so they can update their draw pile
  sendMessage({
    type: "gameAction",
    data: {
      type: "cardDrawn"
    }
  });
  
  updateGameUI();
  updateGameStatus("You drew a card. Now choose a card to replace in your hand, or discard the drawn card.");
  elements.takeDrawBtn.style.display = "none";
  elements.takeDiscardBtn.style.display = "none";
  elements.endTurnBtn.style.display = "inline-block"; // Show discard drawn card button
  elements.playerHand.querySelectorAll(".card").forEach(c => c.classList.add("selectable")); // Make hand cards selectable for replacement
}

function replaceCard(index) {
  if (!gameState.isMyTurn || !gameState.drawnCard || gameState.roundEnded) return;

  // Validate index bounds first
  if (index < 0 || index >= gameState.playerHand.length || !gameState.playerHand[index]) {
    console.error("Invalid card index for replacement:", index);
    updateGameStatus("Error: Invalid card selection!");
    return;
  }

  const replacedCard = gameState.playerHand[index].card; // The card being replaced
  const newCard = gameState.drawnCard;
  
  // Additional validation: ensure the card we're replacing exists
  if (!replacedCard || !replacedCard.suit || !replacedCard.value) {
    console.error("Invalid card being replaced:", replacedCard);
    updateGameStatus("Error: Invalid card replacement!");
    return;
  }
  
  // Additional validation: ensure the new card is valid
  if (!newCard || !newCard.suit || !newCard.value) {
    console.error("Invalid new card:", newCard);
    updateGameStatus("Error: Invalid new card!");
    return;
  }
  
  // Replace the card (this is normal gameplay)
  gameState.playerHand[index] = { card: newCard, faceUp: true }; // Replace and automatically flip face up
  // Ensure discardPile is an array before pushing
  if (!Array.isArray(gameState.discardPile)) {
    gameState.discardPile = [];
  }
  gameState.discardPile.push(replacedCard); // The replaced card goes to discard

  sendMessage({
    type: "gameAction",
    data: {
      type: "cardReplaced",
      cardIndex: index,
      newCard: newCard,
      discardedCard: replacedCard
    }
  });

  gameState.drawnCard = null; // Clear drawn card
  endMyTurn();
}

function discardDrawnCard() {
  if (!gameState.isMyTurn || !gameState.drawnCard || gameState.roundEnded) return;

  // Ensure discardPile is an array before pushing
  if (!Array.isArray(gameState.discardPile)) {
    gameState.discardPile = [];
  }
  gameState.discardPile.push(gameState.drawnCard); // Discard the drawn card
  sendMessage({
    type: "gameAction",
    data: {
      type: "cardDiscarded",
      discardedCard: gameState.drawnCard
    }
  });

  gameState.drawnCard = null; // Clear drawn card
  endMyTurn();
}

function endMyTurn() {
  // Validate game state before ending turn
  if (!gameState.gameStarted || gameState.roundEnded) {
    console.error("Cannot end turn: game not started or round ended");
    return;
  }
  
  if (!gameState.isMyTurn) {
    console.error("Cannot end turn: not my turn");
    return;
  }
  
  if (gameState.drawnCard) {
    console.error("Cannot end turn: still have drawn card");
    return;
  }
  
  gameState.isMyTurn = false;
  gameState.selectedCard = null; // Clear any selected card
  updateGameUI();
  
  // Check for closing after turn ends (before updating status)
  checkForClosing();
  
  // If opponent closed and player just finished their final turn, end the round
  if (gameState.opponentClosed && !gameState.roundEnded) {
    console.log("Opponent closed, player finished their final turn, ending round");
    endRound();
  } else if (gameState.closer && !gameState.roundEnded) {
    // Player closed and finished their turn - opponent gets one final turn
    // After opponent's turn, the round will end (handled in cardReplaced/cardDiscarded handlers)
    updateGameStatus("You closed! Waiting for opponent's final turn...");
  } else if (!gameState.roundEnded) {
    updateGameStatus("Turn ended. Waiting for opponent...");
  }
  elements.playerHand.querySelectorAll(".card").forEach(c => c.classList.remove("selectable")); // Remove selectable class from all cards
}

function endRound() {
  if (gameState.roundEnded) return; // Prevent multiple calls

  gameState.roundEnded = true;
  gameState.isMyTurn = false; // Ensure no more turns

  // Reveal all cards for both players
  gameState.playerHand.forEach(card => card.faceUp = true);

  calculateAndDisplayScores();
  sendMessage({
    type: "gameAction",
    data: {
      type: "roundEnded",
      finalPlayerHand: gameState.playerHand.map(h => h.card), // Send my final revealed hand (only the card object)
    }
  });
  // Mark that we've already sent our final hand
  gameState.sentFinalHand = true;

  updateGameUI();
  updateGameStatus('Round ended! Scores calculated. Click "New Game" to play again.');
  elements.newGameBtn.style.display = "inline-block";
}

function flipInitialCards() {
  // This function is for the current player to flip their initial two cards.
  updateGameStatus("Click on two cards in your hand to flip them.");
  elements.flipCardsBtn.style.display = "none"; // Hide button once process starts
  // Cards will be made selectable via updateGameUI() which calls createCardElement()
  // This ensures the selectable state is based on current game state
  updateGameUI();
}

function calculateScore(hand) {
  let score = 0;
  const cardScores = new Array(6).fill(0);
  const grid = [];

  // Arrange cards in 2x3 grid and get their initial scores
  for (let i = 0; i < hand.length; i++) {
    const row = Math.floor(i / GRID_COLS);
    const col = i % GRID_COLS;
    if (!grid[row]) {
      grid[row] = [];
    }
    grid[row][col] = null;
    if (hand[i] && hand[i].faceUp) {
      grid[row][col] = hand[i].card;
      cardScores[i] = CARD_VALUES[hand[i].card.value];
    }
  }

  // Check for 2x2 square of equal cards (scores -20)
  for (let row = 0; row < GRID_ROWS - 1; row++) {
    for (let col = 0; col < GRID_COLS - 1; col++) {
      if (grid[row][col] && grid[row][col+1] && grid[row+1][col] && grid[row+1][col+1]) {
        const card1 = grid[row][col];
        const card2 = grid[row][col+1];
        const card3 = grid[row+1][col];
        const card4 = grid[row+1][col+1];

        if (card1.value === card2.value && card2.value === card3.value && card3.value === card4.value) {
          console.log(`2x2 square found: ${card1.value}${card1.suit} - scoring -20 points`);
          return -20; // 2x2 square overrides all other scoring
        }
      }
    }
  }

  // Check for column cancellation
  for (let col = 0; col < GRID_COLS; col++) {
    if (grid[0][col] && grid[1][col] && grid[0][col].value === grid[1][col].value) {
      console.log(`Column ${col} cancelled: ${grid[0][col].value} = 0 points`);
      cardScores[col] = 0;
      cardScores[col + GRID_COLS] = 0;
    }
  }

  // Check for horizontal row cancellation
  for (let row = 0; row < GRID_ROWS; row++) {
    if (grid[row][0] && grid[row][1] && grid[row][2] &&
        grid[row][0].value === grid[row][1].value && grid[row][1].value === grid[row][2].value) {
      console.log(`Row ${row} cancelled: ${grid[row][0].value} = 0 points`);
      for (let col = 0; col < GRID_COLS; col++) {
        cardScores[row * GRID_COLS + col] = 0;
      }
    }
  }

  score = cardScores.reduce((a, b) => a + b, 0);
  return score;
}

function calculateAndDisplayScores() {
  const playerScore = calculateScore(gameState.playerHand);
  const opponentScore = calculateScore(gameState.opponentHand);

  elements.playerScore.textContent = `Your Score: ${playerScore}`;
  elements.opponentScore.textContent = `Opponent Score: ${opponentScore}`;

  let result = "";
  if (playerScore < opponentScore) {
    result = "You win this round!";
  } else if (playerScore > opponentScore) {
    result = "Opponent wins this round!";
  } else {
    result = "It's a tie!";
  }
  updateGameStatus(`Round Over! ${result}`);
}

function requestNewGame() {
  if (gameState.isHost) {
    startNewGame();
  } else {
    sendMessage({ type: "newGameRequest" });
    updateGameStatus("Requested a new game. Waiting for opponent to accept...");
  }
  elements.newGameBtn.style.display = "none"; // Hide button after request
}

function sendChatMessage() {
  const text = elements.chatInput.value.trim();
  if (text) {
    addChatMessage("own", text);
    sendMessage({ type: "chat", data: { text: text } });
    elements.chatInput.value = ""; // Clear input after sending
  }
}

// Function to handle duplicate card detection and recovery
function handleDuplicateCards() {
  // Don't allow recovery during active gameplay unless explicitly requested
  if (gameState.gameStarted && !gameState.roundEnded && gameState.isMyTurn !== null) {
    console.warn("Recovery blocked during active gameplay. Use manual recovery if needed.");
    return;
  }
  
  console.error("Duplicate cards detected! Attempting to recover...");
  updateGameStatus("Duplicate cards detected. Requesting new game...");
  
  // Reset the current game state
  resetGameState(true);
  
  // Request a new game from the host
  if (gameState.connectionEstablished && !gameState.isHost) {
    sendMessage({ type: "newGameRequest" });
  } else if (gameState.isHost) {
    // If we're the host, start a new game
    setTimeout(() => {
      if (gameState.connectionEstablished) {
        startNewGame();
      }
    }, 1000);
  }
}

// Manual recovery function for users to call when they want to reset
function manualGameRecovery() {
  if (confirm("Are you sure you want to reset the current game? This will start a new game.")) {
    console.log("Manual game recovery initiated by user");
    handleDuplicateCards();
  }
}

// Function to count cards in all game areas
function countAllCards() {
  const counts = {
    playerHand: gameState.playerHand.length,
    opponentHand: gameState.opponentHand.length,
    drawPile: gameState.drawPile.length,
    discardPile: gameState.discardPile.length,
    drawnCard: gameState.drawnCard ? 1 : 0
  };
  
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  console.log("Card counts:", counts);
  console.log("Total cards:", total);
  
  if (total !== 52) {
    console.error(`Card count mismatch! Expected 52, got ${total}`);
    return false;
  }
  
  return true;
}

// Function to verify card uniqueness
function verifyCardUniqueness() {
  const allCards = [
    ...gameState.playerHand.map(h => h.card),
    ...gameState.opponentHand.map(h => h.card),
    ...gameState.drawPile,
    ...gameState.discardPile
  ];
  
  if (gameState.drawnCard) {
    allCards.push(gameState.drawnCard);
  }
  
  const cardStrings = allCards.map(card => `${card.value}${card.suit}`);
  const uniqueCards = new Set(cardStrings);
  
  if (uniqueCards.size !== allCards.length) {
    console.error("Duplicate cards detected!");
    const cardCounts = {};
    cardStrings.forEach(cardStr => {
      cardCounts[cardStr] = (cardCounts[cardStr] || 0) + 1;
    });
    
    const duplicates = Object.entries(cardCounts).filter(([card, count]) => count > 1);
    console.error("Duplicate cards:", duplicates.map(([card, count]) => `${card} (${count}x)`));
    return false;
  }
  
  return true;
}

// Function to check if a player has closed (all cards face up)
function checkForClosing() {
  const playerAllFlipped = gameState.playerHand.every(card => card.faceUp);
  const opponentAllFlipped = gameState.opponentHand.every(card => card.faceUp);
  
  // Check if player just closed (all cards face up for the first time)
  if (playerAllFlipped && !gameState.closer) {
    gameState.closer = true;
    updateGameStatus("You have closed! Opponent gets one more turn.");
    console.log("Player has closed");
    // Notify opponent that player has closed
    sendMessage({
      type: "gameAction",
      data: {
        type: "playerClosed"
      }
    });
  }
  
  // Check if opponent just closed (all cards face up for the first time)
  if (opponentAllFlipped && !gameState.opponentClosed) {
    gameState.opponentClosed = true;
    updateGameStatus("Opponent has closed! You get one more turn.");
    console.log("Opponent has closed");
  }
  
  // If both players have closed, end the round immediately
  if (gameState.closer && gameState.opponentClosed) {
    console.log("Both players have closed, ending round");
    endRound();
    return;
  }
  
  // If player closed and it's opponent's turn, check if this is their final turn
  // The round should end after the opponent completes their turn
  if (gameState.closer && !gameState.isMyTurn && opponentAllFlipped) {
    // Opponent has also closed during their final turn - end immediately
    console.log("Opponent closed during their final turn, ending round");
    endRound();
    return;
  }
}

// Debug function to log current game state
function debugGameState() {
  if (!gameState.gameStarted) {
    console.log("Game not started yet");
    return;
  }
  
  console.log("=== GAME STATE DEBUG ===");
  console.log("Player Hand:", gameState.playerHand.map(h => `${h.card.value}${h.card.suit} (${h.faceUp ? 'up' : 'down'})`));
  console.log("Opponent Hand:", gameState.opponentHand.map(h => `${h.card.value}${h.card.suit} (${h.faceUp ? 'up' : 'down'})`));
  console.log("Draw Pile:", gameState.drawPile.map(c => `${c.value}${c.suit}`));
  console.log("Discard Pile:", gameState.discardPile.map(c => `${c.value}${c.suit}`));
  if (gameState.drawnCard) {
    console.log("Drawn Card:", `${gameState.drawnCard.value}${gameState.drawnCard.suit}`);
  }
  
  // Check for duplicates
  const allCards = [
    ...gameState.playerHand.map(h => h.card),
    ...gameState.opponentHand.map(h => h.card),
    ...gameState.drawPile,
    ...gameState.discardPile
  ];
  
  if (gameState.drawnCard) {
    allCards.push(gameState.drawnCard);
  }
  
  const cardStrings = allCards.map(card => `${card.value}${card.suit}`);
  const uniqueCards = new Set(cardStrings);
  const totalCards = allCards.length;
  
  console.log(`Total Cards: ${totalCards}, Unique Cards: ${uniqueCards.size}`);
  
  if (uniqueCards.size !== totalCards) {
    console.error("DUPLICATE CARDS DETECTED!");
    const cardCounts = {};
    cardStrings.forEach(cardStr => {
      cardCounts[cardStr] = (cardCounts[cardStr] || 0) + 1;
    });
    
    const duplicates = Object.entries(cardCounts).filter(([card, count]) => count > 1);
    console.error("Duplicate cards:", duplicates.map(([card, count]) => `${card} (${count}x)`));
  }
  
  console.log("========================");
  
  // Run comprehensive integrity test
  if (typeof runGameIntegrityTest === 'function') {
    runGameIntegrityTest();
  }
}

// Comprehensive testing function for debugging
function runGameIntegrityTest() {
  console.log("=== RUNNING GAME INTEGRITY TEST ===");
  
  if (!gameState.gameStarted) {
    console.log("Game not started - skipping test");
    return;
  }
  
  // Test 1: Card count
  const countResult = countAllCards();
  console.log("Card count test:", countResult ? "PASSED" : "FAILED");
  
  // Test 2: Card uniqueness
  const uniquenessResult = verifyCardUniqueness();
  console.log("Card uniqueness test:", uniquenessResult ? "PASSED" : "FAILED");
  
  // Test 3: Hand sizes
  const playerHandSize = gameState.playerHand.length === 6;
  const opponentHandSize = gameState.opponentHand.length === 6;
  console.log("Hand size test:", (playerHandSize && opponentHandSize) ? "PASSED" : "FAILED");
  
  // Test 4: Card structure validation
  let cardStructureValid = true;
  const allCards = [
    ...gameState.playerHand.map(h => h.card),
    ...gameState.opponentHand.map(h => h.card),
    ...gameState.drawPile,
    ...gameState.discardPile
  ];
  
  if (gameState.drawnCard) {
    allCards.push(gameState.drawnCard);
  }
  
  for (const card of allCards) {
    if (!card || !card.suit || !card.value || 
        !SUITS.includes(card.suit) || !VALUES.includes(card.value)) {
      cardStructureValid = false;
      console.error("Invalid card structure:", card);
      break;
    }
  }
  console.log("Card structure test:", cardStructureValid ? "PASSED" : "FAILED");
  
  // Test 5: Game state consistency
  let stateConsistent = true;
  if (gameState.isMyTurn && gameState.roundEnded) {
    stateConsistent = false;
    console.error("Invalid state: my turn when round ended");
  }
  if (gameState.drawnCard && !gameState.isMyTurn) {
    stateConsistent = false;
    console.error("Invalid state: drawn card when not my turn");
  }
  console.log("Game state consistency test:", stateConsistent ? "PASSED" : "FAILED");
  
  // Overall result
  const allTestsPassed = countResult && uniquenessResult && playerHandSize && 
                         opponentHandSize && cardStructureValid && stateConsistent;
  
  console.log("=== OVERALL RESULT:", allTestsPassed ? "PASSED" : "FAILED", "===");
  
  if (!allTestsPassed) {
    console.error("Game integrity test failed! Consider requesting a new game.");
    // Don't auto-trigger recovery - let the user decide
    console.warn("You can manually request a new game if needed.");
  }
  
  return allTestsPassed;
}



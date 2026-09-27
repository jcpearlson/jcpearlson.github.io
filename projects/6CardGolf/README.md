# 6-Card Golf

A two-player, browser-based version of the card game Golf, played peer to
peer over WebRTC with in-game chat. Live at
[joshpearlson.com/projects/6CardGolf/](https://joshpearlson.com/projects/6CardGolf/index.html).
The rules are on the game's start screen.

## Connecting

There is no signalling server, so the players swap connection codes by hand:

1. Player 1 clicks **Create Game**, then **Generate Offer Code**, and sends the code to player 2.
2. Player 2 clicks **Join Game**, pastes the offer and clicks **Create Answer Code**, then sends that code back.
3. Player 1 pastes the answer and confirms. The data channel opens and the host deals.

Public Google STUN servers are used for NAT traversal; there is no TURN
relay, so some restrictive networks cannot connect.

## Files

| File | Contents |
| --- | --- |
| `index.html` | Rules, connection screens and the game board |
| `webrtc.js` | Shared `gameState`, the peer connection, data channel, heartbeat and message routing |
| `6cardgolf.js` | Deck, dealing, turns, scoring, and state validation and recovery |
| `6cardgolfUI.js` | Rendering the hands and piles, buttons, chat and keyboard shortcuts |
| `style.css` | Layout and theme |

The scripts are plain globals loaded in that order; there is no build step.

## Debugging

- Add `?debug` to the URL to log connection steps, received actions and dealing to the console.
- <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> prints the current game state.
- <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> runs the card-count, uniqueness and state-consistency checks.

Errors and warnings always log.

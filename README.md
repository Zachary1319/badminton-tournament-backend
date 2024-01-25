# Badminton Tournament Backend

This Node.js backend serves as the API for a Badminton Tournament management application. It handles the logic for accepting match results, calculating player rankings, and generating pairings for subsequent rounds based on the rules of the tournament.

## Features

- Accepts match results from a React frontend.
- Processes match results to calculate player scores and rankings.
- Generates pairings for the next round of matches, ensuring no repeat matches and considering score differences.

## Setup

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.

## Running the Server

Execute `npm start` to start the server.

## API Endpoints

- `POST /matches/results`: Accepts match results and stores them for the current session. Returns a unique match ID for reference.
- `GET /matches/rankings/:matchId`: Returns player rankings for a specific match session, identified by `matchId`.
- `GET /matches/pairings/:matchId`: Generates and returns pairings for the next round based on the match results associated with the provided `matchId`.

## Development

This project is built using:

- Node.js
- Express for the API framework.

## Testing

Run `npm test` to execute unit tests.




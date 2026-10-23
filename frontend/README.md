# CrackerHub frontend

## Run locally

Use Node.js 20.19+ or 22.12+.

1. Install the frontend dependencies with `npm install`.
2. Start the backend on port `5000` (see the backend setup instructions).
3. Start the frontend with `npm run dev` and open the URL printed by Vite.

The Vite development server proxies `/api` requests to `http://localhost:5000`.
For a backend hosted at a different URL, set `VITE_API_URL` to its API base URL
(for example, `https://api.example.com/api`) before building or starting Vite.

## Checks

- `npm run build` creates the production frontend in `dist`.
- `npm run lint` runs Oxlint.

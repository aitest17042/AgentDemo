<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/039d0cc4-e624-4d39-9f44-715f8701da5a

## Run Locally

**Prerequisites:**  Node.js

## What Changed

- The chat assistant now supports richer business banking workflows, including account opening, transfers, payroll setup, working-capital financing, collections and reconciliation, FX hedging, and surplus-cash investment planning.
- Public market lookups such as stock prices now trigger more proactive follow-up suggestions. For example, checking a stock price can lead into an investment-planning workflow.
- Non-public conversation drafts and workflow summaries are saved locally when the app runs through Vite. By default the React app writes to `local-data/agent-state.json` inside this repo.
- The standalone fallback keeps the same workflow logic and falls back to browser local storage when it cannot write to the workspace directly, such as under `file:`.


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

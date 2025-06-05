# VeriCare

## Prerequisites
- Python 3.11+
- Node.js 18+

## Setup
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Running the Backend
Start the FastAPI server:
```bash
uvicorn server:app --reload
```

## Running the Frontend
From the `frontend` directory:
```bash
npm run dev
```

This will start the Vite development server.

Make sure environment variables such as OpenAI API keys and Composio API keys are available so the crawler and AI features work correctly.

# VeriCare

This repository contains a simple pipeline (`samplepipeline.py`) and a FastAPI server for analyzing medical bills using AI models.

## Setup

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

`OPENAI_API_KEY` is required for OCR with OpenAI and `OPENROUTER_API_KEY` is used for web-based analysis via Perplexity's Sonar Deep Research model on OpenRouter. Both variables must be defined for the pipeline to run correctly.

## Running

To test the pipeline directly:

```bash
python samplepipeline.py
```

Or start the server:

```bash
uvicorn server:app --reload
```


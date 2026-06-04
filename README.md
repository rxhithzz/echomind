# Project Echo – AI Module

A RAG-powered digital clone of an expert's knowledge.

## Stack
| Layer | Technology |
|---|---|
| API | FastAPI |
| Orchestration | LangChain |
| LLM | Ollama (Llama 3.2 local) |
| Embeddings | Ollama nomic-embed-text |
| Vector DB | ChromaDB (persistent) |

---

## Prerequisites

### 1. Install Ollama

**Windows (your setup):**
1. Go to https://ollama.com/download and download the Windows installer
2. Run `OllamaSetup.exe` and complete the installation
3. After install, **close and reopen PowerShell** so `ollama` is on your PATH
4. Verify it works: `ollama --version`

**macOS / Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull required models
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 3. Start Ollama server
```bash
ollama serve
# Runs on http://localhost:11434 by default
```

---

## Setup

```bash
# Clone / enter the project directory
cd project_echo

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env
```

---

## Run the server

```bash
python main.py
# API available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

---

## API Usage

### Upload a document
```bash
curl -X POST http://localhost:8000/ingest \
  -F "file=@lecture_notes.pdf"
```

**Response:**
```json
{
  "message": "Document ingested successfully.",
  "source": "lecture_notes",
  "pages_loaded": 12,
  "chunks_stored": 47
}
```

---

### Ask a question
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the difference between supervised and unsupervised learning?",
    "expert_name": "Prof. Smith",
    "top_k": 5
  }'
```

**Response:**
```json
{
  "question": "What is the difference between ...",
  "answer": "ANSWER:\nSupervised learning uses labeled data ...\n\nSOURCES:\n- lecture_notes, page 3",
  "sources": [
    { "source": "lecture_notes", "page": 3, "relevance_score": 0.87 }
  ],
  "response_time_s": 3.2,
  "chunks_used": 5
}
```

---

### List ingested documents
```bash
curl http://localhost:8000/documents
```

### Clear all documents
```bash
curl -X DELETE "http://localhost:8000/documents?confirm=true"
```

---

## Project Structure

```
project_echo/
├── main.py                  # Entry point
├── config.py                # Settings (reads .env)
├── requirements.txt
├── .env.example
│
├── api/
│   └── main.py              # FastAPI routes
│
├── ingestion/
│   └── service.py           # Load → Clean → Chunk → Embed → Store
│
├── retrieval/
│   ├── engine.py            # Semantic search
│   └── rag_chain.py         # Full RAG orchestration
│
├── prompts/
│   └── builder.py           # Expert persona prompt templates
│
└── vectorstore/
    └── store.py             # ChromaDB singleton
```

---

## Swapping the LLM

Edit `.env`:
```
LLM_MODEL=mistral          # or llama3.1, gemma2, phi3, etc.
```
Then run `ollama pull <model-name>` first.

---

## Tuning chunking / retrieval

| Setting | Default | Effect |
|---|---|---|
| `CHUNK_SIZE` | 800 | Larger = more context per chunk |
| `CHUNK_OVERLAP` | 100 | Higher = less information loss at boundaries |
| `TOP_K` | 5 | More chunks = richer context, slower response |

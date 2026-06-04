from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    llm_model: str = "llama3.2"
    embedding_model: str = "nomic-embed-text"

    # ChromaDB
    chroma_persist_dir: str = "./vectorstore/chroma_db"
    chroma_collection_name: str = "project_echo"

    # Chunking
    chunk_size: int = 800
    chunk_overlap: int = 100

    # Retrieval
    top_k: int = 5

    # Uploads
    upload_dir: str = "./uploads"

    # Student data
    student_data_dir: str = "./student_data"

    # Whisper model size: tiny, base, small, medium, large
    whisper_model: str = "base"

    class Config:
        env_file = ".env"


settings = Settings()

for d in [settings.upload_dir, settings.chroma_persist_dir, settings.student_data_dir]:
    Path(d).mkdir(parents=True, exist_ok=True)

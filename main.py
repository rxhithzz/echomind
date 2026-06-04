"""
main.py — project root entry point
Run with:  python main.py
Or:        uvicorn main:app --reload
"""
import uvicorn
from api.main import app  # noqa: F401  (re-export so uvicorn can find it)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )

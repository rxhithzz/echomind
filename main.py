# ============================================================
# EchoMind API - main.py
# ============================================================

# ============================================================
# SECTION 1: IMPORTS
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware        # ← NEW
from pydantic import BaseModel
from typing import List


# ============================================================
# SECTION 2: APP INSTANCE + CORS
# ============================================================

app = FastAPI(
    title="EchoMind API",
    description="AI-powered personalized learning backend",
    version="1.0.0"
)

# ---- CORS Configuration ----                             # ← NEW
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SECTION 3: PYDANTIC MODELS
# ============================================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AssessmentRequest(BaseModel):
    student_name: str
    algebra_score: float
    functions_score: float
    limits_score: float

class StudyPlanRequest(BaseModel):
    student_name: str
    weak_topics: List[str]


# ============================================================
# SECTION 4: ENDPOINTS (unchanged)
# ============================================================

@app.get("/")
def read_root():
    return {
        "message": "Welcome to EchoMind API",
        "status": "running"
    }

@app.post("/register")
def register_user(data: RegisterRequest):
    return {
        "success": True,
        "message": f"User '{data.name}' registered successfully!",
        "user": {
            "name": data.name,
            "email": data.email,
            "role": data.role
        }
    }

@app.post("/login")
def login_user(data: LoginRequest):
    return {
        "success": True,
        "message": "Login successful"
    }

@app.post("/assessment")
def assess_student(data: AssessmentRequest):

    weak_topics: List[str] = []

    if data.algebra_score < 50:
        weak_topics.append("Algebra")

    if data.functions_score < 50:
        weak_topics.append("Functions")

    if data.limits_score < 50:
        weak_topics.append("Limits")

    if len(weak_topics) == 0:
        message = "Great job! No learning gaps detected."
    else:
        message = "Learning gaps detected"

    return {
        "student": data.student_name,
        "weak_topics": weak_topics,
        "message": message
    }

@app.post("/study-plan")
def generate_study_plan(data: StudyPlanRequest):

    topic_resources = {
        "Algebra": [
            "Revise Algebra Basics",
            "Practice Algebra Problems"
        ],
        "Functions": [
            "Learn Function Concepts",
            "Solve Function Exercises"
        ],
        "Limits": [
            "Learn Limits Fundamentals",
            "Solve Limits Exercises"
        ]
    }

    study_plan: List[str] = []

    for topic in data.weak_topics:
        if topic in topic_resources:
            tasks = topic_resources[topic]
            for task in tasks:
                study_plan.append(task)

    return {
        "student": data.student_name,
        "study_plan": study_plan
    }
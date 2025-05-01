from pydantic import BaseModel
from typing import Dict

# Pydantic models for request validation
class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # Optional: only include if users can choose their role on signup

class UserLogin(BaseModel):
    username: str
    password: str

# Regular Python class used internally
class User:
    def __init__(self, username: str, hashed_password: str, role: str):
        self.username = username
        self.hashed_password = hashed_password
        self.role = role

# Temporary in-memory DB
users_db: Dict[str, User] = {}

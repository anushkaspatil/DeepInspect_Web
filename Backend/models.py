from pydantic import BaseModel
from typing import Dict

class User:
    def __init__(self, username: str, hashed_password: str, role: str):
        self.username = username
        self.hashed_password = hashed_password
        self.role = role

# Temporary in-memory DB
users_db: Dict[str, User] = {}

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database_users import SessionLocal, engine
from models.users import User, UserRole
import bcrypt

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    fullname: str
    email: EmailStr
    phone: str
    password: str  # optional, or auto-generated
    role: UserRole

@router.post("/create_user")
def create_user(user: UserCreate):
    db: Session = SessionLocal()

    # Check if email or username already exists
    existing_user = db.query(User).filter((User.email == user.email) | (User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash the password
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Create user entry
    db_user = User(
        username=user.username,
        fullname=user.fullname,
        email=user.email,
        password_hash=hashed_pw,
        role=user.role,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.close()
    return {"message": "User created successfully", "user": db_user.username}

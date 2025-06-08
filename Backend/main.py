import os
import time
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from dotenv import load_dotenv

from schemas import UserCreate, UserLogin, users_db, User
from passlib.hash import bcrypt

# --- Configuration ---
# Load environment variables from the .env file
load_dotenv()

# Application JWT settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Metabase settings
METABASE_SITE_URL = os.getenv("METABASE_SITE_URL")
METABASE_SECRET_KEY = os.getenv("METABASE_SECRET_KEY")

app = FastAPI()

# --- Middleware ---
# Enable CORS to allow your React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Add your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Security and Authentication Dependencies ---
bearer_scheme = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Helper function to create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> User:
    """Dependency to get the current user from a JWT token."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = users_db.get(username)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_supervisor_role(current_user: User = Depends(get_current_user)):
    """Dependency to ensure the current user has the 'supervisor' role."""
    if current_user.role != "supervisor":
        raise HTTPException(status_code=403, detail="Not enough permissions. Supervisor role required.")
    return current_user

# --- API Endpoints ---
@app.post("/register")
def register(user: UserCreate):
    """Registers a new user."""
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = bcrypt.hash(user.password)
    # Ensure a user with role 'supervisor' can be created
    users_db[user.username] = User(username=user.username, hashed_password=hashed_password, role=user.role)
    return {"msg": f"User '{user.username}' registered successfully with role '{user.role}'"}

@app.post("/login")
def login(user: UserLogin):
    """
    Logs in a user and returns a JWT access token.
    THIS ENDPOINT IS UPDATED.
    """
    db_user = users_db.get(user.username)
    if not db_user or not bcrypt.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create the access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username, "role": db_user.role}, 
        expires_delta=access_token_expires
    )
    
    # Return the token and user role to the frontend
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}


# --- NEW METABASE ENDPOINT (SECURED) ---
@app.get("/api/metabase-dashboard-url", dependencies=[Depends(require_supervisor_role)])
def get_metabase_dashboard_url():
    """
    Generates a secure, signed URL for an embedded Metabase dashboard.
    This endpoint is protected and only accessible by users with the 'supervisor' role.
    """
    if not METABASE_SECRET_KEY or not METABASE_SITE_URL:
        raise HTTPException(
            status_code=500,
            detail="Metabase environment variables are not set on the server."
        )

    payload = {
        "resource": {"dashboard": 3},  # The ID of the dashboard to embed
        "params": {},
        "exp": round(time.time()) + (10 * 60)  # Expires in 10 minutes
    }

    token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")
    iframe_url = f"{METABASE_SITE_URL}/embed/dashboard/{token}#bordered=true&titled=true"
    
    return {"url": iframe_url}
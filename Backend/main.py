from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import UserCreate, UserLogin, users_db, User
from passlib.hash import bcrypt

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = bcrypt.hash(user.password)
    users_db[user.username] = User(user.username, hashed_password, user.role)
    return {"msg": "User registered successfully"}

@app.post("/login")
def login(user: UserLogin):
    db_user = users_db.get(user.username)
    if not db_user or not bcrypt.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"msg": "Login successful", "role": db_user.role}

@app.get("/users")
def get_users():
    return [{"username": u.username, "role": u.role} for u in users_db.values()]

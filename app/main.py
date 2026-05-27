from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pathlib import Path
from pydantic import BaseModel

app = FastAPI(title="Pokedex API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = DATA_DIR / "pokemon.db"

class LoginRequest(BaseModel):
    username: str
    password: str


def init_db():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DATABASE_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS pokemon (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
            """
        )

        cursor.execute("SELECT COUNT(*) FROM pokemon")
        if cursor.fetchone()[0] == 0:
            sample_data = [
                ("Pikachu", "Electric"),
                ("Charizard", "Fire"),
                ("Blastoise", "Water"),
            ]
            cursor.executemany(
                "INSERT INTO pokemon (name, type) VALUES (?, ?)", sample_data
            )

        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] == 0:
            cursor.executemany(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                [("admin", "1234"), ("usuarioP", "1234")],
            )


@app.on_event("startup")
async def startup():
    init_db()


@app.get("/")
async def root():
    return {"message": "Pokedex API - Bienvenido"}


@app.get("/api/pokemon")
async def get_pokemon():
    with sqlite3.connect(DATABASE_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pokemon")
        pokemon = [dict(row) for row in cursor.fetchall()]
    return {"data": pokemon}


@app.post("/api/login")
async def login(login_request: LoginRequest):
    with sqlite3.connect(DATABASE_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT password FROM users WHERE username = ?",
            (login_request.username,),
        )
        row = cursor.fetchone()

    if not row or row[0] != login_request.password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return {"message": "Login correcto", "username": login_request.username}


@app.get("/health")
async def health():
    return {"status": "healthy"}
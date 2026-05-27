import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/gestorbecas")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String)
    password_hash = Column(String)
    full_name = Column(String)
    role = Column(String)
    active = Column(Boolean)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

users = [
    {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "email": "admin@gestorbecas.com",
        "password": "123456789",
        "full_name": "Administrador",
        "role": "admin",
        "active": True,
    },
    {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "email": "usuarioP@gestorbecas.com",
        "password": "123456789",
        "full_name": "Usuario Prueba",
        "role": "user",
        "active": True,
    },
]

with SessionLocal() as db:
    emails = [u["email"] for u in users]
    db.query(User).filter(User.email.in_(emails)).delete(synchronize_session=False)
    for u in users:
        hashed = pwd_context.hash(u["password"])
        user = User(
            id=u["id"],
            email=u["email"],
            password_hash=hashed,
            full_name=u["full_name"],
            role=u["role"],
            active=u["active"],
        )
        db.add(user)
    db.commit()
    print("Usuarios actualizados correctamente")

    results = db.query(User.email, User.password_hash).filter(User.email.in_(emails)).all()
    for email, ph in results:
        print(email, ph)

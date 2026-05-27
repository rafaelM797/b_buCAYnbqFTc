from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, Numeric, Text, ForeignKey, Date, text, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, date
from typing import Optional
import uuid, os, time

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/gestorbecas")

engine = None
SessionLocal = None

for attempt in range(5):
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ BD conectada")
        break
    except Exception as e:
        print(f"Intento {attempt + 1} fallido")
        if attempt < 4:
            time.sleep(5)

Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    full_name = Column(String(255))
    role = Column(String(50), default="user")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Estudiante(Base):
    __tablename__ = "estudiantes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(100), nullable=False)
    apellidos = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    telefono = Column(String(20))
    fecha_nacimiento = Column(Date)
    direccion = Column(Text)
    nivel_educativo = Column(String(50))
    institucion = Column(String(200))
    promedio = Column(Numeric(4,2))
    ingreso_familiar = Column(Numeric(12,2))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Beca(Base):
    __tablename__ = "becas"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(200), nullable=False)
    descripcion = Column(Text)
    tipo = Column(String(50), nullable=False)
    monto = Column(Numeric(12,2), nullable=False)
    requisitos = Column(Text)
    cupos_disponibles = Column(Integer, default=0)
    cupos_totales = Column(Integer, default=0)
    fecha_inicio = Column(DateTime)
    fecha_fin = Column(DateTime)
    activa = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Solicitud(Base):
    __tablename__ = "solicitudes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    estudiante_id = Column(UUID(as_uuid=True), ForeignKey("estudiantes.id"), nullable=False)
    beca_id = Column(UUID(as_uuid=True), ForeignKey("becas.id"), nullable=False)
    estado = Column(String(30), default="pendiente")
    fecha_solicitud = Column(DateTime, default=datetime.utcnow)
    fecha_resolucion = Column(DateTime)
    comentarios = Column(Text)
    documentos_adjuntos = Column(ARRAY(Text))
    puntuacion = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    class Config:
        from_attributes = True

class EstudianteCreate(BaseModel):
    nombre: str
    apellidos: str
    email: str
    telefono: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    direccion: Optional[str] = None
    nivel_educativo: Optional[str] = None
    institucion: Optional[str] = None
    promedio: Optional[float] = None
    ingreso_familiar: Optional[float] = None

class BecaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    tipo: str
    monto: float
    requisitos: Optional[str] = None
    cupos_disponibles: Optional[int] = 0
    cupos_totales: Optional[int] = 0
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    activa: Optional[bool] = True

class SolicitudCreate(BaseModel):
    estudiante_id: str
    beca_id: str
    comentarios: Optional[str] = None
    documentos_adjuntos: Optional[list[str]] = None
    puntuacion: Optional[int] = None

class SolicitudUpdate(BaseModel):
    estado: Optional[str] = None
    comentarios: Optional[str] = None
    puntuacion: Optional[int] = None

app = FastAPI(title="GestorBecas API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    if SessionLocal is None:
        raise HTTPException(status_code=503, detail="BD no disponible")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup():
    if engine:
        Base.metadata.create_all(bind=engine)
        print("✅ Tablas creadas")

@app.post("/api/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return {
        "id": str(db_user.id),
        "email": db_user.email,
        "role": db_user.role,
        "full_name": db_user.full_name
    }

def estudiante_to_response(estudiante: Estudiante):
    return {
        "id": str(estudiante.id),
        "nombre": estudiante.nombre,
        "apellidos": estudiante.apellidos,
        "email": estudiante.email,
        "telefono": estudiante.telefono,
        "fecha_nacimiento": estudiante.fecha_nacimiento.isoformat() if estudiante.fecha_nacimiento else None,
        "direccion": estudiante.direccion,
        "nivel_educativo": estudiante.nivel_educativo,
        "institucion": estudiante.institucion,
        "promedio": float(estudiante.promedio) if estudiante.promedio is not None else None,
        "ingreso_familiar": float(estudiante.ingreso_familiar) if estudiante.ingreso_familiar is not None else None,
        "created_at": estudiante.created_at.isoformat() if estudiante.created_at else None,
        "updated_at": estudiante.updated_at.isoformat() if estudiante.updated_at else None,
    }

def beca_to_response(beca: Beca):
    return {
        "id": str(beca.id),
        "nombre": beca.nombre,
        "descripcion": beca.descripcion,
        "tipo": beca.tipo,
        "monto": float(beca.monto) if beca.monto is not None else 0,
        "requisitos": beca.requisitos,
        "cupos_disponibles": beca.cupos_disponibles,
        "cupos_totales": beca.cupos_totales,
        "fecha_inicio": beca.fecha_inicio.isoformat() if beca.fecha_inicio else None,
        "fecha_fin": beca.fecha_fin.isoformat() if beca.fecha_fin else None,
        "activa": beca.activa,
        "created_at": beca.created_at.isoformat() if beca.created_at else None,
        "updated_at": beca.updated_at.isoformat() if beca.updated_at else None,
    }

def solicitud_to_response(solicitud: Solicitud, estudiante: Estudiante = None, beca: Beca = None):
    base = {
        "id": str(solicitud.id),
        "estudiante_id": str(solicitud.estudiante_id),
        "beca_id": str(solicitud.beca_id),
        "estado": solicitud.estado,
        "fecha_solicitud": solicitud.fecha_solicitud.isoformat() if solicitud.fecha_solicitud else None,
        "fecha_resolucion": solicitud.fecha_resolucion.isoformat() if solicitud.fecha_resolucion else None,
        "comentarios": solicitud.comentarios,
        "documentos_adjuntos": solicitud.documentos_adjuntos or [],
        "puntuacion": solicitud.puntuacion,
        "created_at": solicitud.created_at.isoformat() if solicitud.created_at else None,
        "updated_at": solicitud.updated_at.isoformat() if solicitud.updated_at else None,
    }

    if estudiante:
        base["estudiantes"] = estudiante_to_response(estudiante)
    if beca:
        base["becas"] = beca_to_response(beca)

    return base

@app.get("/api/estudiantes")
def list_estudiantes(db: Session = Depends(get_db)):
    limit = 50
    estudiantes = db.query(Estudiante).limit(limit).all()
    return {
        "total": db.query(Estudiante).count(),
        "data": [estudiante_to_response(e) for e in estudiantes]
    }

@app.post("/api/estudiantes")
def create_estudiante(estudiante: EstudianteCreate, db: Session = Depends(get_db)):
    db_estudiante = Estudiante(
        nombre=estudiante.nombre,
        apellidos=estudiante.apellidos,
        email=estudiante.email,
        telefono=estudiante.telefono,
        fecha_nacimiento=estudiante.fecha_nacimiento,
        direccion=estudiante.direccion,
        nivel_educativo=estudiante.nivel_educativo,
        institucion=estudiante.institucion,
        promedio=estudiante.promedio,
        ingreso_familiar=estudiante.ingreso_familiar,
    )
    db.add(db_estudiante)
    db.commit()
    db.refresh(db_estudiante)
    return estudiante_to_response(db_estudiante)

@app.put("/api/estudiantes/{estudiante_id}")
def update_estudiante(estudiante_id: str, estudiante: EstudianteCreate, db: Session = Depends(get_db)):
    db_estudiante = db.query(Estudiante).filter(Estudiante.id == estudiante_id).first()
    if not db_estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    db_estudiante.nombre = estudiante.nombre
    db_estudiante.apellidos = estudiante.apellidos
    db_estudiante.email = estudiante.email
    db_estudiante.telefono = estudiante.telefono
    db_estudiante.fecha_nacimiento = estudiante.fecha_nacimiento
    db_estudiante.direccion = estudiante.direccion
    db_estudiante.nivel_educativo = estudiante.nivel_educativo
    db_estudiante.institucion = estudiante.institucion
    db_estudiante.promedio = estudiante.promedio
    db_estudiante.ingreso_familiar = estudiante.ingreso_familiar
    db.commit()
    db.refresh(db_estudiante)
    return estudiante_to_response(db_estudiante)

@app.delete("/api/estudiantes/{estudiante_id}")
def delete_estudiante(estudiante_id: str, db: Session = Depends(get_db)):
    db_estudiante = db.query(Estudiante).filter(Estudiante.id == estudiante_id).first()
    if not db_estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    db.delete(db_estudiante)
    db.commit()
    return {"message": "Estudiante eliminado correctamente"}

@app.get("/api/becas")
def list_becas(db: Session = Depends(get_db)):
    becas = db.query(Beca).filter(Beca.activa == True).limit(50).all()
    return {
        "total": db.query(Beca).filter(Beca.activa == True).count(),
        "data": [beca_to_response(b) for b in becas]
    }

@app.post("/api/becas")
def create_beca(beca: BecaCreate, db: Session = Depends(get_db)):
    db_beca = Beca(
        nombre=beca.nombre,
        descripcion=beca.descripcion,
        tipo=beca.tipo,
        monto=beca.monto,
        requisitos=beca.requisitos,
        cupos_disponibles=beca.cupos_disponibles or 0,
        cupos_totales=beca.cupos_totales or 0,
        fecha_inicio=beca.fecha_inicio,
        fecha_fin=beca.fecha_fin,
        activa=beca.activa,
    )
    db.add(db_beca)
    db.commit()
    db.refresh(db_beca)
    return beca_to_response(db_beca)

@app.get("/api/becas/{beca_id}")
def get_beca(beca_id: str, db: Session = Depends(get_db)):
    beca = db.query(Beca).filter(Beca.id == beca_id).first()
    if not beca:
        raise HTTPException(status_code=404, detail="Beca no encontrada")
    return beca_to_response(beca)

@app.put("/api/becas/{beca_id}")
def update_beca(beca_id: str, beca: BecaCreate, db: Session = Depends(get_db)):
    db_beca = db.query(Beca).filter(Beca.id == beca_id).first()
    if not db_beca:
        raise HTTPException(status_code=404, detail="Beca no encontrada")

    db_beca.nombre = beca.nombre
    db_beca.descripcion = beca.descripcion
    db_beca.tipo = beca.tipo
    db_beca.monto = beca.monto
    db_beca.requisitos = beca.requisitos
    db_beca.cupos_disponibles = beca.cupos_disponibles or 0
    db_beca.cupos_totales = beca.cupos_totales or 0
    db_beca.fecha_inicio = beca.fecha_inicio
    db_beca.fecha_fin = beca.fecha_fin
    db_beca.activa = beca.activa
    db.commit()
    db.refresh(db_beca)
    return beca_to_response(db_beca)

@app.delete("/api/becas/{beca_id}")
def delete_beca(beca_id: str, db: Session = Depends(get_db)):
    db_beca = db.query(Beca).filter(Beca.id == beca_id).first()
    if not db_beca:
        raise HTTPException(status_code=404, detail="Beca no encontrada")

    db.delete(db_beca)
    db.commit()
    return {"message": "Beca eliminada correctamente"}

@app.get("/api/solicitudes")
def list_solicitudes(limit: Optional[int] = 50, estado: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Solicitud, Estudiante, Beca)
    query = query.join(Estudiante, Solicitud.estudiante_id == Estudiante.id)
    query = query.join(Beca, Solicitud.beca_id == Beca.id)
    if estado:
        query = query.filter(Solicitud.estado == estado)
    query = query.order_by(Solicitud.fecha_solicitud.desc()).limit(limit)

    result = query.all()
    return {
        "data": [solicitud_to_response(sol, estudiante, beca) for sol, estudiante, beca in result]
    }

@app.post("/api/solicitudes")
def create_solicitud(solicitud: SolicitudCreate, db: Session = Depends(get_db)):
    beca = db.query(Beca).filter(Beca.id == solicitud.beca_id).first()
    if not beca:
        raise HTTPException(status_code=404, detail="Beca no encontrada")
    if not beca.activa:
        raise HTTPException(status_code=400, detail="La beca no está activa")

    existing = db.query(Solicitud).filter(
        Solicitud.estudiante_id == solicitud.estudiante_id,
        Solicitud.beca_id == solicitud.beca_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="El estudiante ya ha solicitado esta beca")

    db_solicitud = Solicitud(
        estudiante_id=uuid.UUID(solicitud.estudiante_id),
        beca_id=uuid.UUID(solicitud.beca_id),
        comentarios=solicitud.comentarios,
        documentos_adjuntos=solicitud.documentos_adjuntos,
        puntuacion=solicitud.puntuacion,
    )
    db.add(db_solicitud)
    db.commit()
    db.refresh(db_solicitud)

    estudiante = db.query(Estudiante).filter(Estudiante.id == db_solicitud.estudiante_id).first()
    return solicitud_to_response(db_solicitud, estudiante, beca)

@app.patch("/api/solicitudes/{solicitud_id}")
def update_solicitud(solicitud_id: str, payload: SolicitudUpdate, db: Session = Depends(get_db)):
    db_solicitud = db.query(Solicitud).filter(Solicitud.id == solicitud_id).first()
    if not db_solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    previous_estado = db_solicitud.estado
    if payload.estado:
        db_solicitud.estado = payload.estado
        if payload.estado in ("aprobada", "rechazada") and previous_estado != payload.estado:
            db_solicitud.fecha_resolucion = datetime.utcnow()

    if payload.comentarios is not None:
        db_solicitud.comentarios = payload.comentarios
    if payload.puntuacion is not None:
        db_solicitud.puntuacion = payload.puntuacion

    if previous_estado != "aprobada" and payload.estado == "aprobada":
        beca = db.query(Beca).filter(Beca.id == db_solicitud.beca_id).first()
        if beca and beca.cupos_disponibles > 0:
            beca.cupos_disponibles -= 1
    elif previous_estado == "aprobada" and payload.estado != "aprobada":
        beca = db.query(Beca).filter(Beca.id == db_solicitud.beca_id).first()
        if beca:
            beca.cupos_disponibles += 1

    db.commit()
    db.refresh(db_solicitud)
    estudiante = db.query(Estudiante).filter(Estudiante.id == db_solicitud.estudiante_id).first()
    beca = db.query(Beca).filter(Beca.id == db_solicitud.beca_id).first()
    return solicitud_to_response(db_solicitud, estudiante, beca)

@app.delete("/api/solicitudes/{solicitud_id}")
def delete_solicitud(solicitud_id: str, db: Session = Depends(get_db)):
    db_solicitud = db.query(Solicitud).filter(Solicitud.id == solicitud_id).first()
    if not db_solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    if db_solicitud.estado == "aprobada":
        beca = db.query(Beca).filter(Beca.id == db_solicitud.beca_id).first()
        if beca:
            beca.cupos_disponibles += 1

    db.delete(db_solicitud)
    db.commit()
    return {"message": "Solicitud eliminada correctamente"}

@app.get("/api/exportar")
def export_data(tipo: Optional[str] = "estudiantes", db: Session = Depends(get_db)):
    rows = []
    filename = "export.csv"
    headers = []

    if tipo == "estudiantes":
        rows = [estudiante_to_response(e) for e in db.query(Estudiante).order_by(Estudiante.created_at.desc()).all()]
        headers = ["ID", "Nombre", "Apellidos", "Email", "Telefono", "Fecha Nacimiento", "Direccion", "Nivel Educativo", "Institucion", "Promedio", "Ingreso Familiar", "Creado"]
        filename = "estudiantes.csv"
    elif tipo == "becas":
        rows = [beca_to_response(b) for b in db.query(Beca).order_by(Beca.created_at.desc()).all()]
        headers = ["ID", "Nombre", "Descripcion", "Tipo", "Monto", "Requisitos", "Cupos Disponibles", "Cupos Totales", "Fecha Inicio", "Fecha Fin", "Activa", "Creado"]
        filename = "becas.csv"
    elif tipo == "solicitudes":
        query = db.query(Solicitud, Estudiante, Beca)
        query = query.join(Estudiante, Solicitud.estudiante_id == Estudiante.id)
        query = query.join(Beca, Solicitud.beca_id == Beca.id)
        rows = [solicitud_to_response(sol, estudiante, beca) for sol, estudiante, beca in query.order_by(Solicitud.fecha_solicitud.desc()).all()]
        headers = ["ID", "Estudiante", "Email Estudiante", "Beca", "Tipo Beca", "Monto", "Estado", "Fecha Solicitud", "Fecha Resolucion", "Comentarios", "Puntuacion"]
        filename = "solicitudes.csv"
    else:
        raise HTTPException(status_code=400, detail="Tipo de exportación no válido")

    csv_rows = [",".join(headers)]
    for row in rows:
        if tipo == "solicitudes":
            values = [
                row["id"],
                f"{row.get('estudiantes', {}).get('nombre', '')} {row.get('estudiantes', {}).get('apellidos', '')}",
                row.get('estudiantes', {}).get('email', ""),
                row.get('becas', {}).get('nombre', ""),
                row.get('becas', {}).get('tipo', ""),
                str(row.get('becas', {}).get('monto', "")),
                row.get('estado', ""),
                row.get('fecha_solicitud', ""),
                row.get('fecha_resolucion', "") or "",
                (row.get('comentarios') or "").replace(",", ";"),
                str(row.get('puntuacion', "")),
            ]
        else:
            values = [str(row.get(header.lower().replace(" ", "_"), "")) for header in headers]
        csv_rows.append('"' + '","'.join(values) + '"')

    csv = "\n".join(csv_rows)
    return Response(csv, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})

@app.get("/api/estadisticas")
def get_estadisticas(db: Session = Depends(get_db)):
    total_estudiantes = db.query(Estudiante).count()
    total_becas = db.query(Beca).filter(Beca.activa == True).count()
    total_solicitudes = db.query(Solicitud).count()
    solicitudes_por_estado = {estado: 0 for estado in ["pendiente", "en_revision", "aprobada", "rechazada"]}
    for estado, count in db.query(Solicitud.estado, func.count(Solicitud.id)).group_by(Solicitud.estado).all():
        solicitudes_por_estado[estado] = count

    monto_total_aprobado = db.query(func.coalesce(func.sum(Beca.monto), 0)).join(Solicitud, Solicitud.beca_id == Beca.id).filter(Solicitud.estado == "aprobada").scalar() or 0

    solicitudes_por_tipo = {}
    for tipo, count in db.query(Beca.tipo, func.count(Solicitud.id)).join(Solicitud, Solicitud.beca_id == Beca.id).group_by(Beca.tipo).all():
        solicitudes_por_tipo[tipo] = count

    estudiantes_por_nivel = {}
    for nivel, count in db.query(Estudiante.nivel_educativo, func.count(Estudiante.id)).group_by(Estudiante.nivel_educativo).all():
        estudiantes_por_nivel[nivel] = count

    return {
        "totales": {
            "estudiantes": total_estudiantes,
            "becas": total_becas,
            "solicitudes": total_solicitudes,
            "becasActivas": total_becas,
            "montoTotalAprobado": float(monto_total_aprobado),
        },
        "solicitudesPorEstado": solicitudes_por_estado,
        "solicitudesPorTipo": solicitudes_por_tipo,
        "estudiantesPorNivel": estudiantes_por_nivel,
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



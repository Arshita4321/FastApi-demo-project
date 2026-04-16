from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, computed_field
from typing import Annotated, Literal, Optional, List
from sqlalchemy.orm import Session

import models
from database import engine, SessionLocal

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Patient Management API")

# ✅ CORS (restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ SCHEMAS ------------------

class Patient(BaseModel):
    id: str
    name: str
    city: str
    age: Annotated[int, Field(gt=0, lt=120)]
    gender: Literal['male', 'female', 'others']
    height: Annotated[float, Field(gt=0)]
    weight: Annotated[float, Field(gt=0)]

    @computed_field
    @property
    def bmi(self) -> float:
        return round(self.weight / ((self.height / 100) ** 2), 2)

    @computed_field
    @property
    def verdict(self) -> str:
        if self.bmi < 18.5:
            return "Underweight"
        elif self.bmi < 25:
            return "Normal"
        elif self.bmi < 30:
            return "Overweight"
        return "Obese"

    class Config:
        from_attributes = True   #  SQLAlchemy compatibility


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = Field(default=None, gt=0)
    gender: Optional[Literal['male', 'female', 'others']] = None
    height: Optional[float] = Field(default=None, gt=0)
    weight: Optional[float] = Field(default=None, gt=0)


# ------------------ DB DEPENDENCY ------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------ ROUTES ------------------

@app.get("/")
def home():
    return {"message": "Patient Management API with SQL 🚀"}


@app.get("/about")
def about():
    return {"message": "FastAPI + SQL + React Ready"}


# ------------------ CREATE ------------------

@app.post("/patients", status_code=201)
def create_patient(patient: Patient, db: Session = Depends(get_db)):

    existing = db.query(models.PatientDB).filter_by(id=patient.id).first()

    if existing:
        raise HTTPException(status_code=400, detail="Patient already exists")

    db_patient = models.PatientDB(**patient.model_dump(exclude=["bmi", "verdict"]))

    db.add(db_patient)
    db.commit()

    return {"message": "Patient created"}


# ------------------ VIEW ALL ------------------

@app.get("/patients", response_model=List[Patient])
def view_all(db: Session = Depends(get_db)):
    patients = db.query(models.PatientDB).all()
    return patients   #  automatic conversion


# ------------------ VIEW ONE ------------------

@app.get("/patients/{patient_id}", response_model=Patient)
def view_patient(patient_id: str, db: Session = Depends(get_db)):

    patient = db.query(models.PatientDB).filter_by(id=patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


# ------------------ UPDATE ------------------

@app.put("/patients/{patient_id}")
def update_patient(patient_id: str, update: PatientUpdate, db: Session = Depends(get_db)):

    patient = db.query(models.PatientDB).filter_by(id=patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(patient, key, value)

    db.commit()

    return {"message": "Patient updated"}


# ------------------ DELETE ------------------

@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: str, db: Session = Depends(get_db)):

    patient = db.query(models.PatientDB).filter_by(id=patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db.delete(patient)
    db.commit()

    return {"message": "Patient deleted"}


# ------------------ SORT ------------------

@app.get("/patients/sort", response_model=List[Patient])
def sort_patients(
    sort_by: str = Query(..., description="height or weight"),
    order: str = Query("asc"),
    db: Session = Depends(get_db)
):

    if sort_by not in ["height", "weight"]:
        raise HTTPException(status_code=400, detail="Invalid field")

    patients = db.query(models.PatientDB).all()

    reverse = True if order == "desc" else False

    return sorted(
        patients,
        key=lambda x: getattr(x, sort_by),
        reverse=reverse
    )
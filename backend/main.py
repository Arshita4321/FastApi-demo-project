from fastapi import FastAPI, HTTPException, Depends, Query, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, computed_field
from typing import Annotated, Literal, Optional
from sqlalchemy.orm import Session

import models
from database import engine, SessionLocal

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ SCHEMAS ------------------

class Patient(BaseModel):
    id: Annotated[str, Field(...)]
    name: str
    city: str
    age: Annotated[int, Field(gt=0, lt=120)]
    gender: Literal['male', 'female', 'others']
    height: Annotated[float, Field(gt=0)]
    weight: Annotated[float, Field(gt=0)]

    @computed_field
    @property
    def bmi(self) -> float:
        return round(self.weight / (self.height ** 2), 2)

    @computed_field
    @property
    def verdict(self) -> str:
        if self.bmi < 18.5:
            return "Underweight"
        elif self.bmi < 25:
            return "Normal"
        elif self.bmi < 30:
            return "Overweight"
        else:
            return "Obese"


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
    return {"message": "Patient Management API with SQL"}

@app.get("/about")
def about():
    return {"message": "Now powered with SQL database 🚀"}


# ------------------ CREATE ------------------

@app.post("/create")
def create_patient(patient: Patient, db: Session = Depends(get_db)):

    existing = db.query(models.PatientDB).filter(models.PatientDB.id == patient.id).first()

    if existing:
        raise HTTPException(status_code=400, detail="Patient already exists")

    db_patient = models.PatientDB(**patient.model_dump(exclude=["bmi", "verdict"]))

    db.add(db_patient)
    db.commit()

    return JSONResponse(status_code=201, content={"message": "Patient created"})


# ------------------ VIEW ALL ------------------

@app.get("/view")
def view_all(db: Session = Depends(get_db)):

    patients = db.query(models.PatientDB).all()

    result = []
    for p in patients:
        data = p.__dict__
        data.pop("_sa_instance_state", None)

        result.append(Patient(**data))

    return result


# ------------------ VIEW ONE ------------------

@app.get("/patient/{patient_id}")
def view_patient(patient_id: str, db: Session = Depends(get_db)):

    patient = db.query(models.PatientDB).filter(models.PatientDB.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Not found")

    data = patient.__dict__
    data.pop("_sa_instance_state", None)

    return Patient(**data)


# ------------------ UPDATE ------------------

@app.put("/edit/{patient_id}")
def update_patient(patient_id: str, update: PatientUpdate, db: Session = Depends(get_db)):

    patient = db.query(models.PatientDB).filter(models.PatientDB.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(patient, key, value)

    db.commit()

    return {"message": "Updated"}


# ------------------ DELETE ------------------

@app.delete("/delete/{patient_id}")
def delete_patient(patient_id: str, db: Session = Depends(get_db)):

    patient = db.query(models.PatientDB).filter(models.PatientDB.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(patient)
    db.commit()

    return {"message": "Deleted"}


# ------------------ SORT ------------------

@app.get("/sort")
def sort_patients(
    sort_by: str = Query(...),
    order: str = Query("asc"),
    db: Session = Depends(get_db)
):

    valid_fields = ["height", "weight"]

    if sort_by not in valid_fields:
        raise HTTPException(status_code=400, detail="Invalid field")

    patients = db.query(models.PatientDB).all()

    result = []
    for p in patients:
        data = p.__dict__
        data.pop("_sa_instance_state", None)
        result.append(Patient(**data))

    reverse = True if order == "desc" else False

    sorted_data = sorted(result, key=lambda x: getattr(x, sort_by), reverse=reverse)

    return sorted_data
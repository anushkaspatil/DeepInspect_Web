from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Set up the database connection
DATABASE_URL = "sqlite:///./defects.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the defect table model
class Defect(Base):
    __tablename__ = "defects"
    
    id = Column(Integer, primary_key=True, index=True)
    defect_type = Column(String, index=True)
    time = Column(String)
    item = Column(Integer)
    stream = Column(Integer)
    batch = Column(Integer)
    image_name = Column(String)

# Create the database table if it doesn't exist
def init_db():
    Base.metadata.create_all(bind=engine)

# Function to store defect in the database
def store_defect(defect_info):
    db = SessionLocal()
    db_defect = Defect(
        defect_type=defect_info["type"],
        time=defect_info["time"],
        item=defect_info["item"],
        stream=defect_info["stream"],
        batch=defect_info["batch"],
        image_name=defect_info["image_name"]
    )
    db.add(db_defect)
    db.commit()
    db.refresh(db_defect)
    db.close()

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from db import Base  

class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)  # Added max length and nullable=False
    content = Column(String, nullable=False)  # Added nullable=False

    def __repr__(self):
        return f"<Prompt(id={self.id}, title={self.title}, content={self.content})>"

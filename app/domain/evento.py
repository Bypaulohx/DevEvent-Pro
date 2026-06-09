from pydantic import BaseModel, Field

class Evento(BaseModel):
    nome: str = Field(min_length=3, max_length=120)
    descricao: str = ""

class EventoResponse(BaseModel):
    nome: str
    descricao: str
from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from sqlmodel import Field, SQLModel, UniqueConstraint


class InscricaoDB(SQLModel, table=True):
    __tablename__ = "inscricoes"
    __table_args__ = (UniqueConstraint("nome_participante", "evento"),)

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    nome_participante: str = Field(index=True, max_length=120)
    evento: str = Field(index=True, max_length=120)
    status_check_in: str = Field(default="pendente", index=True, max_length=20)
    criado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)

class EventoDB(SQLModel, table=True):
    __tablename__ = "eventos"
    nome: str = Field(primary_key=True, index=True, max_length=120)
    descricao: str = Field(default="", max_length=255)

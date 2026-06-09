from __future__ import annotations

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class StatusCheckIn(str, Enum):
    PENDENTE = "pendente"
    REALIZADO = "realizado"


class Inscricao(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    nome_participante: str = Field(min_length=3, max_length=120)
    evento: str = Field(min_length=3, max_length=120)
    status_check_in: StatusCheckIn = StatusCheckIn.PENDENTE
    criado_em: datetime | None = None


class CheckInRequest(BaseModel):
    nome_participante: str = Field(min_length=3, max_length=120)
    evento: str = Field(min_length=3, max_length=120)
    provedor_calendario: str = "ics"


class CheckInResponse(BaseModel):
    mensagem: str
    inscricao: Inscricao
    add_to_calendar: str | None = None

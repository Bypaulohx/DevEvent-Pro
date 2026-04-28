from __future__ import annotations

from fastapi import Depends

from app.infrastructure.notificadores import LogNotificador
from sqlmodel import Session

from app.infrastructure.db import get_session
from app.infrastructure.sql_repository import SQLiteInscricaoRepository
from app.interfaces.inscricao_repository import IInscricaoRepository
from app.interfaces.notificador import INotificador
from app.services.checkin_service import CheckInService

_notificador = LogNotificador()


def get_inscricao_repository(session: Session = Depends(get_session)) -> IInscricaoRepository:
    return SQLiteInscricaoRepository(session=session)


def get_notificador() -> INotificador:
    return _notificador


def get_checkin_service(
    inscricao_repository: IInscricaoRepository = Depends(get_inscricao_repository),
    notificador: INotificador = Depends(get_notificador),
) -> CheckInService:
    return CheckInService(
        inscricao_repository=inscricao_repository,
        notificador=notificador,
    )

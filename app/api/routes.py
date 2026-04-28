from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_checkin_service
from app.domain.inscricao import CheckInRequest, CheckInResponse, Inscricao
from app.services.checkin_service import CheckInJaRealizadoError, CheckInService

router = APIRouter(tags=["Check-in"])


@router.post(
    "/checkin",
    response_model=CheckInResponse,
    status_code=status.HTTP_200_OK,
    summary="Realiza o check-in de um participante",
)
def realizar_check_in(
    payload: CheckInRequest,
    service: CheckInService = Depends(get_checkin_service),
) -> CheckInResponse:
    try:
        inscricao = service.realizar_check_in(
            nome_participante=payload.nome_participante,
            evento=payload.evento,
        )
    except CheckInJaRealizadoError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    return CheckInResponse(
        mensagem="Check-in realizado com sucesso.",
        inscricao=inscricao,
    )


@router.get(
    "/checkins",
    response_model=list[Inscricao],
    status_code=status.HTTP_200_OK,
    summary="Lista todos os participantes com check-in realizado",
)
def listar_checkins(
    service: CheckInService = Depends(get_checkin_service),
) -> list[Inscricao]:
    return service.listar_checkins_realizados()

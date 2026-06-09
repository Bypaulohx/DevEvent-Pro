from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_checkin_service, get_evento_service
from app.domain.inscricao import CheckInRequest, CheckInResponse, Inscricao
from app.domain.evento import Evento, EventoResponse
from app.services.checkin_service import CheckInJaRealizadoError, CheckInService
from app.services.evento_service import EventoService
from app.services.calendar_factory import CalendarFactory

router = APIRouter(tags=["Check-in"])

@router.post(
    "/inscricao",
    response_model=CheckInResponse,
    summary="Compra/Inscrição em um evento",
)
def inscrever(payload: CheckInRequest, service: CheckInService = Depends(get_checkin_service)) -> CheckInResponse:
    try:
        inscricao = service.inscrever_participante(payload.nome_participante, payload.evento)
    except CheckInJaRealizadoError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return CheckInResponse(mensagem="Ingresso garantido com sucesso!", inscricao=inscricao)


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

    provider = CalendarFactory.get_provider(payload.provedor_calendario)
    link = provider.generate_calendar_link(payload.evento)

    return CheckInResponse(
        mensagem="Check-in realizado com sucesso.",
        inscricao=inscricao,
        add_to_calendar=link
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

@router.get("/eventos", response_model=list[EventoResponse], summary="Lista eventos disponíveis")
def listar_eventos(service: EventoService = Depends(get_evento_service)) -> list[EventoResponse]:
    return service.listar()

@router.post("/eventos", response_model=EventoResponse, summary="Adiciona um novo evento")
def criar_evento(evento: Evento, service: EventoService = Depends(get_evento_service)) -> EventoResponse:
    return service.criar(evento.nome, evento.descricao)

@router.delete("/eventos/{nome}", summary="Exclui um evento")
def excluir_evento(nome: str, service: EventoService = Depends(get_evento_service)) -> dict:
    service.excluir(nome)
    return {"mensagem": "Evento excluído"}

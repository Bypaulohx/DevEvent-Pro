from __future__ import annotations

from app.domain.inscricao import Inscricao, StatusCheckIn
from app.interfaces.inscricao_repository import IInscricaoRepository
from app.interfaces.notificador import INotificador


class CheckInJaRealizadoError(Exception):
    pass


class CheckInService:
    def __init__(
        self,
        inscricao_repository: IInscricaoRepository,
        notificador: INotificador,
    ) -> None:
        self._inscricao_repository = inscricao_repository
        self._notificador = notificador

    def realizar_check_in(self, nome_participante: str, evento: str) -> Inscricao:
        inscricao_existente = self._inscricao_repository.buscar_por_participante_evento(
            nome_participante=nome_participante,
            evento=evento,
        )

        if inscricao_existente and inscricao_existente.status_check_in == StatusCheckIn.REALIZADO:
            raise CheckInJaRealizadoError(
                "O check-in deste participante para este evento ja foi realizado."
            )

        inscricao = inscricao_existente or Inscricao(
            nome_participante=nome_participante,
            evento=evento,
        )
        inscricao.status_check_in = StatusCheckIn.REALIZADO

        inscricao_salva = self._inscricao_repository.salvar(inscricao)
        self._notificador.enviar_confirmacao(inscricao_salva)
        return inscricao_salva

    def listar_checkins_realizados(self) -> list[Inscricao]:
        return self._inscricao_repository.listar_checkins_realizados()

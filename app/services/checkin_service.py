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

    def inscrever_participante(self, nome_participante: str, evento: str) -> Inscricao:
        inscricao_existente = self._inscricao_repository.buscar_por_participante_evento(
            nome_participante=nome_participante,
            evento=evento,
        )
        if inscricao_existente:
            raise CheckInJaRealizadoError("Participante já possui ingresso para este evento.")
            
        nova = Inscricao(nome_participante=nome_participante, evento=evento, status_check_in=StatusCheckIn.PENDENTE)
        return self._inscricao_repository.salvar(nova)

    def realizar_check_in(self, nome_participante: str, evento: str) -> Inscricao:
        inscricao_existente = self._inscricao_repository.buscar_por_participante_evento(
            nome_participante=nome_participante,
            evento=evento,
        )
        
        if not inscricao_existente:
            raise CheckInJaRealizadoError("Inscrição não encontrada. Por favor, compre o ingresso primeiro.")
            
        if inscricao_existente.status_check_in == StatusCheckIn.REALIZADO:
            raise CheckInJaRealizadoError("O check-in deste participante para este evento já foi realizado.")
            
        inscricao_existente.status_check_in = StatusCheckIn.REALIZADO

        inscricao_salva = self._inscricao_repository.salvar(inscricao_existente)
        self._notificador.enviar_confirmacao(inscricao_salva)
        return inscricao_salva

    def listar_checkins_realizados(self) -> list[Inscricao]:
        return self._inscricao_repository.listar_checkins_realizados()

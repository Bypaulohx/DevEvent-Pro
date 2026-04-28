from __future__ import annotations

from typing import Protocol

from app.domain.inscricao import Inscricao


class IInscricaoRepository(Protocol):
    def buscar_por_participante_evento(
        self,
        nome_participante: str,
        evento: str,
    ) -> Inscricao | None:
        ...

    def salvar(self, inscricao: Inscricao) -> Inscricao:
        ...

    def listar_checkins_realizados(self) -> list[Inscricao]:
        ...

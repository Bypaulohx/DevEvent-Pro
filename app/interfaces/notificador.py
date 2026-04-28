from __future__ import annotations

from typing import Protocol

from app.domain.inscricao import Inscricao


class INotificador(Protocol):
    def enviar_confirmacao(self, inscricao: Inscricao) -> None:
        ...

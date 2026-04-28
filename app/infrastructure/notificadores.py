from __future__ import annotations

from app.domain.inscricao import Inscricao


class LogNotificador:
    def enviar_confirmacao(self, inscricao: Inscricao) -> None:
        print(
            "Confirmacao de check-in enviada:",
            f"participante={inscricao.nome_participante}",
            f"evento={inscricao.evento}",
            f"status={inscricao.status_check_in.value}",
        )


class EmailNotificador:
    def enviar_confirmacao(self, inscricao: Inscricao) -> None:
        raise NotImplementedError(
            "EmailNotificador esta preparado para implementacao futura."
        )

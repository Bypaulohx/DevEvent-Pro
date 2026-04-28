from __future__ import annotations

from app.domain.inscricao import Inscricao


class InMemoryInscricaoRepository:
    def __init__(self) -> None:
        self._inscricoes: dict[tuple[str, str], Inscricao] = {}

    def buscar_por_participante_evento(
        self,
        nome_participante: str,
        evento: str,
    ) -> Inscricao | None:
        chave = (nome_participante.strip().lower(), evento.strip().lower())
        return self._inscricoes.get(chave)

    def salvar(self, inscricao: Inscricao) -> Inscricao:
        chave = (
            inscricao.nome_participante.strip().lower(),
            inscricao.evento.strip().lower(),
        )
        self._inscricoes[chave] = inscricao
        return inscricao

    def listar_checkins_realizados(self) -> list[Inscricao]:
        return [
            inscricao
            for inscricao in self._inscricoes.values()
            if inscricao.status_check_in.value == "realizado"
        ]

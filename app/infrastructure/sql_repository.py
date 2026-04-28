from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from app.domain.inscricao import Inscricao, StatusCheckIn
from app.infrastructure.models import InscricaoDB


class SQLiteInscricaoRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _norm(texto: str) -> str:
        return texto.strip()

    def buscar_por_participante_evento(
        self,
        nome_participante: str,
        evento: str,
    ) -> Inscricao | None:
        nome_participante = self._norm(nome_participante)
        evento = self._norm(evento)
        stmt = select(InscricaoDB).where(
            InscricaoDB.nome_participante == nome_participante,
            InscricaoDB.evento == evento,
        )
        row = self._session.exec(stmt).first()
        if not row:
            return None
        return self._to_domain(row)

    def salvar(self, inscricao: Inscricao) -> Inscricao:
        inscricao.nome_participante = self._norm(inscricao.nome_participante)
        inscricao.evento = self._norm(inscricao.evento)
        stmt = select(InscricaoDB).where(
            InscricaoDB.nome_participante == inscricao.nome_participante,
            InscricaoDB.evento == inscricao.evento,
        )
        row = self._session.exec(stmt).first()

        if row:
            row.status_check_in = inscricao.status_check_in.value
            self._session.add(row)
            self._session.commit()
            self._session.refresh(row)
            return self._to_domain(row)

        novo = InscricaoDB(
            id=str(inscricao.id),
            nome_participante=inscricao.nome_participante,
            evento=inscricao.evento,
            status_check_in=inscricao.status_check_in.value,
        )
        self._session.add(novo)
        self._session.commit()
        self._session.refresh(novo)
        return self._to_domain(novo)

    def listar_checkins_realizados(self) -> list[Inscricao]:
        stmt = (
            select(InscricaoDB)
            .where(InscricaoDB.status_check_in == "realizado")
            .order_by(InscricaoDB.criado_em.desc())
        )
        rows = self._session.exec(stmt).all()
        return [self._to_domain(r) for r in rows]

    @staticmethod
    def _to_domain(row: InscricaoDB) -> Inscricao:
        return Inscricao(
            id=UUID(row.id),
            nome_participante=row.nome_participante,
            evento=row.evento,
            status_check_in=StatusCheckIn(row.status_check_in),
            criado_em=row.criado_em,
        )

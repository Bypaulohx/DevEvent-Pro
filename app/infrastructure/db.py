from __future__ import annotations

from sqlmodel import Session, SQLModel, create_engine

SQLITE_URL = "sqlite:///./database.db"

engine = create_engine(
    SQLITE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    # Importa os modelos para registrar as tabelas no metadata.
    from app.infrastructure import models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    with Session(engine) as session:
        yield session

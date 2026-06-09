from typing import Protocol
from app.domain.evento import Evento

class IEventoRepository(Protocol):
    def listar(self) -> list[Evento]:
        ...
    def salvar(self, evento: Evento) -> Evento:
        ...
    def excluir(self, nome: str) -> None:
        ...
from app.domain.evento import Evento
from app.interfaces.evento_repository import IEventoRepository

class EventoService:
    def __init__(self, repository: IEventoRepository) -> None:
        self._repository = repository

    def listar(self) -> list[Evento]:
        return self._repository.listar()

    def criar(self, nome: str, descricao: str) -> Evento:
        return self._repository.salvar(Evento(nome=nome, descricao=descricao))

    def excluir(self, nome: str) -> None:
        self._repository.excluir(nome)
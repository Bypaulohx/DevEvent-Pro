from abc import ABC, abstractmethod

class ICalendarProvider(ABC):
    """
    Contrato que garante que qualquer provedor de calendário 
    seja capaz de gerar links ou arquivos compatíveis.
    """
    
    @abstractmethod
    def generate_calendar_link(self, event_name: str) -> str:
        pass
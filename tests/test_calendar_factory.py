from app.services.calendar_factory import CalendarFactory
from app.infrastructure.calendar_providers import GoogleCalendarProvider, ICSCalendarProvider

def test_calendar_factory_returns_correct_provider():
    # Valida a factory resolvendo Google
    google_provider = CalendarFactory.get_provider("google")
    assert isinstance(google_provider, GoogleCalendarProvider)

def test_calendar_factory_returns_ics_by_default():
    # Valida comportamento de fallback em caso de um sistema desconhecido 
    # Deve recair sob o Padrão ICS Aberto
    unknown_provider = CalendarFactory.get_provider("provedor_desconhecido")
    assert isinstance(unknown_provider, ICSCalendarProvider)
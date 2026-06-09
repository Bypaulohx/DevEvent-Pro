from app.interfaces.calendar_provider import ICalendarProvider
from app.infrastructure.calendar_providers import (
    GoogleCalendarProvider, OutlookCalendarProvider, YahooCalendarProvider, ICSCalendarProvider
)

class CalendarFactory:
    @staticmethod
    def get_provider(provider_type: str) -> ICalendarProvider:
        providers = {
            "google": GoogleCalendarProvider(),
            "outlook": OutlookCalendarProvider(),
            "yahoo": YahooCalendarProvider(),
            "apple": ICSCalendarProvider(),
            "ics": ICSCalendarProvider()
        }
        return providers.get(provider_type.lower(), ICSCalendarProvider())
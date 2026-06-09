from urllib.parse import urlencode
from app.interfaces.calendar_provider import ICalendarProvider

class GoogleCalendarProvider(ICalendarProvider):
    def generate_calendar_link(self, event_name: str) -> str:
        base_url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
        params = {"text": event_name, "dates": "20260608T222800Z/20260608T232800Z"}
        return f"{base_url}&{urlencode(params)}"

class OutlookCalendarProvider(ICalendarProvider):
    def generate_calendar_link(self, event_name: str) -> str:
        base_url = "https://outlook.live.com/calendar/0/deeplink/compose"
        params = {"subject": event_name, "startdt": "2026-06-08T22:28:00Z", "enddt": "2026-06-08T23:28:00Z"}
        return f"{base_url}?path=/calendar/action/compose&{urlencode(params)}"

class YahooCalendarProvider(ICalendarProvider):
    def generate_calendar_link(self, event_name: str) -> str:
        base_url = "https://calendar.yahoo.com/"
        params = {"v": "60", "title": event_name, "st": "20260608T222800Z", "dur": "0100"}
        return f"{base_url}?{urlencode(params)}"

class ICSCalendarProvider(ICalendarProvider):
    def generate_calendar_link(self, event_name: str) -> str:
        # Formato ICS agnóstico, ideal para Apple Calendar (iOS/macOS), Linux e Windows nativos (RFC 5545)
        ics_content = f"BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:{event_name}\nDTSTART:20260608T222800Z\nDTEND:20260608T232800Z\nEND:VEVENT\nEND:VCALENDAR"
        encoded = ics_content.replace("\\n", "%0A").replace(" ", "%20")
        return f"data:text/calendar;charset=utf8,{encoded}"
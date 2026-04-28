import type { CheckInRequest, CheckInResponse, Inscricao } from "./types";

const API_BASE = "http://127.0.0.1:8001";

export async function postCheckin(payload: CheckInRequest): Promise<CheckInResponse> {
  const res = await fetch(`${API_BASE}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(data?.detail ?? `Erro HTTP ${res.status}`);
  }

  return (await res.json()) as CheckInResponse;
}

export async function getCheckins(): Promise<Inscricao[]> {
  const res = await fetch(`${API_BASE}/checkins`);
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  return (await res.json()) as Inscricao[];
}


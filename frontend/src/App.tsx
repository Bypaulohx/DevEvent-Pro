import { useEffect, useState } from "react";
import { BadgeCheck, CalendarClock, Loader2, Sparkles, UserRound, CalendarHeart, Ticket, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { getCheckins, postCheckin } from "./api";
import type { Inscricao } from "./types";

function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const API_URL = "http://127.0.0.1:8000";
async function fetchEventos() {
  const res = await fetch(`${API_URL}/eventos`);
  if (!res.ok) throw new Error("Failed to fetch eventos");
  return res.json();
}
async function criarEvento(nome: string, descricao: string) {
  const res = await fetch(`${API_URL}/eventos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, descricao })
  });
  if (!res.ok) throw new Error("Failed to create evento");
  return res.json();
}
async function removerEvento(nome: string) {
  const res = await fetch(`${API_URL}/eventos/${encodeURIComponent(nome)}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete evento");
  return res.json();
}
async function comprarIngresso(nome_participante: string, evento: string) {
  const res = await fetch(`${API_URL}/inscricao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome_participante, evento })
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.detail || "Erro ao comprar ingresso");
  return data;
}

export default function App() {
  const [view, setView] = useState<"user" | "admin">("user");
  const [nome, setNome] = useState("");
  const [evento, setEvento] = useState("");
  const [provedorCalendario, setProvedorCalendario] = useState("ics");
  const [loading, setLoading] = useState(false);
  const [loadingComprar, setLoadingComprar] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [checkins, setCheckins] = useState<Inscricao[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [novoEventoNome, setNovoEventoNome] = useState("");
  const [novoEventoDesc, setNovoEventoDesc] = useState("");

  async function refreshList() {
    setLoadingList(true);
    try {
      const lista = await getCheckins();
      setCheckins(lista);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao carregar check-ins.");
    } finally {
      setLoadingList(false);
    }
  }

  async function loadEventos() {
    try {
      const data = await fetchEventos();
      setEventos(data);
      if (data.length > 0 && !evento) setEvento(data[0].nome);
    } catch (err) {
      toast.error("Falha ao carregar eventos. Verifique se o servidor está rodando e o CORS habilitado.");
    }
  }

  useEffect(() => {
    void refreshList();
    void loadEventos();
  }, []);

  async function handleCheckin() {
    if (!nome.trim() || !evento.trim()) {
      toast.warning("Preencha seu nome e selecione um evento.");
      return;
    }
    setLoading(true);
    try {
      const resp = await postCheckin({
        nome_participante: nome.trim(),
        evento: evento.trim(),
        provedor_calendario: provedorCalendario
      });
      toast.success(resp.mensagem);
      // abrir link de adicionar ao calendário automaticamente, se disponível
      if (resp.add_to_calendar) {
        try {
          window.open(resp.add_to_calendar, "_blank");
          toast.success("Link de calendário aberto em nova aba.");
        } catch (_) {
          // ignore
        }
      }
      setNome("");
      setEvento("");
      await refreshList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao realizar check-in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleComprar() {
    if (!nome.trim() || !evento.trim()) {
      toast.warning("Preencha seu nome e selecione um evento.");
      return;
    }
    setLoadingComprar(true);
    try {
      const resp = await comprarIngresso(nome.trim(), evento.trim());
      toast.success(resp.mensagem);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha na compra.");
    } finally {
      setLoadingComprar(false);
    }
  }

  async function handleAddEvento(e: React.FormEvent) {
    e.preventDefault();
    if (!novoEventoNome.trim()) return;
    try {
      await criarEvento(novoEventoNome.trim(), novoEventoDesc.trim());
      toast.success("Evento criado!");
      setNovoEventoNome("");
      setNovoEventoDesc("");
      await loadEventos();
    } catch (err) {
      toast.error("Falha ao criar evento.");
    }
  }

  async function handleDeleteEvento(nome: string) {
    try {
      await removerEvento(nome);
      toast.success("Evento removido!");
      await loadEventos();
    } catch (err) {
      toast.error("Falha ao remover evento.");
    }
  }

  return (
    <div className="min-h-screen relative isolate bg-zinc-950">
      <Toaster richColors position="top-right" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900" />
        <div className="absolute inset-0 -z-10 opacity-80">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute top-32 right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute bottom-[-180px] left-[-160px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <header className="flex flex-col gap-2 mb-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-indigo-200/90">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm tracking-wide">Six Eventos</span>
            </div>
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
              <button onClick={() => setView("user")} className={classNames("px-4 py-1.5 rounded-lg text-xs font-medium transition-colors", view === "user" ? "bg-indigo-500 text-white shadow-glow" : "text-zinc-400 hover:text-white")}>Participante</button>
              <button onClick={() => setView("admin")} className={classNames("px-4 py-1.5 rounded-lg text-xs font-medium transition-colors", view === "admin" ? "bg-indigo-500 text-white shadow-glow" : "text-zinc-400 hover:text-white")}>Admin</button>
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {view === "user" ? "Compre seu ingresso e faça Check-in" : "Gerenciamento de Eventos"}
          </h1>
          <p className="max-w-2xl text-zinc-200/80">
            {view === "user" ? "Selecione o evento, garanta seu lugar e confirme presença quando chegar." : "Adicione ou remova eventos disponíveis na plataforma."}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {view === "user" ? (
            <section
              className={classNames(
                "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/15 p-2 ring-1 ring-indigo-400/20">
                  <Ticket className="h-5 w-5 text-indigo-200" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">Sua Participação</h2>
                  <p className="text-sm text-zinc-200/70">1º Compre o ingresso. 2º Faça check-in.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-zinc-200/80">Seu Nome</span>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-200/50" />
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Paula Souza"
                      className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-white outline-none ring-0 placeholder:text-zinc-300/40 focus:border-indigo-400/40 focus:shadow-glow"
                    />
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-zinc-200/80">Evento</span>
                  <div className="relative">
                    <CalendarClock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-200/50" />
                    <select
                      value={evento}
                      onChange={(e) => setEvento(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-fuchsia-400/40 focus:shadow-glow"
                    >
                      {eventos.length === 0 && <option value="">Nenhum evento disponível</option>}
                      {eventos.map(ev => <option key={ev.nome} value={ev.nome}>{ev.nome}</option>)}
                    </select>
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-zinc-200/80">Adicionar ao Calendário</span>
                  <div className="relative">
                    <CalendarHeart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-200/50" />
                    <select
                      value={provedorCalendario}
                      onChange={(e) => setProvedorCalendario(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-indigo-400/40 focus:shadow-glow"
                    >
                      <option value="ics">Padrão do Sistema (Apple / Linux / Windows)</option>
                      <option value="google">Google Calendar</option>
                      <option value="outlook">Outlook</option>
                      <option value="yahoo">Yahoo Calendar</option>
                    </select>
                  </div>
                </label>

                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleComprar}
                    disabled={loadingComprar}
                    className={classNames(
                      "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                      "bg-white/10 border border-white/10 text-white",
                      "hover:bg-white/20 hover:border-white/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                  >
                    {loadingComprar ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                    Comprar Ingresso
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckin}
                    disabled={loading}
                    className={classNames(
                      "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                      "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white",
                      "shadow-glow hover:opacity-95 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                    Fazer Check-in
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section
              className={classNames(
                "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-fuchsia-500/15 p-2 ring-1 ring-fuchsia-400/20">
                  <ShieldCheck className="h-5 w-5 text-fuchsia-200" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">Criar Evento</h2>
                  <p className="text-sm text-zinc-200/70">Disponibilize um novo evento para compra.</p>
                </div>
              </div>

              <form onSubmit={handleAddEvento} className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-zinc-200/80">Nome do evento</span>
                  <input
                    value={novoEventoNome}
                    onChange={(e) => setNovoEventoNome(e.target.value)}
                    placeholder="Ex: Python Summit 2026"
                    className="w-full rounded-xl border border-white/10 bg-black/30 py-3 px-4 text-sm text-white outline-none focus:border-fuchsia-400/40 focus:shadow-glow"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-zinc-200/80">Descrição</span>
                  <input
                    value={novoEventoDesc}
                    onChange={(e) => setNovoEventoDesc(e.target.value)}
                    placeholder="Ex: O maior evento de Python."
                    className="w-full rounded-xl border border-white/10 bg-black/30 py-3 px-4 text-sm text-white outline-none focus:border-fuchsia-400/40 focus:shadow-glow"
                  />
                </label>
                <button
                  type="submit"
                  className={classNames(
                    "mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                    "bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all"
                  )}
                >
                  Adicionar
                </button>
              </form>

              <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Eventos Ativos</h3>
                <ul className="grid gap-2">
                  {eventos.map((ev) => (
                    <li key={ev.nome} className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-xl border border-white/5">
                      <span className="text-sm text-white">{ev.nome}</span>
                      <button onClick={() => handleDeleteEvento(ev.nome)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                  {eventos.length === 0 && <span className="text-xs text-zinc-500">Nenhum evento...</span>}
                </ul>
              </div>
            </section>
          )}

          <section
            className={classNames(
              "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
            )}
          >
            <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-medium text-white">Recém Chegados</h2>
                  <p className="text-sm text-zinc-200/70">Participantes com check-in realizado.</p>
                </div>
                <button
                  type="button"
                  onClick={() => void refreshList()}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-100/80 hover:bg-black/30"
                >
                  Atualizar
                </button>
              </div>

              <div className="mt-5">
                {loadingList ? (
                  <div className="flex items-center gap-2 text-sm text-zinc-200/70">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando lista...
                  </div>
                ) : checkins.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-zinc-200/70">
                    Nenhum check-in ainda. Seja o primeiro.
                  </div>
                ) : (
                  <ul className="grid gap-3">
                    {checkins.map((c) => (
                      <li
                        key={`${c.id}-${c.evento}`}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-white">{c.nome_participante}</div>
                            <div className="mt-1 text-xs text-zinc-200/70">{c.evento}</div>
                            <div className="mt-1 text-[11px] text-zinc-300/60">Failed to fetch
                              {c.criado_em
                                ? new Date(c.criado_em).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })
                                : "--:--"}
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200 ring-1 ring-emerald-400/20">
                            realizado
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
          </section>
        </div>
      </div>
    </div>
  );
}

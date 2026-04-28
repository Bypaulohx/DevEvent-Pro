import { useEffect, useState } from "react";
import { BadgeCheck, CalendarClock, Loader2, Sparkles, UserRound } from "lucide-react";
import { Toaster, toast } from "sonner";
import { getCheckins, postCheckin } from "./api";
import type { Inscricao } from "./types";

function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export default function App() {
  const [nome, setNome] = useState("");
  const [evento, setEvento] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [checkins, setCheckins] = useState<Inscricao[]>([]);

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

  useEffect(() => {
    void refreshList();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nome.trim() || !evento.trim()) return;

    setLoading(true);
    try {
      const resp = await postCheckin({
        nome_participante: nome.trim(),
        evento: evento.trim()
      });
      toast.success(resp.mensagem);
      setNome("");
      setEvento("");
      await refreshList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao realizar check-in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full">
      <Toaster richColors position="top-right" />

      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900" />
        <div className="absolute inset-0 -z-10 opacity-80">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute top-32 right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute bottom-[-180px] left-[-160px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-14">
          <header className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-indigo-200/90">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm tracking-wide">DevEvent Pro</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Check-in rápido para eventos tech
            </h1>
            <p className="max-w-2xl text-zinc-200/80">
              Registre participantes com uma experiência moderna e acompanhe quem acabou de chegar.
            </p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <section
              className={classNames(
                "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/15 p-2 ring-1 ring-indigo-400/20">
                  <BadgeCheck className="h-5 w-5 text-indigo-200" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">Fazer check-in</h2>
                  <p className="text-sm text-zinc-200/70">Preencha os dados e confirme.</p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-zinc-200/80">Nome do participante</span>
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
                    <input
                      value={evento}
                      onChange={(e) => setEvento(e.target.value)}
                      placeholder="Ex: Python Summit 2026"
                      className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-300/40 focus:border-fuchsia-400/40 focus:shadow-glow"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={classNames(
                    "mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                    "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white",
                    "shadow-glow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  )}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                  Confirmar check-in
                </button>
              </form>
            </section>

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
                            <div className="mt-1 text-[11px] text-zinc-300/60">
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

          <footer className="mt-10 text-xs text-zinc-200/50">
            Backend: FastAPI + SQLite (SQLModel) • Frontend: React + Tailwind • Arquitetura orientada a SOLID + RUP
          </footer>
        </div>
      </div>
    </div>
  );
}


export type StatusCheckIn = "pendente" | "realizado";

export type Inscricao = {
  id: string;
  nome_participante: string;
  evento: string;
  status_check_in: StatusCheckIn;
  criado_em: string | null;
};

export type CheckInRequest = {
  nome_participante: string;
  evento: string;
};

export type CheckInResponse = {
  mensagem: string;
  inscricao: Inscricao;
  add_to_calendar?: string | null;
};


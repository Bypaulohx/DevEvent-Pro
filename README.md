# DevEvent Pro

`DevEvent Pro` e um sistema FullStack para gerenciar check-ins de participantes em eventos tech:

- **Backend**: FastAPI + SQLite (SQLModel)
- **Frontend**: React (Vite) + Tailwind (Dark Mode)

O projeto foi estruturado para fins academicos, destacando organizacao modular, injecao de dependencias e boas praticas alinhadas a SOLID, com documentacao do RUP.

## O que o codigo faz

- Recebe requisicoes de check-in para participantes.
- Valida se o check-in daquele participante naquele evento ja foi realizado.
- Persiste os dados em um banco SQLite (`database.db` na raiz do projeto).
- Dispara uma confirmacao usando um notificador desacoplado da regra de negocio.
- Expoe documentacao automatica via FastAPI.
- Exibe uma UI moderna (Dark Mode) para realizar check-in e listar "Recem Chegados".

## Estrutura principal

```text
app/
  api/
  domain/
  infrastructure/
  interfaces/
  services/
  main.py
frontend/
README.md
ARCH_GUIDE.md
requirements.txt
```

## Como rodar (Windows + PowerShell)

Requisitos:

- Python 3.10+
- `pip`
- Node.js 18+ (para o frontend)

### Backend

Crie e ative um ambiente virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instalacao das dependencias:

```bash
pip install -r requirements.txt
```

Execucao (gera `database.db` na raiz na primeira inicializacao):

```bash
uvicorn app.main:app --reload
```

A API ficara disponivel em `http://127.0.0.1:8000`.

### Frontend

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

O frontend ficara disponivel em `http://127.0.0.1:5173`.

## Como testar pelo /docs

1. Inicie a aplicacao com `uvicorn app.main:app --reload`.
2. Acesse `http://127.0.0.1:8000/docs`.
3. Abra o endpoint `POST /checkin`.
4. Clique em `Try it out`.
5. Envie um JSON como este:

```json
{
  "nome_participante": "Paula Souza",
  "evento": "Python Summit 2026"
}
```

6. Execute a requisicao e verifique a resposta com os dados da inscricao e a mensagem de sucesso.
7. Reenvie o mesmo payload para validar a regra que impede check-in duplicado. Nesse caso, a API retornara `409 Conflict`.

## Endpoint principal

### `POST /checkin`

Entrada:

```json
{
  "nome_participante": "Paula Souza",
  "evento": "Python Summit 2026"
}
```

### `GET /checkins`

Retorna a lista de participantes com check-in realizado:

```json
[
  {
    "id": "uuid",
    "nome_participante": "Paula Souza",
    "evento": "Python Summit 2026",
    "status_check_in": "realizado"
  }
]
```

Resposta de sucesso:

```json
{
  "mensagem": "Check-in realizado com sucesso.",
  "inscricao": {
    "id": "uuid-gerado",
    "nome_participante": "Paula Souza",
    "evento": "Python Summit 2026",
    "status_check_in": "realizado"
  }
}
```

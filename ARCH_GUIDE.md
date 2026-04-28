# ARCH_GUIDE

## Visao Tecnica

O projeto `DevEvent Pro` foi construido como uma API pequena, mas com arquitetura intencionalmente organizada para demonstrar principios de engenharia de software. A solucao separa dominio, contratos, servicos, infraestrutura e camada HTTP para manter baixo acoplamento e facilitar evolucao.

## Aplicacao de SOLID

### S - Single Responsibility Principle

Cada modulo possui uma responsabilidade principal:

- `app/domain/inscricao.py`: define os modelos de dominio e contratos de entrada/saida.
- `app/interfaces/notificador.py`: define o contrato de notificacao.
- `app/interfaces/inscricao_repository.py`: define o contrato de persistencia.
- `app/services/checkin_service.py`: concentra a regra de negocio do check-in.
- `app/infrastructure/notificadores.py`: contem implementacoes concretas de notificacao.
- `app/infrastructure/repositories.py`: contem a persistencia em memoria.
- `app/api/routes.py`: cuida apenas da traducao HTTP entre request/response e servico.

Essa separacao evita que uma mesma classe tenha mais de um motivo para mudar.

### O - Open/Closed Principle

O sistema foi projetado para extensao sem exigir alteracoes destrutivas no nucleo da regra de negocio:

- `CheckInService` depende de contratos, nao de implementacoes concretas.
- E possivel trocar `LogNotificador` por `EmailNotificador` ou outro notificador sem alterar a logica do servico.
- O repositorio em memoria pode ser substituido por uma implementacao com banco de dados mantendo a mesma interface.

Assim, o software fica aberto para extensao e fechado para modificacoes recorrentes no nucleo.

### L - Liskov Substitution Principle

As implementacoes concretas podem substituir seus contratos sem quebrar o comportamento esperado:

- `LogNotificador` pode ser usado onde `INotificador` e esperado.
- `InMemoryInscricaoRepository` pode ser usado onde `IInscricaoRepository` e esperado.

Na pratica, isso permite trocar detalhes de infraestrutura preservando o comportamento da aplicacao.

### I - Interface Segregation Principle

As interfaces foram mantidas pequenas e especificas:

- `INotificador` expoe apenas `enviar_confirmacao`.
- `IInscricaoRepository` expoe apenas busca e salvamento, exatamente o que o servico precisa.

Com isso, nenhuma implementacao e forcada a depender de metodos desnecessarios.

### D - Dependency Inversion Principle

O principio D foi aplicado ao injetar abstracoes em vez de classes concretas:

- `CheckInService` recebe `IInscricaoRepository` e `INotificador`.
- A camada `api/dependencies.py` monta as dependencias concretas e injeta o servico na rota via `Depends`.

Isso reduz acoplamento, melhora testabilidade e facilita trocar infraestrutura sem alterar a regra de negocio.

#### DIP mantido com a camada de banco de dados

Ao introduzir SQLite/SQLModel, o principio D foi preservado:

- O servico **nao conhece SQLModel/SQLAlchemy**; ele continua falando apenas com `IInscricaoRepository`.
- A implementacao concreta `SQLiteInscricaoRepository` vive em `app/infrastructure/` e pode ser trocada por outra (PostgreSQL, MySQL, etc.) sem alterar a regra de negocio.
- A injecao da dependencia continua centralizada em `app/api/dependencies.py`, mantendo o acoplamento do framework e infraestrutura fora do dominio/servicos.

## Relacao com o RUP

### Fase de Elaboracao

Este projeto representa bem a fase de Elaboracao do RUP porque o foco principal esta na mitigacao de riscos arquiteturais antes da expansao funcional completa. Mesmo sendo um MVP, ele valida decisoes importantes:

- Separacao clara entre regras de negocio e framework web.
- Uso de contratos para permitir troca de infraestrutura.
- Definicao antecipada da estrategia de injecao de dependencias.
- Estrutura pronta para evoluir de log em console para e-mail real e de memoria para banco de dados.

Ou seja, o maior risco nao e funcional, mas arquitetural: garantir que a base aceite crescimento com baixo acoplamento.

### Modelo Iterativo

Dentro do RUP, este codigo tambem se encaixa em um processo iterativo:

- Iteracao 1: prototipo arquitetural com endpoint de check-in e notificador em log.
- Iteracao 2: substituicao do repositorio em memoria por persistencia real.
- Iteracao 3: implementacao de `EmailNotificador`.
- Iteracao 4: novos casos de uso, como cancelamento de inscricao, consulta por evento e relatorios.

Cada iteracao preserva a arquitetura e adiciona capacidades sem reescrever a base.

### Fase de Construcao (FullStack)

Com a evolucao para FullStack, o projeto passa a representar tambem a fase de Construcao do RUP: a arquitetura definida na Elaboracao e usada para entregar funcionalidades completas de ponta a ponta.

- O **Backend** consolida persistencia real (SQLite via SQLModel) e endpoints para leitura/escrita (`POST /checkin` e `GET /checkins`).
- O **Frontend** (React + Tailwind) consome a API e entrega valor perceptivel ao usuario final com uma interface moderna.
- A integracao foi gerenciada de forma incremental: primeiro garantimos o contrato HTTP (payloads e respostas), depois conectamos o frontend, e por fim ajustamos preocupacoes transversais (ex: CORS).

Em termos de iteracoes, isso permite entregar incrementos utilizaveis sem perder o controle arquitetural: UI -> integracao -> persistencia -> refinamentos.

## Por que FastAPI

O FastAPI foi escolhido por combinar caracteristicas que favorecem esse desenho:

- Suporte nativo a tipagem estatica com Python moderno.
- Injecao de dependencias simples e expressiva com `Depends`.
- Geracao automatica de documentacao interativa em `/docs`.
- Excelente desempenho para APIs, incluindo suporte a cenarios assincronos.
- Boa aderencia a separacao entre camada HTTP e servicos de dominio.

Para um projeto academico que precisa evidenciar arquitetura, legibilidade e produtividade, FastAPI oferece um equilibrio muito bom entre simplicidade e robustez.

## Leitura Arquitetural do Fluxo

1. A rota `POST /checkin` recebe a entrada HTTP.
2. O FastAPI injeta `CheckInService` por meio de `Depends`.
3. O servico consulta o repositorio para verificar duplicidade.
4. Se o check-in ainda nao foi realizado, o status da inscricao e atualizado.
5. O repositorio persiste a inscricao.
6. O notificador envia a confirmacao.
7. A API devolve uma resposta tipada ao cliente.

## Conclusao

O `DevEvent Pro` foi estruturado para ser pequeno no escopo e forte na arquitetura. Ele demonstra, de forma objetiva, como SOLID, RUP e FastAPI podem trabalhar juntos para produzir um codigo limpo, modular, extensivel e facil de evoluir.

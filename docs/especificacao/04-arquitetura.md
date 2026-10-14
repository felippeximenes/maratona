# 04 – Arquitetura e modelo de dados da v1

## Situação

Aprovada em 14/10/2026 (Fase 3, passo 5).

Decisões do Felippe em 14/10/2026, já aplicadas nesta nota (detalhes na
seção 7):
1. **Conta da Apple (US$ 99 por ano):** assinada ao começar o M8. De M0 a
   M7, a construção e os testes são só no Android.
2. **Plano do Supabase:** grátis durante a Fase 4 e o beta; Pro (cerca de
   US$ 25 por mês) a partir do lançamento público.
3. **Região do servidor:** São Paulo.
4. **Página web de exclusão:** página simples, hospedada de graça (por
   exemplo, no GitHub Pages), sem depender do domínio glowbox.app.br. O
   contato é um e-mail gratuito dedicado ao app (por exemplo, um Gmail
   próprio do Glowbox). Pendência nova em `01-escopo-v1.md`: criar o e-mail
   dedicado do Glowbox.
5. **Importação do TV Time:** o arquivo é procurado durante M0 a M5; se não
   aparecer ou não for legível até o fim do M5, o item 11 sai da v1 e o M9 é
   pulado.
6. **Resumo dos episódios:** não é guardado no banco; o servidor busca
   quando a tela Episódio abre. O título do episódio continua guardado.

`01-escopo-v1.md` foi ajustado na premissa de custos e nas pendências, e o
CLAUDE.md ganhou a pasta `core/` na seção Estrutura.

Base: `00-nome.md`, `01-escopo-v1.md` (itens 1 a 16), `02-monetizacao.md`,
`03-telas.md`, as regras **R** de `docs/estudo-apk/04-comportamento.md` e o
glossário e as diretrizes de voz de `docs/estudo-apk/05-tom-e-textos.md`.

Esta nota é só desenho e decisões. Não há código. Nomes de tabelas, colunas
e funções aparecem em inglês porque são os identificadores que serão usados
na Fase 4 (regra 5 do CLAUDE.md); a explicação é em português.

Valores marcados com **(a verificar)** são de memória ou estimativa e devem
ser conferidos nas páginas oficiais antes de cada decisão de gasto.

---

## 1. Visão geral

### As peças, em linguagem simples

| Peça | O que é | Para que serve no Glowbox |
|---|---|---|
| **App Glowbox** | Um programa só, escrito em TypeScript com React Native e Expo, que vira o app de Android e o de iOS. **Expo Router** organiza as telas como arquivos numa pasta: cada arquivo é uma tela, e as pastas viram as abas. | Tudo o que a pessoa vê e toca. |
| **Supabase** | Um "backend pronto": banco de dados, login, armazenamento de arquivos e funções que rodam no servidor, tudo num painel web. | Guardar os dados de cada pessoa e fazer o trabalho que não pode ficar no celular. |
| **Postgres** | O banco de dados do Supabase. Os dados ficam em tabelas, como planilhas com colunas fixas. | Acervo, registros de **Visto**, coleções, opções, avisos, assinatura. |
| **Auth** | O sistema de login do Supabase. | **Entrar com Google** e **Entrar com Apple**. Cada pessoa ganha um identificador único, usado em todas as tabelas. |
| **Edge Functions** | Pequenos programas em TypeScript que rodam nos servidores do Supabase, chamados pelo app ou por um relógio. | Falar com TMDB, TVmaze, Expo Push e RevenueCat, onde ficam as chaves secretas, e aplicar as regras que não podem ser burladas. |
| **Tarefas agendadas** | Um relógio dentro do banco (o recurso "Cron" do Supabase, que usa a extensão `pg_cron`) que chama uma função de tempos em tempos. | Atualizar séries, buscar horários, enviar avisos, limpar dados velhos. |
| **Storage** | Pasta de arquivos do Supabase, com permissão por pessoa. | Só para o arquivo de **Importar histórico**, apagado depois de lido. |
| **TMDB** | Base pública de séries e filmes. | Nomes, sinopses, pôsteres, temporadas, episódios, datas, durações. Só o backend chama a API (regra 3 do CLAUDE.md). |
| **TVmaze** | Outra base pública, com horário exato de exibição. | Só dois dados por episódio: momento exato de exibição e duração quando faltar no TMDB (decisão 1 da nota 04). Só o backend chama. |
| **Expo Push** | Serviço gratuito da Expo que entrega notificações no Android (pelo Firebase do Google) e no iOS (pelo serviço de notificações da Apple). | Os avisos de **Estreia**, **Episódio novo**, **Lembrete 1 h antes** e **Aviso no dia**. |
| **RevenueCat** | Intermediário das compras dentro do app nas duas lojas. | **Glowbox Premium**: preços, compra, teste grátis, renovação, **Restaurar compras**. Avisa o backend por **webhook** (uma chamada automática a uma Edge Function a cada mudança). |
| **Widgets nativos** | Pequenos programas à parte, em Kotlin (Android) e Swift (iOS), que desenham o widget na tela inicial. Entram no projeto Expo por "plugin de configuração". | Widgets da **Fila** e da **Agenda** (item 16). Leem um resumo que o app deixa salvo no aparelho. |

### Quem fala com quem

```
                     ┌───────────────────────┐
                     │  Google / Apple       │  login
                     └──────────▲────────────┘
                                │
┌──────────────────┐   login,   │      ┌────────────────────────────────┐
│ Celular          │   leituras │      │ Supabase                       │
│                  │ ───────────┴────► │  Auth (login)                  │
│  App Glowbox ────┼─ ações que ─────► │  Postgres (tabelas + RLS)      │
│   (Expo)         │  têm regra        │  Edge Functions ◄── Cron       │
│                  │                   │  Storage (importação)          │
│  Widgets ◄─ resumo salvo pelo app    └──┬─────────┬─────────┬─────▲───┘
│                  │                      │         │         │     │
│                  │ ◄── pôsteres ────┐   ▼         ▼         ▼     │ webhook
└──▲──────┬────────┘   (CDN do TMDB)  │  API do    API do   Expo   │
   │      │                           └─ TMDB      TVmaze   Push   │
   │      │ compra                                            │    │
   │      ▼                                                   │    │
   │   RevenueCat ◄──► App Store / Google Play                │    │
   │      └───────────────────────────────────────────────────┼────┘
   │                                                          │
   └──── notificação (Firebase no Android, Apple no iOS) ◄────┘
```

Leitura do diagrama:

1. O app fala com o **Supabase** para tudo que é dado da pessoa.
   - **Leituras** (acervo, **Fila**, coleções, opções) vão direto às
     tabelas. Isso é seguro porque cada tabela tem Row Level Security
     (seção 3): o banco só devolve as linhas da própria pessoa.
   - **Ações com regra** (buscar, marcar, desmarcar, tirar do acervo, criar
     coleção, importar, excluir conta) passam por uma Edge Function ou por
     uma função do banco, que confere a regra antes de gravar.
2. O app **nunca** fala com a API do TMDB nem com a do TVmaze. A única coisa
   que ele busca do TMDB são as imagens dos pôsteres, no endereço público de
   imagens (CDN), que não usa chave. **(a verificar:** confirmar nos termos
   do TMDB que carregar as imagens direto do CDN é permitido no uso
   comercial.)
3. Para comprar, o app fala com o **RevenueCat**, que fala com a loja. O
   RevenueCat avisa o backend por webhook, e o backend guarda se a pessoa
   tem Premium.
4. O **relógio** do Supabase chama as Edge Functions que atualizam séries,
   buscam horários e mandam avisos pelo **Expo Push**.
5. Os **widgets** não falam com a internet na v1: leem um resumo da **Fila**
   e da **Agenda** que o app grava no aparelho (seção 4.8).

### Três decisões de desenho que valem para o resto da nota

**D1. O catálogo é compartilhado; os dados da pessoa são separados.** Séries,
temporadas e episódios vindos do TMDB ficam numa cópia local (o "cache de
títulos"), uma vez só para todo mundo. Os dados de cada pessoa (acervo,
registros, coleções) apontam para esse catálogo. Assim, mil pessoas que
acompanham a mesma série não geram mil cópias dela, e a atualização periódica
roda uma vez por série.

**D2. As regras R ficam num módulo único em TypeScript, o "núcleo"
(`core`).** É um conjunto de funções puras (recebem dados, devolvem
resultado, sem internet nem banco): estado da série (R1), próximo episódio
(R5), ordem da **Fila** (R7), anteriores pendentes (R8), extras (R11, R12),
momento de exibição (R20), duração (R25), agrupamento de avisos (R18, R19,
R21 a R22a). O mesmo módulo é usado:
- no **app**, para a marcação otimista (a tela muda antes do servidor
  responder, item 5);
- nas **Edge Functions**, como fonte da verdade: depois de cada marcação ou
  atualização da série, o servidor recalcula e grava o resultado.

Uma linguagem só, um lugar só para cada regra, e os exemplos "Dado… Quando…
Então…" da nota 04 viram testes automáticos desse módulo. Proposta de pasta:
`core/` na raiz do repositório, ao lado de `app/` e `supabase/` (o CLAUDE.md
seria atualizado na Fase 4). **(a verificar:** se o empacotador das Edge
Functions não aceitar importar de fora de `supabase/`, um script copia o
módulo para `supabase/functions/_shared/` antes do envio.)

**D3. O progresso é calculado no servidor e guardado pronto.** Calcular a
**Fila** exige olhar todos os episódios de todas as séries da pessoa. Fazer
isso no celular a cada abertura seria lento para quem tem 300 séries. Por
isso, o servidor guarda, para cada pessoa e série, um resumo já calculado
(tabela `user_title_progress`, seção 2.3): estado, próximo episódio, "+N",
chave de ordem. O app só lê. O resumo é refeito quando a pessoa marca algo,
quando a série muda no TMDB ou TVmaze, e quando chega a hora de um episódio
ir ao ar (seção 4.5).

### Outras escolhas do app

- **Build de desenvolvimento desde o M0, sem Expo Go.** RevenueCat, widgets
  e ícones alternativos exigem código nativo, que o Expo Go não roda.
  Começar já com o build de desenvolvimento (feito na nuvem pelo EAS e
  instalado no celular) evita trocar de caminho no meio.
- **Leituras guardadas no aparelho.** O app guarda o último conteúdo
  carregado de cada tela para mostrar "sem internet" com o conteúdo antigo
  (regras gerais de `03-telas.md`). Ações que gravam exigem internet na v1.
  **Sair** apaga essa cópia.
- **Spoiler é regra de tela.** O catálogo guarda o título dos episódios, e
  o resumo vem do servidor quando a tela Episódio abre (decisão 6), mas o
  app só os mostra em episódio **Visto** ou quando a pessoa
  pede na tela Episódio (diretriz de voz 8). Notificações e widgets nunca
  levam título de episódio.

---

## 2. Modelo de dados

### Convenções

- Toda tabela de dado pessoal tem a coluna `user_id`, ligada ao perfil, com
  **exclusão em cascata**: apagar o perfil apaga tudo da pessoa (seção 3).
- Datas e horas com momento exato são guardadas em UTC (`timestamptz`);
  datas "só data" são guardadas como data simples, sem fuso (R23).
- `id` é um identificador gerado pelo banco (`uuid`), salvo indicação.
- "Estado" (**Vendo**, **Aguardando**, **Concluída**, **Quero ver**,
  **Larguei**) **não é guardado como escolha da pessoa**. A pessoa escolhe
  só a intenção; o estado é calculado (R1, decisão D3).

### Mapa das tabelas

```
auth.users (Supabase Auth)
  └─ profiles ──┬─ notification_settings      (1 por pessoa)
                ├─ push_tokens                (1 por aparelho)
                ├─ subscriptions              (1 por pessoa)
                ├─ user_titles ──── user_title_progress   (1 por pessoa e título)
                ├─ watches                    (1 por vez que viu)
                ├─ undo_actions               (o que dá para desfazer)
                ├─ collections ──── collection_items
                ├─ scheduled_notifications
                ├─ imports ──────── import_unmatched
                └─ apple_credentials          (só contas Apple; só o servidor lê)

Catálogo compartilhado (sem dono):
  titles ──┬─ seasons
           └─ episodes

Servidor:
  app_config · revenuecat_events
```

### 2.1 Conta e opções

**`profiles`: perfil da pessoa.** Uma linha por conta, criada no primeiro
login.

| Coluna | O que guarda |
|---|---|
| `id` | O mesmo identificador da conta no Auth. |
| `display_name`, `avatar_url` | Nome e foto vindos do Google ou da Apple, quando houver (tela Perfil). |
| `auth_provider` | `google` ou `apple`. Diz se a exclusão precisa revogar o acesso na Apple. |
| `timezone` | Fuso do aparelho em uso (por exemplo, `America/Manaus`), atualizado sempre que o app abre. Usado em "exibido" para episódios só com data, na **Agenda**, nos avisos e no horário silencioso (R6, R21, R22a, R23). |
| `mark_previous_rule` | **Perguntar** (padrão), **Sempre marcar** ou **Nunca marcar** (R9). |
| `theme`, `app_icon` | Tema e ícone escolhidos (item 15). Valores do Premium só são aceitos com Premium. |
| `notif_prompt_state` | Controle da explicação dos avisos: se já foi mostrada no primeiro acesso, se a pessoa escolheu **Agora não** e se a segunda chance (ao adicionar a primeira série) já foi usada (`03-telas.md`, passo 3 e fluxo 4.3). |
| `onboarding_done_at` | Quando o primeiro acesso da conta terminou; num aparelho novo, pula os passos 3 e 4. |
| `created_at` | Criação da conta. |

**`notification_settings`: preferências de aviso.** Uma linha por pessoa,
criada com os padrões do item 9.

| Coluna | Padrão | Regra |
|---|---|---|
| `premiere_enabled` | ligado | **Estreia** (R21a) |
| `premiere_at_air` | ligado | aviso na hora da **Estreia** |
| `premiere_1h_before` | ligado | **Lembrete 1 h antes** da **Estreia** (R22) |
| `new_episode_enabled` | ligado | **Episódio novo** |
| `new_episode_at_air` | desligado | aviso na hora do **Episódio novo** (ajuste de 13/10/2026) |
| `new_episode_1h_before` | ligado | **Lembrete 1 h antes** do **Episódio novo** |
| `quiet_enabled` | ligado | horário silencioso (R22a) |
| `quiet_start`, `quiet_end` | 0h e 7h | início e fim, no fuso de `profiles.timezone` |

**`push_tokens`: endereços de notificação.** Uma linha por aparelho.

| Coluna | O que guarda |
|---|---|
| `token` | O endereço do aparelho no Expo Push (único). |
| `platform` | `android` ou `ios`. |
| `permission` | Resposta do sistema: concedida, negada ou não pedida (tela Configurações > Avisos). |
| `last_seen_at` | Última abertura do app nesse aparelho. |
| `disabled_at` | Preenchido quando o Expo diz que o aparelho não aceita mais (app desinstalado). |

Ao **Sair**, o app apaga a linha do próprio aparelho, para que avisos da
conta não cheguem mais ali.

### 2.2 Catálogo (cache de títulos)

Cópia local dos dados do TMDB e do TVmaze. Qualquer pessoa logada pode ler;
só o servidor grava.

**`titles`: séries e filmes.**

| Coluna | O que guarda |
|---|---|
| `kind` | `show` (série) ou `movie` (filme). Uma tabela só para os dois simplifica as coleções, que misturam séries e filmes. |
| `tmdb_id` | Identificador no TMDB. Único junto com `kind`. |
| `imdb_id`, `tvdb_id` | Identificadores externos vindos do TMDB. Servem para casar com o TVmaze e para **Importar histórico**. O TheTVDB nunca é acessado (CLAUDE.md, seção REA). |
| `tvmaze_id`, `tvmaze_match` | Série correspondente no TVmaze e o resultado do casamento: casada, não encontrada ou ainda não tentada (R20). |
| `name`, `original_name`, `overview`, `poster_path`, `year` | Dados de exibição, em português quando o TMDB tiver; senão, em inglês. |
| `production_status` | Série: **Em produção**, **Fim da série** ou **Cancelada** (item 3). |
| `typical_runtime` | Série: duração típica informada pelo TMDB (passo 4 da R25). |
| `release_date`, `runtime`, `runtime_is_estimated` | Filme: estreia (para "ainda não estreou" em **Quero ver**), duração e se ela é o padrão de 100 minutos (R25). |
| `has_regular_seasons` | Série: se tem temporada 1 em diante. Sem nenhuma, os extras contam como episódios normais (R11, item 8). |
| `synced_at`, `next_sync_at` | Última atualização e a próxima prevista (seção 4.1). |

**`seasons`: temporadas.** `title_id`, `season_number` (0 = **Extras**),
`name`, `air_date`, `episode_count`. Uma linha por temporada.

**`episodes`: episódios.**

| Coluna | O que guarda |
|---|---|
| `title_id`, `season_id`, `season_number`, `episode_number` | Posição do episódio. Único por série, temporada e número. |
| `name` | Título (só aparece na tela conforme a regra de spoiler). O resumo não é guardado: a função `title` o busca no TMDB quando a tela Episódio abre (decisão 6 da seção 7). |
| `air_date` | Data do TMDB, sem horário (R20, "só data"). |
| `airstamp` | Momento exato vindo do TVmaze, em UTC, quando houver (R20, "exato"). |
| `runtime_tmdb`, `runtime_tvmaze` | Durações das duas fontes, quando houver. |
| `runtime`, `runtime_is_estimated` | Duração usada nas contas, já escolhida pela ordem da R25, e se é estimada (passos 3 a 5). Calculada no servidor a cada atualização, para que **Seus números** seja uma soma simples. |
| `tmdb_episode_id`, `tvmaze_episode_id` | Identificadores nas duas fontes. |

A qualidade do momento de exibição (exato, só data, sem data) não é
guardada: sai de `airstamp` e `air_date` pelo núcleo (R20). Quando as duas
fontes discordam na data, vale a do TVmaze se houver horário (R20).

Filmes não têm temporadas nem episódios.

### 2.3 Acervo e progresso

**`user_titles`: intenção da pessoa por título.** Uma linha por série em
**Minhas séries** ou filme em **Meus filmes**. Estar na tabela é estar no
acervo.

| Coluna | O que guarda |
|---|---|
| `user_id`, `title_id` | Pessoa e título. Únicos juntos. |
| `intent` | Série: `following` (acompanhando), `want` (**Quero ver**) ou `dropped` (**Larguei**). Filme: sempre `want`; **Quero ver** ou **Vistos** sai de haver registro ou não. |
| `include_extras` | **Incluir extras**, por série (R12). |
| `added_at` | Data de inclusão (ordem de **Para começar**, R7). |
| `last_activity_at` | Última marcação, desmarcação, retomada ou inclusão feita pela pessoa (definição da nota 04; R7 e ordem de **Minhas séries** e **Meus filmes**). |
| `new_episodes_since` | Quando a série voltou de **Aguardando** ou **Concluída** com episódio novo. Mostra **Novos episódios** na **Fila** até a pessoa marcar um episódio dela ou passarem 14 dias (R13). |
| `available_season`, `available_season_since` | Número da temporada nova e quando apareceu, para a etiqueta **Temporada N disponível** em **Quero ver** e **Larguei**, por 30 dias ou até **Retomar** (R14). |

**`user_title_progress`: resumo calculado (decisão D3).** Uma linha por
série de `user_titles`. Só o servidor grava; o app lê.

| Coluna | O que guarda |
|---|---|
| `state` | **Vendo**, **Aguardando**, **Concluída**, **Quero ver** ou **Larguei** (R1). |
| `frontier_episode_id` | Episódio contável visto mais adiantado (definição de fronteira). |
| `next_episode_id`, `plus_n` | Próximo episódio e o "+N" (R5, R6). |
| `next_after_ids` | Os dois ou três episódios seguintes, para o app atualizar o cartão da **Fila** na hora, sem esperar o servidor (marcação otimista). |
| `queue_block`, `sort_key` | Bloco da **Fila** (em andamento, **Para começar**, **Faz tempo**) e chave de ordem (R7). |
| `watched_count`, `aired_count` | Progresso "vistos de exibidos" em **Minhas séries**. |
| `next_change_at` | Próximo momento em que o resumo muda sozinho, sem ação de ninguém (por exemplo, o episódio que vai ao ar às 22h). A tarefa da seção 4.5 refaz o resumo nessa hora. |
| `computed_at` | Quando foi calculado. |

A contagem de episódios não marcados por temporada (R5) e os anteriores
pendentes (R8) são calculados na hora pelo núcleo, na Página da série, que
já carrega todos os episódios daquela série.

**`watches`: episódios e filmes vistos, com **Vi de novo**.** Uma linha por
vez que a pessoa viu algo (R15).

| Coluna | O que guarda |
|---|---|
| `user_id`, `title_id` | Pessoa e série ou filme. |
| `episode_id` | Episódio; vazio quando é filme. |
| `watched_at` | Momento da marcação, não da exibição (R15). Anteriores marcados juntos levam o mesmo momento (R8). |
| `is_batch` | Marca "em lote": anteriores, temporada, importação (R15). |
| `action_id` | Ação que criou o registro, para o **Desfazer** reverter o grupo inteiro (R16). |
| `source`, `import_id`, `import_key` | `app` ou `import`; na importação, a chave única que impede duplicar registros ao importar o mesmo arquivo de novo (item 11). |

O primeiro registro de um episódio é o **Visto**; os seguintes são **Vi de
novo** e dão o selo **2×** (R17). Não há coluna para isso: sai da contagem.

**`undo_actions`: o que dá para desfazer.** Cada ação que oferece
**Desfazer** (marcação em grupo, desmarcação, **Vi** na **Fila**, retomada
automática, **Tirar de Minhas séries**, **Tirar de Meus filmes**) grava aqui
o que é preciso para voltar atrás: a intenção anterior e, quando a ação
apaga registros, a cópia deles.

| Coluna | O que guarda |
|---|---|
| `kind` | Tipo de ação. |
| `title_id` | Série ou filme afetado. |
| `snapshot` | O que voltar: intenção e opções anteriores, registros apagados. |
| `expires_at` | O app mostra **Desfazer** por 6 segundos; o servidor aceita até 2 minutos depois, para cobrir internet lenta. Depois disso, a ação vale de vez (R2, fluxo 4.4). |

Com isso, **Tirar de Minhas séries** apaga na hora (se a pessoa fechar o app,
a remoção vale, como pede o fluxo 4.4) e **Desfazer** devolve tudo pela
cópia. Uma tarefa diária limpa as linhas vencidas.

### 2.4 Coleções

**`collections`.** `user_id`, `name` (obrigatório, sem texto vazio),
`position` (ordem em **Minhas coleções**), `created_at`, `updated_at`.

Limite do plano grátis: uma regra no banco recusa criar coleção quando a
pessoa já tem 3 ou mais e não tem Premium (item 13). Fica no banco, e não
só no app, para valer "mesmo que o app seja burlado". Vale igual com o
Premium desligado (plano B), porque nesse caso ninguém tem Premium. Renomear,
reordenar e apagar continuam liberados acima do limite (Fim do Premium).

**`collection_items`.** `collection_id`, `title_id`, `user_id`, `position`
(ordem por arrastar), `added_at`. Um título aparece uma vez por coleção e
pode estar em várias. Não tem ligação com `user_titles`: estar numa coleção
não põe no acervo, e sair do acervo não tira da coleção (item 13, fluxo
4.4).

### 2.5 Avisos agendados

**`scheduled_notifications`.** Cada aviso que vai sair, já calculado.

| Coluna | O que guarda |
|---|---|
| `user_id`, `title_id` | Pessoa e série. |
| `kind` | **Estreia** ou **Episódio novo** (R21a; o grupo recebe o tipo do primeiro episódio). |
| `variant` | Aviso na hora, **Lembrete 1 h antes** ou **Aviso no dia** (10h, só data). |
| `episode_ids` | Episódios cobertos. Lançamento em bloco e vários no mesmo dia viram um aviso só (R18, R19). |
| `fire_at` | Quando sairia sem horário silencioso. |
| `deliver_at` | Quando vai sair de fato: igual a `fire_at`, ou o fim do horário silencioso (R22a). |
| `status` | Pendente, enviado, cancelado ou com falha. |
| `dedupe_key` | Pessoa + série + dia local + variante. Garante no máximo um aviso de cada variante por série por dia. |
| `sent_at`, `push_ticket_ids` | Envio e os recibos do Expo, para descobrir aparelhos desativados. |

Interpretação adotada para "no máximo um aviso por série por dia" (item 9):
um por variante. Na **Estreia** com os padrões, a pessoa recebe o
**Lembrete 1 h antes** e o aviso na hora no mesmo dia, como no primeiro
exemplo da R21a.

### 2.6 Assinatura e Premium

**`subscriptions`: direito ao Premium.** Uma linha por pessoa que já teve
assinatura. Só o webhook do RevenueCat grava.

| Coluna | O que guarda |
|---|---|
| `user_id` | Pessoa (o RevenueCat usa o mesmo identificador da conta do Glowbox, então a ligação é direta). |
| `is_active` | Se o direito ao Premium está valendo. |
| `product_id`, `store` | Plano (mensal ou anual) e loja (Apple ou Google Play). |
| `period_type` | Teste grátis ou período pago. |
| `expires_at`, `will_renew` | Fim do período atual e se vai renovar (Configurações > Assinatura). |
| `last_event_at` | Momento do último evento aplicado, para ignorar eventos antigos que cheguem fora de ordem. |

**`revenuecat_events`.** Registro bruto de cada evento recebido, com o
identificador do evento como chave única: se o RevenueCat mandar o mesmo
evento duas vezes, ele é aplicado uma vez só. Guardado por 90 dias.

**`app_config`.** Chaves do app lidas por todos: `premium_enabled` (o
interruptor do plano B, `02-monetizacao.md`) e, se precisar, uma versão
mínima do app.

**Quem tem Premium?** Uma função do banco, `has_premium(user)`, responde
"sim" só se `premium_enabled` estiver ligado **e** a assinatura estiver
ativa com `expires_at` no futuro. Todas as regras do backend (limite de
coleções, tema, ícone) usam essa função. O app pergunta ao RevenueCat para
liberar na hora depois da compra, mas o backend decide.

### 2.7 Importações

**`imports`.** Uma linha por importação: `status` (enviado, processando,
concluído, com erro), `file_name` (o único texto da origem que aparece na
tela), contadores (itens que entraram, não encontrados, registros criados,
registros que já existiam), `error_message`, `started_at`, `finished_at`,
`cursor` (onde parou, se o arquivo for grande e o processamento for feito em
partes).

**`import_unmatched`.** Itens que não foram encontrados no TMDB: título,
ano, tipo e identificadores do arquivo. A tela de importação lista e permite
buscar à mão (item 11).

O arquivo enviado fica numa pasta privada do Storage, só da pessoa, e é
apagado no fim da importação, com sucesso ou erro.

### 2.8 Servidor e Apple

**`apple_credentials`.** Só para contas Apple: o token que permite revogar o
acesso do app junto à Apple na exclusão da conta (item 1). Nenhuma pessoa lê
esta tabela, nem a própria; só as Edge Functions. **(a verificar:** o
Supabase Auth não guarda esse token da Apple; o app precisa enviar ao
backend o código de autorização recebido no login com Apple, e o backend o
troca pelo token e guarda aqui.)

### 2.9 Onde fica cada regra R

"Núcleo" é o módulo `core` da decisão D2. "Função `mark`" e as outras são
as Edge Functions da seção 4.

| Regra | Onde fica | Dados usados |
|---|---|---|
| **R1** Estados | Núcleo; resultado gravado em `user_title_progress.state` | `user_titles.intent`, `watches`, `episodes`, `titles.production_status` |
| **R2** Adicionar e tirar do acervo | Função `library` (adicionar, tirar, desfazer) | `user_titles`, `watches`, `undo_actions` |
| **R3** Mudar intenção | Função `library`; replaneja avisos da série | `user_titles.intent`, `scheduled_notifications` |
| **R4** Retomada automática ao marcar | Função `mark` | `user_titles.intent`, `undo_actions` |
| **R5** Próximo episódio e "+N" | Núcleo; gravado em `user_title_progress` | `next_episode_id`, `plus_n`, `frontier_episode_id` |
| **R6** Não exibidos e sem data | Núcleo (o que é "exibido", com o fuso da pessoa) | `episodes.air_date`, `airstamp`, `profiles.timezone` |
| **R7** Ordem da **Fila** | Núcleo; gravado em `queue_block` e `sort_key` | `last_activity_at`, `added_at`, momento do próximo episódio |
| **R8** Anteriores pendentes | Núcleo, no app (para fazer a pergunta) e de novo na função `mark` (para conferir) | `watches`, `episodes` |
| **R9** Lembrar a escolha | Coluna `profiles.mark_previous_rule` | — |
| **R10** Marcar não exibido | Confirmação só no app; o servidor aceita | — |
| **R11** Extras fora por padrão | Núcleo ("episódio contável") | `season_number = 0`, `titles.has_regular_seasons` |
| **R12** **Incluir extras** | Coluna `user_titles.include_extras`; ordem pela data no núcleo | `episodes.air_date` |
| **R13** Volta de **Aguardando** e **Concluída** | Tarefa de atualização (seção 4.1), ao recalcular | `user_titles.new_episodes_since` |
| **R14** Etiqueta em **Quero ver** e **Larguei** | Tarefa de atualização | `user_titles.available_season`, `available_season_since` |
| **R15** Registros e "em lote" | Tabela `watches` | `is_batch`, `action_id` |
| **R16** Desmarcar e **Desfazer** | Função `mark` (desmarcar) e `undo_actions` | — |
| **R17** **Vi de novo** | Função `mark`, com o aviso de que é reassistida: cria registro sem mudar intenção | `watches` |
| **R18**, **R19** Vários no mesmo dia | Núcleo (agrupamento na **Agenda** e nos avisos) | `episodes` |
| **R20** Momento de exibição | Núcleo; dados das tarefas TMDB e TVmaze | `air_date`, `airstamp` |
| **R21**, **R21a** Aviso na exibição e tipos | Tarefa de planejamento de avisos (seção 4.3) | `notification_settings`, `scheduled_notifications` |
| **R22** **Lembrete 1 h antes** | Tarefa de planejamento (só com momento exato) | idem |
| **R22a** Horário silencioso | Planejamento (calcula `deliver_at`) e envio (junta avisos da mesma série) | `quiet_*`, `profiles.timezone` |
| **R23** Fusos | Momentos em UTC no banco; conversão no app e no planejamento | `profiles.timezone` |
| **R24** **Seus números** | Função do banco `my_numbers()`: soma e contagem sobre `watches` | `episodes.runtime`, `titles.runtime` |
| **R25** Duração | Núcleo, rodando na tarefa de atualização; resultado gravado | `episodes.runtime`, `runtime_is_estimated` |

---

## 3. Segurança e privacidade

### Row Level Security (RLS)

RLS é uma trava dentro do próprio banco: cada tabela tem regras que dizem
quem pode ler e gravar cada linha. Como o app acessa o banco direto para
ler, essa trava é o que impede uma pessoa de ver os dados de outra, mesmo
que alguém modifique o app.

| Tabelas | Ler | Gravar |
|---|---|---|
| `profiles`, `notification_settings`, `push_tokens`, `collections`, `collection_items` | Só a própria pessoa | Só a própria pessoa, com regras do banco (limite de coleções, tema e ícone do Premium) |
| `user_titles`, `watches`, `undo_actions`, `user_title_progress`, `scheduled_notifications`, `imports`, `import_unmatched`, `subscriptions` | Só a própria pessoa | Só o servidor (pelas Edge Functions), porque toda gravação aqui tem regra |
| `titles`, `seasons`, `episodes`, `app_config` | Qualquer pessoa logada | Só o servidor |
| `apple_credentials`, `revenuecat_events` | Ninguém pelo app | Só o servidor |

Regra prática para a Fase 4: **toda tabela nova nasce com RLS ligado e sem
nenhuma permissão**; as permissões são abertas uma a uma, como na tabela
acima. Um teste automático confere que uma segunda conta de teste não
enxerga nada da primeira.

### Chaves

| Chave | Onde fica | Por quê |
|---|---|---|
| Chave da API do TMDB | Só nos segredos das Edge Functions | Regra 3 do CLAUDE.md. |
| Chave de serviço do Supabase (passa por cima do RLS) | Só nos segredos das Edge Functions | Quem tem essa chave lê tudo. Nunca no app nem no repositório. |
| Chave secreta da API do RevenueCat e senha do webhook | Só nos segredos das Edge Functions | O webhook só aceita chamadas com a senha combinada no painel do RevenueCat. |
| Token de acesso do Expo Push | Só nos segredos das Edge Functions | Com a "segurança de push" ligada no Expo, só o nosso servidor consegue mandar aviso para os nossos aparelhos. |
| Chave privada do "Entrar com Apple" | Só nos segredos das Edge Functions e no painel do Supabase Auth | Usada para revogar o acesso na exclusão. |
| Endereço do Supabase e chave pública (anon) | No app | São públicas por natureza; a proteção é o RLS. |
| Chaves públicas do SDK do RevenueCat | No app | Também públicas por natureza; só servem para comprar. |

O TVmaze não usa chave na API pública. Nenhuma credencial encontrada no APK
do TV Time é usada (regra 9 do CLAUDE.md).

Segredos nunca entram no repositório. Um arquivo de exemplo, sem valores,
lista os nomes das variáveis.

### Exclusão de conta

Função `delete-account`, chamada por **Excluir conta** (fluxo 4.5):

1. Confere que quem pede é o dono da conta (login válido).
2. Conta Apple: revoga o acesso do app junto à Apple com o token de
   `apple_credentials`.
3. Apaga os arquivos da pessoa no Storage (arquivos não somem em cascata).
4. Pede ao RevenueCat que apague o cliente e os dados dele lá. A assinatura
   na loja continua, como avisa a confirmação. **(a verificar:** a chamada
   de exclusão de cliente na API do RevenueCat.)
5. Apaga a conta do Auth. A cascata apaga `profiles` e, a partir dele, todas
   as tabelas da seção 2 com `user_id`: acervo, registros, coleções e itens,
   opções, aparelhos, avisos agendados, assinatura, importações,
   ações de desfazer e credenciais da Apple.
6. O catálogo (`titles`, `seasons`, `episodes`) fica, porque não tem dado
   pessoal.

Depois disso, entrar com a mesma conta Google ou Apple cria uma conta nova,
do zero (item 1).

A página web de exclusão (exigência do Google Play) é uma página pública
simples, hospedada de graça (por exemplo, no GitHub Pages), com o e-mail
dedicado do Glowbox como contato (decisão 4 da seção 7).

### O que entra na política de privacidade

A política (item 12) precisa dizer, em linguagem simples:

- **Quem é o responsável** pelos dados e o contato para pedidos, o e-mail
  dedicado do Glowbox (exigência da LGPD; decisão 4 da seção 7).
- **Dados guardados:** conta (nome, e-mail e foto vindos do Google ou da
  Apple; e-mail pode ser o endereço de retransmissão da Apple), **Minhas
  séries**, **Meus filmes**, coleções, registros de **Visto** com data e
  hora, opções do app e de aviso, fuso do aparelho, endereço de notificação
  e tipo de aparelho, situação da assinatura (plano, datas; **nenhum dado de
  pagamento**, que fica com a loja) e o arquivo de importação, apagado depois
  de lido.
- **Para que:** mostrar o acervo e o progresso, mandar avisos, liberar o
  Premium. Sem anúncios e sem venda de dados.
- **Com quem é compartilhado e por quê:** Supabase (hospeda o banco e o
  login), Expo e os serviços de notificação do Google e da Apple (entregam os
  avisos; o texto do aviso passa por eles), RevenueCat e as lojas
  (assinatura), Google e Apple (login). TMDB e TVmaze **não** recebem dados
  pessoais: o servidor pede só dados de séries.
- **Onde ficam os dados** (região São Paulo, decisão 3 da seção 7) e que
  alguns serviços ficam fora do Brasil.
- **Por quanto tempo:** enquanto a conta existir; registros técnicos (eventos
  de assinatura, avisos enviados) por tempo limitado (seção 4.9).
- **Como excluir:** dentro do app (Configurações > Conta) e pela página web,
  com o endereço dela, e o que é apagado.
- **Direitos da LGPD:** acesso, correção, exclusão, e como pedir.
- **Idade mínima**, de acordo com a classificação escolhida nas lojas.
- Se for adotado um serviço de registro de falhas, ele entra na lista de
  compartilhamento.

---

## 4. Tarefas no servidor

Todas são Edge Functions. As de "relógio" são chamadas pelo Cron do
Supabase; as outras, pelo app ou pelo RevenueCat. As frequências são o
ponto de partida e podem ser ajustadas com uso real.

### Funções chamadas pelo app

| Função | Quando roda | O que faz |
|---|---|---|
| `search` | Ao digitar em **Buscar**, depois de uma pausa | Consulta o TMDB (séries e filmes), devolve os resultados e marca quais já estão no acervo da pessoa. |
| `title` | Ao abrir uma Página da série ou do filme | Se o título não está no catálogo, ou está desatualizado há mais de 24 horas, busca no TMDB e grava. Devolve os dados. Na tela Episódio, busca também o resumo do episódio no TMDB, sem guardar (decisão 6 da seção 7). |
| `library` | **Adicionar**, **Quero ver**, **Larguei**, **Retomar**, **Tirar de Minhas séries**, **Tirar de Meus filmes**, **Incluir extras**, **Desfazer** | Aplica R2, R3 e R12, grava a cópia para desfazer, recalcula o resumo e replaneja os avisos da série. |
| `mark` | **Vi**, **Marcar anteriores**, **Marcar temporada**, **Desmarcar**, **Vi de novo** | Confere os anteriores (R8), grava ou apaga registros com `action_id`, aplica a retomada (R4), atualiza `last_activity_at`, recalcula o resumo e cancela os avisos pendentes dos episódios marcados. Devolve o resumo novo; se for diferente do que o app previu, o app corrige a tela. |
| `delete-account` | **Excluir conta** | Seção 3. |

### 4.1 Atualização das séries acompanhadas (TMDB)

- **Quando:** a cada hora, processa as séries com `next_sync_at` vencido.
  Uma vez por dia, consulta a lista de "títulos que mudaram" do TMDB e
  antecipa a atualização desses. Só entram séries que estão no acervo de
  alguém.
- **Ritmo por série:**
  - em produção com episódio nos próximos 14 dias: a cada 6 horas;
  - em produção sem episódio próximo: uma vez por dia;
  - **Fim da série** ou **Cancelada**: uma vez por semana (pega revival,
    R13).
- **O que faz:**
  1. Busca a série e as temporadas no TMDB (em português, com o inglês como
     reserva) e atualiza `titles`, `seasons` e `episodes`.
  2. Recalcula a duração de cada episódio pela R25.
  3. Se algo mudou (episódio novo, data nova, situação nova), recalcula o
     resumo de todas as pessoas que acompanham a série. Nesse recálculo,
     marca **Novos episódios** em quem saiu de **Aguardando** ou
     **Concluída** (R13) e **Temporada N disponível** em quem está em
     **Quero ver** ou **Larguei** (R14).
  4. Pede o replanejamento dos avisos da série.
- **Filmes:** só são atualizados ao abrir a página, se estiverem com mais
  de 7 dias (pouca coisa muda).

### 4.2 Horários (TVmaze)

- **Quando:** casamento uma vez por série, logo depois de ela entrar no
  catálogo; atualização de horários uma vez por dia, e de novo nas 6 horas
  antes de um episódio previsto. Uma vez por dia, a lista de "séries que
  mudaram" do TVmaze antecipa as que mudaram.
- **O que faz:**
  1. **Casamento:** procura a série no TVmaze pelo IMDb ou pelo TheTVDB que
     o TMDB forneceu. Sem resultado, grava "não encontrada" e a série fica
     só com datas (R20). Tenta de novo uma vez por mês.
  2. **Horários:** busca os episódios da série no TVmaze e, para cada
     episódio casado por temporada e número, grava `airstamp` e
     `runtime_tvmaze`.
  3. Se um horário mudou, recalcula os resumos e replaneja os avisos da
     série (R20: "o backend reagenda").
- **Cuidados:** respeitar o limite de chamadas do TVmaze **(a verificar:**
  cerca de 20 chamadas a cada 10 segundos por endereço), e a atribuição
  CC BY-SA nos **Créditos**.

### 4.3 Planejamento dos avisos

- **Quando:** a cada 15 minutos para todo mundo, olhando as próximas 48
  horas; e na hora, para uma pessoa e uma série, depois de `library`,
  `mark`, mudança nas opções de aviso, mudança de fuso ou atualização da
  série.
- **O que faz,** para cada pessoa e cada série com intenção "acompanhando"
  (nunca **Quero ver** nem **Larguei**, R3, R14):
  1. Pega os episódios contáveis não vistos que vão ao ar nas próximas 48
     horas (R11, R12).
  2. Agrupa por série e por dia no fuso da pessoa (R18, R19); o grupo recebe
     o tipo do primeiro episódio: **Estreia** se for o E1 de uma temporada,
     **Episódio novo** se não (R21a).
  3. Conforme as opções do tipo, cria as variantes: aviso na hora e
     **Lembrete 1 h antes** para momento exato (o lembrete só para o
     primeiro episódio do grupo, R19); **Aviso no dia** às 10h para "só
     data" (R21, R22).
  4. Calcula `deliver_at`: se cair no horário silencioso, vai para o fim
     dele (R22a).
  5. Grava ou atualiza pelos `dedupe_key`; cancela os pendentes que não
     valem mais (série largada, episódio marcado, opção desligada).

### 4.4 Envio dos avisos (Expo Push)

- **Quando:** a cada minuto.
- **O que faz:**
  1. Pega os avisos pendentes com `deliver_at` vencido.
  2. **Confere de novo** antes de mandar: o episódio ainda não foi visto, a
     série continua acompanhada, o tipo continua ligado. Isso garante que
     marcar **Visto** cancela o aviso mesmo que o cancelamento da função
     `mark` tenha falhado (item 9).
  3. Junta avisos da mesma série com o mesmo `deliver_at` (o caso do fim do
     horário silencioso). Se o episódio já foi ao ar, o lembrete vira o
     aviso de que foi ao ar, com o horário (R22a).
  4. Monta o texto sem título de episódio (diretriz 8): série, temporada e
     número, e o número de episódios quando for grupo. O toque abre a Página
     da série na temporada do episódio (`03-telas.md`, entradas de fora).
  5. Envia pelo Expo Push em lotes, para todos os aparelhos ativos da
     pessoa, e marca como enviado.
- **Recibos:** a cada 15 minutos, consulta os recibos do Expo; aparelho que
  não aceita mais avisos ganha `disabled_at` e sai dos próximos envios.

### 4.5 Recálculo por horário

- **Quando:** a cada 15 minutos.
- **O que faz:** refaz o resumo das linhas com `next_change_at` vencido.
  Exemplo da R6: o episódio das 22h vai ao ar, e a série passa de
  **Aguardando** para **Vendo** e sobe na **Fila** (R7). O app, ao abrir,
  também confere `next_change_at` e pede o recálculo se estiver vencido,
  para não esperar a tarefa.

### 4.6 Webhook do RevenueCat

- **Quando:** a cada evento de assinatura (compra, renovação, cancelamento,
  fim, reembolso, problema de cobrança, transferência).
- **O que faz:**
  1. Confere a senha do webhook; sem ela, recusa.
  2. Grava o evento em `revenuecat_events`; se já existe, para (evento
     repetido).
  3. Em vez de confiar só no conteúdo do evento, pergunta ao RevenueCat a
     situação atual da pessoa e grava em `subscriptions` (padrão recomendado
     pelo RevenueCat, que resolve eventos fora de ordem).
  4. **Transferência** (fluxo 4.8, **Restaurar compras** em outra conta do
     Glowbox): atualiza as duas contas; a antiga perde o Premium.
- **Reserva:** uma vez por dia, confere com o RevenueCat as assinaturas
  ativas que já deviam ter vencido ou renovado, caso algum webhook tenha se
  perdido. O fim do Premium não depende dessa tarefa: `has_premium` já olha
  `expires_at`.
- **Efeitos do fim do Premium** (`02-monetizacao.md`): nada é apagado. O app
  volta tema e ícone ao padrão na próxima abertura, e o limite de coleções
  volta a valer na próxima criação.

### 4.7 Importar histórico (condicional)

- **Quando:** sob pedido. O app envia o arquivo ao Storage e chama
  `import-start`; o processamento continua pelo relógio, a cada minuto, até
  terminar.
- **O que faz:**
  1. Lê o arquivo. **(a verificar:** o formato do arquivo de exportação só
     será conhecido quando o Felippe encontrá-lo; esta parte é desenhada de
     novo nesse momento.) Arquivo ilegível vira erro com a causa.
  2. Para cada série ou filme: busca no TMDB pelo identificador do TheTVDB
     ou do IMDb que vier no arquivo; na falta, por título e ano. Não achou:
     vai para `import_unmatched`.
  3. Põe o título no acervo (sem mudar quem já está lá) e cria os registros
     com `is_batch`, `source = import` e a chave única `import_key`, que
     impede duplicar ao importar de novo.
  4. Processa em partes, guardando `cursor`, para não estourar o tempo
     máximo de uma Edge Function **(a verificar:** limite atual de tempo por
     chamada).
  5. No fim, recalcula os resumos (R1), apaga o arquivo e grava os
     contadores. Não usa a R9 (a importação já traz a escolha).

### 4.8 Resumo para os widgets

- **Quando:** no aparelho, sempre que o app abre, marca algo ou recebe uma
  atualização da **Fila**.
- **O que faz:** o app grava no aparelho (no espaço compartilhado com o
  widget) as primeiras séries da **Fila** com pôster e "Próximo: T2 E5", os
  próximos itens da **Agenda** com os momentos de exibição, e se a pessoa
  tem Premium. Depois pede ao sistema para redesenhar o widget. Como o
  resumo inclui os momentos de exibição, o widget da **Agenda** se ajusta
  com a passagem do tempo sem internet.
- **Limite da v1:** se a pessoa não abrir o app, a **Fila** do widget não
  ganha episódios novos que saírem. Atualizar o widget pelo servidor (aviso
  silencioso que acorda o app) fica como melhoria, se o item 16 exigir.

### 4.9 Limpeza

- **Quando:** uma vez por dia, de madrugada (UTC).
- **O que faz:** apaga `undo_actions` vencidas, avisos enviados ou
  cancelados com mais de 30 dias, eventos do RevenueCat com mais de 90 dias,
  aparelhos desativados há mais de 30 dias e arquivos de importação
  esquecidos no Storage.

---

## 5. Custos e limites

Todos os valores de plano abaixo são **(a verificar)**: são lembrança de
como os planos estavam e mudam com frequência. Conferir nas páginas de preço
oficiais antes de cada marco que dependa deles.

### Supabase

| | Grátis | Pro (cerca de US$ 25 por mês) |
|---|---|---|
| Banco de dados | 500 MB | 8 GB incluídos |
| Contas ativas por mês | 50 mil | 100 mil incluídas |
| Transferência de dados | 5 GB por mês | 250 GB incluídos |
| Edge Functions | 500 mil chamadas por mês | 2 milhões incluídas |
| Storage | 1 GB | 100 GB incluídos |
| Cópia de segurança diária | Não | Sim, 7 dias |
| Projeto pausado por falta de uso | Sim, depois de 1 semana sem acesso | Não |

**Onde aperta primeiro: o tamanho do banco.** Estimativa grosseira:
- Catálogo: com 5 mil séries diferentes, cerca de 300 mil episódios. Cada
  episódio com título e resumo ocuparia perto de 1 KB: cerca de 300 MB. Sem
  guardar o resumo (decisão 6 da seção 7), o catálogo fica em algo como
  100 MB.
- Registros: cada linha de `watches` com índices ocupa perto de 100 bytes.
  Mil pessoas com 1.500 registros cada são 1,5 milhão de linhas: cerca de
  150 MB. Quem importa histórico de anos pode ter 5 a 10 mil registros.

Ou seja, o grátis aguenta o desenvolvimento e um beta de algumas centenas de
pessoas. **Paga-se o Pro** quando o banco passar de uns 400 MB, ou antes do
lançamento público por causa da cópia de segurança (decisão 2 da seção 7: Pro a partir do lançamento público).

**Chamadas de Edge Functions:** cada **Vi** é uma chamada, e o relógio faz
cerca de 100 mil chamadas por mês sozinho (envio a cada minuto, mais as de
15 minutos e de hora em hora). Mil pessoas marcando 10 episódios por dia
dão mais 300 mil. Cabe no grátis no começo; com alguns milhares de pessoas
ativas, passa.

### Expo e EAS

| | Grátis | Quando pagar |
|---|---|---|
| Builds na nuvem (EAS Build) | Cerca de 30 por mês, até 15 de iOS, em fila mais lenta | Plano pago (a partir de cerca de US$ 19 por mês) se a fila atrapalhar. Builds de Android podem ser feitos de graça no próprio computador, no Ubuntu do WSL. Builds de iOS locais exigem Mac. |
| Atualização sem loja (EAS Update) | Cerca de mil pessoas por mês | Só se for usado e passar disso. Não é obrigatório na v1. |
| Envio para as lojas (EAS Submit) | Gratuito | — |
| Expo Push | Gratuito, com limite de envio por segundo alto para o nosso tamanho | Sem cobrança prevista. O Firebase (usado por baixo no Android) também é gratuito para notificações. |

### RevenueCat

- Gratuito até cerca de **US$ 2.500 de receita mensal** acompanhada; acima
  disso, cerca de **1%** da receita. Com R$ 6,90 e R$ 39,90, isso significa
  algo como 2 mil assinantes antes de pagar qualquer coisa.

### Outros custos

| Item | Valor | Quando |
|---|---|---|
| Apple Developer | US$ 99 por ano | **Antes do previsto:** é preciso para instalar o app num iPhone de teste, para configurar **Entrar com Apple** (mesmo no Android) e para testar compras na Apple. Assinada ao começar o M8 (decisão 1 da seção 7). |
| Google Play | US$ 25, uma vez | Antes do marco de assinatura: compras de teste no Google Play exigem o app enviado a uma trilha de teste da loja. Para os outros marcos, o app é instalado direto no celular, sem a loja. |
| Licença comercial do TMDB | Desconhecido | Antes do lançamento com Premium (regra 8 do CLAUDE.md); plano B se não sair. |
| TVmaze | Gratuito | A API pública permite uso comercial com atribuição CC BY-SA **(a verificar** nos termos da API). |
| Domínio glowbox.app.br | Cerca de R$ 40 por ano **(a verificar)** | Antes do lançamento (política e termos). A página de exclusão não depende dele (decisão 4 da seção 7). |
| Registro de falhas (opcional, como Sentry) | Plano grátis existe | Opcional; se adotado, entra na política de privacidade. |

Isso muda uma premissa de `01-escopo-v1.md` ("Custos só na publicação"): a
conta da Apple, e depois a do Google Play, entram durante a construção.

---

## 6. Plano de construção da Fase 4

Ordem do escopo: núcleo (itens 1 a 12) → coleções (13) → assinatura (14) →
temas e ícones (15) → widgets (16). Cada marco termina com algo que roda no
celular e pode ser conferido com sim ou não. Os marcos do núcleo começam
pelo Android; o iOS entra no M8 (decisão 1 da seção 7).

### M0. App vazio rodando no celular

- **Entrega:** projeto Expo em TypeScript dentro de `app/`, com Expo Router
  e as quatro abas (**Séries**, **Filmes**, **Buscar**, **Perfil**) com
  telas vazias; build de desenvolvimento de Android feito pelo EAS; projeto
  do Supabase criado, vazio; pasta `core/` com um teste de exemplo rodando.
- **Teste no celular:** instalar o build no Android, abrir, tocar nas quatro
  abas, tocar de novo na aba aberta. Mudar um texto no computador e ver a
  tela mudar no celular sem novo build.
- **Cobre:** nenhum item; prepara todos.

### M1. Entrar com Google

- **Entrega:** tela **Entrada**, **Entrar com Google**, tabela `profiles`
  com RLS, **Sair**, link da Política de privacidade (rascunho).
- **Teste no celular:** entrar, fechar o app, abrir e continuar dentro;
  **Sair** e voltar à **Entrada**; cancelar o login sem ver mensagem de
  erro; modo avião mostra a causa. Com uma segunda conta, conferir que os
  dados da primeira não aparecem.
- **Cobre:** item 1 (parte: Google, sair); item 12 (Política na entrada).

### M2. Buscar e páginas (só leitura)

- **Entrega:** funções `search` e `title`; tabelas do catálogo; telas
  **Buscar**, Página da série (temporadas, episódios, datas, situação de
  produção, regra de spoiler), Página do filme e tela Episódio; **Créditos**
  com TMDB e TVmaze.
- **Teste no celular:** buscar uma série e um filme, ver pôster, ano e tipo;
  abrir a série e conferir temporadas e "sem data"; título de episódio não
  aparece; modo avião mostra "Tentar de novo".
- **Cobre:** item 2; itens 3 e 4 (leitura); item 12 (créditos).

### M3. Acervo e estados

- **Entrega:** `user_titles`, `user_title_progress`, função `library`,
  **Adicionar**, **Quero ver**, **Larguei**, **Retomar**, **Tirar de Minhas
  séries** e **Tirar de Meus filmes** com **Desfazer** por 6 segundos; telas
  **Minhas séries** e **Meus filmes** (**Quero ver**); estados R1 no núcleo,
  com os exemplos da nota 04 como testes.
- **Teste no celular:** adicionar 3 séries e 2 filmes; mudar estados; tirar
  uma série e desfazer; tirar e fechar o app antes dos 6 segundos, abrir e
  conferir que saiu.
- **Cobre:** itens 3 e 4 (acervo); R1, R2, R3, R14 (etiqueta, sem dados
  ainda).

### M4. Marcar

- **Entrega:** `watches`, `undo_actions`, função `mark`; **Vi** com
  animação e reversão se o servidor recusar; **Marcar anteriores** com
  **Lembrar minha escolha** e a opção em Configurações; **Marcar
  temporada**; **Desmarcar**; **Vi de novo** com selo **2×**; R10; **Extras**
  e **Incluir extras**; filmes com **Vi** e **Vistos**.
- **Teste no celular:** marcar o E5 sem nada visto e responder a pergunta;
  marcar temporada e desfazer; marcar episódio futuro; **Vi de novo** e
  desmarcar só a última vez; ligar "reduzir movimento" no aparelho e ver a
  troca simples; modo avião não marca.
- **Cobre:** itens 5 e 8; item 4 (marcar); R4, R8 a R12, R15 a R17.

### M5. Fila, Agenda e atualização das séries

- **Entrega:** telas **Fila** (três blocos, "+N", **Novos episódios**, **Vi**
  com **Desfazer**) e **Agenda** (por dia, bloco numa linha, hora quando
  conhecida); tarefas 4.1, 4.2 e 4.5; "horário não informado".
- **Teste no celular:** escolher uma série semanal que tenha episódio nos
  próximos dias e conferir a **Agenda** e a hora; esperar o episódio sair e
  ver a série subir na **Fila**; mudar o fuso do aparelho e ver as horas
  mudarem; ver uma série com temporada inteira lançada de uma vez.
- **Cobre:** itens 6 e 7; R5 a R7, R13, R14, R18 a R20, R23, R25.

### M6. Avisos

- **Entrega:** `push_tokens`, `notification_settings`,
  `scheduled_notifications`; explicação dos avisos com **Ativar avisos** e
  **Agora não**, e a segunda chance ao adicionar a primeira série;
  Configurações > Avisos; tarefas 4.3 e 4.4; toque no aviso abre a série.
- **Teste no celular:** uma função só de teste, desligada em produção, cria
  um episódio falso que vai ao ar em 5 minutos; conferir o lembrete e o aviso
  na hora conforme as opções; pôr o horário silencioso cobrindo a hora atual
  e ver o aviso chegar no fim dele; marcar **Visto** antes e ver que nada
  chega; negar a permissão e ver o aviso no topo de Configurações > Avisos.
- **Cobre:** item 9; R3, R18, R19, R21 a R23.

### M7. Perfil, Seus números, Configurações e exclusão

- **Entrega:** telas **Perfil** e **Seus números** (com "aproximado"); as
  seções de Configurações que faltam (**Conta**, **Sobre**); **Excluir
  conta** com a função `delete-account`; página web de exclusão; Política de
  privacidade e Termos de uso publicados.
- **Teste no celular:** marcar e desmarcar e ver os números mudarem;
  excluir uma conta de teste e entrar de novo com ela, começando do zero;
  abrir a Política e os Termos pelo app.
- **Cobre:** item 10; item 1 (exclusão); item 12.

### M8. iPhone e Entrar com Apple

- **Entrega:** build de desenvolvimento de iOS; **Entrar com Apple** nos dois
  sistemas; revogação na exclusão; ajustes do que for diferente no iOS.
- **Teste no celular:** num iPhone, repetir os testes de M1 a M7; criar
  conta com Apple, excluir e conferir que o app sumiu de "Apps que usam o
  ID Apple" nos ajustes do iPhone.
- **Cobre:** item 1 completo; itens 2 a 12 no iOS.

### M9. Importar histórico (condicional)

- **Entrega:** se o arquivo de exportação existir e for legível: tela
  **Importar histórico**, tarefa 4.7, resultado em Configurações.
- **Teste no celular:** importar o arquivo do próprio Felippe; conferir
  contadores e não encontrados; importar de novo e ver "nada novo entrou".
- **Cobre:** item 11. Se o arquivo não aparecer, o marco é pulado.

**Fim do núcleo:** beta fechado com poucas pessoas (trilha de teste interna
do Google Play e TestFlight da Apple).

### M10. Coleções

- **Entrega:** **Minhas coleções**, **Coleção**, **Salvar em coleção**,
  **Nova coleção**, renomear, apagar, arrastar; limite de 3 no banco
  (`has_premium` ainda responde sempre "não").
- **Teste no celular:** criar 3 coleções, tentar a 4ª e ver a explicação;
  pôr a mesma série em duas coleções; tirar a série de **Minhas séries** e
  ver que continua nas coleções.
- **Cobre:** item 13.

### M11. Glowbox Premium

- **Entrega:** produtos nas duas lojas e no RevenueCat; tela **Glowbox
  Premium**; **Assinar**, **Restaurar compras**, **Gerenciar assinatura**;
  webhook (4.6), `subscriptions`, `has_premium`, `app_config` com o
  interruptor do plano B; aviso de assinatura em **Excluir conta**.
- **Teste no celular:** comprar com conta de teste da loja (sem cobrança
  real) e ver o Premium liberar sem reiniciar; criar a 4ª coleção; cancelar
  e esperar o fim (nas lojas de teste o período é encurtado para minutos);
  **Restaurar compras** noutro aparelho e noutra conta do Glowbox; desligar
  `premium_enabled` e ver a tela e os convites sumirem.
- **Cobre:** item 14; item 13 (limite com Premium).

### M12. Temas e ícones

- **Entrega:** temas alternativos e ícones alternativos em Configurações >
  **Aparência**, com convite para quem não tem Premium e volta ao padrão no
  fim do Premium.
- **Teste no celular:** trocar o tema e ver todas as telas mudarem na hora;
  trocar o ícone e ver na tela inicial do Android e do iPhone; cancelar o
  Premium de teste e abrir o app de novo.
- **Cobre:** item 15.

### M13. Widgets (pode ir para a v1.1)

- **Entrega:** widgets da **Fila** e da **Agenda**, em dois tamanhos, primeiro
  no Android, depois no iOS; resumo da seção 4.8; widget sem Premium abre a
  tela **Glowbox Premium**.
- **Teste no celular:** pôr os dois widgets na tela inicial; marcar um
  episódio no app e ver o widget mudar em poucos minutos; tocar numa série
  e abrir a página dela; testar sem Premium.
- **Cobre:** item 16.

---

## 7. Decisões do Felippe (aprovadas em 14/10/2026)

As seis decisões foram aprovadas como recomendado, com um ajuste na 4.

1. **Quando pagar a conta de desenvolvedor da Apple (US$ 99 por ano).**
   Sem ela, não dá para instalar o app num iPhone nem configurar **Entrar com
   Apple**. **Decisão:** construir de M0 a M7 só no Android e assinar a Apple
   ao começar o M8. A premissa de custos de `01-escopo-v1.md` foi atualizada.

2. **Plano do Supabase no lançamento.** O grátis basta para construir e para
   o beta, mas não tem cópia de segurança. **Decisão:** grátis durante a
   Fase 4 e o beta; Pro (cerca de US$ 25 por mês) a partir do lançamento
   público.

3. **Onde ficam os servidores.** A região é escolhida na criação do projeto
   e não pode ser mudada depois sem migrar tudo. **Decisão:** São Paulo,
   mais rápido para quem está no Brasil e mais simples para a política de
   privacidade. O preço é o mesmo **(a verificar)**.

4. **Como atender a página web de exclusão.** O Google Play exige uma página
   onde dá para pedir a exclusão sem abrir o app. **Decisão (com ajuste):**
   página simples, hospedada de graça (por exemplo, no GitHub Pages), sem
   depender do domínio glowbox.app.br. Ela explica como excluir pelo app e
   oferece como contato um e-mail gratuito dedicado ao app (por exemplo, um
   Gmail próprio do Glowbox), para quem não tem mais o app. O Felippe confere
   o pedido e exclui pelo painel, em até 30 dias, como a política vai dizer.
   Um formulário automático fica para quando os pedidos forem muitos. O mesmo
   e-mail serve de contato na política de privacidade. Pendência nova: criar
   o e-mail dedicado do Glowbox.

5. **Prazo para decidir a importação do TV Time.** Sem o arquivo, a tarefa
   4.7 não pode ser desenhada de verdade. **Decisão:** procurar o arquivo
   durante os marcos M0 a M5. Se até o fim do M5 ele não aparecer, ou não for
   legível, o item 11 sai da v1 e o M9 é pulado.

6. **Guardar ou não o resumo dos episódios no banco.** Guardar ocuparia uns
   200 MB a mais e anteciparia o plano Pro. **Decisão:** não guardar o
   resumo; o servidor busca quando a tela Episódio abre (e o app só mostra
   conforme a regra de spoiler). O título do episódio continua guardado.

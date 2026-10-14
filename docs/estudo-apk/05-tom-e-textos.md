# 05 – Tom e textos

## Pergunta

Como o TV Time falava com quem usava o app em português do Brasil? Qual era
a voz, quão completa e cuidada era a tradução, e que nomes ele dava aos
conceitos do núcleo (estados da série, marcar visto, próximo episódio,
especiais, estatísticas, notificações)? A partir disso, que termos e que
voz o nosso app deve adotar?

Os textos foram lidos só como referência de estilo. Nenhuma frase do TV Time
foi copiada para esta nota; aparecem apenas termos genéricos de uma ou duas
palavras quando a comparação exige.

## Conclusão

1. **Voz correta, mas sem personalidade.** O pt-BR trata por "você" em todo
   lugar, num registro de app corporativo, meio formal. O humor do original
   em inglês é raro e quase sempre se perde ou fica literal na tradução.
   Quase não há emoji (um só em todo o arquivo). Os textos são muito curtos
   (mediana de 3 palavras).
2. **Cobertura alta, qualidade irregular.** 845 de 850 chaves existem em
   pt-BR (99,4%). As que faltam também faltam no pt de Portugal e são
   recentes. O problema não é falta de tradução, e sim: trechos inteiros em
   português de Portugal dentro do arquivo brasileiro, sinais claros de
   tradução automática e o mesmo conceito com nomes diferentes.
3. **A terminologia do núcleo é inconsistente.** O conceito "para depois"
   tem quatro nomes diferentes; a palavra usada para o estado "terminei a
   série" é a mesma de "episódio visto"; "em breve" serve para duas coisas
   diferentes. Isso confirma que vale a pena o nosso app ter um glossário
   fechado desde a Fase 3.
4. **Nosso glossário (seção 4) troca quase todos os termos centrais** por
   palavras próprias, mantendo os que são vocabulário comum da língua
   (temporada, episódio, notificações). A nota 04 usa hoje alguns nomes de
   trabalho que coincidem com os do TV Time (**Assistindo**, **Em dia**,
   **Para depois**, "assistir a seguir"); a proposta é substituí-los na
   especificação da Fase 3.
5. **Diretrizes de voz (seção 5):** você, frases curtas, verbo no
   imperativo, erro que diz o que fazer, emoji só em comemorações, um termo
   por conceito.

## Evidência

Fonte: `assets/flutter_assets/resources/i18n/` do base.apk 10.11.0
(extraído pelo apktool em `~/estudo-tvtime/saidas-rea/apktool-base/`).
Arquivos lidos: `pt-BR.json`, `pt.json` e `en.json`. As contagens abaixo
foram feitas com um script descartável, fora do repositório, que achata as
chaves aninhadas (plurais como `nb_shows.one` contam como chaves próprias).

### Números gerais

| Medida | en | pt-BR | pt |
|---|---|---|---|
| Chaves | 850 | 845 | 845 |
| Textos com emoji | 1 | 1 | 1 |
| Pontos de exclamação | 23 | 22 | 20 |
| Média de palavras por texto | 3,6 | 4,0 | 4,0 |

- Mediana em pt-BR: 3 palavras.
- pt-BR e pt têm o mesmo texto em 431 das 845 chaves; quase sempre palavras
  neutras (Séries, Filmes, Temporada, Cancelar).
- Há um `crowdin.yml` na mesma pasta: as traduções eram geridas na
  plataforma Crowdin. Ver Limitações.

## 1. Voz

**Tratamento.** Sempre "você", explícito ou implícito no possessivo
(49 textos com "você" e 48 com "seu/sua"). Nenhum "tu". O pt de Portugal
usa terceira pessoa formal sem pronome, o que é normal lá.

**Formalidade.** Média para alta, com fórmulas de app traduzido:
- pedidos de confirmação no padrão "tem certeza de que deseja…" (7 textos
  com "certeza", 10 com "deseja");
- erros no padrão impessoal "houve uma falha no…" (6 textos) ou "não foi
  possível…";
- "por favor" do inglês quase sempre cortado, o que é bom.

**Imperativo.** Instruções sempre no imperativo de "você" (Tente, Acesse,
Ative, Toque, Insira). "Tente" aparece em 16 textos, quase todos de erro.

**Humor.** Pouco, e concentrado em três lugares:
- mensagens de estado da série (quando termina uma série ou fica em dia), uma
  delas com bordão de desenho animado clássico traduzido ao pé da letra;
- avisos de spoiler, em tom de alerta brincalhão;
- um jogo de votação com carimbos de sim/não, que em inglês eram gírias e em
  português viraram palavras neutras.
O inglês joga com o nome do app no título das estatísticas (o tempo gasto
vendo TV tem o mesmo nome da marca). Em pt-BR o trocadilho some e sobra uma
expressão literal.

**Emoji e exclamação.** Um único emoji (um coração, no pedido de avaliação
na loja). Exclamações aparecem em estados vazios, confirmações de "adicionado"
e convites a ativar notificações.

**Tamanho.** Rótulos de 1 a 3 palavras dominam (botões, abas, estados).
Textos longos são só os jurídicos (exclusão de conta, privacidade, contatos)
e as explicações de recursos sociais.

**Linguagem inclusiva, mas pela metade.** Em alguns pontos o pt-BR evita o
masculino genérico (convite para comentar e lista de curtidas usam "pessoa"),
mas em outros mantém o masculino (convite para criar tópico, agradecimento,
denúncia de trapaça).

## 2. Cobertura e qualidade

**Chaves sem tradução (5):** `show_tab_remove_button`, `hide_feed_item`,
`remove_subscription_service_question_title`,
`remove_subscription_service_remove_button`,
`remove_subscription_service_cancel_button`. Também faltam em `pt.json`; o
app deve cair para o inglês nelas.

**Iguais ao inglês (17):** quase todas legítimas: marcas (X, Whatsapp),
estrangeirismos aceitos (Feed, Spoiler, Spam, Meme, App, Global, Popular) e
formatos numéricos (`episode_format`, `count_x_of_total_y`,
`min_per_episode_short`). A exceção é `nb_votes.one`, que ficou com a palavra
inglesa.

**Português de Portugal dentro do pt-BR (12 chaves).** Concentrado em
blocos, o que sugere lotes traduzidos por outra pessoa ou copiados do pt:
- onboarding inteiro (`onboarding_setup_shows_*`,
  `onboarding_setup_watched_movies_title`,
  `onboarding_setup_movies_to_watch_*`,
  `onboarding_setup_notifications_description`) e os exemplos de
  notificação (`episode_notification_example`, `show_notification_example`):
  gerúndio lusitano ("a começar"), possessivo com artigo, pronome "lhe";
- aviso de spoiler de filme (`movie_display_comments_alert_message`,
  `movie_display_comments_watched_movie_button`);
- `save_image_share_menu_text` (Guardar) e
  `social_login_deprecated_dialog_title` (Iniciar sessão).

**Sinais de tradução automática ou sem revisão:**
- `settings_app_feed_title`: o substantivo "feed" foi traduzido como o verbo
  (alimentar);
- `instagram_stories_share_menu_text` e `facebook_stories_*`: nome de
  recurso de marca traduzido literalmente;
- `find_friend_twitter` e `sign_up_with_twitter_button`: o "X" (rede social)
  tratado como se fosse número ou palavra;
- `settings_already_linked_dialog_title`: sentido invertido (vincular virou
  desvincular);
- `pause_watchlist_voting_module_confirmation_button`: verbo virou
  substantivo;
- `sort_alphabetical_*`: hífen do intervalo perdido e gênero diferente entre
  as duas opções;
- `show_episodes_*_empty_description`: erro de conjugação;
- `missing_title_success_description`: ponto final faltando entre frases;
- `welcome_terms_and_privacy_hint`: erro de digitação em "Política";
- `groups_about_description`: expressão do inglês traduzida ao pé da letra;
- `add_subscription_service_button` usa "inscrição" enquanto o resto usa
  "assinatura".

**Plurais.** As formas `.zero` em pt-BR estão no singular (zero dia, zero
comentário), diferente do pt. A regra de plural do português trata 0 como
caso especial em algumas bibliotecas, então vale testar no nosso app.

**Regência de "assistir".** Mistura "assistiu este" e "assistiu a este" em
textos vizinhos (`episode_display_comments_alert_message` e
`episode_display_comment_alert_message`).

## 3. Terminologia central do TV Time

| Conceito | Chaves | Termo(s) em pt-BR | Observação |
|---|---|---|---|
| Não adicionada / não começou | `show_state_not_added`, `not_started_yet_header_title` | Não iniciada | Seção usa plural masculino, estado usa feminino |
| Assistindo | `show_state_watching`, `watching_header_title` | Assistindo | Mas as seções da tela da série falam em "acompanhar" |
| Em dia | `show_state_up_to_date` | Em dia | Consistente |
| Terminada (tudo visto, série encerrada) | `show_state_finished`, `finished_header_title` | Assistida | Mesma palavra de "episódio visto"; ambíguo |
| Para depois | `show_state_watch_later`, `show_watch_later_button`, `later_header_title`, `watch_list` | Para depois, Assistir depois, Depois, Minha lista | Quatro nomes para o mesmo conceito |
| Parei | `show_state_stopped`, `show_stop_button` | Interrompida / Parar de assistir | Estado e ação usam verbos diferentes |
| Sem ver há tempo | `not_watched_for_a_while_header_title` | Sem assistir há algum tempo | Longo para cabeçalho |
| Série encerrada (produção) | `ended` | Encerrada | |
| Marcar visto | `mark_episode_as_watched`, `episode_watched` | Marcar como assistido / Assistido | |
| Não visto | `episode_not_watched` | Não assistido | |
| Reassistir | `rewatched_*`, `watched_once_*` | Reassistido / Assistido uma vez | |
| Marcar tudo | `watch_all`, `unwatch_all` | Marcar todos como (não) assistidos | |
| Marcar anteriores | `mark_previous_episodes_modal_*` | Marcar episódios anteriores | Opção "nunca para esta série" |
| Próximo episódio (lista) | `watch_next_header_title`, `show_watch_next_section_*` | Assistir a seguir / Continuar acompanhando | |
| Estreias futuras | `upcoming`, `coming_soon` | Em breve | Mesmo termo para "próximos lançamentos" e "recurso ainda não disponível" |
| Especiais | `special_episode`, `specials_season` | Especial / Especiais | |
| Temporada | `season_x`, `season_format` | Temporada / T01 | Abreviação T e E com dois dígitos |
| Estatísticas | `stats`, `user_stats_series_title`, `time_spent_header` | Estatísticas, Tempo vendo TV, Tempo assistido | Trocadilho com a marca perdido |
| Notificações | `notifications`, `settings_notifications_*` | Notificações; Novo episódio; 1 hora antes; 10 minutos antes; No dia seguinte | |
| Avaliar | `movie_rating_section_title`, `review_post_hint` | Avaliar / avaliação | Mesma palavra para nota e resenha |

## 4. Glossário do nosso app

Critério: trocar o termo do TV Time quando houver opção igualmente clara;
manter quando o termo é vocabulário comum do português ou do sistema
operacional. Um conceito, um termo, em todas as telas.

| Conceito | Nosso termo | Justificativa |
|---|---|---|
| Acervo do usuário (séries e filmes acompanhados) | **Minhas séries** | Direto, sem jargão; aba e título da tela. |
| Adicionar / remover | **Adicionar** / **Tirar de Minhas séries** | "Adicionar" é verbo comum, não tem alternativa melhor. "Tirar" é mais coloquial que "remover". Decisão do Felippe em 13/10/2026: antes era "Tirar da coleção"; mudou para não colidir com **Coleções**. Tem 4 palavras, exceção aceita à diretriz 2, porque a ação apaga números e não pode ser confundida com **Tirar desta coleção**. |
| Ainda não começou (subseção) | **Para começar** | Soa como convite, não como falta. |
| Assistindo | **Vendo** | Mais curto e mais falado no Brasil; cabe em selo pequeno. |
| Em dia | **Aguardando** | Diz o que está acontecendo (esperando episódio novo) em vez de um jargão de controle. |
| Terminada | **Concluída** | Não colide com "visto" nem com o status da produção. |
| Para depois | **Quero ver** | Primeira pessoa, natural, e serve também para filmes (substitui lista de interesse). Um único nome em botão, estado e seção. |
| Parei | **Larguei** (estado, botão e seção) | Decisão do Felippe: coloquial, primeira pessoa, combina com "Quero ver" e "Vi". "Pausada" foi descartada porque sugere volta automática, que a regra R14 não faz; "Abandonada" soava negativa. |
| Sem ver há tempo (subseção) | **Faz tempo** | Curto para cabeçalho; o contexto da lista explica o resto. |
| Status de produção | **Em produção**, **Fim da série**, **Cancelada** | Separa "acabou como planejado" de "foi cancelada", o que o TMDB permite. |
| Marcar visto | **Vi** (botão de check) / **Visto** (estado) | Uma sílaba no botão; "visto" evita a regência de "assistir a". |
| Desmarcar | **Desmarcar** | Termo de sistema, claro. |
| Reassistir | **Vi de novo** / selo **2×** | Mais natural que um verbo com prefixo; o selo numérico mostra quantas vezes. |
| Marcar tudo / anteriores | **Marcar temporada** / **Marcar anteriores** | Diz o alcance da ação sem frase longa. |
| Próximo episódio (lista) | **Fila** | Uma palavra, ideia de sequência; cada cartão mostra "Próximo: T2 E5". |
| Estreias futuras | **Agenda** | Ideia de calendário; não colide com "em breve" de recurso futuro. |
| Especiais / temporada 0 | **Extras** (opção: **Incluir extras**) | Cobre especiais, OVAs e bônus, que é o que mora na temporada 0. |
| Temporada / episódio | **Temporada**, **Episódio**; abreviação **T2 E5** | Vocabulário comum, sem alternativa melhor. Sem zero à esquerda e com espaço, mais legível. |
| Estatísticas | **Seus números**; métricas **Horas vistas**, **Episódios vistos** | Mais pessoal que o termo técnico e sem trocadilho de marca. |
| Notificações | **Notificações** (tipos: **Estreia**, **Episódio novo**, **Lembrete 1 h antes**, **Aviso no dia**) | Termo do sistema operacional; trocar confundiria. Os tipos seguem as regras R21, R21a e R22 da nota 04. |
| Listas criadas pelo usuário | **Coleção** / **Coleções**; tela **Minhas coleções**; ações **Nova coleção** e **Tirar desta coleção** | Decisão do Felippe em 13/10/2026. Soa como acervo pessoal e combina com o nome do app. **Tirar desta coleção** só tira o item daquela coleção, sem mexer em **Minhas séries** nem nos registros. **Quero ver** é estado, não coleção. |
| Assinatura | **Glowbox Premium** (no texto corrido, **Premium**); botões **Assinar** e **Restaurar compras** | Decisão do Felippe em 13/10/2026. "Assinar" é o verbo comum de assinatura; "Restaurar compras" é o termo que as lojas usam e que a Apple exige. |
| Nota / resenha | **Nota** e **Comentário** | Separa o que o TV Time juntava em "avaliação" (se houver comentários no nosso app). |

### Equivalência com a nota 04

Os nomes usados na nota 04 são de trabalho. A nota 04 não será alterada; a
troca nos textos será feita na especificação da Fase 3, seguindo esta tabela.

| Termo na nota 04 | Termo do glossário |
|---|---|
| acompanhando (intenção) | sem rótulo próprio; aparece como **Vendo**, **Aguardando** ou **Concluída** |
| para depois (intenção) / **Para depois** (estado) | **Quero ver** |
| parei (intenção) / **Parada** (estado) | **Larguei** |
| **Não adicionada** | **Não adicionada** (sem mudança; na tela, só o botão **Adicionar**) |
| **Assistindo** | **Vendo** |
| **Em dia** | **Aguardando** |
| **Terminada** | **Concluída** |
| "ainda não comecei" (subseção) | **Para começar** |
| "sem assistir há algum tempo" (subseção) | **Faz tempo** |
| lista "assistir a seguir" | **Fila** |
| "Em breve" | **Agenda** |
| especial / temporada 0 | **Extras** |
| "incluir especiais" | **Incluir extras** |
| visto / "vista" (primeiro registro) | **Visto** (botão **Vi**) |
| "reassistidas" / reassistir | **Vi de novo** (selo **2×**) |
| situação da série: continuando / encerrada | **Em produção** / **Fim da série** ou **Cancelada** |
| estatísticas básicas | **Seus números** |

## 5. Diretrizes de voz do nosso app

1. **Trate por "você", sem cerimônia.** Nada de "deseja", "por gentileza"
   ou "tem certeza de que…". Confirmação é pergunta curta com o verbo da
   ação no botão (o botão diz "Apagar", não "Sim").
2. **Frases curtas.** Rótulo com até 3 palavras; mensagem com até 2 frases.
   Se precisar de mais, é tela de ajuda, não aviso.
3. **Erro diz o que aconteceu e o que fazer**, sem culpar a pessoa e sem
   "houve uma falha". Primeiro a causa em linguagem comum (sem internet,
   servidor fora do ar), depois a ação (tentar de novo, conferir o e-mail).
4. **Um termo por conceito.** O glossário da seção 4 é lei; texto novo usa o
   termo de lá ou entra no glossário antes.
5. **Português do Brasil de verdade.** Revisão humana de todo texto; nada de
   "guardar", "iniciar sessão" ou gerúndio lusitano. Linguagem neutra quando
   não custar clareza ("quem", "pessoa"), sem forçar.
6. **Emoji só para comemorar**, e no máximo um: série concluída, marca de
   episódios vistos, aniversário de uso. Nunca em erro, aviso legal ou
   pedido de permissão.
7. **Humor leve e raro, nunca em erro.** Cabe em estado vazio e em
   conquista. Piada que depende de inglês não entra.
8. **Spoiler é sagrado.** Notificação e lista nunca mostram título nem
   resumo de episódio que a pessoa não viu; mostrar só série, temporada e
   número.

## Limitações

- Só foram lidos os textos do pacote de idiomas em `flutter_assets`. Textos
  escritos direto no código Dart (`libapp.so`) ou enviados pelo servidor
  (push, notícias, conquistas) não estão aqui e não foram analisados.
- O arquivo não diz em que tela cada texto aparece; o contexto foi deduzido
  pelo nome da chave e pode estar errado em alguns casos.
- Não dá para saber se um erro veio de tradução automática ou de tradutor
  apressado; os "sinais" acima são indícios, não prova.
- Os textos da interface Flutter estão no base.apk, não no
  `split_config.pt.apk` (o CLAUDE.md foi corrigido). O split pt deve conter
  só recursos Android nativos (não verificado neste passo).
- A pasta tem um `crowdin.yml` com credencial de acesso da plataforma de
  tradução embutida. Ela não foi usada nem reproduzida aqui, e não deve ser
  copiada para o repositório.
- Contagens de português de Portugal e de voz foram feitas por padrões de
  texto; podem ter deixado passar casos isolados.

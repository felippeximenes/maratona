# 02 – Integrações com o sistema (deep links, widgets, notificações, permissões)

## Pergunta

Como o app se integra ao Android? Quais deep links e App Links ele aceita,
que widgets de tela inicial oferece, como organiza as notificações, se tem
atalhos de app ou alvos de compartilhamento, e para que servem as permissões
que pede?

## Conclusão

1. **Deep links:** a atividade única (`MainActivity`) aceita links de quatro
   origens: o domínio `tvtime.com` (e qualquer subdomínio), o domínio de links
   curtos da AppsFlyer (`tvtime.onelink.me`), o esquema próprio `tvst://` e o
   retorno do login do Twitter. **Nenhum filtro declara caminho**
   (`path`, `pathPrefix` ou `pathPattern`): o app reivindica todos os caminhos
   desses domínios e decide a tela dentro do código Dart. Por isso não é
   possível, só pelo manifesto, listar os caminhos nem agrupá-los por área
   (série, episódio, filme, perfil). Essa parte fica para o passo 4 (mapa de
   telas).
2. **Widgets:** são dois, ambos de séries: **"lista para assistir"** (próximos
   episódios a ver das séries em andamento) e **"em breve"** (próximos
   episódios a estrear, agrupados por dia). Os textos decodificados
   confirmam isso: na galeria, um se apresenta como acesso rápido à lista do
   que ver a seguir e o outro como visão das próximas estreias. Cada um tem um
   estado "sem conta configurada", com botão único de cadastro/login, e um
   estado vazio próprio, com botão para explorar o catálogo de séries. Não há
   atividade de configuração declarada; a escolha entre os dois tipos parece
   acontecer dentro do app. Os XML confirmam: são widgets clássicos
   (RemoteViews com lista rolável), redimensionáveis nos dois eixos,
   permitidos na tela inicial e na tela de bloqueio, atualizados pelo sistema
   a cada 30 minutos. Cada linha é só leitura (sem botão de "marcar como
   visto"). Tocar num item provavelmente abre o app na série ou no episódio
   (ver limitações).
3. **Notificações:** o manifesto declara só um canal padrão,
   `com.tozelabs.tvshowtime.GENERAL`, usado pelo Firebase Cloud Messaging.
   Confirmado com os recursos decodificados: **não existe nome nem descrição
   de canal do próprio app nas strings**. O nome legível do canal `GENERAL`
   (e de quaisquer outros) é definido em tempo de execução pelo Dart. Se o
   Dart não criar o canal, o FCM usa o canal reserva do Firebase, com rótulo
   genérico ("diversos"). Os alertas parecem vir quase todos do servidor
   (push), e não de agendamento local no aparelho.
4. **Atalhos de app:** não há atalhos estáticos nem plugin de atalhos
   dinâmicos. **Compartilhamento:** o app envia conteúdo para outros apps
   (share_plus e, possivelmente, stories do Instagram/Facebook), mas não
   recebe compartilhamentos, pois não há filtro `SEND`.
5. **Permissões:** das 37, só umas 5 seriam necessárias para um app como o
   nosso. O resto serve a publicidade e atribuição, contador no ícone para
   launchers antigos, convite de contatos, câmera para foto de perfil e
   proteção do Google Play.

## Evidência

Fonte: `inspect_android_package` (manifesto decodificado completo),
`search_android_classes`/`inspect_android_class` e
`decode_android_resources` (apktool 2.7.0, manifesto legível e tabela de
strings padrão) sobre o `base.apk` 10.11.0 (SHA-256 `de846546…aca1f`).
Para os XML de widget, `apktool d --no-src` rodado direto no bash, com saída
em `~/estudo-tvtime/saidas-rea/apktool-base/` (fora do repositório; mantida para o passo 6).

### 1. Deep links e App Links (intent-filters da `MainActivity`)

| # | Esquema | Host | Caminho | autoVerify | Finalidade provável |
|---|---|---|---|---|---|
| 1 | `https` | `tvtime.onelink.me` | (nenhum) | sim | Links curtos da AppsFlyer (campanhas, convites, compartilhamentos). Classes `com.appsflyer.deeplink.DeepLink`, `DeepLinkListener` e `DeepLinkResult` tratam o destino. |
| 2 | `http` e `https` | `tvtime.com` e `*.tvtime.com` | (nenhum) | sim | App Links do site: qualquer URL do site abre no app. |
| 3 | `tvst` | `*` | (nenhum) | não | Esquema próprio (sigla do nome antigo, "TV Show Time"). Provavelmente usado por notificações push, widgets e links internos. |
| 4 | `twitterkit-…` | — | — | não | Retorno do login com Twitter (biblioteca `twitter_login`), não é navegação. |

Outros pontos do manifesto:

- `flutter_deeplinking_enabled = false`: o roteador padrão do Flutter fica
  desligado e o app trata os links com código próprio em Dart (ou pela
  AppsFlyer).
- A ação `es.antonborri.home_widget.action.LAUNCH` também chega à
  `MainActivity`: é o caminho dos toques nos widgets.
- `launchMode = singleInstance`: um link aberto com o app já rodando reaproveita
  a mesma tela, em vez de empilhar outra instância.
- Filtros de bibliotecas, sem relação com navegação: `signinwithapple://…/callback`
  (`SignInWithAppleCallback`), `genericidp://firebase.auth/` e
  `recaptcha://firebase.auth/` (Firebase Auth).
- Bloco `<queries>`: o app consulta se Facebook, Facebook Lite e Instagram estão
  instalados, além de navegadores (Custom Tabs) e o provedor de instalação da
  AppsFlyer.

**Agrupamento por área:** não feito. Sem caminhos declarados, qualquer lista
de rotas (`/show/…`, `/episode/…` etc.) seria suposição.

### 2. Widgets de tela inicial

Dois provedores no pacote `com.tozelabs.tvshowtime.appwidget`, cada um com o
serviço `BIND_REMOTEVIEWS` correspondente:

| Widget | Provedor / metadados | Rótulo (chave do recurso) | O que mostra (deduzido) |
|---|---|---|---|
| Lista para assistir | `AppWidgetShowsWatchListProvider`, `@xml/app_widget_shows_watch_list` | `appwidget.shows.watch_list.name` | Próximo episódio de cada série em andamento: pôster, título da série, número do episódio e progresso. |
| Em breve | `AppWidgetShowsUpcomingProvider`, `@xml/app_widget_shows_upcoming` | `appwidget.shows.upcoming.name` | Episódios futuros agrupados por dia (hoje, amanhã, em N dias), com horário e emissora. |

Textos decodificados (descritos, não copiados; valores em inglês da tabela
padrão do `base.apk`):

- **Nome na lista de widgets:** os dois seguem o padrão "categoria – tipo"
  (séries + lista para assistir; séries + em breve), o que sugere que o app
  previa widgets de filmes no futuro.
- **Galeria:** cada widget tem título curto e uma frase de uma linha. O de
  lista promete "ver e acessar rápido" o que falta assistir; o de estreias
  promete "ver as próximas séries".
- **Cabeçalho:** cada um tem um título próprio, mais curto que o nome da
  galeria (só "lista" ou "em breve").
- **Estado vazio:** frase dizendo que a lista correspondente está vazia, um
  texto genérico de "nenhum episódio" e um botão para navegar por todas as
  séries.
- **Sem login:** aviso de que nenhuma conta está configurada e um botão único
  que junta cadastro e login.
- **Escolha de tipo:** um título pedindo para escolher o widget, sem atividade
  `APPWIDGET_CONFIGURE` no manifesto. A escolha é feita por uma tela do
  próprio app (Flutter), não pelo fluxo de configuração do Android.
- Os dois provedores usam o mesmo ícone pequeno (`@drawable/small_t`) e não
  são exportados.

Configuração dos provedores (`res/xml/app_widget_shows_*.xml`, descrita):

| Atributo | Lista para assistir | Em breve |
|---|---|---|
| Tamanho mínimo | 250 × 40 dp (cerca de 4 × 1 células) | igual |
| Redimensionamento | horizontal e vertical, mínimo 110 × 40 dp | horizontal e vertical, mínimo 180 × 40 dp |
| Atualização pelo sistema | a cada 30 min (`app_widget_refresh_interval`, o mínimo permitido pelo Android) | igual |
| Onde pode ficar | tela inicial e tela de bloqueio | igual |
| Layout inicial | `appwidget_logged_in` (também na tela de bloqueio) | igual |
| Prévia na galeria | imagem estática (`.webp`) e, no Android 12+, layout de prévia com dados fictícios | igual |
| Atividade de configuração | nenhuma | nenhuma |

O widget de lista aceita ficar mais estreito que o de estreias, coerente
com a linha dele ter menos informação à direita.

Estrutura visual (`res/layout/appwidget_*.xml`, descrita):

- **Barra superior** (28 dp): ícone pequeno do app e o título do widget, em
  texto escuro sobre fundo claro. No Android 12+ o arredondamento segue o raio
  padrão de widgets do sistema (`values-v31`).
- **Corpo com sessão iniciada:** lista rolável (`ListView`, alimentada pelo
  `RemoteViewsService` de cada widget) sobre fundo preto translúcido (60%).
  Se a lista estiver vazia, mostra no centro um texto curto de "nenhum
  episódio".
- **Linha de episódio** (64 dp de altura):
  - à esquerda, pôster pequeno (32 × 46 dp) com uma barra fina de progresso
    sobreposta na base, que mostra quanto da série já foi visto;
  - no meio, nome da série em negrito e, abaixo, o número do episódio, um
    selo com o nome da emissora (em maiúsculas, opcional) e a contagem de
    episódios restantes;
  - à direita, conforme o tipo, **ou** dia da semana com um marcador e o
    horário (estreias próximas), **ou** um número grande de dias que faltam
    com um rótulo curto embaixo (estreias mais distantes). A visibilidade de
    cada bloco é controlada por dados vindos do app.
- **Sem sessão:** mesma barra superior, fundo claro, aviso centralizado e um
  botão (texto em maiúsculas) para cadastro/login.
- **Prévias:** o de lista mostra duas linhas de exemplo, o de estreias uma,
  cada uma com o tema de uma série popular conhecida (estilos
  `AppWidget.ListItem.*`).
- Não há tema noturno próprio para o widget (`values-night` não redefine
  `appwidget_background`): o visual escuro translúcido é fixo.
- **Nenhum botão de ação na linha**, apenas o toque na linha inteira.

Base da dedução (nomes de recursos):

- Layouts: `appwidget_logged_in`, `appwidget_logged_out`, `appwidget_toolbar`,
  `appwidget_item_episode` e as prévias `appwidget_logged_in_shows_upcoming_preview`
  e `appwidget_logged_in_shows_watch_list_preview`.
- IDs de view: `showPoster`, `showTitle`, `showProgress`, `episodeNumber`,
  `episodeCount`, `episodeDay`, `episodeDayName`, `episodeDays`,
  `episodeDaysCount`, `episodeTime`, `episodeNetwork`, `emptyView`.
- Strings (nomes no formato decodificado pelo apktool, com pontos):
  `appwidget.gallery.{upcoming,watch_list}.{title,description}`,
  `appwidget.shows.{upcoming,watch_list}.{name,title,empty_title}`,
  `appwidget.shows.empty_episodes`, `appwidget.shows.empty_list.button`,
  `appwidget.sign_up_log_in.button`, `appwidget.account.not_configured_text`,
  `appwidget.choose_type.title`. `date_today`, `date_tomorrow`,
  `date_yesterday`, `date_day(s)`, `series_episode_format` e
  `series_season_format` aparecem como nomes na classe `R`, mas não existem
  em nenhum `values*/strings.xml` do `base.apk`. Os textos de data e de
  número de episódio da linha devem chegar prontos do Dart.
- Drawables: `progress_episode`, `placeholder_tv_poster`, `widget_bullet` e
  imagens de séries conhecidas, provavelmente usadas nas prévias da galeria.
- As classes dos provedores e serviços só têm construtor. A lógica herdada
  está em bibliotecas (`androidx.glance.appwidget`, `es.antonborri.home_widget`).
  Os dados são gravados pelo Dart e lidos pelo widget por meio do
  `HomeWidgetBackgroundReceiver`/`HomeWidgetBackgroundService`.

**Ao tocar:** o widget dispara `es.antonborri.home_widget.action.LAUNCH` para a
`MainActivity`, que repassa um URI ao Dart. Pelo padrão do plugin, o toque num
item abre a série ou o episódio, e o botão do estado deslogado abre o login.
`appwidget.choose_type.title` sugere uma tela para escolher o tipo de
conteúdo na configuração do widget. Não há `ActionCallback` próprio do app
nem botão no layout da linha: **o widget não marca episódio como visto**.

### 3. Notificações

- Canal padrão do FCM no manifesto: `com.tozelabs.tvshowtime.GENERAL`
  (`default_notification_channel_id`). O ícone padrão
  (`default_notification_icon`) aparecia como `0x7f0800dd` no
  `inspect_android_package`, mas o apktool o decodifica como `@null`: o
  drawable provavelmente está no split de densidade, ausente do `base.apk`.
- Tabela de strings decodificada: nenhuma string de canal do app. As únicas
  relacionadas a canais são de bibliotecas: o rótulo do canal reserva do FCM
  (`fcm_fallback_notification_channel_label`, genérico) e o canal de aviso de
  disponibilidade do Play Services
  (`common_google_play_services_notification_channel_name`). As strings
  `call_notification_*` são do AndroidX (chamadas), sem uso aparente.
- Conclusão: nome, descrição, importância e grupos dos canais do app são
  definidos no Dart.
- Push: `FlutterFirebaseMessagingService`, `FlutterFirebaseMessagingReceiver` e
  `FlutterFirebaseMessagingBackgroundService`.
- Notificações locais: o plugin `flutter_local_notifications` está presente
  (`FlutterLocalNotificationsPlugin`, `NotificationChannelDetails`,
  `NotificationChannelGroupDetails`, estilos `BigPicture`, `BigText`, `Inbox`
  e `Messaging`). Mas `ScheduledNotificationReceiver`,
  `ScheduledNotificationBootReceiver` e `ActionBroadcastReceiver` **não estão
  registrados no manifesto**. Sem esse registro, o agendamento local e os
  botões de ação não funcionam. O mais provável é que o plugin só exiba push
  recebido com o app aberto.
- Mensagens dentro do app: Firebase In-App Messaging (campanhas e marketing).
- Contador no ícone: ShortcutBadger (`me.leolin.shortcutbadger.impl.*`).
- Tipos de alerta: não há nomes de recurso que os distingam (lembrete de
  episódio, social, marketing). A separação existe só no servidor ou no Dart.

### 4. Atalhos de app e compartilhamento

- Sem `android.app.shortcuts` na `MainActivity` e sem plugin de atalhos
  dinâmicos (busca `quickactions`: 0 classes). Os drawables `shows`, `movies`,
  `explore` e `profile` parecem ícones das abas, não atalhos.
- Envio: `dev.fluttercommunity.plus.share.ShareFileProvider` e
  `SharePlusPendingIntent` (folha de compartilhamento do sistema, com retorno
  do app escolhido). A autoridade `…com.shekarmudaliyar.social_share` no
  `FileProvider` indica o plugin `social_share` (stories do Instagram e do
  Facebook, coerente com o bloco `<queries>`), mas as classes dele não
  aparecem pelo nome. Os recursos `image_share_filepaths` e `filepaths` sugerem
  compartilhamento de imagens geradas pelo app.
- Recebimento: nenhum filtro `android.intent.action.SEND`. O app não aparece
  na folha de compartilhamento de outros apps.

### 5. Permissões por finalidade

| Finalidade | Permissões | Nosso app precisa? |
|---|---|---|
| Rede | `INTERNET`, `ACCESS_NETWORK_STATE` | **Sim** |
| Notificações push | `POST_NOTIFICATIONS`, `c2dm.permission.RECEIVE`, `WAKE_LOCK` | **Sim** (as duas últimas o SDK de push declara sozinho) |
| Trabalho em segundo plano | `RECEIVE_BOOT_COMPLETED`, `FOREGROUND_SERVICE` | Só se houver lembrete local agendado (vêm do WorkManager) |
| Vibração | `VIBRATE` | Opcional |
| Biometria | `USE_BIOMETRIC`, `USE_FINGERPRINT` | Não (provavelmente vêm do Credential Manager ou de passkeys) |
| Foto de perfil | `CAMERA` | Não no início. O seletor de fotos do sistema dispensa permissão. |
| Encontrar amigos | `READ_CONTACTS` | Não. É sensível e exige justificativa na loja. |
| Publicidade e atribuição | `AD_ID`, `ACCESS_ADSERVICES_ATTRIBUTION`, `ACCESS_ADSERVICES_AD_ID`, `BIND_GET_INSTALL_REFERRER_SERVICE` | Não |
| Lojas e serviços de terceiros | `samsung…mapsagent.READ_APP_INFO`, `huawei…GET_COMMON_DATA`, `gsf.READ_GSERVICES` | Não (vêm de SDKs de atribuição) |
| Contador no ícone | 16 permissões de launchers (Samsung, HTC, Sony, Huawei, Oppo, Apex, Nova, Everything) e `READ_APP_BADGE` | Não. O Android 8+ mostra o ponto de notificação sozinho. |
| Licença e anti-adulteração | `CHECK_LICENSE` | Não |
| Interna | `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` (assinatura) | Gerada pelo AndroidX, automática |

## Limitações

- **Caminhos de deep link: decididos no Dart, não recuperáveis
  estaticamente.** Decisão do projeto: não acessar tvtime.com nem nenhum
  servidor da Whip Media (inclusive `assetlinks.json`). Os nomes de telas
  virão do passo 4 (`flutter_assets`).
- **XML dos widgets lidos fora do REA.** `decode_android_resources` só
  devolve manifesto, `apktool.yml` e strings. Os XML de widget e layouts
  foram lidos com `apktool d --no-src` direto no bash (mesma versão 2.7.0,
  saída em `~/estudo-tvtime/saidas-rea/apktool-base/`), sem registro de evidência do REA.
- **Tabela de strings pequena, mas completa.** O `values/strings.xml` do
  `base.apk` tem de fato 200 entradas; não houve corte. Os textos do app
  Flutter ficam no Dart, não em recursos Android.
- Os valores reais mostrados no widget (datas, número do episódio, contagens)
  são montados pelo Dart e não foram observados. A lógica de agrupamento por
  dia do widget "em breve" foi deduzida dos campos do layout.
- **Só a tabela padrão (inglês).** O `base.apk` não tem pastas de idioma
  (`locales` vazio); os textos em português estão em `split_config.pt.apk` e
  ficam para o passo 6.
- O ícone padrão de notificação não foi resolvido: ID `0x7f0800dd` numa
  ferramenta, `@null` no apktool (drawable provavelmente no split de
  densidade).
- Não há strings de canal do app, então nomes, importância e grupos dos
  canais criados pelo Dart continuam desconhecidos. Só seriam visíveis com o
  app instalado (configurações de notificação do Android), fora desta análise
  estática.
- O comportamento do toque nos widgets foi deduzido do padrão do plugin
  `home_widget`. O URI exato montado pelo Dart não foi observado.
- A ausência de notificações locais agendadas foi deduzida da falta dos
  receptores no manifesto. Se o pairip injetar componentes em tempo de
  execução, o que é improvável para receptores, a conclusão muda.
- O plugin `social_share` foi inferido só pela autoridade do `FileProvider`.
  As classes dele podem ter sido ofuscadas ou removidas.

## Implicações para o nosso app

1. **Definir os caminhos de link na Fase 3 e declará-los explicitamente**
   (por exemplo `/series/{id}`, `/series/{id}/season/{n}/episode/{m}`,
   `/movie/{id}`, `/u/{handle}`), usando os IDs do TMDB. No Expo isso vira
   `intentFilters` com `pathPrefix` no Android e `associatedDomains` no iOS,
   além de `assetlinks.json` e `apple-app-site-association` no nosso domínio.
2. **Um esquema próprio** (ex.: `maratona://`) para push, widgets e testes, com
   as mesmas rotas dos links https. O Expo Router resolve as duas formas
   com um único mapa de rotas.
3. **Não depender de AppsFlyer ou OneLink.** Links curtos e atribuição não são
   necessários no MVP. Um link https do nosso domínio já abre o app ou cai
   numa página web simples.
4. **Widgets ficam fora do MVP**, mas os dois que o TV Time oferece ("próximo
   episódio a assistir" e "estreias por dia") são bons candidatos para depois.
   Exigem código nativo (Glance/WidgetKit) fora do Expo gerenciado. Planejar os
   dados do backend de forma que um widget consiga lê-los sem abrir o app.
   O modelo deles é simples e vale como referência: lista só de leitura,
   atualizada a cada 30 min, com os textos já formatados pelo app. Um botão
   de "marcar como visto" no próprio widget seria um diferencial nosso.
5. **Notificações: decidir na Fase 3 entre push do servidor e lembrete local.**
   O TV Time usa push. Para "episódio novo hoje", o push via Supabase (função
   agendada + Expo Push) evita permissões de alarme e funciona com o app
   fechado.
6. **Canais de notificação separados por tipo** desde o início (ex.:
   `episodes`, `social`, `news`), para o usuário silenciar um tipo sem perder
   os outros. O TV Time joga tudo num canal geral.
7. **Lista mínima de permissões:** `INTERNET`, `ACCESS_NETWORK_STATE` e
   `POST_NOTIFICATIONS` (as de push o SDK adiciona). Bloquear no `app.json`
   as que o Expo ou outras bibliotecas trouxerem sem necessidade (`CAMERA`,
   `READ_CONTACTS`, `AD_ID`).
8. **Sem rastreamento publicitário** (AD_ID, AdServices, install referrer). Isso
   simplifica a seção de segurança de dados da Play Store e a do App Store.
9. **Compartilhar pela folha do sistema** (`Share` do React Native ou
   `expo-sharing`) com um link https do nosso domínio. Imagens geradas para
   stories podem vir depois. Receber compartilhamentos (share target) não é
   prioridade.
10. **Contador no ícone:** usar só o suporte nativo (badge do iOS e ponto de
    notificação do Android), sem bibliotecas de launchers de fabricantes.

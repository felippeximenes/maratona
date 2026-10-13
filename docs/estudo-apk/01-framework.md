# 01 – Framework do app

## Pergunta

Com qual framework o app Android foi construído (nativo, Flutter, React Native,
Jetpack Compose)? Quais bibliotecas e SDKs de terceiros ele usa?

## Conclusão

O app é **Flutter**. A interface e a regra de negócio ficam em código Dart
compilado para nativo (`libapp.so`), rodando sobre o motor do Flutter
(`libflutter.so`). A parte Java/Kotlin é uma casca fina: a atividade principal,
os widgets de tela inicial e o código Android dos plugins.

Não há sinal de React Native. Também não aparece nenhuma classe
`androidx.compose` (ver limitações).

Consequência para a Fase 2: as ferramentas de classes Java do REA mostram pouco
da lógica do app. Os nomes de classes servem para mapear integrações (login,
notificações, analytics), mas as regras de negócio estão no binário Dart. Isso
deve orientar os próximos passos do estudo.

## Evidência

### Pacote (inspect_android_package sobre o base.apk)

- Pacote: `com.tozelabs.tvshowtime`
- Versão: 10.11.0+2026052201 (versionCode 2026052201)
- SDK mínimo 24 (Android 7.0), SDK alvo 35 (Android 15)
- 11.476 classes e 2.539 recursos

### Permissões (resumo)

- Rede: INTERNET, ACCESS_NETWORK_STATE
- Notificações e segundo plano: POST_NOTIFICATIONS, VIBRATE, WAKE_LOCK,
  RECEIVE_BOOT_COMPLETED, FOREGROUND_SERVICE, recebimento de push (c2dm)
- Recursos do aparelho: CAMERA, READ_CONTACTS, USE_BIOMETRIC, USE_FINGERPRINT
- Publicidade e atribuição: AD_ID, ACCESS_ADSERVICES_ATTRIBUTION,
  ACCESS_ADSERVICES_AD_ID, Install Referrer do Google Play
- Licença: CHECK_LICENSE (Google Play)
- Contador no ícone: permissões de "badge" de vários fabricantes (Samsung, HTC,
  Sony, Huawei, Oppo e outros), típicas da biblioteca ShortcutBadger
- Leitura de dados de lojas e serviços de Samsung, Huawei e Google (GSERVICES)

### Componentes principais (manifesto)

- Classe de aplicação: `com.pairip.application.Application`, da proteção
  anti-adulteração do Google Play (pairip). Nas classes existe
  `com.tozelabs.tvshowtime.TVTApplication`. É provável que seja a aplicação
  real, iniciada pelo pairip, mas isso não foi verificado.
- Atividade única do app: `com.tozelabs.tvshowtime.MainActivity`, exportada,
  com a entrada do lançador e filtros de link (deep links).
- `com.tozelabs.tvshowtime.FreshDeskActivity`: tela de suporte (Freshdesk).
  Não aparece SDK Freshdesk nas classes; provavelmente é uma página web.
- Widgets de tela inicial em código nativo: `AppWidgetShowsWatchListProvider`
  e `AppWidgetShowsUpcomingProvider` (pacote `com.tozelabs.tvshowtime.appwidget`),
  com serviços de mesmo nome. Usam `androidx.glance` e o plugin `home_widget`.
- Outras atividades vêm de bibliotecas: login (Apple, Twitter, Google, Firebase
  Auth), navegador interno, recorte de imagem (uCrop) e licença (pairip).
- Serviços e receptores: Firebase Messaging, WorkManager, AppsFlyer (install
  referrer), notificações locais agendadas.

### Busca de frameworks (search_android_classes)

| Consulta | Classes encontradas |
|---|---|
| `io.flutter` | 66 (embedding, plugin, plugins, view) |
| `com.facebook.react` | 0 |
| `androidx.compose` | 0 |

Classes que confirmam o Flutter: `io.flutter.plugins.GeneratedPluginRegistrant`
e os pacotes `io.flutter.embedding.engine`, `io.flutter.plugin.platform` e
`io.flutter.plugin.editing`.

### Bibliotecas nativas (.so) do split arm64-v8a

Listadas a partir do `tvtime-10.11.0.apkm`, dentro de `split_config.arm64_v8a.apk`:

| Biblioteca | Tamanho | O que indica |
|---|---|---|
| libapp.so | ~18,4 MB | código Dart do app, compilado para nativo |
| libflutter.so | ~11,2 MB | motor do Flutter |
| libtranslate_jni.so | ~16,7 MB | tradução no aparelho (ML Kit Translate) |
| libpairipcore.so | ~0,6 MB | proteção do Google Play (pairip) |
| libdatastore_shared_counter.so | ~7 KB | AndroidX DataStore |

### Plugins Flutter (pelo nome do pacote)

- Firebase (`io.flutter.plugins.firebase.*`): core, auth, analytics,
  crashlytics, database, messaging, in-app messaging, performance, remote config
- `image_picker`, `url_launcher` (oficiais do Flutter)
- `flutter_local_notifications` (`com.dexterous`)
- `flutter_inappwebview` (`com.pichillilorenzo`)
- `share_plus` (`dev.fluttercommunity.plus.share`)
- `home_widget` (`es.antonborri`)
- `sign_in_with_apple` (`com.aboutyou.dart_packages`)
- `twitter_login` (`com.maru`)
- `appsflyer_sdk` (`com.appsflyer.appsflyersdk`)

### SDKs de terceiros (pelo nome do pacote)

- Google Play Services (gms), Credential Manager (`androidx.credentials`),
  reCAPTCHA, Play Core, Install Referrer
- Firebase: Auth, Analytics, Crashlytics, Realtime Database, Messaging, In-App
  Messaging, Performance, Remote Config, A/B Testing, Installations, Sessions
- Google ML Kit: Translate (`nl.translate`) e visão (`vision.common`)
- AppsFlyer (atribuição de instalação e deep links)
- Glide (imagens), uCrop (recorte de imagem), Protocol Buffers
- ShortcutBadger (`me.leolin.shortcutbadger`)
- pairip (licença e anti-adulteração do Google Play)
- AndroidX: Glance (widgets), WorkManager, Room, DataStore, Material, Preference,
  WebKit, Window

## Limitações

- O código Dart (`libapp.so`) não foi analisado. As ferramentas de classes Java
  não enxergam a lógica dele, e os plugins Dart puros (sem código Android) não
  aparecem na lista acima. A lista de plugins é, portanto, parcial.
- O código está ofuscado (milhares de classes com nomes curtos como `A0.a`).
  Bibliotecas renomeadas por inteiro não seriam detectadas pelo nome do pacote.
  Isso pode explicar a ausência de `androidx.compose`, que o Glance costuma
  trazer junto.
- A classe real de aplicação e a parte protegida pelo pairip (`VMRunner`,
  `VmDecryptor`) não foram examinadas. Pode existir código que só fica
  disponível em tempo de execução.
- As `.so` foram listadas com Python lendo o ZIP aninhado em memória, sem gravar
  nada em disco, porque o `unzip -l` não lê um APK dentro do `.apkm` sem
  extraí-lo antes. Não houve extração nem análise do conteúdo das bibliotecas.
- Os splits de outras arquiteturas (armeabi-v7a, x86_64) não foram conferidos.
- Nada foi executado. Toda a análise é estática.

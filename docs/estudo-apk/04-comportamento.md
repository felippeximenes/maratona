# 04 – Comportamento do nosso app

## Pergunta

Como o nosso app deve se comportar no núcleo de acompanhamento de séries?
Que estados uma série pode ter e o que a move entre eles, qual é o "próximo
episódio", como marcar, desmarcar e reassistir, o que fazer com especiais,
lançamentos em bloco e séries que voltam, como avisar estreias sem ter o
horário no TMDB, e como calcular as estatísticas básicas.

Estas são **regras próprias**, escritas a partir da nota 03 (relato de uso e
prioridades). O APK não foi consultado neste passo. Onde o relato não diz
nada, a regra é uma proposta nossa e aparece como tal.

## Conclusão

1. **A série tem duas camadas.** Uma é a *intenção* do usuário
   (acompanhando, para depois, parei), que só ele muda. A outra é o
   *progresso*, calculado a partir dos episódios vistos e dos dados da série.
   Os seis estados do mapa saem da combinação das duas (R1). Com isso, "em
   dia", "terminada" e a volta automática quando sai episódio novo não
   precisam de nenhuma ação especial: são recalculados.
2. **O próximo episódio é o primeiro não visto depois do episódio visto mais
   adiantado** (a "fronteira"), contando só episódios já exibidos e, por
   padrão, sem especiais (R5, R6, R11).
3. **A lista "assistir a seguir" é ordenada pelo que aconteceu por último na
   série:** a última marcação do usuário ou a exibição do próximo episódio, o
   que for mais recente (R7). Assim, a série que você está vendo fica no topo
   e a série semanal sobe quando sai episódio.
4. **A pergunta sobre os anteriores olha só o "buraco" imediatamente antes do
   episódio marcado**, e pode ser lembrada como "sempre marcar" ou "nunca
   marcar" (R8, R9).
5. **Séries paradas não voltam sozinhas.** Ganham um aviso discreto na seção
   de paradas, sem notificação (R14).
6. **Cada vez que se assiste algo vira um registro.** Desmarcar apaga
   registros; reassistir cria mais um. O tempo total soma todos os registros
   (R15 a R17, R24).
7. **Para notificações com horário, a recomendação é usar o TVmaze como
   fonte complementar de horário, consultada só pelo backend**, e cair para
   aviso por data quando não houver horário. "Uma hora antes" só é enviada
   quando o horário é conhecido (R20 a R23). Isso muda a stack e fica como
   decisão em aberto.

## Definições

- **Episódio regular:** episódio de temporada 1 em diante.
- **Especial:** episódio da temporada 0 (no TMDB, é onde ficam especiais,
  OVAs, episódios bônus e afins).
- **Episódio contável:** episódio regular, ou especial quando a série está com
  "incluir especiais" ligado (R12). Só episódios contáveis entram no próximo
  episódio, nos totais de progresso, na pergunta dos anteriores e no cálculo
  de "em dia" e "terminada".
- **Ordem dos episódios:** temporada e depois número do episódio. Com
  especiais incluídos, eles se intercalam pela data (R12).
- **Exibido:** episódio cujo momento de exibição já passou. Com horário
  conhecido, vale o momento exato. Só com data, vale o início daquele dia no
  fuso do usuário (R23). Episódio sem data nunca está exibido.
- **Registro de visualização:** uma vez em que o usuário assistiu a um
  episódio ou filme, com o momento em que marcou. O primeiro registro é a
  "vista"; os seguintes são "reassistidas".
- **Visto:** episódio com pelo menos um registro.
- **Fronteira:** o episódio contável visto mais adiantado na ordem.
- **Última atividade na série:** o momento da marcação, desmarcação,
  retomada ou inclusão mais recente feita pelo usuário naquela série.
- **Situação da série no TMDB:** em produção/continuando, ou encerrada
  (terminada ou cancelada).

---

## A. Estados de uma série

### R1 – Intenção, progresso e os seis estados

**Descrição.** Toda série da coleção tem uma *intenção*, escolhida pelo
usuário: **acompanhando**, **para depois** ou **parei**. O estado mostrado é
calculado assim:

| Intenção | Condição de progresso | Estado mostrado |
|---|---|---|
| (fora da coleção) | qualquer | **Não adicionada** |
| parei | qualquer | **Parada** |
| para depois | qualquer | **Para depois** |
| acompanhando | há episódio contável exibido não visto depois da fronteira | **Assistindo** |
| acompanhando | nada exibido a ver; série continua ou há episódio anunciado | **Em dia** |
| acompanhando | nada exibido a ver; série encerrada e sem episódio anunciado | **Terminada** |

O estado é recalculado sempre que o usuário marca ou desmarca algo, muda a
intenção, ou quando os dados da série mudam (episódio novo, data nova,
situação nova).

"Ainda não comecei" e "sem assistir há algum tempo" não são estados: são
subseções de **Assistindo** na lista (R7).

**Exemplos.**
- Dado uma série acompanhada, encerrada no TMDB, com todos os 30 episódios
  regulares vistos. Quando a tela abre. Então o estado é **Terminada**.
- Dado uma série acompanhada, continuando, com todos os episódios exibidos
  vistos e a temporada 3 anunciada para março. Quando a tela abre. Então o
  estado é **Em dia** e a estreia aparece em "Em breve".
- Dado uma série com intenção "parei" e 10 episódios não vistos. Quando a
  tela abre. Então o estado é **Parada**, sem próximo episódio na lista.

**Casos-limite.**
- Série acompanhada que ainda não estreou (nenhum episódio exibido): fica
  **Em dia**, com a data da estreia em destaque e presença em "Em breve".
- Série encerrada no TMDB que ganha episódio novo depois (revival): o
  episódio novo a tira de **Terminada** sem regra especial (R13).
- Série encerrada cujo último especial sai depois do final: com especiais
  desligados, o especial não muda nada; ela continua **Terminada**.
- Situação do TMDB errada ou atrasada (série marcada como continuando mesmo
  cancelada): fica **Em dia** em vez de **Terminada**. Aceitável; corrige
  sozinha quando o dado for corrigido.

### R2 – Adicionar e remover

**Descrição.** Adicionar põe a série na coleção com intenção
**acompanhando** (ou **para depois**, se o usuário escolher esse botão).
Remover tira a série da coleção e **apaga os registros de visualização dela**,
depois de uma confirmação que diz quantos episódios e quantas horas saem das
estatísticas. Quem quer guardar o histórico sem ver mais a série usa "parei".

**Exemplos.**
- Dado uma série não adicionada. Quando o usuário toca em "Adicionar". Então
  ela entra como acompanhando, sem episódios vistos, na subseção "ainda não
  comecei".
- Dado uma série com 40 episódios vistos (28 horas). Quando o usuário escolhe
  "Remover". Então aparece a confirmação "40 episódios e 28 h sairão das suas
  estatísticas. Para manter, use 'Parei de assistir'", com as duas opções.

**Casos-limite.**
- Adicionar uma série já removida antes: começa do zero, porque o histórico
  foi apagado.
- Desfazer logo após remover (na confirmação leve): restaura série,
  intenção e registros.

### R3 – Mudanças de intenção feitas pelo usuário

**Descrição.** Pela tela da série ou pelo menu de pressionar e segurar, o
usuário pode:
- **Deixar para depois:** intenção vira "para depois". A série sai de
  "assistir a seguir" e vai para a seção "para depois". As notificações de
  episódio da série ficam desligadas enquanto estiver assim.
- **Parei de assistir:** intenção vira "parei". A série vai para a seção
  "paradas". Notificações desligadas.
- **Retomar:** de "para depois" ou "parei" para "acompanhando". O próximo
  episódio continua de onde a fronteira estava. As notificações voltam ao
  que eram antes de parar.

**Exemplos.**
- Dado uma série Assistindo no episódio S2E4. Quando o usuário escolhe "Parei
  de assistir". Então ela vai para "paradas" e some de "assistir a seguir".
- Dado uma série parada com fronteira em S2E3. Quando o usuário toca em
  "Retomar". Então ela volta para "assistir a seguir" com S2E4 como próximo.

**Casos-limite.**
- "Deixar para depois" numa série terminada: permitido; serve para quem quer
  reassistir um dia. O estado mostrado passa a ser **Para depois**.
- Retomar uma série cujos episódios restantes ainda não saíram: ela entra
  como **Em dia**.

### R4 – Mudanças automáticas por marcação

**Descrição.** Marcar um episódio diz que o usuário está assistindo, então:
- Em série **não adicionada**: a série é adicionada como acompanhando.
- Em série **para depois** ou **parada**: a intenção vira acompanhando, com
  a confirmação leve "Série retomada" e opção de desfazer.
- Em série acompanhando: só o progresso muda; o estado é recalculado (R1).

Desmarcar nunca muda a intenção, só o progresso.

**Exemplos.**
- Dado uma série para depois. Quando o usuário marca S1E1 pela tela do
  episódio. Então a série passa a Assistindo, com S1E2 como próximo, e
  aparece "Série retomada · Desfazer".
- Dado uma série Em dia. Quando o usuário desmarca o último episódio. Então
  ela volta a Assistindo, com esse episódio como próximo.

**Casos-limite.**
- Marcar um especial (com especiais desligados) numa série parada: conta
  como atividade e retoma a série também. Marcar é sinal claro de que está
  assistindo.
- Marcar via "reassistir" (R17) numa série parada **não** retoma, porque
  reassistir não diz nada sobre continuar a série.

---

## B. Próximo episódio e lista "assistir a seguir"

### R5 – Qual episódio aparece

**Descrição.** Para uma série **Assistindo**, o próximo episódio é o
primeiro episódio contável e exibido, **depois da fronteira**, que ainda não
foi visto. Se nada foi visto, é o primeiro episódio contável exibido.
Episódios não vistos *antes* da fronteira são tratados como pulados de
propósito: não voltam a ser próximo. Na tela da série, a temporada mostra
quantos ficaram sem marcar, para quem quiser completar.

Junto do próximo episódio, a lista mostra "+N", onde N é o número de
episódios contáveis exibidos e não vistos depois dele.

**Exemplos.**
- Dado S1E1 a S1E5 vistos e S1E6 exibido. Quando a lista abre. Então o
  próximo é S1E6.
- Dado que o usuário marcou S3E1 e disse "não" para marcar os anteriores.
  Quando a lista abre. Então o próximo é S3E2, e não S1E1.
- Dado S1E10 como último da temporada 1 e S2E1 exibido. Quando o usuário
  marca S1E10. Então o próximo passa a S2E1.

**Casos-limite.**
- O usuário desmarca a fronteira: a fronteira recua para o episódio visto
  anterior e o próximo é recalculado.
- Episódio com número fora de ordem ou faltando no TMDB (S1E1, S1E2, S1E4):
  segue a ordem disponível; S1E4 vem depois de S1E2.
- Temporada nova inteira sem episódios cadastrados ainda (só anunciada): não
  há próximo; a série fica Em dia.

### R6 – Episódios ainda não exibidos e sem data

**Descrição.** Episódio não exibido nunca é próximo episódio e não entra no
"+N". Ele aparece em "Em breve" (agrupado por ontem, hoje, amanhã e datas
seguintes) se tiver data. Episódio sem data aparece só na tela da série, como
"sem data".

**Exemplos.**
- Dado S2E5 visto e S2E6 com estreia amanhã. Quando a lista abre. Então a
  série está Em dia e S2E6 aparece em "Em breve > Amanhã".
- Dado S2E6 com estreia hoje às 22h (horário conhecido) e agora são 15h.
  Quando a lista abre. Então S2E6 ainda está em "Em breve > Hoje"; às 22h a
  série passa a Assistindo.

**Casos-limite.**
- Data mudou no TMDB depois de exibida (adiamento cadastrado tarde): se o
  episódio volta a ter data futura, ele deixa de ser próximo, mesmo que já
  tenha aparecido na lista. Se o usuário já o marcou, o registro fica.
- Só data, sem horário: o episódio vira exibido no início do dia no fuso do
  usuário. Para séries americanas, isso adianta algumas horas; preferimos
  mostrar cedo a esconder um episódio que já saiu (R23).

### R7 – Ordem da lista "assistir a seguir"

**Descrição.** Só séries **Assistindo** entram. Cada uma tem uma chave de
ordem: **o mais recente entre a última atividade do usuário na série e o
momento de exibição do próximo episódio**. Ordem decrescente. Empate: título
em ordem alfabética.

A lista tem três blocos, nesta ordem:
1. **Assistir a seguir:** séries com pelo menos um episódio visto e chave
   nos últimos 30 dias.
2. **Ainda não comecei:** séries sem nenhum episódio visto, pela data em que
   foram adicionadas (mais recente primeiro).
3. **Sem assistir há algum tempo:** séries com episódio visto e chave com
   mais de 30 dias.

Para depois, Paradas, Em dia e Terminadas ficam em seções próprias, abaixo
ou em outra visão, como no mapa de telas.

**Exemplos.**
- Dado a série A com última marcação ontem e a série B com última marcação
  há 5 dias. Quando a lista abre. Então A vem antes de B.
- Dado a série B (semanal, em dia, última marcação há 6 dias) e o episódio
  novo de B exibido hoje às 21h. Quando a lista abre às 22h. Então B vai para
  o topo, porque a exibição de hoje é mais recente que qualquer marcação.
- Dado a série C com S1E3 como próximo, exibido em 2015, e última marcação há
  40 dias. Quando a lista abre. Então C está em "sem assistir há algum
  tempo".

**Casos-limite.**
- Usuário atrasado numa série semanal: o próximo episódio dele é antigo,
  então os episódios novos não empurram a série para cima. Isso é desejado:
  ela sobe quando ele voltar a assistir.
- Temporada inteira lançada de uma vez: o lançamento conta uma vez só na
  chave (R18).
- Marcar algo em "sem assistir há algum tempo" leva a série de volta ao
  bloco 1, no topo.

---

## C. Marcar episódio adiantado

### R8 – Pergunta sobre os anteriores

**Descrição.** Ao marcar um episódio E, o app calcula os **anteriores
pendentes**: episódios contáveis não vistos que vêm antes de E e depois do
último episódio visto antes de E. Se houver pelo menos um, pergunta:
"Marcar também os N episódios anteriores?", com as opções **Marcar os N**,
**Só este** e a caixa **Lembrar minha escolha** (R9).

Vale também para temporada: ao marcar a temporada T, os anteriores pendentes
são os episódios contáveis não vistos das temporadas anteriores a T, depois
do último visto. "Marcar tudo" não pergunta.

Os episódios marcados por essa pergunta ganham registros com o mesmo
momento da marcação de E.

**Exemplos.**
- Dado nada visto. Quando o usuário marca S2E3. Então a pergunta oferece
  marcar 12 anteriores (S1E1 a S2E2, supondo 10 na S1).
- Dado S1E1 a S1E4 vistos, S1E5 a S1E9 não vistos. Quando o usuário marca
  S1E10. Então a pergunta oferece marcar 5 anteriores.
- Dado que o usuário marcou S3E1 e escolheu "Só este". Quando, depois, marca
  S3E2 pela lista. Então nada é perguntado: não há buraco entre S3E1 e S3E2.

**Casos-limite.**
- Buracos antigos (antes de outro episódio visto) não entram na conta, para
  não repetir uma pergunta já respondida. Quem quiser preenchê-los marca a
  temporada ou os episódios na tela da série.
- Especiais nunca entram nos anteriores com a opção da série desligada.
- Marcar pela lista o próximo episódio normalmente não pergunta, porque ele
  vem logo depois da fronteira.

### R9 – Lembrar a escolha

**Descrição.** Se "Lembrar minha escolha" estiver marcada, a resposta vira a
regra **global** nas configurações, com três valores: **Perguntar**
(padrão), **Sempre marcar os anteriores** e **Nunca marcar os anteriores**.
Com "sempre", o app marca sem perguntar e mostra a confirmação leve "Visto ·
mais N anteriores · Desfazer". Com "nunca", marca só o episódio, sem aviso
extra.

**Exemplos.**
- Dado a regra em "Perguntar". Quando o usuário escolhe "Marcar os 5" com a
  caixa marcada. Então a regra vira "Sempre marcar" e a próxima vez não
  pergunta.
- Dado a regra em "Sempre marcar". Quando o usuário marca S4E1 sem nada
  visto. Então 30 episódios anteriores são marcados e o "Desfazer" desfaz os
  31 de uma vez.

**Casos-limite.**
- Marcação de temporada segue a mesma regra.
- Muitos anteriores (por exemplo, mais de 100): com "sempre", marca
  normalmente; a confirmação mostra o número para o usuário perceber.
- Onboarding (definir progresso por série) não usa esta regra: lá a escolha
  já é explícita.

### R10 – Marcar episódio ainda não exibido

**Descrição.** Permitido, com confirmação: "Este episódio ainda não foi
exibido (estreia em dd/mm). Marcar mesmo assim?". Serve para pré-estreias e
para quando a data do TMDB está errada.

**Exemplos.**
- Dado S5E1 com estreia daqui a 3 dias. Quando o usuário marca S5E1. Então
  aparece a confirmação; se confirmar, o episódio fica visto e vira a
  fronteira.

**Casos-limite.**
- Episódio sem data: mesma confirmação, com "sem data de estreia".
- Depois de confirmado, a pergunta dos anteriores (R8) segue normalmente.

---

## D. Especiais e temporada 0

### R11 – Especiais fora por padrão

**Descrição.** Por padrão, especiais não são contáveis: não aparecem como
próximo episódio, não entram no "+N", na pergunta dos anteriores, em "marcar
tudo", nem no cálculo de Em dia e Terminada, e não geram notificação. Na tela
da série, ficam numa seção **Especiais**, recolhida, no fim da lista de
temporadas. Podem ser marcados um a um a qualquer momento, e esses registros
contam nas estatísticas (R24).

**Exemplos.**
- Dado uma série com S1 (10) e temporada 0 (3 especiais), tudo da S1 visto.
  Quando a tela abre. Então a série está Em dia ou Terminada; os especiais não
  impedem.
- Dado especiais desligados. Quando o usuário toca em "Marcar tudo". Então
  só os episódios regulares são marcados.

**Casos-limite.**
- Série sem nenhuma temporada regular (só temporada 0): os especiais passam
  a ser contáveis automaticamente; caso contrário a série nunca teria
  próximo episódio.
- OVAs cadastradas no TMDB como série separada: são outra série, fora desta
  regra.

### R12 – Incluir especiais, por série

**Descrição.** Na tela da série há a opção **Incluir especiais**. Ligada, os
especiais viram contáveis e passam a seguir todas as regras de episódio. Como
o TMDB não diz onde um especial se encaixa entre os episódios regulares, a
posição é pela data: cada especial entra logo depois do último episódio
regular exibido na mesma data ou antes dela. Especiais sem data ficam no
fim.

**Exemplos.**
- Dado S1E10 exibido em 10/12 e o especial de Natal em 24/12, com S2E1 em
  15/01. Quando a opção é ligada. Então a ordem fica S1E10, especial, S2E1.
- Dado a série Terminada e a opção ligada com 2 especiais não vistos. Quando
  a tela abre. Então a série volta a Assistindo, com o primeiro especial como
  próximo.

**Casos-limite.**
- Ligar a opção não faz pergunta sobre anteriores; só recalcula o progresso.
- Desligar a opção não apaga registros de especiais; só tira os especiais do
  progresso.
- Especial com a mesma data de um episódio regular: entra depois dele.

---

## E. Volta de série e séries paradas

### R13 – Volta automática de série Em dia ou Terminada

**Descrição.** Quando um episódio contável novo passa a ser exibido numa
série acompanhada que estava Em dia ou Terminada, o estado passa a
Assistindo pela R1. A série entra em "assistir a seguir" no topo (R7) com o
destaque **Novos episódios**. O destaque some quando o usuário marca um
episódio da série ou depois de 14 dias.

**Exemplos.**
- Dado uma série Terminada há dois anos. Quando o TMDB passa a ter a
  temporada 4 e o S4E1 é exibido. Então a série vai para o topo da lista com
  "Novos episódios" e S4E1 como próximo.
- Dado a temporada nova anunciada para daqui a 2 meses. Quando o anúncio
  chega ao TMDB. Então a série fica Em dia (ou deixa de ser Terminada e vira
  Em dia, porque há episódio anunciado) e a estreia aparece em "Em breve".

**Casos-limite.**
- A volta depende da atualização dos dados no backend; pode haver atraso
  entre o episódio sair e o TMDB cadastrá-lo.
- Usuário que tinha marcado a série inteira como vista no onboarding: volta
  igual, porque o progresso é o mesmo.

### R14 – Séries paradas e "para depois" com episódios novos

**Descrição (proposta).** Séries **Paradas** não voltam sozinhas. Quando sai
episódio contável novo, ganham, só na seção de paradas, uma etiqueta
discreta: **Temporada N disponível** (ou "Novos episódios"). Não há
notificação. A etiqueta some quando o usuário retoma a série ou depois de 30
dias. Séries **Para depois** seguem a mesma regra.

**Por quê.** As alternativas eram:
- *Voltar sozinha, como a terminada:* contradiz quem parou porque a série
  ficou chata, que foi o uso relatado. A série voltaria à lista toda
  temporada, e o usuário teria de parar de novo.
- *Ignorar totalmente:* perde o caso de quem parou "até sair coisa nova".
  Esse caso, porém, normalmente é o de série Em dia, que já volta sozinha.
- *Etiqueta discreta sem notificação (escolhida):* respeita a decisão de
  parar e ainda deixa a informação à vista para quem for olhar a seção.

**Exemplos.**
- Dado uma série parada na S2E4. Quando a temporada 3 é exibida. Então a
  série continua em "paradas", com a etiqueta "Temporada 3 disponível", e
  nenhuma notificação é enviada.
- Dado essa série com etiqueta. Quando o usuário toca em "Retomar". Então o
  próximo episódio é S2E5, não S3E1. Para pular para a S3, ele marca S2
  inteira ou começa por S3E1 (com a pergunta dos anteriores).

**Casos-limite.**
- Série parada que também está encerrada no TMDB e recebe um especial: com
  especiais desligados, nenhuma etiqueta.
- Várias temporadas novas enquanto parada: a etiqueta mostra a mais recente.

---

## F. Desmarcar e reassistir

### R15 – Registros de visualização

**Descrição.** Cada marcação cria um registro (episódio ou filme, momento).
O progresso só olha se há pelo menos um registro; as estatísticas olham
todos. Registros criados em lote (anteriores, temporada, tudo, onboarding)
levam a marca "em lote", para que estatísticas por período no futuro não
pensem que o usuário viu 100 episódios numa tarde.

**Casos-limite.**
- O momento do registro é o da marcação, não o da exibição. Não há campo
  para informar "vi ontem" nesta versão.

### R16 – Desmarcar

**Descrição.**
- **Episódio com um registro:** desmarcar apaga o registro. O progresso,
  a fronteira, o próximo episódio e o estado são recalculados, e a duração
  sai do tempo total.
- **Episódio com reassistidas:** desmarcar pergunta **Remover a última
  reassistida** ou **Marcar como não visto** (apaga todos os registros).
- **Temporada ou tudo:** pede confirmação com o número de episódios e as
  horas que saem das estatísticas.
- **Desfazer** da confirmação leve: reverte exatamente a última ação,
  incluindo anteriores marcados juntos e a retomada automática (R4).

**Exemplos.**
- Dado S1E1 a S1E8 vistos. Quando o usuário desmarca S1E8. Então o próximo
  volta a ser S1E8 e o tempo total cai a duração dele.
- Dado uma série Terminada. Quando o usuário desmarca a temporada 3 inteira.
  Então aparece "10 episódios (7 h) serão desmarcados", e, confirmando, a
  série passa a Assistindo com S3E1 como próximo.

**Casos-limite.**
- Desmarcar um episódio no meio (antes da fronteira) não muda o próximo
  episódio; só cria um buraco (R5).
- Desmarcar não muda a intenção (R4).

### R17 – Reassistir

**Descrição.** Na tela do episódio, num episódio já visto, a ação
**Assisti de novo** cria mais um registro. Na tela da série, "Assisti de
novo" também existe para a temporada inteira. Filmes funcionam igual.
Reassistir não muda progresso nem estado, e não retoma série parada. O tempo
da reassistida soma no tempo total.

**Exemplos.**
- Dado S1E1 (50 min) visto uma vez. Quando o usuário marca "Assisti de
  novo". Então o episódio passa a ter 2 registros e o tempo total sobe 50
  min; "episódios vistos" não muda e "reassistidas" sobe 1.
- Dado um filme visto. Quando o usuário marca "Assisti de novo". Então o
  tempo total de filmes sobe a duração do filme.

**Casos-limite.**
- Reassistir uma série inteira com progresso próprio (uma "segunda volta"
  com seu próprio próximo episódio) fica fora desta versão. Por ora, o
  usuário marca "Assisti de novo" por temporada.

---

## G. Lançamentos no mesmo dia

### R18 – Temporada inteira no mesmo dia

**Descrição.** Quando vários episódios contáveis da mesma série passam a ser
exibidos no mesmo momento (lançamento em bloco, típico de streaming):
- Todos viram exibidos juntos; o próximo é o primeiro deles na ordem e o
  "+N" mostra o resto.
- Na chave de ordem (R7), o bloco conta como um único momento.
- Notificações saem **uma por série**, não uma por episódio: "Temporada 2
  de X disponível · 8 episódios" (R21).
- A pergunta dos anteriores funciona normalmente dentro do bloco.

**Exemplos.**
- Dado uma série Em dia e a temporada 2 (8 episódios) lançada hoje. Quando o
  bloco é exibido. Então a série vai ao topo com S2E1 e "+7", e sai uma
  notificação só.
- Dado o usuário que viu S2E1 a S2E3 no mesmo dia. Quando a lista abre.
  Então o próximo é S2E4, "+4".

**Casos-limite.**
- Lançamento em partes (4 episódios agora, 4 daqui a um mês): cada parte é
  um bloco.
- TMDB com datas diferentes por erro de cadastro dentro de um bloco: segue
  a data de cada episódio; podem sair duas notificações.

### R19 – Vários episódios no mesmo dia

**Descrição.** Episódio duplo ou maratona na TV (dois ou mais episódios na
mesma data, com ou sem horários diferentes): segue a ordem por número. Com
horários diferentes, cada um vira exibido no seu horário; com só a data,
todos viram exibidos juntos. Notificação: uma por série por dia, com o
número de episódios ("2 episódios novos de X").

**Exemplos.**
- Dado S1E9 e S1E10 na mesma data, sem horário. Quando o dia chega. Então
  S1E9 é o próximo, "+1", e sai uma notificação de estreia.

**Casos-limite.**
- Horários conhecidos e diferentes (21h e 22h): a "uma hora antes" sai só
  para o primeiro, mencionando os dois.

---

## H. Notificações de estreia e "uma hora antes"

### O problema

O TMDB informa a **data** de exibição de cada episódio, sem horário, e essa
data é a do país de origem. Isso basta para "estreia hoje", mas não para
"uma hora antes". Além disso, a data de origem nem sempre é a data no
Brasil:

- Série americana às 21h na costa leste é 22h em Brasília quando os EUA
  estão no horário de verão e 23h fora dele. Às 23h30 da costa leste, já é o
  dia seguinte em Brasília.
- Série coreana às 21h em Seul é 9h da manhã em Brasília, no mesmo dia.
- Anime "de madrugada" no Japão (por exemplo, 0h30 do dia X+1 em Tóquio) é
  12h30 do dia X em Brasília. Dependendo de quem cadastrou, o TMDB traz X ou
  X+1.
- O Brasil tem quatro fusos: UTC−2 (Fernando de Noronha), UTC−3 (Brasília,
  a maior parte), UTC−4 (Amazonas, Mato Grosso, Mato Grosso do Sul,
  Rondônia, Roraima) e UTC−5 (Acre e oeste do Amazonas). Não há horário de
  verão desde 2019, mas os países de origem têm.

### Alternativas

| | Outra fonte com horário (TVmaze) | Horário padrão por emissora | Aviso só por data |
|---|---|---|---|
| Como funciona | O backend busca no TVmaze o momento exato de exibição (data, hora e fuso) do mesmo episódio, ligando as duas bases pelos identificadores externos que o TMDB fornece (IMDb, TheTVDB) | Tabela nossa: "emissora X exibe às 21h no fuso Y"; aplica a todos os episódios da emissora | Usa só a data do TMDB e avisa num horário fixo do dia |
| "Uma hora antes" | Sim, quando o TVmaze tem horário | Sim, mas muitas vezes errado | Não |
| Datas corretas no Brasil | Sim, convertendo o momento exato para o fuso do usuário | Aproximadas | Não; erra séries de madrugada e asiáticas por um dia |
| Streaming | Costuma ter data; horário às vezes falta ou é aproximado | Ruim: streaming não tem grade | Igual ao TMDB |
| Cobertura | Boa para EUA, Reino Unido e boa parte da TV aberta e streaming; menor para Ásia e anime (a conferir) | Só as emissoras que cadastrarmos | Tudo que o TMDB tem |
| Custo e manutenção | Mais uma integração, sincronização e casamento de IDs que pode falhar | Tabela manual, com exceções sem fim (especiais, finais de temporada, mudanças de grade) | Nenhum |
| Riscos | Dependência de terceiro; licença dos dados exige atribuição e tem cláusula de compartilhamento (a conferir) | Notificação no horário errado é pior que nenhuma | Perde a função "uma hora antes", que o relato valoriza |

### Recomendação

**TVmaze como fonte complementar de horário, com queda para aviso por data.**
O TMDB continua sendo a fonte principal de séries, episódios e imagens. O
TVmaze entra só para dois dados por episódio: o momento exato de exibição e,
se faltar no TMDB, a duração (R25). Tudo pelo backend, como já é com o
TMDB; o app nunca chama nenhuma das duas. A atribuição ao TVmaze vai na tela
de créditos, ao lado da do TMDB.

O horário padrão por emissora fica descartado: o relato diz que a "uma hora
antes" chegava no horário, e uma tabela manual não sustentaria isso.

Pontos de atenção: os identificadores do TheTVDB são usados só como chave de
ligação, vindos do TMDB, sem acessar o TheTVDB; e essa escolha amplia a stack
definida no CLAUDE.md, por isso está nas decisões em aberto.

### R20 – Momento de exibição

**Descrição.** Cada episódio tem um *momento de exibição* com uma de três
qualidades:
- **Exato:** data, hora e fuso vindos do TVmaze (ou de outra fonte com
  horário).
- **Só data:** data do TMDB, sem horário.
- **Sem data.**

Quando as fontes discordam na data, vale a do TVmaze se houver horário; caso
contrário, a do TMDB.

**Casos-limite.**
- Casamento de IDs falhou ou o TVmaze não tem a série: tudo fica "só data".
- Horário mudou depois de agendada a notificação: o backend reagenda.

### R21 – Notificação de estreia

**Descrição.** Para séries acompanhadas com notificação ligada:
- **Exato:** enviada no momento da exibição: "S2E5 de X está no ar".
- **Só data:** enviada às 10h do fuso do usuário naquela data: "Estreia
  hoje: S2E5 de X".
- **Sem data:** nenhuma.

Uma notificação por série por dia (R18, R19). Séries para depois e paradas
não recebem (R3, R14).

**Exemplos.**
- Dado um episódio exato às 22h de Brasília e o usuário no Acre. Quando dá
  20h no Acre. Então chega "está no ar".
- Dado um episódio só com data, 15/11. Quando dá 10h de 15/11 no fuso do
  usuário. Então chega "Estreia hoje".

**Casos-limite.**
- Estreia de temporada (episódio 1) usa o texto "Temporada N de X estreia
  hoje" ou "está no ar".
- Notificação geral desligada nas configurações vence a da série.

### R22 – Notificação "uma hora antes"

**Descrição.** Só para episódios com momento **exato**: enviada uma hora
antes. Sem horário, não é enviada, e a tela da série mostra "horário não
informado" ao lado da data, para o usuário entender por que não recebeu.

**Exemplos.**
- Dado um episódio às 22h de Brasília. Quando dá 21h. Então chega "X começa
  em 1 hora".

**Casos-limite.**
- **Horário silencioso (proposta):** entre 0h e 7h no fuso do usuário,
  "uma hora antes" não é enviada (ficaria inútil depois), e a de estreia é
  adiada para as 7h. Ajustável nas configurações.
- Episódio marcado como visto antes da exibição (R10): nenhuma das duas
  notificações sai.

### R23 – Fusos e datas mostradas

**Descrição.** Momentos exatos são guardados em UTC e mostrados no fuso
atual do aparelho. Datas "só data" são mostradas como vieram, sem
conversão. "Em breve" agrupa por dia no fuso do usuário. A lista nunca
mostra o fuso de origem.

**Casos-limite.**
- Usuário viajando: datas e notificações acompanham o fuso do aparelho.
- Série americana das 23h30 (costa leste), com horário exato: aparece em
  "Em breve" no dia seguinte, porque em Brasília passa depois da meia-noite.
- Datas de exibição brasileira (dublagem, TV aberta nacional) não são
  consideradas: o app segue o lançamento original.

---

## I. Estatísticas básicas

### R24 – Contadores

**Descrição.**
- **Tempo total:** soma da duração de todos os registros (vistas e
  reassistidas, em lote ou não), separado em séries e filmes, mais o total
  geral.
- **Episódios vistos:** número de episódios distintos com pelo menos um
  registro, incluindo especiais marcados.
- **Filmes vistos:** número de filmes distintos com pelo menos um registro.
- **Reassistidas:** número de registros além do primeiro, para episódios e
  filmes, mostrado ao lado dos contadores acima.

Tudo é calculado a partir dos registros e das durações atuais. Se uma
duração for corrigida no TMDB, o tempo total muda junto.

**Exemplos.**
- Dado 100 episódios vistos uma vez (45 min cada) e 10 deles reassistidos
  uma vez. Quando o perfil abre. Então mostra 100 episódios, 10
  reassistidas e 82 h 30 min de séries.

**Casos-limite.**
- Série removida: seus registros somem das estatísticas (R2).
- Desmarcar reduz os contadores na hora.

### R25 – Duração de cada episódio e filme

**Descrição.** A duração usada é a primeira disponível nesta ordem:
1. Duração do episódio no TMDB.
2. Duração do episódio no TVmaze (se a integração for adotada).
3. Média das durações conhecidas da mesma temporada.
4. Duração típica da série informada no TMDB.
5. Valor padrão: 40 minutos.

Para filmes: duração do TMDB; se faltar, 100 minutos. Durações estimadas (3
a 5) aparecem marcadas como "aproximado" na tela de estatísticas quando forem
mais de 10% do total.

**Casos-limite.**
- Duração zero ou absurda (episódio acima de 5 horas) é tratada como
  ausente.
- Episódio duplo cadastrado como um só episódio: usa a duração cadastrada,
  certa ou não.

---

## Evidência

- **Nota 03** (`docs/estudo-apk/03-mapa-de-telas.md`): os seis estados
  (`show_state_*`), as seções da lista, a pergunta sobre anteriores com
  "nunca perguntar", visto uma vez / revisto, notificações de novo episódio
  e uma hora antes, e o relato de uso de 13/10/2026 (itens 3, 5, 6, 7, 8 e
  9) e a seção "Prioridades para o nosso app".
- **Conhecimento público das APIs**, não conferido nesta sessão: o TMDB
  traz data de exibição sem horário, duração por episódio (às vezes
  ausente), situação da série, temporada 0 para especiais e identificadores
  externos (IMDb, TheTVDB). O TVmaze traz data, hora e momento com fuso por
  episódio, duração, e permite procurar uma série pelos identificadores do
  IMDb e do TheTVDB. Os dados do TVmaze são publicados sob licença Creative
  Commons com atribuição e compartilhamento pela mesma licença.
- **Fusos do Brasil:** quatro fusos, sem horário de verão desde 2019.

Nenhum código, texto ou recurso do TV Time foi usado. O APK não foi aberto.

## Limitações

- **São regras propostas, não observadas.** Só os pontos confirmados pelo
  relato (pergunta dos anteriores, volta da terminada, reassistidas no tempo
  total, estreia e uma hora antes, especiais atrapalhando) têm base de uso.
  O resto é desenho nosso e deve ser validado na Fase 3.
- **Detalhes das APIs precisam ser conferidos antes da Fase 4:** cobertura
  do TVmaze para anime, Ásia e streaming brasileiro; limites de uso; termos
  exatos da licença e o que a cláusula de compartilhamento exige de nós; taxa
  de sucesso no casamento de IDs.
- **Números escolhidos sem dados:** 30 dias para "sem assistir há algum
  tempo", 14 e 30 dias para as etiquetas, 10h para aviso só por data, 40 e
  100 minutos de duração padrão, horário silencioso de 0h a 7h. Todos são
  ajustáveis.
- **Fora desta nota:** filmes além de visto/reassistido/estatísticas, listas
  personalizadas, widget, importação e a ordem alternativa de episódios
  (ordem de DVD, absoluta) que o TMDB oferece para algumas séries.

## Decisões em aberto para o Felippe

1. **Adotar o TVmaze como segunda fonte, só para horário e duração?** Isso
   amplia a stack do CLAUDE.md.
   *Recomendação:* sim, pelo backend, com atribuição nos créditos e queda
   para aviso por data quando faltar horário. Sem isso, não há "uma hora
   antes".
2. **Séries paradas com temporada nova: etiqueta discreta, sem voltar e sem
   notificação (R14)?**
   *Recomendação:* sim. Respeita quem parou porque a série ficou chata.
3. **"Lembrar minha escolha" dos anteriores vale para o app todo ou por
   série?**
   *Recomendação:* para o app todo, ajustável em Configurações. Por série
   seria mais uma opção escondida para pouco ganho.
4. **Próximo episódio depois da fronteira (pula buracos) ou o primeiro não
   visto (volta aos buracos)?**
   *Recomendação:* depois da fronteira (R5). Quem marca à frente e recusa os
   anteriores quase sempre pulou de propósito.
5. **Remover série apaga o histórico e tira as horas das estatísticas
   (R2)?**
   *Recomendação:* sim, com confirmação que mostra o que sai e sugere
   "Parei de assistir" para manter.
6. **Horário silencioso de 0h a 7h ligado por padrão (R22)?**
   *Recomendação:* sim. Séries asiáticas e de madrugada gerariam avisos de
   madrugada no Brasil.

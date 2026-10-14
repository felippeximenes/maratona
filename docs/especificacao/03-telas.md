# 03 – Telas da v1

## Situação

Aprovada em 13/10/2026.

Decisões do Felippe em 13/10/2026, já aplicadas nesta nota:
- **Sem internet:** na v1, ações que gravam (marcar, adicionar, salvar em
  coleção) exigem internet, com mensagem clara de sem conexão. Fila offline
  (marcar sem internet e enviar depois) fica para a v1.1.
- **Spoiler:** título e resumo de episódio não visto ficam ocultos também na
  página da série; só a tela do episódio oferece mostrar mesmo assim
  (diretriz de voz 8, nota 05).
- **Pedido de notificação adiado:** quem escolhe **Agora não** no primeiro
  acesso vê a explicação dos avisos mais uma vez, ao adicionar a primeira
  série.
- **Acervo separado por aba:** **Minhas séries** (aba Séries) e **Meus
  filmes** (aba Filmes), com as ações **Tirar de Minhas séries** e **Tirar de
  Meus filmes**. `01-escopo-v1.md` e `02-monetizacao.md` foram ajustados nos
  trechos sobre filmes, sem mudar critérios de aceite.
- **Termos aprovados:** **Salvar em coleção**, **Retomar**, **Agora não**,
  **Vistos**, as abas (**Séries**, **Filmes**, **Buscar**, **Perfil**),
  **Ativar avisos**, **Importar histórico**, as seções de Configurações
  (**Avisos**, **Marcar anteriores**, **Aparência**, **Assinatura**,
  **Conta**, **Sobre**, **Créditos**), **Novos episódios**, **Temporada N
  disponível** e **Gerenciar assinatura**. Glossário atualizado (nota 05 e
  CLAUDE.md).
- **Desfazer no Vi de um episódio só:** só na **Fila**, onde o cartão muda
  de lugar e o toque errado é mais comum. Na página da série e na tela
  Episódio, **Desmarcar** resolve (fluxo 4.1, passo 10).
- **Assinatura ligada a outra conta do Glowbox:** **Restaurar compras**
  transfere o Premium para a conta em uso (padrão do RevenueCat) e avisa que
  ele saiu da outra conta (fluxo 4.8).
- **Restaurar compras no plano B:** com o Premium desligado, **Restaurar
  compras** some junto com a tela de assinatura e volta quando a chave for
  ligada.
- **Ordem das seções de Minhas séries e de Meus filmes:** pela última
  atividade, mais recente primeiro, como na **Fila**. Ordem alfabética como
  opção fica para depois, se houver pedido.

Base: `01-escopo-v1.md` (itens 1 a 16), `02-monetizacao.md`, o relato de uso
de `docs/estudo-apk/03-mapa-de-telas.md`, as regras **R** de
`docs/estudo-apk/04-comportamento.md` e o glossário da seção 4 de
`docs/estudo-apk/05-tom-e-textos.md`.

Esta nota descreve só estrutura e comportamento: que telas existem, o que
cada uma mostra, o que se faz nela e como reage. Posição, tamanho, cor,
ícone e animação ficam para o design. Os textos da seção 5 são exemplos de
tom, não o texto final.

---

## 1. Navegação

### Barra inferior: quatro abas

| Aba | Conteúdo | Itens do escopo |
|---|---|---|
| **Séries** (aba inicial) | **Fila**, **Agenda** e **Minhas séries**, como três visões da mesma aba; abre na **Fila** | 3, 5, 6, 7, 8 |
| **Filmes** | **Meus filmes**, em duas visões: **Quero ver** e **Vistos**; abre em **Quero ver** | 4 |
| **Buscar** | Campo único de busca de séries e filmes | 2 |
| **Perfil** | **Seus números**, **Minhas coleções**, **Glowbox Premium** e **Configurações** | 1, 10, 12 a 15 |

Mantém o ponto de partida, com quatro ajustes:

1. **Aba inicial: Séries, na Fila.** O relato diz que o uso diário era marcar
   o próximo episódio pela lista. Abrir em outro lugar custaria um toque
   todo dia.
2. **Sem quinta aba.** A **Agenda** poderia virar aba própria, mas ela é
   consultada bem menos que a **Fila** e fala das mesmas séries; separá-las
   espalharia o acompanhamento de séries por duas abas. **Minhas coleções**
   também fica no **Perfil**: é recurso secundário e, acima de 3 coleções,
   do Premium. Quatro abas é o que o relato lembra do uso.
3. **Filmes sem Agenda.** O item 7 trata só de episódios. Filme em **Quero
   ver** que ainda não estreou mostra a data de estreia na própria lista.
4. **Configurações dentro do Perfil**, não como aba. Sem funções sociais, o
   **Perfil** não é um perfil público: é a área da pessoa (números, coleções,
   assinatura, ajustes).

Tocar na aba que já está aberta volta à primeira tela dela.

### Hierarquia

```
Entrada (sem conta)
└── Primeiro acesso: Avisos → Importar histórico (condicional) → Fila

Séries
├── Fila ─────────────┐
├── Agenda ───────────┤
└── Minhas séries ────┴─→ Página da série ─→ Episódio
Filmes (Meus filmes)
├── Quero ver ────────┐
└── Vistos ───────────┴─→ Página do filme
Buscar ─────────────────→ Página da série / Página do filme
Perfil
├── Seus números
├── Minhas coleções ─→ Coleção ─→ Página da série / Página do filme
├── Glowbox Premium (tela de assinatura)
└── Configurações
    ├── Avisos
    ├── Marcar anteriores
    ├── Aparência (tema e ícone)
    ├── Assinatura
    ├── Importar histórico (condicional)
    ├── Conta (Sair, Excluir conta)
    └── Sobre (Créditos, Política de privacidade, Termos de uso)

Transversais (abrem sobre a tela atual)
  Salvar em coleção · Pergunta de Marcar anteriores · Confirmações ·
  Desfazer · Convite do Premium
```

### Entradas de fora do app

| Origem | Destino |
|---|---|
| Notificação (**Estreia**, **Episódio novo**, **Lembrete 1 h antes**, **Aviso no dia**) | Página da série, com a temporada do episódio aberta |
| Widget da **Fila** (item 16) | Página da série tocada |
| Widget da **Agenda** (item 16) | Página da série tocada |
| Widget sem Premium | Tela **Glowbox Premium** |

Sem sessão ativa, qualquer entrada leva à **Entrada**; depois de entrar, o
app segue para o destino pedido (item 1: nenhuma tela abre sem conta).

### Regras gerais de estado

Valem para todas as telas, salvo indicação na própria tela:

- **Carregando:** a estrutura da tela aparece na hora; só o conteúdo que
  depende do backend espera. Ações que dependem desse conteúdo ficam
  indisponíveis até ele chegar.
- **Erro do backend:** a tela diz a causa em linguagem comum e oferece
  "Tentar de novo" (diretriz de voz 3).
- **Sem internet:** se a tela já tinha sido carregada, mostra o último
  conteúdo com o aviso de que está sem internet; se não, mostra a causa e
  "Tentar de novo". Ações que gravam (marcar, adicionar, salvar em coleção,
  mudar estado, assinar) não são feitas: o app diz que está sem conexão e
  nada muda na tela, sem animação de marcação. Fila offline fica para a
  v1.1.
- **Servidor recusou uma ação otimista** (item 5): com internet, a tela muda
  na hora; se o servidor recusar, volta ao estado anterior e o app avisa o
  que não foi salvo.
- **Premium desligado (plano B):** a tela **Glowbox Premium**, a entrada
  dela no **Perfil**, **Restaurar compras** e todo convite para assinar
  somem; os limites do plano
  grátis continuam valendo e são só explicados.

---

## 2. Primeiro acesso

### Passos

1. **Entrada.** A pessoa escolhe **Entrar com Google** ou **Entrar com
   Apple**. A Política de privacidade abre desta tela.
2. **Conta nova?** Se a conta já existe, o app pula para o passo 5 (os
   passos 3 e 4 são do primeiro acesso da conta, não do aparelho). Num
   aparelho novo de conta antiga, só o pedido do sistema do passo 3 é feito,
   se ainda não foi.
3. **Explicação dos avisos**, antes do pedido do sistema. Diz em até duas
   frases o que o app avisa (**Estreia** e **Episódio novo**, com
   **Lembrete 1 h antes**) e que dá para mudar depois em Configurações.
   Duas ações:
   - **Ativar avisos:** abre o pedido de permissão do sistema (no iOS e no
     Android 13 em diante). A resposta do sistema vale, seja qual for.
   - **Agora não:** segue sem abrir o pedido do sistema. A explicação volta
     uma única vez, quando a pessoa adicionar a primeira série (fluxo 4.3);
     depois disso, só em Configurações > Avisos.
4. **Importar histórico** (só se o item 11 entrar na v1). Oferta opcional
   de trazer o histórico de um arquivo de exportação de outro app. Duas
   ações: escolher o arquivo (abre a tela "Importar histórico") ou **Agora
   não**. A oferta fica também em Configurações.
5. **Fila**, vazia no primeiro acesso, com o caminho para **Buscar**.

### Tela: Entrada

- **Objetivo:** criar conta ou entrar nela.
- **Mostra:** nome do app, **Entrar com Google**, **Entrar com Apple**,
  acesso à Política de privacidade.
- **Ações:** entrar com uma das duas contas; abrir a Política.
- **Estados:** carregando (enquanto a conta é conferida, os dois botões
  ficam indisponíveis); erro (login cancelado pela pessoa não é erro e não
  gera aviso; falha do Google, da Apple ou do backend diz a causa e permite
  tentar de novo); sem internet (diz a causa; os botões tentam de novo).
- **Atende:** item 1; item 12 (Política na entrada).

### Tela: Explicação dos avisos

- **Objetivo:** explicar o valor dos avisos antes do pedido do sistema, que
  só pode ser feito uma vez no iOS.
- **Mostra:** o que é avisado e quando, sem exemplo com título de episódio
  (diretriz de voz 8).
- **Ações:** **Ativar avisos**, **Agora não**.
- **Estados:** não depende do backend. Se o sistema já tem a resposta
  (permissão concedida ou negada), a tela não aparece.
- **Atende:** item 9; R21, R21a.

### Tela: Importar histórico (condicional)

- **Objetivo:** trazer séries, filmes e episódios vistos de um arquivo de
  exportação.
- **Mostra:** o que é importado, o nome do arquivo de origem e, ao final,
  quantos itens entraram e a lista dos que não foram encontrados.
- **Ações:** escolher o arquivo no aparelho; acompanhar o andamento; ver
  os não encontrados e tocar num deles para buscá-lo à mão em **Buscar**.
- **Estados:** carregando (andamento enquanto o backend lê o arquivo; a
  pessoa pode sair da tela e o resultado fica em Configurações); erro
  (arquivo ilegível ou de outro formato: diz qual é o problema e permite
  escolher outro); sem internet (o envio não começa); importar o mesmo
  arquivo de novo não duplica registros e informa que nada novo entrou.
- **Atende:** item 11; R1, R15, R24. Não usa a R9 (a importação já traz a
  escolha explícita). Não usa nome, texto nem marca do app de origem além
  do nome do arquivo.

---

## 3. Telas

### 3.1 Fila (Séries)

- **Objetivo:** mostrar o próximo episódio de cada série que a pessoa está
  vendo e permitir marcar com um toque.
- **Mostra:** só séries **Vendo**, em três blocos nesta ordem: séries em
  andamento (sem título de bloco), **Para começar** e **Faz tempo**. Cada
  série mostra pôster, nome, "Próximo: T2 E5" e "+N" quando houver mais
  episódios exibidos depois do próximo. Série que voltou de **Aguardando**
  ou **Concluída** mostra o destaque "Novos episódios" (some quando a
  pessoa marca um episódio dela ou depois de 14 dias). Nunca mostra título
  nem resumo do episódio.
- **Ações:**
  - **Vi** no próximo episódio: marca, segue o fluxo 4.1 e atualiza o
    cartão e a ordem sem recarregar a tela. A confirmação leve oferece
    **Desfazer**, mesmo para um episódio só.
  - Tocar na série: abre a Página da série.
  - Pressionar e segurar a série: menu com **Quero ver**, **Larguei**,
    **Salvar em coleção** e **Tirar de Minhas séries**.
- **Ordem:** chave da R7 (a mais recente entre a última atividade e a
  exibição do próximo episódio), da mais recente para a mais antiga;
  **Para começar** pela data em que a série foi adicionada; **Faz tempo**
  para chave com mais de 30 dias.
- **Estados:**
  - Carregando: estrutura dos blocos, sem cartões.
  - Vazio sem nenhuma série em **Minhas séries**: convite para buscar a
    primeira série, com caminho para **Buscar**.
  - Vazio com séries, mas nenhuma **Vendo**: diz que não há episódio para
    ver agora e aponta para **Agenda** e **Minhas séries**.
  - Erro e sem internet: regras gerais. Sem internet, **Vi** não marca e o
    app diz que está sem conexão.
- **Atende:** item 6, item 5 (marcar), item 13 (salvar em coleção);
  R3, R4, R5, R6, R7, R8, R9, R13, R18, R19.

### 3.2 Agenda (Séries)

- **Objetivo:** mostrar o que vai sair das séries acompanhadas.
- **Mostra:** episódios ainda não exibidos e com data das séries **Vendo** e
  **Aguardando**, agrupados por dia (ontem, hoje, amanhã e datas seguintes)
  no fuso do aparelho. Cada linha: série, temporada e número (T2 E5), e hora
  quando conhecida. Lançamento em bloco vira uma linha por série
  ("Temporada 2 · 8 episódios"). Estreia de temporada aparece como
  **Estreia**. Nunca mostra título nem resumo de episódio.
- **Ações:** tocar numa linha abre a Página da série, na temporada do
  episódio.
- **Estados:**
  - Carregando: estrutura dos grupos de dia, sem linhas.
  - Vazio: diz que nenhuma série acompanhada tem episódio com data marcada.
  - Erro e sem internet: regras gerais.
- **Atende:** item 7; R1, R6, R18, R19, R20, R23. Diretriz de voz 8.

### 3.3 Minhas séries (Séries)

- **Objetivo:** ver e organizar todas as séries do acervo pelo estado.
- **Mostra:** uma seção por estado, nesta ordem: **Vendo**, **Aguardando**,
  **Concluída**, **Quero ver** e **Larguei**. Dentro de cada seção, as
  séries seguem a última atividade, da mais recente para a mais antiga.
  Cada série mostra pôster, nome e progresso (episódios vistos de
  exibidos). Em **Quero ver** e
  **Larguei**, série com episódio novo mostra a etiqueta "Temporada N
  disponível" (some ao **Retomar** ou depois de 30 dias). Seções vazias não
  aparecem.
- **Ações:** tocar na série abre a Página da série; pressionar e segurar
  abre o mesmo menu da **Fila**, com **Retomar** no lugar de **Quero ver**
  ou **Larguei** quando a série já está num desses estados.
- **Estados:**
  - Carregando: estrutura das seções.
  - Vazio: igual ao vazio da **Fila**.
  - Erro e sem internet: regras gerais.
- **Atende:** itens 3 e 13; R1, R2, R3, R14.

### 3.4 Página da série

- **Objetivo:** ver tudo de uma série e marcar o progresso nela.
- **Mostra:**
  - Pôster, nome, ano, sinopse da série, situação de produção (**Em
    produção**, **Fim da série** ou **Cancelada**) e o estado (**Vendo**,
    **Aguardando**, **Concluída**, **Quero ver**, **Larguei**), ou nada se
    não estiver em **Minhas séries**.
  - O próximo episódio, quando houver (R5), só com T2 E5.
  - Temporadas em ordem. Cada temporada mostra quantos episódios foram
    vistos e quantos exibidos ficaram sem marcar (R5); aberta, lista os
    episódios com número (T2 E5), data (ou "sem data"), "horário não
    informado" quando só houver data, **Visto** e o selo **2×** (ou mais)
    quando houver **Vi de novo**. Título aparece só em episódio **Visto**;
    episódio não visto não mostra título nem resumo (diretriz de voz 8).
  - **Extras** numa seção recolhida no fim, quando a série tiver temporada
    0, com a opção **Incluir extras**.
  - Etiqueta "Temporada N disponível" em **Quero ver** e **Larguei** (R14).
- **Ações:**
  - Fora de **Minhas séries**: **Adicionar** (entra como **Vendo**) ou
    **Quero ver**.
  - Em **Minhas séries**: **Quero ver**, **Larguei** ou **Retomar**
    (conforme o estado); **Salvar em coleção**; **Tirar de Minhas séries**
    (fluxo 4.4).
  - **Vi** em cada episódio (fluxo 4.1); **Desmarcar** em episódio visto.
  - **Marcar temporada** em cada temporada (fluxo 4.2) e desmarcar a
    temporada inteira.
  - Tocar num episódio abre a tela Episódio.
  - Ligar ou desligar **Incluir extras**.
- **Estados:**
  - Carregando: dados básicos da série primeiro; temporadas depois.
  - Vazio: série sem nenhum episódio cadastrado diz isso e continua
    permitindo **Adicionar** e **Quero ver**.
  - Erro e sem internet: regras gerais.
- **Atende:** itens 3, 5, 8, 13; R1, R2, R3, R4, R5, R8, R9, R10, R11, R12,
  R14, R16, R17, R22.

### 3.5 Episódio

- **Objetivo:** ver um episódio e as ações que não cabem na lista: **Vi de
  novo** e desmarcar com várias vezes vistas.
- **Mostra:** série, T2 E5, data e hora (ou "horário não informado", ou
  "sem data"), duração, **Visto** e quantas vezes. Título e resumo ficam
  ocultos até o episódio estar **Visto**, com a opção de mostrar mesmo
  assim, que vale só para aquela vez.
- **Ações:** **Vi** (fluxo 4.1); **Vi de novo** em episódio visto;
  **Desmarcar** (com **Vi de novo**, pergunta se remove só a última vez ou
  todas); ir para o episódio anterior ou seguinte; voltar à série.
- **Estados:** carregando, erro e sem internet pelas regras gerais.
  Episódio não exibido mostra a data de estreia; **Vi** nele pede a
  confirmação da R10.
- **Atende:** item 5; R10, R15, R16, R17. Diretriz de voz 8.

### 3.6 Meus filmes (Filmes)

- **Objetivo:** ver os filmes do acervo.
- **Mostra:** duas visões, cada uma ordenada pela última atividade no
  filme (inclusão, marcação ou **Vi de novo**), da mais recente para a mais
  antiga. **Quero ver**: filmes sem registro; filme que ainda não estreou
  mostra a data. **Vistos**: filmes com registro, com o selo **2×** quando
  houver **Vi de novo**.
- **Ações:** tocar abre a Página do filme; pressionar e segurar abre **Vi**
  (em **Quero ver**), **Salvar em coleção** e **Tirar de Meus filmes**.
- **Estados:**
  - Carregando: estrutura da visão.
  - Vazio em **Quero ver**: convite para buscar um filme, com caminho para
    **Buscar**.
  - Vazio em **Vistos**: diz que os filmes marcados com **Vi** aparecem ali.
  - Erro e sem internet: regras gerais.
- **Atende:** item 4; R15, R16, R17.

### 3.7 Página do filme

- **Objetivo:** ver um filme e marcá-lo.
- **Mostra:** pôster, título, ano, duração e sinopse do TMDB; **Quero ver**
  ou **Visto** (com quantas vezes).
- **Ações:**
  - Sem registro: **Quero ver** (põe em **Meus filmes** sem registro) e
    **Vi** (cria o registro e, se estava em **Quero ver**, passa para
    **Vistos**). Filme ainda não lançado pede confirmação antes do **Vi**.
  - Visto: **Vi de novo** (mais um registro) e **Desmarcar** (com mais de
    um registro, pergunta se remove só a última vez ou todas).
  - **Salvar em coleção**; **Tirar de Meus filmes** (fluxo 4.4).
- **Estados:** carregando, erro e sem internet pelas regras gerais.
- **Atende:** itens 4, 10 e 13; R15, R16, R17, R24, R25.

### 3.8 Buscar

- **Objetivo:** encontrar séries e filmes e adicioná-los sem abrir a
  página.
- **Mostra:** um campo único; os resultados misturam séries e filmes, cada
  um com pôster, título, ano, tipo (Série ou Filme) e se já está em
  **Minhas séries** ou em **Meus filmes** (com o estado, quando estiver).
- **Ações:** digitar (a busca começa sozinha depois de uma pausa curta);
  **Adicionar** num resultado (fluxo 4.3); **Salvar em coleção** pelo
  pressionar e segurar; tocar abre a página.
- **Estados:**
  - Antes de digitar: só o campo, com uma frase do que dá para buscar.
  - Carregando: os resultados anteriores somem e a espera é indicada.
  - Sem resultado: diz que nada foi encontrado para o termo e sugere
    conferir a grafia.
  - Erro e sem internet: diz a causa e oferece "Tentar de novo" (item 2).
- **Atende:** item 2 e item 13; R2. Toda consulta passa pelo backend (regra
  3 do CLAUDE.md).

### 3.9 Perfil

- **Objetivo:** reunir o que é da pessoa e não é acompanhamento do dia a
  dia.
- **Mostra:** nome e foto da conta (do Google ou da Apple, quando houver);
  um resumo de **Seus números** (**Horas vistas** e **Episódios vistos**);
  entradas para **Seus números**, **Minhas coleções**, **Glowbox Premium**
  (ou o plano ativo, para quem já assina) e **Configurações**.
- **Ações:** abrir cada uma das entradas.
- **Estados:** carregando só no resumo; erro e sem internet pelas regras
  gerais; com Premium desligado, a entrada **Glowbox Premium** não aparece.
- **Atende:** itens 10, 13, 14.

### 3.10 Seus números

- **Objetivo:** mostrar quanto a pessoa já viu.
- **Mostra:** **Horas vistas** (séries, filmes e total), **Episódios
  vistos**, **Filmes vistos** e, ao lado, quantas vezes houve **Vi de
  novo**. As horas aparecem como "aproximado" quando durações estimadas
  passam de 10% do total.
- **Ações:** nenhuma além de voltar.
- **Estados:**
  - Carregando: rótulos sem números.
  - Vazio: zeros, com uma frase de que os números crescem a cada **Vi**.
  - Erro e sem internet: regras gerais.
- **Atende:** item 10; R2, R15, R24, R25.

### 3.11 Minhas coleções

- **Objetivo:** criar e organizar coleções.
- **Mostra:** as coleções, com nome, quantidade de itens e o pôster do
  primeiro item; no plano grátis, quantas das 3 já foram usadas.
- **Ações:** **Nova coleção** (nome obrigatório); abrir uma coleção;
  renomear e apagar (apagar pede confirmação com o botão "Apagar" e não
  mexe em **Minhas séries**, em **Meus filmes** nem nos registros); mudar a
  ordem das coleções.
- **Estados:**
  - Carregando, erro e sem internet: regras gerais.
  - Vazio: explica o que é uma coleção e que **Quero ver** não é uma delas.
  - **Bloqueado pelo Premium:** no plano grátis com 3 ou mais coleções,
    **Nova coleção** explica o limite e oferece o Premium (convite que abre
    a tela **Glowbox Premium**). Com Premium desligado, só explica o
    limite. O mesmo vale depois que o Premium acaba: nada é apagado e tudo
    continua editável.
- **Atende:** item 13; `02-monetizacao.md` (Fim do Premium, plano B).

### 3.12 Coleção

- **Objetivo:** ver e ordenar os itens de uma coleção.
- **Mostra:** nome da coleção e os itens (séries e filmes) na ordem
  escolhida, cada um com pôster, título, tipo e o estado em **Minhas
  séries** ou **Meus filmes**, quando estiver lá.
- **Ações:** tocar abre a página do item; **Tirar desta coleção**; mudar a
  ordem arrastando; renomear e apagar a coleção.
- **Estados:**
  - Vazio: diz que séries e filmes entram pela página deles e pela busca,
    com **Salvar em coleção**.
  - Carregando, erro e sem internet: regras gerais.
- **Atende:** item 13.

### 3.13 Salvar em coleção (transversal)

- **Objetivo:** pôr uma série ou um filme em uma ou mais coleções.
- **Abre de:** Página da série, Página do filme, Buscar, e o pressionar e
  segurar da **Fila**, de **Minhas séries** e de **Meus filmes**.
- **Mostra:** as coleções, indicando em quais o item já está.
- **Ações:** escolher ou tirar coleções (tirar aqui equivale a **Tirar
  desta coleção**); **Nova coleção** sem sair do fluxo, com o item já
  salvo nela.
- **Estados:** vazio (sem coleções, mostra só **Nova coleção**); bloqueado
  pelo Premium em **Nova coleção**, como em Minhas coleções; sem internet
  não grava.
- **Regra:** não muda o estado do item nem o põe em **Minhas séries** ou
  **Meus filmes**.
- **Atende:** item 13. Fluxo 4.6.

### 3.14 Glowbox Premium (tela de assinatura)

- **Objetivo:** vender a assinatura com as informações que as lojas exigem.
- **Abre de:** **Perfil**, convites do Premium (coleções, temas, ícones),
  widget sem Premium.
- **Mostra:** o que o Premium inclui (coleções sem limite, temas e ícones
  alternativos, widgets enquanto estiverem na versão); os dois planos com
  preço e período vindos da loja; no anual, "7 dias grátis", o preço
  cobrado depois e a data da primeira cobrança, só para quem tem direito ao
  teste; renovação automática e como cancelar; links para Termos de uso e
  Política de privacidade; tudo isso antes do botão **Assinar**.
- **Ações:** escolher o plano e **Assinar** (fluxo 4.7); **Restaurar
  compras** (fluxo 4.8).
- **Estados:**
  - Carregando: os planos esperam os preços da loja; **Assinar** fica
    indisponível até eles chegarem.
  - Erro da loja ou do RevenueCat: diz a causa e permite tentar de novo.
  - Compra cancelada pela pessoa: volta à tela sem aviso de erro.
  - Pagamento pendente (aprovação de terceiro ou forma de pagamento que
    demora): diz que o Premium é liberado quando a loja confirmar.
  - Concluída: o Premium vale na hora, sem reiniciar, e a tela mostra que
    ele está ativo.
  - Já assinante: mostra o plano atual no lugar da oferta.
  - Sem internet: regras gerais; **Assinar** não abre a loja.
  - Premium desligado: a tela não existe.
- **Atende:** item 14; item 12 (Termos e Política).

### 3.15 Configurações

Uma tela com entradas para as subtelas abaixo. Carregando, erro e sem
internet seguem as regras gerais; as opções mostram o valor salvo na conta.

**Avisos.** Chaves de **Estreia** e de **Episódio novo**; em cada uma, as
opções de aviso na hora e **Lembrete 1 h antes**, com os padrões do item 9;
horário silencioso (ligado, início e fim). Se a permissão do sistema estiver
negada ou nunca tiver sido pedida, a tela diz isso no topo e oferece abrir
os ajustes do aparelho (ou o pedido do sistema, se ainda não foi feito); as
opções continuam editáveis. Atende item 9; R21, R21a, R22, R22a.

**Marcar anteriores.** Os três valores: **Perguntar** (padrão), **Sempre
marcar** e **Nunca marcar**. Atende item 5; R9.

**Aparência.** Tema padrão (claro, escuro, automático), grátis. Temas e
ícones alternativos aparecem para todos; sem Premium, escolher um deles
abre o convite do Premium em vez de aplicar (**bloqueado pelo Premium**).
Com Premium desligado, os alternativos não aparecem. Trocar o tema muda o
app na hora. Atende item 15.

**Assinatura.** Plano, data da próxima renovação ou do fim, atalho para
gerenciar na loja e **Restaurar compras**. Sem Premium, mostra o convite.
Com Premium desligado, a seção não aparece, e **Restaurar compras** some
com ela. Atende item 14.

**Importar histórico** (condicional). Abre a tela de importação e mostra o
resultado da última. Atende item 11.

**Conta.** **Sair** (confirma, apaga do aparelho os dados da conta e volta à
**Entrada**) e **Excluir conta** (fluxo 4.5). Atende item 1.

**Sobre.** **Créditos** (logo e aviso do TMDB no formato exigido; TVmaze
como fonte de horários e durações, com link e licença CC BY-SA), Política de
privacidade, Termos de uso e versão do app. Atende item 12; regra 3 do
CLAUDE.md; seção H da nota 04.

### 3.16 Widgets (fora do app)

Não são telas do app, mas fazem parte da navegação: tocar numa série do
widget da **Fila** ou numa linha do widget da **Agenda** abre a Página da
série; sem Premium, o widget diz que é do Premium e o toque abre a tela
**Glowbox Premium**. Conteúdo e regras no item 16 de `01-escopo-v1.md`
(R5, R6, R7, R18, R19, R20, R23).

---

## 4. Fluxos principais

Em todos os fluxos que gravam, sem internet a ação não começa: o app diz
que está sem conexão e nada muda (regras gerais).

### 4.1 Marcar episódio

Vale para **Vi** na **Fila**, na Página da série e na tela Episódio.

1. A pessoa toca em **Vi** no episódio E.
2. Se E ainda não foi exibido (ou não tem data), o app pede confirmação
   com a data de estreia ou "sem data" (R10). Se a pessoa não confirma, nada
   muda.
3. O app calcula os anteriores pendentes: episódios não vistos antes de E
   e depois do último visto antes dele, sem **Extras** a não ser com
   **Incluir extras** (R8, R11).
4. Sem anteriores pendentes, vai para o passo 7.
5. Com anteriores pendentes, segue a regra de **Marcar anteriores** em
   Configurações:
   - **Sempre marcar:** marca E e os N anteriores, sem perguntar.
   - **Nunca marcar:** marca só E.
   - **Perguntar** (padrão): abre a pergunta com **Marcar os N**, **Só
     este** e a caixa **Lembrar minha escolha**. Fechar a pergunta sem
     escolher cancela a marcação.
6. Se a caixa **Lembrar minha escolha** foi marcada, a resposta vira a
   regra global (**Sempre marcar** ou **Nunca marcar**) (R9).
7. E (e os anteriores, se for o caso) muda para **Visto** na tela na hora,
   sem esperar o servidor. Os registros em grupo levam a marca "em lote"
   (R15).
8. O app recalcula fronteira, próximo episódio, "+N" e estado (R1, R5). Na
   **Fila**, o cartão mostra o novo próximo episódio e muda de lugar (R7);
   se a série não tem mais episódio exibido a ver, sai da **Fila** e passa a
   **Aguardando** ou **Concluída**.
9. Se a série estava em **Quero ver** ou **Larguei**, ela é retomada e o
   app avisa com **Desfazer** (R4). Se não estava em **Minhas séries**, é
   adicionada como **Vendo** (R4).
10. Marcação em grupo mostra a confirmação leve com o número de episódios
    e **Desfazer**, que reverte tudo, inclusive a retomada (R16). Na
    **Fila**, a confirmação leve com **Desfazer** aparece também quando só
    um episódio foi marcado; nas outras telas, um episódio só se corrige
    com **Desmarcar**.
11. Avisos pendentes dos episódios marcados são cancelados (item 9).
12. Se o servidor recusar, a tela volta ao estado de antes do passo 7 e o
    app avisa que a marcação não foi salva.

### 4.2 Marcar temporada inteira

1. Na Página da série, a pessoa toca em **Marcar temporada** na temporada
   T.
2. O app separa os episódios de T: só os exibidos e ainda não vistos, sem
   **Extras** (a não ser com **Incluir extras**; a seção **Extras** se
   marca um a um). Episódios de T ainda não exibidos ficam de fora; se
   todos forem futuros, o app pede a confirmação da R10 para marcá-los.
3. Se não houver nada a marcar em T, a ação não aparece.
4. O app calcula os anteriores pendentes nas temporadas antes de T, depois
   do último episódio visto (R8).
5. Com anteriores pendentes, segue a regra de **Marcar anteriores**, como
   nos passos 5 e 6 do fluxo 4.1, com o número de episódios das temporadas
   anteriores na pergunta.
6. Os episódios mudam para **Visto** na tela na hora, com registros "em
   lote" (R15).
7. O app recalcula próximo episódio e estado (R1, R5); aplica a retomada da
   R4 se a série estava em **Quero ver** ou **Larguei**.
8. A confirmação leve mostra o total marcado e **Desfazer**, que reverte a
   ação inteira (item 5).
9. Avisos pendentes dos episódios marcados são cancelados.
10. Se o servidor recusar, tudo volta ao estado anterior e o app avisa.

Desmarcar a temporada inteira é o caminho inverso: pede confirmação com o
número de episódios e as horas que saem de **Seus números** (R16), e
oferece **Desfazer**.

### 4.3 Adicionar série ou filme

**De Buscar:**
1. A pessoa busca e toca em **Adicionar** num resultado que não está no
   acervo.
2. Série: entra em **Minhas séries** como **Vendo**, sem episódios vistos,
   no bloco **Para começar** da **Fila** (R2). Filme: entra em **Meus
   filmes**, em **Quero ver** (item 4).
3. O resultado passa a mostrar que está no acervo, com o estado.
4. Se a pessoa escolheu **Agora não** nos avisos do primeiro acesso, o
   sistema ainda não tem a resposta e esta é a primeira série adicionada, o
   app mostra a explicação dos avisos mais uma vez, com **Ativar avisos** e
   **Agora não**. Isso acontece uma única vez por conta.
5. Se o servidor recusar, o resultado volta a não estar no acervo e o app
   avisa.

**Da Página da série:** **Adicionar** (entra como **Vendo**) ou **Quero
ver**. A página passa a mostrar o estado e as ações de quem está em
**Minhas séries**. O passo 4 acima vale aqui também.

**Da Página do filme:** **Quero ver** ou **Vi** direto (o filme entra em
**Meus filmes** já com registro, em **Vistos**).

**Por marcação:** marcar um episódio de série fora de **Minhas séries**
adiciona a série como **Vendo** (R4, fluxo 4.1, passo 9).

### 4.4 Tirar de Minhas séries / Tirar de Meus filmes

1. A pessoa escolhe **Tirar de Minhas séries** (série) ou **Tirar de Meus
   filmes** (filme) na página do item ou no pressionar e segurar.
2. O app pede confirmação com o número de episódios (ou vezes vistas) e de
   horas que saem de **Seus números**. Em série, sugere **Larguei** para
   guardar o histórico. O botão de confirmar repete o nome da ação.
3. Confirmado, o item sai das listas e o app oferece **Desfazer** por 6
   segundos. Desfazer restaura estado, registros e opções (R2).
4. Passados os 6 segundos, ou se a pessoa sair do app antes, a remoção vale.
   As coleções em que o item estava não mudam.

### 4.5 Excluir conta

1. Em Configurações > Conta, a pessoa toca em **Excluir conta**.
2. A confirmação explica o que é apagado (conta, **Minhas séries**, **Meus
   filmes**, coleções, registros, opções e avisos agendados) e que não há
   como desfazer. Com Premium ativo, avisa que a assinatura continua na loja
   e oferece o atalho para gerenciá-la.
3. O botão de confirmar diz "Excluir".
4. O backend apaga os dados e, em conta Apple, revoga o acesso junto à
   Apple. O app volta à **Entrada**.

A página web de exclusão (exigência do Google Play) fica fora do app e não
é descrita aqui.

### 4.6 Salvar em coleção

1. A pessoa toca em **Salvar em coleção** na página do item, num resultado
   de **Buscar** (pressionar e segurar) ou no menu de uma lista.
2. Abre a escolha de coleções, com as que já contêm o item indicadas.
3. Tocar numa coleção sem o item salva o item nela; tocar numa coleção com
   o item o tira dela (**Tirar desta coleção**). Cada toque grava na hora,
   com a mudança visível sem esperar o servidor.
4. **Nova coleção:** pede o nome (obrigatório), cria a coleção e já salva o
   item nela.
   - No plano grátis com 3 ou mais coleções, em vez de pedir o nome, o app
     explica o limite e oferece o Premium; aceitando, abre a tela
     **Glowbox Premium** (fluxo 4.7) e, se a assinatura for concluída,
     volta para criar a coleção com o item.
   - Com Premium desligado, só explica o limite.
   - O backend confere o limite de novo; se recusar, a coleção não é criada
     e o app explica o limite.
5. Fechar a escolha confirma o que já foi gravado e mostra uma confirmação
   leve com o nome da coleção (quando foi uma só).
6. O estado do item e o acervo não mudam (item 13).
7. Se o servidor recusar uma gravação, a coleção volta a aparecer como
   antes e o app avisa.

### 4.7 Assinar o Premium

1. A pessoa abre a tela **Glowbox Premium** pelo **Perfil**, por um convite
   (coleção, tema, ícone) ou pelo widget.
2. O app busca na loja, via RevenueCat, os preços dos dois planos e se a
   pessoa tem direito ao teste de 7 dias no anual.
3. A tela mostra os planos, a renovação automática, como cancelar e os
   links de Termos e Política (item 14). Sem direito ao teste, o anual
   aparece com o preço normal.
4. A pessoa escolhe o plano e toca em **Assinar**.
5. Abre a compra da loja (Apple ou Google Play), com a conta da loja do
   aparelho. O app não pede nenhum dado de pagamento.
6. Resultado:
   - **Concluída:** o RevenueCat confirma, o Premium é liberado na hora sem
     reiniciar e o backend registra pelo evento do RevenueCat. A tela
     mostra que o Premium está ativo e, se a pessoa veio de um convite,
     volta à ação que estava fazendo (por exemplo, criar a coleção ou
     aplicar o tema).
   - **Cancelada pela pessoa:** volta à tela, sem aviso de erro.
   - **Pendente:** a tela diz que o Premium é liberado quando a loja
     confirmar; a liberação chega depois sem ação da pessoa.
   - **Erro da loja:** diz a causa e permite tentar de novo.
7. Configurações > Assinatura passa a mostrar o plano e a próxima data de
   renovação (ou o fim do teste).

### 4.8 Restaurar compras

Com o Premium desligado (plano B), este fluxo não existe: o botão não
aparece.

1. A pessoa toca em **Restaurar compras** na tela **Glowbox Premium** ou em
   Configurações > Assinatura.
2. O app pede ao RevenueCat as compras da conta da loja do aparelho.
3. Resultado:
   - **Assinatura ativa encontrada:** o Premium é liberado na conta do
     Glowbox em uso, sem reiniciar, e o app confirma.
   - **Nenhuma assinatura ativa:** o app diz que não encontrou assinatura
     nesta conta da loja e lembra que a compra precisa ter sido feita com
     ela.
   - **Assinatura ligada a outra conta do Glowbox:** o Premium é
     transferido para a conta em uso (padrão do RevenueCat), e o app avisa
     que ele saiu da outra conta. A outra conta volta ao plano grátis, com
     as regras de "Fim do Premium" de `02-monetizacao.md`.
   - **Erro da loja ou sem internet:** diz a causa e permite tentar de
     novo.
4. Quem entra com a mesma conta do Glowbox em outro aparelho não precisa
   restaurar: o Premium vem do backend (item 14).

---

## 5. Textos de interface (exemplos)

Exemplos curtos para fixar o tom da nota 05 (você, frases curtas, verbo da
ação no botão, erro com causa e saída, emoji só em comemoração, sem
spoiler). Não são o texto final; botões entre colchetes.

| Situação | Exemplo |
|---|---|
| Fila vazia | Sua Fila está vazia. Busque uma série para começar. [Buscar] |
| Nada para ver agora | Nenhum episódio novo por enquanto. Confira a Agenda. |
| Agenda vazia | Nenhuma estreia marcada nas suas séries. |
| Sem internet (tela) | Sem internet. Confira a conexão e tente de novo. [Tentar de novo] |
| Sem internet (ao marcar) | Sem internet. O episódio não foi marcado. |
| Servidor recusou | Não deu para salvar agora. O episódio voltou para não visto. |
| Marcar anteriores | Marcar também os 5 anteriores? [Marcar os 5] [Só este] ☐ Lembrar minha escolha |
| Episódio não exibido | T5 E1 estreia em 18/10. Marcar mesmo assim? [Marcar] |
| Confirmação leve (grupo) | Visto, mais 5 anteriores. [Desfazer] |
| Série retomada | Série retomada. [Desfazer] |
| Série concluída | Série concluída! 🎉 |
| Tirar de Minhas séries | 40 episódios e 28 h saem de Seus números. Para guardar o histórico, use Larguei. [Tirar de Minhas séries] [Larguei] |
| Depois de tirar | Saiu de Minhas séries. [Desfazer] |
| Explicação dos avisos | Avisamos quando sair episódio das suas séries e, se soubermos o horário, 1 h antes. [Ativar avisos] [Agora não] |
| Avisos negados | As notificações estão desligadas no aparelho. [Abrir ajustes] |
| Busca sem resultado | Nada encontrado para "dark". Confira a grafia. |
| Salvo em coleção | Salvo em Terror dos anos 80. |
| Apagar coleção | Apagar "Terror dos anos 80"? Séries e filmes continuam no seu acervo. [Apagar] |
| Limite de coleções | No plano grátis, são até 3 coleções. Com o Premium, quantas quiser. [Assinar] |
| Limite (Premium desligado) | No plano grátis, são até 3 coleções. |
| Tema do Premium | Este tema é do Premium. [Assinar] |
| Teste grátis | 7 dias grátis, depois R$ 39,90 por ano. Primeira cobrança em 20/10. |
| Pagamento pendente | Pagamento em análise na loja. O Premium chega assim que for aprovado. |
| Restaurar sem compra | Nenhuma assinatura nesta conta da loja. |
| Premium restaurado | Premium restaurado. |
| Restaurado de outra conta | Premium restaurado. Ele saiu da outra conta do Glowbox ligada a esta loja. |
| Desfazer na Fila | Visto. [Desfazer] |
| Excluir conta | Excluir sua conta? Séries, filmes, coleções e números serão apagados de vez. [Excluir] |
| Excluir com Premium | Sua assinatura continua na loja. Cancele lá para evitar a próxima cobrança. [Gerenciar assinatura] |
| Importação concluída | 120 itens importados. 4 não foram encontrados. |
| Notificação de estreia | Temporada 3 de Ruptura estreia hoje. |
| Lembrete 1 h antes | Ruptura começa em 1 h. |


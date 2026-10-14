# 01 – Escopo da versão 1

## Decisão

Escopo aprovado pelo Felippe em 13/10/2026.

Os termos seguem o glossário de `docs/estudo-apk/05-tom-e-textos.md` (seção
4). As regras citadas como **R** são as de `docs/estudo-apk/04-comportamento.md`;
lá elas usam nomes de trabalho, aqui já aparecem com os termos do glossário
(por exemplo, "Assistindo" virou **Vendo** e "Em breve" virou **Agenda**).

## Premissas

- **Séries e filmes desde a v1.**
- **Conta obrigatória.** Entrar com Google e com Apple. A Apple exige
  "Entrar com Apple" quando o app oferece login com Google. Excluir a conta
  tem de ser possível dentro do app (exigência das duas lojas).
- **Android e iOS juntos, com Expo.** Os testes no iOS exigem um iPhone; o
  build é feito na nuvem com EAS, sem Mac.
- **Custos só na publicação:** Google Play, US$ 25 (uma vez); Apple
  Developer, US$ 99 por ano.
- **Importação do TV Time é condicional:** só entra se o Felippe encontrar o
  arquivo de exportação e ele for legível.

## Entra na v1

Cada item tem critérios de aceite objetivos (cada um pode ser conferido com
sim ou não) e as regras R relacionadas.

### 1. Conta

Entrar com Google e com Apple, sair e excluir conta.

**Critérios de aceite**
- No Android e no iOS, a tela de entrada mostra **Entrar com Google** e
  **Entrar com Apple**; as duas criam a conta no primeiro acesso e entram
  nela nos seguintes. Nenhuma outra tela do app abre sem conta.
- **Sair** encerra a sessão, apaga do aparelho os dados da conta e volta à
  tela de entrada. Entrar de novo com a mesma conta traz a coleção de volta.
- **Excluir conta** fica em Configurações, pede confirmação com o verbo da
  ação no botão ("Excluir") e apaga do backend a conta, a coleção, os
  registros de visualização, as opções e os avisos agendados. Depois, entrar
  com a mesma conta Google ou Apple começa do zero.
- Na exclusão de uma conta criada com Apple, o backend revoga o acesso do
  app junto à Apple (exigência da Apple para "Entrar com Apple").

**Regras R:** nenhuma regra da nota 04 trata de conta. Excluir a conta
equivale a tirar todas as séries da coleção (R2), sem "Desfazer".

### 2. Busca de séries e filmes

Pelo TMDB, sempre via backend.

**Critérios de aceite**
- Um campo de busca único retorna séries e filmes, cada resultado com
  pôster, título, ano e o tipo (Série ou Filme).
- Toda consulta ao TMDB passa pelo backend; o app não contém a chave do TMDB
  nem chama a API dele (regra 3 do CLAUDE.md).
- Cada resultado mostra se já está em **Minhas séries** e permite
  **Adicionar** direto da lista.
- Sem internet ou com o backend fora do ar, a tela diz a causa e oferece
  "Tentar de novo" (diretriz de voz 3 da nota 05).

**Regras R:** R2 (Adicionar, com a série entrando como **Vendo**, subseção
**Para começar**).

### 3. Página da série

Temporadas, episódios e estados.

**Critérios de aceite**
- A página mostra a situação de produção (**Em produção**, **Fim da série**
  ou **Cancelada**), as temporadas em ordem e, dentro de cada uma, os
  episódios com número (T2 E5), data e **Visto** quando houver registro.
  Episódio não exibido mostra a data, ou "sem data".
- O estado mostrado é sempre um de: **Vendo**, **Aguardando**, **Concluída**,
  **Quero ver** ou **Larguei**, calculado pela tabela da R1 e recalculado a
  cada marcação, mudança de estado ou atualização dos dados da série.
- O usuário pode pôr a série em **Quero ver** ou **Larguei** e retomá-la; ao
  retomar, o próximo episódio continua de onde a fronteira estava.
- **Tirar da coleção** pede confirmação com o número de episódios e de horas
  que saem de **Seus números**, sugere **Larguei** para guardar o histórico e,
  depois de confirmado, oferece **Desfazer** por alguns segundos.

**Regras R:** R1, R2, R3, R4, R5 (contagem de não marcados por temporada),
R14 (etiqueta em **Quero ver** e **Larguei**), R22 ("horário não informado").

### 4. Página do filme

**Quero ver** e **Vi**.

**Critérios de aceite**
- A página mostra pôster, título, ano, duração e sinopse do TMDB, com os
  botões **Quero ver** e **Vi**.
- **Quero ver** põe o filme na coleção sem registro; **Vi** cria um registro
  de visualização e tira o filme de **Quero ver**.
- Filme já visto oferece **Vi de novo** (mais um registro, selo **2×**) e
  **Desmarcar**.
- Marcar ou desmarcar um filme muda **Horas vistas** e **Filmes vistos** na
  hora, usando a duração do TMDB ou 100 minutos quando faltar.

**Regras R:** R15, R16, R17, R24, R25. A nota 04 não detalha filmes além
disso; o restante deste item é proposta da Fase 3.

### 5. Marcar

Toque com animação, **Marcar temporada**, **Marcar anteriores** com "Lembrar
minha escolha", **Desmarcar** e **Vi de novo**.

**Critérios de aceite**
- Tocar em **Vi** muda o episódio para **Visto** na tela imediatamente, com
  animação curta, sem esperar o servidor. Se o servidor recusar, o episódio
  volta ao estado anterior e o app avisa. Com "reduzir movimento" ligado no
  aparelho, a animação é substituída por uma troca simples.
- Marcar um episódio com anteriores pendentes pergunta se deve marcar os N
  anteriores, com **Marcar os N**, **Só este** e **Lembrar minha escolha**;
  com a caixa marcada, a escolha vira a regra global (Perguntar, Sempre
  marcar, Nunca marcar), que pode ser mudada em Configurações.
- **Marcar temporada** marca todos os episódios exibidos da temporada (sem
  **Extras**, a não ser com **Incluir extras**) e segue a mesma pergunta para
  temporadas anteriores. Marcar episódio ainda não exibido pede confirmação.
- **Desmarcar** apaga o registro e recalcula próximo episódio e estado;
  episódio com **Vi de novo** pergunta se remove só a última vez ou todas.
  Toda marcação ou desmarcação em grupo oferece **Desfazer**, que reverte a
  ação inteira.

**Regras R:** R4, R8, R9, R10, R15, R16, R17.

### 6. Fila

Próximo episódio de cada série.

**Critérios de aceite**
- A **Fila** mostra só séries **Vendo**, cada uma com "Próximo: T2 E5" e
  "+N" (episódios exibidos e não vistos depois do próximo).
- O próximo episódio é o primeiro não visto depois da fronteira; episódios
  pulados antes dela não voltam.
- A ordem é pela chave da R7 (última atividade ou exibição do próximo
  episódio, o mais recente), com três blocos: séries em andamento, **Para
  começar** e **Faz tempo** (chave com mais de 30 dias).
- Tocar em **Vi** no cartão marca o próximo episódio e atualiza o cartão e a
  ordem sem recarregar a tela; série que sai de **Aguardando** ou
  **Concluída** com episódio novo sobe ao topo com o destaque "Novos
  episódios".

**Regras R:** R5, R6, R7, R13, R18, R19.

### 7. Agenda

Próximos lançamentos das séries da coleção.

**Critérios de aceite**
- A **Agenda** lista episódios ainda não exibidos, com data, das séries
  **Vendo** e **Aguardando**, agrupados por dia (ontem, hoje, amanhã e datas
  seguintes) no fuso do aparelho.
- Episódio com horário conhecido mostra a hora no fuso do aparelho; episódio
  só com data mostra a data como veio, sem hora.
- Lançamento em bloco aparece como uma linha por série ("Temporada 2 · 8
  episódios"), não uma por episódio.
- Nenhum título ou resumo de episódio aparece na Agenda; só série, temporada
  e número (diretriz de voz 8, sem spoiler).

**Regras R:** R1, R6, R18, R19, R20, R23.

### 8. Extras

Temporada 0 oculta por padrão, com opção por série.

**Critérios de aceite**
- Por padrão, **Extras** não entram no próximo episódio, no "+N", em
  **Marcar anteriores**, em **Marcar temporada** nem no cálculo de
  **Aguardando** e **Concluída**, e não geram avisos.
- Na página da série, **Extras** aparecem numa seção recolhida no fim das
  temporadas e podem ser marcados um a um; esses registros contam em **Seus
  números**.
- A opção **Incluir extras**, por série, faz os extras seguirem todas as
  regras de episódio, encaixados pela data; desligá-la não apaga registros.
- Série que só tem temporada 0 trata os extras como episódios normais, sem
  precisar da opção.

**Regras R:** R11, R12.

### 9. Avisos

**Estreia** e **Lembrete 1 h antes**, com horário do TVmaze, e horário
silencioso com entrega às 7h.

**Critérios de aceite**
- Com horário conhecido (TVmaze), o aviso de **Estreia** chega no momento da
  exibição e o **Lembrete 1 h antes**, uma hora antes, ambos no fuso do
  aparelho. Sem horário, só sai o **Aviso no dia** às 10h e a página da série
  mostra "horário não informado".
- Sai no máximo um aviso por série por dia; lançamento em bloco gera um aviso
  só, com o número de episódios.
- O horário silencioso vem ligado de 0h a 7h, configurável e desligável.
  Avisos que cairiam nele são entregues no fim (7h no padrão), juntando os da
  mesma série, e nenhum é descartado.
- Séries **Quero ver** e **Larguei** não recebem avisos, e marcar o episódio
  como **Visto** antes da entrega cancela os avisos pendentes dele.

**Regras R:** R18, R19, R20, R21, R22, R22a, R23, R3, R14.

### 10. Seus números

Horas vistas, episódios vistos e filmes vistos.

**Critérios de aceite**
- **Seus números** mostra **Horas vistas** (séries, filmes e total),
  **Episódios vistos** e **Filmes vistos**.
- **Horas vistas** soma todos os registros, inclusive **Vi de novo** e
  marcações em grupo; **Episódios vistos** e **Filmes vistos** contam itens
  distintos com pelo menos um registro.
- Marcar, desmarcar ou **Tirar da coleção** muda os números na próxima vez
  que a tela abre, sem ação manual.
- Quando durações estimadas passam de 10% do total, as horas aparecem como
  "aproximado".

**Regras R:** R2, R15, R24, R25.

### 11. Importar do TV Time (condicional)

Só entra se o Felippe encontrar o arquivo de exportação e ele for legível.
Se não, sai da v1 sem afetar os outros itens.

**Critérios de aceite**
- O usuário escolhe o arquivo de exportação dele no aparelho; o app envia ao
  backend, que lê o arquivo e o descarta depois da importação.
- Séries e filmes do arquivo são ligados ao TMDB pelos identificadores
  disponíveis (TheTVDB, IMDb) ou, na falta, por título e ano; ao final, o
  app mostra quantos itens entraram e lista os que não foram encontrados.
- Episódios vistos viram registros com a marca "em lote"; importar duas
  vezes o mesmo arquivo não duplica registros.
- O estado de cada série segue a R1 a partir do progresso importado; o app
  não usa nomes, textos nem marca do TV Time além de citar o nome do
  arquivo de origem na tela de importação.

**Regras R:** R1, R15, R24. A regra de **Marcar anteriores** (R9) não se
aplica: a importação já traz a escolha explícita.

### 12. Obrigatórios

Créditos do TMDB e do TVmaze e política de privacidade.

**Critérios de aceite**
- A tela de créditos mostra o logo do TMDB e o aviso de que o app usa a API
  do TMDB sem ser endossado nem certificado por ele, no formato exigido pelos
  termos do TMDB.
- A mesma tela credita o TVmaze como fonte de horários e durações, com link
  e com a licença CC BY-SA.
- A política de privacidade está publicada num endereço público, abre de
  dentro do app (tela de entrada e Configurações) e é o mesmo endereço
  informado nas duas lojas.
- A política diz quais dados são guardados (conta, coleção, registros,
  opções de aviso), com quem são compartilhados e como excluir a conta.

**Regras R:** seção H da nota 04 (atribuição do TVmaze); regra 3 do
CLAUDE.md (atribuição do TMDB).

## Fica para depois

| Item | Motivo |
|---|---|
| Widgets | Exigem código nativo separado no Android e no iOS, fora do que o Expo faz sozinho; a Fila no app cobre a mesma necessidade na v1. |
| Onde assistir | Os dados de disponibilidade por serviço vêm de terceiros, com atribuição e termos próprios a avaliar; não fazem parte do núcleo de acompanhar. |
| Listas personalizadas | Fora do núcleo; **Quero ver** cobre a lista de interesse mais comum. |
| Estatísticas avançadas | Dependem de histórico acumulado; a marca "em lote" (R15) já prepara os dados para gráficos por período depois. |
| Modo visitante | Com conta obrigatória, os dados ficam sempre no backend; um modo sem conta exigiria migrar dados do aparelho para a conta depois. |
| Funções sociais (comentários, memes, grupos, rankings) | Exigem moderação, denúncia e bloqueio (regras das lojas para conteúdo de usuários), além de custo de servidor; não fazem parte do núcleo. |
| Versão web | O foco é celular; o Expo permite adicionar a web depois, reaproveitando o backend. |

## Pendências antes da publicação

1. Registrar o domínio glowbox.app.br.
2. Fazer o pedido de marca Glowbox no INPI, classe 9.
3. Contratar a licença comercial do TMDB se o app gerar receita (regra 8 do
   CLAUDE.md).
4. Criar as contas de desenvolvedor no Google Play (US$ 25, uma vez) e na
   Apple (US$ 99 por ano).

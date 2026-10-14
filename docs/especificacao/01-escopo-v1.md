# 01 – Escopo da versão 1

## Decisão

Escopo aprovado pelo Felippe em 13/10/2026.

Pontos em aberto resolvidos no mesmo dia:
- **Exclusão de conta pela web:** obrigatória no Google Play; entrou no item
  1 como critério de aceite e nas pendências antes da publicação.
- **Avisos:** dois tipos separados, **Estreia** e **Episódio novo**, ligados
  por padrão, configuráveis um a um e cada um com **Lembrete 1 h antes**
  (ligado por padrão, somado ao aviso na hora). Item 9 e R21a da nota 04.
  Ajuste de 13/10/2026: o aviso na hora do **Episódio novo** vem desligado
  por padrão, porque o **Lembrete 1 h antes** já cobre; o da **Estreia**
  continua ligado.
- **Desfazer ao tirar série de Minhas séries:** 6 segundos. Item 3 e R2.
- **Monetização** (passo 3 da Fase 3): **Glowbox Premium** por assinatura
  desde a v1; o núcleo continua gratuito. Coleções (listas criadas pelo
  usuário) e widgets saíram de "Fica para depois" e entraram na v1 (itens 13 a 16). Detalhes em
  `02-monetizacao.md`.
- **Pontos em aberto da monetização:** preços, recursos do Premium, limite
  de 3 coleções e fim do Premium aprovados; teste de 7 dias grátis só no
  plano anual; as listas criadas pelo usuário se chamam **Coleções**, e a
  ação de tirar de **Minhas séries** passa a ser **Tirar de Minhas séries**.
  Detalhes em `02-monetizacao.md`.
- **Pontos detalhados na Fase 3** (revogação do acesso na Apple, marcação
  otimista com reversão, reduzir movimento, página do filme, importação sem
  duplicar registros): aprovados como estão.

Os termos seguem o glossário de `docs/estudo-apk/05-tom-e-textos.md` (seção
4). As regras citadas como **R** são as de `docs/estudo-apk/04-comportamento.md`;
lá elas usam nomes de trabalho, aqui já aparecem com os termos do glossário
(por exemplo, "Assistindo" virou **Vendo** e "Em breve" virou **Agenda**).

## Premissas

- **Séries e filmes desde a v1.**
- **Conta obrigatória.** Entrar com Google e com Apple. A Apple exige
  "Entrar com Apple" quando o app oferece login com Google. Excluir a conta
  tem de ser possível dentro do app (exigência das duas lojas) e, no Google
  Play, também por uma página web, sem abrir o app.
- **Android e iOS juntos, com Expo.** Os testes no iOS exigem um iPhone; o
  build é feito na nuvem com EAS, sem Mac.
- **Custos só na publicação:** Google Play, US$ 25 (uma vez); Apple
  Developer, US$ 99 por ano; licença comercial do TMDB (preço a saber).
- **Núcleo gratuito.** Os itens 1 a 12 não têm limite nem cobrança. O
  **Glowbox Premium** (itens 13 a 16) é vendido por assinatura dentro do
  app, pelas lojas, via RevenueCat (`02-monetizacao.md`).
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
  tela de entrada. Entrar de novo com a mesma conta traz Minhas séries de volta.
- **Excluir conta** fica em Configurações, pede confirmação com o verbo da
  ação no botão ("Excluir") e apaga do backend a conta, Minhas séries,
  as coleções, os registros de visualização, as opções e os avisos agendados.
  Depois, entrar com a mesma conta Google ou Apple começa do zero.
- Com Premium ativo, a confirmação de **Excluir conta** avisa que a
  assinatura continua na loja e oferece o atalho para cancelá-la lá.
- Na exclusão de uma conta criada com Apple, o backend revoga o acesso do
  app junto à Apple (exigência da Apple para "Entrar com Apple").
- Uma página web pública permite pedir a exclusão da conta e dos dados sem
  abrir o app (exigência do Google Play). A página cita o nome do app ou do
  desenvolvedor como aparece na loja, explica o que é apagado e como fazer o
  pedido, e o endereço dela é o mesmo informado no Google Play. Pode ficar
  em glowbox.app.br, mas não exige domínio próprio.

**Regras R:** nenhuma regra da nota 04 trata de conta. Excluir a conta
equivale a tirar todas as séries de Minhas séries (R2), sem "Desfazer".

### 2. Busca de séries e filmes

Pelo TMDB, sempre via backend.

**Critérios de aceite**
- Um campo de busca único retorna séries e filmes, cada resultado com
  pôster, título, ano e o tipo (Série ou Filme).
- Toda consulta ao TMDB passa pelo backend; o app não contém a chave do TMDB
  nem chama a API dele (regra 3 do CLAUDE.md).
- Cada resultado mostra se já está em **Minhas séries** e permite
  **Adicionar** direto dos resultados.
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
- **Tirar de Minhas séries** pede confirmação com o número de episódios e de horas
  que saem de **Seus números**, sugere **Larguei** para guardar o histórico e,
  depois de confirmado, oferece **Desfazer** por 6 segundos.

**Regras R:** R1, R2, R3, R4, R5 (contagem de não marcados por temporada),
R14 (etiqueta em **Quero ver** e **Larguei**), R22 ("horário não informado").

### 4. Página do filme

**Quero ver** e **Vi**.

**Critérios de aceite**
- A página mostra pôster, título, ano, duração e sinopse do TMDB, com os
  botões **Quero ver** e **Vi**.
- **Quero ver** põe o filme em **Minhas séries** sem registro; **Vi** cria um registro
  de visualização e tira o filme de **Quero ver**.
- Filme já visto oferece **Vi de novo** (mais um registro, selo **2×**) e
  **Desmarcar**.
- Marcar ou desmarcar um filme muda **Horas vistas** e **Filmes vistos** na
  hora, usando a duração do TMDB ou 100 minutos quando faltar.

**Regras R:** R15, R16, R17, R24, R25. A nota 04 não detalha filmes além
disso; o restante deste item foi definido na Fase 3.

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

Próximos lançamentos das séries de Minhas séries.

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

Dois tipos, **Estreia** e **Episódio novo**, cada um com aviso na hora e
**Lembrete 1 h antes**, com horário do TVmaze, e horário silencioso com
entrega às 7h.

**Critérios de aceite**
- **Estreia** avisa o primeiro episódio de uma temporada nova ou de uma série
  nova (T1 E1); **Episódio novo** avisa os episódios seguintes. Os dois tipos
  vêm ligados por padrão e podem ser ligados e desligados um a um em
  Configurações.
- Cada tipo tem duas opções, configuráveis uma a uma: aviso na hora e
  **Lembrete 1 h antes**. Padrões: **Estreia** com as duas ligadas;
  **Episódio novo** com o aviso na hora desligado e o **Lembrete 1 h antes**
  ligado. Com o tipo desligado, nenhuma das duas sai.
- Com horário conhecido (TVmaze), o aviso na hora chega no momento da
  exibição e o lembrete uma hora antes, cada um se a opção estiver ligada,
  ambos no fuso do aparelho. Sem horário, só sai o **Aviso no dia** às 10h
  (do tipo do episódio, se esse tipo estiver ligado, com qualquer uma das
  duas opções ligada), sem lembrete, e a página da série mostra "horário não
  informado".
- Sai no máximo um aviso por série por dia; lançamento em bloco gera um aviso
  só, com o número de episódios.
- O horário silencioso vem ligado de 0h a 7h, configurável e desligável.
  Avisos que cairiam nele são entregues no fim (7h no padrão), juntando os da
  mesma série, e nenhum é descartado.
- Séries **Quero ver** e **Larguei** não recebem avisos, e marcar o episódio
  como **Visto** antes da entrega cancela os avisos pendentes dele.

**Regras R:** R18, R19, R20, R21, R21a, R22, R22a, R23, R3, R14.

### 10. Seus números

Horas vistas, episódios vistos e filmes vistos.

**Critérios de aceite**
- **Seus números** mostra **Horas vistas** (séries, filmes e total),
  **Episódios vistos** e **Filmes vistos**.
- **Horas vistas** soma todos os registros, inclusive **Vi de novo** e
  marcações em grupo; **Episódios vistos** e **Filmes vistos** contam itens
  distintos com pelo menos um registro.
- Marcar, desmarcar ou **Tirar de Minhas séries** muda os números na próxima vez
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
- A política diz quais dados são guardados (conta, Minhas séries, coleções,
  registros, opções de aviso, situação da assinatura), com quem são
  compartilhados (incluindo RevenueCat e as lojas) e como excluir a conta.
- Os Termos de uso estão publicados num endereço público e abrem da tela de
  assinatura e de Configurações.

**Regras R:** seção H da nota 04 (atribuição do TVmaze); regra 3 do
CLAUDE.md (atribuição do TMDB).

### 13. Coleções

Coleções criadas pelo usuário, com séries e filmes, na tela **Minhas
coleções**. Grátis até 3 coleções; sem limite no Premium.

**Critérios de aceite**
- **Nova coleção** cria uma coleção com nome obrigatório; o usuário também
  renomeia e apaga coleções. Apagar pede confirmação com o verbo no botão
  ("Apagar") e não mexe em **Minhas séries** nem nos registros.
- Séries e filmes entram numa coleção pela página deles e pela busca, e
  saem por **Tirar desta coleção**; o mesmo item pode estar em várias
  coleções, e a ordem da coleção pode ser mudada arrastando.
- Pôr um item numa coleção não muda o estado dele nem o põe em **Minhas
  séries**, e **Tirar desta coleção** não o tira de **Minhas séries** nem
  apaga registros. **Quero ver** continua sendo um estado, não uma coleção,
  e não conta no limite.
- No plano grátis, ao tentar criar a 4ª coleção, o app explica o limite e
  oferece o Premium; o backend recusa a criação mesmo que o app seja
  burlado. Com o Premium desligado (plano B de `02-monetizacao.md`), o app
  só explica o limite.
- Quando o Premium acaba, nenhuma coleção é apagada: todas continuam
  visíveis e editáveis, e criar coleção nova fica bloqueado enquanto houver
  3 ou mais (`02-monetizacao.md`).

**Regras R:** nenhuma regra da nota 04 trata de coleções; definido na Fase 3.

### 14. Assinatura (Glowbox Premium)

Planos mensal e anual pelas lojas, via RevenueCat.

**Critérios de aceite**
- A tela de assinatura mostra os dois planos com preço e período vindos da
  loja, a renovação automática, como cancelar e os links para Termos de uso
  e Política de privacidade, antes do botão de assinar.
- Assinar abre a compra da loja (Apple ou Google Play); concluída a compra,
  o Premium é liberado sem reiniciar o app e o backend registra a assinatura
  pelo evento do RevenueCat.
- O plano anual mostra "7 dias grátis", com o preço cobrado depois e a data
  da primeira cobrança, só para quem a loja diz que ainda tem direito ao
  teste; o mensal não tem teste. Cancelar durante o teste não gera cobrança
  e o Premium acaba no fim dos 7 dias.
- **Restaurar compras** aparece na tela de assinatura e em Configurações e
  devolve o Premium de uma compra feita com a mesma conta da loja.
- O Premium vale em todos os aparelhos em que o usuário entra com a mesma
  conta do Glowbox.
- Configurações mostra o plano, a data da próxima renovação ou do fim, e um
  atalho para gerenciar a assinatura na loja.
- Renovação, cancelamento, fim e reembolso mudam o Premium no backend sem
  ação do usuário.
- Uma chave no backend desliga o Premium (plano B): a tela de assinatura e
  os convites somem e valem os limites do plano grátis.

**Regras R:** nenhuma; definido na Fase 3 (`02-monetizacao.md`).

### 15. Temas e ícones (Premium)

**Critérios de aceite**
- O tema padrão (claro, escuro e automático, seguindo o aparelho) é
  gratuito. Temas alternativos aparecem em Configurações e só podem ser
  aplicados com Premium.
- Trocar o tema muda todas as telas na hora, sem reiniciar o app, e a
  escolha fica salva na conta.
- Ícones alternativos podem ser escolhidos em Configurações, no Android e
  no iOS; o novo ícone aparece na tela inicial do aparelho.
- Todos os temas mantêm contraste legível nos textos e botões.
- Quando o Premium acaba, tema e ícone voltam ao padrão na próxima abertura
  do app.

**Regras R:** nenhuma; definido na Fase 3.

### 16. Widgets (Premium; pode ir para a v1.1)

Widgets da **Fila** e da **Agenda** na tela inicial do aparelho. Exigem
código nativo separado no Android e no iOS, integrado ao Expo por plugin de
configuração. Se atrasarem, saem na v1.1 sem bloquear o lançamento.

**Critérios de aceite**
- Widget da **Fila**: mostra as primeiras séries da **Fila** com pôster e
  "Próximo: T2 E5"; tocar numa série abre a página dela no app.
- Widget da **Agenda**: mostra os próximos lançamentos com série, temporada,
  número e data (e hora, quando conhecida), sem título nem resumo de
  episódio (diretriz de voz 8).
- Marcar episódios no app atualiza os widgets em até alguns minutos, sem
  abrir o widget.
- Sem Premium (ou depois que ele acaba), o widget mostra que é do Premium e
  o toque abre a tela de assinatura.
- Funciona no Android e no iOS, em pelo menos dois tamanhos.

**Regras R:** R5, R6, R7 (Fila); R18, R19, R20, R23 (Agenda).

## Ordem de construção

Núcleo (itens 1 a 12) → coleções (13) → assinatura (14) → temas e ícones (15)
→ widgets (16). Widgets podem ir para uma v1.1 se atrasarem, sem bloquear o
lançamento.

## Fica para depois

| Item | Motivo |
|---|---|
| Onde assistir | Os dados de disponibilidade por serviço vêm de terceiros, com atribuição e termos próprios a avaliar; não fazem parte do núcleo de acompanhar. |
| Estatísticas avançadas | Dependem de histórico acumulado; a marca "em lote" (R15) já prepara os dados para gráficos por período depois. |
| Modo visitante | Com conta obrigatória, os dados ficam sempre no backend; um modo sem conta exigiria migrar dados do aparelho para a conta depois. |
| Funções sociais (comentários, memes, grupos, rankings) | Exigem moderação, denúncia e bloqueio (regras das lojas para conteúdo de usuários), além de custo de servidor; não fazem parte do núcleo. |
| Versão web | O foco é celular; o Expo permite adicionar a web depois, reaproveitando o backend. |

## Pendências antes da publicação

1. Registrar o domínio glowbox.app.br.
2. Fazer o pedido de marca Glowbox no INPI, classe 9.
3. Obter a licença comercial do TMDB, obrigatória com o Premium (regra 8
   do CLAUDE.md). Plano B: lançar com o Premium desligado até a licença
   ser resolvida (`02-monetizacao.md`).
4. Criar as contas de desenvolvedor no Google Play (US$ 25, uma vez) e na
   Apple (US$ 99 por ano).
5. Publicar a página web de exclusão de conta (exigência do Google Play;
   ver item 1) e informar o endereço dela na ficha do app no Google Play.
   Pode ficar em glowbox.app.br, mas não exige domínio próprio.
6. Configurar os produtos de assinatura nas duas lojas e no RevenueCat,
   com os preços aprovados (R$ 6,90 por mês e R$ 39,90 por ano) e o teste
   de 7 dias grátis só no anual.
7. Publicar os Termos de uso num endereço público.
8. Avaliar MEI ou contador quando houver receita.

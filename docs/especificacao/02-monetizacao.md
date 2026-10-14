# 02 – Monetização

## Decisão

Decisão do Felippe em 13/10/2026: o Glowbox tem o **Glowbox Premium** desde
a v1, como assinatura mensal ou anual. O núcleo de acompanhamento (itens 1 a
12 de `01-escopo-v1.md`) continua gratuito e sem limite.

Com o Premium, o app passa a ser uso comercial do TMDB. A licença comercial
do TMDB é obrigatória antes do lançamento (ver "TMDB" abaixo).

Pontos em aberto resolvidos no mesmo dia:
- **Preços, recursos do Premium, limite de 3 coleções no plano grátis e
  comportamento no fim do Premium:** aprovados como estão nesta nota.
- **Período de teste:** 7 dias grátis só no plano anual, pela oferta
  introdutória das lojas; o mensal não tem teste (seção "Teste grátis").
- **Listas criadas pelo usuário** passam a se chamar **Coleções**. Para não
  colidir com o termo, a ação que tira uma série ou filme de **Minhas
  séries** passa a ser **Tirar de Minhas séries**. Glossário atualizado em
  `docs/estudo-apk/05-tom-e-textos.md` (seção 4).

## Preços

| Plano | Preço sugerido | Equivalente mensal |
|---|---|---|
| Mensal | R$ 6,90 por mês | R$ 6,90 |
| Anual | R$ 39,90 por ano | R$ 3,33 (cerca de 52% a menos que 12 meses do mensal) |

Preços aprovados pelo Felippe em 13/10/2026. Eles são cadastrados nas
lojas, não no app: a tela de assinatura mostra o preço que a loja informa,
na moeda do usuário.

Com a taxa de 15% das lojas, sobram cerca de R$ 5,87 por mês do mensal e
R$ 33,92 por ano do anual, antes de impostos e da taxa do RevenueCat.

## Teste grátis

- **7 dias grátis só no plano anual**, configurados como oferta
  introdutória nas lojas (na App Store, teste grátis de 1 semana; no Google
  Play, fase grátis na oferta do plano anual). O mensal não tem teste.
- Quem tem direito ao teste é decidido pela loja: em regra, uma vez por
  conta da loja. O app pergunta ao RevenueCat se a pessoa ainda tem direito
  e só mostra o teste nesse caso; sem direito, o anual aparece com o preço
  normal.
- Com o teste, o plano anual mostra "7 dias grátis" e, junto, o preço que
  será cobrado depois e a data da primeira cobrança.
- Durante o teste, o Premium vale por inteiro. Cancelar durante o teste
  (pela loja) não gera cobrança; o Premium acaba no fim dos 7 dias e segue
  as regras de "Fim do Premium".

## O que o Premium inclui

| Recurso | Grátis | Premium |
|---|---|---|
| Núcleo (Minhas séries, marcar, Fila, Agenda, avisos, Seus números, importação) | Sim, sem limite | Sim |
| Coleções | Até 3 coleções | Sem limite |
| Temas | Tema padrão (claro, escuro e automático) | Temas alternativos |
| Ícone do app | Ícone padrão | Ícones alternativos |
| Widgets | Não | Sim |

O modo escuro faz parte do tema padrão e é gratuito; os temas do Premium são
variações de cor além dele.

## Pagamentos

- **Compras dentro do app pelas lojas.** Recursos digitais desbloqueados no
  app têm de ser vendidos pela compra dentro do app da Apple e pelo
  faturamento do Google Play. Não há pagamento por fora (cartão, Pix, site).
- **RevenueCat** cuida da integração com as duas lojas: produtos, validação
  de recibos, renovação, cancelamento e reembolso. O backend recebe os
  eventos do RevenueCat (webhook) e guarda se a conta tem Premium; é o
  backend que aplica os limites, não só o app.
- O RevenueCat exige código nativo: o app roda em build de desenvolvimento
  do Expo (EAS), não no Expo Go. O RevenueCat é gratuito até certo
  faturamento mensal e depois cobra uma porcentagem; conferir o preço
  vigente antes da publicação.
- **Taxa das lojas: 15%** para desenvolvedores pequenos. Na Apple, exige
  inscrição no programa para pequenas empresas (faturamento abaixo de US$ 1
  milhão por ano). No Google Play, assinaturas pagam 15%. Conferir as regras
  vigentes ao configurar as contas.
- **Restaurar compras:** botão na tela de assinatura e em Configurações
  (exigência da Apple). Como a conta é obrigatória, o Premium também vale em
  outro aparelho ao entrar na mesma conta.
- **Tela com os termos da assinatura**, antes do botão de assinar: nome do
  plano, preço e período, teste grátis quando houver, renovação automática, como cancelar (pela loja) e
  links para os Termos de uso e a Política de privacidade.

## TMDB

Os termos do TMDB permitem uso gratuito só sem fins comerciais. Com o
Premium, o Glowbox gera receita e precisa da licença comercial do TMDB antes
do lançamento. O pedido é feito ao TMDB; preço e condições ainda são
desconhecidos.

**Plano B:** se a licença não sair a tempo, o app é lançado com o Premium
desligado por uma chave no backend, sem nova versão nas lojas. Com o Premium
desligado:
- a tela de assinatura e os botões de assinar não aparecem;
- valem os limites do plano grátis (até 3 coleções, tema e ícone padrão, sem
  widgets);
- nenhuma compra é possível, então o app não gera receita.

Quando a licença for resolvida, a chave é ligada e o Premium aparece para
todos.

O TVmaze usa a licença CC BY-SA, que permite uso comercial com atribuição;
conferir os termos da API do TVmaze antes do lançamento.

## Fim do Premium

O que acontece quando a assinatura (ou o teste grátis) vence ou é
cancelada:
- **Coleções:** nada é apagado. Todas as coleções continuam visíveis e
  editáveis, mas criar coleção nova fica bloqueado enquanto houver 3 ou
  mais, como no plano grátis.
- **Tema e ícone:** voltam ao padrão na próxima abertura do app.
- **Widgets:** continuam na tela inicial, mas mostram um aviso de que são do
  Premium, com toque que abre a tela de assinatura.

Excluir a conta não cancela a assinatura na loja. A confirmação de **Excluir
conta** avisa isso e oferece o atalho para gerenciar a assinatura na loja.

## Ordem de construção

1. Núcleo (itens 1 a 12 de `01-escopo-v1.md`).
2. Coleções (item 13).
3. Assinatura (item 14).
4. Temas e ícones (item 15).
5. Widgets (item 16).

Widgets podem passar para uma v1.1 se atrasarem, sem bloquear o lançamento.
Nesse caso, a tela de assinatura não cita widgets até eles saírem.

Os critérios de aceite de cada item estão em `01-escopo-v1.md`.

## Pendências antes da publicação

1. Obter a licença comercial do TMDB (ou lançar pelo plano B).
2. Configurar os produtos de assinatura (mensal e anual, com os preços
   aprovados e o teste de 7 dias só no anual) na App Store Connect e no
   Google Play Console, e ligá-los no RevenueCat.
3. Inscrever a conta da Apple no programa para pequenas empresas (taxa de
   15%).
4. Publicar os Termos de uso num endereço público.
5. Avaliar MEI ou contador quando houver receita.

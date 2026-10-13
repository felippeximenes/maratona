# Glowbox

App de acompanhamento de séries e filmes para Android e iOS, sucessor
espiritual do TV Time (encerrado em 15/07/2026). Nome decidido em 13/10/2026:
docs/especificacao/00-nome.md.

"maratona" é o nome da pasta e do repositório (codinome antigo) e não deve ser
alterado agora.

## Fase atual
Fase 3: especificação e nome. Fases 1 e 2 concluídas em 13/10/2026.

## Stack
- App: React Native + Expo (TypeScript)
- Backend: Supabase (Postgres, autenticação, funções no servidor)
- Dados de séries: API do TMDB, acessada só pelo backend
- Horários e duração de episódios: TVmaze (CC BY-SA, com atribuição), acessado só pelo backend; aviso só por data quando faltar horário.
- Ambiente: Windows + WSL2 (Ubuntu 24.04). Comandos sempre para o bash do Ubuntu.

## Estrutura
- docs/estudo-apk/: notas da Fase 2 (descrições em português, sem código descompilado)
- docs/especificacao/: especificação da Fase 3
- app/ e supabase/: criados na Fase 4
- O APK e as saídas brutas do REA ficam FORA do repositório, em ~/estudo-tvtime/

## Regras
1. Nunca copiar código descompilado do TV Time para este repositório, nem em
   docs. Descrever a regra em português e escrever uma implementação própria.
2. Nunca usar nome, logo, ícones, ilustrações ou textos do TV Time.
3. A chave do TMDB nunca vai no app. Manter a atribuição do TMDB na tela de créditos.
4. Seguir o roteiro de fases e avisar quando algo proposto estiver fora da fase atual.
5. Responder em português do Brasil. Código e identificadores em inglês.
6. Preferir passos pequenos e testáveis.
7. Quando faltar informação, perguntar antes de supor.
8. TMDB é gratuito só para uso não comercial; se o app gerar receita, é preciso
   licença comercial do TMDB (avaliar na Fase 3).
9. Credenciais de terceiros encontradas no APK (ex.: crowdin.yml) nunca são
   usadas, copiadas nem citadas.

## Glossário
Termos oficiais do app (detalhes e justificativas em
docs/estudo-apk/05-tom-e-textos.md; um termo por conceito):
- Coleção: Minhas séries. Ações: Adicionar, Tirar da coleção.
- Estados: Vendo, Aguardando, Concluída, Quero ver, Larguei.
- Subseções: Para começar, Faz tempo.
- Listas: Fila (próximo episódio), Agenda (estreias).
- Marcar: Vi (botão), Visto (estado), Vi de novo, Marcar anteriores, Marcar temporada.
- Temporada 0: Extras (opção Incluir extras). Abreviação: T2 E5.
- Produção: Em produção, Fim da série, Cancelada.
- Estatísticas: Seus números (Horas vistas, Episódios vistos).
- Notificações: Estreia, Episódio novo, Lembrete 1 h antes, Aviso no dia.

## REA (somente na fase de estudo)
- Servidor MCP `rea`, registrado no escopo de usuário.
- APK alvo: ~/estudo-tvtime/apk/tvtime.apk (base.apk do bundle 10.11.0; textos
  em português em assets/flutter_assets/resources/i18n/pt-BR.json do base.apk,
  cópia decodificada em ~/estudo-tvtime/saidas-rea/apktool-base/).
- Ferramentas: inspect_android_package, search_android_classes,
  inspect_android_class, inspect_android_method, trace_android_references.
- Análise somente estática. Nunca acessar servidores da Whip Media ou do
  TheTVDB fora das APIs oficiais.
- Cada análise vira uma nota em docs/estudo-apk/ com: pergunta, conclusão,
  evidência (nomes de classes e métodos, sem trechos de código) e limitações.

## Roteiro da Fase 2 (revisado em 13/10/2026)
Decisão: o TV Time 10.11 é Flutter. A lógica está em Dart compilado (libapp.so),
que não será descompilado. Estratégia: observar e projetar.
1. [feito] Origem do APK: docs/estudo-apk/00-origem-do-apk.md
2. [feito] Framework: docs/estudo-apk/01-framework.md
3. [feito] Integrações: deep links, widgets, notificações e permissões (REA no
   base.apk): docs/estudo-apk/02-integracoes.md
4. [feito] Mapa de telas: nomes de arquivos em flutter_assets, deep links e
   lembranças de uso: docs/estudo-apk/03-mapa-de-telas.md
5. [feito] Funcionalidades e comportamento observado, incluindo a regra do
   "próximo episódio", descritos em português a partir do uso do app e de
   material público: docs/estudo-apk/04-comportamento.md
6. [feito] Tom e textos em português (pt-BR.json do base.apk), só como
   referência, sem copiar: docs/estudo-apk/05-tom-e-textos.md
Fora do escopo: endpoints da Whip Media (usaremos TMDB e backend próprio) e
modelo de dados do TV Time (o nosso será projetado na Fase 3).

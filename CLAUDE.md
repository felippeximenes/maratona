# Maratona (codinome)

App de acompanhamento de séries e filmes para Android e iOS, sucessor
espiritual do TV Time (encerrado em 15/07/2026). Nome definitivo na Fase 3.

## Fase atual
Fase 2: estudar o APK com o REA. Fase 1 (ambiente) concluída em 13/10/2026.

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

## REA (somente na fase de estudo)
- Servidor MCP `rea`, registrado no escopo de usuário.
- APK alvo: ~/estudo-tvtime/apk/tvtime.apk (base.apk do bundle 10.11.0; textos pt em apk/bundle/split_config.pt.apk).
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
3. Integrações: deep links, widgets, notificações e permissões (REA no base.apk)
4. Mapa de telas: nomes de arquivos em flutter_assets, deep links e lembranças de uso
5. Funcionalidades e comportamento observado, incluindo a regra do "próximo
   episódio", descritos em português a partir do uso do app e de material público
6. Tom e textos em português (split_config.pt.apk), só como referência, sem copiar
Fora do escopo: endpoints da Whip Media (usaremos TMDB e backend próprio) e
modelo de dados do TV Time (o nosso será projetado na Fase 3).

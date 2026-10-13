# 03 – Mapa de telas

## Pergunta

Quais telas o TV Time 10.11 tinha, como elas se encadeavam e o que o usuário
podia fazer em cada uma? Quais funções eram de acompanhamento (o núcleo) e
quais eram sociais ou de engajamento?

## Conclusão

1. **Quatro abas principais:** Séries, Filmes, Explorar e Perfil. A pasta de
   ícones da barra inferior tem exatamente esses quatro, mais um quinto ícone
   (`dev`) que parece ser um menu interno de desenvolvimento, sem uso pelo
   público.
2. **O núcleo é pequeno e bem definido:** lista "assistir a seguir" de
   episódios, tela da série com temporadas e estados (assistindo, para depois,
   parei, em dia, terminada), tela do episódio, tela do filme, listas
   personalizadas, notificações de estreia e estatísticas de tempo assistido.
3. **A camada social é maior que o núcleo.** Mais da metade dos eventos da
   tela de episódio e da tela de filme são de comentários, memes, GIFs,
   reações, enquetes e quizzes. Há ainda feed, grupos com tópicos, seguidores,
   conquistas, rankings, retrospectiva anual e um jogo de votação entre
   títulos.
4. **Marcar episódio aparece em quatro lugares:** na lista de séries
   (toque ou deslizar), na tela da série (episódio, temporada ou "tudo"), na
   tela do episódio e no onboarding (definindo o progresso de cada série).
   Ao marcar um episódio com anteriores pendentes, o app perguntava se devia
   marcar os anteriores também, com opção de "nunca perguntar de novo"
   (forte). O mesmo vale para temporadas.
5. **Reassistir é um estado próprio.** Episódio, temporada e filme podem ser
   marcados como "visto uma vez" ou "revisto" (forte).
6. **Havia modo visitante.** Um convite de cadastro global aparecia durante o
   uso, o que indica que dava para usar o app antes de criar conta (forte).

### Árvore de navegação provável

```
Inicialização
├── Onboarding (primeiro uso)
│   ├── Boas-vindas (5 motivos em carrossel)
│   ├── Cadastro / Login (Apple, Google, Facebook, Twitter/X, e-mail)
│   │   ├── Nome de usuário, senha, recuperar senha
│   │   └── Idade (data ou ano de nascimento) e gênero
│   ├── Escolher séries (populares + busca)
│   ├── Definir progresso por série (temporada / série terminada)
│   ├── Importar da Netflix (ou adicionar manualmente)
│   ├── Filmes já vistos
│   ├── Filmes para ver
│   └── Permitir notificações
└── Abas principais
    ├── Séries (minhas séries)
    │   ├── Assistir a seguir / Em breve / Histórico
    │   └── → Tela da série → Tela do episódio
    ├── Filmes (meus filmes)
    │   ├── Para ver / Em breve / Vistos
    │   └── → Tela do filme
    ├── Explorar
    │   ├── Descobrir (vitrines + navegar por séries/filmes com filtros)
    │   ├── Busca (títulos, pessoas, grupos)
    │   ├── Feed
    │   └── Grupos → Grupo → Tópico
    └── Perfil
        ├── Estatísticas, Favoritos, Listas, Comentários, Rankings, Conquistas
        ├── Seguidores / Seguindo / Pedidos para seguir
        ├── Notificações (atividade)
        ├── Editar perfil
        └── Configurações
            ├── Conta, contas vinculadas, senha, excluir conta
            ├── Notificações
            ├── Aparência e app (tema, autoplay, títulos localizados, cache)
            ├── Serviços de streaming assinados
            ├── Títulos descartados ("não gostei")
            └── Ajuda, privacidade, versão

Telas de detalhe acessíveis de vários lugares
  Série · Episódio · Filme · Lista · Perfil de outro usuário ·
  Quem assistiu / Quem adicionou · Comentário com respostas · Editor de meme

Modais e avisos transversais
  Convite de cadastro (visitante) · Pedido de notificação · Avaliar na loja ·
  Atualização disponível · Anúncio do tema escuro · Anúncio de filmes ·
  Pesquisas (pergunta, enquete, deslizar cartões) · Confirmações de sucesso ·
  Dicas de primeiro uso · Aviso de spoiler · Denúncia · Título faltando
```

## Telas e ações

Legenda: **[forte]** = dois ou mais indícios independentes (por exemplo,
chave de tradução + evento, ou evento + ícone); **[fraco]** = um indício só.
Entre parênteses, os nomes que sustentam o item.

### 1. Onboarding e autenticação

- Ver carrossel de boas-vindas com cinco motivos para usar o app. **[forte]**
  (`welcome_reason_1..5`, `onboarding_welcome_screen_opened`)
- Criar conta ou entrar com Apple, Google, Facebook, Twitter/X ou e-mail.
  **[forte]** (`sign_up_with_*_button`, `onboarding_*_selected`,
  `onboarding_login_*_selected`, ícones `social/`)
- Escolher nome de usuário e senha; validação de nome já usado e senha
  inválida. **[forte]** (`username_already_exists_*`, `invalid_password_*`,
  `onboarding_username_screen_opened`, `onboarding_password_screen_opened`)
- Recuperar senha por e-mail, ou recuperar conta pelo identificador antigo /
  rede social. **[forte]** (`forgot_password_*`, `recover_password_sent_*`,
  `recover_tvtime_id_hint`, `recover_social_id_hint`)
- Aviso de login social descontinuado (provavelmente Facebook/Twitter), com
  orientação para migrar. **[forte]** (`social_login_deprecated_dialog_*`,
  `settings_link_deprecated_accounts_title`)
- Informar idade e gênero, com opção de pular. **[forte]**
  (`age_gating_*`, `onboarding_age_*`, `onboarding_gender_*`, ícones
  `gender/`, imagem `chicken_illustration_age`)
- Escolher séries a partir de seções populares e busca; expandir seções.
  **[forte]** (`onboarding_setup_shows_*`, `onboarding_select_shows_*`,
  `onboarding_show_selection_section_expanded`)
- Para cada série escolhida, dizer até onde já assistiu: escolher temporada
  ou marcar a série inteira como vista. **[forte]**
  (`onboarding_set_progress_*`, `onboarding_season_button_tapped`,
  `onboarding_show_completed_button_tapped`, `onboarding_show_progress_set`)
- Importar histórico da Netflix ou optar por adicionar manualmente.
  **[forte]** (`netflix_*`, `onboarding_netflix_import_*`, ícone
  `netflix_symbol`, imagem `onboarding/netflix`)
- Escolher filmes já vistos e filmes para ver. **[forte]**
  (`onboarding_setup_watched_movies_*`, `onboarding_setup_movies_to_watch_*`,
  `onboarding_watched_movies_*`, `onboarding_added_movies_*`)
- Ativar notificações agora ou depois. **[forte]**
  (`onboarding_setup_notifications_*`, `onboarding_activate_notifications_*`,
  imagem `notifications_prompt_bell`)
- Indicador de passo atual (passo X de Y). **[forte]**
  (`onboarding_step_x_of_total_y`, `onboarding_skip_button_tapped`)
- Aceitar receber comunicações de marketing. **[forte]**
  (`marketing_opt_in_description`, `onboarding_opt_in_checked`)
- Onboarding curto para usuários antigos quando os filmes foram lançados no
  app (filmes vistos e para ver). **[forte]** (`existing_user_ob_*`,
  `movies_announcement_modal_*`)
- Escolher gêneros preferidos num pedido avulso de idade/gênero/gênero de
  série. **[forte]** (`age_gender_*_question`, `age_gender_prompt_genre_*`)

### 2. Aba Séries (minhas séries)

- Ver lista "assistir a seguir" com o próximo episódio de cada série em
  andamento. **[forte]** (`watch_next_header_title`, `watching_header_title`,
  `my_shw-tab_selected`, ícone `main/shows`, widget do passo 3)
- Seções por situação: não começadas, sem assistir há algum tempo, para
  depois, paradas, em dia, terminadas. **[forte]**
  (`not_started_yet_header_title`, `not_watched_for_a_while_header_title`,
  `for_later_header_title`, `stopped_watching_header_title`,
  `up_to_date_header_title`, `finished_header_title`)
- Marcar o próximo episódio como visto direto na lista, por toque na caixa ou
  por deslizar. **[forte]** (`my_shw-episode_checked`, `my_shw-episode_swiped`,
  `my_shw-episode_watched`, `shows_list_episode_watched`, ícones
  `checkmark_*`)
- Desfazer a marcação logo depois. **[fraco]** (`undo`)
- Ver quantos episódios faltam além do próximo. **[forte]**
  (`shows_list_nb_more_episodes`, `nb_episodes`)
- Mandar um episódio/série para "depois" pela lista. **[forte]**
  (`my_shw-episode_watch_later_selected`, ícone `watch_later`)
- Remover ou parar uma série deslizando. **[forte]**
  (`my_shw-remove_swiped`, `my_shw-show_removed`, `my_shw-show_stopped`,
  `shows_list_show_remove`)
- Alternar entre lista e grade. **[forte]** (`my_shw-grid_view_*`, ícones
  `grid_active`, `grid_inactive`)
- Ver "em breve": episódios a estrear agrupados por ontem, hoje, amanhã e
  datas futuras. **[forte]** (`upcoming`, `today_header_title`,
  `tomorrow_header_title`, `yesterday_header_title`, `starts_in_days`)
- Ver histórico do que foi assistido. **[fraco]**
  (`watched_history_header_title`)
- Carregar as séries "para depois" sob demanda. **[forte]**
  (`load_for_later_shows_button`, `my_shw-see_watched_later_shows_selected`)
- Faixa sugerindo adicionar mais séries, que pode ser dispensada. **[forte]**
  (`add_more_shows_banner_*`)
- Ir para Descobrir quando a lista está vazia. **[forte]**
  (`shows_watch_list_empty_*`, `shows_list_empty_button`,
  `my_shw-discover_btn_selected`)
- Esconder episódios já vistos. **[fraco]** (`hide_watched_episodes`)
- Pressionar e segurar uma série para um menu rápido (ver seção 12).
  **[forte]**

### 3. Tela da série

- Abas internas: sobre, episódios, feed da série e "mais". **[forte]**
  (`media_about_tab`, `show_episodes_tab`, `media_feed_tab`,
  `media_more_tab`, `shw-tab_selected`)
- Adicionar a série; depois, começar a assistir, deixar para depois, parar,
  retomar ou remover. **[forte]** (`show_add_button`, `show_start_*`,
  `show_watch_later_button`, `show_stop_button`, `show_resume_*`,
  `show_tab_remove_*`, `show_state_*`, `shw-start_watching_selected`,
  `shw-watch_later`)
- Estados possíveis da série: não adicionada, assistindo, para depois,
  parada, em dia, terminada. **[forte]** (`show_state_not_added`,
  `show_state_watching`, `show_state_watch_later`, `show_state_stopped`,
  `show_state_up_to_date`, `show_state_finished`)
- Mensagem ao ficar em dia e ao terminar a série. **[forte]**
  (`show_up_to_date_title`, `show_finished_title`)
- Bloco "próximo episódio" que muda se a série ainda não foi começada; dá
  para deslizar entre episódios. **[forte]**
  (`show_watch_next_section_not_started_title`,
  `show_watch_next_section_started_title`, `shw-watch_next_swiped`)
- Lista de temporadas, incluindo especiais. **[forte]**
  (`show_seasons_section_title`, `specials_season`, `specials_count_text`,
  `season_x`)
- Marcar episódio, temporada inteira, ou tudo como visto/não visto.
  **[forte]** (`mark_episode_as`, `mark_season_as`, `watch_all`,
  `unwatch_all`, `shw-episode_watched`, `shw-season_watched`,
  `shw-all_watched`, `shw-all_unwatched`)
- Ao marcar algo à frente, responder à pergunta sobre marcar os episódios ou
  temporadas anteriores (com opção "nunca"). **[forte]**
  (`mark_previous_episodes_modal_*`, `shw-mark_prev_episodes_*`,
  `shw-mark_prev_seasons_*`)
- Ligar notificações da série; estado vazio explica se as notificações
  estão ligadas. **[forte]** (`shw-notifications_on_selected`,
  `show_episodes_notifications_*_empty_description`,
  `show_notification_example`)
- Ver informações, elenco e personagens. **[forte]**
  (`show_info_section_title`, `cast_section_title`, `shw-actor_selected`,
  `placeholder_cast_image`)
- Ver nota da comunidade e a nota própria do app. **[forte]**
  (`community_ratings_section_title`, `shw-community_rating_swiped`,
  `shw-tvtime_score_selected`, ícone `tvt_rating_logo`)
- Ler e escrever resenhas da série; ver resenhas em destaque. **[forte]**
  (`review_post_hint`, `review_too_short_*`, `shw-cmp_rv_posted`,
  `shw-featured_reviews_*`, `shw-all_reviews_*`)
- Ver trailer. **[forte]** (`watch_trailer`, `shw-trailer_selected`, ícone
  `play`)
- Ver onde assistir (serviços de streaming). **[forte]**
  (`wtw_section_title`, `epi-where_to_watch_*`, `mv-where_to_watch_*`)
- Ver séries parecidas e adicioná-las dali. **[forte]**
  (`shw-similar_shows_*`)
- Adicionar a uma lista personalizada ou criar lista nova. **[forte]**
  (`add_to_list`, `shw-add_to_cl_*`, `shw-create_new_cl_selected`, ícone
  `add_to_list`)
- Favoritar. **[forte]** (`favorite_show_menu_text`, `shw-show_favorited`)
- Personalizar pôster e capa da série só para si. **[forte]**
  (`customize_show_text`, `change_poster`, `change_banner`,
  `shw-customize_selected`)
- Indicar o motivo de interesse / expectativa pela série. **[forte]**
  (`shw-anticipation_module_viewed`, `shw-anticipation_reason_selected`,
  `shw-reason_to_add_selected`)
- Ver quem assistiu / quem adicionou. **[forte]** (`series_watched_by`,
  `added_by`, `watched_by-screen_opened`, `added_by-screen_opened`)
- Compartilhar. **[forte]** (`shw-share_selected`, `shw-share_method_selected`)
- "Afiliação" (provavelmente link para assinar um serviço). **[fraco]**
  (`shw-affiliation_selected`)

### 4. Tela do episódio

- Marcar como visto, ou escolher "visto uma vez" / "revisto". **[forte]**
  (`mark_episode_as_watched`, `epi-episode_watched`,
  `epi-watched_choice_selected`, `watched_once_episode`, `rewatched_episode`,
  ícones `watch/watched_once`, `watch/rewatched`)
- Deslizar para o episódio anterior ou seguinte. **[forte]**
  (`epi-episode_swiped`, `next_button`)
- Dar nota ao episódio. **[forte]** (`episode_rating_section_title`,
  `epi-rating_selected`, ícone `rating_star`)
- Escolher uma emoção sobre o episódio (e desfazer). **[forte]**
  (`feeling_section_title`, `epi-emotion_selected`, `epi-emotion_unselected`)
- Escolher personagem favorito do episódio. **[forte]**
  (`favorite_character_section_title`, `epi-character_selected`)
- Informar como assistiu (aparelho) e onde (serviço). **[forte]**
  (`how_did_you_watch_section_title`, `where_did_you_watch_section_title`,
  `epi-device_selected`, `epi-platform_selected`, imagens `generic_device`,
  `ios_device`, `platform_other_screen_*`)
- Ver informações do episódio e voltar para a série. **[forte]**
  (`episode_info_section_title`, `epi-about_episode_btn_selected`,
  `epi-show_btn_selected`)
- Comentários com proteção de spoiler (ver "Funções sociais"). **[forte]**
- Conteúdo extra quando disponível: artigo, podcast, enquete, quiz, quiz em
  equipe. **[forte]** para artigo, enquete e quiz (`epi-article_*`,
  `epi-poll_*`, `epi-quiz_*`, `article_selected`); **[fraco]** para podcast e
  quiz em equipe (só eventos `epi-podcast_*`, `epi-teamquiz_available`)
- Ver trailer e onde assistir. **[forte]** (`epi-watch_trailer_selected`,
  `epi-where_to_watch_*`)
- Compartilhar o episódio. **[forte]** (`epi-share_btn_selected`,
  `epi-share_method_selected`)

### 5. Aba Filmes (meus filmes)

- Listas: para ver, em breve e vistos. **[forte]** (`watch_list`,
  `movies_watch_list_empty_*`, `movies_upcoming_empty_*`, `movies_watched`,
  `my_mv-tab_selected`, ícone `main/movies`)
- Alternar lista/grade. **[forte]** (`my_mv-grid_view_*`)
- Adicionar filmes ou ir descobrir. **[forte]** (`add_movies`,
  `my_mv-add_movies_selected`, `my_mv-discover_movies_selected`)

### 6. Tela do filme

- Adicionar, marcar como visto, remover, favoritar. **[forte]**
  (`movie_add_button`, `mark_movie_as_watched`, `remove_movie`,
  `favorite_movie_menu_text`, `mv-movie_added`, `mv-movie_watched`,
  `mv-movie_removed`, `mv-movie_favorited`)
- Confirmação antes de marcar como visto (provavelmente para filmes ainda não
  lançados ou adicionados por engano). **[forte]**
  (`movie_watched_alert_title`, `movie_watched_alert_confirm_button`)
- Visto uma vez / revisto. **[forte]** (`watched_once_movie`,
  `rewatched_movie`, `mv-watched_choice_selected`)
- Nota, emoção, personagem, como e onde assistiu: mesmo conjunto do
  episódio. **[forte]** (`movie_rating_section_title`, `mv-rating_selected`,
  `mv-emotion_*`, `mv-character_selected`, `mv-device_selected`,
  `mv-platform_selected`)
- Duração e data de estreia. **[forte]** (`movie_runtime_h_m`, `movie_time`,
  ícones `duration`, `airdate`)
- Expandir informações; elenco; filmes parecidos. **[forte]**
  (`mv-expand_movie_info_selected`, `mv-actor_selected`,
  `similar_movies_section_title`, `mv-similar_movies_*`)
- Votar se já viu ou não (votação de comunidade). **[forte]**
  (`movie_vote_watched`, `movie_vote_not_watched`,
  `mv-expand_voting_selected`)
- Trailer, onde assistir, listas, personalizar, compartilhar, quem assistiu,
  comentários. **[forte]** (prefixo `mv-` equivalente aos da série/episódio)

### 7. Explorar / Descobrir

- Sub-abas dentro de Explorar (Descobrir, Feed, Grupos). **[fraco]** para a
  composição exata (`explore-tab_selected`, `discover_tab`, `feed_tab`,
  `groups_tab`); **[forte]** que a aba existe (ícone `main/explore`, `explore`)
- Vitrines: séries e filmes em alta, recomendados para você, populares no
  seu país, atividade da comunidade, grupos. **[forte]**
  (`discover_trending_*`, `discover_recommended_shows_section_title`,
  `discover_popular_in_your_country_title`,
  `discover_community_activity_*`, `dsc_landing-*`,
  `dsc_landing_local_carousel_*`)
- Adicionar série ou filme direto da vitrine. **[forte]**
  (`dsc_landing-show_added`, `dsc_landing-movie_added`)
- Navegar por todas as séries ou todos os filmes, com filtros de gênero,
  emissora, situação, ordenação e "incluir já adicionados". **[forte]**
  (`discover_browse_*_button`, `advanced_filter_title`, `filter_networks`,
  `dsc-genre_selected`, `dsc-status_selected`, `dsc-sort_method_selected`,
  `dsc-include_added_*_activated`, `empty_filters_*`)
- Ver "sua nota" de afinidade com títulos e melhorar recomendações.
  **[fraco]** (`dsc-get_your_score_selected`, `dsc-improve_your_scores_selected`,
  `improve_your_recommendations`)
- Remover título das recomendações. **[forte]**
  (`remove_show_from_recommendations`, `show_removed_from_recommendations`,
  `dsc_remove_show`)
- Pedir um título que não existe no catálogo. **[forte]**
  (`missing_title_*`, ícone `no_cover`)
- Convites dentro de Descobrir para conectar Facebook ou informar e-mail.
  **[forte]** (`dsc-connect_fb_*`, `dsc-share_email_*`,
  `recommendations_*_prompt_*`)

### 8. Busca

- Busca geral com abas (títulos, usuários, grupos). **[forte]**
  (`search_global_hint`, `search_users_hint`, `search_groups_hint`,
  `dsc_landing-search_*`)
- Adicionar resultado direto da busca. **[forte]**
  (`dsc_landing-show_added_from_search`, `dsc_landing-movie_added_from_search`)
- Estado sem resultado. **[forte]** (`empty_search_*`, `search_no_result`,
  `dsc_landing-search_no_result`)

### 9. Listas personalizadas

- Criar, renomear/descrever, excluir e reordenar listas. **[forte]**
  (`create_a_new_list`, `list_name_label`, `list_description_label`,
  `delete_list_dialog_*`, `reorder_lists`, `lists-*`)
- Adicionar e remover séries e filmes, reordenar itens, ordenar por data de
  inclusão ou ordem própria. **[forte]** (`list_detail-*`,
  `list_sort_added_*`, `list_sort_custom`, `reorder_list_items`)
- Esconder lista do perfil (lista privada). **[forte]**
  (`hide_from_profile_text`, `edit_list-hide_from_profile_*`, ícone
  `lists/lock_icon`)
- Compartilhar lista. **[forte]** (`list_detail-share_selected`)

### 10. Perfil (próprio)

- Estatísticas: tempo gasto com séries e filmes, horas na semana, gêneros e
  emissoras mais vistos. **[forte]** (`stats`, `time_spent_*`,
  `top_show_genres`, `top_show_networks`, `nb_hours_this_week`,
  `prf-stats_*`)
- Séries e filmes favoritos, editáveis e compartilháveis. **[forte]**
  (`favorite_shows`, `favorite_movies`, `edit_favorite_*`,
  `prf-favorite_*`, `favorite_shows-share_*`)
- Listas, comentários, rankings e conquistas do usuário. **[forte]**
  (`lists`, `prf-comments_selected`, `your_rankings`, `app_badges`,
  `prf-custom_lists_*`)
- Seguidores, seguindo e pedidos para seguir. **[forte]** (`followers`,
  `following`, `follow_requests`, `prf-followers_selected`)
- Notificações de atividade (curtidas, respostas, seguidores). **[forte]**
  (`notifications`, `activity_tab`, `activity_screen_opened`,
  `prf-notifications_button_selected`, `empty_notifications`)
- Editar perfil: foto, capa, nome de exibição, ano de nascimento, gênero,
  país, e-mail. **[forte]** (`edit_profile`, `choose_profile_photo`,
  `choose_cover_photo`, `display_name`, `country`, `prf-added_*`, ícones
  `picture/`)
- Perfil privado. **[forte]** (`set_profile_to_private`,
  `private_profile_description`)
- Retrospectiva do ano a partir do perfil. **[forte]** (`prf-eoy_cta_selected`,
  `eoy_opened`)
- Compartilhar perfil. **[forte]** (`prf-share_selected`)

### 11. Configurações

- Conta: e-mail, trocar senha, contas vinculadas (Apple, Google, Facebook,
  Twitter), desvincular, sair, excluir conta. **[forte]** (`change_password*`,
  `edit_linked_accounts`, `settings_unlink_account_*`,
  `settings-*_account_linked`, `log_out_button`, `delete_account_*`)
- Notificações de séries: novo episódio, uma hora antes, dez minutos antes,
  no dia seguinte. **[forte]** (`settings_notifications_new_episode`,
  `settings_notifications_one_hour_before`,
  `settings_notifications_ten_minutes_before`,
  `settings_notifications_next_day`, `settings_shows_notification_section_title`)
- Notificações sociais: curtidas em comentários, pedidos para seguir,
  comentários de amigos, conquista desbloqueada, notícias. **[forte]**
  (`settings_notifications_*`, `settings_activity_notification_section_title`,
  `settings_content_notification_section_title`)
- Tema claro/escuro. **[forte]** (`theme`, `dark_mode`, `light_mode`,
  `settings-dark_mode_*`, variantes `_dm`/`_lm` nos ícones)
- Autoplay de vídeos no feed. **[forte]** (`settings_app_feed_auto_play_*`,
  `settings-feed-auto_play_*`)
- Mostrar títulos traduzidos para o idioma do aparelho. **[fraco]**
  (`settings_app_localize_titles_*`)
- Idiomas dos comentários exibidos. **[forte]** (`comments_languages_*`,
  `settings_comments_languages_*`, `prf_language_include`,
  `prf_language_exclude`)
- Serviços de streaming assinados (adicionar e remover). **[forte]**
  (`subscription_services`, `select_subscription_service_title`,
  `remove_subscription_service_*`, `edit_subscription_services_screen_opened`)
- Gerenciar títulos marcados como "não gostei". **[forte]**
  (`manage_disliked_shows_and_movies`, `no_disliked_*`, imagens
  `dislike_empty_state*`, ícones `heart_crossed_*`, `thumbs_down_*`)
- Limpar cache, central de ajuda, privacidade e termos, versão. **[forte]**
  (`clear_cache`, `cache_clear_*`, `help_center`, `read_privacy_and_legal`,
  `version`)
- Enviar feedback. **[fraco]** (`quick_actions_feedback`)

### 12. Menu de pressionar e segurar (séries e filmes)

Um único menu contextual em qualquer pôster: começar, parar, retomar,
deixar para depois, adicionar a lista, favoritar/desfavoritar, personalizar,
compartilhar e remover. **[forte]** (24 eventos `longpress-shw_*` e
`longpress-mv_*`, ícones `resume_watching`, `stop_watching`, `watch_later`,
`remove_from_collection`)

### 13. Modais e avisos transversais

- Convite de cadastro para visitantes (e-mail, Facebook, Twitter). **[forte]**
  (`global_signup_popup_*`, `global_email_popup_*`)
- Pedido de permissão de notificações (próprio e do sistema), com "agora
  não". **[forte]** (`notification_prompt_*`, `notifications_prompt_*`,
  `notification_system_permission_*`)
- Pedido de rastreamento no iOS (ATT). **[forte]** (`att_prompt_*`)
- Pedido de avaliação na loja. **[forte]** (`store_rating_*`,
  `app_rating_*`)
- Aviso de atualização do app. **[fraco]** (`updater_alert_*`)
- Anúncio do tema escuro. **[fraco]** (`dark_mode_announcement_*`)
- Confirmações de sucesso ao adicionar ou marcar. **[forte]**
  (`add_show_success_modal_seen`, `track_episode_success_modal_seen`,
  `show_added_confirmation_button`)
- Dicas de primeiro uso (adicionar, marcar, descobrir). **[fraco]**
  (`add_tool_tip_*`, `track_tool_tip_*`, `discover_tool_tip_*`)
- Pesquisas de opinião (pergunta, enquete, cartões para deslizar).
  **[forte]** (`question_survey_*`, `poll_survey_*`, `swipe_survey_viewed`,
  `swipe_card_*`, `open_survey_button`)
- Modal configurável pelo servidor. **[fraco]** (`dynamic_modal_seen`)
- Pausar o módulo de votação da lista. **[fraco]**
  (`pause_watchlist_voting_module_*`)
- Aviso de abertura de app externo (streaming). **[fraco]**
  (`external_app_link_opening_*`)
- Pedido de acesso aos apps instalados (provavelmente para detectar serviços
  de streaming). **[fraco]** (`installed_apps_access_dialog_*`)
- Erros genéricos, sem conexão, item não encontrado. **[forte]**
  (`generic_error_*`, `no_connection_message`, `*_not_found_dialog_title`)

## Funções sociais e de engajamento

Separadas do núcleo para facilitar o corte na Fase 3.

### Comentários (episódio, filme, tópico)

- Escrever comentário com texto, foto, GIF ou meme. **[forte]**
  (`epi-cmp_cmt_*_btn_selected`, `mv-cmp_cmt_*`, `comment_post_hint`, ícones
  `gif`, `photo`, `meme`)
- Marcar o próprio comentário como spoiler; aviso antes de publicar.
  **[forte]** (`comment_spoiler_*`, `comment_composer_spoiler_warning_*`)
- Comentários escondidos até marcar o episódio/filme como visto, com opção
  de "mostrar mesmo assim" ou "marcar como visto". **[forte]**
  (`episode_display_comments_alert_*`,
  `episode_display_comments_watched_episode_button`,
  `episode_display_comments_watched_display_anyway_button`,
  `epi-cmt_disp_anyway_selected`, `epi-spoilers_ahead_*`, imagem `spoiler`)
- Curtir, responder, ver respostas anteriores, ver todos os comentários de um
  usuário. **[forte]** (`epi-cmt_liked`, `epi-cmt_replied`, `reply_hint`,
  `view_previous_replies_button`, `epi-all_cmts_by_user_selected`)
- Ordenar por relevância, mais curtidos, mais recentes. **[forte]**
  (`comment_sort_*`, `epi-cmt_sort_*`)
- Traduzir comentário. **[forte]** (`translate_comment_button`,
  `translating_comment_text`)
- Compartilhar comentário. **[forte]** (`epi-cmt_share_*`)
- Denunciar (spam, spoiler, assédio, plágio, inapropriado, outro) e esconder.
  **[forte]** (`report_*_menu_text`, `epi-report_cmt_*`, ícone `report`)
- Ver quem curtiu. **[forte]** (`liked_by`, `empty_likers`, chaves
  `*_like_text`)

### Memes

- Editor de meme sobre capturas de tela do episódio: escolher capturas,
  adicionar texto com contorno, adesivos, redimensionar, duplicar e apagar.
  **[forte]** (`meme_title`, `select_screencaps_title`,
  `edit_screencaps_title`, `meme_*_alert_*`, pasta de ícones
  `meme_composer/`, `epi-meme_posted`)
- Memes indisponíveis na versão web. **[fraco]**
  (`web_memes_not_available_message`)

### Reações e votos

- Emoção sobre episódio/filme. **[forte]** (ver seção 4)
- Votação "isto ou aquilo" entre títulos, com carimbos positivo/negativo,
  resultados, vencedores e sugestão de novos confrontos. **[forte]** para a
  existência, **[fraco]** para a mecânica exata (`tbt_*`, 11 eventos)
- Enquetes e quizzes no episódio. **[forte]** (ver seção 4)

### Compatibilidade

- Comparar gostos com quem você segue. **[fraco]**
  (`compare_with_following_button`, pasta de ícones `compatibility/` com
  coração e visto). Nenhum evento dedicado foi encontrado.

### Rede social

- Seguir, deixar de seguir, aceitar/recusar pedidos, remover seguidor.
  **[forte]** (`follow_button`, `accept_follow_button`,
  `deny_follow_button`, `remove_from_followers`, `user_followed`)
- Perfil de outro usuário: séries, filmes, listas, estatísticas, rankings,
  comentários, seguidores. **[forte]** (`other_user_*`, `user_follows_you`)
- Bloquear e denunciar usuário (spammer, conta falsa, trapaceiro, assédio).
  **[forte]** (`block_user_menu_text`, `spammer_menu_text`,
  `fake_account_menu_text`, `cheater_menu_text`,
  `harassing_user_menu_text`, `user_report_success_*`)
- Encontrar amigos pelos contatos, Facebook ou Twitter. **[forte]**
  (`find_friend_*`, `match_*_friends_title`, `contacts_access_*`, ícones
  `find_friends`, `social/contacts_logo`)
- Feed com itens de atividade, artigos e trailers com som/progresso; esconder
  item. **[forte]** (`feed_screen_opened`, `feed_item_viewed`,
  `feed_trailer_*`, `hide_feed_item`, `feed_rfw_item_*`)

### Grupos

- Explorar grupos, entrar, ver membros e tópicos. **[forte]**
  (`groups_*`, `group_detail-*`, `nb_group_members`, `nb_group_topics`)
- Criar, editar, excluir e denunciar tópicos; comentar neles. **[forte]**
  (`create_topic_for_group_hint`, `edit_topic_for_group_hint`,
  `delete_topic_dialog_*`, `topic_detail-*`, `topic_reported`)

### Gamificação

- Conquistas por assistir, comentar, seguir e avaliar. **[forte]**
  (`watch_badges`, `comment_badges`, `follow_badges`, `ratings_badges`,
  `badge-share_*`, `hex_badge_placeholder`)
- Ranking de comentaristas com pontos, abas "seguindo" e "global".
  **[forte]** (`comments_leaderboards`, `see_leaderboard`, `points`,
  `leaderboard`, `following_tab`, `global_tab`)
- Retrospectiva anual em telas deslizáveis, compartilhável. **[forte]**
  (`eoy_opened`, `eoy-screen_swiped`, `eoy-share_selected`,
  `feed-eoy_cta_selected`)

### Compartilhamento

- Destinos: stories e feed do Instagram, stories e feed do Facebook,
  WhatsApp, Twitter/X, copiar link, salvar imagem, outros. **[forte]**
  (`*_share_menu_text`, ícones `sharing/`, padrão `*-share_method_selected`
  em 15 telas)

## Evidência

Fontes, todas em `~/estudo-tvtime/saidas-rea/apktool-base/assets/flutter_assets/`
(saída do `apktool d --no-src` do `base.apk` 10.11.0, ver nota 02):

- `resources/i18n/en.json` (SHA-256 começa com `6032802111af58ac`): objeto
  plano com 850 chaves; sem os sufixos de plural, cerca de 760 nomes
  distintos. **Só os nomes das chaves foram extraídos** (com `jq 'keys'`); os
  valores não foram lidos.
- `resources/tvtime-mobile-events/event-map.json` (SHA-256 começa com
  `07f7eea64a1de742`): 627 eventos. Cada evento tem quatro destinos ligáveis
  (API própria, Firebase Analytics, Crashlytics e AppsFlyer). Os prefixos
  funcionam como nome de tela:

  | Prefixo | Tela | Eventos |
  |---|---|---|
  | `mv-` | filme | 55 |
  | `shw-` | série | 52 |
  | `epi-` | episódio | 51 |
  | `prf-` | perfil | 40 |
  | `dsc-` / `dsc_landing-` | descobrir (navegar / vitrine e busca) | 31 + 25 |
  | `longpress-` | menu de pressionar e segurar | 24 |
  | `list_detail-` / `lists-` / `edit_list-` | listas | 17 + 10 + 3 |
  | `my_shw-` / `my_mv-` | abas Séries / Filmes | 14 + 6 |
  | `settings-` | configurações | 11 |
  | `topic_detail-`, `groups-`, `group_detail-` | grupos | 9 + 4 + 4 |
  | sem prefixo (`onboarding_*`, `tbt_*`, `survey_*` etc.) | vários | 255 |

- `assets/icons/`: subpastas `main` (barra inferior: `shows`, `movies`,
  `explore`, `profile`, `dev`), `onboarding`, `onboarding/auth`, `social`,
  `gender`, `watch`, `lists`, `meme_composer`, `compatibility`, `sharing`,
  `picture`, `alerts`, `textfield_clear`; cerca de 80 ícones soltos na raiz
  (estados de marcação, menu contextual, comentários, ordenação, grade).
- `assets/images/`: `onboarding/netflix`, `placeholders` (pôster de série,
  pôster de filme, capa, elenco, usuário, item de lista, conquista
  hexagonal), estados vazios de "não gostei" em claro e escuro, ilustrações
  de idade, notificação, pipoca (filmes), aparelho genérico e iOS, spoiler.

Abreviações deduzidas dos nomes: `cl` = lista personalizada, `cmp` = compor,
`cmt` = comentário, `rv` = resenha, `wtw` = onde assistir, `eoy` = fim de
ano, `dsc` = descobrir, `ob` = onboarding, `_dm`/`_lm` = tema escuro/claro.

## Limitações

- **Nomes de chave e evento não provam que a tela existia na 10.11.** O mapa
  de eventos pode conter eventos de versões antigas (por exemplo, os de
  Facebook e Twitter, cujo login aparece como descontinuado) ou de testes A/B
  (`participated_test`).
- **A ordem e o encaixe das telas são inferidos.** A árvore vem do
  agrupamento por prefixo; a posição exata de Feed, Grupos e Notificações
  (sub-aba de Explorar ou de Perfil) não está clara.
- **Abreviações sem significado confirmado:** `tbt` (interpretado como
  votação entre títulos), `rfw` (item de feed), `vif_badge`,
  `local_*` (pode ser "regional", como em "populares no seu país", ou
  "registrado só no aparelho"), `day_zero` (provavelmente marcação no dia da
  estreia).
- **Caminhos de deep link continuam desconhecidos.** A nota 02 deixou isso
  para este passo, mas as três fontes não trazem rotas. Ficariam nas strings
  do `libapp.so`, que estão fora da estratégia "observar e projetar".
- Não foram lidas as pastas `animations`, `countries` e `fonts`, nem os
  outros idiomas.
- A seção sobre a regra do "próximo episódio" só mostra onde ela aparece. O
  comportamento (o que acontece com especiais, episódios fora de ordem,
  temporadas novas) fica para o passo 5.

## Perguntas para o Felippe

1. Quais abas apareciam na barra inferior, em que ordem, e em qual delas o
   app abria?
2. Na aba de séries, você marcava episódios mais por toque na caixa, por
   deslizar, ou abrindo o episódio? Algum deles fazia algo diferente?
3. Ao marcar um episódio adiantado (por exemplo, o 5 sem ter marcado o 1 a
   4), o que o app perguntava, e você costumava aceitar ou recusar?
4. Logo depois de marcar um episódio, o que aparecia: uma tela de reação
   (nota, emoção, personagem), os comentários, ou nada?
5. Como episódios especiais (temporada 0) entravam na lista "assistir a
   seguir"? Eles atrapalhavam?
6. Quando uma série ganhava temporada nova depois de você ter terminado, ela
   voltava sozinha para "assistir a seguir"? E séries paradas?
7. Você usava "para depois" e "parei de assistir"? Qual a diferença prática
   entre os dois na lista?
8. Você chegou a registrar reassistidas? Elas contavam nas estatísticas de
   tempo?
9. Quais notificações você mantinha ligadas (estreia, uma hora antes, dez
   minutos antes, dia seguinte) e chegavam no horário certo?
10. Que telas você abria toda semana e quais nunca abriu (feed, grupos,
    memes, rankings, votação entre títulos)?
11. Os comentários ficavam escondidos até você marcar o episódio? Você lia
    comentários com frequência?
12. Usou o widget, a importação da Netflix ou as listas personalizadas? Algo
    nelas fazia falta?

# Análise de referências open source: edição de vídeo curto (Reels/TikTok)

Data: 2026-11-05. Método: busca no GitHub por stars/tópicos, depois clone raso e leitura do
`SKILL.md`, dos docs e da estrutura de cada candidato. **Nada foi executado/renderizado**: a avaliação
vem da leitura do código e da documentação. Antes de confiar em qualquer pipeline, rode o smoke test dele.

## Resumo executivo

Existem dois "motores de render" concorrentes e eles não se misturam bem:

| Motor | Usado por | Licença do motor | Observação |
|---|---|---|---|
| **ffmpeg + Whisper + Python** (compositing por frames) | AskEditor, 6missedcalls | livre | roda 100% local, sem Node; ótimo para corte, legenda, B-roll, efeitos "atrás da cabeça" |
| **HyperFrames (HTML + GSAP)** | heditor, herk-edit-kit | Apache-2.0 (HeyGen) | motion graphics ricos, sem licença paga |
| **Remotion (React)** | claude-shorts, claude-remotion-skill, video-shotcraft | licença própria da Remotion | confirmar se o seu uso comercial exige licença paga |

**Recomendação:** a espinha dorsal do seu fluxo (transcrever, cortar pausas, legendar, B-roll, SFX,
música, QC) vem do ffmpeg/Whisper, que não tem custo de licença. Motion graphics mais elaborados ficam
numa camada opcional em HyperFrames (Apache-2.0). Remotion fica só como referência de padrões de
legenda/animação, a menos que você confirme a licença.

## Ranking do que vale usar (para publi no TikTok/Reels)

| # | Repositório | Licença | Nota | Por que importa para o seu caso |
|---|---|---|---|---|
| 1 | **AskEditor/ai-video-editing-skills** | MIT | ★★★★★ | 41 efeitos prontos e nomeados (hook, legenda sem cobrir o rosto, B-roll na palavra, punch-in, CTA card, stickers, sound-effects, music-bed, qc-check, post-copy, long-to-shorts). Local, grátis, vídeo nunca sobe. É o catálogo de efeitos mais completo. |
| 2 | **pycodebr/heditor** | MIT | ★★★★★ | Em português (PycodeBR). ~40 estilos nomeados, "modo criativo", workflow de pré-produção, **quality gates mensuráveis** (LUFS −14, true peak, margem de safe zone 270px no 9:16, ASR do áudio final, folha de contato). Também tem checklist de anúncio pago e teste de hook. |
| 3 | **nateherkai/herk-edit-kit** | MIT | ★★★★ | Playbook de edição + `short-form-edit` (hook → payoff, EDL por quadro, ledger de B-roll, plano em JSON validável), `video-storytelling`, `cut-silences`, `cut-mistakes`. Foco em talking head. |
| 4 | **AgriciDaniel/claude-shorts** | MIT | ★★★★ | Rubrica de score de trechos (hook 30%, coerência 25%...), snap de cortes em pontos naturais do áudio, reframe com tracking, 3 estilos de legenda TikTok (Bold/Bounce/Clean) em Remotion. Útil se for reaproveitar vídeos longos. |
| 5 | **Vincentwei1021/video-shotcraft** | Apache-2.0 | ★★★ | 124 "shot cards" (vocabulário de motion: câmera, tipografia, transição, ritmo), regras de estética, **sound design e busca de SFX com licença**, sync de batida com música. Voltado a promo de produto, que é próximo de publi. Conteúdo em chinês na maior parte. |
| 6 | **6missedcalls/video-editing-skill** | MIT | ★★★ | Pequeno e simples: scripts bash para trim, jump cut, legenda estilo Hormozi, overlay de texto, speed. Bom *fallback* e boa base para entender o mínimo necessário. |
| 7 | **haidrrrry/claude-remotion-skill** | MIT | ★★ | Regras de design e padrões de motion para Remotion. Conteúdo genérico, aproveite só `design-rules.md` e `motion-patterns.md`. |
| 8 | **remotion-dev/skills** | sem arquivo de licença | ★★★ (oficial) | Referência oficial de Remotion (legendas, transições, SFX, silence detection). **Não copiado**; instale direto da fonte se for usar Remotion. |
| 9 | zhuyansen/awesome-claude-video-skills | n/d | índice | Lista com 180 repos classificados por tipo e segurança. Bom para descobrir mais. |
| 10 | calesthio/OpenMontage | AGPL-3.0 | só leitura | O mais estrelado (76k), mas AGPL é copyleft. Não vendorizado. |

Não entraram: `mrpaidsocial-video-editor-agent` (sem licença, mas a ideia de clonar estilo de um reel de
referência é boa: o heditor já cobre isso com "modo criativo com referência"), `digitalsamba/claude-code-video-toolkit`
(foco em explainer com moviepy) e `appariciojunior/video-editor-skills` (CC BY-NC, **proíbe uso comercial**, incompatível com publi).

## Mapa: etapa do seu fluxo → onde está a melhor referência

| Etapa | Melhor fonte copiada | Caminho |
|---|---|---|
| Pré-produção / briefing do vídeo | heditor | `third_party/heditor/skills/heditor/references/pre-production.md` |
| Estilo, hook e estrutura (hook → payoff) | herk-edit-kit, claude-shorts | `third_party/herk-edit-kit/.claude/skills/short-form-edit/`, `third_party/claude-shorts/references/scoring-rubric.md` |
| Transcrição com tempo por palavra | AskEditor, claude-shorts | `third_party/claude-shorts/scripts/transcribe.py`, `third_party/ai-video-editing-skills/fx/` |
| Corte de pausas / erros / retakes | 6missedcalls, herk | `third_party/video-editing-skill/scripts/jumpcut.sh`, `third_party/herk-edit-kit/.claude/skills/cut-silences` |
| Legendas | AskEditor `captions`, claude-shorts, 6missedcalls | `third_party/ai-video-editing-skills/effects/captions`, `third_party/claude-shorts/references/caption-styles.md` |
| Reframe 9:16 / seguir rosto | AskEditor `reframe`, claude-shorts | `.../effects/reframe`, `third_party/claude-shorts/scripts/compute_reframe.py` |
| Motion graphics (texto, listas, gráficos, cards) | AskEditor (efeitos), shotcraft (shot cards), herk (cards HyperFrames) | `.../effects/*`, `third_party/video-shotcraft/references/shots/` |
| B-roll | AskEditor `broll-cutaways` | `.../effects/broll-cutaways` |
| CTA / fechamento de publi | AskEditor `cta-card`, heditor | `.../effects/cta-card` |
| Som: SFX, música, mixagem | shotcraft, heditor, AskEditor | `third_party/video-shotcraft/references/sound-design.md`, `.../sfx-sourcing.md`, `third_party/heditor/.../sound-design.md` |
| QC antes de postar | heditor (quality gates), AskEditor `qc-check` | `third_party/heditor/skills/heditor/references/quality-gates.md`, `.../effects/qc-check` |
| Legenda do post / hashtags | AskEditor `post-copy` | `.../effects/post-copy` |
| Revisão por notas com timestamp | AskEditor `review-notes` | `.../effects/review-notes` |

## Lacunas que NENHUM repositório resolve (o que o seu prompt deve cobrir)

Estas são específicas de conteúdo de publi, e é aí que a sua skill agrega valor:

1. **Regras de publi/#publi**: sinalização de publicidade (ferramenta de conteúdo de marca do TikTok, "#publi", "parceria paga"), posição e tempo da tag na tela.
2. **Brand kit por cliente**: cores, fontes, logos, tom, palavras proibidas, claims que a marca não permite.
3. **Estrutura de roteiro de publi** (problema → demonstração do produto → prova → CTA) e duração-alvo por plataforma.
4. **Seu estilo visual** (identidade da Duda): paleta, tipografia, ritmo de corte, tipo de legenda, SFX preferidos.
5. **Safe zones das interfaces do TikTok/Reels** (botões laterais, legenda, rodapé) e checagem automática.
6. **Direitos de uso**: música (biblioteca comercial do TikTok vs. trilha licenciada), imagens do produto, depoimentos.
7. **Aprovação do cliente**: entregável com versões (com/sem legenda, 9:16 e 4:5) e checklist de revisão.

## Pontos de atenção (riscos)

- **Licença do Remotion** e uso comercial: confirmar antes de basear o fluxo nele.
- **Pesos**: o setup do AskEditor baixa ~600 MB de modelos (não versionados aqui; `setup.sh` busca).
- **Idioma**: heditor é em PT-BR; os demais, em inglês (shotcraft: chinês). Whisper transcreve PT-BR bem com `--language pt`, mas vale testar nos seus áudios.
- **Verificação**: as skills dizem passar por checagens, mas o próprio herk-edit-kit avisa que validadores estruturais "não provam um hook bom". Sempre assista e ouça o resultado final.
- **Mais de uma skill ativa ao mesmo tempo** pode confundir o agente. Por isso a sua skill (`SKILL.md` na raiz) deve ser a **única porta de entrada** e apenas apontar para as referências em `third_party/` conforme a etapa.

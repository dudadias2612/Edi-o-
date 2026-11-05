---
name: edicao-publi
description: >
  RASCUNHO. Edita vídeos curtos de publi para TikTok e Reels (9:16): corta pausas, legenda
  palavra a palavra, aplica motion graphics, B-roll, SFX/música, CTA e faz QC antes de postar.
  Será refinado com o prompt da Duda. Use quando pedirem para editar, legendar ou finalizar
  um vídeo de publi/UGC.
---

# Edição de publi: TikTok e Reels

> **Status: esqueleto.** O pipeline abaixo é a espinha dorsal proposta a partir da análise em
> `docs/ANALISE-REFERENCIAS.md`. As seções marcadas `[PROMPT DA DUDA]` serão preenchidas com o
> prompt dela. Onde houver conflito, o prompt dela vence as referências.

Esta é a **única porta de entrada**. As pastas em `third_party/` são material de consulta
e de execução, lidas só na etapa que precisa delas (não carregue tudo de uma vez).

## 0. Briefing (antes de tocar no vídeo)

Perguntar/confirmar: marca e produto, objetivo (venda, cadastro, awareness), plataforma
(TikTok, Reels ou ambos), duração-alvo, CTA, claims proibidos, material disponível (takes, B-roll,
logo, trilha). `[PROMPT DA DUDA: perguntas obrigatórias, brand kit, regras do cliente]`

Referência: `third_party/heditor/skills/heditor/references/pre-production.md`

## 1. Preparação e transcrição

Checar o arquivo, extrair áudio, transcrever com tempo por palavra (Whisper, `--language pt`).
Referência: `third_party/claude-shorts/scripts/transcribe.py`, `third_party/claude-shorts/scripts/preflight.sh`

## 2. Estrutura: hook → desenvolvimento → prova → CTA

Escolher o hook (primeiros 3 s), cortar o que não serve ao argumento, manter uma ideia por vídeo.
Referência: `third_party/claude-shorts/references/scoring-rubric.md`,
`third_party/herk-edit-kit/.claude/skills/short-form-edit/`, `third_party/ai-video-editing-skills/effects/hook`
`[PROMPT DA DUDA: formato de roteiro de publi, tipos de hook que ela usa]`

## 3. Corte

Remover pausas, erros e retakes sem cortar palavras; corte no quadro, sem clique de áudio.
Referência: `third_party/video-editing-skill/scripts/jumpcut.sh`,
`third_party/herk-edit-kit/.claude/skills/cut-silences`, `.../cut-mistakes`

## 4. Enquadramento 9:16 e safe zones

Rosto fora das áreas cobertas pela interface (topo ≥ 270 px, laterais e rodapé).
Referência: `third_party/ai-video-editing-skills/effects/reframe`, `third_party/claude-shorts/references/platform-specs.md`

## 5. Legendas e motion graphics

Legenda palavra a palavra sem cobrir o rosto; destaques, listas, gráficos, stickers e cards só
onde ajudam a mensagem.
Referência: `third_party/ai-video-editing-skills/effects/` (captions, stickers, chart, ranked-list, cta-card...),
`third_party/claude-shorts/references/caption-styles.md`, `third_party/video-shotcraft/references/shots/`
`[PROMPT DA DUDA: identidade visual, estilos de legenda, motion preferido]`

## 6. B-roll, som e música

B-roll na palavra que o cita; SFX no primeiro quadro do evento; música abaixo da voz.
Referência: `third_party/ai-video-editing-skills/effects/broll-cutaways`,
`third_party/video-shotcraft/references/sound-design.md`, `.../sfx-sourcing.md`,
`third_party/heditor/skills/heditor/references/sound-design.md`

## 7. Marcação de publicidade

`[PROMPT DA DUDA: regras de #publi / conteúdo de marca, onde e quando aparece na tela]`

## 8. QC antes de postar

Alvos mensuráveis: loudness ≈ −14 LUFS, true peak ≤ −1.5 dBTP, sem frames pretos/congelados, nada
cobrindo o rosto, legenda = fala. Assistir e ouvir o resultado final de ponta a ponta.
Referência: `third_party/heditor/skills/heditor/references/quality-gates.md`,
`third_party/ai-video-editing-skills/effects/qc-check`

## 9. Entrega

Arquivo final + texto do post (legenda, hashtags) + resumo do que foi feito e do que **não** foi
verificado. Nunca publicar sem aprovação explícita.
Referência: `third_party/ai-video-editing-skills/effects/post-copy`

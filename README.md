# Edi-o-

Repositório de **skill de edição de vídeos curtos de publi (TikTok e Reels)**, construída sobre
frameworks open source existentes.

## Estrutura

```
SKILL.md                      skill própria (esqueleto; será refinada com o prompt da Duda)
docs/ANALISE-REFERENCIAS.md   comparação dos repositórios, ranking, lacunas e riscos
THIRD_PARTY_NOTICES.md        origem, commit e licença de tudo que foi copiado
third_party/                  código e referências de terceiros (MIT/Apache-2.0), sem alterações
```

## Fontes incorporadas

| Pasta | Para que serve |
|---|---|
| `third_party/ai-video-editing-skills` | catálogo de 41 efeitos (legenda, hook, B-roll, CTA, QC...) rodando local |
| `third_party/heditor` | estilos nomeados, quality gates, sound design (PT-BR) |
| `third_party/herk-edit-kit` | playbook de edição, plano hook → payoff, cortes por EDL |
| `third_party/claude-shorts` | score de trechos, reframe, legendas animadas |
| `third_party/video-shotcraft` | vocabulário de motion (shot cards), SFX e sync com batida |
| `third_party/video-editing-skill` | scripts ffmpeg + Whisper simples (fallback) |
| `third_party/claude-remotion-skill` | regras de design e motion para Remotion |

Leia primeiro: [`docs/ANALISE-REFERENCIAS.md`](docs/ANALISE-REFERENCIAS.md).

## Próximo passo

Enviar o prompt de edição. Ele entra no `SKILL.md` nos pontos `[PROMPT DA DUDA]` e define quais
referências de `third_party/` ficam ativas.

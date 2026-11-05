# Third-party notices

Tudo em `third_party/` foi copiado de repositórios públicos com licença permissiva
(MIT ou Apache-2.0), **sem modificação**. Cada pasta mantém o `LICENSE` original.
O código e os textos próprios deste repositório ficam fora de `third_party/`.

| Pasta | Origem | Commit | Licença | O que foi copiado |
|---|---|---|---|---|
| `third_party/ai-video-editing-skills` | https://github.com/AskEditor/ai-video-editing-skills | `e20000b` | MIT (fontes: SIL OFL 1.1, ver `NOTICE.md`) | SKILL.md, 41 efeitos (`effects/`), motor `fx/`, sons gerados em código, fontes, `tools/`, `setup.sh` |
| `third_party/claude-shorts` | https://github.com/AgriciDaniel/claude-shorts | `a369fad` | MIT | SKILL.md, rubrica de score, specs de plataforma/legenda, scripts (transcrição, snap de cortes, reframe), componentes Remotion de legenda |
| `third_party/heditor` | https://github.com/pycodebr/heditor | `8b8add8` | MIT | skill completa: estilos nomeados, modo criativo, quality gates, sound design, templates |
| `third_party/herk-edit-kit` | https://github.com/nateherkai/herk-edit-kit | `10511e5` | MIT (skills HyperFrames/GSAP embutidas: Apache-2.0, ver `licenses/`) | playbook de edição, SHORT-FORM, storytelling, skills `.claude/skills/*`, blueprint de style-library |
| `third_party/video-editing-skill` | https://github.com/6missedcalls/video-editing-skill | `7dc6e1d` | MIT | scripts bash ffmpeg+Whisper (trim, jump cut, legenda Hormozi, overlay) |
| `third_party/claude-remotion-skill` | https://github.com/haidrrrry/claude-remotion-skill | `1dcbe5e` | MIT | skill de motion graphics Remotion, design rules, motion patterns, theme |
| `third_party/video-shotcraft` | https://github.com/Vincentwei1021/video-shotcraft | `1266a3e` | Apache-2.0 | `references/` (pipeline, sound design, sfx sourcing, beat sync, 11 categorias de shot cards) e `agents/` |

## Não copiado de propósito

- **remotion-dev/skills** (https://github.com/remotion-dev/skills): é a referência oficial de
  Remotion, mas o repositório não traz arquivo de licença, então não foi vendorizado.
  Instale direto da fonte: `npx skills add remotion-dev/skills`.
- **calesthio/OpenMontage** (AGPL-3.0): licença copyleft forte; copiar para um repo próprio
  obrigaria a abrir o código derivado. Fica só como leitura de referência.
- **mrpaidsocial/mrpaidsocial-video-editor-agent** (sem licença): sem licença = todos os direitos reservados.
- Mídia de demonstração (vídeos, GIFs), logos e assets de marca de terceiros (ex.: AIS no
  herk-edit-kit) e pastas `examples/` e `video-projects/`.

## Avisos importantes

- Nomes de estilos como "Vox", "Kallaway" ou "GTA 6" nas referências são **inspirações estéticas**,
  não ativos oficiais. Não use marcas, personagens ou músicas de terceiros em conteúdo de publi.
- Músicas e stock footage seguem a licença própria de cada fonte. Veja
  `third_party/heditor/skills/heditor/references/licenses.md`.
- Remotion tem licença própria (grátis para indivíduos e times pequenos, paga acima disso).
  Confirme se o seu caso se enquadra em https://www.remotion.dev/license antes de usar comercialmente.

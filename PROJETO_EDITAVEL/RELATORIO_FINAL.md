# RELATÓRIO FINAL · Nextags × Duda Dias

**Status: PRÉVIA PARA APROVAÇÃO CRIATIVA, completa, renderizada e verificada, agora com as suas duas gravações de tela reais da Nextags no lugar dos placeholders.**
O marcador "PRÉVIA PARA APROVAÇÃO CRIATIVA" (1,5 s no canto) foi mantido, porque você pediu para não mudar mais nada. Detalhes das gravações: `CAPTURAS_REAIS.md`.

**Atualização (gravações reais):** só mudou o trecho em que a plataforma aparece (50,5–66,1 s e 68,0–81,5 s). Prova na §9.

## 1. Entregáveis (onde estão)

| Item | Arquivo |
|---|---|
| MP4 para aprovação da Keren | `PROJETO_EDITAVEL/saida/NEXTAGS_DUDA_PREVIA_APROVACAO.mp4` (119 MB, fora do git) e a versão leve `..._LEVE.mp4` (≈57 MB, mesma edição, no git) |
| Projeto editável e reproduzível | `PROJETO_EDITAVEL/` (`./build.sh all`; ver `README.md`) |
| Legendas sincronizadas | `PROJETO_EDITAVEL/saida/LEGENDAS_NEXTAGS.srt` e `LEGENDAS_ESTILIZADAS.ass` (150 blocos) |
| Revisão visual | `PROJETO_EDITAVEL/REVISAO_VISUAL/` (4 pranchas a cada 5 s, 14 quadros-chave, `qc_resultado.json`, `asr_audio_final.json`) |
| Gravações reais: layout, sincronia e como ajustar | `PROJETO_EDITAVEL/CAPTURAS_REAIS.md` e `config/capturas.json` |

Não gerei um arquivo chamado `VIDEO_FINAL_NEXTAGS_DUDA_1080P.mp4` de propósito: pelo adendo, a prévia não pode ser tratada como versão final.
O mesmo pipeline o produz depois (`./build.sh final`, que também tira o marcador "PRÉVIA").

## 2. Arquivos de entrada e diagnóstico

- **Usado:** "Vídeo publi Nextags para edicao Claude code versao 1" (Drive, 86.240.794 bytes), baixado e analisado com FFprobe.
- **Diferença em relação ao briefing:** o arquivo real é **1080×1920, HEVC (Main), 30 fps, 150,37 s, bt709, áudio AAC 44,1 kHz estéreo**,
  em contêiner QuickTime (.mov). Não é 512×910 H.264. Por isso **não houve upscale** e não há perda de resolução a compensar; a versão
  "nativa para comparação" é o próprio original.
- **Procura de outros materiais:** no Drive, a busca por nextags / capcut / direct / logo / automatizar só devolveu este vídeo. Não há capturas da
  Nextags, gravações do Direct, áudio melhor, logos nem projeto do CapCut. (A busca foi por nome; não abri as pastas de outros assuntos.)
- **Documentação pública da Nextags:** não encontrei páginas públicas. Os rótulos dos passos seguem exatamente a sua fala; nenhum menu foi inventado.
- **Áudio original:** muito alto e já com clipping (−6,7 LUFS, +1,7 dBTP, 13.604 amostras em 0 dBFS). Tratado (ver §4).
- **Edição existente:** ~29,4 s já editados no próprio arquivo (títulos, comentários, celular do Direct, cubo 3D, P&B). Os instantes de cada
  elemento foram medidos quadro a quadro para sincronizar os SFX.

## 3. Saída

| | |
|---|---|
| Resolução / proporção | 1080 × 1920, 9:16 |
| FPS | 30 (cadência original preservada) |
| Vídeo | H.264 High, yuv420p, x264 `slow` CRF 17, bt709 (tagueado), faststart, ~5,8 Mb/s |
| Áudio | AAC-LC 48 kHz estéreo ~256 kb/s |
| Duração | **152,30 s** = 150,37 s da gravação + 1,93 s de quadro final ("COMENTE AUTOMATIZAR / NEXTAGS × DUDA DIAS") |
| Loudness | −14,0 LUFS integrado, LRA 1,8 LU, true peak −1,6 dBFS, 0 amostras em clipping |

## 4. O que foi feito

1. **Transcrição:** Whisper large-v3 local, palavra a palavra, e revisão contextual. A fala gravada é a fonte de verdade: nenhuma frase removida,
   nenhuma voz sintética.
2. **Primeiros 30 s preservados:** só ganham legenda (abaixo do rosto, longe dos seus títulos) e o marcador removível da prévia nos primeiros 1,5 s.
   Nenhum zoom/título/mockup novo antes de 29,4 s. Medição objetiva: PSNR médio **42,8 dB** (mínimo 39,4 dB) na faixa dos seus títulos e mockups
   contra o original, ou seja, só recompressão.
3. **Do segundo 29,4 ao fim:** mesma tipografia (Montserrat ExtraBold branca), mesmo azul (#008FFE, medido nos seus frames "500"), cards brancos com
   contorno verde-claro como os seus comentários. Cenas D a L conforme o roteiro; zooms estilo "corte" como os seus.
4. **Mockups atrás de você:** recorte por vídeo (Robust Video Matting) para os celulares/navegadores/cartões passarem atrás do cabelo e do rosto, como
   no seu celular do Direct aos 21 s. Seu rosto, voz, roupa e cenário não foram alterados.
5. **Legendas:** 150 blocos de 2–5 palavras, no máximo 2 linhas, branco com contorno e palavras-chave em azul (NEXTAGS, AUTOMATIZAR, DIRECT…).
6. **Som:** 100 % sintetizado em código (sem amostras de terceiros): pops, cliques, whooshes, impactos, risers, notificação própria (não imita app algum).
   Trilha eletrônica original a 120 BPM, com seções ligadas à narrativa (gancho, problema, solução, tutorial discreto, prova, aplicações, estratégico
   sóbrio, CTA, fechamento). Ducking pelo envelope da sua fala; música ≈ 15–18 LU abaixo da voz nos trechos de energia (CTA 14,8 LU) e ≈ 22–24 LU no tutorial e no trecho
   estratégico, que são propositalmente mais discretos.
7. **Voz:** declip (restaurou os picos cortados), passa-altas 75 Hz e redução de ganho para dar espaço. Sem denoise nem EQ agressivo.

## 5. Verificações realizadas (resultado medido)

| # | Verificação | Resultado |
|---|---|---|
| 1 | Duração | 152,30 s; vídeo e áudio começam em 0,000 e têm o mesmo comprimento |
| 2 | Nenhuma fala cortada | voz alinhada ao original com **lag 0**; transcrição do áudio final: **98,9 %** das palavras iguais ao texto revisado |
| 3 | Telas pretas / quadros congelados | nenhum (blackdetect e freezedetect) |
| 4 | Decodificação completa | sem erro |
| 5 | Texto fora da tela / legenda sobre o rosto | conferido nas pranchas (a cada 5 s) e em 14 quadros-chave: títulos em y≈250–700, legendas em y≈1350–1530, rosto livre |
| 6 | Legendas × títulos já editados | sem conflito (legenda abaixo do rosto; seus títulos acima) |
| 7 | Nextags / AUTOMATIZAR grafados corretamente | sim (legendas, títulos e SRT/ASS) |
| 8 | Música não encobre a voz | ASR do mix final 98,9 %; música 15 a 24 LU abaixo da voz, conforme o trecho (medido por trecho) |
| 9 | Clipping / true peak | 0 amostras ≥ 0,999; true peak −1,6 dBFS |
| 10 | Imagem não distorcida / cor | proporção 9:16 nativa; conversão bt709 verificada (diferença 0,0 num trecho sem overlay) |
| 11 | Coerência estética após 30 s | conferida lado a lado nas pranchas; ajustes feitos após a 1ª renderização (ver §7) |
| 12 | Nenhuma captura ilustrativa passada por real | os trechos da plataforma agora são gravações reais; o que segue ilustrativo (cena E, CTA) está identificado ou é conceitual |
| 13 | CTA claro | "COMENTE / AUTOMATIZAR / RECEBA O LINK NO DIRECT", fora dos botões do Instagram |
| 14 | Arquivo abre e reproduz | decodificado integralmente com ffmpeg; faststart ativo |

## 6. Real × ilustrado

| Trecho | Tempo | Situação |
|---|---|---|
| Fluxo COMENTÁRIO → PALAVRA-CHAVE → MENSAGEM (cena E) | 37,5–42,6 s | **ilustração** de conceito |
| Wordmark "Nextags" (cena F) | 48,5–50,2 s | **texto tipográfico**, não é o logo oficial (nenhum arquivo de logo foi enviado) |
| **Tutorial (gravação A)**: conexão, Ferramentas, automação, post, palavra-chave, mensagem, link, ativação | 50,5–66,1 s | **gravação real** da Nextags (acelerada e com pausas; ver `CAPTURAS_REAIS.md`) |
| **Teste (gravação B)**: comentário, notificação, Direct recebido, botão do link, site | 68,0–81,5 s | **gravação real** (com pausas nos estados estáticos) |
| CTA: comentário → Direct | 127,9–135,6 s | **ilustração** rotulada "ilustração" |
| Avatares dos comentários ilustrados | vários | vetores genéricos (sem fotos de terceiros) |

**Lacuna entre fala e imagem:** a fala "A Nextags respondeu o meu comentário" (73,5–75,8 s) não tem imagem correspondente, pois a gravação B não
mostra uma resposta pública abaixo do comentário. A mensagem no Direct está comprovada; a resposta no comentário não aparece em nenhuma gravação.

## 7. Revisão e correções após a 1ª renderização

- Bug de camadas (mockups estavam cortando o seu rosto em vez de ficar atrás): corrigido e re-renderizado.
- Colisão de cache que misturava duas legendas num quadro: corrigida.
- Cartões de aplicações sobrepostos ao título "PERCEBE A DIFERENÇA?": saída antecipada.
- Contraste do azul sobre a parede clara: sombra reforçada. Cupom redesenhado.
- Limitador de áudio atrasava 2 ms: compensado (lag 0).
- SFX da sua parte já editada reancorados nos instantes medidos (ex.: comentários em 6,00/6,20/6,50/6,90 s; cubo em 16,90 s; "Copiar/Colar/Enviar" em 25,20/25,85/26,50 s).

## 8. O que eu NÃO consegui verificar / pontos para você decidir

1. **Não ouvi o áudio.** Validei por medição (loudness, picos, balanço espectral, transcrição do mix), mas o gosto da trilha e o encaixe fino dos SFX
   precisam do seu ouvido. Se algum efeito estiver forte demais, é um número em `scripts/05_audio.py` (`SFX_TRIM`, ganho por cue).
2. **Duas dúvidas de fala:** em 17,86 s o Whisper ouve "E manda o link", e eu legendei "**Me** manda o link" (igual ao seu comentário e ao roteiro).
   E em três pontos ("só **para** mandar", "**para** dar o primeiro retorno", "**para** conhecer") o Whisper oscila entre "para" e "pra". Confira esses
   quatro trechos nas legendas (`config/caption_groups.json`).
3. **Falas fora do roteiro de referência** (mantidas, pois a fala gravada manda): "e eu tô falando", "outra conta minha", "justamente nesse vídeo",
   "respondendo DM".
4. **Afirmações a checar antes de veicular:** "Eu configurei uma automação justamente nesse vídeo" e o teste P4 dependem da integração concluída.
   "500 pessoas" aparece só como hipótese (título já seu, com interrogação), sem afirmar números reais.
5. **Quadro final de 1,93 s** estende o vídeo (a fala termina em 150,06 s). Se preferir terminar na fala, remova o bloco "QUADRO FINAL" de `overlay/scenes3.js` e use `--total 150.4` em `build.sh` (e no `05_audio.py`, constante `T`).
6. **Logo oficial e capturas reais:** pendentes com a Keren.
7. **Direitos:** a trilha e os SFX são originais (sintetizados); não há música nem imagem de terceiros. Fonte Montserrat sob SIL OFL.
8. **Tamanho:** 114,9 MB, acima do alvo habitual de Reels; o Instagram recomprime. Se precisar de um arquivo menor, subir o CRF para 20–22
   (`build.sh`, `--crf`).

## 9. Atualização: encaixe das gravações reais (prova de que nada mais mudou)

- Gravações recebidas: A (19,25 s, 882×1920, 60 fps) e B (4,8 s, 882×1920, 30 fps). Layout: celular atrás de você + lupa com o zoom do detalhe de cada passo, sincronizada.
  Sincronia amarrada à fala e aos efeitos sonoros já existentes (tabela em `CAPTURAS_REAIS.md`).
- **Áudio:** idêntico à versão anterior (mesmo hash do áudio decodificado, 29.245.440 bytes).
- **Vídeo:** os **3.319 quadros fora de 42,63–84,3 s são bit a bit idênticos** à versão anterior. O vídeo anterior foi reaproveitado por emenda de pacotes H.264
  (sem recodificar) e só o trecho 42,63–84,3 s foi recodificado (nas margens 42,63–50,3 s, 66,6–67,9 s e 82–84,3 s o conteúdo é o mesmo, PSNR ≥ 45,8 dB).
  Dentro das janelas das gravações o conteúdo mudou, como pretendido. Arquivo: `REVISAO_VISUAL/comparacao_com_versao_anterior.json`.
- Correções feitas ao revisar: imagem dupla nas trocas de tela (agora só há mistura de quadros em câmera lenta), flashes brancos de carregamento encurtados.
- Pontos de conteúdo para você decidir (também em `CAPTURAS_REAIS.md`): link com código de indicação visível ~0,5 s (ampliado na lupa),
  nomes de terceiros na tela de perfil do B (1,6 s) e relance de outra mensagem automática sua ao tocar no botão.

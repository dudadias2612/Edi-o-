# PROJETO_EDITAVEL · Nextags × Duda Dias (prévia para aprovação criativa)

Projeto reproduzível: tudo que está no vídeo (gráficos, legendas, SFX, música, zoom, mixagem) é gerado por código a partir
da gravação original. Nada é "colado" à mão; corrigir um elemento = editar o arquivo e rodar `./build.sh`.

```
entrada/original_nextags_v1.mov   gravação recebida (1080×1920 HEVC 30 fps, 150,37 s) — não versionada (privada)
config/
  caption_groups.json             blocos de legenda (texto revisado + tempos por palavra)
  zoom.json                       zooms estilo "corte" e movimentos lentos (só após 29,4 s)
  capturas.json                   sincronia (speed ramp) e zoom (lupa) das gravações reais; placeholders.json = reserva ilustrativa
transcricao/
  whisper_raw.json                saída bruta do Whisper large-v3 (palavra a palavra)
  texto_revisado.txt              texto final revisado (fala real = fonte de verdade)
  palavras_revisadas.json         palavras alinhadas aos tempos reais
overlay/                          motor de gráficos (HTML/CSS/SVG, Montserrat) → PNG com transparência, 1080×1920
  scenes*.js                      TODAS as cenas, cada elemento ancorado no tempo da fala
scripts/
  01_matte.py                     recorte da pessoa (Robust Video Matting) → work/matte.mkv
  02_transcricao.py               revisão/alinhamento + SRT + ASS
  03_render_overlay.mjs           Chromium (Playwright) → camadas "atrás" e "frente"
  04_composite.py                 composição final: zoom, mockups ATRÁS da pessoa, legendas/títulos à frente, H.264
  05_audio.py / 06_master.sh      voz tratada + SFX sintetizados + trilha original + ducking + master −14 LUFS
  07_capturas.py                  celular + lupa a partir das gravações reais (A e B); 07_slots.py = reserva
  08_qc.py / 09_asr_check.py      controle de qualidade e transcrição do áudio final
  10_compare.py / 11_splice.py    prova quadro a quadro de que nada mais mudou; emenda de pacotes H.264 sem recodificar
entrada/captura_A_fluxo.mov, captura_B_teste.mov   gravações de tela reais (ver CAPTURAS_REAIS.md; privadas, fora do git)
saida/                            MP4 + legendas
REVISAO_VISUAL/                   pranchas e quadros-chave, qc_resultado.json
```

## Reproduzir
```
./build.sh all        # transcrição → slots → overlays → áudio → vídeo → mux (≈ 30 min em 4 CPUs)
./build.sh overlay    # só os gráficos (≈ 3,5 min), depois: ./build.sh video && ./build.sh mux
./build.sh audio      # só o áudio (≈ 20 s)
```
Dependências: `ffmpeg 6`, Python 3.13 (`numpy scipy opencv-python-headless soundfile pyloudnorm onnxruntime faster-whisper`),
Node 22 + `playwright` (Chromium). Modelos: Whisper large-v3 (baixa sozinho) e `rvm_mobilenetv3_fp32.onnx`
(https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx → `/home/user/models/rvm.onnx`).
Fonte: Montserrat (SIL OFL, via `@fontsource/montserrat`). Não usa Remotion, serviços pagos nem amostras de terceiros:
SFX e trilha são sintetizados em `05_audio.py`.

## Decisões técnicas importantes
- **Entrada real = 1080×1920 HEVC**, não 512×910 H.264 como no briefing: não há upscale; a saída mantém a resolução nativa.
- **Primeiros 30 s bloqueados**: nenhum zoom, título ou mockup novo antes de 29,4 s; só legenda e o marcador removível da prévia.
  Medição (PSNR da faixa y=250–1000 contra o original): ver `REVISAO_VISUAL/qc_resultado.json`.
- **Cor**: conversão bt709 explícita (diferença 0,0 contra o original numa região sem overlay) e saída tagueada bt709/tv.
- **Mockups atrás de você**: a máscara da pessoa vem de RVM; só é reaplicada nos quadros que têm elementos "atrás".
- **Áudio**: a voz original veio com clipping (−6,7 LUFS, +1,7 dBTP): foi aplicado declip, filtro de 75 Hz e redução de ganho; música a ~15–24 LU
  abaixo da voz (conforme a seção) com ducking pelo envelope da fala; master −14 LUFS, true peak ≤ −1,5 dBTP; latência do limitador compensada (lag 0).

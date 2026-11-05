#!/bin/bash
# Pipeline completo e reproduzível. Uso: ./build.sh [all|slots|overlay|audio|video|mux]
set -e; cd "$(dirname "$0")"
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
step=${1:-all}
need_matte(){ [ -f work/matte.mkv ] || python3 scripts/01_matte.py; }
case $step in
 all|final|slots)   python3 scripts/02_transcricao.py; python3 - <<'PY'
import json; G=json.load(open("config/caption_groups.json")); open("overlay/data_captions.js","w").write("window.CAP="+json.dumps(G,ensure_ascii=False)+";")
PY
              python3 scripts/07_slots.py ;;&
 all|overlay|final) rm -rf work/overlay; node scripts/03_render_overlay.mjs --total 152.4 --out work/overlay --workers 3 $([ "$step" = final ] && echo --no-marker) ;;&
 all|final|audio)   python3 scripts/05_audio.py; ./scripts/06_master.sh ;;&
 all|final|video)   need_matte; python3 scripts/04_composite.py --out work/video_silent.mp4 --preset slow --crf 17 --total 152.3 ;;&
 all|final|mux)     mkdir -p saida; OUT=saida/NEXTAGS_DUDA_PREVIA_APROVACAO.mp4; [ "$step" = final ] && OUT=saida/VIDEO_FINAL_NEXTAGS_DUDA_1080P.mp4; ffmpeg -v error -y -i work/video_silent.mp4 -i work/audio/mix_master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart \
                -metadata title="Nextags x Duda Dias - PREVIA PARA APROVACAO CRIATIVA" $OUT; echo "ok: $OUT" ;;
esac

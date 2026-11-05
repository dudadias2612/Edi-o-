#!/bin/bash
# Master: limitador de pico (-1,5 dBFS) e medição final (EBU R128). Saída: work/audio/mix_master.wav
set -e
cd "$(dirname "$0")/.."
ffmpeg -v error -y -i work/audio/mix_pre.wav -af "alimiter=limit=0.84:attack=2:release=50:level=false:latency=1" -c:a pcm_f32le work/audio/mix_master.wav
ffmpeg -hide_banner -nostats -i work/audio/mix_master.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|LRA:|Peak:" | tail -3

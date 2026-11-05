# Gravações reais da Nextags: como foram encaixadas e como ajustar

Os 4 placeholders ilustrativos (5 telas) foram **substituídos pelas suas duas gravações de tela**. Nada além disso foi alterado no vídeo
(imagem, legendas, títulos, zooms, música, efeitos e voz são idênticos à versão anterior; ver `REVISAO_VISUAL/comparacao_com_versao_anterior.json`).

| Gravação | Duração | Entra no vídeo | O que mostra |
|---|---|---|---|
| **A** `entrada/captura_A_fluxo.mov` (882×1920, 60 fps) | 19,25 s | 50,50 → 66,10 s (15,6 s) | Instagram conectado → Ferramentas → Automações do Instagram → Criar → escolher post → palavra AUTOMATIZAR → fluxo da mensagem → link → "Automação ativada!" |
| **B** `entrada/captura_B_teste.mov` (882×1920, 30 fps) | 4,8 s | 68,00 → 81,50 s (13,5 s) | Comentário AUTOMATIZAR (outra conta) → notificação do Direct → mensagem recebida → toque no botão → site da Nextags |

## Layout
- **Celular** (à esquerda, atrás de você, como o mockup do seu começo) toca a gravação real. Fica atrás do rosto/cabelo graças ao recorte da pessoa.
- **Lupa** (à direita, no alto) mostra o **zoom do detalhe** de cada passo, sempre do mesmo quadro que o celular está tocando, com um **rótulo azul**
  e um **retângulo azul no celular** indicando de onde sai o zoom. Assim o texto pequeno da tela fica legível no Reels.
- Os chips "PASSO 1…5" e os pontos de progresso do tutorial continuam como estavam.

## Sincronia (tudo amarrado à fala e aos efeitos sonoros já existentes)
O áudio **não foi tocado**. As gravações é que foram retemporizadas para cair nos sons que já estavam no vídeo:

| Fala / som | Tempo | Ação na gravação |
|---|---|---|
| "…conectei meu Instagram" | 51,10 s | toque em Instagram e card "Conectado @duddadiasss" |
| "fui em ferramentas" (tick) | 53,54 s | menu com "Ferramentas" destacado |
| "automações de comentários" (tick) | 54,86 s | página Automações do Instagram |
| "criei uma nova automação" (tick) | 56,92 s | toque em "Criar automação" → "Criando…" |
| "Escolhi a publicação" (tick) | 58,50 s | escolha do post (Passo 1 de 4) |
| "defini uma palavra-chave" (tick) | 60,22 s | digitação de AUTOMATIZAR (60,10–61,05 s) |
| "escrevi a mensagem… no Direct" | 61,14–63,76 s | resposta, novo fluxo e mensagem colada |
| "adicionei meu link" (tick) | 64,04 s | botão "Abrir site" e link digitado |
| "ativei" (tick) | 65,20 s | toque em "Ativar automação" → "Automação ativada!" (65,6–66,1 s) |
| digitação (SFX de teclado) | 70,42 s | digitando AUTOMATIZAR no comentário (tempo real, até 71,30 s) |
| pop do comentário | 71,30 s | comentário enviado ("Postando…", outra conta) |
| "Olha isso!" + whoosh | 72,30 s | notificação "duddadiasss Enviou uma mensagem" |
| pop | 74,14 s | Direct abre com a mensagem |
| notificação (som) | 75,95 s | leitura da mensagem recebida |
| "o link que eu configurei" | 79,60–81,50 s | toque em "Botão #1" → site da Nextags carregando |

**Velocidade:** A é acelerada (≈ 1× na digitação e na escolha do post, 2–5× nas partes longas) e B tem pausas nos estados estáticos
(perfil, notificação, mensagem). A tela de carregamento é encurtada. Tudo isso está em `config/capturas.json` (`anchors` = [tempo no vídeo, tempo na gravação]).

## Ajustar ou trocar uma gravação
1. Coloque a nova gravação em `entrada/` e extraia os quadros: `ffmpeg -i entrada/NOVA.mov -fps_mode passthrough -q:v 2 work/cap/A/%05d.jpg`.
2. Edite `config/capturas.json`: `anchors` (sincronia) e `lupa` (zoom: `cx, cy, w` em pixels da gravação, `label`).
3. `./build.sh slots && ./build.sh overlay && ./build.sh video && ./build.sh mux` (≈ 25 min; o recorte da pessoa é reaproveitado).

## Pontos de atenção de conteúdo (decisão sua)
- **A narração diz "A Nextags respondeu o meu comentário"**, mas a gravação B **não mostra uma resposta pública no comentário**: mostra o comentário sendo
  enviado e depois a notificação e o Direct. A parte do Direct está comprovada; a "resposta no comentário" não aparece em nenhuma gravação.
- A gravação A mostra seu **link com código de indicação** (`nextags.com.br/?ref=…`) por ~0,5 s, ampliado na lupa.
- Na tela de perfil do B (primeiros segundos) aparecem nomes de **terceiros** ("Seguido(a) por …"). Se preferir, começo o B já na tela de comentários.
- Ao tocar no botão, o fundo do B mostra de relance outra mensagem automática sua (convite para aula gratuita).

# Substituição dos placeholders pelas gravações reais da Nextags

A prévia tem **4 trechos ilustrativos** (5 telas, porque o teste P4 tem dois celulares). Cada um é um módulo
independente: trocar a gravação **não altera** a duração do vídeo, a voz, as legendas, a música, os efeitos
sonoros nem a identidade visual. A gravação é ajustada automaticamente à janela exata abaixo.

| ID | O que mostrar | Fala (âncora) | Início → fim | Duração exata | Moldura | Proporção ideal da gravação |
|---|---|---|---|---|---|---|
| **P1** | Conexão do Instagram com a plataforma | "Primeiro, eu conectei meu Instagram à plataforma." | 50,500 s → 52,600 s (quadros 1515–1578) | **2,100 s** (63 quadros) | celular | vertical ≈ 9:19 |
| **P2** | Ferramentas → Automações de Comentários do Instagram → Criar nova automação | "Depois, fui em Ferramentas, entrei em Automações de Comentários…" | 52,600 s → 58,500 s (quadros 1578–1755) | **5,900 s** (177 quadros) | navegador | tela de computador, recorte ≈ 2:1 |
| **P3** | Escolher publicação, palavra-chave, mensagem do Direct, link e ativar | "Escolhi a publicação, defini uma palavra-chave… e ativei." | 58,500 s → 65,800 s (quadros 1755–1974) | **7,300 s** (219 quadros) | navegador | tela de computador, recorte ≈ 2:1 |
| **P4A** | Comentário AUTOMATIZAR feito por outra conta + resposta automática no comentário | "Entrei por outra conta minha e comentei a palavra automatizar… A Nextags respondeu o meu comentário…" | 68,000 s → 81,567 s (quadros 2040–2447) | **13,567 s** (407 quadros) | celular (esquerda) | vertical ≈ 9:19 |
| **P4B** | Direct recebido com o link configurado | "…e enviou automaticamente uma mensagem no Direct com o link que eu configurei." | 68,000 s → 81,567 s (mesma janela do P4A) | **13,567 s** | celular (direita) | vertical ≈ 9:19 |

Dica de marcação no P4: o comentário é falado em **70,4–72,0 s**, "A Nextags respondeu" em **73,6–75,8 s** e a mensagem no Direct em **75,9–81,5 s**.
Se a gravação do teste for uma só, grave P4A e P4B a partir do mesmo take, cada um recortado no seu celular.

## Passo a passo

1. Copie cada gravação (MP4/MOV, qualquer resolução; quanto maior, mais nítido) para `PROJETO_EDITAVEL/substituir/`.
2. Em `config/placeholders.json`, preencha o campo `"src"` do slot, por exemplo `"src": "substituir/P2_automacao.mp4"`.
   Deixe `null` nos que continuarem ilustrativos.
3. Rode `./build.sh all` (a máscara da pessoa é reaproveitada; ~25 min).
4. Quando **todos** os slots tiverem gravação real, o banner "DEMONSTRAÇÃO ILUSTRATIVA" some sozinho e os rótulos
   "CAPTURA REAL / INSERIR GRAVAÇÃO" ficam cobertos pela gravação. Para remover o marcador "PRÉVIA PARA APROVAÇÃO CRIATIVA" do canto,
   renderize com `node scripts/03_render_overlay.mjs --no-marker` (já incluído no `./build.sh final`).

**Ajuste de tempo:** a gravação é esticada/encurtada (±60%) para caber na janela. Fora disso o script avisa; o ideal é gravar com a
duração da coluna "Duração exata". Se a gravação for mais curta, o último quadro é mantido; se for mais longa, é cortada no fim.

**O que NÃO muda:** duração total (152,3 s), sincronia com a voz, legendas, música, efeitos, resolução 1080×1920.

**Atenção de conteúdo:** só marque como demonstração real o que for gravação real. Enquanto houver placeholder, o vídeo é uma
**prévia para aprovação criativa**, não versão de veiculação.

# Manual de Produção de Assets: Gato Cosplay
> **Destinado a:** Cris Alves (Ilustração & Direção de Arte)  
> **Objetivo:** Especificar dimensões, camadas, nomenclatura e a lista completa de imagens PNG para o desenvolvimento do jogo.

---

## 1. Padrões Técnicos e Regras de Exportação

Para garantir que o jogo funcione de forma fluida tanto em navegadores mobile quanto em aplicativo Android sem perda de qualidade nem distorção, siga estas especificações:

* **Formato dos Arquivos:** `.png` com fundo 100% transparente (canal alfa ativo).
* **Espaço de Cor:** RGB ou sRGB (evitar CMYK).
* **Resolução Base:** 72 DPI ou 144 DPI (a nitidez depende das dimensões em pixels).
* **Nome de Arquivo:** Apenas letras minúsculas, números e sublinhados (`_`), sem espaços, acentos ou caracteres especiais (ex: `cosplay_inuyasha_head.png`).

---

## 2. A Técnica de Ouro: "Canvas Universal Padronizado"

Para que você não precise se preocupar com coordenadas manuais no código ou se uma orelha vai ficar 5 pixels para a esquerda no celular, utilizaremos a técnica do **Canvas Universal**:

```text
+-------------------------------------------------------+
|  CANVAS: 1024 x 1024 px (Fundo Transparente)           |
|                                                       |
|                     [Peruca / Chapéu]                  |
|                      (Camada 5)                       |
|                                                       |
|                    [Rosto / Olhos]                    |
|                      (Camada 4)                       |
|                                                       |
|                  [Mascote Base Felino]                 |
|                      (Camada 2)                       |
|                                                       |
|                   [Roupa / Vestimenta]                |
|                      (Camada 3)                       |
|                                                       |
|    [Acessório Trás]                 [Arma / Mão]      |
|       (Camada 1)                     (Camada 6)       |
+-------------------------------------------------------+
```

### Como Funciona na Prática:
1. **Crie um arquivo mestre** no seu software de desenho (Photoshop, Procreate, Clip Studio, Krita, etc.) de **1024 × 1024 px**.
2. **Desenhe o Gatinho Base** centralizado e com espaço de sobra acima (para perucas/chapéus) e nas laterais (para asas, armas ou capas).
3. **Mantenha o Gatinho Base em uma camada travada**.
4. Crie as roupinhas, perucas e itens **em camadas separadas diretamente por cima do corpo do gato**.
5. Na hora de exportar uma peça (ex: quimono do Inuyasha), **oculte o gato e exporte o canvas inteiro de 1024 × 1024 px com fundo transparente**.
6. **Resultado:** O programador só precisa empilhar as imagens na posição `(0, 0)` na tela e tudo vai se encaixar com perfeição milimétrica automática!

---

## 3. Ordem das Camadas de Renderização (Z-Index)

O motor do jogo desenha as imagens de trás para frente. Mantenha essa lógica em mente:

| Camada | Nome | Exemplo | Descrição |
| :--- | :--- | :--- | :--- |
| **0** | Fundo (Background) | `bg_quarto.png` | Cenário atrás do gatinho. |
| **1** | Adereços Traseiros | `back_capa.png`, `back_cauda.png` | Capas longas, asas ou caudas que ficam atrás do corpo. |
| **2** | **Corpo Base do Gato** | `cat_body_base.png` | Manequim felino neutro (pelagem, orelhas naturais, patas). |
| **3** | Roupa / Peito | `cosplay_inuyasha_body.png` | Quimonos, armaduras, coletes, camisas. |
| **4** | Expressão Facial | `cat_face_happy.png`, `cat_face_sad.png` | Olhinhos, boca e bigodes (mudam na vitória/erro). |
| **5** | Cabeça / Peruca | `cosplay_inuyasha_head.png` | Cabelos, tiaras, chapéus, bandanas. |
| **6** | Acessório Frontal | `cosplay_inuyasha_item.png` | Espadas, varinhas, pokébolas, luvas seguradas à frente. |

---

## 4. Tabela de Dimensões e Resoluções por Categoria

| Categoria | Resolução do Arquivo (Largura × Altura) | Área Ocupada / Proporção | Formato |
| :--- | :--- | :--- | :--- |
| **Mascote Base & Peças** | `1024 × 1024 px` | Centralizado (margem de 100px nas bordas) | PNG transparente |
| **Expressões do Rosto** | `1024 × 1024 px` *(ou 512 × 512 px)* | Alinhado à cabeça do manequim base | PNG transparente |
| **Cenários de Fundo (9:16)** | `1080 × 1920 px` | Ocupa toda a tela mobile vertical | JPG ou PNG opaco |
| **Moldura Polaroid (Álbum)**| `800 × 1000 px` | Foto instantânea com espaço inferior para texto | PNG transparente |
| **Ícones de UI e Botões** | `256 × 256 px` *(ou 512 × 256 px)* | Botões, selos, corações, estrelas | PNG transparente |

---

## 5. Catálogo de Assets para o MVP (Contagem Total de Imagens)

Para o lançamento da primeira versão jogável (MVP com 5 personagens e mecânicas completas), você precisará criar um total de **34 ilustrações**:

### 5.1. Mascote Base e Expressões (5 imagens)
O gato deve ter postura frontal amigável, patas dianteiras visíveis e corpo ereto para suportar as roupas.
* [ ] `cat_body_base.png`: Corpo do gato sem rosto/expressão definida (ou rosto neutro básico).
* [ ] `cat_face_neutral.png`: Expressão padrão esperando o jogador escolher as roupas.
* [ ] `cat_face_happy.png`: Carinha de vitória (olhos fechados felizes `^.^`, bochechas coradas, linguinha de fora).
* [ ] `cat_face_sad.png`: Carinha dengosa/triste de erro (olhos marejados `T.T`, orelhas levemente caídas).
* [ ] `cat_face_thinking.png`: Carinha com a pata no queixo ou olhos curiosos pensando na charada.

---

### 5.2. Peças dos 5 Cosplays Principais (15 imagens)
Cada personagem possui exatamente 3 peças características (Cabeça, Corpo e Acessório):

#### 1. Inuyasha (Anime Clássico)
* [ ] `cosplay_inuyasha_head.png`: Cabelo prateado longo com par de orelhas de cachorro branco caninas por cima.
* [ ] `cosplay_inuyasha_body.png`: Quimono vermelho largo (Suikan/Hakama) com gola e mangas tradicionais.
* [ ] `cosplay_inuyasha_item.png`: Colar de pérolas com presas (Kotodama) e/ou a espada Tessaiga descansada na pata.

#### 2. Sailor Moon (Magical Girl)
* [ ] `cosplay_sailormoon_head.png`: Penteado loiro com dois coques esféricos altos (Odango) e mechas longas caídas.
* [ ] `cosplay_sailormoon_body.png`: Traje de marinheira colegial branco com gola azul marinho e grande laço vermelho no peito.
* [ ] `cosplay_sailormoon_item.png`: Cetro lunar com formato de meia-lua ou tiara dourada frontal.

#### 3. Naruto Uzumaki (Ninja)
* [ ] `cosplay_naruto_head.png`: Cabelo loiro espetado com bandana de metal estilizada com símbolo espiral.
* [ ] `cosplay_naruto_body.png`: Agasalho esportivo ninja laranja com gola alta branca e detalhes azuis nos ombros.
* [ ] `cosplay_naruto_item.png`: Adaga kunai de ferro ou pergaminho ninja preso nas costas/pata.

#### 4. Son Goku (Dragon Ball)
* [ ] `cosplay_goku_head.png`: Cabelo preto com pontas triangulares grandes e bem volumosas para os lados.
* [ ] `cosplay_goku_body.png`: Dogi de artes marciais laranja, decote em V com camiseta azul marinho por baixo e faixa azul na cintura.
* [ ] `cosplay_goku_item.png`: Esfera do dragão de quatro estrelas dourada brilhante ou bastão mágico vermelho.

#### 5. Ash Ketchum (Pokémon)
* [ ] `cosplay_ash_head.png`: Boné esportivo vermelho e branco clássico com o símbolo verde na frente, aba virada.
* [ ] `cosplay_ash_body.png`: Colete azul aberto com mangas e gola brancas sobre camisa preta com detalhes amarelos.
* [ ] `cosplay_ash_item.png`: Pokébola vermelha e branca segura em uma das patinhas.

---

### 5.3. Itens Curingas / Distratores (3 imagens)
Peças engraçadas de outros universos que servem para despistar o jogador no guarda-roupa:
* [ ] `distractor_straw_hat.png`: Chapéu de palha com fita vermelha (referência a One Piece).
* [ ] `distractor_magic_wand.png`: Varinha mágica de madeira com ponta faiscante (referência a fantasia/bruxaria).
* [ ] `distractor_round_glasses.png`: Óculos redondos vintage com armação preta.

---

### 5.4. Cenários de Fundo (2 imagens - 1080 × 1920 px)
* [ ] `bg_gameplay.png`: Quarto decorado com pôsteres fofos, prateleira de action figures e janela com luz suave.
* [ ] `bg_album.png`: Mesa de madeira aconchegante com caneca de café e luz quente para expor as fotos polaroids.

---

### 5.5. Interface de Usuário / UI (9 imagens)
Elementos interativos para os cliques e toques:
* [ ] `ui_card_dialog.png`: Cartão estilo balão ou pergaminho onde fica o texto da charada "Quem sou eu?".
* [ ] `ui_btn_confirm.png`: Botão estilizado com pata de gato ou "Confirmar Cosplay!".
* [ ] `ui_btn_hint.png`: Ícone de lâmpada ou novelo de lã para pedir dica.
* [ ] `ui_btn_reset.png`: Ícone de seta circular / cabide para despir o gato e recomeçar.
* [ ] `ui_slot_holder.png`: Moldura/nicho redondo ou quadrado onde as peças ficam listadas no inventário.
* [ ] `ui_polaroid_frame.png`: Moldura de foto instantânea com borda branca e base larga para o álbum.
* [ ] `ui_stamp_approved.png`: Carimbo de "Cosplay Perfeito!" ou "Aprovado!" com textura fofa.
* [ ] `ui_icon_album.png`: Ícone de livrinho/câmera para abrir a galeria colecionável.
* [ ] `ui_particle_sparkle.png`: Estrelinha/coração brilhante para partículas de acerto.

---

## 6. Dicas Rápidas para a Ilustradora

1. **Evite traços muito finos:** O jogo será jogado principalmente em telas de celular de 6 polegadas. Traços médios com outline marcado garantem que as roupas continuem nítidas em tamanho reduzido.
2. **Cores Contrastantes:** Cores vibrantes com sombreamento tipo cel shading (estilo anime) funcionam muito melhor do que tons desbotados.
3. **Use o arquivo de template:** Salve o arquivo inicial do gatinho como `template_mestre_1024x1024.psd` (ou formato correspondente do seu app) e nunca altere o tamanho nem a posição das orelhas e patas no arquivo mestre.

# Instruções de Ilustração para Cris Alves 🐾
### Guia Prático de Estilo, Dimensões e Primeiro Modelo (Inuyasha)

> **Projeto:** Gato Cosplay (Paper Mario 2.5D)  
> **Destinatária:** Cris Alves  
> **Objetivo:** Regras de traço, medidas em pixels e o passo a passo para criar o primeiro modelo de teste.

---

## 1. Como Desenhar (Direção de Arte & Estilo)

1. **Estilo "Paper Mario / Cozy Sticker":**
   * Ilustração 2D com visual de **adesivo de papel recortado**.
   * Traço com contorno escuro bem definido (espessura média/grossa). Evite linhas fininhas de rascunho porque em tela de celular elas somem.
   * Pintura em **cel shading** (cores chapadas com 1 tom de sombra limpo e suave).
   * Opcional: pode ter uma bordinha externa branca tipo adesivo destacado (*die-cut sticker*).

2. **Pose do Gatinho Base ("O Manequim Felino"):**
   * **100% de frente:** O gato precisa estar simétrico ou quase simétrico, olhando direto para o jogador.
   * **Postura ereta:** Sentadinho ou em pé de duas patas, como um bonequinho/manequim.
   * **Patinhas dianteiras visíveis:** Braços posicionados para a frente/laterais de modo que as roupas possam ser vestidas por cima sem cobrir totalmente as patinhas (onde ele segura os itens).
   * **Proporção Chibi:** Cabeça grande e corpo fofo (proporção de aproximadamente 1 : 1 ou 1 : 1.2 entre cabeça e tronco).

3. **Expressão Facial Separada:**
   * O gatinho base pode ter o rosto liso (apenas o formato da cabeça) ou um rostinho neutro básico.
   * Os olhinhos e boquinhas felizes/tristes serão trocados via código quando o jogador acertar ou errar a charada!

---

## 2. Tamanho das Coisas & Dimensões Técnicas

Para que tudo funcione no motor do jogo sem você precisar calcular coordenadas na mão, usaremos o **Canvas Universal Padronizado**:

### 📐 O Canvas Mestre (1024 × 1024 px)
* **Tamanho do arquivo:** `1024 × 1024 pixels` (quadrado).
* **Fundo:** Sempre **100% transparente** (canal alfa ativado).
* **Formato:** `.PNG`.
* **Resolução:** 72 DPI ou 144 DPI (o importante são os pixels: 1024x1024).

```text
+-------------------------------------------------------+
|  CANVAS: 1024 x 1024 px (Fundo Transparente)          |
|                                                       |
|  [ MARGEM SUPERIOR: ~250px para perucas e chapéus ]   |
|                                                       |
|                  ( Orelhas / Cabeça )                 |
|                                                       |
|             [ MARGEM LATERAL: ~150px p/ itens ]       |
|                                                       |
|                   ( Tronco / Roupinha )               |
|                                                       |
|                    ( Patas Inferiores )               |
|  [ MARGEM INFERIOR: ~80px de base ]                   |
+-------------------------------------------------------+
```

### 📏 Medidas do Gatinho dentro do Canvas:
* **Altura total do gato:** Ocupa cerca de **600 a 650 pixels** de altura.
* **Margem do Topo (~250 a 300 px livres):** Muito importante! Deixe esse espaço vazio acima da cabeça do gato para poder caber perucas altas (como o cabelo espetado do Goku ou um chapéu de bruxo).
* **Margens Laterais (~150 px de cada lado):** Deixe livre para espadas, cajados, asas ou capas.
* **Posição dos Pés:** Apoiar a base do gato a cerca de 80 a 100 pixels do chão do canvas.

### ✨ O Truque Mágico da Exportação:
1. No seu aplicativo de desenho (Photoshop, Procreate, Clip Studio, Krita):
   * Crie o arquivo `1024 x 1024 px`.
   * Desenhe o **Gato Base** na camada 1 e **trave essa camada**.
   * Crie uma nova camada em cima e desenhe a **Peruca**.
   * Crie outra camada e desenhe a **Roupa**.
   * Crie outra camada e desenhe o **Item**.
2. **Ao salvar:**
   * Oculte o gatinho e exporte **apenas a peruca**, mas mantendo o canvas inteiro de `1024 x 1024 px` transparente.
   * Faça o mesmo com a roupa e com o item.
3. **Resultado:** O programador só precisa colocar as imagens uma em cima da outra na posição `(0, 0)` e tudo se encaixará com precisão milimétrica sem ajustes manuais!

---

## 3. Planejamento do Primeiro Modelo: O Piloto "Inuyasha" 🗡️

Para testar todo o fluxo do jogo (animação 3D, encaixe das peças e troca de expressões), você vai produzir um **kit piloto com 4 imagens principais + 2 expressões**:

### Lista de Arquivos do Modelo Piloto:

| # | Nome do Arquivo | Camada | O que desenhar |
|---|---|---|---|
| 1 | `cat_body_base.png` | **Base (2)** | Gatinho neutro peludinho (pelagem clara/laranja, orelhas naturais, tronco e patas dianteiras). |
| 2 | `cosplay_inuyasha_head.png` | **Cabeça (5)** | Cabelo prateado longo com franja e orelhinhas caninas brancas pontudas no topo. |
| 3 | `cosplay_inuyasha_body.png` | **Corpo (3)** | Quimono vermelho clássico (Suikan) com gola cruzada, mangas bufantes e faixa preta. |
| 4 | `cosplay_inuyasha_item.png` | **Item (6)** | Espada Tessaiga (de madeira ou lâmina larga) encaixada próxima à pata direita. |
| 5 | `cat_face_happy.png` *(bônus)* | **Rosto (4)** | Olhos fechados felizes `^.^` e bochecha rosada (vitória). |
| 6 | `cat_face_sad.png` *(bônus)* | **Rosto (4)** | Olhos caídos chorosos e orelhinhas tristes (erro). |

---

## 4. Roteiro Passo a Passo para a Cris

* **Etapa 1 (O Manequim):** Desenhar o gatinho base em `1024x1024 px`. Enviar um print para o Bruno validar as proporções (se a cabeça e o corpinho estão no tamanho certo).
* **Etapa 2 (O Vestuário):** Com o gatinho travado no fundo, pintar a peruca prateada, o quimono vermelho e a espada.
* **Etapa 3 (Exportação):** Exportar os 4 arquivos PNG transparentes em `1024x1024 px`.
* **Etapa 4 (Teste no Jogo):** O Bruno joga os arquivos na pasta do jogo e vê o gatinho se vestindo em 3D ao vivo na tela!

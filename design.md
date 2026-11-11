# Design — Estética Thais Tutuy

Landing page da **Estética Thais Tutuy** (Alphaville, Barueri), feita a partir do Figma
[`thaistutuy` › Frame 315](https://www.figma.com/design/YH6f6uJkNEH3RvhvjOEM2N/thaistutuy?node-id=151-2).

Stack: HTML + CSS + JavaScript puro, GSAP 3 (ScrollTrigger, ScrollSmoother, SplitText) via CDN.
Sem build. Hospedagem estática na Vercel.

---

## 1. Objetivo da página

Converter visitantes em **agendamentos de avaliação via WhatsApp**.
Todo CTA principal leva ao WhatsApp; os secundários rolam até a seção certa.

Público: mulheres de Alphaville que querem rejuvenescer a pele **sem agulha / sem botox**.
Tom: elegante, acolhedor, sofisticado, com prova real (case + depoimentos).

---

## 2. Tokens

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--c-bg` | `#F6F4F4` | Fundo da página, pílula do menu |
| `--c-wine` | `#AA0331` | CTA, rodapé, ícones de destaque |
| `--c-wine-700` | `#780223` | Fundo de card (FAQ) |
| `--c-wine-900` | `#460114` | Fundo de card (FAQ) |
| `--c-hero-from` → `--c-hero-to` | `#A4133C` → `#3E0717` | Gradiente do hero |
| `--c-rose-overlay` | `rgba(162,20,60,.8)` | Fundo dos cards "momentos" |
| `--c-ink-90` | `rgba(22,19,20,.9)` | Texto principal (Figma: *Preto 90*) |
| `--c-ink-80` | `rgba(22,19,20,.8)` | Títulos e textos (Figma: *Preto 80*) |
| `--c-ink-70` | `rgba(22,19,20,.7)` | Perguntas do FAQ |
| `--c-ink-soft` | `rgba(44,43,45,.9)` | Texto dos depoimentos (Figma: *preto*) |
| `--c-surface-1` | `#EBE9E9` | Painel do método |
| `--c-surface-2` | `#E5E5E5` / `#E6E6E6` | Cards internos, depoimentos |
| `--c-surface-3` | `#D3D1D1` | Cards de texto, bônus, citação |
| `--c-slate-300` | `#9EA8AE` (borda `#C8CED1`) | Card de tratamento claro |
| `--c-slate-500` | `#5C6970` (borda `#7E8C94`) | Card de tratamento médio |
| `--c-slate-800` | `#2B3338` (borda `#455056`) | Card de tratamento escuro |
| `--c-white-90` | `rgba(255,255,255,.9)` | Texto sobre fundo escuro |

Contraste: texto `ink-80` sobre `#F6F4F4` ≈ 12:1; branco 90% sobre `#AA0331` ≈ 6:1 (AA ok).

### Tipografia

| Papel | Fonte | Figma (1920) | Web |
|---|---|---|---|
| Display hero | **Karatone** | 110–120px | `clamp(3rem, 5.7vw, 6.875rem)` |
| Display "A arte de renovar" | **Logam Rounded** | 110px, caixa alta | `clamp(3rem, 5.7vw, 6.875rem)` |
| Títulos de seção (H2) | **Logam** | 52–64px, lh 1.1 | `clamp(2.25rem, 3.1vw, 3.5rem)` |
| Eyebrow | Logam, caixa alta | 20–22px | `1.125rem–1.375rem` |
| Títulos de card (H3) | Logam | 32–42px | `clamp(1.5rem, 2vw, 2.625rem)` |
| Corpo | **Poppins Light (300)**, destaques Medium (500) | 16–24px, lh 1.4–1.5 | `clamp(1rem, 1.1vw, 1.375rem)` |
| Números (stats) | Poppins SemiBold (600) | 80px | `clamp(3rem, 4.2vw, 5rem)` |
| Depoimentos | **Inter** Regular | 18–22px | `1.125rem–1.375rem` |

Logam usa versaletes nas minúsculas — por isso os títulos parecem "caixa alta pequena".

**Fontes usadas no site (Google Fonts)** — as do Figma não podem ir para a web como estão:

| Figma | No site | Por quê |
|---|---|---|
| Logam / Logam Rounded | **Marcellus SC** | Mesma ideia: serifa clássica com versaletes |
| Karatone | **Fraunces** (opsz 144, peso 300, `SOFT 100`) | Serifa display suave, alto contraste |
| Poppins, Inter | Poppins, Inter | Iguais ao Figma |

> ⚠️ As versões instaladas no Mac são **demo e incompletas**: Logam tem 54 glifos
> (sem acentos, números nem pontuação) e Karatone DEMO não tem `ã`, `ç`, `é`, `õ`…
> Em português cada acento cairia em outra fonte. Logam é comercial (Craft Supply Co.).
> Para usar as originais: comprar a licença *webfont* completa, colocar os `.woff2` em
> `assets/fonts/` e trocar `--font-title` / `--font-display` no topo de `style.css`.

### Espaçamento e forma

- Escala: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 80 · 100 · 160` px.
- Container: `max-width: 1720px`, gutter lateral `clamp(16px, 5.2vw, 100px)`.
- Espaço entre seções: `clamp(80px, 8.3vw, 160px)`.
- Raios: `20` (cards pequenos) · `30` (cards) · `40` (cards grandes) · `60` (hero, fotos grandes) · `999` (pílulas).
- Sombra de card (Figma, em camadas):
  `0 15px 17px rgba(0,0,0,.10), 0 62px 31px rgba(0,0,0,.09), 0 139px 41px rgba(0,0,0,.05)`.

### Componentes base

- **Botão primário** — pílula `#AA0331`, texto branco 90%, Poppins Light 20px, padding `16px 30px`, seta ↓ (rotacionada 135° = ↘ no hover).
- **Botão outline** — borda 1px branca (hero) ou `ink-80` (rodapé).
- **Botão ghost** — só texto + seta (hero "Serviços").
- **Eyebrow** — ícone estrela vinho (42px; 28px no hero) + texto Logam caixa alta.
- **Card de imagem** — foto `object-fit: cover`, raio 30–40px, overlay escuro em gradiente quando há texto por cima.

---

## 3. Estrutura da página (ordem do Figma)

| # | Seção | `id` | Conteúdo |
|---|---|---|---|
| 0 | Header | — | Logo, pílula de navegação (Início, Sobre, Tratamentos, Vira Tempo), botão "Entrar em contato" |
| 1 | Hero | `inicio` | Card vinho com foto (rolinho facial), eyebrow "Estética avançada em Alphaville", H1 "Sua pele mais jovem sem agulha!", subtítulo, CTAs, endereço, assinatura "Thais Tutuy" |
| 2 | Momentos | `momentos` | Título + texto; 3 cards (Sinais do tempo, Acne e Oleosidade, Textura e Poros) — a cabeça da modelo "sai" do card |
| 3 | Método | `metodo` | Painel "Método Vira Tempo": card grande com foto + texto, card "Sem botox!" com frasco, 4 mini-cards com ícone |
| 4 | Tratamentos | `tratamentos` | Coluna esquerda fixa (título, texto, CTA) + 6 cards empilhados (Limpeza, Peeling, Microagulhamento, Lifting, Spa, Lábios de Seda) |
| 5 | Sobre | `sobre` | Texto da Thais + retrato grande |
| 6 | Galeria | — | Faixa de 6 fotos P&B, largura total |
| 7 | E-book | `vira-tempo` | Texto + card "Bônus exclusivo" + CTA; mockup do livro e celular |
| 8 | A arte de renovar | `arte` | Título gigante com 2 fotos circulares; bento com 4 cards |
| 9 | Case | `case` | História da Paloma Barros, 2 fotos antes/depois, resultado e citação |
| 10 | FAQ | `duvidas` | Retrato + 3 perguntas (acordeão) |
| 11 | Depoimentos | `depoimentos` | Título, stats (+100 / 98%), 3 cards Google |
| 12 | Rodapé | `contato` | Foto com recorte, links, redes, CTA, telefone, e-mail, copyright |

---

## 4. Movimento (GSAP)

Princípios: suave, lento, "spa". Nada que pisque. Duração base `1s`, easing `power3.out` / `expo.out`.

| Onde | Efeito | Ferramenta |
|---|---|---|
| Preloader | Contorno da estrela (favicon) é desenhado, preenche com o degradê do hero e a tela sobe como cortina (~3,5s); página não rola enquanto isso | `strokeDashoffset` + clip-path |
| Página toda | Scroll suave (`smooth: 1.2`, `effects: true`) | ScrollSmoother |
| Hero (entrada) | Card escala de 0.94 → 1; título sobe linha a linha (máscara); subtítulo, CTAs e endereço em fade-up; foto com zoom-out | Timeline + SplitText |
| Hero (scroll) | Foto em parallax, assinatura "Thais Tutuy" desliza na horizontal | `data-speed` / scrub |
| Títulos de seção | Linhas sobem de dentro de uma máscara ao entrar na tela | SplitText + ScrollTrigger |
| Cards (momentos, método, depoimentos) | Fade-up em cascata (`stagger: .12`) | ScrollTrigger.batch |
| Momentos | A modelo sobe levemente acima do card (parallax) | scrub |
| Tratamentos (desktop) | Coluna da esquerda fica fixa; cada card escala/escurece quando o próximo passa por cima (efeito "pilha") | `position: sticky` + scrub |
| Sobre / FAQ / E-book | Imagens com parallax suave e revelação por `clip-path` | `data-speed` + ScrollTrigger |
| Galeria | Faixa desliza para o lado durante o scroll; P&B → cor no hover | scrub |
| A arte de renovar | Palavras surgem em sequência; fotos circulares flutuam em sentidos opostos | SplitText + scrub |
| Stats | Contadores 0 → 100 / 0 → 98 | ScrollTrigger once |
| FAQ | Acordeão animado (altura auto) | gsap.to height |
| Header | Esconde ao rolar para baixo, volta ao rolar para cima; ganha fundo depois do hero | ScrollTrigger onUpdate |

### Acessibilidade de movimento

- `prefers-reduced-motion: reduce` → sem ScrollSmoother, sem parallax, conteúdo já visível.
- Conteúdo nunca depende de JS para aparecer: o estado inicial "escondido" só é aplicado
  quando a classe `.js` está no `<html>` e o GSAP carregou.
- Em toque (celular), `smoothTouch: 0.1` para não brigar com o scroll nativo.

---

## 5. Responsivo

O Figma é desktop 1920px. Regras para telas menores:

| Faixa | Comportamento |
|---|---|
| ≥ 1440 | Igual ao Figma (escala fluida) |
| 1024–1439 | Mesmos grids, fontes por `clamp()` |
| 768–1023 | Grids de 3 → 2 colunas; tratamentos sem coluna fixa; menu vira botão |
| < 768 | Uma coluna; hero com foto atrás e gradiente por cima; galeria rolável; menu em tela cheia |

Gutter mínimo 16px, sem rolagem horizontal.

---

## 6. Boas práticas aplicadas

- **Semântica:** `header`, `nav`, `main`, `section` com `aria-labelledby`, `footer`; um único `h1`.
- **Acessibilidade:** link "Pular para o conteúdo", foco visível, `alt` descritivo, acordeão com `aria-expanded` / `aria-controls`, menu mobile com `aria-modal` e tecla Esc.
- **Performance:** imagens em WebP com `width`/`height` (sem layout shift), `loading="lazy"` fora da primeira dobra, `fetchpriority="high"` na foto do hero, fontes `woff2` com `font-display: swap` e `preload`, scripts com `defer`.
- **SEO:** `title` e `meta description`, Open Graph, `lang="pt-BR"`, JSON-LD `BeautySalon` com endereço e telefone, `robots.txt`.
- **Vercel:** `vercel.json` com cache longo para `/assets` e cabeçalhos de segurança.
- **Código:** CSS com variáveis e seções comentadas, BEM leve; JS em módulos pequenos por seção, sem dependências além do GSAP.

---

## 7. Conteúdo a revisar antes de publicar

- Rodapé no Figma diz *"Sua clínica de fisioterapia no Morumbi"* e e-mail `email@layana.com` (texto de outro projeto). No site foi adaptado para estética em Alphaville; o e-mail continua como placeholder.
- Os 3 depoimentos são iguais (*Andre Vieira*) — trocar por avaliações reais do Google.
- Respostas do FAQ não existem no Figma — foram escritas como rascunho.
- Link do Instagram (`@esteticathaistutuy`) foi deduzido do mockup do celular.

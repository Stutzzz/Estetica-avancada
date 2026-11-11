# Estética Thais Tutuy — Landing page

Site estático (HTML + CSS + JavaScript) com animações em **GSAP 3**
(ScrollTrigger, ScrollSmoother e SplitText). Sem build, sem dependências locais.

Design e decisões: [`design.md`](design.md) · Figma: [thaistutuy](https://www.figma.com/design/YH6f6uJkNEH3RvhvjOEM2N/thaistutuy?node-id=151-2)

## Estrutura

```
.
├── index.html            # página única
├── assets/
│   ├── css/style.css     # tokens + estilos por seção + responsivo
│   ├── js/main.js        # menu, FAQ, rolagem suave e animações
│   ├── img/              # fotos em WebP (+ og-image.jpg)
│   └── icons/            # SVGs exportados do Figma
├── favicon.svg
├── robots.txt
├── vercel.json           # cache e cabeçalhos de segurança
└── design.md
```

## Rodar localmente

Qualquer servidor estático serve. Por exemplo:

```bash
python3 -m http.server 5173
```

Depois abra http://localhost:5173.

## Publicar

1. Crie um repositório no GitHub e envie os arquivos:

   ```bash
   git init
   git add .
   git commit -m "Primeira versão do site"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```

2. Na Vercel: **Add New → Project → Import** o repositório.
   Framework preset: **Other**. Não precisa de build command nem output directory.
3. Cada `git push` na `main` publica uma nova versão.

## Antes de publicar

- [ ] Trocar o e-mail `email@layana.com` no rodapé.
- [ ] Trocar os 3 depoimentos (hoje são iguais) por avaliações reais.
- [ ] Revisar as respostas do FAQ.
- [ ] Confirmar o Instagram `@esteticathaistutuy`.
- [ ] Depois de ter o domínio, adicionar `<link rel="canonical">` e a URL completa em `og:image`.
- [ ] Fontes: ver a nota de licença em `design.md` (Logam / Karatone).

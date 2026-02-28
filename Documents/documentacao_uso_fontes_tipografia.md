# Documentação Técnica — Uso de Fontes (Tipografia) — v1.0
**Projeto:** Painel do Organizador (Eventos / Participantes / Regras de Check‑in)  
**Escopo:** Definir **fontes oficiais**, **regras de uso**, **licenciamento**, **carregamento**, **tokens**, **performance** e **acessibilidade**.

> Objetivo: tipografia com personalidade (display) sem sacrificar legibilidade (texto longo/UI).

---

## 1) Inventário oficial de fontes
### 1.1 Display (títulos/impacto)
- **Life Cinema Screen**  
  **Origem:** MyFonts (Andrey Ukhanev)  
  **Uso:** títulos, headlines, números grandes (KPI).  
  **Arquivos:** `woff2` + `woff` (kit licenciado).

### 1.2 Texto longo (conteúdo editorial)
- **Newsreader** (serif)  
  **Origem:** Google Fonts / Production Type  
  **Uso:** parágrafos longos, descrições maiores, textos “editoriais”.

### 1.3 UI / Interface (operacional)
- **Inter** (sans)  
  **Origem:** Google Fonts  
  **Uso:** formulários, tabelas, labels, mensagens, menus, botões, chips, etc.

---

## 2) Papel de cada fonte (contrato de uso)
### 2.1 Life Cinema Screen (Display)
**Usar em:**
- H1/H2 (Login, Dashboard, páginas principais)
- títulos de seção
- KPIs (números grandes + unidade curta)
- chamadas curtas (até ~5 palavras quando possível)

**Não usar em:**
- parágrafos
- tabelas e formulários
- textos pequenos (microcopy, helper, erro)

**Regra prática:** se precisa ser lido rápido enquanto o usuário opera a UI, **não** é LifeCinemaScreen.

### 2.2 Newsreader (Texto longo)
**Usar em:**
- texto corrido (parágrafos)
- descrições longas (ex.: detalhes do evento)
- áreas tipo “sobre”, notas, instruções mais extensas

**Não usar em:**
- tabelas densas
- labels/inputs
- números/valores críticos em layout apertado

### 2.3 Inter (UI)
**Usar em:**
- tudo que é interação e operação (inputs, tabelas, botões, menus, toasts, banners, tooltips)

**Motivo:** maximiza clareza e reduz fadiga em interface.

---

## 3) Licenciamento e compliance (sem improviso)
### 3.1 Life Cinema Screen (MyFonts Webfont Kit)
O arquivo de licença do kit (comentário no CSS) deixa claro que:
- as webfonts são licenciadas para o **dono do site**
- terceiros estão **explicitamente restringidos** de usar sem licença própria

✅ **OK**: usar via `@font-face` no site **desde que** o kit/licença esteja associado ao projeto e ao domínio/uso contratado.

**Proibido:**
- publicar o kit em repositório público
- reutilizar o kit em outro site/app fora do escopo licenciado

### 3.2 Newsreader / Inter (Google Fonts)
- São usadas tipicamente via licença aberta (OFL).  
- Mesmo assim: se você auto‑hospedar, mantenha arquivos e notices conforme a licença.

> Se o projeto for para produção comercial séria, centralize licenças numa pasta `/licenses` e documente no README.

---

## 4) Estrutura de arquivos e organização
### 4.1 Recomendação de estrutura
```
public/
  webFonts/
    LifeCinemaScreen/
      font.woff2
      font.woff
  fonts/           (opcional: se auto-hospedar Inter/Newsreader)
src/
  styles/
    fonts.css
    tokens.css
    globals.css
```

### 4.2 Regras
- **LifeCinemaScreen**: preferir **self-host** usando o kit do MyFonts (evita dependência externa e respeita o EULA).
- **Inter/Newsreader**: pode usar Google Fonts (rápido para desafio) ou self-host (melhor controle em produção).

---

## 5) Carregamento e configuração (CSS)
### 5.1 Life Cinema Screen (@font-face)
Use `font-display: swap` para evitar texto invisível (FOIT).

```css
/* src/styles/fonts.css */

/* Life Cinema Screen - MyFonts Webfont Kit */
@font-face {
  font-family: "LifeCinemaScreen";
  src: url("/webFonts/LifeCinemaScreen/font.woff2") format("woff2"),
       url("/webFonts/LifeCinemaScreen/font.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### 5.2 Newsreader + Inter (Google Fonts)
```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Newsreader:opsz,wght@6..72,200..800&display=swap" rel="stylesheet">
```

Se houver páginas de texto longo, habilite optical sizing:
```css
.article {
  font-optical-sizing: auto;
}
```

---

## 6) Tokens tipográficos (fonte, escala e stacks)
### 6.1 Tokens de família
```css
/* src/styles/tokens.css */
:root {
  --font-display: "LifeCinemaScreen", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  --font-body: "Newsreader", Georgia, "Times New Roman", serif;
  --font-ui: "Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
}
```

### 6.2 Defaults globais
```css
/* src/styles/globals.css */
html { text-rendering: geometricPrecision; }

body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* UI sempre em Inter */
button, input, select, textarea, table, .ui {
  font-family: var(--font-ui);
}
```

### 6.3 Escala recomendada (rem)
- `display-1`: 3.0rem / 1.05 (LifeCinemaScreen)
- `display-2`: 2.25rem / 1.1 (LifeCinemaScreen)
- `h1`: 1.75rem / 1.2
- `h2`: 1.375rem / 1.25
- `h3`: 1.125rem / 1.3
- `body`: 1.0rem / 1.6 (Newsreader)
- `small`: 0.875rem / 1.55 (Inter/UI)
- `micro`: 0.75rem / 1.4 (Inter/UI)

---

## 7) Regras de uso por componente (padrão do sistema)
### 7.1 Headers e Titles
- `PageTitle (H1)`: LifeCinemaScreen
- `SectionTitle (H2/H3)`: LifeCinemaScreen (curto) **ou** Inter Semibold (se for longo)

### 7.2 Dashboard KPIs
- Números grandes: LifeCinemaScreen
- Label do KPI: Inter (600)

### 7.3 Tabelas (Eventos/Participantes)
- tudo em Inter
- evitar serif em tabela (fadiga + ruído visual)

### 7.4 Formulários
- labels, helpers, errors: Inter
- nunca usar display font em input/label/erro

### 7.5 Conteúdo longo (detalhes/instruções)
- parágrafos: Newsreader
- chamadas curtas (subtítulo): Inter Semibold

---

## 8) Legibilidade e ajustes finos (o que realmente importa)
### 8.1 LifeCinemaScreen
- **Tamanho mínimo:** 24–32px (depende do contexto). Abaixo disso perde clareza.
- **Letter-spacing:** 0.01em a 0.04em ajuda em caracteres “recortados”.
- **Comprimento do título:** preferir 1–2 linhas.

### 8.2 Newsreader
- Body: 16–18px / 1.6
- Artigo longo: 18px / 1.7
- Evitar abaixo de 14px

### 8.3 Inter
- UI: 14–16px / 1.4–1.6
- 600 para labels e ações importantes

---

## 9) Acessibilidade (regras obrigatórias do projeto)
### 9.1 Headings semânticos
- H1/H2/H3 devem ser tags reais (`<h1>`, `<h2>`, `<h3>`), não “div com fonte bonita”.
- Evitar transformar headings em imagens (só em casos raros, com alternativa textual).

### 9.2 Contraste
- Títulos em LifeCinemaScreen precisam de contraste forte (principalmente em fundo claro).
- Textos longos em Newsreader: garantir contraste confortável (evitar cinzas lavados).

### 9.3 Foco visível (UI em Inter)
- Foco precisa ser claramente visível em botões/inputs/links.
- Não esconder outline sem substituir por indicador equivalente.

---

## 10) Performance (sem deixar a tipografia virar gargalo)
### 10.1 Carregar só o necessário
- LifeCinemaScreen: apenas 1 estilo/peso se o kit for single (ok).
- Inter: limitar a 3 pesos (400/600/700).
- Newsreader: preferir variável (um arquivo) ou poucos pesos.

### 10.2 Preload (primeira dobra)
Se o Login abre com headline em LifeCinemaScreen, use preload do `woff2`:
```html
<link rel="preload" href="/webFonts/LifeCinemaScreen/font.woff2" as="font" type="font/woff2" crossorigin>
```

### 10.3 Evitar layout shift
- Use `font-display: swap`
- Se o CLS ficar perceptível, considerar `font-size-adjust` (opcional) ou ajustar layout de título.

---

## 11) Checklist de validação (antes do deploy)
- [ ] LifeCinemaScreen aparece apenas em títulos/KPIs
- [ ] Textos longos realmente usam Newsreader
- [ ] UI (form/table/menu) está em Inter
- [ ] `font-display: swap` aplicado no @font-face
- [ ] Fontes não estão em repositório público com kit MyFonts
- [ ] Contraste ok em títulos e texto longo
- [ ] Headings semânticos e foco visível ok

---

## 12) Mudanças futuras (governança)
Qualquer mudança de tipografia deve atualizar:
- este documento
- tokens CSS
- exemplos (PageTitle, KPI, Table)
- screenshots/preview (se houver)
- README (se alterar licenciamento/hosting)

---

### Apêndice A — Exemplo de uso em classes
```css
.page-title { font-family: var(--font-display); }
.article { font-family: var(--font-body); }
.ui-text { font-family: var(--font-ui); }
```

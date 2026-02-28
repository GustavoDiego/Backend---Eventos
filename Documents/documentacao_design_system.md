# Documento Técnico de Design — Design System & Diretrizes Visuais (Versão 1.0)
**Projeto:** Painel do Organizador (Eventos / Participantes / Regras de Check‑in)  
**Objetivo:** Definir um design system completo, **ousado**, **acessível** e **fora do piloto automático**.


> Inspiração principal: Carvalheira (narrativa, eventos, memória/experiência). 

---

## 1) Pesquisa e referências (o que está acontecendo de verdade)
### 1.1 Saindo da estética “lisinha”
Há um movimento claro para **tipografia mais expressiva**, com personalidade, e um retorno de textura/imperfeição como contraponto ao visual polido 

**Diretriz:** usar tipografia como elemento de marca (não só “texto”), e adicionar textura sutil (grão/ruído) de forma **controlada** (sem comprometer legibilidade).

### 1.2 “Perfeição por pixel” é dívida técnica (e também dívida de design)
Design moderno é sobre **intenção e comportamento**, não sobre “3px pra cima”. Isso puxa o time para um design system vivo: componentes com regras de escala, não telas congeladas. 

### 1.3 Tipografia variável: estética + performance
Variable fonts ajudam a manter consistência com mais flexibilidade e podem reduzir a quantidade de arquivos de fonte quando há muitos pesos/estilos. 

### 1.4 Acessibilidade virou requisito de qualidade (WCAG 2.2)
O design system precisa embutir:
- **foco visível** com contraste mínimo (3:1) e área mínima para o indicador 
- **tamanho mínimo de alvo** (24×24 CSS px) para elementos clicáveis 
- navegação e compreensão previsíveis (rotas, headings, feedbacks consistentes) 

---

## 2) DNA visual do produto (princípios de design)
### 2.1 Direção criativa: “Festival editorial, com disciplina de sistema”
Inspirado na comunicação de eventos e memória (Carvalheira), a proposta une:
- **Editorial**: tipografia forte, hierarquia clara, composição com respiro
- **Cultura & energia**: cores vivas, contrastes quentes, detalhes de textura
- **Sistema**: tokens, componentes e estados consistentes (não é “arte” solta) 

### 2.2 Pilares
1) **Clareza primeiro** (painel é ferramenta)  
2) **Ousadia com propósito** (diferenciar sem confundir)  
3) **Acessível por padrão** (WCAG não é “extra”)
4) **Movimento sutil** (microinterações guiam, não distraem)

---

## 3) Inspiração aplicada (Carvalheira como referência de linguagem)
Do site da Carvalheira, capturamos a intenção — **narrativa + eventos + ritmo de scroll + seções marcadas**:
- headlines com força (“criamos memórias histórias”)
- chamadas claras (“próximos eventos”)
- composição orientada a conteúdo e imagem, com “ritmo” de leitura/scroll 

**Tradução para o painel:**
- Dashboard com **bento grid editorial** (módulos com hierarquia e impacto)
- Listas menos “planilha” e mais “cartazes organizados” (cards/tables híbridos)
- Check‑in Rules com **cards‑form** e alertas em banner (estado complexo visível)

---

## 4) Design Tokens (base do sistema)

### 4.1 Paletas (sem fundo preto padrão)
#### Tema principal: **Sunset Paper**
- **Background / Paper:** `#FAF6EF` (fundo “papel quente”)
- **Surface / White:** `#FFFFFF`
- **Ink / Text:** `#1A1A1A`
- **Muted text:** `#5E5E5E`
- **Border:** `#E8E1D6`
- **Primary (coral):** `#FF4D3D`
- **Secondary (royal blue):** `#2D5BFF`
- **Accent (lime):** `#B8F400`
- **Accent 2 (magenta):** `#FF2DAA`
- **Warning:** `#FFB020`
- **Success:** `#14B86A`
- **Danger:** `#E5262A`

> Nota: contraste deve ser validado (textos e focus). O design system assume **checagem WCAG** como parte do workflow. 

#### Tema alternativo (opcional): **Night Market (sem preto puro)**
- Fundo: `#14121C` (berinjela profunda, não “preto #000”)
- Texto: `#F6F2EA`
- Acentos: os mesmos do tema principal

### 4.2 Tipografia (expressiva + legível)
**Estratégia:** 2 famílias
- **Display (títulos):** uma serif/grotesk expressiva (idealmente variável)
- **Text (corpo/UI):** sans altamente legível

**Proposta prática (Google Fonts / variável quando possível):**
- Display: `Fraunces` (serif variável) ou `Space Grotesk`
- Body: `Inter` (variável)  
Variable fonts ajudam em performance/consistência quando há múltiplos pesos. citeturn2search4

#### Escala tipográfica (rem)
- `display-1`: 3.0rem / 1.05
- `display-2`: 2.25rem / 1.1
- `h1`: 1.75rem / 1.2
- `h2`: 1.375rem / 1.25
- `h3`: 1.125rem / 1.3
- `body`: 1.0rem / 1.55
- `small`: 0.875rem / 1.5
- `micro`: 0.75rem / 1.4

### 4.3 Espaçamento (escala 4px)
- `space-1`: 4
- `space-2`: 8
- `space-3`: 12
- `space-4`: 16
- `space-5`: 24
- `space-6`: 32
- `space-7`: 48
- `space-8`: 64

### 4.4 Grid e breakpoints
- Mobile: 4 colunas, gutter 16
- Tablet: 8 colunas, gutter 20
- Desktop: 12 colunas, gutter 24

Breakpoints (px):
- `sm`: 480
- `md`: 768
- `lg`: 1024
- `xl`: 1280
- `2xl`: 1536

### 4.5 Raios e bordas
- `radius-sm`: 10
- `radius-md`: 14
- `radius-lg`: 18
- `radius-xl`: 24
Bordas finas (1px) com contraste suficiente.

### 4.6 Sombra e elevação 
- Elevação é **discreta**, mais “papel sobre papel” do que “float cyber”.
- Preferir sombras suaves e curtas para manter leitura.

### 4.7 Motion (microinterações)
- Duração: 120ms (micro), 200ms (default), 320ms (macro)
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Respeitar `prefers-reduced-motion` (sem animações que “pulem”).

---

## 5) Acessibilidade (regras do sistema)
### 5.1 Foco visível (obrigatório)
- Todo elemento interativo deve ter estado `:focus-visible`
- Indicador de foco com contraste mínimo **3:1** e área mínima conforme WCAG 2.2 
- Focus não pode ficar totalmente oculto por overlays

### 5.2 Alvos clicáveis
- Qualquer alvo (botão, ícone, item de menu) precisa respeitar **24×24 CSS px** 

### 5.3 Contraste e legibilidade
- Texto normal: buscar **>= 4.5:1** sempre que possível (AA)
- Evitar “texto cinza claro” em fundo claro — bonito na screenshot, ruim na vida real.

### 5.4 Formulários
- Labels visíveis (não confiar só em placeholder)
- Mensagem de erro clara e associada ao campo
- Não depender apenas de cor para indicar erro/sucesso

### 5.5 Autenticação acessível
- Evitar fricção desnecessária (ex.: “repetir campo” sem motivo)
- Usar padrões que não travem leitores de tela / teclado citeturn0search0

---

## 6) Componentes (biblioteca do projeto)
> Cada componente deve ter: variantes, tamanhos, estados, regras de conteúdo, acessibilidade.

### 6.1 Layout: AppShell
**Estrutura**
- Sidebar (nav) + Topbar + Content
- Sidebar colapsável em telas pequenas
- Topbar com: título da página, busca (quando aplicável), ações principais

**Estados**
- Desktop: sidebar fixa
- Mobile: sidebar overlay (drawer)

### 6.2 Button
**Variantes**
- `primary` (coral)
- `secondary` (blue)
- `ghost` (sem fundo)
- `danger`
- `gradient` (uso seletivo: CTA principal do fluxo)

**Tamanhos**
- sm (32px), md (40px), lg (48px)

**Estados**
- hover, active, disabled, loading, focus-visible

**A11y**
- área mínima 24×24 citeturn0search0  
- foco visível citeturn0search3

### 6.3 Input / TextField
- label + helper + error
- ícone opcional
- máscara/validação via schema

**Estados**
- default, hover, focus, invalid, disabled

### 6.4 Select / Combobox
- suporte a teclado
- opção de busca quando lista for grande
- menu não pode esconder foco (overlay cuidado) citeturn0search0

### 6.5 Modal
- foco preso dentro (focus trap)
- fechar por ESC
- título obrigatório + botão fechar com aria-label
- ações: primary/secondary

### 6.6 Toast
- sucesso/erro/aviso/info
- auto-dismiss com pausa ao hover
- não usar como único canal de erro crítico

### 6.7 BannerAlert (crítico)
Usado principalmente em **Check‑in Rules**:
- “Nenhuma regra ativa” (bloqueia salvar)
- “Conflito em regras obrigatórias” (bloqueia salvar)
Banner deve ser persistente enquanto inválido.

### 6.8 Table (listagens)
- header fixo opcional
- zebra sutil
- coluna de ações alinhada à direita
- responsivo: vira cards/stack no mobile

### 6.9 Card (editorial)
- usado no dashboard e em “detalhes do evento”
- suporte a “badge” (status)

### 6.10 Chip / Badge
- status: Ativo/Encerrado, Check‑in: Feito/Não feito
- sempre combinar cor + texto (não só cor)

---

## 7) Padrões de páginas (UI patterns)
### 7.1 Login (quebrar a mesmice)
**Layout proposto**
- Lado A: formulário limpo e acessível
- Lado B: bloco editorial com headline + microcopy (marca/propósito) e textura sutil



### 7.2 Dashboard (bento grid)
- Cards principais (métricas) com tipografia forte
- Bloco secundário: próximos eventos / últimas atividades
- CTA visível: “Criar evento”

### 7.3 Listagens (Eventos / Participantes)
- Filtros como “toolbar” (busca + chips de filtro)
- Tabela híbrida: legível no desktop, adaptável no mobile
- Estado vazio com CTA (sem tela morta)

### 7.4 Página de Evento (detalhes)
- Header editorial: nome do evento + status + data/local
- Tabs: “Participantes”, “Regras de Check‑in”, “Configurações” (se houver)

### 7.5 Configuração de Check‑in (o coração do desafio)
**Layout recomendado**
- Coluna principal: cards de regras (cada card = mini-form)
- Coluna lateral (desktop): resumo de validações + botão salvar + histórico/ajuda
- Banner crítico no topo (sempre visível em invalidez)

**Microinterações**
- toggle suave (120–200ms)
- highlight de campo com erro
- “Salvar” desabilitado quando inválido/salvando

---

## 8) Linguagem visual (como inovar sem virar carnaval… ruim)
### 8.1 Tipografia como protagonista
A tendência de tipografia “com emoção” é útil aqui: dá personalidade sem poluir. 

### 8.2 Textura (anti‑AI craft) com limites
- usar grão sutil em backgrounds e seções, não em texto
- nunca sacrificar contraste por “estética” 

### 8.3 Brutalismo “disciplinado” (opcional)
Brutalismo pode ser memorável, mas precisa de guardrails fortes de UX/a11y. 
Use em:
- headlines grandes
- grids assimétricos controlados
- divisores fortes
Evitar:
- navegação confusa
- links que parecem texto normal
- contrastes ruins

---

## 9) Implementação (como materializar no código)
### 9.1 Tokens em CSS variables (exemplo)
```css
:root {
  --bg: #FAF6EF;
  --surface: #FFFFFF;
  --ink: #1A1A1A;
  --muted: #5E5E5E;
  --border: #E8E1D6;

  --primary: #FF4D3D;
  --secondary: #2D5BFF;
  --accent: #B8F400;
  --accent2: #FF2DAA;

  --success: #14B86A;
  --warning: #FFB020;
  --danger: #E5262A;

  --radius-md: 14px;
  --space-4: 16px;
}

:focus-visible {
  outline: 3px solid var(--secondary);
  outline-offset: 2px;
}
```
> O `:focus-visible` precisa ser sempre visível, com contraste mínimo (WCAG 2.2). 

### 9.2 Component contract (props padrão)
- `variant`, `size`, `disabled`, `loading`, `aria-*`
- Estados sempre previsíveis

### 9.3 “Design intent” > “pixel perfect”
- usar escala (tokens) e regras responsivas
- evitar “magic numbers” como solução de layout citeturn3search2

---

## 10) Checklist de design review (rápido e objetivo)
- [ ] Contraste e foco visível ok (WCAG 2.2) 
- [ ] Alvos 24×24 ok
- [ ] Estados loading/erro/vazio implementados
- [ ] Tipografia com hierarquia clara
- [ ] Animações respeitam reduced motion
- [ ] Check‑in Rules tem banner crítico e bloqueios coerentes

---



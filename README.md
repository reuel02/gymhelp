<p align="center">
  <img src="src/assets/logo.svg" alt="GYMHelp Logo" width="180" />
</p>

<h1 align="center">GYMHelp</h1>

<p align="center">
  <strong>Sua plataforma pessoal de treinos, dieta e acompanhamento fitness</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-BaaS-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Screenshots](#-screenshots)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Banco de Dados (Supabase)](#-banco-de-dados-supabase)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Componentes Principais](#-componentes-principais)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

**GYMHelp** é uma aplicação web completa voltada para o gerenciamento de treinos e dieta. A plataforma permite que o usuário organize seus exercícios por dia da semana, planeje suas refeições com controle de macronutrientes, acompanhe o consumo diário de água e monitore suas metas calóricas — tudo em uma interface moderna, responsiva e com dark mode.

O projeto foi construído com foco em **mobile-first**, oferecendo uma experiência nativa tanto em dispositivos móveis (com bottom navigation) quanto em desktop (com sidebar fixa).

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro de usuário com nome, e-mail e senha
- Login com e-mail e senha
- Logout com redirecionamento automático
- Proteção de rotas — redireciona para `/login` caso o usuário não esteja autenticado

### 📊 Dashboard
- **Saudação personalizada** com o nome do usuário e dia atual
- **Perfil rápido** exibindo peso, altura, objetivo e IMC calculado
- **Resumo nutricional do dia** com progresso calórico circular e linear
- **Checklist de refeições** do dia com toggle de conclusão (persiste via `localStorage`)
- **Macros consumidos** (proteína, carboidrato, gordura) das refeições concluídas
- **Consumo de água** com meta personalizada (35ml × peso corporal), botões de +150ml / +250ml / +500ml e desfazer
- **Treino do dia** com lista de exercícios, séries, repetições e volume total
- **Visão semanal** com progresso circular, checklist de treinos por dia e mini mapa da semana
- **Limpeza automática** de dados antigos do `localStorage` (>7 dias)

### 🏋️ Treinos
- CRUD completo de treinos (criar, editar, excluir)
- Organização por **dia da semana**
- Cada treino contém múltiplos **exercícios** com: nome, séries, repetições e carga
- Campo de **observações** por treino
- Visualização em **tabela** e **cards**
- Modais dedicados para criação, edição e confirmação de exclusão

### 🍽️ Dieta
- **Calculadora de TMB** (Taxa Metabólica Basal) usando a fórmula de Mifflin-St Jeor
- Fatores de atividade física: sedentário, leve, moderado, intenso, muito intenso
- **Meta calórica automática** baseada no objetivo (emagrecer: −500kcal, manter, ganhar massa: +500kcal)
- **Persistência da meta calórica** no banco de dados Supabase
- **Painel de macros do dia** com barras de progresso para calorias, proteínas, carboidratos e gorduras
- CRUD completo de **refeições** por dia da semana
- Cada refeição contém múltiplos **alimentos** com: nome, quantidade, calorias, proteína, carboidrato e gordura
- Campo de observações por refeição

### 👤 Perfil
- Edição de nome, peso, altura e objetivo
- Seleção de objetivo via botões interativos (Emagrecer / Manter / Ganhar massa)
- Criação automática do perfil caso não exista
- Os dados de perfil alimentam os cálculos de TMB e meta de água

### 💧 Hidratação
- Controle diário de consumo de água
- Meta calculada automaticamente: **35ml × peso corporal**
- Progresso visual com anel circular + barra linear
- Indicador de "Meta batida!" com animação
- Persistência diária via `localStorage`

---

## 🖼️ Screenshots

> *Adicione screenshots da aplicação aqui para ilustrar as telas principais.*

| Dashboard | Treinos | Dieta |
|-----------|---------|-------|
| ![Dashboard](#) | ![Treinos](#) | ![Dieta](#) |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|---|---|---|
| **React** | 19.x | Biblioteca principal para construção da UI |
| **Vite** | 8.x | Build tool ultrarrápido com HMR |
| **React Router DOM** | 7.x | Roteamento SPA com navegação client-side |
| **Supabase** | 2.x | Backend-as-a-Service (autenticação + banco PostgreSQL) |
| **Tailwind CSS** | 4.x | Framework CSS utility-first |
| **Lucide React** | 1.x | Ícones SVG leves e consistentes |
| **React Icons** | 5.x | Biblioteca de ícones complementar |
| **Radix UI** | 1.x | Primitivos acessíveis para componentes UI |
| **shadcn/ui** | 4.x | Componentes reutilizáveis baseados em Radix + Tailwind |
| **Inter (Google Fonts)** | — | Tipografia moderna importada via CSS |

---

## 🏗️ Arquitetura do Projeto

```
gymhelp/
├── public/                     # Arquivos estáticos
├── src/
│   ├── assets/                 # Logo SVG e favicon
│   │   ├── favicon.ico
│   │   └── logo.svg
│   ├── components/             # Componentes reutilizáveis
│   │   ├── Dieta/
│   │   │   ├── FormTMB.jsx         # Formulário de cálculo TMB
│   │   │   ├── ModalRefeicao.jsx   # Modal para criar/editar refeição
│   │   │   ├── PainelDieta.jsx     # Painel com refeições por dia
│   │   │   └── PainelMacros.jsx    # Painel de macronutrientes
│   │   ├── Treino/
│   │   │   ├── CardTreino.jsx          # Card visual de treino
│   │   │   ├── ModalDeletarTreino.jsx  # Modal de confirmação de exclusão
│   │   │   ├── ModalEdicaoTreino.jsx   # Modal de edição de treino
│   │   │   ├── ModalTreino.jsx         # Modal de criação de treino
│   │   │   └── TabelaTreino.jsx        # Tabela/resumo de treinos
│   │   ├── ui/
│   │   │   └── button.jsx      # Componente base de botão (shadcn)
│   │   ├── Header.jsx          # Header com logo e data
│   │   └── Sidebar.jsx         # Sidebar (desktop) + Bottom Nav (mobile)
│   ├── lib/
│   │   ├── supabase.js         # Cliente Supabase configurado
│   │   └── utils.js            # Utilitários (cn para classes)
│   ├── pages/
│   │   ├── Cadastro.jsx        # Página de cadastro
│   │   ├── Dashboard.jsx       # Dashboard principal
│   │   ├── Dieta.jsx           # Página de dieta e macros
│   │   ├── Login.jsx           # Página de login
│   │   ├── Perfil.jsx          # Página de perfil do usuário
│   │   └── Treino.jsx          # Página de treinos
│   ├── App.jsx                 # Definição de rotas
│   ├── main.jsx                # Ponto de entrada React
│   └── index.css               # Estilos globais + Tailwind config
├── .env                        # Variáveis de ambiente (não versionado)
├── .gitignore
├── components.json             # Configuração do shadcn/ui
├── eslint.config.js            # Configuração do ESLint
├── index.html                  # HTML raiz (SPA)
├── jsconfig.json               # Path aliases (@ → src/)
├── package.json
├── vercel.json                 # Configuração de deploy (rewrites SPA)
└── vite.config.js              # Configuração do Vite + aliases
```

---

## 🗄️ Banco de Dados (Supabase)

O projeto utiliza **Supabase** como backend, aproveitando o **PostgreSQL** gerenciado e o sistema de autenticação integrado.

### Tabelas

#### `usuarios`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` (PK) | ID do usuário (vem do Auth) |
| `nome` | `text` | Nome completo |
| `peso` | `numeric` | Peso em quilogramas |
| `altura` | `numeric` | Altura em centímetros |
| `objetivo` | `text` | `emagrecer` \| `manter` \| `ganhar` |
| `meta_calorica` | `integer` | Meta calórica diária calculada |

#### `treinos`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` (PK) | ID do treino |
| `usuario_id` | `uuid` (FK) | Referência ao usuário |
| `nome` | `text` | Nome do treino (ex: "Treino A - Peito") |
| `dia` | `text` | Dia da semana |
| `exercicios` | `jsonb` | Array de objetos `{ nome, series, repeticoes, carga }` |
| `observacoes` | `text` | Observações opcionais |

#### `refeicoes`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` (PK) | ID da refeição |
| `usuario_id` | `uuid` (FK) | Referência ao usuário |
| `dia` | `text` | Dia da semana |
| `tipo` | `text` | Tipo da refeição (ex: "Café da manhã") |
| `alimentos` | `jsonb` | Array de objetos `{ nome, quantidade, calorias, proteina, carboidrato, gordura }` |
| `observacoes` | `text` | Observações opcionais |

### Autenticação

A autenticação é gerenciada pelo **Supabase Auth** com o método `signUp` / `signInWithPassword`, utilizando **e-mail e senha**. O ID do usuário autenticado é reutilizado como chave primária na tabela `usuarios`.

### Row Level Security (RLS)

O Supabase utiliza **RLS (Row Level Security)** para garantir que cada usuário acesse apenas seus próprios dados. Certifique-se de configurar políticas adequadas nas tabelas `treinos` e `refeicoes` com a condição:

```sql
auth.uid() = usuario_id
```

---

## 📦 Pré-requisitos

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (ou yarn/pnpm)
- Conta no **[Supabase](https://supabase.com)** com projeto criado
- (Opcional) Conta no **[Vercel](https://vercel.com)** para deploy

---

## 🚀 Instalação e Configuração

```bash
# 1. Clone o repositório
git clone git@github.com:reuel02/gymhelp.git
cd gymhelp

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
#    Crie um arquivo .env na raiz do projeto (veja a seção abaixo)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:5173** (porta padrão do Vite).

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-anon-key-aqui
```

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública (anon key) do Supabase |

> ⚠️ **Nunca exponha a `service_role` key no frontend.** Utilize apenas a chave `anon` (pública).

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `dev` | `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `build` | `npm run build` | Gera a build de produção otimizada |
| `preview` | `npm run preview` | Pré-visualiza a build de produção localmente |
| `lint` | `npm run lint` | Executa o ESLint para verificar padrões de código |

---

## 🌐 Deploy

O projeto está configurado para deploy na **Vercel** com rewrite para SPA:

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploy via Vercel CLI

```bash
# Instale a CLI (caso não tenha)
npm i -g vercel

# Faça o deploy
vercel --prod
```

### Deploy via GitHub Integration

1. Conecte o repositório `reuel02/gymhelp` ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Cada push na branch `main` dispara um deploy automático

---

## 🗺️ Rotas da Aplicação

| Rota | Página | Autenticação | Descrição |
|---|---|---|---|
| `/` | `Dashboard` | ✅ Requerida | Painel principal com resumo do dia |
| `/login` | `Login` | ❌ Pública | Tela de login |
| `/cadastro` | `Cadastro` | ❌ Pública | Tela de criação de conta |
| `/treino` | `Treino` | ✅ Requerida | Gerenciamento de treinos |
| `/dieta` | `Dieta` | ✅ Requerida | Gerenciamento de dieta e macros |
| `/perfil` | `Perfil` | ✅ Requerida | Edição do perfil do usuário |

---

## 🧩 Componentes Principais

### Layout
| Componente | Descrição |
|---|---|
| `Header` | Barra superior com logo (mobile) e data atual formatada |
| `Sidebar` | Sidebar fixa no desktop + bottom navigation no mobile com links de navegação e logout |

### Treino
| Componente | Descrição |
|---|---|
| `TabelaTreino` | Tabela resumida dos treinos cadastrados |
| `CardTreino` | Card visual com detalhes do treino |
| `ModalTreino` | Modal para criação de novo treino |
| `ModalEdicaoTreino` | Modal para edição de treino existente |
| `ModalDeletarTreino` | Modal de confirmação de exclusão |

### Dieta
| Componente | Descrição |
|---|---|
| `FormTMB` | Formulário para cálculo da Taxa Metabólica Basal |
| `PainelMacros` | Painel com barras de progresso de macronutrientes |
| `PainelDieta` | Painel de refeições organizadas por dia da semana |
| `ModalRefeicao` | Modal para criar/editar refeição com alimentos |

### UI Base
| Componente | Descrição |
|---|---|
| `button` | Componente base de botão (shadcn/ui com CVA) |

---

## 🎨 Design System

O projeto utiliza um sistema de cores e tokens customizados definidos no `index.css`:

| Token | Valor | Uso |
|---|---|---|
| `--color-fundo` | `#09090b` | Background principal |
| `--color-card` | `#18181b` | Background de cards e sidebar |
| `--color-titulo` | `#fafafa` | Títulos e textos principais |
| `--color-texto` | `#a1a1aa` | Textos secundários |
| `--color-destaque` | `#f59e0b` | Cor de destaque / accent (âmbar) |

**Tipografia:** Inter (Google Fonts) — pesos 400, 500, 600 e 700.

---

## 🧮 Fórmulas Utilizadas

### TMB (Mifflin-St Jeor)
```
Homem:  TMB = 10 × peso(kg) + 6.25 × altura(cm) − 5 × idade − 5 + 5
Mulher: TMB = 10 × peso(kg) + 6.25 × altura(cm) − 5 × idade − 161
```

### GET (Gasto Energético Total)
```
GET = TMB × Fator de Atividade
```

### Meta Calórica
```
Emagrecer:    GET − 500 kcal
Manter peso:  GET
Ganhar massa: GET + 500 kcal
```

### Meta de Água
```
Meta (ml) = Peso (kg) × 35
```

### IMC
```
IMC = Peso (kg) / (Altura (m))²
```

---

## 📱 Responsividade

A aplicação foi desenvolvida com abordagem **mobile-first**:

- **Mobile** (< 1024px): Bottom navigation fixa, layout em coluna única, header com logo
- **Desktop** (≥ 1024px): Sidebar fixa de 256px, conteúdo com margem à esquerda
- **Safe area** para dispositivos com notch (iOS)
- Prevenção de zoom no foco de inputs em iOS (`font-size: 16px`)
- Scrollbar customizada com estilo minimalista

---

## 👨‍💻 Autor

Desenvolvido por **Reuel** — [@reuel02](https://github.com/reuel02)

---

<p align="center">
  Feito com 💪 e ☕ para quem leva o treino a sério.
</p>

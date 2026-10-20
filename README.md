# LEVANTAQUI

> Plataforma digital para consulta e monitorização em tempo real da disponibilidade de Caixas Automáticos (ATMs) e Serviços BIM em Pemba, Moçambique.

---

## 📌 Visão Geral

O **LEVANTAQUI** é uma solução web moderna desenvolvida para resolver uma necessidade crítica do quotidiano: identificar rapidamente quais os ATMs que estão operacionais ("a pagar"), que notas dispensam e qual o estado dos serviços bancários presenciais (Depósitos e Atendimento ao Cliente) nos balcões da cidade de Pemba.

> **Nota Institucional:** Esta plataforma é um projeto de demonstração e protótipo funcional concebido para validação operacional e experiência do utilizador, não constituindo um produto oficial nem diretamente afiliado ao Millennium BIM.

---

## 🎯 Objetivos do Projeto

- **Transparência Imediata:** Permitir aos munícipes consultar o estado dos ATMs antes de se deslocarem às agências.
- **Gestão Descentralizada:** Cada gestor de balcão tem autonomia para gerir exclusivamente os ATMs e serviços da sua própria agência em tempo real.
- **Eficiência e Rigor:** Validação rigorosa de horários operacionais e segregação estrita de dados e autorizações por balcão.

---

## 🚀 Principais Funcionalidades

### 1. Dashboard Público
- **Intro Animada Institucional:** Apresentação em vídeo (`/video/intro.webm`) em ecrã completo com reprodução automática, transição suave de texto e controlo por `sessionStorage` para exibição única por sessão.
- **Visualização Integrada de Balcões:** Apresentação dos balcões da rede de Pemba com estados dos ATMs e serviços essenciais.
- **Painel de Detalhes:** Consulta detalhada de cada balcão, incluindo endereço de referência, lista exata de ATMs com notas disponíveis e horários de funcionamento.
- **Indicador Dinâmico de Levantamentos:** Badge com contagem de ATMs disponíveis ("X a pagar"), assumindo destaque visual negativo na cor `#D1005D` quando 0 ATMs estão a pagar.
- **Atualizações Individuais por Balcão:** O carimbo de "Última atualização" reflete rigorosamente a alteração mais recente ocorrida nos dados daquele balcão específico.
- **Design Totalmente Responsivo:** Otimizado com layouts independentes e refinados para Mobile, Tablet e Desktop.

### 2. Área Administrativa (`/admin`)
- **Autenticação Segura:** Login protegido com identificação do utilizador, validação de senha e seleção de balcão.
- **Autorização por Filial:** Cada gestor autenticado possui permissões estritamente restritas à sua filial de afetação. Qualquer tentativa de manipular recursos de outro balcão é rejeitada pela API (`403 Forbidden`).
- **Gestão de ATMs:** Alteração de estado operacional (Disponível, Indisponível, Em Manutenção).
- **Gestão de Serviços:** Controlo do estado (Aberto / Fechado) dos serviços de Depósitos e Atendimento.
- **Gestão de Horários:** Configuração de horários de abertura e fecho com validação em tempo real no frontend e regras estritas no backend via Zod.

---

## 🏢 Estrutura das Filiais

O sistema contempla as 3 principais filiais da rede em Pemba:

| Balcão | Código Técnico | Localização de Referência | Utilizador Gestor |
| :--- | :---: | :--- | :--- |
| **Alto-Gingone** | `ALTO_GINGONE` | Av. Alberto Chipande, Bairro Alto-Gingone | `admin.alto.gingone` |
| **Cariacó** | `CARIACO` | Estrada Nacional nº 1, Rotunda do Cariacó | `admin.cariaco` |
| **Centro da Cidade** | `CENTRO_CIDADE` | Av. Eduardo Mondlane, Edifício Comercial | `admin.centro.cidade` |

---

## 🛠 Stack Tecnológica

- **Frontend & Framework:** [Next.js](https://nextjs.org/) 16.4.2 (App Router, Turbopack, React 19)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) 5.9.3
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) v4 com tipografia Google Sans
- **Ícones:** [Lucide React](https://lucide.dev/)
- **ORM & Base de Dados:** [Prisma](https://www.prisma.io/) 7.10.1 com [PostgreSQL](https://www.postgresql.org/)
- **Criptografia & Sessões:** Argon2 para hashing de senhas, cookies seguros com atributos `httpOnly`, `sameSite=lax` e sessões persistidas em base de dados
- **Validação de Schemas:** [Zod](https://zod.dev/) para validação robusta de payloads na API e regras de negócio

---

## ⚙ Regras de Negócio e Validação de Horários

A API impõe validações obrigatórias para os horários de Depósitos e Atendimento:

- **Segunda a Sexta-feira:**
  - Abertura: entre as `07:00` e as `16:00`
  - Fecho: entre as `07:00` e as `16:00`
  - Hora de fecho obrigatoriamente posterior à hora de abertura.
- **Sábado:**
  - Abertura: entre as `07:00` e as `12:00`
  - Fecho: entre as `07:00` e as `12:00`
  - Hora de fecho obrigatoriamente posterior à hora de abertura.
- Qualquer submissão fora destes limites ou com horários invertidos é rejeitada pelo backend com HTTP `400 Bad Request`.

---

## 📂 Estrutura do Projeto

```text
levantaqui/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx   # Painel administrativo protegido
│   │   ├── login/page.tsx       # Formulário de autenticação
│   │   └── page.tsx             # Redirecionamento de conveniência
│   ├── api/
│   │   ├── admin/               # Endpoints autenticados (ATMs, Serviços, Horários)
│   │   ├── auth/                # Endpoints de autenticação (login, logout, me)
│   │   └── filiais/             # Endpoints públicos de balcões e estados
│   ├── layout.tsx               # Root layout com Google Sans e meta tags
│   └── page.tsx                 # Página principal pública com intro animada
├── components/
│   ├── admin/                   # Componentes de gestão administrativa
│   ├── dashboard/               # Componentes públicos (Cards, Sidebar, Detalhes)
│   └── intro/                   # Componente de Intro animada fullscreen
├── prisma/
│   ├── migrations/              # Histórico de migrações do PostgreSQL
│   ├── schema.prisma            # Modelação da base de dados relacional
│   └── seed.ts                  # Seed idempotente com filiais, ATMs e utilizadores
├── public/
│   ├── imgs/                    # Identidade visual e logotipo
│   └── video/
│       └── intro.webm           # Vídeo oficial de abertura
├── types/                       # Interfaces e tipos TypeScript centrais
└── .env.example                 # Exemplo de configuração de ambiente
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** v20+ ou v24+
- **npm** v10+
- **PostgreSQL** v16+ (instância ativa e base de dados `levantaqui` criada)

### 1. Clonar o repositório
```bash
git clone https://github.com/stephen-wtx/levantaqui.git
cd levantaqui
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie o ficheiro `.env` na raiz do projeto com base no `.env.example`:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/levantaqui?schema=public"
SEED_DEFAULT_PASSWORD="SuaSenhaPadraoParaDesenvolvimento"
```

### 4. Preparar a Base de Dados (Prisma)
```bash
# Validação do schema
npx prisma validate

# Executar as migrações existentes
npx prisma migrate deploy

# Popular os dados iniciais
npm run seed
```

### 5. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Aceda a [http://localhost:3000](http://localhost:3000) no seu navegador.

### 6. Build de Produção
Para validar e compilar a aplicação para produção:
```bash
npm run build
npm run start
```

---

## 🔒 Segurança e Boas Práticas

- **Segredos Protegidos:** O ficheiro `.env` está estritamente excluído do controlo de versões (`.gitignore`).
- **Autenticação Segura:** Senhas protegidas com Argon2 (resistente a ataques de força bruta e GPU).
- **Cookies de Sessão:** Cookie `httpOnly`, `sameSite=lax` e flag `secure` ativa em ambiente de produção.
- **Proteção de Dados Sensíveis:** As rotas públicas (`/api/filiais`) jamais expõem hashes de senha, tokens de sessão ou dados operacionais privados.

---

## 📄 Licença

Este projeto é desenvolvido para fins de demonstração técnica e prototipagem operacional. Todos os direitos reservados.

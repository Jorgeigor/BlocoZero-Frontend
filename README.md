# 🏗️ BlocoZero - Frontend

O **BlocoZero** é uma plataforma SaaS desenvolvida para a gestão civil, otimizando o acompanhamento de obras, cronogramas, estoques e relatórios de progresso físico e financeiro. Este repositório contém o código fonte da interface do usuário (Frontend).

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=flat-square)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?logo=tailwind-css&style=flat-square)

## 🚀 Funcionalidades

O sistema utiliza controle de acesso baseado em funções (RBAC), oferecendo experiências distintas para **Gestores** e **Empreiteiros**.

### 👷 Perfil: Empreiteiro (Tender)
- **Início:** Visão geral da obra alocada.
- **Cronograma Físico:** Acompanhamento visual das etapas da obra.
- **Estoque:** Controle de entrada e saída de materiais.
- **Relatórios:** Envio de atualizações de progresso com upload de fotos.

### 👔 Perfil: Gestor (Manager)
- **Gerir Obras:** Painel administrativo para cadastro de múltiplas obras.
- **Validação de Relatórios:** - Interface para Aprovar ou Recusar relatórios enviados pelos empreiteiros.
  - Exigência de justificativa (`managerRejectionReason`) para recusas.
- **Cronograma & Orçamento:** Visão macro do andamento físico e financeiro.
- **Estoque:** Monitoramento global de insumos.
- **Relatórios Avançados:**
  - **Financeiro:** Análise de custos.
  - **Físico:** Dashboards de evolução e validação de etapas.

## 🛠️ Tecnologias

* **Core:** [React](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Roteamento:** [React Router DOM](https://reactrouter.com/)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Ícones:** [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome)
* **Data/Hora:** Manipulação nativa (`Intl`) ou date-fns.

## 📦 Pré-requisitos e Instalação

Você precisará do [Node.js](https://nodejs.org/) e [Git] instalados em sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/BlocoZero-Frontend.git](https://github.com/seu-usuario/BlocoZero-Frontend.git)
    cd BlocoZeroWeb
    cd web-ds
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto para configurar a conexão com o Backend:
    ```env
    VITE_API_URL=http://localhost:8080
    ```

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```
    O acesso geralmente será em `http://localhost:5173`.

## 📂 Estrutura do Projeto

```text
src/
├── assets/          # Imagens estáticas (Logos, ícones customizados)
├── components/      # Componentes globais
│   ├── Sidebar.tsx  # Navegação lateral dinâmica (com submenus)
│   ├── ModalRelatorio.tsx # Modal de detalhe e validação
│   └── ...
├── pages/           # Telas da aplicação
│   ├── TabelaRelatorios.tsx # Lógica de listagem e aprovação
│   ├── VisuRelatorios.tsx
│   └── ...
├── services/        # Configuração da API (Axios)
├── hooks/           # Hooks (useAuth, useFetch, etc)
├── routes/          # Definição de rotas (AppRoutes)
└── App.tsx          # Componente raiz
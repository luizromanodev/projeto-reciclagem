# EcoColeta: Plataforma Inteligente para Gestão de Resíduos Urbanos

## Visão Geral do Projeto

A **EcoColeta** é uma plataforma inovadora desenvolvida para otimizar a gestão de resíduos sólidos urbanos, promovendo a reciclagem eficiente e contribuindo para a construção de **Cidades e Comunidades Sustentáveis**, alinhada com o **Objetivo de Desenvolvimento Sustentável (ODS) 11 da ONU**.

Nosso objetivo principal é conectar cidadãos, empresas e cooperativas de reciclagem, facilitando o descarte adequado de materiais recicláveis, reduzindo o impacto ambiental do lixo urbano e gerando benefícios sociais e econômicos para toda a comunidade.

## Problemas Abordados

- **Descarte Irregular:** Reduz a poluição ambiental e a sobrecarga de aterros.
- **Ineficiência na Coleta:** Otimiza rotas e processos para cooperativas.
- **Baixa Conscientização:** Incentiva a participação e educação ambiental.
- **Dificuldade de Acesso:** Simplifica o agendamento de coletas e a localização de pontos.
- **Subaproveitamento de Materiais:** Promove a reintegração de resíduos na economia circular.
- **Exclusão Social:** Valoriza e gera renda para catadores e cooperativas.

## Como Funciona

A EcoColeta opera em um fluxo colaborativo:

1.  **Cadastro:** Cidadãos e Empresas se cadastram na plataforma para solicitar coletas. Cooperativas de Reciclagem também se cadastram para gerenciar e executar as coletas.
2.  **Agendamento:** Usuários (Cidadãos/Empresas) agendam coletas de seus materiais recicláveis, informando tipo, quantidade e localização.
3.  **Visualização e Gerenciamento:** Cooperativas visualizam as solicitações de coleta agendadas, planejam suas rotas e atribuem tarefas.
4.  **Coleta e Atualização de Status:** Os materiais são coletados, e as cooperativas atualizam o status da coleta (Em Rota, Concluída, Cancelada) e registram o peso dos materiais.
5.  **Benefícios:** O processo gera dados estratégicos para políticas públicas, aumenta a renda dos catadores e promove a economia circular e a conscientização ambiental.

## Tecnologias Utilizadas

O projeto é construído como uma aplicação Full Stack, utilizando tecnologias modernas e robustas:

### Backend (Servidor - API RESTful)

- **Linguagem:** `Node.js`
- **Framework Web:** `Express.js`
- **Linguagem de Tipagem:** `TypeScript`
- **ORM (Object-Relational Mapper):** `Prisma`
- **Banco de Dados:** `PostgreSQL`
- **Autenticação:** JSON Web Tokens (JWT) com `bcryptjs` para hash de senhas.
- **Validação de Dados:** `Zod`
- **Utilitários:** `dotenv`, `cors`, `ts-node-dev`, `tsconfig-paths`.

### Frontend (Interface do Usuário)

- **Framework/Biblioteca:** `React.js`
- **Linguagem de Tipagem:** `TypeScript (TSX)`
- **Gerenciamento de Estado:** React Context API (para autenticação)
- **Roteamento:** `react-router-dom`
- **Comunicação com API:** `axios`
- **Estilização:** `Bootstrap 5` (para componentes de UI e responsividade)
- **Ambiente de Desenvolvimento/Build:** `Vite`
- **Modais:** `react-modal`

### Estrutura do Projeto

O projeto é organizado como um **monorepo leve**, com dois diretórios principais na raiz: `backend` e `frontend`.

`/projeto-reciclagem/`
`├── backend/ # Código-fonte e configurações do servidor`
`├── frontend/ # Código-fonte e configurações da interface do usuário`
`├── .gitignore # Regras para ignorar arquivos no controle de versão`
`└── README.md # Este arquivo de documentação`
`└── diagrama.jpeg # Diagrama de caso de uso do projeto`

## Como Configurar e Rodar o Projeto

Siga os passos abaixo para configurar e iniciar o backend e o frontend da aplicação.

### Pré-requisitos

- `Node.js` (versão LTS recomendada) e `npm` instalados em sua máquina.
- `PostgreSQL` instalado e um servidor de banco de dados rodando (ex: porta padrão `5432`).
- Um cliente PostgreSQL (ex: `pgAdmin`) para gerenciar o banco de dados.

### Passos para o Backend

1.  **Navegue até o diretório `backend`:**

    ```bash
    cd backend
    ```

2.  **Crie o arquivo `.env`:**
    Na raiz do diretório `backend`, crie um arquivo chamado `.env` e adicione as seguintes variáveis. Substitua `sua_senha` pela senha do seu usuário `postgres` e `sua_chave_secreta_jwt` por uma string longa e aleatória (você pode gerar uma com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

    ```env
    DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/reciclagem_db?schema=public"
    JWT_SECRET="sua_chave_secreta_jwt_bem_forte_e_longa_aqui"
    ```

3.  **Crie o banco de dados no PostgreSQL:**

    - Abra seu cliente `pgAdmin`.
    - Conecte-se ao seu servidor PostgreSQL.
    - Crie um novo banco de dados com o nome `reciclagem_db`.

4.  **Instale as dependências:**

    ```bash
    npm install
    ```

5.  **Popule o banco de dados com o esquema do Prisma:**
    Isso criará todas as tabelas necessárias (`User`, `Material`, `Collection`, etc.).

    ```bash
    npx prisma db push
    ```

6.  **Inicie o servidor backend:**
    ```bash
    npm run dev
    ```
    O servidor deve iniciar e mostrar uma mensagem como `🚀 Servidor rodando em http://localhost:3333`. Mantenha este terminal aberto.

### Passos para o Frontend

1.  **Navegue até o diretório `frontend` (em um NOVO terminal):**

    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento do frontend:**

    ```bash
    npm run dev
    ```

    O frontend deve iniciar e mostrar uma mensagem como `➜ Local: http://localhost:5173/`. Mantenha este terminal aberto.

4.  **Acesse a aplicação no navegador:**
    Abra seu navegador web e vá para o endereço indicado (ex: `http://localhost:5173/`).

## Como Usar e Testar a Aplicação

Com ambos os servidores (backend e frontend) rodando, você pode interagir com a aplicação:

1.  **Registro de Usuários:**

    - Na página inicial, clique em "Acessar Plataforma" e depois na opção "Cadastre-se".
    - **Crie um usuário Cidadão:** `Nome: Cidadão Teste, Email: cidadao@teste.com, Senha: 123456, Tipo: Cidadão`.
    - **Crie um usuário Cooperativa:** `Nome: Coop Local, Email: coop@teste.com, Senha: 123456, Tipo: Cooperativa`. (Este é crucial para as próximas etapas).

2.  **Pré-popular Materiais (Ação da Cooperativa - Uma Única Vez!):**

    - Faça **Login** com a conta da Cooperativa que você criou (`coop@teste.com`).
    - **Abra o Postman/Insomnia.**
    - Crie uma requisição `POST` para `http://localhost:3333/api/collections/seed-materials`.
    - No cabeçalho `Authorization`, adicione `Bearer SEU_TOKEN_DA_COOPERATIVA`. (O token pode ser copiado da resposta do login da cooperativa no frontend, ou do localStorage do navegador).
    - Corpo da requisição: `{}` (vazio).
    - Envie. Você deve receber `200 OK`. Isso criará os tipos de materiais no banco de dados.

3.  **Agendamento de Coleta (como Cidadão):**

    - Faça **Logout** da Cooperativa e faça **Login** com a conta do Cidadão (`cidadao@teste.com`).
    - Na página inicial, clique em "Agendar Coleta" (ou navegue para `/schedule`).
    - Preencha o formulário (o dropdown de materiais deve estar populado agora).
    - Confirme o agendamento.

4.  **Visualização e Gerenciamento na Dashboard (como Cooperativa):**
    - Faça **Logout** do Cidadão e faça **Login** com a conta da Cooperativa.
    - Navegue para "Dashboard".
    - Você deve ver a coleta agendada pelo cidadão. Altere o status para "Em Rota" e depois para "Concluída" (solicitará o peso).

## Manutenção Evolutiva / Funcionalidades Futuras

Conforme a proposta do projeto, algumas funcionalidades para o futuro incluem:

- **Gamificação e Recompensas:** Implementação de um sistema de pontos, níveis e badges para incentivar a participação dos usuários na reciclagem.
- **Mapa Interativo Avançado:** Utilização de bibliotecas como Leaflet/React-Leaflet para um mapa mais dinâmico e real, exibindo pontos de coleta e rotas.
- **Relatórios para Gestores:** Geração de relatórios automáticos de dados de reciclagem para apoiar políticas públicas.
- **Notificações:** Sistema de notificação para usuários e cooperativas sobre o status das coletas.

## Autores

- **Luiz Romano** (23094789-2) - Desenvolvedor Fullstack
- **Victor De Oliveira** (23105627-2) - Desenvolvedor Frontend
- **Gustavo Alves** (23202882-2) - Desenvolvedor Frontend

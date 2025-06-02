# Lokar Veículos - Sistema de Catálogo e Locação

Um sistema completo para catálogo e locação de veículos, desenvolvido com React, Node.js, Express e PostgreSQL.

## Funcionalidades

- **Área Pública:**
  - Catálogo de veículos com filtros e busca
  - Página de detalhes de cada veículo
  - Design responsivo para todos os dispositivos

- **Área Administrativa:**
  - Login seguro com JWT
  - Dashboard com estatísticas
  - Gerenciamento completo de veículos (CRUD)
  - Interface intuitiva e eficiente

## Tecnologias Utilizadas

- **Frontend:**
  - React
  - React Router
  - Tailwind CSS
  - Lucide React (ícones)
  - React Hook Form
  - React Hot Toast

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - JWT para autenticação

## Configuração do Projeto

### Pré-requisitos

- Node.js (v14+)
- PostgreSQL

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/lokar-veiculos.git
   cd lokar-veiculos
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações de banco de dados e credenciais admin.

4. Inicie o servidor backend:
   ```bash
   npm run server
   ```

5. Em outro terminal, inicie o frontend:
   ```bash
   npm run dev
   ```

6. Para iniciar ambos simultaneamente:
   ```bash
   npm run dev:full
   ```

## Estrutura do Projeto

```
/
├── src/                 # Código do frontend (React)
│   ├── components/      # Componentes reutilizáveis
│   ├── context/         # Contextos React (autenticação)
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços API
│   ├── types/           # Definições de tipos TypeScript
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Ponto de entrada
│
├── server/              # Código do backend (Node.js/Express)
│   └── server.js        # Servidor Express com rotas API
│
└── public/              # Arquivos estáticos
```

## Acesso à Área Administrativa

Use as credenciais definidas no arquivo `.env`:

- **Email padrão:** admin@example.com
- **Senha padrão:** admin123

## Licença

Este projeto está licenciado sob a Licença MIT.
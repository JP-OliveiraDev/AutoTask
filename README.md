# AutoTask AI - Propostas Comerciais com IA para E-commerce

Bem-vindo ao **AutoTask!**

Este é um projeto completo de automação inteligente para geração de propostas comerciais em PDF e respostas rápidas com IA, pensado especialmente para quem vende online em marketplaces ou e-commerce próprio.

## 🚀 Funcionalidades

✅ Criação de propostas comerciais personalizadas com IA.

✅ Geração de arquivos PDF com layout estilizado, capa e dados completos.

✅ Envio da proposta diretamente por e-mail (com personalização do remetente).

✅ Preview da proposta em PDF antes do envio.

✅ Layouts personalizáveis: Comercial, Criativo e Minimalista.

✅ Histórico de propostas salvas com autenticação JWT, listagem por usuário e acesso rápido às versões anteriores.

✅ Gerador de respostas rápidas com IA para marketplaces e redes sociais (como Mercado Livre, Shopee, Instagram).

✅ Sugestões automáticas para dúvidas frequentes, negociações e objeções de clientes.

## 🛠️ Tecnologias Utilizadas
🔹 React.js → Interface moderna e responsiva (frontend).

🔹 Node.js + Express → Backend leve e escalável.

🔹 PDFKit → Geração dos arquivos PDF.

🔹 Gemini API → IA para criação de propostas automáticas.

🔹 MongoDB → Armazenamento das propostas e histórico.

🔹 Framer Motion → Animações fluidas na interface.

🔹 Tailwind CSS → Estilização rápida e eficiente.

🔹 JWT (JSON Web Token) → Autenticação segura.

## 📦 Dependências Principais
```
"dependencies": {
  "axios": "^1.6.7",
  "express": "^4.18.2",
  "framer-motion": "^11.0.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.3.1",
  "multer": "^1.4.5",
  "nodemailer": "^6.9.8",
  "pdfkit": "^0.13.0",
  "react": "^18.2.0",
  "react-hook-form": "^7.49.2",
  "react-router-dom": "^6.22.3",
  "tailwindcss": "^3.4.1"
}
```

## ▶️ Como Executar o Projeto

### 📌 Pré-requisitos
• Node.js (v16 ou superior)

• MongoDB local ou em nuvem (ex: MongoDB Atlas)

## 🖥️ Passos para rodar localmente

**1️⃣ Clone o repositório**
```
git clone https://github.com/seu-usuario/autotask-ai.git
```
**2️⃣ Acesse o diretório do projeto**
```
cd autotask-ai
```
**3️⃣ Instale as dependências do backend**
```
cd server
npm install
```
**4️⃣ Instale as dependências do frontend**
```
cd ../frontend
npm install
```
**5️⃣ Crie um arquivo .env no diretório /server com as variáveis:**
```
PORT=5000
MONGO_URI=sua_string_de_conexao_mongodb
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_aplicativo
JWT_SECRET=sua_chave_secreta
```
**6️⃣ Execute o backend**
```
cd server
npm run dev
```
**7️⃣ Execute o frontend**
```
cd ../frontend
npm run dev
```
**8️⃣ Acesse no navegador**
```
http://localhost:5173
```

## 💡 Exemplo de Geração de Proposta

**Ao preencher os campos como:**

- Nome do cliente

- Produto

- Preço Unitário

- Formas de pagamento

- Parcelamento

- Benefícios exclusivos

- Observações finais

**A IA monta automaticamente um conteúdo persuasivo e formal, pronto para enviar ao seu cliente!**

## 🧠 IA em Ação

Basta descrever o que o cliente precisa (ou usar um prompt genérico) e o AutoTask AI cria uma proposta personalizada com:

✔️ Título

✔️ Introdução profissional

✔️ Seções de produto, preço, prazo, garantia

✔️ Benefícios e diferenciais

✔️ Observações finais e termos

### 🤝 Contribuição

Contribuições são bem-vindas! Se você encontrar bugs, tiver sugestões ou melhorias, fique à vontade para abrir uma issue ou enviar um pull request.

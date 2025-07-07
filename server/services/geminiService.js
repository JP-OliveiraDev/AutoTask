const fetch = require('node-fetch');

// Gerador de Proposta
async function interpretPrompt(prompt) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `
Você é um especialista em propostas comerciais para e-commerce e marketplaces.

Sua tarefa é transformar os dados abaixo em um JSON completo e pronto para gerar um PDF profissional de proposta comercial.

A proposta deve ser clara, direta, persuasiva e focada em conversão.

---

## DADOS FORNECIDOS PELO USUÁRIO

Cliente/Empresa: [cliente]
Data da Proposta: [dataProposta]
Número da Proposta: [numeroProposta]
Tipo de Proposta: [tipoProposta]
Produto/Serviço: [produto]
Quantidade Solicitada: [quantidade]
Quantidade Mínima de Compra: [quantidadeMinima]
Preço Unitário: [precoUnitario]
Preço Total: [precoTotal]
Validade da Proposta: [validade]
Pagamento: [pagamento]
Prazo de Entrega: [prazoEntrega]
Garantia: [garantia]
Benefícios Exclusivos: [beneficios]
Observações Finais: [observacoesFinais]
Termos e Condições: [termos]
Detalhes Adicionais: [detalhesSolicitacao]

---

## ESTRUTURA DE SAÍDA (JSON OBRIGATÓRIO)

{
  "cliente": "[cliente]",
  "produto": "[produto]",
  "descricao_produto": "[beneficios ou detalhesSolicitacao]",
  "quantidade_minima": "[quantidadeMinima]",
  "resumo_comercial": {
    "preco_unitario": "[precoUnitario]",
    "total_itens": "[precoTotal]",
    "valor_final": "[precoTotal]",
    "forma_pagamento": "[pagamento]",
    "prazo_entrega": "[prazoEntrega]",
    "validade_proposta": "[validade]"
  },
  "garantia": "[garantia]",
  "termos_condicoes": "[termos]",
  "observacoes_finais": "[observacoesFinais]",
  "chamada_acao": "Aproveite essa condição especial e finalize seu pedido ainda hoje!"
}

---

## INSTRUÇÕES:
1. Preencha todos os campos com os dados fornecidos.
2. Nunca deixe campos obrigatórios em branco. Use "Sob demanda" ou "Não informado" se necessário.
3. Responda apenas com o JSON puro. Sem explicações, sem markdown.
4. Utilize linguagem comercial e objetiva.
`.trim()
          }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro da API Gemini:", errorText);
    throw new Error("Erro ao gerar conteúdo com Gemini");
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const jsonMatch = text.match(/```json([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
  const rawJson = jsonMatch ? jsonMatch[1].trim() : text;

  return JSON.parse(rawJson);
}

// Gerador de resposta rápidas
async function generateQuickReplyContent(customerQuestion, category = '', tone = '') {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const promptText = `
Você é um especialista em atendimento ao cliente de marketplace.

Gere uma resposta rápida, profissional e educada para a pergunta de um cliente.

Pergunta:
"${customerQuestion}"

Categoria da pergunta: ${category || 'não informada'}
Tom de voz: ${tone || 'neutro'}

Regras:
- Seja objetivo e direto.
- Não invente políticas da empresa.
- Não adicione cabeçalhos, nem explicações, apenas a resposta direta.
`.trim();

  const body = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro Gemini (QuickReply):', errorText);
    throw new Error('Erro ao gerar resposta rápida');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta.';
}

module.exports = {
  interpretPrompt,
  generateQuickReplyContent,
};

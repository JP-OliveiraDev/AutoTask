const { interpretPrompt, generateQuickReplyContent } = require('../services/geminiService');
const { generateProposalPDF } = require('../services/pdfService');
const { sendProposalEmail } = require('../services/emailService');
const Task = require('../models/taskModel');

async function handlePrompt(req, res) {
  try {
    const {
      cliente = '',
      dataProposta = '',
      numeroProposta = '',
      tipoProposta = '',
      produto = '',
      quantidade = '',
      quantidadeMinima = '',
      precoUnitario = '',
      precoTotal = '',
      validade = '',
      pagamento = '',
      prazoEntrega = '',
      garantia = '',
      detalhesSolicitacao = '',
      beneficios = '',
      observacoesFinais = '',
      termos = '',
      layout = 'comercial',
      enviarEmail = false,
      email = '',
      parcelamento = '',
      formasPagamento = [].concat(req.body.formasPagamento || [])
    } = req.body;

    const prompt = detalhesSolicitacao || "Gerar proposta comercial personalizada.";
    const baseUrl = process.env.BASE_URL;

    const result = await interpretPrompt(prompt);

    const normalizeCurrency = (val) =>
      val?.toString().replace(/[^\d,]/g, '').replace(',', '.') || '';

    const precoUnitarioFormatado = `R$ ${normalizeCurrency(precoUnitario)}`;
    const precoTotalFormatado = `R$ ${normalizeCurrency(precoTotal)}`;

    // Campos principais
    result.cliente = cliente;
    result.data_proposta = dataProposta;
    result.numero_proposta = numeroProposta;
    result.tipo_proposta = tipoProposta;
    result.produto = produto;
    result.quantidade = quantidade;
    result.quantidade_minima = quantidadeMinima;
    result.garantia = garantia;
    result.detalhes_solicitacao = detalhesSolicitacao;
    result.beneficios_exclusivos = beneficios;
    result.observacoes_finais = observacoesFinais;
    result.termos_condicoes = termos;

    result.resumo_comercial = {
      ...result.resumo_comercial,
      preco_unitario: precoUnitarioFormatado,
      valor_final: precoTotalFormatado,
      forma_pagamento: Array.isArray(formasPagamento) ? formasPagamento.join(", ") : formasPagamento || '',
      parcelamento,
      prazo_entrega: prazoEntrega,
      validade_proposta: validade
    };

    const logoPath = req.file ? req.file.path : null;

    const { filePath, fileName } = await generateProposalPDF(
      result,
      layout,
      precoTotalFormatado,
      validade,
      termos,
      logoPath
    );

    if (enviarEmail && email) {
      await sendProposalEmail({
        to: email,
        fromEmail: req.body.emailRemetente,
        subject: 'Sua Proposta Comercial',
        body: `Olá ${cliente || 'cliente'}, segue em anexo a sua proposta.`,
        attachmentPath: filePath,
        attachmentName: fileName
      });
    }

    await Task.create({
      prompt,
      plano: result,
      layout,
      pdfUrl: `/pdfs/${fileName}`,
      emailEnviado: enviarEmail,
      emailCliente: email,
      cliente,
      dataProposta,
      numeroProposta,
      tipoProposta,
      produto,
      quantidade,
      quantidadeMinima,
      precoUnitario: precoUnitarioFormatado,
      precoTotal: precoTotalFormatado,
      validade,
      pagamento,
      prazoEntrega,
      garantia,
      parcelamento,
      formasPagamento,
      detalhesSolicitacao,
      beneficios,
      observacoesFinais,
      termos,
      logoPath
    });

    res.status(200).json({
      message: "PDF gerado com sucesso.",
      plano: result,
      pdf: {
        name: fileName,
        url: `${baseUrl}/pdfs/${fileName}`
      }
    });

  } catch (error) {
    console.error("Erro ao processar a proposta:", error);
    res.status(500).json({ error: 'Erro interno ao processar a proposta.' });
  }
}

// Respostas rápidas
async function generateQuickReply(req, res) {
  try {
    const { customerQuestion, category = '', tone = '' } = req.body;

    if (!customerQuestion) {
      return res.status(400).json({ error: 'A pergunta do cliente é obrigatória.' });
    }

    const reply = await generateQuickReplyContent(customerQuestion, category, tone);

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Erro ao gerar resposta rápida:', error);
    res.status(500).json({ error: 'Erro ao gerar resposta rápida.' });
  }
}

// Histórico de tarefas
async function getTasks(req, res) {
  try {
    const tasks = await Task.find().sort({ dataExecucao: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Erro ao buscar histórico de tarefas:", error);
    res.status(500).json({ error: 'Erro ao buscar histórico de tarefas.' });
  }
}

// Buscar tarefa por ID
async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Erro ao buscar tarefa por ID:", error);
    res.status(500).json({ error: 'Erro ao buscar tarefa.' });
  }
}

// Deletar tarefa
async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Proposta não encontrada.' });
    }
    res.status(200).json({ message: 'Proposta excluída com sucesso!' });
  } catch (error) {
    console.error("Erro ao excluir proposta:", error);
    res.status(500).json({ error: 'Erro ao excluir a proposta.' });
  }
}

module.exports = { handlePrompt, getTasks, getTaskById, generateQuickReply, deleteTask };

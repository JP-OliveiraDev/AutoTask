const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  plano: { type: Object },
  cliente: { type: String },
  dataProposta: { type: String },
  numeroProposta: { type: String },
  tipoProposta: { type: String },
  produto: { type: String },
  quantidade: { type: String },
  quantidadeMinima: { type: String },
  precoUnitario: { type: String },
  precoTotal: { type: String },
  validade: { type: String },
  pagamento: { type: String },
  prazoEntrega: { type: String },
  garantia: { type: String },
  detalhesSolicitacao: { type: String },
  beneficios: { type: String },
  observacoesFinais: { type: String },
  termos: { type: String },
  layout: { type: String, default: 'comercial' },
  logoPath: { type: String },
  pdfUrl: { type: String },
  emailEnviado: { type: Boolean, default: false },
  emailCliente: { type: String },
  dataExecucao: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

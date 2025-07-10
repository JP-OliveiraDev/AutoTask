import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  FileText,
  MailCheck,
  Info,
  MessageSquareText,
  ScrollText,
  BadgeCheck,
  FileSignature,
  Store,
  Layers,
  Calendar,
  DollarSign,
  PackageCheck,
  ThumbsUp,
} from "lucide-react";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        console.error("Erro ao buscar tarefa:", error);
      }
    }

    fetchTask();
  }, [id]);

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isQuickReply = !!task.plano?.reply;

  const InfoLine = ({ label, value, icon }) => (
    value && (
      <p className="flex items-start gap-2 text-white/90 text-sm">
        {icon} <span><strong>{label}:</strong> {value}</span>
      </p>
    )
  );

  const baixarPdf = async () => {
      const response = await fetch(task.pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = task.pdfUrl.split('/').pop();
      a.click();
      window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl text-white max-w-3xl mx-auto space-y-6">
      {/* Voltar */}
      <Link
        to="/history"
        className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition"
      >
        <ArrowLeft size={18} /> Voltar ao histórico
      </Link>

      {/* Título */}
      <h2 className="text-3xl font-bold">
        {isQuickReply ? "Resposta Rápida ao Cliente" : "Detalhes da Proposta Comercial"}
      </h2>

      {/* Seção: Tipo e Cliente */}
      <div className="space-y-2">
        <InfoLine label="Tipo de Tarefa" value={isQuickReply ? "Resposta Rápida" : "Proposta em PDF"} icon={<Info size={16} />} />
        <InfoLine label="Cliente" value={task.cliente} icon={<Store size={16} />} />
        <InfoLine label="Layout Escolhido" value={task.layout} icon={<Layers size={16} />} />
        <InfoLine label="Criado em" value={new Date(task.createdAt).toLocaleString("pt-BR")} icon={<Calendar size={16} />} />
        {task.emailEnviado && (
          <p className="flex items-center gap-2 text-green-400 text-sm">
            <MailCheck size={16} /> E-mail enviado ao cliente
          </p>
        )}
      </div>

      {/* Seção: Produto / Pedido */}
      {!isQuickReply && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ScrollText size={18} /> Produto / Pedido
          </h3>
          <div className="space-y-1 text-sm text-white/80">
            <InfoLine label="Produto ou Serviço" value={task.produto} />
            <InfoLine label="Tipo de Proposta" value={task.tipoProposta} />
            <InfoLine label="Quantidade Solicitada" value={task.quantidade} />
            <InfoLine label="Qtd. Mínima de Compra" value={task.quantidadeMinima} />
            <InfoLine label="Preço Unitário" value={`${task.precoUnitario}`} icon={<DollarSign size={16} />} />
            <InfoLine label="Preço Total" value={`${task.precoTotal}`} icon={<BadgeCheck size={16} />} />
          </div>
        </div>
      )}

      {/* Seção: Condições Comerciais */}
      {!isQuickReply && (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileSignature size={18} /> Condições Comerciais
          </h3>
          <div className="space-y-1 text-sm text-white/80">
            <InfoLine label="Validade da Proposta" value={task.validade} />
            <InfoLine label="Pagamento" value={task.pagamento} />
            <InfoLine label="Prazo de Entrega" value={task.prazoEntrega} />
            <InfoLine label="Garantia" value={task.garantia} />
          </div>
        </div>
      )}

      {/* Seção: Diferenciais */}
      {!isQuickReply && (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ThumbsUp size={18} /> Benefícios e Observações
          </h3>
          <div className="space-y-1 text-sm text-white/80">
            <InfoLine label="Benefícios Exclusivos" value={task.beneficios} />
            <InfoLine label="Observações Finais" value={task.observacoesFinais} />
          </div>
        </div>
      )}

      {/* Seção: Termos */}
      {!isQuickReply && task.termos && (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <PackageCheck size={18} /> Termos e Condições
          </h3>
          <p className="text-sm text-white/80 whitespace-pre-wrap">{task.termos}</p>
        </div>
      )}

      {/* Prompt original */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Prompt original</h3>
        <div className="bg-white/10 p-4 rounded-lg text-sm text-white/80 whitespace-pre-wrap border border-white/10">
          {task.prompt}
        </div>
      </div>

      {/* Resposta gerada (caso seja Quick Reply) */}
      {isQuickReply && (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <MessageSquareText size={18} /> Resposta Gerada
          </h3>
          <div className="bg-purple-800/10 p-4 rounded-lg text-sm text-purple-300 border border-purple-400/20 whitespace-pre-wrap">
            {task.plano.reply}
          </div>
        </div>
      )}

      {/* PDF */}
      <button onClick={baixarPdf} className="text-indigo-400 hover:underline mt-2 flex items-center gap-2">
        <FileText size={18} /> Baixar PDF da Proposta
      </button>
    </div>
  );
}

export default TaskDetails;

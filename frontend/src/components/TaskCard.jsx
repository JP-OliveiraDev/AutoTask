import { FileText, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

function TaskCard({ task }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 mb-5 text-white transition-all hover:scale-[1.01] duration-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">{task.plano?.empresa}</h2>
        <span className="text-sm text-white/60">
          {new Date(task.dataExecucao).toLocaleString("pt-BR")}
        </span>
      </div>

      <p className="text-sm text-white/80">
        <span className="font-semibold text-white">Cliente:</span>{" "}
        {task.plano?.cliente}
      </p>

      <p className="text-sm text-white/80 mt-1">
        <span className="font-semibold text-white">Serviços:</span>{" "}
        {task.plano?.servicos?.join(", ")}
      </p>

      <div className="flex flex-wrap gap-4 mt-4 text-sm">
        {task.pdfUrl && (
          <a
            href={task.pdfUrl}
            download={task.pdfUrl.split('/').pop()}
            className="flex items-center gap-1 text-[#4F46E5] hover:underline transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={18} /> Baixar PDF
          </a>
        )}

        {task.emailEnviado && (
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle size={18} /> E-mail enviado
          </span>
        )}

        <Link
          to={`/task/${task._id}`}
          className="flex items-center gap-1 text-[#4F46E5] hover:underline transition"
        >
          <ExternalLink size={18} /> Ver detalhes
        </Link>
      </div>
    </div>
  );
}

export default TaskCard;
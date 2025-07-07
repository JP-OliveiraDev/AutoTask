import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, Trash2, Eye, XCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function History() {
  const [tasks, setTasks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [tasksRes, favoritesRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/favorites"),
      ]);
      setTasks(tasksRes.data);
      setFavorites(favoritesRes.data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setErro("Erro ao carregar o histórico.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(favorites.filter((f) => f._id !== id));
      setSucesso("Favorito removido com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir favorito:", error);
      setErro("Erro ao excluir favorito.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      setSucesso("Proposta excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir proposta:", error);
      setErro("Erro ao excluir proposta.");
    }
  };

  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(() => setSucesso(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [sucesso]);

  useEffect(() => {
    if (erro) {
      const timer = setTimeout(() => setErro(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [erro]);

  const filteredTasks = tasks.filter(
    (t) =>
      t.plano?.cliente?.toLowerCase().includes(search.toLowerCase()) ||
      t.plano?.empresa?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFavorites = favorites.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.reply.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 relative">
      {/* Toasts */}
      <AnimatePresence>
        {erro && (
          <motion.div
            key="erro"
            className="absolute top-4 right-4 bg-[#EF4444] text-white px-4 py-2 rounded shadow-lg z-50"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <XCircle size={18} /> {erro}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sucesso && (
          <motion.div
            key="sucesso"
            className="absolute top-16 right-4 bg-[#10B981] text-white px-4 py-2 rounded shadow-lg z-50"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={18} /> {sucesso}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Histórico Geral</h1>

        {/* Campo de busca */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 text-white/50" size={20} />
          <input
            type="text"
            placeholder="Buscar por cliente, empresa ou conteúdo..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#6366F1]" size={32} />
          </div>
        ) : (
          <>
            {/* Seção de Propostas */}
            <h2 className="text-2xl font-semibold mb-4 mt-8 border-b border-white/10 pb-2">📄 Propostas Comerciais</h2>
            {filteredTasks.length === 0 ? (
              <p className="text-gray-500 mb-6">Nenhuma proposta encontrada.</p>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-[#1a1a1a] rounded-xl border border-gray-700 shadow"
                    >
                      <p><span className="text-gray-400">👤 Cliente:</span> {task.plano?.cliente}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Layout: {task.layout} | Criado: {new Date(task.createdAt).toLocaleString("pt-BR")}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => navigate(`/task/${task._id}`)}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition"
                        >
                          <Eye size={14} /> Ver Detalhes
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition"
                        >
                          <Trash2 size={14} /> Apagar
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Seção de Favoritos */}
            <h2 className="text-2xl font-semibold mb-4 mt-12 border-b border-white/10 pb-2">⭐ Favoritos de Respostas</h2>
            {filteredFavorites.length === 0 ? (
              <p className="text-gray-500">Nenhum favorito encontrado.</p>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredFavorites.map((fav) => (
                    <motion.div
                      key={fav._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-[#1a1a1a] rounded-xl border border-gray-700 shadow"
                    >
                      <p><span className="text-gray-400">❓ Pergunta:</span> {fav.question}</p>
                      <p className="mt-1 whitespace-pre-line"><span className="text-gray-400">💬 Resposta:</span> {fav.reply}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Criado: {new Date(fav.createdAt).toLocaleString("pt-BR")}
                      </p>

                      <button
                        onClick={() => handleDeleteFavorite(fav._id)}
                        className="mt-2 flex items-center gap-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition"
                      >
                        <Trash2 size={14} /> Apagar
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default History;

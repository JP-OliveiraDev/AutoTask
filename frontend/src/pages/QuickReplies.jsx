import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  XCircle,
  CheckCircle,
  Loader2,
  MessageCircle,
  ClipboardCheck,
  Star,
  RefreshCcw,
  FolderOpen,
  Trash2,
} from 'lucide-react';

export default function QuickReplies() {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState('');
  const [favSaved, setFavSaved] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const suggestions = [
    'O produto é novo?',
    'Tem garantia?',
    'Qual o prazo de entrega?',
    'Pode parcelar?',
    'Como funciona a devolução?',
  ];

  const categories = ['Entrega', 'Garantia', 'Pagamento', 'Trocas/Devoluções', 'Geral'];
  const tones = ['Formal', 'Informal', 'Amigável', 'Vendedor'];

  useEffect(() => {
    if (showFavorites) fetchFavorites();
  }, [showFavorites]);

  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(() => setSucesso(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [sucesso]);

  useEffect(() => {
    if (erro) {
      const timer = setTimeout(() => setErro(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [erro]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
      setFetchError('');
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      setFetchError('Não foi possível carregar os favoritos. Faça login novamente.');
      setErro('Erro ao buscar favoritos.');
    }
  };

  const saveFavorite = async (question, reply) => {
    try {
      await api.post('/favorites', { question, reply });
      setFavSaved(true);
      setSucesso('Favorito salvo com sucesso!');
      fetchFavorites();
      setTimeout(() => setFavSaved(false), 2000);
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
      setErro('Erro ao salvar favorito.');
    }
  };

  const deleteFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(favorites.filter((fav) => fav._id !== id));
      setSucesso('Favorito removido com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir favorito:', error);
      setErro('Erro ao excluir favorito.');
    }
  };

  const handleGenerateReply = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setReply('');
    try {
      const payload = { customerQuestion: question, category, tone };
      const response = await api.post('/tasks/generate-reply', payload);
      setReply(response.data.reply);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      setErro('Erro ao gerar resposta.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      {/* Toasts de sucesso e erro */}
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

      {/* Título */}
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Gerador de Respostas Rápidas para Marketplace
      </motion.h1>

      {/* Sugestões rápidas */}
      <div className="mb-4 flex flex-wrap gap-2 max-w-2xl">
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => setQuestion(sug)}
            className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-4 w-full max-w-2xl">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-900 text-gray-200 border border-gray-700"
        >
          <option value="">Categoria</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-900 text-gray-200 border border-gray-700"
        >
          <option value="">Tom de Voz</option>
          {tones.map((t, idx) => (
            <option key={idx} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Textarea */}
      <motion.textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Digite a pergunta do cliente..."
        className="w-full max-w-2xl h-28 p-4 rounded-xl bg-[#111] text-gray-100 placeholder-gray-500 mb-4 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      />

      {/* Botões */}
      <motion.div className="flex gap-4 w-full max-w-2xl">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateReply}
          disabled={loading || !question.trim()}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
          ${loading ? 'bg-indigo-900 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          {loading ? 'Gerando...' : 'Gerar Resposta'}
        </motion.button>
      </motion.div>

      {/* Resposta */}
      <AnimatePresence>
        {reply && (
          <motion.div
            className="mt-8 w-full max-w-2xl bg-[#1a1a1a] p-6 rounded-xl shadow-black/50 shadow-lg border border-gray-800"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
              <MessageCircle size={20} /> Resposta sugerida:
            </h2>
            <p className="text-gray-300 whitespace-pre-line">{reply}</p>

            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded transition"
              >
                <ClipboardCheck size={16} />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>

              <button
                onClick={() => saveFavorite(question, reply)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-black rounded transition"
              >
                <Star size={16} />
                {favSaved ? 'Favorito Salvo!' : 'Favoritar'}
              </button>

              <button
                onClick={handleGenerateReply}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
              >
                <RefreshCcw size={16} />
                Regenerar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favoritos */}
      <div className="mt-8 w-full max-w-2xl">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
        >
          <FolderOpen size={16} />
          {showFavorites ? 'Ocultar Favoritos' : 'Ver Favoritos'}
        </button>

        <AnimatePresence>
          {showFavorites && (
            <motion.div
              className="mt-4 bg-[#111] p-4 rounded-xl border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {fetchError && <p className="text-red-400 mb-4">{fetchError}</p>}

              {Array.isArray(favorites) && favorites.length > 0 ? (
                favorites.map((fav, idx) => (
                  <div
                    key={fav._id || idx}
                    className="mb-4 p-3 rounded bg-[#1a1a1a] border border-gray-600"
                  >
                    <p className="text-sm text-gray-400 mb-1">❓ Pergunta:</p>
                    <p className="text-gray-200 mb-2">{fav.question}</p>

                    <p className="text-sm text-gray-400 mb-1">💬 Resposta:</p>
                    <p className="text-gray-300 whitespace-pre-line">{fav.reply}</p>

                    <button
                      onClick={() => deleteFavorite(fav._id)}
                      className="mt-2 flex items-center gap-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition"
                    >
                      <Trash2 size={14} />
                      Apagar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Nenhum favorito salvo.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

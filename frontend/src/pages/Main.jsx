import { useState, useEffect } from "react";
import React from "react";
import { useForm, Controller  } from "react-hook-form";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, XCircle, CheckCircle, Info, Mail } from "lucide-react";
import { Tooltip } from "../components/Tooltip";

export default function Main() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const formasSelecionadas = watch("formasPagamento[]") || [];

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

  const enviarProposta = async (data) => {
    setLoading(true);
    setSucesso("");
    setErro("");
    setPdfUrl("");

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "logo" && value[0]) {
          formData.append("logo", value[0]);
        } else {
          formData.append(key, value);
        }
      });

      const response = await api.post("/tasks", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSucesso("Proposta gerada com sucesso!");
      setPdfUrl(response.data.pdf.url);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao gerar a proposta.");
    } finally {
      setLoading(false);
    }
  };

  const enviarEmail = watch("enviarEmail");

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start p-6 relative">
      {/* Toasts */}
      <AnimatePresence>
        {erro && (
          <motion.div
            key="erro"
            className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
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
            className="absolute top-16 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={18} /> {sucesso}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-4xl bg-zinc-800 rounded-2xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Nova Proposta Comercial</h2>

        <form onSubmit={handleSubmit(enviarProposta)} className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">Logo da Empresa</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("logo")}
              className="w-full p-2 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Nome do Cliente / Empresa</label>
            <input
              {...register("cliente")}
              placeholder="Ex: Loja Exemplo Ltda"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Data da Proposta</label>
            <input
              type="date"
              {...register("dataProposta")}
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Número da Proposta</label>
            <input
              {...register("numeroProposta")}
              placeholder="Ex: 2025-001"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Tipo de Proposta</label>
            <select
              {...register("tipoProposta")}
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            >
              <option value="atacado">Atacado</option>
              <option value="varejo">Varejo</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Produto ou Serviço</label>
            <input
              {...register("produto")}
              placeholder="Ex: Escova Elétrica 360º"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Quantidade Solicitada</label>
            <input
              {...register("quantidade")}
              placeholder="Ex: 50 unidades"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Quantidade Mínima de Compra</label>
            <input
              {...register("quantidadeMinima")}
              placeholder="Ex: 10 unidades"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Preço Unitário</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
              <input
                {...register("precoUnitario", {
                pattern: {
                  value: /^\d+(?:[.,]\d{1,2})?$/,
                  message: "Formato inválido. Use apenas números (ex: 99,90)",
                },
                })}
                inputMode="decimal"
                placeholder="Ex: 25,00"
                className="w-full pl-8 p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
              />
              {errors.precoUnitario && (
              <p className="text-red-400 text-xs mt-1">{errors.precoUnitario.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Preço Total</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
              <input
                {...register("precoTotal", {
                  pattern: {
                    value: /^\d+(?:[.,]\d{1,2})?$/,
                    message: "Formato inválido. Use apenas números (ex: 99,90)",
                  },
                })}
                inputMode="decimal"
                placeholder="Ex: 1250,00"
                className="w-full pl-8 p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
              />
              {errors.precoUnitario && (
                <p className="text-red-400 text-xs mt-1">{errors.precoUnitario.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Validade da Proposta</label>
            <input
              {...register("validade")}
              placeholder="Ex: 7 dias"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <label className="block mb-2 font-medium">Formas de pagamentos</label>
          {["PIX à vista", "Boleto bancário à vista", "Depósito ou transferência", "Cartão de crédito"].map((opcao) => (
            <div key={opcao} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={opcao}
                {...register("formasPagamento[]")}
                className="form-checkbox text-indigo-500 bg-zinc-700"
              />
              <label>{opcao}</label>
            </div>
          ))}

          {/* Parcelas */}
          {formasSelecionadas.includes("Cartão de crédito") && (
            <div>
              <label className="block mb-2 font-medium">Parcelamento no Cartão</label>
              <select
                {...register("parcelamento")}
                className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg text-white"
              >
                <option value="">Selecione o número de parcelas</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1}x sem juros`}>
                    {i + 1}x sem juros
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">Prazo de Entrega</label>
            <input
              {...register("prazoEntrega")}
              placeholder="Ex: 7 dias úteis"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Garantia</label>
            <input
              {...register("garantia")}
              placeholder="Ex: 12 meses contra defeitos"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Detalhes da Solicitação</label>
            <textarea
              {...register("detalhesSolicitacao")}
              placeholder="Ex: Cliente pediu desconto ou condições especiais..."
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Benefícios Exclusivos</label>
            <input
              {...register("beneficios")}
              placeholder="Ex: Frete grátis acima de R$500"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Observações Finais</label>
            <textarea
              {...register("observacoesFinais")}
              placeholder="Ex: Agradecemos a oportunidade de atender você!"
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Termos e Condições</label>
            <textarea
              {...register("termos")}
              placeholder="Inclua os termos, garantias ou links para políticas..."
              className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg resize-none"
            />
          </div>

          {/* Enviar por e-mail */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("enviarEmail")}
              className="form-checkbox bg-zinc-700 text-indigo-500"
            />
            <label>Enviar por e-mail ao cliente</label>
          </div>

          {enviarEmail && (
            <>
              <div>
                <label className="block mb-2 font-medium">E-mail do Cliente</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Informe o e-mail do cliente",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "E-mail inválido",
                    },
                  })}
                  placeholder="cliente@email.com"
                  className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-medium">Seu E-mail (Remetente)</label>
                <input
                  type="email"
                  {...register("emailRemetente", {
                    required: "Informe seu e-mail para envio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "E-mail inválido",
                    },
                  })}
                  placeholder="voce@empresa.com"
                  className="w-full p-3 border border-zinc-600 bg-zinc-900 rounded-lg"
                />
                {errors.emailRemetente && (
                  <p className="text-red-400 text-xs mt-1">{errors.emailRemetente.message}</p>
                )}
              </div>
            </>
          )}

          {/* Botão Criar Proposta */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? "Gerando..." : "Criar Proposta em PDF"}
          </motion.button>
        </form>

        {/* Preview */}
        {pdfUrl && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Preview da Proposta:</h3>
            <div className="w-full h-[500px] border border-zinc-600 rounded-xl bg-black">
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="Preview da proposta"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = `
                    <p style="padding:1rem; color: white;">Não foi possível carregar o preview.
                      <a href="${pdfUrl}" target="_blank" style="color: #60a5fa; text-decoration: underline;">
                        Clique aqui para abrir o PDF
                      </a>
                    </p>`;
                }}
              />
              <div className="mt-4 text-center">
                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                >
                  📥 Baixar PDF
                </a>
              </div>  
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

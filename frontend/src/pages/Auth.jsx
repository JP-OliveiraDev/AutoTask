import { useState, useEffect } from "react";
import api from "../services/api";
import { saveAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import logo from "../assets/Logo_AutoTask.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: form.email,
          senha: form.senha,
        });
        saveAuth(res.data.token, res.data.user);
        navigate("/main");
      } else {
        await api.post("/auth/register", form);
        setSucesso("Conta criada com sucesso!");
        setIsLogin(true);
        setForm({ nome: "", email: "", senha: "" });
      }
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao autenticar.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden">
      {/* Toasts */}
      <AnimatePresence>
        {erro && (
          <motion.div
            className="absolute top-4 right-4 bg-[#EF4444] text-white px-4 py-2 rounded shadow-lg z-50"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {erro}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sucesso && (
          <motion.div
            className="absolute top-16 right-4 bg-[#10B981] text-white px-4 py-2 rounded shadow-lg z-50"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {sucesso}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-2xl shadow-lg flex overflow-hidden flex-col md:flex-row border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="md:w-1/2 hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#3730A3] to-[#8B5CF6]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? "Bem-vindo de volta!" : "Junte-se a nós!"}
            </h2>
            <p className="text-sm text-white/80">
              {isLogin
                ? "Acesse sua conta para continuar explorando a plataforma."
                : "Crie uma conta e comece a aproveitar os recursos de IA agora."}
            </p>

            <div className="flex justify-center">
              <img src={logo} alt="Logo" className="w-60 h-auto" />
            </div>
          </div>
          <p className="text-xs text-white/50 mt-auto">
            © {new Date().getFullYear()} AutoTask AI
          </p>
        </motion.div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {isLogin ? "Login" : "Criar Conta"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                {!isLogin && (
                  <input
                    type="text"
                    name="nome"
                    placeholder="Seu nome completo"
                    className="w-full p-3 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  className="w-full p-3 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  className="w-full p-3 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-[#4F46E5] text-white hover:bg-[#6366F1] hover:text-white hover:border hover:border-[#4F46E5] transition-all duration-300 py-3 rounded-lg font-semibold"
                >
                  {isLogin ? "Entrar" : "Cadastrar"}
                </button>
              </form>

              <div className="text-center mt-5 text-sm text-[#D1D5DB]">
                {isLogin ? (
                  <>
                    Ainda não tem uma conta?
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsLogin(false)}
                      className="ml-2 bg-white text-[#111827] hover:bg-black hover:text-white hover:border hover:border-[#4F46E5] transition-all duration-300 px-4 py-1 rounded-lg font-medium"
                    >
                      Criar conta
                    </motion.button>
                  </>
                ) : (
                  <>
                    Já tem uma conta?
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsLogin(true)}
                      className="ml-2 bg-white text-[#111827] hover:bg-black hover:text-white hover:border hover:border-[#4F46E5] transition-all duration-300 px-4 py-1 rounded-lg font-medium"
                    >
                      Entrar
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, LayoutTemplate, Mail, Phone, CheckCircle, MessageSquare, ShoppingBag } from "lucide-react";
import React from "react";
import BackgroundImage from "../assets/Background.png";

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#1b1f2a] via-[#232838] to-[#1a1c22] text-white font-sans overflow-x-hidden">
      <img
        src={BackgroundImage}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 z-0"
        alt="background"
      />

      {/* Titulo */}
      <section className="relative z-10 pt-32 pb-24 text-center px-4 max-w-6xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          IA para Propostas e Atendimento Instantâneo no E-commerce
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Transforme sua comunicação com clientes: gere orçamentos profissionais em PDF e respostas personalizadas com um clique.
        </motion.p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/main"
            className="inline-block bg-purple-500 hover:bg-purple-400 text-white hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-300 ease-in-out shadow hover:shadow-md hover:shadow-purple-500/40"
          >
            Criar Minha Primeira Proposta
          </Link>
        </motion.div>
      </section>

      {/* Como Funciona */}
      <Section title="Como Funciona">
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            icon: <ShoppingBag size={32} />,
            title: "Descreva o Pedido",
            desc: "Digite o que o cliente deseja. A IA transforma em uma proposta clara e objetiva.",
          }, {
            icon: <LayoutTemplate size={32} />,
            title: "Escolha o Layout",
            desc: "Três estilos visuais para encaixar perfeitamente com o perfil de cada cliente.",
          }, {
            icon: <Mail size={32} />,
            title: "Gere e Envie",
            desc: "Baixe ou envie por e-mail em segundos. Em breve: envio direto via WhatsApp.",
          }].map(({ icon, title, desc }, i) => (
            <motion.div
              key={i}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-xl hover:scale-[1.02] transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-purple-400">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-white/80 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Respostas Rápidas */}
      <Section title="Responda Clientes em Segundos">
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<MessageSquare size={32} />} 
            title="Gerador de Respostas Rápidas"
            text="Perguntas em marketplaces? A IA responde de forma automática, clara e convincente."
          />

          <FeatureCard
            icon={<Rocket size={32} />} 
            title="Velocidade e Eficiência"
            text="Objeções, dúvidas e negociações resolvidas com respostas de alta conversão."
            delay={0.2}
          />
        </div>
      </Section>

      {/* Público-alvo */}
      <Section title="Para Quem é o AutoTask AI">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-white/90">
          {[
            {
              icon: <ShoppingBag size={28} />,
              title: "Lojistas Online",
              desc: "Ideal para quem vende no Mercado Livre, Shopee ou via redes sociais e quer agilidade nas respostas.",
            },
            {
              icon: <LayoutTemplate size={28} />,
              title: "Vendedores Profissionais",
              desc: "Ganhe tempo e aumente as conversões com propostas que impressionam e fecham vendas.",
            },
            {
              icon: <Rocket size={28} />,
              title: "Agências e Freelancers",
              desc: "Crie orçamentos bonitos e personalizados para seus serviços em poucos cliques.",
            },
            {
              icon: <MessageSquare size={28} />,
              title: "Empresas que Negociam Diariamente",
              desc: "Envie propostas com aparência profissional sem depender de softwares complicados.",
            },
          ].map(({ icon, title, desc }, i) => (
            <motion.div
              key={i}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-md hover:bg-white/10 transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-purple-400">{icon}</div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-white/80 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefícios */}
      <Section title="Benefícios para sua Loja">
        <div className="grid md:grid-cols-3 gap-6 text-white/90">
          {["Responda clientes em minutos, não horas", "Aumente suas chances de fechar vendas", "Transmita mais profissionalismo"].map((beneficio, i) => (
            <motion.div
              key={i}
              className="p-6 bg-purple-600/10 border border-purple-400/30 rounded-xl hover:bg-purple-500/10 transition"
              whileHover={{ scale: 1.02 }}
            >
              {beneficio}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      <Section title="Roadmap do Produto">
        <p className="text-white/80 mb-10">O que já temos e o que vem por aí:</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            nome: "Já Disponível",
            itens: ["Geração de Propostas em PDF", "Layouts Personalizados", "Envio por E-mail", "Histórico de Propostas", "Gerador de Respostas Rápidas"],
          }, {
            nome: "Em Breve",
            itens: ["Envio via WhatsApp", "Editor de texto da proposta", "Templates reutilizáveis"],
          }, {
            nome: "Futuro",
            itens: ["Integração com Marketplaces", "API externa", "Assinatura digital"]
          }].map(({ nome, itens }, i) => (
            <motion.div
              key={i}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-md hover:bg-white/10 transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">{nome}</h3>
              <ul className="space-y-2 text-white/80">
                {itens.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle size={16} /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contato */}
      <Section title="Precisa de Ajuda?">
        <p className="text-white/70 mb-6">Entre em contato com nosso suporte:</p>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/90">
            <Mail size={18} /> suporte@autotask.com
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Phone size={18} /> (11) 94013-9886
          </div>
        </div>
      </Section>

      {/* Rodapé */}
      <footer className="mt-5 py-8 text-center text-sm text-white/50 border-t border-white/10">
        © {new Date().getFullYear()} AutoTask AI — Todos os direitos reservados.
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="relative z-10 py-24 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">{title}</h2>
      {children}
    </section>
  );
}

function FeatureCard({ icon, title, text, delay = 0 }) {
  return (
    <motion.div
      className="bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-lg hover:scale-[1.02] transition"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="mb-4 text-purple-400">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{text}</p>
    </motion.div>
  );
}

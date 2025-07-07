import { getUser, logout } from "../services/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, UserCircle, Clock, ArrowLeft, Rocket } from "lucide-react";
import React from "react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="w-full px-6 py-4 mb-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl text-white">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
            AutoTask AI
          </h1>
        </Link>

        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-white/80 font-medium">
              <UserCircle className="w-5 h-5 text-white/60" />
              {user.nome}
            </span>

            {location.pathname !== "/quick-replies" && (
              <Link 
                to="/quick-replies" 
                className="group flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <Rocket className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-[-12deg]"/>
                <span className="text-white">Respostas Rápidas</span>
              </Link>
            )}

            {location.pathname === "/quick-replies" && (
              <Link
                to="/main"
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-800 hover:to-zinc-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="text-white">Voltar</span>
              </Link>
            )}

            {location.pathname !== "/history" && (
              <Link
                to="/history"
                className="group flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <Clock className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-[-12deg]" />
                <span className="text-white">Histórico</span>
              </Link>
            )}

            {location.pathname === "/history" && (
              <Link
                to="/main"
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-800 hover:to-zinc-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="text-white">Voltar</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="group flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              <LogOut className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-[-12deg]" />
              <span className="text-white">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

import { getUser, logout } from "../services/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, UserCircle, Clock, ArrowLeft, Rocket, Menu, X } from "lucide-react";
import React, { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [openMenu, setOpenMenu] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isQuickReplies = location.pathname === "/quick-replies";
  const isHistory = location.pathname === "/history";

  const navButtons = (
    <>
      {!isQuickReplies && (
        <Link
          to="/quick-replies"
          className="group flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
        >
          <Rocket className="w-5 h-5 group-hover:rotate-[-12deg]" />
          <span>Respostas Rápidas</span>
        </Link>
      )}

      {isQuickReplies && (
        <Link
          to="/main"
          className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />
          <span>Voltar</span>
        </Link>
      )}

      {!isHistory && (
        <Link
          to="/history"
          className="group flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
        >
          <Clock className="w-5 h-5 group-hover:rotate-[-12deg]" />
          <span>Histórico</span>
        </Link>
      )}

      {isHistory && (
        <Link
          to="/main"
          className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />
          <span>Voltar</span>
        </Link>
      )}

      <button
        onClick={handleLogout}
        className="group flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
      >
        <LogOut className="w-5 h-5 group-hover:rotate-[-12deg]" />
        <span>Sair</span>
      </button>
    </>
  );

  return (
    <header className="w-full px-6 py-4 mb-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl text-white relative z-50">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
            AutoTask AI
          </h1>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-white/80 font-medium">
                <UserCircle className="w-5 h-5 text-white/60" />
                {user.nome}
              </span>
              {navButtons}
            </div>

            {/* botão menu */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="md:hidden p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600"
            >
              {openMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        )}
      </div>

      {/* menu dropdown */}
      {openMenu && (
        <div className="md:hidden mt-4 flex flex-col gap-3 text-sm bg-zinc-800 p-4 rounded-xl shadow-xl">
          <span className="flex items-center gap-2 text-white/80 font-medium">
            <UserCircle className="w-5 h-5 text-white/60" />
            {user.nome}
          </span>
          {navButtons}
        </div>
      )}
    </header>
  );
}

export default Header;

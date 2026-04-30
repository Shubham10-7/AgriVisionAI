import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home, Microscope, Leaf, Map, MessageCircle,
  Newspaper, ShoppingCart, CloudSun, LayoutDashboard,
  History, Menu, X, Globe, LogOut, User
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useTranslation } from "react-i18next";

const NAV = [
  { path: "/",          label: "nav.home",        icon: Home },
  { path: "/detect",    label: "nav.detect",      icon: Microscope },
  { path: "/fertilizer",label: "nav.fertilizer",  icon: Leaf },
  { path: "/crop-map",  label: "nav.cropMap",     icon: Map },
  { path: "/weather",   label: "nav.weather",     icon: CloudSun },
  { path: "/chatbot",   label: "nav.chatbot",     icon: MessageCircle },
  { path: "/news",      label: "nav.news",        icon: Newspaper },
  { path: "/market",    label: "nav.market",      icon: ShoppingCart },
  { path: "/dashboard", label: "nav.dashboard",   icon: LayoutDashboard, auth: true },
  { path: "/history",   label: "nav.history",     icon: History, auth: true },
];

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "bn", label: "বাংলা" },
  { code: "gu", label: "ગુજરાતી" },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-card transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-green-100">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-primary text-lg leading-tight">AgriVision AI</h1>
            <p className="text-xs text-gray-400">Mega Project v2.0</p>
          </div>
          <button className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.filter(n => !n.auth || user).map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-green-50 hover:text-primary"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {t(label)}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user section */}
        <div className="p-4 border-t border-green-50">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition"
            >
              {t("nav.login")}
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-green-100 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1" />

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-200 text-sm text-gray-600 hover:bg-green-50"
            >
              <Globe className="w-4 h-4" />
              {LANGS.find(l => l.code === i18n.language)?.label || "English"}
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-hover border border-green-100 z-50 py-1">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-gray-700"
                    onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

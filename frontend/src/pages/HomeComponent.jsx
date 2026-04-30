import { useNavigate } from "react-router-dom";
import { Microscope, Leaf, Map, MessageCircle, CloudSun, ShoppingCart, ArrowRight, Shield, Zap, Globe } from "lucide-react";

const FEATURES = [
  { icon: Microscope, label: "Disease Detection", desc: "AI-powered leaf analysis with 95%+ accuracy", path: "/detect", color: "bg-red-50 text-red-500" },
  { icon: Leaf,       label: "Fertilizer Advisor", desc: "Smart NPK recommendations based on soil & crop", path: "/fertilizer", color: "bg-green-50 text-green-500" },
  { icon: Map,        label: "Crop Map",           desc: "Map-based crop suggestions for every Indian state", path: "/crop-map", color: "bg-blue-50 text-blue-500" },
  { icon: CloudSun,   label: "Weather Planner",    desc: "Real-time weather + crop suitability forecast", path: "/weather", color: "bg-sky-50 text-sky-500" },
  { icon: MessageCircle, label: "AgriBot",         desc: "AI chatbot in Hindi, Marathi, Tamil & more", path: "/chatbot", color: "bg-purple-50 text-purple-500" },
  { icon: ShoppingCart,  label: "Smart Market",    desc: "Buy fertilizers, pesticides & get recommendations", path: "/market", color: "bg-yellow-50 text-yellow-500" },
];

const STATS = [
  { value: "39+", label: "Disease Classes" },
  { value: "20+", label: "Indian States" },
  { value: "10+", label: "Languages" },
  { value: "24/7", label: "AI Support" },
];

export default function HomeComponent() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-4 right-24 w-16 h-16 rounded-full bg-white" />
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4">
            🚀 Final Year Mega Project 2024
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">
            AgriVision AI 🌿
          </h1>
          <p className="text-white/80 mt-3 text-lg">
            Complete AI-powered agricultural intelligence platform for Indian farmers.
            Disease detection, smart fertilizer advice, crop planning & more.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <button
              onClick={() => navigate("/detect")}
              className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-green-50 transition flex items-center gap-2"
            >
              <Microscope className="w-4 h-4" /> Detect Disease
            </button>
            <button
              onClick={() => navigate("/chatbot")}
              className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Talk to AgriBot
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-5 text-center">
            <p className="text-3xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-display font-bold text-gray-800 mb-4">🔧 Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="bg-white rounded-2xl shadow-card p-5 text-left hover:shadow-hover hover:-translate-y-1 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 group-hover:text-primary transition">{label}</h3>
              <p className="text-sm text-gray-500 mt-1">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
                Explore <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Shield, title: "Trusted AI", desc: "CNN model trained on 87,000+ plant images from PlantVillage dataset" },
          { icon: Globe,  title: "Multi-language", desc: "Available in English, Hindi, Marathi, Tamil, Telugu and 6 more languages" },
          { icon: Zap,    title: "Real-time Data", desc: "Live weather via Open-Meteo API, live news, and market prices" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-gradient-to-br from-surface to-green-100 rounded-2xl p-5 border border-green-200">
            <Icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"""
AI Chatbot for Farmers - Multi-language Agricultural Assistant
Uses Groq API (free tier, fast Llama-3) or falls back to rule-based answers
"""
import os
import uuid
import requests
from flask import Blueprint, request, jsonify
from extensions import db
from models.models import ChatMessage

chatbot_bp = Blueprint("chatbot", __name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")  # Free at console.groq.com

SYSTEM_PROMPT = """You are AgriBot, an expert agricultural assistant helping Indian farmers.
You specialize in:
- Crop disease identification and treatment
- Fertilizer recommendations
- Pest management
- Weather-based crop planning
- Government agricultural schemes (PM-KISAN, PMFBY, KCC)
- Market price guidance
- Organic farming techniques

IMPORTANT RULES:
1. Always respond in the SAME LANGUAGE as the user's message.
2. If user writes in Hindi/Marathi/Tamil/Telugu/Kannada/Bengali/Gujarati — reply in that same language.
3. Keep answers practical, farmer-friendly, and actionable.
4. Mention specific Indian products, schemes, and local context.
5. For serious disease/pest issues, always recommend consulting the local Krishi Vigyan Kendra (KVK).
6. Be concise — farmers need quick answers.

Languages you must support: English, Hindi (हिंदी), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Bengali (বাংলা), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Malayalam (മലയാളം).
"""

# Fallback rule-based answers (English only)
RULE_ANSWERS = {
    "fertilizer": "Use NPK 19-19-19 as a balanced fertilizer. For nitrogen deficiency, apply Urea @ 50 kg/acre. Always do soil testing before applying fertilizers.",
    "disease": "Upload an image using our Disease Detection tool for accurate diagnosis. Common diseases: Blast (Rice), Late Blight (Potato/Tomato), Powdery Mildew (many crops).",
    "pest": "For aphids: spray Imidacloprid 17.8 SL @ 0.3 ml/L. For bollworm: use Bt spray or Emamectin Benzoate. Prefer IPM methods to reduce chemical use.",
    "weather": "Check weather using our Weather tab. Avoid spraying pesticides before rain. Plan irrigation based on weekly forecast.",
    "scheme": "Key schemes: PM-KISAN (₹6000/year direct benefit), PMFBY (crop insurance), KCC (Kisan Credit Card @ 4% interest), eNAM (online market).",
    "market": "Check eNAM portal or local APMC for prices. MSP (Minimum Support Price) is announced by govt — check agmarknet.gov.in.",
    "organic": "Start with vermicompost, neem cake, and Trichoderma. Avoid synthetic chemicals 3 years before applying for organic certification.",
}


def get_groq_response(messages: list, language: str = "en") -> str:
    """Call Groq API for LLM response."""
    if not GROQ_API_KEY:
        return None

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        "max_tokens": 500,
        "temperature": 0.7,
    }
    try:
        r = requests.post("https://api.groq.com/openai/v1/chat/completions",
                          json=payload, headers=headers, timeout=15)
        data = r.json()
        return data["choices"][0]["message"]["content"]
    except Exception:
        return None


def rule_based_answer(user_msg: str) -> str:
    msg_lower = user_msg.lower()
    for keyword, answer in RULE_ANSWERS.items():
        if keyword in msg_lower:
            return answer
    return ("I'm AgriBot, your farming assistant! Ask me about fertilizers, crop diseases, pests, "
            "weather planning, or government schemes. You can also upload a leaf image for disease detection.")


@chatbot_bp.post("/chat")
def chat():
    data = request.get_json()
    user_msg  = data.get("message", "").strip()
    session_id = data.get("session_id") or str(uuid.uuid4())
    language   = data.get("language", "en")

    if not user_msg:
        return jsonify({"error": "Empty message"}), 400

    # Build history from DB (last 10 messages)
    history = ChatMessage.query.filter_by(session_id=session_id).order_by(
        ChatMessage.created_at
    ).all()[-10:]

    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": user_msg})

    # Try LLM first, fallback to rules
    reply = get_groq_response(messages, language)
    if not reply:
        reply = rule_based_answer(user_msg)
        source = "rule_based"
    else:
        source = "llm"

    # Save both turns
    db.session.add(ChatMessage(session_id=session_id, role="user",
                               content=user_msg, language=language))
    db.session.add(ChatMessage(session_id=session_id, role="assistant",
                               content=reply, language=language))
    db.session.commit()

    return jsonify({
        "reply": reply,
        "session_id": session_id,
        "source": source,
        "language": language,
    })


@chatbot_bp.get("/history/<session_id>")
def chat_history(session_id):
    messages = ChatMessage.query.filter_by(session_id=session_id).order_by(
        ChatMessage.created_at).all()
    return jsonify([{
        "role": m.role,
        "content": m.content,
        "created_at": m.created_at.isoformat(),
    } for m in messages])

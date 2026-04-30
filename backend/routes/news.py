"""Agricultural News Route - NewsAPI + GNews fallback"""
import os, requests
from flask import Blueprint, request, jsonify

news_bp = Blueprint("news", __name__)
NEWS_API_KEY = os.environ.get("NEWS_API_KEY", "")   # Free at newsapi.org

CATEGORIES = {
    "weather":  ["weather forecast india agriculture", "monsoon 2024 india"],
    "market":   ["mandi price india crop", "agri commodity price india"],
    "schemes":  ["government scheme farmers india", "PM-KISAN PMFBY 2024"],
    "disease":  ["crop disease outbreak india 2024"],
    "general":  ["agriculture india news"],
}

MOCK_NEWS = [
    {"title": "IMD predicts normal monsoon 2024 for Maharashtra", "category": "weather",
     "url": "https://imd.gov.in", "source": "IMD", "published_at": "2024-04-15"},
    {"title": "Wheat MSP raised to ₹2275/quintal for Rabi 2024-25", "category": "market",
     "url": "https://pib.gov.in", "source": "PIB", "published_at": "2024-04-10"},
    {"title": "PM-KISAN 17th installment released — ₹6000 credit for eligible farmers", "category": "schemes",
     "url": "https://pmkisan.gov.in", "source": "Govt of India", "published_at": "2024-04-08"},
    {"title": "Fall Armyworm alert in Maharashtra maize fields", "category": "disease",
     "url": "https://icar.org.in", "source": "ICAR", "published_at": "2024-04-05"},
    {"title": "Onion prices drop 30% at Nashik APMC this week", "category": "market",
     "url": "https://agmarknet.gov.in", "source": "AGMARKNET", "published_at": "2024-04-03"},
    {"title": "Kisan Credit Card (KCC) interest subvention scheme extended till 2025", "category": "schemes",
     "url": "https://nabard.org", "source": "NABARD", "published_at": "2024-04-01"},
    {"title": "Drone spraying subsidy: 50% for SC/ST farmers in AP", "category": "schemes",
     "url": "https://pib.gov.in", "source": "PIB", "published_at": "2024-03-28"},
    {"title": "Tomato Late Blight warning issued for Himachal Pradesh", "category": "disease",
     "url": "https://icar.org.in", "source": "ICAR", "published_at": "2024-03-25"},
]


@news_bp.get("/")
def get_news():
    category = request.args.get("category", "general")
    if not NEWS_API_KEY:
        filtered = [n for n in MOCK_NEWS if category == "general" or n["category"] == category]
        return jsonify({"articles": filtered, "source": "mock"})

    query = " OR ".join(CATEGORIES.get(category, CATEGORIES["general"]))
    url = "https://newsapi.org/v2/everything"
    params = {"q": query, "language": "en", "sortBy": "publishedAt",
              "pageSize": 10, "apiKey": NEWS_API_KEY}
    try:
        r = requests.get(url, params=params, timeout=10)
        arts = r.json().get("articles", [])
        return jsonify({"articles": [
            {"title": a["title"], "url": a["url"],
             "source": a["source"]["name"], "published_at": a["publishedAt"],
             "category": category} for a in arts
        ], "source": "newsapi"})
    except Exception as e:
        return jsonify({"articles": MOCK_NEWS, "source": "mock", "error": str(e)})


@news_bp.get("/categories")
def categories():
    return jsonify(list(CATEGORIES.keys()))

"""Market route - product recommendations based on disease/crop"""
from flask import Blueprint, request, jsonify

market_bp = Blueprint("market", __name__)

PRODUCTS = [
    {"id": 1, "name": "Mancozeb 75% WP", "category": "Fungicide", "price": 280,
     "unit": "500g", "for_disease": ["Late Blight", "Downy Mildew", "Anthracnose"],
     "for_crop": ["Potato", "Tomato", "Grape"], "image": "https://placehold.co/200x200?text=Mancozeb",
     "buy_url": "https://www.bighaat.com"},
    {"id": 2, "name": "Trichoderma Viride", "category": "Bio-fungicide", "price": 150,
     "unit": "1kg", "for_disease": ["Damping off", "Root Rot", "Wilt"],
     "for_crop": ["Tomato", "Wheat", "Cotton"], "image": "https://placehold.co/200x200?text=Trichoderma",
     "buy_url": "https://www.bighaat.com"},
    {"id": 3, "name": "Imidacloprid 70 WG", "category": "Insecticide", "price": 350,
     "unit": "100g", "for_disease": ["Aphid", "Whitefly", "Thrips"],
     "for_crop": ["Cotton", "Rice", "Vegetable"], "image": "https://placehold.co/200x200?text=Imidacloprid",
     "buy_url": "https://www.bighaat.com"},
    {"id": 4, "name": "Neem Oil 1500 PPM", "category": "Bio-Pesticide", "price": 120,
     "unit": "500ml", "for_disease": ["Powdery Mildew", "Aphid", "Mite"],
     "for_crop": ["All crops"], "image": "https://placehold.co/200x200?text=NeemOil",
     "buy_url": "https://www.bighaat.com"},
    {"id": 5, "name": "DAP Fertilizer", "category": "Fertilizer", "price": 1350,
     "unit": "50kg", "for_disease": [],
     "for_crop": ["Wheat", "Rice", "Maize", "Soybean"], "image": "https://placehold.co/200x200?text=DAP",
     "buy_url": "https://www.bighaat.com"},
    {"id": 6, "name": "Urea (Neem Coated)", "category": "Fertilizer", "price": 280,
     "unit": "45kg", "for_disease": [],
     "for_crop": ["Rice", "Wheat", "Sugarcane"], "image": "https://placehold.co/200x200?text=Urea",
     "buy_url": "https://www.bighaat.com"},
    {"id": 7, "name": "Vermicompost", "category": "Organic", "price": 200,
     "unit": "5kg", "for_disease": [],
     "for_crop": ["Vegetable", "Fruit", "Flower"], "image": "https://placehold.co/200x200?text=Vermicompost",
     "buy_url": "https://www.bighaat.com"},
    {"id": 8, "name": "Copper Hydroxide 77% WP", "category": "Fungicide", "price": 420,
     "unit": "500g", "for_disease": ["Bacterial Spot", "Angular Leaf Spot", "Canker"],
     "for_crop": ["Tomato", "Pepper", "Citrus"], "image": "https://placehold.co/200x200?text=Copper",
     "buy_url": "https://www.bighaat.com"},
]


@market_bp.get("/products")
def products():
    disease = request.args.get("disease", "").lower()
    crop    = request.args.get("crop", "").lower()
    cat     = request.args.get("category", "").lower()

    result = PRODUCTS
    if disease:
        result = [p for p in result
                  if any(disease in d.lower() for d in p["for_disease"])]
    if crop:
        result = [p for p in result
                  if any(crop in c.lower() for c in p["for_crop"])]
    if cat:
        result = [p for p in result if p["category"].lower() == cat]

    return jsonify({"products": result, "count": len(result)})


@market_bp.get("/categories")
def categories():
    cats = list({p["category"] for p in PRODUCTS})
    return jsonify(cats)

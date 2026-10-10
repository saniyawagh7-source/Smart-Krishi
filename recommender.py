import math
import json
from crops_data import CROPS

def calculate_score(val, ideal_range, weight=1.0):
    min_val, max_val = ideal_range
    if min_val <= val <= max_val:
        return 100 * weight
    
    # Calculate penalty based on how far off it is relative to the range width
    range_width = max_val - min_val
    if range_width == 0:
        range_width = max_val * 0.1 # Fallback
    
    if val < min_val:
        diff = min_val - val
    else:
        diff = val - max_val
        
    penalty = (diff / range_width) * 50
    score = max(0, 100 - penalty)
    return score * weight

def get_recommendations(n, p, k, ph, moisture):
    results = []
    
    for crop in CROPS:
        score_n = calculate_score(n, crop['req_n'], 1.5)
        score_p = calculate_score(p, crop['req_p'], 1.0)
        score_k = calculate_score(k, crop['req_k'], 1.0)
        score_ph = calculate_score(ph, crop['req_ph'], 2.0)
        score_m = calculate_score(moisture, crop['req_moisture'], 1.5)
        
        total_weight = 1.5 + 1.0 + 1.0 + 2.0 + 1.5
        match_percent = (score_n + score_p + score_k + score_ph + score_m) / total_weight
        
        results.append({
            "crop": crop,
            "match_percent": round(match_percent, 1)
        })
        
    results.sort(key=lambda x: x['match_percent'], reverse=True)
    return results[:5]

def get_fertilizer_plan(n, p, k, ph, top_crop):
    req_n_avg = sum(top_crop['req_n'])/2
    req_p_avg = sum(top_crop['req_p'])/2
    req_k_avg = sum(top_crop['req_k'])/2
    
    gap_n = max(0, req_n_avg - n)
    gap_p = max(0, req_p_avg - p)
    gap_k = max(0, req_k_avg - k)
    
    # Per hectare to per acre conversion (~0.404)
    # Actually gaps are in kg/ha, let's keep calculations in kg/acre
    ha_to_acre = 0.404686
    gap_n_acre = gap_n * ha_to_acre
    gap_p_acre = gap_p * ha_to_acre
    gap_k_acre = gap_k * ha_to_acre
    
    # Fertilizer conversion
    # DAP is 18% N and 46% P
    dap_qty = gap_p_acre / 0.46 if gap_p_acre > 0 else 0
    n_from_dap = dap_qty * 0.18
    
    # Urea is 46% N
    remaining_n = max(0, gap_n_acre - n_from_dap)
    urea_qty = remaining_n / 0.46 if remaining_n > 0 else 0
    
    # MOP is 60% K
    mop_qty = gap_k_acre / 0.60 if gap_k_acre > 0 else 0
    
    ph_tips = []
    if ph < 6.0:
        ph_tips.append("Apply agricultural lime to raise soil pH (acidic soil detected).")
    elif ph > 7.5:
        ph_tips.append("Apply gypsum or elemental sulphur to lower soil pH (alkaline soil detected).")
        
    return {
        "urea_kg_acre": round(urea_qty, 1),
        "dap_kg_acre": round(dap_qty, 1),
        "mop_kg_acre": round(mop_qty, 1),
        "organic_tips": "Add 2-3 tonnes of Farm Yard Manure (FYM) per acre during field preparation.",
        "ph_tips": " ".join(ph_tips),
        "note": "Amounts are approximate guidance based on average requirements. Always combine with organic compost."
    }

def categorize_nutrient(n, p, k):
    return {
        "N": "Low" if n < 280 else "Medium" if n <= 560 else "High",
        "P": "Low" if p < 11 else "Medium" if p <= 25 else "High",
        "K": "Low" if k < 110 else "Medium" if k <= 280 else "High"
    }

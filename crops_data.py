# crops_data.py
# 20 Indian crops with ideal soil and growth conditions.

CROPS = [
    {
        "name": "Wheat", "season": "Rabi",
        "req_n": (100, 120), "req_p": (40, 60), "req_k": (40, 60),
        "req_ph": (6.0, 7.0), "req_moisture": (40, 60),
        "water_need": "Medium", "duration": "120-150 days",
        "seed_info": "Examples: HD 2967, PBW 343. Check with local agriculture office.",
        "seed_rate": "40 kg/acre"
    },
    {
        "name": "Rice", "season": "Kharif",
        "req_n": (100, 150), "req_p": (30, 50), "req_k": (30, 50),
        "req_ph": (5.5, 6.5), "req_moisture": (60, 80),
        "water_need": "High", "duration": "100-150 days",
        "seed_info": "Examples: IR64, Swarna. Check with local agriculture office.",
        "seed_rate": "10-15 kg/acre (Transplanting)"
    },
    {
        "name": "Maize", "season": "Kharif/Rabi",
        "req_n": (120, 150), "req_p": (50, 75), "req_k": (40, 60),
        "req_ph": (5.8, 7.0), "req_moisture": (40, 60),
        "water_need": "Medium", "duration": "90-110 days",
        "seed_info": "Examples: HQPM-1, Ganga-5. Check with local agriculture office.",
        "seed_rate": "8-10 kg/acre"
    },
    {
        "name": "Cotton", "season": "Kharif",
        "req_n": (100, 120), "req_p": (40, 60), "req_k": (40, 60),
        "req_ph": (5.8, 8.0), "req_moisture": (35, 55),
        "water_need": "Medium", "duration": "150-180 days",
        "seed_info": "Examples: Bt Cotton hybrids (MCU-5). Check with local agriculture office.",
        "seed_rate": "1-2 kg/acre"
    },
    {
        "name": "Soybean", "season": "Kharif",
        "req_n": (20, 40), "req_p": (60, 80), "req_k": (40, 60), # Low N due to nitrogen fixation
        "req_ph": (6.0, 7.5), "req_moisture": (40, 60),
        "water_need": "Medium", "duration": "90-120 days",
        "seed_info": "Examples: JS 335, JS 95-60. Check with local agriculture office.",
        "seed_rate": "25-30 kg/acre"
    },
    {
        "name": "Sugarcane", "season": "Annual",
        "req_n": (150, 250), "req_p": (60, 100), "req_k": (60, 100),
        "req_ph": (6.0, 7.5), "req_moisture": (60, 80),
        "water_need": "High", "duration": "10-14 months",
        "seed_info": "Examples: Co 0238, Co 86032. Check with local agriculture office.",
        "seed_rate": "10000-12000 setts/acre"
    },
    {
        "name": "Onion", "season": "Rabi/Kharif",
        "req_n": (100, 120), "req_p": (50, 70), "req_k": (50, 70),
        "req_ph": (6.0, 7.0), "req_moisture": (45, 65),
        "water_need": "Medium", "duration": "120-150 days",
        "seed_info": "Examples: N-53, Agrifound Light Red. Check with local agriculture office.",
        "seed_rate": "3-4 kg/acre"
    },
    {
        "name": "Tomato", "season": "Rabi/Kharif",
        "req_n": (100, 150), "req_p": (60, 80), "req_k": (80, 120),
        "req_ph": (6.0, 7.0), "req_moisture": (50, 70),
        "water_need": "Medium", "duration": "130-150 days",
        "seed_info": "Examples: Pusa Ruby, Arka Vikas. Check with local agriculture office.",
        "seed_rate": "150-200 g/acre"
    },
    {
        "name": "Potato", "season": "Rabi",
        "req_n": (120, 160), "req_p": (80, 100), "req_k": (100, 120),
        "req_ph": (5.0, 6.5), "req_moisture": (55, 75),
        "water_need": "Medium", "duration": "90-120 days",
        "seed_info": "Examples: Kufri Jyoti, Kufri Bahar. Check with local agriculture office.",
        "seed_rate": "8-10 quintals/acre"
    },
    {
        "name": "Groundnut", "season": "Kharif",
        "req_n": (20, 40), "req_p": (50, 70), "req_k": (40, 60),
        "req_ph": (6.0, 7.5), "req_moisture": (40, 60),
        "water_need": "Low-Medium", "duration": "100-120 days",
        "seed_info": "Examples: TMV-2, JL-24. Check with local agriculture office.",
        "seed_rate": "30-40 kg/acre"
    },
    {
        "name": "Chickpea", "season": "Rabi",
        "req_n": (15, 25), "req_p": (40, 60), "req_k": (20, 40),
        "req_ph": (6.0, 7.5), "req_moisture": (30, 50),
        "water_need": "Low", "duration": "120-150 days",
        "seed_info": "Examples: Pusa 362, Vijay. Check with local agriculture office.",
        "seed_rate": "25-30 kg/acre"
    },
    {
        "name": "Pigeon Pea", "season": "Kharif",
        "req_n": (20, 30), "req_p": (40, 60), "req_k": (20, 40),
        "req_ph": (6.0, 7.5), "req_moisture": (30, 50),
        "water_need": "Low", "duration": "150-180 days",
        "seed_info": "Examples: UPAS 120, Pusa 992. Check with local agriculture office.",
        "seed_rate": "6-8 kg/acre"
    },
    {
        "name": "Jowar", "season": "Kharif/Rabi",
        "req_n": (60, 80), "req_p": (30, 40), "req_k": (30, 40),
        "req_ph": (6.0, 7.5), "req_moisture": (30, 50),
        "water_need": "Low", "duration": "100-120 days",
        "seed_info": "Examples: CSH 9, CSV 15. Check with local agriculture office.",
        "seed_rate": "4-5 kg/acre"
    },
    {
        "name": "Bajra", "season": "Kharif",
        "req_n": (40, 60), "req_p": (20, 30), "req_k": (20, 30),
        "req_ph": (6.0, 7.5), "req_moisture": (25, 45),
        "water_need": "Low", "duration": "80-100 days",
        "seed_info": "Examples: HHB 67, Pusa 415. Check with local agriculture office.",
        "seed_rate": "1.5-2 kg/acre"
    },
    {
        "name": "Mustard", "season": "Rabi",
        "req_n": (60, 80), "req_p": (30, 50), "req_k": (30, 50),
        "req_ph": (6.0, 7.5), "req_moisture": (30, 50),
        "water_need": "Low-Medium", "duration": "110-130 days",
        "seed_info": "Examples: Pusa Bold, Kranti. Check with local agriculture office.",
        "seed_rate": "1.5-2 kg/acre"
    },
    {
        "name": "Sunflower", "season": "Rabi/Zaid",
        "req_n": (60, 80), "req_p": (40, 60), "req_k": (40, 60),
        "req_ph": (6.5, 8.0), "req_moisture": (35, 55),
        "water_need": "Medium", "duration": "90-100 days",
        "seed_info": "Examples: Morden, KBSH-1. Check with local agriculture office.",
        "seed_rate": "2-3 kg/acre"
    },
    {
        "name": "Banana", "season": "Annual",
        "req_n": (150, 200), "req_p": (50, 80), "req_k": (150, 200),
        "req_ph": (6.0, 7.5), "req_moisture": (65, 85),
        "water_need": "High", "duration": "11-14 months",
        "seed_info": "Examples: Grand Naine (Tissue Culture). Check with local agriculture office.",
        "seed_rate": "1200 plants/acre"
    },
    {
        "name": "Turmeric", "season": "Kharif",
        "req_n": (100, 120), "req_p": (40, 60), "req_k": (80, 100),
        "req_ph": (5.5, 7.5), "req_moisture": (50, 70),
        "water_need": "Medium", "duration": "240-270 days",
        "seed_info": "Examples: Salem, Rajendra Sonia. Check with local agriculture office.",
        "seed_rate": "1000 kg rhizomes/acre"
    },
    {
        "name": "Grapes", "season": "Perennial",
        "req_n": (80, 100), "req_p": (40, 60), "req_k": (100, 120),
        "req_ph": (6.5, 7.5), "req_moisture": (45, 65),
        "water_need": "Medium", "duration": "Perennial",
        "seed_info": "Examples: Thompson Seedless. Check with local agriculture office.",
        "seed_rate": "Rootstocks/cuttings"
    },
    {
        "name": "Pomegranate", "season": "Perennial",
        "req_n": (80, 120), "req_p": (40, 60), "req_k": (80, 120),
        "req_ph": (6.5, 7.5), "req_moisture": (40, 60),
        "water_need": "Low-Medium", "duration": "Perennial",
        "seed_info": "Examples: Bhagwa, Ganesh. Check with local agriculture office.",
        "seed_rate": "Air layered plants"
    }
]

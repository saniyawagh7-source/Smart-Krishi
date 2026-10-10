from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from functools import wraps
from database import init_db, get_db, create_user, verify_user
from recommender import get_recommendations, get_fertilizer_plan, categorize_nutrient
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'smart_krishi_super_secret_key_change_in_production'

# Initialize Database
with app.app_context():
    init_db()

# Decorator for protected routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Please log in to access this page.", "warning")
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# ================= ROUTES =================

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        contact = request.form['contact']
        password = request.form['password']
        
        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE contact=?", (contact,))
        user = c.fetchone()
        conn.close()
        
        # Auto-create the user if they don't exist, giving them a fresh, empty history!
        if not user:
            create_user("New Farmer", contact, "Local", password)
            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT * FROM users WHERE contact=?", (contact,))
            user = c.fetchone()
            conn.close()
            
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        contact = request.form['contact']
        location = request.form['location']
        password = request.form['password']
        
        if create_user(name, contact, location, password):
            flash("Registration successful! Please login.", "success")
            return redirect(url_for('login'))
        else:
            flash("Contact already registered. Please login.", "error")
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/test', methods=['GET', 'POST'])
@login_required
def test():
    if request.method == 'POST':
        # Handle manual entry submission or saving sensor data
        n = float(request.form.get('n', 0))
        p = float(request.form.get('p', 0))
        k = float(request.form.get('k', 0))
        ph = float(request.form.get('ph', 7.0))
        moisture = float(request.form.get('moisture', 0))
        temperature = float(request.form.get('temperature', 25.0))
        source = request.form.get('source', 'Manual')
        
        # Save to DB
        conn = get_db()
        c = conn.cursor()
        c.execute('''INSERT INTO soil_tests (user_id, n, p, k, ph, moisture, temperature, source) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', 
                  (session['user_id'], n, p, k, ph, moisture, temperature, source))
        test_id = c.lastrowid
        
        # Get Recommendations
        recs = get_recommendations(n, p, k, ph, moisture)
        top_crop = recs[0]['crop']
        fert_plan = get_fertilizer_plan(n, p, k, ph, top_crop)
        
        c.execute('''INSERT INTO recommendations (test_id, crop, match_percent, seed_info, fertilizer_json) 
                     VALUES (?, ?, ?, ?, ?)''',
                  (test_id, json.dumps(top_crop), recs[0]['match_percent'], top_crop['seed_info'], json.dumps(fert_plan)))
        
        conn.commit()
        conn.close()
        
        return redirect(url_for('result', test_id=test_id))
        
    return render_template('test.html')

@app.route('/result/<int:test_id>')
@login_required
def result(test_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM soil_tests WHERE id=? AND user_id=?", (test_id, session['user_id']))
    test_data = c.fetchone()
    
    if not test_data:
        return "Test not found", 404
        
    c.execute("SELECT * FROM recommendations WHERE test_id=?", (test_id,))
    rec_data = c.fetchone()
    conn.close()
    
    nutrient_status = categorize_nutrient(test_data['n'], test_data['p'], test_data['k'])
    top_crop = json.loads(rec_data['crop'])
    fert_plan = json.loads(rec_data['fertilizer_json'])
    
    return render_template('result.html', 
                           test=test_data, 
                           rec=rec_data, 
                           top_crop=top_crop,
                           fert_plan=fert_plan,
                           status=nutrient_status)

@app.route('/history')
@login_required
def history():
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT s.id, s.created_at, s.n, s.p, s.k, s.ph, s.moisture, r.crop 
                 FROM soil_tests s 
                 LEFT JOIN recommendations r ON s.id = r.test_id 
                 WHERE s.user_id=? 
                 ORDER BY s.created_at DESC''', (session['user_id'],))
    tests = c.fetchall()
    
    parsed_tests = []
    for t in tests:
        t_dict = dict(t)
        if t_dict['crop']:
            crop_dict = json.loads(t_dict['crop'])
            t_dict['crop_name'] = crop_dict['name']
        else:
            t_dict['crop_name'] = "Unknown"
        parsed_tests.append(t_dict)
        
    conn.close()
    return render_template('history.html', tests=parsed_tests)

@app.route('/feedback', methods=['GET', 'POST'])
@login_required
def feedback():
    if request.method == 'POST':
        test_id = request.form.get('test_id')
        rating = int(request.form.get('rating', 5))
        useful = request.form.get('useful', 'Yes')
        comment = request.form.get('comment', '')
        
        conn = get_db()
        c = conn.cursor()
        c.execute('''INSERT INTO feedback (test_id, user_id, rating, useful, comment) 
                     VALUES (?, ?, ?, ?, ?)''', (test_id, session['user_id'], rating, useful, comment))
        conn.commit()
        conn.close()
        flash("Thank you for your feedback!", "success")
        return redirect(url_for('dashboard'))
    return render_template('feedback.html', test_id=request.args.get('test_id'))

@app.route('/crop_guide')
def crop_guide():
    from crops_data import CROPS
    return render_template('crop_guide.html', crops=CROPS)

@app.route('/fertilizer_guide')
def fertilizer_guide():
    return render_template('fertilizer_guide.html')

@app.route('/about')
def about():
    return render_template('about.html')

# ================= API ROUTES FOR IOT =================

@app.route('/api/sensor', methods=['POST'])
def api_sensor_post():
    data = request.json
    device_key = data.get('device_key')
    # Validate API key logic could go here
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT INTO sensor_readings (device_key, n, p, k, ph, moisture, temperature)
                 VALUES (?, ?, ?, ?, ?, ?, ?)''',
              (device_key, data.get('n'), data.get('p'), data.get('k'), 
               data.get('ph'), data.get('moisture'), data.get('temperature')))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Data recorded"}), 201

@app.route('/api/sensor/latest', methods=['GET'])
@login_required
def api_sensor_get():
    device_key = request.args.get('device_key', 'demo_key') # In prod, link user to device_key
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT n, p, k, ph, moisture, temperature, created_at 
                 FROM sensor_readings 
                 WHERE device_key=? 
                 ORDER BY created_at DESC LIMIT 1''', (device_key,))
    row = c.fetchone()
    conn.close()
    
    if row:
        return jsonify(dict(row))
    return jsonify({"status": "no_data"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

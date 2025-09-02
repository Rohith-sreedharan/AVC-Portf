from flask import Flask, render_template, request, redirect, url_for, g, flash, jsonify
from config import SystemConfig, SocialConfig
from threading import Thread
from helpers import send_email_admin
import json
import os

app = Flask(__name__)

@app.context_processor
def inject_globals():
    g.facebook_url = SocialConfig.FACEBOOK_URL
    g.twitter_url = SocialConfig.TWITTER_URL
    g.instagram_url = SocialConfig.INSTAGRAM_URL
    g.youtube_url = SocialConfig.YOUTUBE_URL
    g.company_name = SystemConfig.COMPANY_NAME
    g.company_address = SystemConfig.COMPANY_ADDRESS
    g.company_phone = SystemConfig.COMPANY_PHONE
    g.company_email = SystemConfig.COMPANY_EMAIL
    return dict()

# setup sttaic folder
app.static_folder = 'static'
app.static_url_path = '/static'
app.secret_key = "MustBeChangedInProduction"

@app.route('/')
def index():
    try:
        with open('content/reviews.json', 'r') as f:
            all_reviews = json.load(f)
    except FileNotFoundError:
        all_reviews = []

    page = request.args.get('page', 1, type=int)
    per_page = 16  # 4x4 grid
    
    total_reviews = len(all_reviews)
    total_pages = (total_reviews + per_page - 1) // per_page
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    current_reviews = all_reviews[start_idx:end_idx]
    return render_template('index.html', reviews=current_reviews,
                         current_page=page,
                         total_pages=total_pages)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():        
    with open('content.json', 'r') as f:
        content = json.load(f)['contact.html']

    return render_template('contact.html', content=content)

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/testimonials')
def testimonials():
    try:
        with open('content/reviews.json', 'r') as f:
            all_reviews = json.load(f)
    except FileNotFoundError:
        all_reviews = []

    page = request.args.get('page', 1, type=int)
    per_page = 16  # 4x4 grid
    
    total_reviews = len(all_reviews)
    total_pages = (total_reviews + per_page - 1) // per_page
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    current_reviews = all_reviews[start_idx:end_idx]
    
    return render_template('testimonials.html', 
                         reviews=current_reviews,
                         current_page=page,
                         total_pages=total_pages)

@app.route('/shop')
def shop():
    try:
        with open('content/shop.json', 'r') as f:
            products_dict = json.load(f)
            all_products = [{"id": k, **v} for k, v in products_dict.items()]
    except FileNotFoundError:
        all_products = []

    page = request.args.get('page', 1, type=int)
    per_page = 12

    total_products = len(all_products)
    total_pages = (total_products + per_page - 1) // per_page
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    current_products = all_products[start_idx:end_idx]
    
    return render_template('shop.html', 
                         products=current_products,
                         current_page=page,
                         total_pages=total_pages)

@app.route('/shop-details')
def shop_details():
    """Handle shop details page with error handling and data validation."""
    product_id = request.args.get('id')
    
    if not product_id:
        flash('Product ID is required', 'error')
        return redirect(url_for('shop'))

    try:
        with open('content/shop.json', 'r', encoding='utf-8') as f:
            products_dict = json.load(f)
            
        product = products_dict.get(product_id)
        
        if product is None:
            flash('Product not found', 'error')
            return render_template('404.html'), 404

        # Process extended sizes if available
        if 'extended_sizes' in product:
            product['all_sizes'] = {
                'regular': {
                    'sizes': product['Sizes'],
                    'moq': 'No MOQ'
                },
                'extended': {
                    'sizes': product['extended_sizes'],
                    'moq': product.get('extended_moq', '100 MOQ')
                }
            }

        if 'images' in product and len(product['images']) > 0:
            product['available_colors'] = [img['color'] for img in product['images']]
        else:
            product['available_colors'] = []
        
        
        product['images'] = []
        for file in os.listdir(f'static/shop/{product_id}'):
            if file.endswith('.png'):
                product['images'].append({
                    'image_path': f'/shop/{product_id}/{file}',
                    'image_alt': file.split('.')[0]
                })
            
        # Ensure product has all required fields
        required_fields = ['name', 'desc', 'description', 'price', 'image_path', 'image_alt']
        for field in required_fields:
            if field not in product:
                product[field] = ''

        return render_template(
            'shop-details.html',
            product=product,
            phone_number=SystemConfig.COMPANY_PHONE,
            error=None
        )

    except FileNotFoundError:
        app.logger.error('Shop data file not found')
        return render_template('500.html', error="Product data unavailable"), 500
    except json.JSONDecodeError:
        app.logger.error('Invalid shop data format')
        return render_template('500.html', error="Invalid product data"), 500
    except Exception as e:
        app.logger.error(f'Unexpected error: {str(e)}')
        return render_template('500.html', error="An unexpected error occurred"), 500

@app.route('/search/api')
def search_api():
    """API endpoint for live search results"""
    query = request.args.get('q', '').strip().lower()
    category = request.args.get('category', '')
    
    if not query or len(query) < 2:
        return jsonify([])
    
    try:
        with open('content/shop.json', 'r') as f:
            products_dict = json.load(f)
    except FileNotFoundError:
        return jsonify([])
    
    results = []
    for product_id, product in products_dict.items():
        # Search in name, description, and keywords
        search_text = f"{product.get('name', '')} {product.get('desc', '')} {' '.join(product.get('keywords', []))}".lower()
        
        # Category filter
        if category and category != '1':  # '1' is "All Apparels"
            product_category = product.get('category', '').lower()
            category_map = {
                '2': 'men',
                '3': 'women', 
                '4': 'kids'
            }
            if category in category_map and category_map[category] not in product_category:
                continue
        
        # Check if query matches
        if query in search_text:
            results.append({
                'id': product_id,
                'name': product.get('name', ''),
                'desc': product.get('desc', '')[:100] + '...' if len(product.get('desc', '')) > 100 else product.get('desc', ''),
                'image': product.get('image_path', '/static/images/placeholder.png'),
                'price': product.get('price', ''),
                'url': f'/shop-details?id={product_id}'
            })
    
    # Limit results to 8 items
    return jsonify(results[:8])

if __name__ == '__main__':
    app.run(debug=True)
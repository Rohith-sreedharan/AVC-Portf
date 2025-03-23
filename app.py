from flask import Flask, render_template, request, redirect, url_for, g, flash
from config import SystemConfig, SocialConfig
from threading import Thread
from helpers import send_email_admin
import json

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        contents = {
            'firstname': request.form.get('firstname'),
            'lastname': request.form.get('lastname'),
            'email': request.form.get('email'),
            'phone-number': request.form.get('phone-number'),
            'message': request.form.get('message')
        }
        
        Thread(target=send_email_admin, args=(contents,)).start()
        flash('Message sent successfully', 'success')
        return redirect(url_for('contact'))
        
    with open('content.json', 'r') as f:
        content = json.load(f)['contact.html']

    return render_template('contact.html', content=content)

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/location')
def location():
    return render_template('locations.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/shop-details')
def shop_details():
    return render_template('shop-details.html')


if __name__ == '__main__':
    app.run(debug=True)
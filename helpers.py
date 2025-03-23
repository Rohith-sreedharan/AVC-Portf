from flask import render_template
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import SystemConfig

def send_email_admin(contents):
    """
    Send email notification to admin about new contact request using SMTP
    
    Args:
        contents (dict): Dictionary containing form submission details
    """
    try:
        # Create message container
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'New Contact Form Submission'
        msg['From'] = SystemConfig.MAIL_USERNAME
        msg['To'] = SystemConfig.ADMIN_EMAIL

        # Create HTML email body
        html = render_template(
            'extras/admin_email.html',
            first_name=contents.get('firstname'),
            last_name=contents.get('lastname'),
            email=contents.get('email'), 
            phone=contents.get('phone-number'),
            message=contents.get('message')
        )
        
        msg.attach(MIMEText(html, 'html'))

        # Send email via SMTP
        with smtplib.SMTP(SystemConfig.MAIL_URL, 587) as server:
            server.starttls()
            server.login(SystemConfig.MAIL_USERNAME, SystemConfig.MAIL_PASSWORD)
            server.send_message(msg)
            
        return True

    except Exception as e:
        print(f"Error sending admin email: {str(e)}")
        return False

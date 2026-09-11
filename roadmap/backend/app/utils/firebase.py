import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def _init_firebase():
    if firebase_admin._apps:
        return

    # On Render: use individual environment variables (firebase_key.json is gitignored)
    project_id = os.getenv("FIREBASE_PROJECT_ID")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL")

    if project_id and private_key and client_email:
        # Replace escaped newlines that Render may encode
        private_key = private_key.replace("\\n", "\n")
        cert = {
            "type": "service_account",
            "project_id": project_id,
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
            "private_key": private_key,
            "client_email": client_email,
            "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email.replace('@', '%40')}",
            "universe_domain": "googleapis.com"
        }
        cred = credentials.Certificate(cert)
    else:
        # Local dev fallback: use the JSON file
        key_path = os.getenv("FIREBASE_KEY_PATH", "firebase_key.json")
        cred = credentials.Certificate(key_path)

    firebase_admin.initialize_app(cred)

_init_firebase()
db = firestore.client()

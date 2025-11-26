import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os

def send_email(to_email, subject, html_content):
    config = sib_api_v3_sdk.Configuration()
    config.api_key['api-key'] = os.getenv("BREVO_API_KEY")

    api_client = sib_api_v3_sdk.ApiClient(config)
    email_api = sib_api_v3_sdk.TransactionalEmailsApi(api_client)

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": to_email}],
        sender={"email": "topfadighribi11@gmail.com"},
        subject=subject,
        html_content=html_content
    )

    try:
        response = email_api.send_transac_email(email)
        return response
    except ApiException as e:
        print("Erreur:", e)
        return None

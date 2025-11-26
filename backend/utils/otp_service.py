
import secrets
import time

class OTPService:
    EXPIRATION_SECONDS = 300

    @staticmethod
    def generate_code():
        """
        Génère un code à 6 chiffres sécurisé
        """
        return str(secrets.randbelow(1000000)).zfill(6)

    @staticmethod
    def create_otp():
        """
        Crée un OTP avec la date d'expiration
        """
        return {
            "code": OTPService.generate_code(),
            "expires_at": int(time.time()) + OTPService.EXPIRATION_SECONDS
        }

    @staticmethod
    def is_expired(expires_at):
        """
        Vérifie si l'OTP est expiré
        """
        return time.time() > expires_at

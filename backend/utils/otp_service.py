
import secrets
import time

class OTPService:
    EXPIRATION_SECONDS = 300

    @staticmethod
    def generate_code():

        return str(secrets.randbelow(1000000)).zfill(6)

    @staticmethod
    def create_otp():

        return {
            "code": OTPService.generate_code(),
            "expires_at": int(time.time()) + OTPService.EXPIRATION_SECONDS
        }

    @staticmethod
    def is_expired(expires_at):

        return time.time() > expires_at

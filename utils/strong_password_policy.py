import string
import random

class StrongPasswordPolicyUtils:
    """Strong password policy utility class. Strong password requirements:
    1. Must atleast 8 characters
    2. Contain uppercase characters A-Z (Latin alphabet)
    3. Contain lowercase characters a-z (Latin alphabet)
    4. Contain digits 0-9
    5. Contain special characters (!, $, #, %, etc.)
    """

    password_length = 8

    def __init__(self, password_length=8):
        """Class initialization"""

        self.password_length = 8 if password_length < 8 else password_length

    def generate_strong_password(self) -> str:
        """Generate strong password."""
        try:
            strong_password = "".join(random.choice(string.ascii_letters) for _ in range(self.password_length-8))

            # Add lowercase characters
            strong_password += "".join(random.choice(string.ascii_lowercase) for _ in range(2))

            # Add uppercase characters
            strong_password += "".join(random.choice(string.ascii_uppercase) for _ in range(2))

            # Add digits
            strong_password += "".join(random.choice(string.digits) for _ in range(2))

            # Add special characters
            strong_password += "".join(random.choice(string.punctuation) for _ in range(2))

            # Shuffle the password
            strong_password = list(strong_password)
            random.shuffle(strong_password)
            strong_password = "".join(strong_password)

            return strong_password
        except Exception as exc:
            raise ValueError(exc)

    def has_contain_lowercase_characters(self, password:str) -> bool:
        """Check if the given password has contain lowercase characters"""
        try:
            has_contain = False

            for lowercase in string.ascii_lowercase:
                if lowercase in password:
                    has_contain = True
                    break

            return has_contain
        except Exception as exc:
            raise ValueError(exc)

    def has_contain_uppercase_characters(self, password:str) -> bool:
        """Check if the given password has contain uppercase characters"""
        try:
            has_contain = False

            for uppercase in string.ascii_uppercase:
                if uppercase in password:
                    has_contain = True
                    break

            return has_contain
        except Exception as exc:
            raise ValueError(exc)

    def has_contain_digits(self, password:str) -> bool:
        """Check if the given password has contain digits"""
        try:
            has_contain = False

            for digit in string.digits:
                if digit in password:
                    has_contain = True
                    break

            return has_contain
        except Exception as exc:
            raise ValueError(exc)

    def has_contain_special_characters(self, password:str) -> bool:
        """Check if the given password has contain special characters"""
        try:
            has_contain = False

            for special_character in string.punctuation:
                if special_character in password:
                    has_contain = True
                    break

            return has_contain
        except Exception as exc:
            raise ValueError(exc)

    def is_strong_password(self, password:str) -> bool:
        """Check if the given password meets the strong password requirements"""
        try:
            is_strong_password = True
            password_requirements = []

            if len(password) < self.password_length:
                is_strong_password = False
                password_requirements.append("Must at least 8 characters")

            if not self.has_contain_lowercase_characters(password):
                is_strong_password = False
                password_requirements.append("Contain at least 1 lowercase character(a-z)")
                
            if not self.has_contain_uppercase_characters(password):
                is_strong_password = False
                password_requirements.append("Contain at least 1 uppercase character(A-Z)")
                
            if not self.has_contain_digits(password):
                is_strong_password = False
                password_requirements.append("Contain at least 1 digit(0-9)")
                
            if not self.has_contain_special_characters(password):
                is_strong_password = False
                password_requirements.append("Contain at least 1 special character(!, $, #, %, etc.)")

            return is_strong_password, password_requirements
        except Exception as exc:
            raise ValueError(exc)
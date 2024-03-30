from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash the password
    :param password:
    :return:
    """
    return pwd_context.hash(password)

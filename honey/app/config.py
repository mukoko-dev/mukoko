from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str = ""
    model_path: str = "/app/models"
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()

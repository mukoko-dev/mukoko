from fastapi import FastAPI
from prometheus_client import make_asgi_app

app = FastAPI(
    title="Nuchi Honey",
    description="Privacy-first personalization engine for Mukoko",
    version="0.1.0",
)

# Mount prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "nuchi-honey"}


@app.get("/")
async def root():
    return {"message": "Nuchi Honey — Your Honey. Your Identity. Your Sovereignty."}

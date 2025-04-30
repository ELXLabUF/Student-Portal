# app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()
client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY"),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    transcript: str

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/improve-transcript")
async def improve_transcript(req: TranscriptRequest):
    try:
        response = client.responses.create(
            model="gpt-4o",
            instructions = "Make this transcript more readable and natural. Don't change the meaning or make it unnecessarily long. Help to improve the learning content of the story.",
            input = req.transcript,
        )
        return {"improvedTranscript": response.output_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
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
    allow_origins=["http://localhost:4200", "https://vermillion-longma-130816.netlify.app"],  # or use ["*"] to allow all origins
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
        instructions = """
            I want you to evaluate my story based on this rubric:
            Scientific Storytelling Rubric (Out of 15 Points Total)
            1. Science Concept (0–5)
            • Is there a clear and accurate science concept present?
            (Examples: gravity, friction, force, motion)
            • Scoring:
            o 0 = None
            o 5 = Accurate and specific
            2. Explanation Quality (0–5)
            • How well does the student explain the concept?
            • Is cause-and-egect reasoning used?
            • Scoring:
            o 0 = Unclear or incorrect
            o 5 = Clearly explained and well-reasoned
            3. Real-Life Connection (0–5)
            • Is the science applied to a personal experience, observation, or experiment?
            • Scoring:
            o 0 = None or random
            o 5 = Meaningful and relevant connection
            Scoring Guide
            • 13–15 points (Excellent): Demonstrates a strong understanding of the science
            concept, explains it clearly, and connects it meaningfully to real life.
            • 10–12 points (Good): Science idea is accurate and relevant, though explanation or
            connection may be a little weak.
            • 7–9 points (Fair): Science is present but vaguely explained or loosely connected to
            the story.
            • 4–6 points (Needs Improvement): Science is mentioned, but explanation is
            incorrect, confusing, or too superficial.
            • 0–3 points (Incomplete/Incorrect): No identifiable science concept, or explanation
            is completely incorrect or off-topic.
            I do not want you to share my evaluation with me. You are to use the scoring to create an
            “Improvement Prompt” that highlights an area where my story could be strengthened, as
            well as how I could potentially strengthen it, in an encouraging tone that fosters creative
            thinking. The prompt should be no more than 2 sentences. No other text outside of the improvement prompt should be
            returned.
            If I ask you for another prompt, you are to provide a new, unique prompt, but only upon
            request, and you can only provide one at a time. I request another prompt for 2 reasons.
            1. I did not like or understand the original prompt. You will know this is the case if I ask
            for a new prompt and do not submit an updated story. In this case, you must abide
            by your original evaluation of my story to oger another Improvement Prompt.
            2. I have implemented your suggestion, and I want to further improve my story. You will
            know this is the case if I submit a story with my request. In this case, you must
            evaluate my new and improved story in order to create an Improvement Prompt
            based on its scoring.
        """

        response = client.responses.create(
            model="gpt-4o",
            instructions=instructions,
            input=req.transcript,
        )
        return {"improvementPrompt": response.output_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/api/generate-images")
async def generate_images(req: TranscriptRequest):
    try:
        image_urls = []

        prompt = f"""
        {req.transcript}\n
        I am an elementary-school-aged student, connecting my everyday experiences to the
        scientific concepts I am learning in school. I would like you to develop an educational
        graphic in a “Cartoon” design style based on the story I just shared with you, that tie the
        story to the underlying scientific concept. I do not want the image to have text within itself,
        or to have an accompanying caption.
        """

        for _ in range(3):
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="url",
            )
            image_urls.append(response.data[0].url)
        return {"imageUrls": image_urls}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8080))  # required for Cloud Run
    uvicorn.run("app:app", host="0.0.0.0", port=port)
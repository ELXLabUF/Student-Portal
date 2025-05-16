# app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import requests
import base64
import os
import firebase_admin
from firebase_admin import credentials, storage
import uuid

if not firebase_admin._apps:
    cred = credentials.Certificate("contextualizer-e57ed-firebase-adminsdk-m00y0-7e8e2e57dd.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'contextualizer-e57ed.appspot.com'
    })

load_dotenv()
app = FastAPI()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "https://vermillion-longma-130816.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    transcript: str

class UploadImageRequest(BaseModel):
    imageUrl: str
    transcriptId: str
    deviceId: str

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
            model="gpt-4.1-mini",
            instructions=instructions,
            input=req.transcript,
        )
        return {"improvementPrompt": response.output_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/api/generate-images")
async def generate_images(req: TranscriptRequest):
    try:
        # Stores the image urls to send to frontend
        image_urls = []

        prompt = f"""
        {req.transcript}\n
        I am an elementary-school-aged student, connecting my everyday experiences to the
        scientific concepts I am learning in school. I would like you to develop an educational
        graphic in a “Cartoon” design style based on the story I just shared with you, that tie the
        story to the underlying scientific concept. I absolutely do not want the image to have text within itself,
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

        # The code below uses gpt-image-1, which can generate multiple images at once, but still takes about 1 minute. No difference with implementation above.
                
        # response = client.images.generate(
        #     model="gpt-image-1",
        #     prompt=prompt,
        #     n=3,
        #     size="1024x1024"
        # )
        # print("response: " + response)
        # print("response.data: " + response.data)

        # image_base64 = response.data[0].b64_json
        # image_bytes = base64.b64decode(image_base64)


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload-image")
async def upload_image(data: UploadImageRequest):
    try:
        # Fetch the image from the provided URL
        response = requests.get(data.imageUrl)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch image from source")
        image_data = response.content

        # Generate a unique filename for the image
        filename = f"{data.transcriptId or uuid.uuid4()}.png"
        print("deviceId:", data.deviceId)
        print("filename:", filename)

        # Upload the image to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(f"transcript-images/{data.deviceId}/{filename}")
        blob.upload_from_string(image_data, content_type="image/png")
        blob.make_public()

        # Return the public URL of the uploaded image
        return {"firebaseUrl": blob.public_url}

    except Exception as e:
        # Handle any exceptions and return an HTTP error
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
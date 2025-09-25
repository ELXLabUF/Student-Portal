# StoryLoop

## How the Backend Works

-   **Framework:** FastAPI (Python)
-   **Features:**
    -   Receives transcripts from the frontend.
    -   Calls OpenAI API to generate improvement prompts and educational images.
    -   Stores images and transcript data in Firebase.
-   **Key Endpoints:**
    -   `/api/improve-transcript` — Get improvement suggestions for a transcript.
    -   `/api/generate-images` — Generate 3 educational images from a transcript.
    -   `/api/upload-image` — Upload and assign an image to a transcript.

## How the Frontend Works

-   **Framework:** Angular
-   **Features:**
    -   Displays transcripts as cards.
    -   Lets users edit transcripts, view AI suggestions, generate/select images, and send transcripts to the teacher.
    -   Lets users filter their own transcripts by capture/topic.
    -   Communicates with the backend for all AI and storage actions.
    -   Pulls from Firebase to display classmates' experiences as well.

## Running Locally

**Backend:**

1. Install Python dependencies:
   `pip install -r requirements.txt`
2. Set up environment variables in `.env` for OpenAI and add the Firebase `config.json` file.
3. Start the server:
   `uvicorn app:app --reload --port 8080`

**Frontend:**

1. Install dependencies:
   `cd frontend && npm install`
2. Start the dev server:
   `ng serve`

## Deployment

**Frontend:** Deploys on Netlify at [https://storyloop.netlify.app/login](https://storyloop.netlify.app/login).

-   Navigate to the frontend directory using the `cd frontend/` command.
-   Run the command `ng build` or `ng build --configuration production`.
-   Navigate to the dist/frontend/browser directory inside your frontend directory.
-   Change the `index.csr.html` file's name to `index.html`.
-   On the Netlify dashboard, under this project's tab open the 'Deploys' section and drag-and-drop the entire browser directory.

**Backend:** Deploys on Google Cloud Run with a Docker container.

-   Download and install the Google Cloud SDK.
-   Use the lab's Google account to login when prompted while running the installer.
-   Make sure you have Docker Desktop or Docker running on your machine.
-   Update the Dockerfile, if necessary.
-   Navigate to the backend directory using the `cd backend/` command.
-   With Docker running in the background, run this command:

    ```
    gcloud run deploy student-portal-backend \
      --source . \
      --platform managed \
      --region us-east1 \
      --allow-unauthenticated \
      --set-env-vars OPENAI_API_KEY=your-openai-key
    ```

---

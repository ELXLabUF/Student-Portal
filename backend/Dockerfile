# Use slim Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app code
COPY . .

# Required for Cloud Run: expose port 8080
EXPOSE 8080

# Start FastAPI using uvicorn
CMD ["python", "app.py"]


# Use official Python base image
FROM python:3.10-slim

# Install system dependencies (Tesseract OCR & required libraries)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source files and datasets
COPY . .

# Set environment variables
ENV TESSERACT_CMD=tesseract
ENV PORT=8000

# Expose port
EXPOSE 8000

# Command to run the application using uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]

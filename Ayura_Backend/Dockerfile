# Use official Python base image (stable bookworm release with Python 3.11+)
FROM python:3.11-slim-bookworm

# Set non-interactive environment for package manager
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies (Tesseract OCR & required libraries)
# Uses clean, fix-missing and no-install-recommends for maximum build robustness
RUN apt-get clean && \
    apt-get update --fix-missing -y && \
    apt-get install -y --no-install-recommends \
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

# Compile CSVs to SQLite and discard raw CSV files to minimize container footprint
RUN python convert_to_sqlite.py && rm -f *.csv

# Set environment variables
ENV TESSERACT_CMD=tesseract
ENV PORT=8000

# Expose port
EXPOSE 8000

# Command to run the application using uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]

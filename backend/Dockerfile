FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY . .

# Ensure the script is executable
RUN chmod +x /app/scripts/start.sh

CMD ["/app/scripts/start.sh"]

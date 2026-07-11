FROM python:3.13-slim

WORKDIR /app

# Instalar Litestream
RUN apt-get update && apt-get install -y wget ca-certificates && \
    wget -qO /tmp/litestream.tar.gz \
      https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.tar.gz && \
    tar xzf /tmp/litestream.tar.gz -C /usr/local/bin/ && \
    rm /tmp/litestream.tar.gz && \
    apt-get purge -y wget && apt-get autoremove -y && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /data

EXPOSE 8080

RUN chmod +x scripts/start.sh
CMD ["scripts/start.sh"]

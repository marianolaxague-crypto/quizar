#!/bin/sh
set -e

mkdir -p /data

if [ -n "$LITESTREAM_REPLICA_URL" ]; then
  echo "Restaurando DB desde R2..."
  litestream restore -config /app/litestream.yml -if-replica-exists /data/brujula.db || true
  echo "Iniciando con replicación Litestream..."
  exec litestream replicate -config /app/litestream.yml \
    -exec "uvicorn main:app --host 0.0.0.0 --port 8080 --workers 1"
else
  echo "Sin Litestream (LITESTREAM_REPLICA_URL no configurado)"
  exec uvicorn main:app --host 0.0.0.0 --port 8080 --workers 1
fi

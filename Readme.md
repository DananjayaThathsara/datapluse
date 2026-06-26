# DataPulse

Real-time event analytics platform built with NestJS microservices, Kafka, Elasticsearch, and Claude AI.

## Tech Stack

- **Backend**: 5 NestJS microservices (TypeScript)
- **Database**: PostgreSQL + Elasticsearch
- **Messaging**: Kafka
- **Frontend**: React + TypeScript + Tailwind CSS
- **AI**: Anthropic Claude API
- **Auth**: JWT + Passport
- **Real-time**: WebSockets (Socket.IO)
- **Infrastructure**: Docker + Docker Compose

## Services

| Service | Port | Role |

| api-gateway | 3000 | JWT auth + request proxy |
| ingest-service | 3001 | Save events to PostgreSQL + publish to Kafka |
| search-service | 3002 | Index events to Elasticsearch |
| alert-service | 3003 | Push live alerts via WebSocket |
| ai-insight-service | 3004 | AI summaries every 60s via Claude |

## How it works

1. User fires an event from the dashboard
2. API Gateway validates JWT and forwards to ingest-service
3. ingest-service saves to PostgreSQL and publishes to Kafka
4. search-service indexes the event to Elasticsearch
5. alert-service pushes the event to the browser via WebSocket in real time
6. Every 60 seconds, AI insight service reads Elasticsearch and sends a plain English summary via Claude AI

## Running locally

# Start infrastructure

docker start zookeeper kafka elasticsearch

# Start all services (separate terminals)

cd services/api-gateway && npm run start:dev
cd services/ingest-service && npm run start:dev
cd services/search-service && npm run start:dev
cd services/alert-service && npm run start:dev
cd services/ai-insight-service && npm run start:dev
cd frontend && npm run dev

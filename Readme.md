# DataPulse

Real-time event analytics platform. Events come in, get saved, appear on screen instantly, and an AI summarizes everything every 60 seconds.


## Tech Stack

- **Backend** - NestJS (TypeScript), 5 microservices
- **Database** - PostgreSQL, Elasticsearch
- **Messaging** - Kafka
- **Frontend** - React, TypeScript, Tailwind CSS
- **AI** - Anthropic Claude API
- **Auth** - JWT, Passport, bcrypt
- **Real-time** - WebSockets via Socket.IO
- **Infrastructure** - Docker, Docker Compose
- **Deployment** - Railway (backend), Hostinger (frontend)

## Services

| Service | Port | Role |
|-|-|-|
| api-gateway | 3000 | JWT auth, proxy to internal services |
| ingest-service | 3001 | Save events to PostgreSQL, publish to Kafka |
| search-service | 3002 | Kafka consumer, index events to Elasticsearch |
| alert-service | 3003 | Kafka consumer, push events to browser via WebSocket |
| ai-insight-service | 3004 | Every 60s - read Elasticsearch, call Claude, push summary |

## How It Works

1. User logs in - API Gateway issues a JWT token
2. User fires an event - frontend sends POST to API Gateway
3. API Gateway validates JWT and forwards to ingest-service
4. ingest-service saves the event to PostgreSQL
5. ingest-service publishes the event to Kafka topic `events.created`
6. search-service receives from Kafka and indexes to Elasticsearch
7. alert-service receives from Kafka and pushes to browser via WebSocket - under 100ms
8. Every 60 seconds - ai-insight-service reads Elasticsearch, sends to Claude, pushes plain English summary to dashboard

## Running Locally

### 1. Start infrastructure

```bash
docker start zookeeper kafka elasticsearch
```

If containers do not exist yet:

```bash
docker run -d --name zookeeper -p 2181:2181 \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  confluentinc/cp-zookeeper:7.5.0

docker run -d --name kafka -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:7.5.0

docker run -d --name elasticsearch -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  elasticsearch:8.13.0
```

### 2. Set environment variables

**api-gateway/.env**
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=datapulse
JWT_SECRET=your-secret
INGEST_SERVICE_URL=http://localhost:3001
SEARCH_SERVICE_URL=http://localhost:3002
```

**ingest-service/.env**
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=datapulse
KAFKA_BROKER=localhost:9092
```

**search-service/.env**
```
PORT=3002
ES_NODE=http://localhost:9200
KAFKA_BROKER=localhost:9092
```

**alert-service/.env**
```
PORT=3003
KAFKA_BROKER=localhost:9092
```

**ai-insight-service/.env**
```
PORT=3004
ES_NODE=http://localhost:9200
ANTHROPIC_API_KEY=your-key-here
```

**frontend/.env**
```
VITE_API_URL=http://localhost:3000
VITE_ALERT_WS_URL=http://localhost:3003
VITE_AI_WS_URL=http://localhost:3004
```

### 3. Install dependencies

```bash
cd services/api-gateway && npm install
cd ../ingest-service && npm install
cd ../search-service && npm install
cd ../alert-service && npm install
cd ../ai-insight-service && npm install
cd ../../frontend && npm install
```

### 4. Start all services

```bash
# Terminal 1
cd services/api-gateway && npm run start:dev

# Terminal 2
cd services/ingest-service && npm run start:dev

# Terminal 3
cd services/search-service && npm run start:dev

# Terminal 4
cd services/alert-service && npm run start:dev

# Terminal 5
cd services/ai-insight-service && npm run start:dev

# Terminal 6
cd frontend && npm run dev
```

Open **http://localhost:5173** - register, login, fire events.

## Project Structure

```
datapulse/
├── services/
│   ├── api-gateway/
│   ├── ingest-service/
│   ├── search-service/
│   ├── alert-service/
│   └── ai-insight-service/
├── frontend/
└── docker-compose.yml
```

## API Endpoints

```
POST  /auth/register        register a new account
POST  /auth/login           login and receive JWT

POST  /events               create an event
GET   /events               list events (paginated)
GET   /events/stats         severity breakdown
GET   /events/:id           single event

GET   /search?q=keyword     full-text search via Elasticsearch
```

## Author

Dananjaya Thathsara - Senior Full Stack Engineer, Dubai UAE
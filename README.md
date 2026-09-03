# 🚀 Multi-Tenant Edge API Gateway & Traffic Shaper

A high-performance reverse proxy and traffic shaping engine built with Node.js, TypeScript, Express, WebSockets, and MongoDB.

## 🌟 Features
- **Dynamic Reverse Proxy:** Routes incoming requests to downstream microservices based on tenant API keys.
- **In-Memory Token Bucket Rate Limiter:** Protects upstream APIs with sub-millisecond evaluation.
- **Real-Time Telemetry:** Stream latency ($p_{50}$, $p_{99}$) and request statuses live over WebSockets.
- **Multi-Tenant Administration:** Register tenants and configure quotas on the fly.

## 🛠️ Tech Stack
- **Backend:** Node.js, TypeScript, Express, `http-proxy-middleware`, `ws`
- **Database:** MongoDB, Mongoose
- **Tooling:** Docker, `ts-node-dev`

## 🚀 Quick Start Instructions

1. **Extract the ZIP file** and open the folder in **VS Code**.
2. **Start MongoDB** locally or obtain a MongoDB Atlas Connection String.
3. **Configure Environment Variables:**
   - In `server/`, copy `.env.example` to `.env` and set your `MONGODB_URI`.
4. **Install & Run Server:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
5. **Test Gateway:**
   - Create a Tenant: `POST http://localhost:5000/api/tenants`
   - Send requests through the gateway: `GET http://localhost:5000/gateway/<YOUR_API_KEY>/`

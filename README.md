# Transaction Risk Monitoring

A full-stack financial surveillance system that monitors transactions in real-time, applies configurable business rules, computes risk scores automatically, and displays actionable alerts on a live dashboard.

## Table of Contents
- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Core Features](#core-features)
- [Rule Engine](#rule-engine)
- [Risk Scoring](#risk-scoring)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [AWS EC2 Deployment](#aws-ec2-deployment)
- [API Endpoints](#api-endpoints)
- [Dashboard](#dashboard)
- [Future Enhancements](#future-enhancements)

## Introduction
In modern financial systems, digital transactions have exploded due to online banking, UPI, securities trading, and cross-border payments. This growth amplifies risks like fraud, money laundering, and compliance violations.

**transaction_risk_monitoring** continuously monitors transaction streams, applies configurable rules, computes risk scores, and presents alerts on a live dashboard. It is designed for investment banking, payments, AML, and audit teams.

## Problem Statement
Legacy surveillance systems suffer from:
- **Batch processing** - End-of-day analysis misses real-time fraud.
- **Rigid rules** - Code changes are needed for new scenarios.
- **No live visibility** - Risk teams lack a unified real-time view.
- **Weak audit trails** - Flagged transactions lack clear justification.

## Objectives
- Build a real-time transaction monitoring system.
- Create a configurable rule engine for thresholds, velocity, and patterns.
- Compute per-transaction risk scores automatically.
- Deliver a live compliance dashboard with alerts.
- Maintain complete audit-ready logs.
- Design a scalable architecture for financial environments.

## System Architecture
```text
┌─────────────────────────────────────────────────────────────┐
│                    React.js Dashboard                        │
│              (Live UI - localhost:3000)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API Calls (axios)
┌─────────────────────▼───────────────────────────────────────┐
│              Spring Boot Backend (Port 8080)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Transaction │  │  Rule Engine  │  │   Transaction    │   │
│  │ Controller  │→ │  (Easy Rules) │→ │    Service       │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         │                                    │               │
│  ┌──────▼────────────────────────────────────▼────────────┐ │
│  │              Transaction Repository (JPA)               │ │
│  └─────────────────────────┬───────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    MySQL Database                            │
│                  (surveillance_db)                           │
└─────────────────────────────────────────────────────────────┘
```

## Technologies Used
| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React.js | Live compliance dashboard |
| Backend | Java 21 + Spring Boot | REST APIs, business logic |
| Rule Engine | Easy Rules | Configurable risk evaluation |
| Database | MySQL 8.0 | Transaction and risk score storage |
| ORM | Spring Data JPA + Hibernate | Database operations |
| Charts | Recharts | Risk visualization |
| HTTP | Axios | Frontend-backend communication |
| Build | Maven, npm | Dependency management |

## Prerequisites
- Java 21
- Maven 3.9+
- MySQL 8.0+
- Node.js v20+ and npm
- IntelliJ IDEA or VS Code
- AWS EC2 account for deployment

## Core Features
1. Real-time transaction ingestion via REST API.
2. Configurable rule engine without frequent code changes.
3. Automatic risk scoring on a 0-100 scale.
4. Live dashboard with color-coded alerts.
5. Audit trail for every decision.

## Rule Engine
Each rule adds risk points:

| Rule | Condition | Risk Points |
|------|-----------|-------------|
| High Amount | > ₹10L | +40 |
| Medium Amount | > ₹5L | +20 |
| Withdrawal | Type=WD | +15 |
| International | Type=INTL | +25 |
| Crypto | Type=CRYPTO | +30 |
| Same Account | from = to | +50 |
| Late Night | 12am-5am | +20 |

**Example Rule:**
```java
@Component
@Rule(name = "HighAmountRule")
public class HighAmountRule {
    @Condition
    public boolean when(@Fact("transaction") Transaction t) {
        return t.getAmount() > 1000000;
    }

    @Action
    public void then(@Fact("transaction") Transaction t) {
        t.setRiskScore(t.getRiskScore() + 40);
    }
}
```

## Risk Scoring
| Score | Status | Indicator |
|-------|--------|-----------|
| 0-39 | PENDING | 🟢 |
| 40-74 | FLAGGED | 🟡 |
| 75-100 | ESCALATED | 🔴 |

## Project Structure
```text
surveillance-engine/          # Spring Boot Backend
├── src/main/java/com/surveillance/
│   ├── model/Transaction.java
│   ├── repository/TransactionRepository.java
│   ├── service/TransactionService.java
│   ├── controller/TransactionController.java
│   └── rules/*.java
└── pom.xml

surveillance-ui/              # React Frontend
├── src/App.js
├── package.json
└── public/
```

## Local Setup
### Backend
1. Configure MySQL and create a database user.
```sql
CREATE DATABASE surveillance_db;
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON surveillance_db.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

2. Update `surveillance-engine/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/surveillance_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

3. Build and run the backend:
```bash
cd surveillance-engine
./mvnw clean install
./mvnw spring-boot:run
```

4. Verify the backend:
```bash
curl http://localhost:8080
```

### Frontend
1. Keep the API URL local during development:
```js
const API_URL = 'http://localhost:8080';
```

2. Install and run the frontend:
```bash
cd surveillance-ui
npm install
npm start
```

3. Open the dashboard:
```text
http://localhost:3000
```

## AWS EC2 Deployment
### 1. Connect to EC2
```bash
ssh -i "your-keypair.pem" ubuntu@<ec2-public-ip>
```

### 2. Open required ports in AWS
In the EC2 Security Group, allow inbound traffic for:
- TCP 22 for SSH.
- TCP 8080 for Spring Boot backend.
- TCP 3000 for React frontend.

### 3. Build and run the backend on EC2
```bash
cd ~/javaproject/transaction_risk_monitoring/surveillance-engine
./mvnw clean package
nohup java -jar target/*.jar > app.log 2>&1 &
```

### 4. Check backend status
```bash
ps -ef | grep java
curl http://localhost:8080
```

### 5. Update the frontend API URL for EC2
Before building the React app, update `surveillance-ui/src/App.js`:
```js
const API_URL = 'http://<ec2-public-ip>:8080';
```

### 6. Build and run the React frontend on EC2
```bash
cd ~/javaproject/transaction_risk_monitoring/surveillance-ui
npm install
npm run build
sudo npm install -g serve
nohup serve -s build -l 3000 > react.log 2>&1 &
```

### 7. Check frontend status
```bash
ps -ef | grep serve
curl http://localhost:3000
```

### 8. Open the deployed app
```text
http://<ec2-public-ip>:3000
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions/{id}` | Get transaction by ID |
| POST | `/api/transactions` | Create and auto-score a transaction |
| PUT | `/api/transactions/{id}` | Update a transaction |

**Sample POST:**
```json
{
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 1500000,
  "transactionType": "TRANSFER"
}
```

## Dashboard
- Transaction form to add transactions instantly.
- Live table with color-coded risk indicators.
- Edit mode to update existing transactions.
- Risk visualization with green, yellow, and red states.

## Stopping Services
### Stop backend
```bash
ps -ef | grep java
kill <pid>
```

### Stop frontend
```bash
ps -ef | grep serve
kill <pid>
```

## Future Enhancements
- Kafka for high-throughput streaming.
- WebSockets for real-time updates.
- ML anomaly detection.
- Graph analysis for transaction networks.
- Docker and Kubernetes deployment.
- Multi-tenant support.

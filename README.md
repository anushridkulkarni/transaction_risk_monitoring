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
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Dashboard](#dashboard)
- [Future Enhancements](#future-enhancements)
## Introduction
In modern financial systems, digital transactions have exploded due to online banking, UPI, securities trading, and cross-border payments. This growth amplifies risks like fraud, money laundering, and compliance violations.

**transaction_risk_monitoring** continuously monitors transaction streams, applies configurable rules, computes risk scores, and presents alerts on a live dashboard. Perfect for investment banking, payments, AML, and audit teams.
## Problem Statement
Legacy surveillance systems suffer from:
- **Batch processing** - End-of-day analysis misses real-time fraud
- **Rigid rules** - Code changes needed for new scenarios
- **No live visibility** - Risk teams lack unified real-time views
- **Weak audit trails** - Flagged transactions lack clear justification
## Objectives
- Build real-time transaction monitoring system
- Create configurable rule engine (thresholds, velocity, patterns)
- Compute per-transaction risk scores automatically
- Deliver live compliance dashboard with alerts
- Maintain complete audit-ready logs
- Design scalable architecture for financial environments
## System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    React.js Dashboard                        │
│         (Live UI - localhost:3000)                          │
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
| **Frontend** | React.js | Live compliance dashboard |
| **Backend** | Java 21 + Spring Boot | REST APIs, business logic |
| **Rule Engine** | Easy Rules | Configurable risk evaluation |
| **Database** | MySQL 8.0 | Transaction & risk score storage |
| **ORM** | Spring Data JPA + Hibernate | Database operations |
| **Charts** | Recharts | Risk visualization |
| **HTTP** | Axios | Frontend-backend communication |
| **Build** | Maven (Backend), npm (Frontend) | Dependency management |
## Prerequisites
- **Java 21** (OpenJDK recommended)
- **Maven 3.9+**
- **MySQL 8.0+**
- **Node.js v20+** and **npm**
- **IntelliJ IDEA** (recommended for Java)
- **VS Code** (optional for React)
## Backend Setup
### 1. Database Setup
```sql
CREATE DATABASE surveillance_db;
USE surveillance_db;

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_account VARCHAR(50) NOT NULL,
    to_account VARCHAR(50) NOT NULL,
    amount DOUBLE NOT NULL,
    transaction_type VARCHAR(50),
    risk_score INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
### 2. Configure Database
Update `surveillance-engine/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/surveillance_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```
### 3. Build & Run Backend
```bash
cd surveillance-engine
./mvnw clean install
./mvnw spring-boot:run
```
**Backend runs on: `http://localhost:8080`**
## Frontend Setup
```bash
cd surveillance-ui
npm install
npm start
```
**Dashboard runs on: `http://localhost:3000`**
## Core Features
1. **Real-Time Transaction Ingestion** via REST API
2. **Configurable Rule Engine** - Add rules without code changes
3. **Automatic Risk Scoring** (0-100 scale)
4. **Live Dashboard** with color-coded alerts
5. **Full Audit Trail** for every decision
## Rule Engine
Each rule adds risk points:

| Rule | Condition | Risk Points |
|------|-----------|-------------|
| High Amount | > ₹10L | +40 |
| Medium Amount | > ₹5L | +20 |
| Withdrawal | Type=WD | +15 |
| International | Type=INTL | +25 |
| Crypto | Type=CRYPTO | +30 |
| Same Account | from=to | +50 |
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
```
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
## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions` | List all transactions |
| `GET` | `/api/transactions/{id}` | Get transaction by ID |
| `POST` | `/api/transactions` | Create + auto-score |
| `PUT` | `/api/transactions/{id}` | Update transaction |

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
- **Transaction Form** - Add transactions instantly
- **Live Table** - Color-coded risk indicators
- **Edit Mode** - Update any transaction
- **Risk Visualization** - 🟢🟡🔴 indicators
## Future Enhancements
- Kafka for high-throughput streaming
- WebSockets for real-time updates
- ML anomaly detection
- Graph analysis for networks
- Docker/Kubernetes deployment
- Multi-tenant support

***

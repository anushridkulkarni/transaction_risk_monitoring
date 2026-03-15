# transaction_risk_monitoring
A full-stack financial surveillance system that monitors transactions in real time, applies configurable business rules, computes risk scores automatically, and displays actionable alerts on a live dashboard.

 Table of Contents

Introduction
Problem Statement
Objectives
System Architecture
Tech Stack
Core Features
Rule Engine
Risk Scoring
Project Structure
Getting Started
API Endpoints
Dashboard
Future Enhancements


 Introduction
In modern financial systems, the volume and velocity of digital transactions have increased dramatically due to online banking, payment gateways, UPI, securities trading, and cross-border remittances. This growth has also led to rising risks: fraud, money laundering, insider trading, sanction violations, and operational errors.
The Real-Time Transaction Risk & Rule-Based Surveillance Engine is a platform designed to:

Continuously monitor transactional data streams
Apply configurable business and compliance rules
Compute risk scores automatically
Present actionable alerts on a live dashboard

Suitable for use in investment banking, payments, anti-money laundering (AML), and internal audit environments.

 Problem Statement
Traditional surveillance systems in financial institutions have several limitations:

Batch Processing — Legacy systems analyze transactions at end of day, delaying detection of fraudulent activity
Rigid Rules — Changing rules requires code changes and long deployment cycles
Limited Real-Time Visibility — Compliance and risk teams lack a unified live view of ongoing risk exposure
Weak Audit Trails — Justification for flagged transactions is not always clear or traceable

Solution: A real-time, rule-based, transparent, and configurable surveillance engine that ingests transaction streams, applies complex rules, calculates risk scores, visualizes risks on a live dashboard, and maintains complete audit-ready logs.

Objectives

Design and implement a real-time transaction monitoring system
Build a rule engine supporting thresholds, velocity checks, and pattern-break detection
Compute a risk score per transaction based on configurable criteria
Provide a live compliance and risk dashboard for monitoring alerts and trends
Maintain detailed audit-ready logs for every decision taken by the system
Create a scalable and configurable architecture suitable for real-world financial ecosystems


System Architecture
┌─────────────────────────────────────────────────────────────┐
│                    React.js Dashboard                        │
│         (Live UI - localhost:3000/3001)                     │
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

Tech Stack
LayerTechnologyPurposeFrontendReact.jsLive compliance dashboard UIBackendJava + Spring BootREST APIs and business logicRule EngineEasy RulesConfigurable rule-based risk evaluationDatabaseMySQLPersistent storage for transactions and risk scoresORMSpring Data JPA + HibernateDatabase interactionHTTP ClientAxiosFrontend to backend communicationChartsRechartsRisk score visualizationBuild ToolMavenDependency management

Note: Easy Rules is used instead of Drools for a lightweight, annotation-driven rule engine approach. REST APIs are used instead of Apache Kafka for transaction ingestion, keeping the architecture simple and demonstrable.


 Core Features
1. Real-Time Transaction Ingestion

Transactions submitted via REST API (POST /api/transactions)
Instantly evaluated by the rule engine before being persisted
Supports TRANSFER, WITHDRAWAL, INTERNATIONAL, and CRYPTO transaction types

2. Rule Engine (Easy Rules)

Each rule is a separate, independently configurable Java class
Rules are evaluated automatically on every transaction
New rules can be added without modifying existing code

3. Automatic Risk Scoring

Risk score computed by aggregating all triggered rules
Score normalized to 0–100 scale
Status automatically assigned based on final score

4. Live Compliance Dashboard (React.js)

Real-time transaction table with color-coded risk indicators
Add new transactions via form
Edit and update existing transactions
Visual risk score indicators (🟢 🟡 🔴)

5. Audit-Ready Data

Every transaction stored with full details
Risk score and status recorded for every decision
Complete traceability for reviews


Rule Engine
Rules are implemented using Easy Rules with Spring Boot annotations. Each rule is a separate class with a @Condition and @Action:
RuleConditionRisk Points AddedHighAmountRuleAmount > ₹10,00,000+40MediumAmountRuleAmount > ₹5,00,000+20LowAmountRuleAmount > ₹1,00,000+10WithdrawalRuleType = WITHDRAWAL+15InternationalRuleType = INTERNATIONAL+25CryptoRuleType = CRYPTO+30SameAccountRulefromAccount = toAccount+50LateNightRuleTransaction between 12am–5am+20
Example Rule:
java@Component
@Rule(name = "HighAmountRule", description = "Flag high value transactions")
public class HighAmountRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return transaction.getAmount() != null &&
               transaction.getAmount() > 1000000;
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        transaction.setRiskScore(transaction.getRiskScore() + 40);
    }
}

Risk Scoring
Risk scores are computed by aggregating all triggered rules and capped at 100:
Risk ScoreStatusIndicator0 – 39PENDING🟢 Low Risk40 – 74FLAGGED🟡 Medium Risk75 – 100ESCALATED🔴 High Risk

 Project Structure
surveillance-engine/                  # Spring Boot Backend
├── src/main/java/com/surveillance/engine/
│   ├── SurveillanceEngineApplication.java
│   ├── CorsConfig.java
│   ├── model/
│   │   └── Transaction.java
│   ├── repository/
│   │   └── TransactionRepository.java
│   ├── service/
│   │   └── TransactionService.java
│   ├── controller/
│   │   └── TransactionController.java
│   └── rules/
│       ├── RuleEngineService.java
│       ├── HighAmountRule.java
│       ├── WithdrawalRule.java
│       ├── InternationalRule.java
│       ├── SameAccountRule.java
│       └── LateNightRule.java
└── src/main/resources/
    └── application.properties

surveillance-ui/                      # React.js Frontend
├── src/
│   └── App.js                        # Main dashboard component
├── package.json
└── public/

Getting Started
Prerequisites

Java 21
Maven
MySQL 8.0
Node.js v20+
IntelliJ IDEA (recommended)

1. Database Setup
sqlCREATE DATABASE surveillance_db;
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
2. Backend Setup
bashcd surveillance-engine
# Update application.properties with your MySQL password
./mvnw spring-boot:run
3. Frontend Setup
bashcd surveillance-ui
npm install
npm start
4. Access the Application

Dashboard: http://localhost:3000
API: http://localhost:8080/api/transactions


 API Endpoints
MethodEndpointDescriptionGET/api/transactionsGet all transactionsGET/api/transactions/{id}Get transaction by IDPOST/api/transactionsCreate new transaction (auto risk scored)PUT/api/transactions/{id}Update existing transaction
Sample Request:
jsonPOST /api/transactions
{
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 1500000,
  "transactionType": "TRANSFER"
}
Sample Response:
json{
  "id": 1,
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 1500000.0,
  "transactionType": "TRANSFER",
  "riskScore": 40,
  "status": "FLAGGED",
  "createdAt": "2026-03-14T18:57:02"
}

 Dashboard
The React.js dashboard provides:

Transaction Form — Add new transactions with automatic risk scoring
Transactions Table — View all transactions with color-coded risk indicators
Edit Functionality — Update transaction details
Risk Indicators — 🟢 Low / 🟡 Medium / 🔴 High visual risk display


Future Enhancements

Integration of Apache Kafka for high-throughput event streaming
Drools rule engine for enterprise-grade rule management
WebSockets for real-time push notifications to dashboard
Machine Learning models for anomaly detection
Graph/Network analysis to detect suspicious account networks
Multi-tenant support for multiple institutions
Case Management workflow for alert investigation and disposition
Cloud-native deployment with Docker and Kubernetes autoscaling
Integration with external KYC/AML systems



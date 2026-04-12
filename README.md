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
- [Stopping Services](#stopping-services)
- [Future Enhancements](#future-enhancements)

## Introduction
**transaction_risk_monitoring** continuously monitors transaction streams, applies configurable rules using Easy Rules engine, computes risk scores, and presents alerts on a live dashboard. Designed for investment banking, payments, AML, and audit teams.

## Problem Statement
Legacy surveillance systems suffer from:
- **Batch processing** - End-of-day analysis misses real-time fraud
- **Rigid rules** - Code changes needed for new scenarios  
- **No live visibility** - Risk teams lack unified real-time views
- **Weak audit trails** - Flagged transactions lack clear justification

## Objectives
- Real-time transaction monitoring system
- Configurable rule engine (thresholds, velocity, patterns)
- Automatic per-transaction risk scoring (0-100)
- Live compliance dashboard with alerts
- Complete audit-ready logs with manager hints
- Scalable architecture for financial environments

## System Architecture

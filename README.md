# SQL Judges Your Life

**An interactive analytics application that transforms structured user inputs into dynamically generated SQL queries and data-driven insights.**

---

## 📌 Overview

**SQL Judges Your Life** is a React-based web application that simulates analytical SQL workloads using AI-generated queries.

Users enter structured behavioral data (food habits, gym attendance, sleep cycle, spending patterns, text response behavior), and the system:

1. Constructs a structured analytical prompt  
2. Generates a realistic SQL query  
3. Derives statistics from the provided data  
4. Returns a personalized, data-driven verdict  

The application mirrors a real analytical pipeline:

```
User Input → Structured Prompt → Generated SQL → Parsed JSON → Rendered Metrics
```

The focus of this project is not humor, but **structured data modeling, analytical query design, and AI-integrated frontend architecture.**

---

## 🏗 Architecture

### **Frontend**
- React (Hooks: `useState`, `useEffect`, `useRef`)
- Schema-driven dynamic form rendering
- State-based episode workflow
- Conditional rendering & UI state management
- Custom typewriter animation
- Regex-based SQL syntax highlighting
- Structured result rendering

### **AI Integration**
- Anthropic Claude API integration
- Strict JSON schema enforcement
- Structured prompt engineering for SQL generation
- Response sanitization and parsing
- Error handling and controlled API lifecycle

### **SQL Concepts Modeled**
- `SELECT`, `FROM`, `WHERE`
- `GROUP BY`, `HAVING`
- `CASE WHEN` logic
- Window functions (`OVER`, `PARTITION BY`)
- Aggregations (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`)
- Ranking functions (`RANK`, `ROW_NUMBER`, `DENSE_RANK`)
- Derived metrics and percentage calculations
- Behavioral KPI modeling

---

## 🎯 Key Design Principles

- Treat real-world behavior as structured datasets  
- Simulate analytical SQL workloads in a frontend environment  
- Enforce predictable AI output using strict schema constraints  
- Translate business logic into query logic  

---

## 🔍 Technical Highlights

- Dynamic prompt construction from structured user input  
- JSON-only response enforcement  
- Regex-based SQL token parsing for syntax highlighting  
- Controlled API interaction lifecycle  
- Multi-step, state-driven user experience  

---

## 🚀 Potential Extensions

- Integrate with a real PostgreSQL backend  
- Execute generated queries against persisted datasets  
- Add historical comparisons and trend analysis  
- Introduce indexing simulation  
- Expand into a full analytical dashboard  

---

## 📂 Repository

`sql-judges-your-life-interactive`

# 📈 Binance Futures Testnet Trading Bot

A full-stack trading bot for placing **MARKET** and **LIMIT** orders on the **Binance Futures Testnet (USDT-M)**.

Built with:
- FastAPI (Backend)
- React + Vite (Frontend)
- CLI (Command Line Interface)

---

## ✨ Features

- Place MARKET and LIMIT orders  
- Support BUY and SELL  
- CLI-based order execution  
- Live open orders panel (UI)  
- Input validation using Pydantic  
- Logging of API requests, responses, and errors  
- Demo mode fallback if API fails  

---

## 🏗 Project Structure
# 📈 Binance Futures Testnet Trading Bot

A full-stack trading bot for placing **MARKET** and **LIMIT** orders on the **Binance Futures Testnet (USDT-M)**.

Built with:
- FastAPI (Backend)
- React + Vite (Frontend)
- CLI (Command Line Interface)

---

## ✨ Features

- Place MARKET and LIMIT orders  
- Support BUY and SELL  
- CLI-based order execution  
- Live open orders panel (UI)  
- Input validation using Pydantic  
- Logging of API requests, responses, and errors  
- Demo mode fallback if API fails  

---

## 🏗 Project Structure
trading-bot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── client.py
│   │   ├── logging_config.py
│   │   ├── main.py
│   │   ├── orders.py
│   │   └── validators.py
│   │
│   ├── logs/
│   │   └── app.log
│   │
│   ├── .env.example
│   ├── cli.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OrderForm.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderResult.jsx
│   │   │   ├── StatusBar.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md

---

## 🔑 Getting Binance Testnet API Keys
 
1. Visit **[https://testnet.binancefuture.com](https://testnet.binancefuture.com)**
2. Log in with your GitHub account (no KYC required).
3. Navigate to **Account → API Key Management**.
4. Click **Generate Key** — copy and save both the **API Key** and **Secret Key**.
5. Testnet accounts start with simulated USDT balance.
 
> ⚠️ Testnet keys do **not** work on the live Binance API and vice versa.

---
 
## 🚀 Setup & Running
 
### Prerequisites
 
| Tool | Version |
|---|---|
| Python | ≥ 3.11 |
| Node.js | ≥ 18 |
| npm | ≥ 9 |
 
---

### 1. Clone / set up the project
 
```bash
# From the project root
cd trading-bot
```
 
---
 
### 2. Backend
 
```bash
cd backend
 
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
 
# Install dependencies
pip install -r requirements.txt
 
# Configure credentials
cp .env.example .env
# Edit .env and paste your Testnet API key + secret
```
 
**`backend/.env`**
 
```env
BINANCE_TESTNET_API_KEY=your_key_here
BINANCE_TESTNET_API_SECRET=your_secret_here
```
 
```bash
# Start the server (hot-reload enabled)
python run.py
```
 
The API is now live at **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**
 
---
 
### 3. Frontend
 
```bash
# In a new terminal tab
cd frontend
 
npm install
npm run dev
```
 
The UI is now live at **http://localhost:5173**
 
---

## 🖥 CLI Usage

Place orders using terminal:

### MARKET ORDER

python cli.py --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001

### LIMIT ORDER

python cli.py --symbol BTCUSDT --side SELL --type LIMIT --quantity 0.001 --price 60000

---

## 📤 CLI Output Example

📤 ORDER REQUEST  
{'symbol': 'BTCUSDT', 'side': 'BUY', 'order_type': 'MARKET', 'quantity': 0.001}

📥 ORDER RESPONSE  
✅ ORDER SUCCESS  
Order ID: 1  
Symbol: BTCUSDT  
Side: BUY  
Type: MARKET  
Executed Qty: 0.001  
Avg Price: 50000  

---

## 🔍 Logs
 
All requests and responses are logged to:
 
```
backend/logs/app.log
```
 
- **Console**: INFO level and above
- **File**: DEBUG level and above
- Rotates at **10 MB**, keeps **5** backups
 
---

## 📜 License
 
MIT — free for personal and educational use.
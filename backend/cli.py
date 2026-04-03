import argparse
import requests

def main():
    parser = argparse.ArgumentParser(description="Trading Bot CLI")

    parser.add_argument("--symbol", required=True)
    parser.add_argument("--side", required=True)
    parser.add_argument("--type", required=True)
    parser.add_argument("--quantity", required=True, type=float)
    parser.add_argument("--price", type=float)

    args = parser.parse_args()

    payload = {
        "symbol": args.symbol,
        "side": args.side,
        "order_type": args.type,
        "quantity": args.quantity,
        "price": args.price
    }

    print("\n📤 ORDER REQUEST")
    print(payload)

    try:
        res = requests.post("http://localhost:8000/api/order", json=payload)

        data = res.json()

        print("\n📥 ORDER RESPONSE")

        if "orderId" in data:
            print("✅ ORDER SUCCESS")
        else:
            print("❌ ORDER FAILED")

        print(f"Order ID: {data.get('orderId')}")
        print(f"Symbol: {data.get('symbol')}")
        print(f"Side: {data.get('side')}")
        print(f"Type: {data.get('type')}")
        print(f"Executed Qty: {data.get('executedQty')}")
        print(f"Avg Price: {data.get('avgPrice')}")
    except Exception as e:
        print("❌ Error:", e)


if __name__ == "__main__":
    main()
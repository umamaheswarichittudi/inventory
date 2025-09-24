import { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get("/user/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-800">
                  Order #{o.id}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(o.created_at).toLocaleDateString()}
                </span>
              </div>

              {o.items && o.items.length > 0 ? (
                <ul className="space-y-2">
                  {o.items.map((item: any) => (
                    <li
                      key={item.productId}
                      className="flex justify-between text-sm text-gray-700 border-b pb-1 last:border-none"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No items in this order.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

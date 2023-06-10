import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>paid</th>
            <th>Recipient</th>
            <th>products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    dateStyle: "full",
                    timeStyle: "short"
                  })}
                </td>

                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "PAID" : "NOT PAID"}
                </td>

                <td>
                  {order.name}
                  <br />
                  {order.email}
                  <br />
                  {order.streetAddress}
                  <br />
                  {order.postalCode}&nbsp;
                  {order.city}
                  <br />
                </td>
                <td>
                  {order.line_items.map((line) => (
                    <>
                      {line.price_data?.product_data.name +
                        " x" +
                        line.quantity}
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

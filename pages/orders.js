import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsLoading(false);
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
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="py-4">
                  <Spinner fullwidth={true} />
                </div>
              </td>
            </tr>
          )}
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
                    <div key={Math.random()}>
                      {line.price_data?.product_data.name +
                        " x" +
                        line.quantity}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

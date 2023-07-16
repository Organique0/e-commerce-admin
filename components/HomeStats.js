import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { subHours } from "date-fns";

export default function HomeStats() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24)
  );
  const ordersWeek = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 7)
  );
  const ordersMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30)
  );

  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach((order) => {
      const { line_items } = order;
      line_items.forEach((li) => {
        const lineSum = (li.quantity * li.price_data.unit_amount) / 100;
        sum += lineSum;
      });
    });
    return new Intl.NumberFormat("en-GB").format(sum);
  }

  if (isLoading) {
    return (
      <div className="my-4">
        <Spinner fullwidth={true} />;
      </div>
    );
  }
  return (
    <>
      <div className="border">
        <h2>Orders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white shadow-md p-4">
            <h3 className="uppercase text-gray-500 font-bold text-xs">Today</h3>
            <div className="text-3xl">{ordersToday.length}</div>
          </div>
          <div className="bg-white shadow-md p-4">
            <h3 className="uppercase text-gray-500 font-bold text-xs">
              This week
            </h3>
            <div className="text-3xl">{ordersWeek.length}</div>
          </div>
          <div className="bg-white shadow-md p-4">
            <h3 className="uppercase text-gray-500 font-bold text-xs">
              This month
            </h3>
            <div className="text-3xl">{ordersMonth.length}</div>
          </div>
        </div>
        <h2>Revenue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white shadow-md p-4">
            <h3 className="uppercase text-gray-500 font-bold text-xs">Today</h3>
            <div className="text-3xl">{ordersTotal(ordersToday)}€</div>
          </div>
          <div className="bg-white shadow-md p-4">
            <h3 className="uppercase text-gray-500 font-bold text-xs">
              This week
            </h3>
            <div className="text-3xl">{ordersTotal(ordersWeek)}€</div>
          </div>
          <div className="bg-white shadow-md p-4">
            <h3 className="uppercase text-gray-500 font-bold text-xs">
              This month
            </h3>
            <div className="text-3xl">{ordersTotal(ordersMonth)}€</div>
          </div>
        </div>
      </div>
    </>
  );
}

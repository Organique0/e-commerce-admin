import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState(null);
  const [shippingFee, setShippingFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function fetchData() {
    await axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
    await axios.get("/api/settings?name=featuredProductId").then((response) => {
      setFeaturedProductId(response.data.value);
    });
    await axios.get("/api/settings?name=shippingFee").then((response) => {
      setShippingFee(response.data.value);
    });
  }

  function changeFeaturedProduct(e) {
    const newFeaturedProductId = e.target.value;
    setFeaturedProductId(newFeaturedProductId);
  }

  function changeShippingFee(e) {
    const newShippingFee = e.target.value;
    setShippingFee(newShippingFee);
  }

  async function saveSettings() {
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId
    });
    await axios.put("/api/settings", {
      name: "shippingFee",
      value: shippingFee
    });
    await swal.fire({
      title: "Saved",
      icon: "success"
    });
  }

  return (
    <Layout>
      <h1>Your store settings</h1>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <div className="w-6/12">
          <label>Featured product</label>
          <br />
          <select
            onChange={(e) => changeFeaturedProduct(e)}
            value={featuredProductId}
            className="focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {products.length > 0 &&
              products.map((p) => <option value={p._id}>{p.title}</option>)}
          </select>
          <br />
          <label>Shipping cost</label>
          <br />
          <input
            type="number"
            className="w-2/12 focus:outline-none focus:ring-1 focus:ring-primary"
            value={shippingFee}
            onChange={(e) => changeShippingFee(e)}
          ></input>
          <label className=""> EVRO</label>
          <br />
          <button className="btn-primary" onClick={saveSettings}>
            save
          </button>
        </div>
      )}
    </Layout>
  );
}

const swalWithCustomStyle = Swal.mixin({
  customClass: {
    title: "font-semibold text-3xl",
    confirmButton: "btn-primary mx-1"
  }
});
export default () => <SettingsPage swal={swalWithCustomStyle} />;

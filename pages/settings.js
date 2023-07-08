import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState(null);

  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
    axios.get("/api/settings?name=featuredProductId").then((response) => {
      setFeaturedProductId(response.data.value);
    });
  }, []);

  function change(e) {
    const newFeaturedProductId = e.target.value;
    setFeaturedProductId(newFeaturedProductId);
  }

  useEffect(() => {
    saveSettings();
  }, [featuredProductId]);

  function saveSettings() {
    axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId
    });
  }

  return (
    <Layout>
      <h1>Your store settings</h1>
      <label>Featured product</label>
      <>
        <select onChange={(e) => change(e)} value={featuredProductId}>
          {products.length > 0 &&
            products.map((p) => <option value={p._id}>{p.title}</option>)}
        </select>
      </>
      <div></div>
    </Layout>
  );
}

const swalWithCustomStyle = Swal.mixin({
  customClass: {
    title: "font-semibold text-3xl",
    confirmButton: "btn-red",
    cancelButton: "btn-default mx-1"
  },
  buttonsStyling: false
});
export default () => <SettingsPage swal={swalWithCustomStyle} />;

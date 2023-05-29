import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ProductForm({
  _id,
  title: currentTitle,
  description: currentDesc,
  price: currentPrice,
  state,
  images
}) {
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDesc || "");
  const [price, setPrice] = useState(currentPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);

  useEffect(() => {
    if (currentTitle) {
      setTitle(currentTitle);
    }
    if (currentDesc) {
      setDescription(currentDesc);
    }
    if (currentPrice) {
      setPrice(currentPrice);
    }
  }, [currentTitle, currentPrice, currentDesc]);

  const router = useRouter();

  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function upload(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
    }
  }

  return (
    <Layout>
      <form onSubmit={saveProduct}>
        <h1>{state}</h1>

        <label>product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>

        <label>Photos</label>
        <div className="mb-2">
          <label className="bg-gray-200 cursor-pointer rounded rouded-lg w-24 h-24 text-center flex text-sm gap-1 text-gray-500 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Upload</div>
            <input type="file" name="" className="hidden" onChange={upload} />
          </label>
          {!images?.length && <div>no images</div>}
        </div>

        <label>description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>price</label>
        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </Layout>
  );
}

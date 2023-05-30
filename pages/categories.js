import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editView, setEditView] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = { name, parentCategory };
    if (editView) {
      data._id = editView._id;
      await axios.put("api/categories", data);
      setEditView(null);
    } else {
      await axios.post("api/categories", data);
    }

    setName("");
    fetchCategories();
  }

  function editCategory(c) {
    setEditView(c);
    setName(c.name);
    if (c.parent) {
      setParentCategory(c.parent._id);
    } else {
      setParentCategory("");
    }
  }

  function deleteCategory(c) {
    swal
      .fire({
        title: "Are you sure?",
        text: `do you want to delete ${c.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes",
        didOpen: () => {
          // run when swal is opened...
        },
        didClose: () => {
          // run when swal is closed...
        }
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = c;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      })
      .catch((error) => {
        // when promise rejected...
      });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editView ? `Edit category ${editView.name}` : "create new category"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          placeholder={"Category name"}
          className="mb-0"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value="">no parent category</option>
          {categories.length > 0 &&
            categories.map((c) => <option value={c._id}>{c.name}</option>)}
        </select>
        <button className="btn-primary py-1" type="submit">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((c) => (
              <tr value={c._id}>
                <td>{c.name}</td>
                <td>{c?.parent?.name}</td>
                <td>
                  <button
                    className="btn-primary mr-1"
                    onClick={() => editCategory(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => deleteCategory(c)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
const swalWithCustomStyle = Swal.mixin({
  customClass: {
    title: "font-semibold text-3xl",
    confirmButton: "btn-primary",
    cancelButton: "btn-primary mx-1"
  },
  buttonsStyling: false
});
export default () => <Categories swal={swalWithCustomStyle} />;

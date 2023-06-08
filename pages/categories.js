import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editView, setEditView] = useState(null);
  const [properties, setProperties] = useState([]);

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
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(",")
      }))
    };
    if (editView) {
      data._id = editView._id;
      await axios.put("api/categories", data);
      setEditView(null);
    } else {
      await axios.post("api/categories", data);
    }

    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(c) {
    setEditView(c);
    setName(c.name);
    setParentCategory(c.parent?._id);
    setProperties(
      c.properties.map(({ name, values }) => ({
        name,
        values: values.join(",")
      }))
    );
  }

  function deleteCategory(c) {
    swal
      .fire({
        title: "Are you sure?",
        text: `do you want to delete ${c.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes",
        reverseButtons: true,
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
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlePropertyChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(index) {
    setProperties((prev) => {
      return [...prev].filter((p, pI) => {
        return pI !== index;
      });
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editView ? `Edit category ${editView.name}` : "create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">no parent category</option>
            {categories.length > 0 &&
              categories.map((c) => <option value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((prop, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  value={prop.name}
                  onChange={(e) =>
                    handlePropertyChange(index, prop, e.target.value)
                  }
                  type="text"
                  placeholder="property name (example:color)"
                ></input>
                <input
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyValuesChange(index, prop, e.target.value)
                  }
                  value={prop.values}
                  type="text"
                  placeholder="values, comma separated"
                ></input>
                <button
                  type="button"
                  className="btn-red"
                  onClick={() => removeProperty(index)}
                >
                  remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editView && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditView(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              cancel
            </button>
          )}

          <button className="btn-primary py-1" type="submit">
            Save
          </button>
        </div>
      </form>
      {!editView && (
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
                      className="btn-default mr-1"
                      onClick={() => editCategory(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => deleteCategory(c)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
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
export default () => <Categories swal={swalWithCustomStyle} />;

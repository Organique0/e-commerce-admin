import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettifyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function AdminsPage({ swal }) {
  const [email, setEmail] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function addAdmin(e) {
    e.preventDefault();

    swal
      .fire({
        title: "Are you sure?",
        text: "This will give admin privileges to: " + email,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes",
        reverseButtons: true
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios
            .post("/api/admins", { email })
            .then((res) => {
              setEmail("");
              setIsButtonDisabled(true);
              getAdmins();
              swal.fire({
                title: "Admin created!",
                icon: "success"
              });
            })
            .catch((error) => {
              if (error.response) {
                swal.fire({
                  title: "Error accoured!",
                  text: error.response.data.error,
                  icon: "error"
                });
              }
            });
        }
      });
  }

  const handleInputChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsButtonDisabled(newEmail === "");
  };

  function getAdmins() {
    axios.get("/api/admins").then((response) => {
      setAdminEmails(response.data);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    getAdmins();
  }, []);

  function deleteAdmin(_id, email) {
    swal
      .fire({
        title: "Are you sure?",
        text: "This will remove admin privileges from: " + email,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes",
        reverseButtons: true
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios.delete("api/admins?_id=" + _id).then(() => {
            swal.fire({
              title: "Admin deleted",
              icon: "success"
            });
            getAdmins();
          });
        }
      });
  }

  return (
    <Layout>
      <h1>Admins</h1>
      <h2>Add new admin</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="google email"
            className="mb-0"
            value={email}
            onChange={handleInputChange}
          ></input>
          <button
            className={
              isButtonDisabled
                ? "btn-primary btn-disabled py-1"
                : "btn-primary py-1"
            }
            type="submit"
            disabled={isButtonDisabled}
          >
            Add
          </button>
        </div>
      </form>
      <table className="basic mt-3">
        <thead>
          <tr>
            <th className="text-left">google email</th>
            <th className="text-left">created at</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullwidth={true} />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 &&
            adminEmails.map((m) => (
              <tr>
                <td>{m.email}</td>
                <td>{m.createdAt && prettifyDate(m.createdAt)}</td>
                <td>
                  <button
                    className="btn-red"
                    onClick={() => deleteAdmin(m._id, m.email)}
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
    confirmButton: "btn-red",
    cancelButton: "btn-default mx-1"
  },
  buttonsStyling: false
});
export default () => <AdminsPage swal={swalWithCustomStyle} />;

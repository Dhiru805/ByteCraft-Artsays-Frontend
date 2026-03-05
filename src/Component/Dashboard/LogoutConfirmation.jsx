import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";

export const handleLogout = (navigate, logout) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You will be logged out!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.post("/user/logout");
        } catch (error) {
          console.error("Error revoking session on logout:", error);
        }

        logout();
        toast.success("Logout Successful");
        navigate("/login", { replace: true });
      }
    });
};
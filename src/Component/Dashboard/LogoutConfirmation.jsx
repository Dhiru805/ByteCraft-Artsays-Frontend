import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const handleLogout = (navigate, logout) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You will be logged out!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout!',
  }).then((result) => {
    if (result.isConfirmed) {
      logout(); 
      toast.success("Logout Successful");
      navigate("/login", { replace: true });
    }
  });
};
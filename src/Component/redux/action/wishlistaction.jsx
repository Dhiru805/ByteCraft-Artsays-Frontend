// Action Types
export const ADD_TO_WISHLIST_SUCCESS = "ADD_TO_WISHLIST_SUCCESS";
export const ADD_TO_WISHLIST_FAIL = "ADD_TO_WISHLIST_FAIL";
export const GET_WISHLIST_SUCCESS = "GET_WISHLIST_SUCCESS";
export const GET_WISHLIST_FAIL = "GET_WISHLIST_FAIL";
// import { useNavigate } from "react-router-dom";
// Add to Cart

export const addToWishlist = (productId) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first!");
            window.location.href = "/login"; // Redirect to login
            return; // Stop further execution
        }

        const response = await fetch(`http://localhost:3001/cart/addcart/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add to cart");

        dispatch({ type: ADD_TO_CART_SUCCESS, payload: data });
    } catch (error) {
        console.error("Add to cart error:", error.message);
        dispatch({ type: ADD_TO_CART_FAIL, payload: error.message });
    }
};

// Get Cart Items
export const getCart = () => async (dispatch) => {
    try {
        const response = await fetch("http://localhost:3001/cart/cartproduct", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token handling method
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch cart");

        dispatch({ type: GET_CART_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_CART_FAIL, payload: error.message });
    }
};

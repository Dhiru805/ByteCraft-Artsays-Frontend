// Action Types
export const ADD_TO_CART_SUCCESS = "ADD_TO_CART_SUCCESS";
export const ADD_TO_CART_FAIL = "ADD_TO_CART_FAIL";
export const GET_CART_SUCCESS = "GET_CART_SUCCESS";
export const GET_CART_FAIL = "GET_CART_FAIL";

// Add to Cart
export const addToCart = (productId) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first!");
            window.location.href = "/login"; // Redirect to login
            return; // Stop further execution
        }
        console.log(productId);
        
        const response = await fetch(`http://localhost:3001/cart/addcart/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add product to cart");
        }

        dispatch({
            type: ADD_TO_CART_SUCCESS,
            payload: data.cart, // Assuming the backend response has `cart`
        });
    } catch (error) {
        console.error("Add to Cart Error:", error.message);
        dispatch({
            type: ADD_TO_CART_FAIL,
            payload: error.message || "Something went wrong",
        });
    }
};

// Get Cart Items
export const getCart = () => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("You need to log in first!");
        }

        const response = await fetch("http://localhost:3001/cart/cartproduct", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch cart items");
        }

        dispatch({
            type: GET_CART_SUCCESS,
            payload: data.cart, // Assuming the backend response has `cart`
        });
    } catch (error) {
        console.error("Get Cart Error:", error.message);
        dispatch({
            type: GET_CART_FAIL,
            payload: error.message || "Failed to fetch cart items",
        });
    }
};

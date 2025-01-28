import {
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL,
    GET_CART_SUCCESS,
    GET_CART_FAIL,
} from "../action/cartaction";

const initialState = {
    cartItems: [], // Ensure this is an array
    error: null,
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART_SUCCESS:
            return {
                ...state,
                cartItems: action.payload, // Payload is the updated cart array
                error: null,
            };
        case ADD_TO_CART_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        case GET_CART_SUCCESS:
            return {
                ...state,
                cartItems: action.payload, // Payload is the fetched cart array
                error: null,
            };
        case GET_CART_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

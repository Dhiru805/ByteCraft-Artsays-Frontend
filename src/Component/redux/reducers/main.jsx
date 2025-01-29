import { getProductsReducers } from "./Productsreducer";
import { cartReducer } from "./cartreducer";
import {combineReducers} from "redux";

const rootreducers = combineReducers({
    getproductsdata : getProductsReducers,
    cart: cartReducer,
});

export default rootreducers;


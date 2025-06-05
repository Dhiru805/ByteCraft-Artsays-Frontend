import { configureStore } from '@reduxjs/toolkit';  // Use configureStore from Redux Toolkit
import rootReducers from "./Component/redux/reducers/main"
 
const store = configureStore({
  reducer: rootReducers, // Define rootReducers as the root reducer
});
 
export default store;
import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./ImagesSlice";
import creditReducer from "./creditSlice"
const store = configureStore({
  reducer: {
    images: imagesReducer,
    credits: creditReducer
  }
});


export default store;
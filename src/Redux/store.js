import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./ImagesSlice";

const store = configureStore({
  reducer: {
    images: imagesReducer,
  }
});


export default store;
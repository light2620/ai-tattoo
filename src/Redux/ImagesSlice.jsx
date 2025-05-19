import { createSlice } from "@reduxjs/toolkit";

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    images: [],
    imagesLoading: false,
  },
  reducers: {
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setImageLoading: (state, action) => {
      state.imagesLoading = action.payload;
    },
  },
});

export const { setImages, setImageLoading } = imagesSlice.actions;
export default imagesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const generateImagesSlice = createSlice({
    name: "user",
    initialState: {
        generatedImages : null,
    },
    reducers : {
        setGenratedImagesData: (state, action) => {
            state.generatedImages = action.payload;
           
        },
        
    }
})

export const { setGenratedImagesData } = generateImagesSlice.actions;

export default generateImagesSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const creditSlice = createSlice({
  name: "credits",
  initialState: {
    credits: 0,
  },
  reducers: {
    setCredits: (state, action) => {
      state.credits = action.payload;
    },

  },
});

export const {setCredits     } = creditSlice.actions;
export default creditSlice.reducer;

import { configureStore } from '@reduxjs/toolkit'
import generatedImageReducer from './Slice/genratedImageSlice'
export const store = configureStore({
  reducer: {
    
    generatedImages:generatedImageReducer,
  },
})

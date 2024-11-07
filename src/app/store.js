// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import soalReducer from '../slices/soalSlice';

const store = configureStore({
  reducer: {
    soal: soalReducer,
  },
});

export default store;

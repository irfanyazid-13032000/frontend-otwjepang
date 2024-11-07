// src/features/soal/soalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk untuk mengambil data soal
export const fetchSoal = createAsyncThunk('soal/fetchSoal', async (page = 1) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/soal?page=${page}`);
  return response.data;
});

const soalSlice = createSlice({
  name: 'soal',
  initialState: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSoal.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.lastPage = action.payload.last_page;
        state.loading = false;
      })
      .addCase(fetchSoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export reducer dan action
export const { setCurrentPage } = soalSlice.actions;
export default soalSlice.reducer;

// src/features/soal/soalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for fetching soal data
export const fetchSoal = createAsyncThunk('soal/fetchSoal', async (page = 1) => {
  // const response = await axios.get(`https://otwjepang.my.id/api/soal?page=${page}`);
  // const response = await axios.get(`http://localhost:8000/api/soal?page=${page}`);
  const response = await axios.get(`https://sir-editors-cet-babies.trycloudflare.com/api/soal?page=${page}`);
  
  return response.data;
});

const soalSlice = createSlice({
  name: 'soal',
  initialState: {
    data: [],
    currentPage: 1,
    lastPage: 1,
    firstPageUrl: null,
    lastPageUrl: null,
    nextPageUrl: null,
    prevPageUrl: null,
    links: [],
    total: 0,
    perPage: 10,
    from: null,
    to: null,
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
        const payload = action.payload;
        state.data = payload.data;
        state.currentPage = payload.current_page;
        state.lastPage = payload.last_page;
        state.firstPageUrl = payload.first_page_url;
        state.lastPageUrl = payload.last_page_url;
        state.nextPageUrl = payload.next_page_url;
        state.prevPageUrl = payload.prev_page_url;
        state.links = payload.links;
        state.total = payload.total;
        state.perPage = payload.per_page;
        state.from = payload.from;
        state.to = payload.to;
        state.loading = false;
      })
      .addCase(fetchSoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export reducer and action
export const { setCurrentPage } = soalSlice.actions;
export default soalSlice.reducer;

// frontend/src/slices/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/transactions`;

// Fetch user transactions
export const fetchUserTransactions = createAsyncThunk(
  'transaction/fetchUserTransactions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(API_URL, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch merchant transactions
export const fetchMerchantTransactions = createAsyncThunk(
  'transaction/fetchMerchantTransactions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        merchant: { merchantInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${merchantInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/merchant`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Process transaction (merchant)
export const processTransaction = createAsyncThunk(
  'transaction/processTransaction',
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const {
        merchant: { merchantInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${merchantInfo.token}`,
        },
      };

      const { data } = await axios.post(API_URL, transactionData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get transaction by ID
export const getTransactionById = createAsyncThunk(
  'transaction/getTransactionById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactions: [],
    transaction: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    resetTransactionSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user transactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch merchant transactions
      .addCase(fetchMerchantTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMerchantTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchMerchantTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Process transaction
      .addCase(processTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(processTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.transactions = [action.payload, ...state.transactions];
      })
      .addCase(processTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get transaction by ID
      .addCase(getTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError, resetTransactionSuccess } = transactionSlice.actions;
export default transactionSlice.reducer;

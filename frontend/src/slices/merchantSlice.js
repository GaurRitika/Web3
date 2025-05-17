// frontend/src/slices/merchantSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/merchants`;

// Get merchant info from localStorage
const merchantInfo = localStorage.getItem('merchantInfo')
  ? JSON.parse(localStorage.getItem('merchantInfo'))
  : null;

// Fetch all merchants
export const fetchMerchants = createAsyncThunk(
  'merchant/fetchMerchants',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
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

// Fetch merchant details by ID
export const fetchMerchantDetails = createAsyncThunk(
  'merchant/fetchMerchantDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
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

// Register a new merchant (admin only)
export const registerMerchant = createAsyncThunk(
  'merchant/registerMerchant',
  async (merchantData, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(API_URL, merchantData, config);
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

// Update merchant (admin only)
export const updateMerchant = createAsyncThunk(
  'merchant/updateMerchant',
  async ({ id, merchantData }, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(`${API_URL}/${id}`, merchantData, config);
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

// Delete merchant (admin only)
export const deleteMerchant = createAsyncThunk(
  'merchant/deleteMerchant',
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

      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Merchant login
export const merchantLogin = createAsyncThunk(
  'merchant/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(`${API_URL}/login`, loginData, config);
      localStorage.setItem('merchantInfo', JSON.stringify(data));
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

// Get merchant profile
export const getMerchantProfile = createAsyncThunk(
  'merchant/getProfile',
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

      const { data } = await axios.get(`${API_URL}/profile`, config);
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

const merchantSlice = createSlice({
  name: 'merchant',
  initialState: {
    merchantInfo,
    merchants: [],
    merchant: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    merchantLogout: (state) => {
      localStorage.removeItem('merchantInfo');
      state.merchantInfo = null;
      state.error = null;
    },
    clearMerchantError: (state) => {
      state.error = null;
    },
    resetMerchantSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch merchants
      .addCase(fetchMerchants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMerchants.fulfilled, (state, action) => {
        state.loading = false;
        state.merchants = action.payload;
      })
      .addCase(fetchMerchants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch merchant details
      .addCase(fetchMerchantDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMerchantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.merchant = action.payload;
      })
      .addCase(fetchMerchantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register merchant
      .addCase(registerMerchant.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerMerchant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.merchants = [...state.merchants, action.payload];
      })
      .addCase(registerMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update merchant
      .addCase(updateMerchant.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMerchant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.merchants = state.merchants.map((merchant) =>
          merchant._id === action.payload._id ? action.payload : merchant
        );
      })
      .addCase(updateMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete merchant
      .addCase(deleteMerchant.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMerchant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.merchants = state.merchants.filter(
          (merchant) => merchant._id !== action.payload
        );
      })
      .addCase(deleteMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Merchant login
      .addCase(merchantLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(merchantLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.merchantInfo = action.payload;
      })
      .addCase(merchantLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get merchant profile
      .addCase(getMerchantProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMerchantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.merchantInfo = { ...state.merchantInfo, ...action.payload };
      })
      .addCase(getMerchantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { merchantLogout, clearMerchantError, resetMerchantSuccess } = merchantSlice.actions;
export default merchantSlice.reducer;

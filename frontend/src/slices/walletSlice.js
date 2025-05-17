// frontend/src/slices/walletSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from 'web3';
import { ethers } from 'ethers';

// Connect to wallet
export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (_, { rejectWithValue }) => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to use this app.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get the connected wallet address
      const walletAddress = accounts[0];
      
      // Get the network ID
      const networkId = await window.ethereum.request({ method: 'net_version' });
      
      return { walletAddress, networkId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sign message with wallet
export const signMessage = createAsyncThunk(
  'wallet/signMessage',
  async ({ message, address }, { rejectWithValue }) => {
    try {
      // Sign the message
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), address],
      });
      
      return { signature };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    walletAddress: null,
    networkId: null,
    signature: null,
    loading: false,
    error: null,
    isConnected: false,
  },
  reducers: {
    disconnectWallet: (state) => {
      state.walletAddress = null;
      state.networkId = null;
      state.signature = null;
      state.isConnected = false;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect wallet
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.walletAddress = action.payload.walletAddress;
        state.networkId = action.payload.networkId;
        state.isConnected = true;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isConnected = false;
      })
      // Sign message
      .addCase(signMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(signMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.signature = action.payload.signature;
      })
      .addCase(signMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { disconnectWallet, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;

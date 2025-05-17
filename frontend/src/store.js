// frontend/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import merchantReducer from './slices/merchantSlice';
import transactionReducer from './slices/transactionSlice';
import walletReducer from './slices/walletSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    merchant: merchantReducer,
    transaction: transactionReducer,
    wallet: walletReducer,
  },
});

export default store;

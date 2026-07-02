import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../api/client';

const TOKEN_KEY = 'vaultline_token';

const describeError = (err, fallback) => {
  if (err.response) {
    return err.response.data?.msg || fallback;
  }
  if (err.code === 'ECONNABORTED') {
    return 'The server took too long to respond — it may be waking up from sleep. Please try again.';
  }
  return 'Could not reach the server. Check your connection and try again.';
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await client.post('/auth/register', payload);
      return data;
    } catch (err) {
      return rejectWithValue(describeError(err, 'Registration failed'));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await client.post('/auth/login', payload);
      localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch (err) {
      return rejectWithValue(describeError(err, 'Invalid'));
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await client.put('/auth/change-password', payload);
      return data;
    } catch (err) {
      return rejectWithValue(describeError(err, 'Could not update password'));
    }
  }
);

export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await client.post('/auth/forgot-password', payload);
      return data;
    } catch (err) {
      return rejectWithValue(describeError(err, 'Could not generate OTP'));
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await client.post('/auth/reset-password', payload);
      return data;
    } catch (err) {
      return rejectWithValue(describeError(err, 'Reset failed'));
    }
  }
);

export const fetchUserPanel = createAsyncThunk(
  'auth/fetchUserPanel',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/user');
      return data;
    } catch (err) {
      return rejectWithValue(describeError(err, 'Access denied'));
    }
  }
);

export const fetchAdminPanel = createAsyncThunk(
  'auth/fetchAdminPanel',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/admin');
      return data;
    } catch (err) {
      return rejectWithValue(describeError(err, 'Access denied'));
    }
  }
);

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || null,
  name: null,
  role: null,
  status: 'idle',       // idle | pending | succeeded | failed
  authError: null,
  otpStage: 'idle',      // idle | sent | verified
  otpError: null,
  panelData: null,
  panelStatus: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(TOKEN_KEY);
      state.token = null;
      state.name = null;
      state.role = null;
      state.panelData = null;
    },
    clearAuthError: (state) => {
      state.authError = null;
    },
    resetOtpFlow: (state) => {
      state.otpStage = 'idle';
      state.otpError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.status = 'pending';
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.authError = action.payload;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = 'pending';
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.name = action.payload.name;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.authError = action.payload;
      })
      // change password
      .addCase(changePassword.pending, (state) => {
        state.status = 'pending';
        state.authError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.authError = action.payload;
      })
      // otp request
      .addCase(requestOtp.pending, (state) => {
        state.otpStage = 'idle';
        state.otpError = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.otpStage = 'sent';
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.otpError = action.payload;
      })
      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.otpError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.otpStage = 'verified';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.otpError = action.payload;
      })
      // panels
      .addCase(fetchUserPanel.pending, (state) => {
        state.panelStatus = 'pending';
      })
      .addCase(fetchUserPanel.fulfilled, (state, action) => {
        state.panelStatus = 'succeeded';
        state.panelData = action.payload;
      })
      .addCase(fetchUserPanel.rejected, (state) => {
        state.panelStatus = 'failed';
      })
      .addCase(fetchAdminPanel.pending, (state) => {
        state.panelStatus = 'pending';
      })
      .addCase(fetchAdminPanel.fulfilled, (state, action) => {
        state.panelStatus = 'succeeded';
        state.panelData = action.payload;
      })
      .addCase(fetchAdminPanel.rejected, (state) => {
        state.panelStatus = 'failed';
      });
  },
});

export const { logout, clearAuthError, resetOtpFlow } = authSlice.actions;
export default authSlice.reducer;

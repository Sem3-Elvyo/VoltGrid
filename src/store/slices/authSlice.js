import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Async thunk: fake login request. rejectWithValue lets us send a clean
// error message into the `rejected` action instead of a raw Error object.
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    await wait(700);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return rejectWithValue("Enter a valid email address.");
    }
    if (password.length < 6) {
      return rejectWithValue("Password must be at least 6 characters.");
    }
    return { email };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle", error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = { email: action.payload.email };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload ?? "Something went wrong.";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

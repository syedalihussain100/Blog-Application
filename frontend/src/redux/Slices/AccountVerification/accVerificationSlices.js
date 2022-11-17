import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const resetAcc = createAction("account/verify-reset");

// sent email
export const sendVerificationMailAction = createAsyncThunk(
  "account/token",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    console.log(user);
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      // http call
      const { data } = await axios.post(
        `/api/users/generate-verification-token`,
        {},
        config
      );

      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }

      return rejectWithValue(error?.response?.data);
    }
  }
);
// verify token
export const VerifyTokenAction = createAsyncThunk(
  "account/verify-token",
  async (token, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      // http call
      const { data } = await axios.put(
        `/api/users/verify-account`,
        { token },
        config
      );
      dispatch(resetAcc());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }

      return rejectWithValue(error?.response?.data);
    }
  }
);

//   slices
const accountVerificationSlices = createSlice({
  name: "account",
  initialState: {},
  extraReducers: (builder) => {
    // send mail
    builder.addCase(sendVerificationMailAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(sendVerificationMailAction.fulfilled, (state, action) => {
      state.token = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(sendVerificationMailAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Verify Slice
    builder.addCase(VerifyTokenAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetAcc, (state, action) => {
      state.isVerified = true;
    });

    builder.addCase(VerifyTokenAction.fulfilled, (state, action) => {
      state.verified = action?.payload;
      state.loading = false;
      state.isVerified = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(VerifyTokenAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default accountVerificationSlices.reducer;

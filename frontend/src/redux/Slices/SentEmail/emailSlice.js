import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const resetEmailAction = createAction("mail/reset");


// sent email
export const sendMailAction = createAsyncThunk(
  "mail/sent",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      // http call
      const { data } = await axios.post(
        `/api/email`,
        {
          to: email?.recipientEmail,
          subject: email?.subject,
          message: email?.message,
        },
        config
      );
      dispatch(resetEmailAction())
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
const emailSlices = createSlice({
  name: "mail",
  initialState: {},
  extraReducers: (builder) => {
    // send mail
    builder.addCase(sendMailAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetEmailAction, (state, action) => {
      state.isMailSent = true;
    });

    builder.addCase(sendMailAction.fulfilled, (state, action) => {
      state.mailSent = action?.payload;
      state.loading = false;
      state.isMailSent = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(sendMailAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default emailSlices.reducer;

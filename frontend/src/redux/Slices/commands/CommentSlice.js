import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";

// action to redirect
const resetCommentAction = createAction("comment/reset");

export const createCommentAction = createAsyncThunk(
  "comment/created",
  async (comment, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    // http call
    try {
      const { data } = await axios.post(
        "/api/comment",
        {
          description: comment?.description,
          postId: comment?.postId,
        },
        config
      );
      //  dispatch the action
      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// comment delete
export const deleteCommentAction = createAsyncThunk(
  "comment/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      // http call
      const { data } = await axios.delete(
        `/api/comment/${id}`,
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

// update comment

export const updateCommentAction = createAsyncThunk(
  "comment/update",
  async (comment, { rejectWithValue, getState, dispatch }) => {
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
        `/api/comment/${comment?.id}`,
        { description: comment?.description },
        config
      );
      dispatch(resetCommentAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }

      return rejectWithValue(error?.response?.data);
    }
  }
);

// Edit comment
export const detailCommentAction = createAsyncThunk(
  "comment/detail",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      // http call
      const { data } = await axios.get(
        `/api/comment/${id}`,
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


//   Slices Start

const commentSlices = createSlice({
  name: "comment",
  initialState: {},
  extraReducers: (builder) => {
    // create comment
    builder.addCase(createCommentAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentCreate = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
    // delete comment
    builder.addCase(deleteCommentAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentDeleted = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(deleteCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // udate comment
    builder.addCase(updateCommentAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetCommentAction, (state, action) => {
      state.isUpdated = true;
    });

    builder.addCase(updateCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentUpdated = action?.payload;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(updateCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
    // detail comment
    builder.addCase(detailCommentAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(detailCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentDetail = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(detailCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
  },
});

export default commentSlices.reducer;

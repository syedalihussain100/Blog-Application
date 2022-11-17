import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const resetUpdateAction = createAction("post/reset");
const resetPost = createAction("post/created-reset");
const resetDeleteAction = createAction("post/delete-reset");

export const createPostAction = createAsyncThunk(
  "post/created",
  async (post, { rejectWithValue, getState, dispatch }) => {
    console.log(post);
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    // http call
    try {
      const formData = new FormData();
      formData.append("title", post?.title);
      formData.append("description", post?.description);
      formData.append("category", post?.category);
      formData.append("image", post?.image);

      console.log(formData);
      // console.log(formData)
      const { data } = await axios.post(
        `/api/post`,
        formData,
        config
      );
      //  dispatch the action
      dispatch(resetPost());
      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// post category list
export const PostsListAction = createAsyncThunk(
  "post/list",
  async (category, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      // console.log(formData)
      const { data } = await axios.get(
        `/api/post?category=${category}`
      );
      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch all post
export const fetchAllPosts = createAsyncThunk(
  "post/lists",
  async (posts, { rejectWithValue, getState, dispatch }) => {
    try {
      try {
        // console.log(formData)
        const { data } = await axios.get(
          `/api/post`
        );
        return data;
      } catch (error) {
        if (!error.response) throw Error;
        return rejectWithValue(error?.response?.data);
      }
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// add like to post

export const toggleAddLikeToPost = createAsyncThunk(
  "post/like",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `/api/post/likes`,
        { postId },
        config
      );

      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Dislike the post

export const toggleDisLikeToPost = createAsyncThunk(
  "post/dislike",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `/api/post/dislikes`,
        { postId },
        config
      );

      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetech post details
export const fetchPostDetails = createAsyncThunk(
  "post/details",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      try {
        // console.log(formData)
        const { data } = await axios.get(
          `/api/post/${id}`
        );
        return data;
      } catch (error) {
        if (!error.response) throw Error;
        return rejectWithValue(error?.response?.data);
      }
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// update post

export const UpdatePostAction = createAsyncThunk(
  "post/update",
  async (post, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `/api/post/${post?.id}`,
        { title: post?.title, description: post?.description },
        config
      );
      dispatch(resetUpdateAction());

      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// delete post
export const deletePostAction = createAsyncThunk(
  "post/delete",
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
        `/api/post/${id}`,
        config
      );
      dispatch(resetDeleteAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }

      return rejectWithValue(error?.response?.data);
    }
  }
);

// Slices

const postSlices = createSlice({
  name: "post",
  initialState: {},
  extraReducers: (builder) => {
    builder.addCase(createPostAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetPost, (state, action) => {
      state.isCreated = true;
    });

    builder.addCase(createPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.postCreate = action?.payload;
      state.isCreated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(createPostAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // postlists
    builder.addCase(PostsListAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(PostsListAction.fulfilled, (state, action) => {
      state.loading = false;
      state.PostList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(PostsListAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
    // fetch all post
    builder.addCase(fetchAllPosts.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(fetchAllPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.PostList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllPosts.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
    // like
    builder.addCase(toggleAddLikeToPost.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(toggleAddLikeToPost.fulfilled, (state, action) => {
      state.loading = false;
      state.likes = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleAddLikeToPost.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // dislike
    builder.addCase(toggleDisLikeToPost.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(toggleDisLikeToPost.fulfilled, (state, action) => {
      state.loading = false;
      state.disLikes = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleDisLikeToPost.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
    // fetch post details
    builder.addCase(fetchPostDetails.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(fetchPostDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.postDetails = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchPostDetails.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // update post
    builder.addCase(UpdatePostAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetUpdateAction, (state, action) => {
      state.isUpdated = true;
    });

    builder.addCase(UpdatePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.UpdatePost = action?.payload;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(UpdatePostAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // delete post
    builder.addCase(deletePostAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetDeleteAction, (state, action) => {
      state.isDeleted = true;
    });

    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.deletePost = action?.payload;
      state.isDeleted = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
  },
});

export default postSlices.reducer;

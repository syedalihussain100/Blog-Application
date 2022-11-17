import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const resetUpdateProfileAction = createAction("user/profile-reset");
const resetUpdatePasswordAction = createAction("user/password-reset");

//register action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (user, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //http call
    try {
      const { data } = await axios.post(
        "/api/users/register",
        user,
        config
      );
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// login action
//Login
export const loginUserAction = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      //make http call
      const { data } = await axios.post(
        `/api/users/login`,
        userData,
        config
      );
      //save user into local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Logout action

export const LogoutAction = createAsyncThunk(
  "/user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// user details
// Update category
export const userProfileAction = createAsyncThunk(
  "user/profile",
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
        `/api/users/profile/${id}`,
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

// upload profile photo
export const uploadProfilePhotoAction = createAsyncThunk(
  "user/upload-profile",
  async (userProfile, { rejectWithValue, getState, dispatch }) => {
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
      formData.append("image", userProfile?.image);
      const { data } = await axios.put(
        "http://localhost:4000/api/users/upload/profile-photo",
        formData,
        config
      );

      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);
// user update profile
export const userUpdateProfileAction = createAsyncThunk(
  "user/update-profile",
  async (userProfile, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    // http call
    try {
      const { data } = await axios.put(
        `/api/users/profile/${user?._id}`,
        {
          firstName: userProfile?.firstName,
          lastName: userProfile?.lastName,
          email: userProfile?.email,
          bio: userProfile?.bio,
        },
        config
      );
      dispatch(resetUpdateProfileAction());
      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// follow
export const userFollowProfileAction = createAsyncThunk(
  "user/follow-profile",
  async (followuserById, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    // http call
    try {
      const { data } = await axios.put(
        `/api/users/following`,
        {
          followId: followuserById,
        },
        config
      );
      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// unfollow
export const unfollowUserAction = createAsyncThunk(
  "user/unfollow",
  async (unFollowedId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };

    // http call
    try {
      const { data } = await axios.put(
        `/api/users/unfollowing`,
        {
          UnfollowId: unFollowedId,
        },
        config
      );
      return data;
    } catch (error) {
      if (!error.response) throw Error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch all user
export const fetchAllUserAction = createAsyncThunk(
  "user/list",
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
        `/api/users`,
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

// Block user
export const blockUserAction = createAsyncThunk(
  "user/block",
  async (id, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `/api/users/block-user/${id}`,
        {},
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

//unBlock User
export const unBlockUserAction = createAsyncThunk(
  "user/unblock",
  async (id, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `/api/users/unblock-user/${id}`,
        {},
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// update password
export const updateUserPasswordAction = createAsyncThunk(
  "user/update-password",
  async (password, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `/api/users/password`,
        {
          oldPassword: password?.oldPassword,
          newpassword: password?.newpassword,
          confirmPassword: password?.confirmPassword,
        },
        config
      );
      dispatch(resetUpdatePasswordAction());
      return data;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// forget password
export const forgetPasswordAction = createAsyncThunk(
  "password/forget-password",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //http call
    try {
      const { data } = await axios.post(
        "/api/users/forget-password",
        {
          email: email?.email,
        },
        config
      );
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// reset password
export const resetPasswordAction = createAsyncThunk(
  "password/reset-password",
  async (password, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.put(
        `/api/users/password/reset/${password?.token}`,
        {
          password: password?.password,
          confirmPassword: password?.confirmPassword,
        },
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);
//slices

//get user from local storage and place into store

const userLoginfromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const usersSlices = createSlice({
  name: "users",
  initialState: {
    userAuth: userLoginfromStorage,
  },
  extraReducers: (builder) => {
    //register
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.registered = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // login slicess

    builder.addCase(loginUserAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.error;
      state.serverErr = action?.error?.message;
    });

    // logout

    builder.addCase(LogoutAction.pending, (state, action) => {
      state.loading = false;
    });

    builder.addCase(LogoutAction.fulfilled, (state, action) => {
      state.userAuth = undefined;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(LogoutAction.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.loading = false;
    });
    // user profile detail
    builder.addCase(userProfileAction.pending, (state, action) => {
      state.Profileloading = true;
    });

    builder.addCase(userProfileAction.fulfilled, (state, action) => {
      state.profile = action?.payload;
      state.Profileloading = false;
      state.ProfileAppErr = undefined;
      state.ProfileServerErr = undefined;
    });

    builder.addCase(userProfileAction.rejected, (state, action) => {
      state.Profileloading = false;
      state.ProfileAppErr = action?.payload?.message;
      state.ProfileServerErr = action?.error?.message;
    });

    // update profile
    builder.addCase(uploadProfilePhotoAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(uploadProfilePhotoAction.fulfilled, (state, action) => {
      state.profilePhoto = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(uploadProfilePhotoAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // user Update Profile
    builder.addCase(userUpdateProfileAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetUpdateProfileAction, (state, action) => {
      state.isUpdated = true;
    });

    builder.addCase(userUpdateProfileAction.fulfilled, (state, action) => {
      state.updateProfile = action?.payload;
      state.loading = false;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(userUpdateProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // user Follow
    builder.addCase(userFollowProfileAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(userFollowProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.followed = action?.payload;
      state.unFollowed = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(userFollowProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    //user unFollow
    builder.addCase(unfollowUserAction.pending, (state, action) => {
      state.unfollowLoading = true;
      state.unFollowedAppErr = undefined;
      state.unfollowServerErr = undefined;
    });
    builder.addCase(unfollowUserAction.fulfilled, (state, action) => {
      state.unfollowLoading = false;
      state.unFollowed = action?.payload;
      state.followed = undefined;
      state.unFollowedAppErr = undefined;
      state.unfollowServerErr = undefined;
    });
    builder.addCase(unfollowUserAction.rejected, (state, action) => {
      state.unfollowLoading = false;
      state.unFollowedAppErr = action?.payload?.message;
      state.unfollowServerErr = action?.error?.message;
    });
    // Fetch all users
    builder.addCase(fetchAllUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAllUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Block
    builder.addCase(blockUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(blockUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.block = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(blockUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // UnBlock user
    builder.addCase(unBlockUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(unBlockUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.unblock = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(unBlockUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // update password
    builder.addCase(updateUserPasswordAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetUpdatePasswordAction, (state, action) => {
      state.passwordUpdated = true;
    });

    builder.addCase(updateUserPasswordAction.fulfilled, (state, action) => {
      state.loading = false;
      state.updatePassword = action?.payload;
      state.passwordUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateUserPasswordAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // forget password
    builder.addCase(forgetPasswordAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(forgetPasswordAction.fulfilled, (state, action) => {
      state.loading = false;
      state.forgetPassword = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(forgetPasswordAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // reset password
    builder.addCase(resetPasswordAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetPasswordAction.fulfilled, (state, action) => {
      state.loading = false;
      state.resetPassword = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPasswordAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default usersSlices.reducer;

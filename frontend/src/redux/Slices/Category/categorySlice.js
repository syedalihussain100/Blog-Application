import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

// action

const resetEditAction = createAction("category/reset");
const resetDeleteAction = createAction("category/delete-reset");
const resetCategoryAction = createAction("category/created-reset");

export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (category, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;
    console.log(userAuth);
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      // http call
      const { data } = await axios.post(
        `/api/category`,
        {
          title: category?.title,
        },
        config
      );
      dispatch(resetCategoryAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }

      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch all categories
export const fetchCategoriesAction = createAsyncThunk(
  "category/fetch",
  async (category, { rejectWithValue, getState, dispatch }) => {
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
        `/api/category`,
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

// Update category
export const updateCategoriesAction = createAsyncThunk(
  "category/update",
  async (category, { rejectWithValue, getState, dispatch }) => {
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
        `/api/category/${category?.id}`,
        { title: category?.title },
        config
      );
      dispatch(resetEditAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }

      return rejectWithValue(error?.response?.data);
    }
  }
);

// delete category
export const deleteCategoriesAction = createAsyncThunk(
  "category/delete",
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
        `/api/category/${id}`,
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

// fetch details
export const detailsCategoriesAction = createAsyncThunk(
  "category/details",
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
        `/api/category/${id}`,
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

// slices

const categorySlices = createSlice({
  name: "category",
  initialState: {},
  extraReducers: (builder) => {
    builder.addCase(createCategoryAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetCategoryAction, (state, action) => {
      state.isCreated = true;
    });

    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.category = action?.payload;
      state.isCreated = false;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(createCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
    // fetch all categories

    builder.addCase(fetchCategoriesAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
      state.categoryList = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // update Category

    builder.addCase(updateCategoriesAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetEditAction, (state, action) => {
      state.isEdited = true;
    });

    builder.addCase(updateCategoriesAction.fulfilled, (state, action) => {
      state.updateCategory = action?.payload;
      state.isEdited = false;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(updateCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // delete category
    builder.addCase(deleteCategoriesAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetDeleteAction, (state, action) => {
      state.isDeleted = true;
    });

    builder.addCase(deleteCategoriesAction.fulfilled, (state, action) => {
      state.deleteCategory = action?.payload;
      state.isDeleted = false;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(deleteCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });

    // details category
    builder.addCase(detailsCategoriesAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(detailsCategoriesAction.fulfilled, (state, action) => {
      state.detailsCategory = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });

    builder.addCase(detailsCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error;
    });
  },
});

export default categorySlices.reducer;

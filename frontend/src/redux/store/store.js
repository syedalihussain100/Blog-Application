import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Slices/users/usersSlices";
import categoryReducer from "../Slices/Category/categorySlice";
import post from "../Slices/posts/postSlices";
import comments from "../Slices/commands/CommentSlice";
import sentMail from "../Slices/SentEmail/emailSlice"
import AccountVerification from "../Slices/AccountVerification/accVerificationSlices"

const store = configureStore({
  reducer: {
    users: usersReducer,
    category: categoryReducer,
    post,
    comments,
    sentMail,
    AccountVerification
  },
});

export default store;

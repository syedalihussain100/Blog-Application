import React from "react";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/User/Profile";
import Navbar from "./components/Navigation/Navbar";
import AddNewCategory from "./components/Category/AddnewCategory";
import CategoryList from "./components/Category/categoryList";
import UpdateCategory from "./components/Category/UpdateCategory";
import { ProtectedRoute } from "protected-route-react";
import { useSelector } from "react-redux";
import CreatePost from "./components/post/CreatePost";
import Post from "./components/post/Posts";
import PostDetails from "./components/post/PostDetails";
import UpdatePost from "./components/post/UpdatePost/UpdatePost";
import UpdateComment from "./components/comment/UpdateComment";
import UploadPhotoUpload from "./components/User/UploadPhotoUpload";
import UpdateProfileForm from "./components/User/UpdateProfile";
import SendEmail from "./components/User/Email/SendEmail";
import AccountVerified from "./components/User/AccountVerfied/AccountVerified";
import UsersList from "./components/User/userList/UserList";
import UpdatePassword from "./components/User/PasswordManagement/UpdatePassword";
import ForgetPassword from "./components/User/PasswordManagement/ForgetPassword";
import ResetPassword from "./components/User/PasswordManagement/ResetPassword";

function App() {
  const storeData = useSelector((state) => state?.users);
  const { userAuth } = storeData;
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route
            element={
              <ProtectedRoute isAuthenticated={userAuth} redirect="/login" />
            }
          >
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/updatepost/:id" element={<UpdatePost />} />
            <Route path="/update-comment/:id" element={<UpdateComment />} />
            <Route
              path="/upload-profile-photo"
              element={<UploadPhotoUpload />}
            />
            <Route path="/update-profile/:id" element={<UpdateProfileForm />} />
            <Route
              path="/verify-account/:token"
              element={<AccountVerified />}
            />
            <Route path="/update-password" element={<UpdatePassword/>}/>
          </Route>
          <Route path="/posts" element={<Post />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          {/* Admin Route */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={userAuth}
                adminRoute={true}
                isAdmin={userAuth && userAuth?.isAdmin === true}
                redirectAdmin={`/`}
              />
            }
          >
            <Route path="/add-category" element={<AddNewCategory />} />
            <Route path="/category-list" element={<CategoryList />} />
            <Route path="/update-category/:id" element={<UpdateCategory />} />
            <Route path="/send-email/:email" element={<SendEmail />} />
            <Route path="/users" element={<UsersList />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

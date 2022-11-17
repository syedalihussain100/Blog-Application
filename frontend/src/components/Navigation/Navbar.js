import React from "react";
import AdminNavbar from "./Admin/AdminNavbar";
import PrivateNavbar from "./Private/PrivateNavbar";
import PublicNavbar from "./Public/Publicnavbar";
import { useSelector } from "react-redux";
import AccountVerificationAlertWarning from "./Alerts/AccountVerificationAlert";
import AccountVerificationSuccessAlert from "./Alerts/AccountVerificationSuccess";

const Navbar = () => {
  // get user from store
  const data = useSelector((state) => state.users);
  const { userAuth, profile } = data;
  const isAdmin = userAuth?.isAdmin;
  const AccountVerification = useSelector(
    (state) => state?.AccountVerification
  );
  const { loading, token, appErr, serverErr } = AccountVerification;
  return (
    <>
      {isAdmin ? (
        <AdminNavbar isLogin={userAuth} />
      ) : userAuth ? (
        <PrivateNavbar isLogin={userAuth} />
      ) : (
        <PublicNavbar />
      )}
      {/* Display alert */}
      {userAuth && !userAuth?.isVerified && <AccountVerificationAlertWarning />}
      {/* Display Success message */}
      {loading && <h2 className="text-center">Loading Please Wait 😎 ... </h2>}
      {token && <AccountVerificationSuccessAlert />}
      {appErr || serverErr ? (
        <h2 className="text-center text-red-500">
          {serverErr?.message} {appErr}
        </h2>
      ) : null}
    </>
  );
};

export default Navbar;

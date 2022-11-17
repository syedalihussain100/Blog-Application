import React, { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUserAction } from "../../../redux/Slices/users/usersSlices";
import UsersListHeader from "./UserListHeader";
import UsersListItem from "./UserListItem";

const UsersList = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users);

  const { loading, appErr, serverErr, block, unblock } = user;
 

  useEffect(() => {
    dispatch(fetchAllUserAction());
  }, [dispatch, block, unblock]);

  return (
    <>
      <section className="py-8 bg-gray-900 min-h-screen">
        <UsersListHeader users={user} />
        {loading ? (
          <h1 className="text-center text-lg text-red-600">Loading...</h1>
        ) : appErr || serverErr ? (
          <h3>
            {appErr} {serverErr?.message}
          </h3>
        ) : user?.userList?.length <= 0 ? (
          <h2>No User Found</h2>
        ) : (
          user?.userList?.map((user) => (
            <Fragment key={user?._id}>
              <UsersListItem user={user} />
            </Fragment>
          ))
        )}
      </section>
    </>
  );
};

export default UsersList;

// <UsersListHeader users={users}/>
// <div class="container px-4 mx-auto">
//   <UsersListItem />
// </div>

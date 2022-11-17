import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Moment from "react-moment";
// import { Scrollbars } from "react-custom-scrollbars";
import { deleteCommentAction } from "../../redux/Slices/commands/CommentSlice";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react";

export default function CommentsList({ comments }) {
  const user = useSelector((state) => state?.users);
  const { userAuth } = user;
  const isLoginId = userAuth?._id;
  const dispatch = useDispatch();
  return (
    <div>
      <ul className="divide-y bg-gray-700 w-96 divide-gray-200 p-3 mt-5">
        <div className="text-gray-400">
          {comments?.length ? comments?.length : 0} Comments
        </div>
        {/* <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={0}
          autoHeightMax={200}
          thumbMinSize={30}
        > */}
          <>
            {comments?.length <= 0 ? (
              <h1 className="text-yellow-400 text-lg text-center">
                No comments
              </h1>
            ) : (
              comments?.map((comments, index) => (
                <Fragment key={comments?._id}>
                  <li className="py-4  w-full">
                    <div className="flex space-x-3">
                      <img
                        className="h-6 w-6 rounded-full"
                        src={comments?.user?.profilePhoto}
                        alt="logo"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <Link to={`/profile/${comments?.user?._id}`}>
                            <h3 className="text-sm font-medium text-green-400">
                              {comments?.user?.firstName}{" "}
                              {comments?.user?.lastName}
                            </h3>
                          </Link>
                          <p className="text-bold text-yellow-500 text-base ml-5">
                            {/* <Moment fromNow ago>
                            {comments?.createdAt}
                          </Moment> */}

                            <Moment fromNow>{comments?.createdAt}</Moment>
                          </p>
                        </div>
                        <p className="text-sm text-gray-400">
                          {comments?.description}
                        </p>
                        {/* Check if is the same user created this comment */}

                        {/* check if user is login then edit and update */}
                        {isLoginId === comments?.user?._id ? (
                          <p className="flex">
                            <Link
                              to={`/update-comment/${comments?._id}`}
                              className="p-3"
                            >
                              <PencilIcon className="h-5 mt-3 text-yellow-300" />
                            </Link>
                            <button
                              className="ml-3"
                              onClick={() =>
                                dispatch(deleteCommentAction(comments?._id))
                              }
                            >
                              <TrashIcon className="h-5 mt-3 text-red-600" />
                            </button>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                </Fragment>
              ))
            )}
          </>
        {/* </Scrollbars> */}
      </ul>
    </div>
  );
}

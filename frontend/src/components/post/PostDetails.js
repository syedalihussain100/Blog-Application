import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";
import {
  fetchPostDetails,
  deletePostAction,
} from "../../redux/Slices/posts/postSlices";
import Moment from "react-moment";
import LoadingComponent from "../utils/Loading";
import AddComment from "../comment/AddComment";
import CommentsList from "../comment/CommentList";

const PostDetails = () => {
  const storeData = useSelector((state) => state.post);
  const { commentCreate, commentDeleted } = useSelector(
    (state) => state.comments
  );
  const { userAuth } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const { loading, appErr, serverErr, postDetails, isDeleted } = storeData;

  const match = useMatch(`/posts/:id`);
  const id = match.params.id;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostDetails(id));
  }, [dispatch, id, commentCreate, commentDeleted]);

  const handleDelete = () => {
    dispatch(deletePostAction(id));
  };

  if (isDeleted) return navigate("/posts");

  return (
    <>
      <div className="min-h-screen bg-green-600">
        {loading ? (
          <div className="min-h-screen flex justify-center items-center">
            <LoadingComponent />
          </div>
        ) : appErr || serverErr ? (
          <h1 className="text-yellow-400 text-2xl flex justify-center items-center">
            {serverErr.message} {appErr}
          </h1>
        ) : (
          <section className="py-20 2xl:py-40 bg-gray-800 overflow-hidden">
            <div className="container px-4 mx-auto">
              {/* Post Image */}
              <img
                className="mb-24 w-full h-96 object-cover"
                src={postDetails?.image}
                alt="logo"
              />
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="mt-7 mb-14 text-6xl 2xl:text-7xl text-white font-bold font-heading">
                  {postDetails?.title}
                </h2>

                {/* User */}
                <div className="inline-flex pt-14 mb-14 items-center border-t border-gray-500">
                  <img
                    className="mr-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full"
                    src={postDetails?.user?.profilePhoto}
                    alt=""
                  />
                  <div className="text-left">
                    <Link to={`/profile/${postDetails?.user?._id}`}>
                      <h4 className="mb-1 text-2xl font-bold text-gray-50">
                        <span className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600">
                          {postDetails?.user?.firstName}{" "}
                          {postDetails?.user?.lastName}
                        </span>
                      </h4>
                    </Link>
                    <p className="text-gray-500">
                      {/* <DateFormatter date={post?.createdAt} /> */}
                      <time>
                        <Moment format="D MMM YYYY" withTitle>
                          {postDetails?.createdAt}
                        </Moment>
                      </time>
                    </p>
                  </div>
                </div>
                {/* Post description */}
                <div className="max-w-xl mx-auto">
                  <p className="mb-6 text-left  text-xl text-gray-200">
                    {postDetails?.description}
                    {/* Show delete and update btn if created user */}
                    {userAuth ? (
                      <p className="flex">
                        <Link
                          to={`/updatepost/${postDetails?._id}`}
                          className="p-3"
                        >
                          <PencilIcon className="h-8 mt-3 text-yellow-300" />
                        </Link>
                        <button className="ml-3" onClick={handleDelete}>
                          <TrashIcon className="h-8 mt-3 text-red-600" />
                        </button>
                      </p>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
            {/* Add comment Form component here */}

            {userAuth ? <AddComment postId={id} /> : null}
            <div className="flex justify-center  items-center">
              {/* <CommentsList comments={post?.comments} postId={post?._id} /> */}
              <CommentsList comments={postDetails?.comments} />
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default PostDetails;

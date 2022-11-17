import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  detailCommentAction,
  updateCommentAction,
} from "../../redux/Slices/commands/CommentSlice";

//Form schema
const formSchema = Yup.object({
  description: Yup.string().required("Description is required"),
});

const UpdateComment = () => {
  const storeData = useSelector((state) => state?.comments);
  const { loading, appErr, serverErr, commentDetail,isUpdated } = storeData;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //fetch comment

  useEffect(() => {
    dispatch(detailCommentAction(id));
  }, [dispatch, id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: commentDetail?.description,
    },
    onSubmit: (values) => {
      const data = {
        description: values?.description,
        id,
      };
      dispatch(updateCommentAction(data));
     
    },
    validationSchema: formSchema,
  });

  if(isUpdated) return navigate("/posts")

  return (
    <div className="h-96 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <form
          onSubmit={formik.handleSubmit}
          className="mt-1 flex max-w-sm m-auto"
        >
          <textarea
            onBlur={formik.handleBlur("description")}
            value={formik.values.description}
            onChange={formik.handleChange("description")}
            type="text"
            name="text"
            id="text"
            className="shadow-sm focus:ring-indigo-500  mr-4 focus:border-indigo-500 block w-full p-2 border-2 sm:text-sm border-gray-300 rounded-md"
            placeholder="Add New comment"
          />

          {loading ? (
            <button
              disabled
              className="py-4 w-full bg-gray-500 text-white font-bold rounded-full transition duration-200"
            >
              Updating Please Wait
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center px-2.5 py-1.2 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          )}
        </form>
        <div className="text-red-400 mb-2 mt-2">
          {formik.touched.description && formik.errors.description}
        </div>
      </div>
      <div>
        {/* Display Error */}
        {appErr || serverErr ? (
          <h2 className="text-red-500 text-center text-lg">
            {serverErr?.message} {appErr}
          </h2>
        ) : null}
      </div>
    </div>
  );
};

export default UpdateComment;

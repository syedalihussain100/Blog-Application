import React, { useEffect } from "react";
import { PlusCircleIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { createCategoryAction } from "../../redux/Slices/Category/categorySlice";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

// Form Schema
const formSchema = Yup.object({
  title: Yup.string().required("Title is Required"),
});

const AddNewCategory = () => {
  const dispatch = useDispatch();
  const storeData = useSelector((state) => state?.category);
  const { loading, appErr, serverErr, category, isCreated } = storeData;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      //dispath the action
      dispatch(createCategoryAction(values));
      //console.log(values);
    },
    validationSchema: formSchema,
  });

  if (isCreated) return navigate("/category-list");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <BookOpenIcon className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Category
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-indigo-600 hover:text-indigo-500">
              These are the categories user will select when creating a post
            </p>
          </p>
          {/* Display Error */}

          {appErr || serverErr ? (
            <h2 className="text-red-500 text-center text-lg">
              {serverErr?.message} {appErr}
            </h2>
          ) : null}
        </div>
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Name
              </label>
              {/* Title */}
              <input
                value={formik.values.title}
                onChange={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                type="text"
                autoComplete="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
                placeholder="New Category"
              />
              <div className="text-red-400 mb-2">
                {/* {formik.touched.title && formik.errors.title} */}
                {formik.touched.title && formik.errors.title}
              </div>
            </div>
          </div>

          <div>
            <div>
              {/* Submit */}
              {loading ? (
                <button
                  disabled
                  className="py-4 w-full bg-gray-500 text-white font-bold rounded-full transition duration-200"
                >
                  Login Please Wait
                </button>
              ) : (
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <PlusCircleIcon
                      className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  Add new Category
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCategory;

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { resetPasswordAction } from "../../../redux/Slices/users/usersSlices";

//Form schema
const formSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string().required("confirmPassword is required"),
});

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();
  //formik
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      //dispath the action
      const data = {
        password: values?.password,
        confirmPassword: values?.confirmPassword,
        token,
      };
      dispatch(resetPasswordAction(data));
     
    },
    validationSchema: formSchema,
  });

  //select data from store
  const storeData = useSelector((state) => state?.users);
  const { loading, appErr, serverErr, resetPassword } = storeData;

  //Redirect

  useEffect(() => {
    setTimeout(() => {
      if (resetPassword) navigate("/login");
    }, 5000);
  }, [resetPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password Reset
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Reset your password if you have forgotten
            </a>
          </p>
        </div>
        {/* Err msg */}
        <div className="text-red-500 text-center">
          {appErr || serverErr ? (
            <h3>
              {serverErr?.message} {appErr}
            </h3>
          ) : null}
        </div>

        {/* Sucess msg */}
        <div className="text-green-700 text-center">
          {resetPassword && (
            <h3>
              Password Reset Successfully. You will be redirected to login with
              5 seconds
            </h3>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Enter Your New Password
              </label>
              <input
                type="password"
                autoComplete="password"
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter new Password"
              />
              {/* Err msg */}
              <div className="text-red-400 mb-2">
                {formik.touched.pasword && formik.errors.pasword}
              </div>
            </div>
          </div>
          {/* confirm password */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Enter Your New Password
              </label>
              <input
                type="password"
                autoComplete="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter confirm Password"
              />
              {/* Err msg */}
              <div className="text-red-400 mb-2">
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between"></div>

          <div>
            {loading ? (
              <button
                disabled
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 "
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Loading please wait...
              </button>
            ) : (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Reset Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

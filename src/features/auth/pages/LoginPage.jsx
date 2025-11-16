import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { loginSchema } from "../utils/validation";
import { useLogin } from "../hooks/useLogin";
import imageDemo from "../../../assets/demo_page.webp";
import logger from "../../../core/utils/logger";

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { mutate: performLogin, isPending, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  // The submit handler is now just one line!
  const onSubmit = (data) => {
    logger.info("calling data");
    performLogin(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <img
        src={imageDemo}
        alt="Demo"
        className="max-h-full min-w-1/2 md:h-screen hidden md:block max-w-1/2 object-cover"
      />

      <div className="w-full min-w-3xs max-w-1/2 md:max-w-1/2 md:min-w-1/2 rounded-lg ms-2  md:ms-0 me-2 md:me-0 flex justify-center items-center">
        <div className=" bg-white shadow-md md:w-md p-6 rounded-xl ">
          <div>
            <h2 className="mb-6 text-center text-2xl font-bold">Welcome Back</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {serverError && (
                <p className="mb-4 text-center text-sm text-red-600">{serverError}</p>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  {...register("username")}
                  type="text"
                  className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  className="mt-1  h-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-blue-300 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-orange-300"
              >
                {isPending ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
          <div className="hidden md:flex md:flex-row justify-between mt-2 text-blue-200 ">
            <Link to={"/register"} className="hover:text-blue-300">
              register
            </Link>
            <Link to={"/forgetPassword"} className="hover:text-blue-300">
              forget password
            </Link>
          </div>
          <div className="flex flex-col gap-4 mt-4 md:hidden">
            <Link to={"/register"} className="hover:text-blue-300">
              <button className="w-full bg-blue-100 h-10 rounded-md">register</button>
            </Link>
            <Link to={"/forgetPassword"} className="hover:text-blue-300">
              <button className="w-full bg-blue-100 h-10 rounded-md">forget password</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

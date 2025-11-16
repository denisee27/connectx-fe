import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerSchema } from "../utils/validation";
import { useRegister } from "./../hooks/useRegister";
import imageDemo from "../../../assets/demo_page.webp";
import logger from "../../../core/utils/logger";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const { mutateAsync: registerUser, isPending } = useRegister();

  const onSubmit = async (data) => {
    setServerError("");
    logger.info("Submitting registration form", data);
    try {
      await registerUser(data);
    } catch (err) {
      setServerError(err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-min-full min-h-screen md:flex md:flex-row">
      <div className="md:min-w-1/2 md:max-w-1/2">
        <img src={imageDemo} className="hidden w-full md:block object-cover md:h-screen" />
      </div>
      <div className="flex justify-center items-center h-screen w-full md:min-w-1/2 md:max-w-1/2">
        <div className="bg-amber-50 p-8 rounded-xl">
          <h1 className="text-center text-2xl font-bold">Welcome to this place</h1>
          <p className="text-center">Please register to use this app</p>

          {serverError && <p className="mb-3 text-center text-sm text-red-600">{serverError}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                {...register("name")}
                type="text"
                className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="mb-3">
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
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                type="text"
                className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                {...register("phoneNumber")}
                type="text"
                className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-blue-300 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-orange-300"
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </form>

          <Link to={"/login"} className="hover:text-blue-300">
            <button className="mt-5">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

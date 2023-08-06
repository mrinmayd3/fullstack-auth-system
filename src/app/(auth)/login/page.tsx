"use client";
import React from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type LoginFormType = {
  email: string;
  password: string;
};

// email regex
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function LogIn() {
  // router
  const router = useRouter();

  // validation schema
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .required()
      .email()
      .matches(emailRegex, "email must be a valid email"),
    password: Yup.string().required(),
  });

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginValidationSchema),
  });

  // submit handler
  const submitHandler = async (value: LoginFormType) => {
    // console.log(value);

    try {
      const response = await axios.post("/api/users/login", value);

      // console.log(response);

      if (response.data.success) {
        reset();
        router.push("/");
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<{ error: string }>(error)) {
        const displayErr = error.response?.data.error;

        toast.error(displayErr!);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex justify-center align-middle mt-10 p-4">
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <h1 className="text-center text-4xl font-bold mt-3">Log in</h1>

        <div className="my-4">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            type="email"
            id="email"
            placeholder="Email"
            {...register("email")}
          />

          <small className="block text-red-500 mt-3">
            {errors.email?.message}
          </small>
        </div>

        <div className="my-4">
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            type="password"
            id="password"
            placeholder="Enter your password"
            {...register("password")}
          />

          <small className="block text-red-500 mt-3">
            {errors.password?.message}
          </small>
        </div>

        <button
          className="w-full p-2 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "logging in .." : "Log in"}
        </button>

        <div className="mt-3">
          <Link href={"/forgot-password"} className="hover:border-b-2 ">
            Forgot password?
          </Link>
        </div>

        <div className="block mt-10 border-b-2">
          <Link href={"/signup"}>Don't have an account go to sign up page</Link>
        </div>
      </form>
    </div>
  );
}

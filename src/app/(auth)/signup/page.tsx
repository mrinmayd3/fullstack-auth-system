"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import { toast } from "react-hot-toast";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// types
type SignUpFormType = {
  username: string;
  email: string;
  password: string;
};

// email regex
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignUp() {
  const router = useRouter();

  // console.log("sing up page render");

  // form validation schema
  const userValidationSchema = Yup.object().shape({
    username: Yup.string().required().min(3).max(20),
    email: Yup.string()
      .required()
      .email()
      .matches(emailRegex, "email must be a valid email"),
    password: Yup.string().required().min(6),
  });

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormType>({
    resolver: yupResolver(userValidationSchema),
  });

  // submit handler
  const submitHandler = async (value: SignUpFormType) => {
    // console.log("submitted", value);

    try {
      const response = await axios.post("api/users/signup", value);

      console.log("successfully created", response.data);

      if (response.data.user) {
        // router.push("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex justify-center align-middle mt-10">
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <h1 className="text-center text-4xl font-bold mt-3">sign up</h1>

        <div className="my-4">
          <label className="block mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            type="text"
            id="username"
            placeholder="Username"
            {...register("username")}
          />

          <small className="block text-red-500 mt-3">
            {errors.username?.message}
          </small>
        </div>

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
          {isSubmitting ? "creating user .." : "Sign up"}
        </button>

        <div className="block mt-4 border-b-2">
          <Link href={"/login"}>Have an account go to log in page</Link>
        </div>
      </form>
    </div>
  );
}

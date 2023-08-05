"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";

type FromValueType = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const [token, setToken] = useState("");

  const router = useRouter();

  // form validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FromValueType>({
    resolver: yupResolver(validationSchema),
  });

  // get the token from the url
  useEffect(() => {
    const token = window.location.search.split("=")[1];
    setToken(token);
  }, []);

  // submit handler
  const onSubmit = async (value: FromValueType) => {
    // console.log(value, token);

    try {
      const { data } = await axios.post("/api/users/reset-password", {
        token,
        password: value.password,
      });

      //   console.log(data);
      if (data.success) {
        toast.success(data.message);
        router.push("/login");
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
    <div className="flex justify-center align-middle mt-10 p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-center text-4xl font-bold mt-3">
          Reset your password
        </h1>
        <p className="text-center">Enter your new password and submit</p>

        <div className="my-4">
          <label className="block mb-2 text-xl" htmlFor="password">
            Password
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            placeholder="Enter your password"
            type="password"
            {...register("password")}
          />
          <small className="block text-red-500 mt-3">
            {errors.password?.message}
          </small>
        </div>

        <div className="my-4">
          <label className="block mb-2 text-xl" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            placeholder="Enter your email"
            type="password"
            {...register("confirmPassword")}
          />
          <small className="block text-red-500 mt-3">
            {errors.confirmPassword?.message}
          </small>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full p-2 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
        >
          {isSubmitting ? "submitting.." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

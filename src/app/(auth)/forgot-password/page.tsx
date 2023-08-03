"use client";

import axios, { isAxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormInputType = {
  email: string;
};

// email regex
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ForgotPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isLoading, isSubmitted, isSubmitting },
  } = useForm<FormInputType>();

  // submit handler
  const onSubmit: SubmitHandler<FormInputType> = async (value) => {
    try {
      const { data } = await axios.post("/api/users/forgot-password", {
        email: value.email,
      });

      console.log(data);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error);
      } else {
        console.log(error);
      }
    }
  };

  //   console.log(isLoading, isSubmitted, isSubmitting);

  return (
    <div className="flex justify-center align-middle mt-10 p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-center text-4xl font-bold mt-3">
          Forgot your password
        </h1>
        <p className="text-center">
          Enter your existing email and request for a reset password mail
        </p>

        <div className="my-4">
          <label className="block mb-2 text-xl" htmlFor="email">
            Email
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            placeholder="Enter your email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: emailRegex,
                message: "Invalid email id",
              },
            })}
          />
          <small className="block text-red-500 mt-3">
            {errors.email?.message}
          </small>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full p-2 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
        >
          {isSubmitting ? "sending.." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

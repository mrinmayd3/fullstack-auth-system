"use client";
import React, { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LogIn() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // router
  const router = useRouter();

  // change handler
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  // submit handler
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(user);

    try {
      const response = await axios.post("/api/users/login", user);

      console.log(response);

      if (response.data.success) {
        router.push("/");
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.log(error);

      if (axios.isAxiosError<{ error: string }>(error)) {
        const displayErr = error.response?.data.error;

        toast.error(displayErr!);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center align-middle">
      <form onSubmit={submitHandler}>
        <h1 className="text-center text-4xl font-bold mt-3">Log in</h1>

        <div className="my-4">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={user.email}
            onChange={changeHandler}
            required
          />
        </div>

        <div className="my-4">
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={changeHandler}
            required
          />
        </div>

        <button
          className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          disabled={isLoading}
        >
          {isLoading ? "logging in .." : "Log in"}
        </button>

        <div className="block mt-2 border-b-2">
          <Link href={"/signup"}>Don't have an account go to sign up page</Link>
        </div>
      </form>
    </div>
  );
}

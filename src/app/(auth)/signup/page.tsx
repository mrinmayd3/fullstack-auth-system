"use client";

import React, { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export default function SignUp() {
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  console.log("sing up page render");

  // on change handler
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  // submit handler
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // console.log("submitted", user);

    try {
      const response = await axios.post("api/users/signup", user);

      console.log("successfully created", response.data);

      if (response.data.user) {
        // router.push("/login");
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error);

      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center align-middle mt-10">
      <form onSubmit={submitHandler}>
        <h1 className="text-center text-4xl font-bold mt-3">sign up</h1>

        <div className="my-4">
          <label className="block mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={user.username}
            onChange={changeHandler}
            required
          />
        </div>

        <div className="my-4">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
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
            className="w-full p-2 rounded-md text-black focus:outline-none focus:ring focus:border-blue-900"
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
          className="w-full p-2 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          disabled={isLoading}
        >
          {isLoading ? "creating user .." : "Sign up"}
        </button>

        <div className="block mt-4 border-b-2">
          <Link href={"/login"}>Have an account go to log in page</Link>
        </div>
      </form>
    </div>
  );
}

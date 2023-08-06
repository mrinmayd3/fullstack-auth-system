"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
// import UserIcon from "../../../../../public/user.svg";

import UserIcon from "@/components/UserIcon";

type userType = {
  email: string;
  isVerified: boolean;
  username: string;
  _id: string;
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [userData, setUserData] = useState<userType>();

  useEffect(() => {
    const coltroller = new AbortController();

    axios
      .get("/api/users/authenticated", { signal: coltroller.signal })
      .then((res) => {
        // console.log(res.data);
        setUserData(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      coltroller.abort();
    };
  }, []);

  const logoutHandler = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      // console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2">
      <h1 className="m-2 text-2xl text-center">Profile</h1>

      <div className="flex justify-center items-center gap-5 mt-24 max-sm:flex-col">
        <div className="flex justify-center items-center gap-3">
          <div className="w-20 h-20 text-zinc-400">
            <UserIcon />
          </div>

          {userData && (
            <div>
              <p className="text-2xl font-bold">{userData.username}</p>
              <p className="text-zinc-400">{userData.email}</p>
              <p className="text-zinc-400">
                {" "}
                {userData.isVerified ? "User verified ✅" : "NOT VERIFIED ❌"}
              </p>
            </div>
          )}
        </div>

        <div className="border-l border-gray-300">
          <button className="p-4 flex gap-2" onClick={logoutHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            log out
          </button>
        </div>
      </div>
    </div>
  );
}

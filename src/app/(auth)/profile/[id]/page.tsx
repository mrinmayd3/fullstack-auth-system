"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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
      console.log(response);

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
      <h1 className="m-2 text-2xl">ProfilePage</h1>

      <div>
        {userData && (
          <>
            <p>{userData.username}</p>
            <p>{userData.email}</p>
            <p> {userData.isVerified ? "User verified" : "NOT VERIFIED"}</p>
          </>
        )}
      </div>

      <button className="p-1 border rounded-md mt-2" onClick={logoutHandler}>
        log out
      </button>
    </div>
  );
}

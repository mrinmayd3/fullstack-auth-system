"use client";

import axios, { isAxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const verifyEmail = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const token = window.location.search.split("=")[1];
    setToken(token);
  }, []);

  const clickHandler = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/users/verify-email", { token });

      // console.log(data);
      if (data.success) {
        setSuccessMsg(data.message);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error);
      } else {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center my-5">
        <h2 className="text-3xl my-4">Verify your email</h2>
        {successMsg ? (
          <div>
            <p className="text-green-400">{successMsg}</p>
          </div>
        ) : (
          <button
            className="border rounded p-2"
            onClick={clickHandler}
            disabled={isLoading}
          >
            {isLoading ? "verifying.." : "Verify"}
          </button>
        )}
      </div>
    </div>
  );
};

export default verifyEmail;

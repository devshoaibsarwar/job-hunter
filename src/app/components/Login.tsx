import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const { login, storeToken } = AuthActions();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await login(data.email, data.password);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      const json = await response.json();
      storeToken(json.user.api_token);
  
      router.push("dashboard");
    } catch (err) {
        alert(err)
    }
  };

  const handleRegisterClick = () => {
    router.push("/auth/register");
};

  return (
    <div className="w-[100%] m-0 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[20%] h-[40vh] px-8 py-6 mt-4 text-left bg-white shadow-lg w-1/3">
        <h3 className="text-2xl font-semibold text-[black]">Login to your account</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full text-[black] px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.email && (
              <span className="text-xs text-red-600">Email is required</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full text-[black] px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.password && (
              <span className="text-xs text-red-600">Password is required</span>
            )}
          </div>
          <div className="flex items-center justify-center mt-4 gap-2 flex-col">
            <button className="px-12 py-2 mt-2 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
              Login
            </button>
            <p className="text-sm text-[black]">
                  Don't have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={handleRegisterClick}
                  >
                    Register
                  </span>
            </p>
          </div>
          {errors.root && (
            <span className="text-xs text-red-600">{errors.root.message}</span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
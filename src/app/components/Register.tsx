
import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>();
    const router = useRouter();
    const { register: registerUser } = AuthActions();

    const onSubmit = async (data: FormData) => {
        try {
            const response = await registerUser(data.email, data.password);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            router.push("/dashboard");
        } catch (err) {
            alert(err)
            console.error("Registration error:", err);
        }
    };

    const handleLoginClick = () => {
        router.push("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="px-8 w-[20%] py-6 mt-4 text-left bg-white shadow-lg w-1/3">
            <h3 className="text-2xl font-semibold text-[black]">Register your account</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div>
                <label className="block" htmlFor="email">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-2 mt-2 border text-[black] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-2 mt-2 border text-[black] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.password && (
                  <span className="text-xs text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center mt-4">
                <button className="px-12 py-2 m-6 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                  Register
                </button>
                <p className="text-sm text-[black]">
                  Already have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={handleLoginClick}
                  >
                    Login
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

export default Register;
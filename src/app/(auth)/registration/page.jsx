"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRegisterStore } from "@/store/pages/auth/registration/registerStore";
import { Eye, EyeOff } from "lucide-react";

import frame168 from "../../../assets/img/pages/auth/registration/Frame 168.png";
import image71 from "../../../assets/img/pages/auth/registration/image 71.png";
import image72 from "../../../assets/img/pages/auth/registration/image 72.png";
import image73 from "../../../assets/img/pages/auth/registration/image 73.png";
import toast, { Toaster } from "react-hot-toast";

export default function Registration() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const addUser = useRegisterStore((state) => state.addUser);
  const isLoading = useRegisterStore((state) => state.isLoading);
  const router = useRouter();

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    const result = await addUser({
      email: data.email,
      fullName: data.fullName,
      userName: data.userName,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (result?.success) {
      reset();
      toast.success("Registration successful!");
      router.push("/login");
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-around w-[80%] m-auto items-center">
      <Toaster />
      <div className="hidden md:block">
        <Image src={image71} alt="phone" />
        <p className="text-[#64748B] text-center mt-[20px]">Установите приложение</p>
        <div className="flex items-center justify-center gap-[10px] mt-[20px]">
          <Image src={image72} alt="Google Play" />
          <Image src={image73} alt="Microsoft" />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-sm shadow-sm">
          <div className="flex flex-col items-center mb-6">
            <Image src={frame168} alt="Instagram" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              type="email"
              placeholder="Phone number or email"
              {...register("email", { required: "This field is required" })}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}

            <input
              type="text"
              placeholder="Full name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName.message}</p>
            )}

            <input
              type="text"
              placeholder="Username"
              {...register("userName", { required: "Username is required" })}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            {errors.userName && (
              <p className="text-red-500 text-xs">{errors.userName.message}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer select-none"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer select-none"
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
            )}

            <p className="text-xs text-center text-gray-500">
              By signing up, you agree to our{" "}
              <a href="#" className="font-semibold">
                Terms
              </a>
              ,{" "}
              <a href="#" className="font-semibold">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold">
                Cookies Policy
              </a>
              .
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold py-2 rounded-md transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {isLoading ? "sign up..." : "Sign up"}
            </button>
          </form>

          <div className="mt-6 border-t pt-4 text-center">
            <p className="text-sm">
              Have an account?{" "}
              <a href="/login" className="text-blue-500 font-semibold">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

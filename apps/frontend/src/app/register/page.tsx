// register/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../../auth/supabaseClient";
import { ErrorMessage } from "@/components/errorMessage/ErrorMessage";

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const { error } = await supabase.auth.signUp(data);
    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 pt-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.email && <li>{errors.email.message}</li>}
                {errors.password && <li>{errors.password.message}</li>}
              </ul>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="h-[90px]">
              {" "}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address{" "}
                {errors.email && <span className="text-red-500">*</span>}
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <div className="min-h-[24px] mt-1">
                {" "}
                {errors.email && (
                  <ErrorMessage message={errors.email.message} />
                )}
              </div>
            </div>
            <div className="h-[90px]">
              {" "}
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password{" "}
                {errors.password && <span className="text-red-500">*</span>}
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <div className="min-h-[24px] mt-1">
                {" "}
                {errors.password && (
                  <ErrorMessage message={errors.password.message} />
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

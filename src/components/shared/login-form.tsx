"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import Loading from "../ui/loading";
import { useGoogleLogin } from "@react-oauth/google";
const LoginForm = ({ setIsLogin, setLoading, loading }: any) => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      getUserEmail(tokenResponse.access_token)
        .then(async (userInfo: any) => {
          const email = userInfo?.email || ""; // Get the email
          const userName = userInfo.names?.[0]?.displayName || ""; // Get the user's name
          const phoneNumber = userInfo.phoneNumbers?.[0]?.value || null; // Get the phone number, if available

          setFormData({ ...formData, email, password: "google" });

          // Make login API call
          const response = await fetch(
            process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/google/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                isGoogleAuth: true,
              }),
            }
          );

          if (!response.ok) {
            toast.error("Error fetching user information");
          }

          // Await the JSON response
          const data = await response.json();

          if (data.code === 404) {
            toast.error("Please Sign Up First");
            router.push("/");
            setTimeout(() => window.location.reload(), 2000);
            return;
          }
          toast.success("Login successful");
          sessionStorage.setItem("accessToken", data.token);

          // Redirect or update state as needed
          router.push("/tenders");
          setLoading(false);
        })
        .catch((error: any) => {
          toast.error("Error fetching user information");
        });
    },
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    let formIsValid = true;
    const { email, password } = formData;
    const newErrors = { ...errors };

    if (!email.trim()) {
      newErrors.email = "Email address is required";
      formIsValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors(newErrors);
      setIsLoading(false); // Don't forget to set loading to false if validation fails
      return;
    }

    try {
      // Make login API call
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      // Await the JSON response
      const data = await response.json(); // <-- Await here
      toast.success("Login successful");
      console.log(data.token, "data.token");

      sessionStorage.setItem("accessToken", data.token);

      // Redirect or update state as needed
      router.push("/tenders");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ ...errors, general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false); // Ensure loading state is reset after try/catch
    }
  };

  if (isLoading) return <Loading />;

  async function getUserEmail(accessToken: string): Promise<any> {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching user email: ${response.statusText}`);
    }

    const data: any = await response.json();
    return data;
  }

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 specific-devices-position lg:min-h-screen">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-6 sm:p-8 md:p-10">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Sign in
            </h1>
          </div>
          <div className="mt-4 sm:mt-5">
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                {/* Form Group */}
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                      aria-describedby="email-error"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-2" id="email-error">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full border ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      } rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                      aria-describedby="password-error"
                    />
                    {errors.password && (
                      <p
                        className="text-xs text-red-600 mt-2"
                        id="password-error"
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className=""></div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-500 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                {/* End Form Group */}
                {errors.general && (
                  <p className="text-xs text-red-600 mt-2">{errors.general}</p>
                )}
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Sign in
                </button>
              </div>
            </form>
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>
            <button
              onClick={() => {
                setLoading(true);
                login();
              }}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-gray-100/50 text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <svg
                className="w-4 h-auto"
                width={46}
                height={47}
                viewBox="0 0 46 47"
                fill="none"
              >
                <path
                  d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                  fill="#4285F4"
                />
                <path
                  d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                  fill="#34A853"
                />
                <path
                  d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                  fill="#FBBC05"
                />
                <path
                  d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                  fill="#EB4335"
                />
              </svg>
              Sign in with Google
            </button>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account?{" "}
              <button
                className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </p>
            {/* End Form */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

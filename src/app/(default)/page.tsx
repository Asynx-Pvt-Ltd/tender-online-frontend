"use client";

import LoginForm from "@/components/shared/login-form";
import Header from "@/components/ui/header";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Signup from "../(auth)/signup/page";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import Loading from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import Footer from "@/components/shared/footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StickyNotice from "@/components/shared/stickyNotice";

interface SectionData {
  title: string;
  description: string;
  hasBorder?: boolean;
}

const sections: SectionData[] = [
  {
    title: "The People",
    description: "Bringing the Quality of Life",
    hasBorder: true,
  },
  {
    title: "The Government",
    description: "Ideal Selection Of Bidders",
    hasBorder: true,
  },
  {
    title: "The Business",
    description: "Scale New Heights in Your Business",
    hasBorder: false,
  },
];

export default function Home() {
  const [isLogin, setIsLogin] = React.useState(true);
  const navigate = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    // List of routes that do not require authentication
    const skipAuthRoutes = ["/support", "/about-us", "/pricing"];

    // Check if the current path is in the list of routes to skip authentication
    if (skipAuthRoutes.includes(location.pathname)) {
      return;
    }

    // If the token exists, set user as logged in, otherwise redirect
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate, location]);
  const [banner, setBanner] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(true);
  const { data, error } = useQuery({
    queryKey: ["images"],
    queryFn: () =>
      fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/ads/banner/images"
      ).then((res) => res.json()),
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/banner"
        );
        const data = await response.data.banner;
        setBanner(data.banner);
        setIsActive(data.isActive);
        setIsSignup(data.isSignup);
        setIsVisible(data.isActive);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBanner();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (loading) return <Loading />;

  const handleToClose = () => {
    const isClosed = localStorage.getItem("isClosed");
    if (!isClosed) {
      localStorage.setItem("isClosed", "true");
    } else {
      localStorage.setItem("isClosed", "false");
    }
    close();
  };

  const isClosed =
    typeof window !== "undefined" && localStorage.getItem("isClosed");

  return (
    <main className="relative lg:h-screen">
      {isVisible && (
        <div className="relative">
          <Link
            className="group relative z-50 block bg-black/90 hover:bg-black focus:outline-none  py-2 text-center transition duration-300 dark:bg-white/10 dark:hover:bg-white/10 dark:focus:bg-white/10"
            href="/"
          >
            <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
              <p className="me-2 inline-block text-sm text-white dark:text-neutral-200">
                {banner}
              </p>
              {isSignup && !isLoggedIn && (
                <span
                  className="group-hover:underline group-focus:underline decoration-2 inline-flex justify-center items-center gap-x-2 font-semibold text-blue-600 text-sm dark:text-blue-500"
                  onClick={() => {
                    if (window.location.pathname !== "/") {
                      window.location.href = "/";
                    } else if (setIsLogin !== undefined) {
                      setIsLogin(false);
                    }
                  }}
                >
                  Sign up
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              )}
            </div>
          </Link>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-600 z-50 hover:text-gray-900 dark:text-neutral-200 dark:hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {isClosed !== "true" && (
        <>
          {Array.isArray(data) && data.length > 0 && data[0]?.active && (
            <Modal
              style={{ borderRadius: "24px" }}
              size={"xl"}
              className="rounded-3xl"
              opened={opened}
              onClose={handleToClose}
              centered
            >
              {/* Modal content */}{" "}
              <div className="">
                <div className="">
                  <XIcon
                    onClick={handleToClose}
                    className="h-6 w-6 text-white"
                  />
                  <Link href={data[0].url || "/"}>
                    <img
                      src={data[0].imageUrl}
                      alt="banner"
                      className="w-full rounded-xl h-[400px] object-cover"
                    />
                  </Link>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}

      <Header isLogin1={isLogin} setIsLogin1={setIsLogin} />
      {!isLoggedIn ? (
        <div className="flex lg:flex-row flex-col lg:gap-0 gap-16 h-fit specific-devices-position bg-[#F5F8FF]">
          {/* Left Pane */}
          <div className="lg:flex relative w-full h-fit items-start mt-[7vh] lg:mt-[17vh] justify-center flex-1 text-black">
            <div className=" text-center  w-full relative">
              {/* <div className="fill-black bg-black opacity-50 absolute inset-0"></div> */}
              <div className="object-cover w-full h-fit" />
              <div
                className={cn(
                  "absolute h-[65%] flex items-center justify-between flex-col top-[25%] px-32",
                  !isLoggedIn && "!w-full"
                )}
              >
                <div className="flex flex-col-reverse justify-center items-center lg:gap-2">
                  <div className="pt-5">
                    <StickyNotice />
                  </div>
                  <div className="text-xl font-normal">
                    <h4 className="lg:w-[70%] mx-auto lg:pt-[2vh] text-[14px] leading-tight lg:text-[18px] text-balance lg:text-pretty pt-2">
                      A hassle-free, premium bidding experience specializing in
                      government tenders, ensuring equal opportunities for
                      businesses of all sizes.
                    </h4>
                  </div>

                  <div className="flex pl-0 pt-8 lg:gap-8 py-2 font-semibold text-sm lg:flex-nowrap flex-wrap gap-2 justify-center">
                    <div className="flex items-center lg:gap-2  gap-1">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_0_98)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.18144 1.34328C9.20469 0.385573 10.7953 0.385573 11.8186 1.34328L12.7046 2.17259C12.9544 2.40632 13.2805 2.54141 13.6224 2.55272L14.8353 2.59285C16.2361 2.6392 17.3608 3.76394 17.4072 5.16469L17.4473 6.37766C17.4586 6.7195 17.5937 7.04563 17.8274 7.29538L18.6567 8.18144C19.6144 9.20469 19.6144 10.7953 18.6567 11.8186L17.8274 12.7046C17.5937 12.9544 17.4586 13.2805 17.4473 13.6224L17.4072 14.8353C17.3608 16.2361 16.2361 17.3608 14.8353 17.4072L13.6223 17.4473C13.2805 17.4586 12.9544 17.5937 12.7046 17.8274L11.8186 18.6567C10.7953 19.6144 9.20469 19.6144 8.18144 18.6567L7.29538 17.8274C7.04563 17.5937 6.7195 17.4586 6.37766 17.4473L5.16469 17.4072C3.76394 17.3608 2.6392 16.2361 2.59285 14.8353L2.55272 13.6224C2.54141 13.2805 2.40632 12.9544 2.17259 12.7046L1.34328 11.8186C0.385573 10.7953 0.385573 9.20469 1.34328 8.18144L2.17259 7.29538C2.40632 7.04563 2.54141 6.7195 2.55272 6.37766L2.59285 5.16469C2.6392 3.76394 3.76394 2.6392 5.16469 2.59285L6.37766 2.55272C6.7195 2.54141 7.04563 2.40632 7.29538 2.17259L8.18144 1.34328ZM13.8938 7.92713C14.1297 7.67516 14.1166 7.27963 13.8646 7.04375C13.6127 6.80784 13.2171 6.82088 12.9813 7.07288L8.75666 11.5855L7.01875 9.72913C6.78288 9.47713 6.38734 9.46409 6.13538 9.7C5.88338 9.93588 5.87034 10.3314 6.10625 10.5834L8.30038 12.9271C8.41856 13.0534 8.58375 13.125 8.75666 13.125C8.92956 13.125 9.09475 13.0534 9.21291 12.9271L13.8938 7.92713Z"
                            fill="url(#paint0_linear_0_98)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_0_98"
                            x1="24.5762"
                            y1="23.1634"
                            x2="7.94531"
                            y2="3.70719"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0.00265844" stop-color="#FF37DF" />
                            <stop offset="1" stop-color="#6E00FF" />
                          </linearGradient>
                          <clipPath id="clip0_0_98">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Effortless Bidding</span>
                    </div>
                    <div className="flex items-center lg:gap-2 gap-1">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_0_98)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.18144 1.34328C9.20469 0.385573 10.7953 0.385573 11.8186 1.34328L12.7046 2.17259C12.9544 2.40632 13.2805 2.54141 13.6224 2.55272L14.8353 2.59285C16.2361 2.6392 17.3608 3.76394 17.4072 5.16469L17.4473 6.37766C17.4586 6.7195 17.5937 7.04563 17.8274 7.29538L18.6567 8.18144C19.6144 9.20469 19.6144 10.7953 18.6567 11.8186L17.8274 12.7046C17.5937 12.9544 17.4586 13.2805 17.4473 13.6224L17.4072 14.8353C17.3608 16.2361 16.2361 17.3608 14.8353 17.4072L13.6223 17.4473C13.2805 17.4586 12.9544 17.5937 12.7046 17.8274L11.8186 18.6567C10.7953 19.6144 9.20469 19.6144 8.18144 18.6567L7.29538 17.8274C7.04563 17.5937 6.7195 17.4586 6.37766 17.4473L5.16469 17.4072C3.76394 17.3608 2.6392 16.2361 2.59285 14.8353L2.55272 13.6224C2.54141 13.2805 2.40632 12.9544 2.17259 12.7046L1.34328 11.8186C0.385573 10.7953 0.385573 9.20469 1.34328 8.18144L2.17259 7.29538C2.40632 7.04563 2.54141 6.7195 2.55272 6.37766L2.59285 5.16469C2.6392 3.76394 3.76394 2.6392 5.16469 2.59285L6.37766 2.55272C6.7195 2.54141 7.04563 2.40632 7.29538 2.17259L8.18144 1.34328ZM13.8938 7.92713C14.1297 7.67516 14.1166 7.27963 13.8646 7.04375C13.6127 6.80784 13.2171 6.82088 12.9813 7.07288L8.75666 11.5855L7.01875 9.72913C6.78288 9.47713 6.38734 9.46409 6.13538 9.7C5.88338 9.93588 5.87034 10.3314 6.10625 10.5834L8.30038 12.9271C8.41856 13.0534 8.58375 13.125 8.75666 13.125C8.92956 13.125 9.09475 13.0534 9.21291 12.9271L13.8938 7.92713Z"
                            fill="url(#paint0_linear_0_98)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_0_98"
                            x1="24.5762"
                            y1="23.1634"
                            x2="7.94531"
                            y2="3.70719"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0.00265844" stop-color="#FF37DF" />
                            <stop offset="1" stop-color="#6E00FF" />
                          </linearGradient>
                          <clipPath id="clip0_0_98">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Government Expertise</span>
                    </div>
                    <div className="flex items-center lg:gap-2 gap-1">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_0_98)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.18144 1.34328C9.20469 0.385573 10.7953 0.385573 11.8186 1.34328L12.7046 2.17259C12.9544 2.40632 13.2805 2.54141 13.6224 2.55272L14.8353 2.59285C16.2361 2.6392 17.3608 3.76394 17.4072 5.16469L17.4473 6.37766C17.4586 6.7195 17.5937 7.04563 17.8274 7.29538L18.6567 8.18144C19.6144 9.20469 19.6144 10.7953 18.6567 11.8186L17.8274 12.7046C17.5937 12.9544 17.4586 13.2805 17.4473 13.6224L17.4072 14.8353C17.3608 16.2361 16.2361 17.3608 14.8353 17.4072L13.6223 17.4473C13.2805 17.4586 12.9544 17.5937 12.7046 17.8274L11.8186 18.6567C10.7953 19.6144 9.20469 19.6144 8.18144 18.6567L7.29538 17.8274C7.04563 17.5937 6.7195 17.4586 6.37766 17.4473L5.16469 17.4072C3.76394 17.3608 2.6392 16.2361 2.59285 14.8353L2.55272 13.6224C2.54141 13.2805 2.40632 12.9544 2.17259 12.7046L1.34328 11.8186C0.385573 10.7953 0.385573 9.20469 1.34328 8.18144L2.17259 7.29538C2.40632 7.04563 2.54141 6.7195 2.55272 6.37766L2.59285 5.16469C2.6392 3.76394 3.76394 2.6392 5.16469 2.59285L6.37766 2.55272C6.7195 2.54141 7.04563 2.40632 7.29538 2.17259L8.18144 1.34328ZM13.8938 7.92713C14.1297 7.67516 14.1166 7.27963 13.8646 7.04375C13.6127 6.80784 13.2171 6.82088 12.9813 7.07288L8.75666 11.5855L7.01875 9.72913C6.78288 9.47713 6.38734 9.46409 6.13538 9.7C5.88338 9.93588 5.87034 10.3314 6.10625 10.5834L8.30038 12.9271C8.41856 13.0534 8.58375 13.125 8.75666 13.125C8.92956 13.125 9.09475 13.0534 9.21291 12.9271L13.8938 7.92713Z"
                            fill="url(#paint0_linear_0_98)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_0_98"
                            x1="24.5762"
                            y1="23.1634"
                            x2="7.94531"
                            y2="3.70719"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0.00265844" stop-color="#FF37DF" />
                            <stop offset="1" stop-color="#6E00FF" />
                          </linearGradient>
                          <clipPath id="clip0_0_98">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Fair Competition</span>
                    </div>
                  </div>

                  <div className=" bg-black flex lg:items-start items-center py-[2vh] lg:py-[33px] justify-between rounded-xl mt-6 lg:w-[589px] lg:h-[145px]">
                    {sections.map((section, index) => (
                      <>
                        <div
                          key={index}
                          className={section.hasBorder ? "w-full" : "w-full"}
                        >
                          <h2 className="px-2 text-white font-bold xl:text-lg lg:text-[18px] text-[14px]">
                            {section.title}
                          </h2>
                          <p className="text-white px-4 font-istok-web xl:text-sm lg:text-[14px] text-[12px] italic pt-2 font-thin">
                            {section.description}
                          </p>
                        </div>
                        {section.hasBorder && (
                          <svg
                            className="relative z-50"
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="80"
                            viewBox="0 0 10 95"
                            fill="none"
                          >
                            <line
                              x1="2.5"
                              y1="2.18557e-08"
                              x2="2.5"
                              y2="95"
                              stroke="#F4F4F4"
                            />
                            <path
                              d="M10 48L2.5 54.9282L2.5 41.0718L10 48Z"
                              fill="#F4F4F4"
                              fill-opacity="0.78"
                            />
                          </svg>
                        )}
                      </>
                    ))}
                  </div>
                </div>
                {/* <div className="flex text-gray-100  items-center  text-center justify-center z-50 gap-12  mt-auto  text-base">
                  <Link href={"/terms"}>Terms & Conditions </Link>
                  <Link href={"/privacy-policy"}>Privacy Policy </Link>
                  <Link href={"/cookie"}>Cookie Policy </Link>
                  <Link href={"/refund-policy"}>Refund Policy</Link>
                </div> */}
                {/* <div className="border-b w-full pt-4"></div> */}
                {/* <div className="flex item-center justify-between w-full pt-4 px-4">
                  <div className="flex item-center text-gray-300  mt-auto w-full">
                    <p>© TenderOnline 2024</p>
                  </div>
                  <div className="text-white flex items-center gap-4">
                    <Link href={"/blog"}>Blog</Link>
                    <Link href={"/support"}>Support</Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          {!isLoggedIn && (
            <div className="w-full lg:w-[35%] flex items-start lg:items-center justify-center lg:justify-center lg:mt-0 pt-[45vh] lg:pt-0 ">
              {isLogin ? (
                <LoginForm
                  setLoading={setLoading}
                  loading={loading}
                  setIsLogin={setIsLogin}
                />
              ) : (
                <Signup setIsLogin={setIsLogin} />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex lg:h-screen w-[80%] mx-auto lg:w-full items-center justify-center">
          {/* Left Pane */}
          <div className="w-full lg:flex h-screen relative items-center justify-center flex-1 text-black">
            <div className=" text-center  w-full relative h-full">
              {/* <div className="fill-black bg-black opacity-50 absolute inset-0"></div> */}
              <div className="object-cover w-full lg:h-screen" />
              <div
                className={cn(
                  "absolute h-[65%] w-full flex items-center justify-center flex-col top-[15%] px-32",
                  !isLoggedIn && "!w-full"
                )}
              >
                <div className="flex items-center justify-center flex-col-reverse gap-2 lg:gap-6">
                  <div className="text-xl w-full flex items-center justify-center font-normal">
                    <h4 className=" text-center text-[14px] leading-tight lg:text-[18px] lg:w-[50%] text-pretty">
                      A hassle-free, premium bidding experience specializing in
                      government tenders, ensuring equal opportunities for
                      businesses of all sizes.
                    </h4>
                  </div>
                  <div className="flex pl-0 pt-4 gap-2 lg:gap-8 py-2 font-semibold text-[12px] lg:text-sm flex-wrap lg:flex-nowrap justify-center">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_0_98)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.18144 1.34328C9.20469 0.385573 10.7953 0.385573 11.8186 1.34328L12.7046 2.17259C12.9544 2.40632 13.2805 2.54141 13.6224 2.55272L14.8353 2.59285C16.2361 2.6392 17.3608 3.76394 17.4072 5.16469L17.4473 6.37766C17.4586 6.7195 17.5937 7.04563 17.8274 7.29538L18.6567 8.18144C19.6144 9.20469 19.6144 10.7953 18.6567 11.8186L17.8274 12.7046C17.5937 12.9544 17.4586 13.2805 17.4473 13.6224L17.4072 14.8353C17.3608 16.2361 16.2361 17.3608 14.8353 17.4072L13.6223 17.4473C13.2805 17.4586 12.9544 17.5937 12.7046 17.8274L11.8186 18.6567C10.7953 19.6144 9.20469 19.6144 8.18144 18.6567L7.29538 17.8274C7.04563 17.5937 6.7195 17.4586 6.37766 17.4473L5.16469 17.4072C3.76394 17.3608 2.6392 16.2361 2.59285 14.8353L2.55272 13.6224C2.54141 13.2805 2.40632 12.9544 2.17259 12.7046L1.34328 11.8186C0.385573 10.7953 0.385573 9.20469 1.34328 8.18144L2.17259 7.29538C2.40632 7.04563 2.54141 6.7195 2.55272 6.37766L2.59285 5.16469C2.6392 3.76394 3.76394 2.6392 5.16469 2.59285L6.37766 2.55272C6.7195 2.54141 7.04563 2.40632 7.29538 2.17259L8.18144 1.34328ZM13.8938 7.92713C14.1297 7.67516 14.1166 7.27963 13.8646 7.04375C13.6127 6.80784 13.2171 6.82088 12.9813 7.07288L8.75666 11.5855L7.01875 9.72913C6.78288 9.47713 6.38734 9.46409 6.13538 9.7C5.88338 9.93588 5.87034 10.3314 6.10625 10.5834L8.30038 12.9271C8.41856 13.0534 8.58375 13.125 8.75666 13.125C8.92956 13.125 9.09475 13.0534 9.21291 12.9271L13.8938 7.92713Z"
                            fill="url(#paint0_linear_0_98)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_0_98"
                            x1="24.5762"
                            y1="23.1634"
                            x2="7.94531"
                            y2="3.70719"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0.00265844" stop-color="#FF37DF" />
                            <stop offset="1" stop-color="#6E00FF" />
                          </linearGradient>
                          <clipPath id="clip0_0_98">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Effortless Bidding</span>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_0_98)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.18144 1.34328C9.20469 0.385573 10.7953 0.385573 11.8186 1.34328L12.7046 2.17259C12.9544 2.40632 13.2805 2.54141 13.6224 2.55272L14.8353 2.59285C16.2361 2.6392 17.3608 3.76394 17.4072 5.16469L17.4473 6.37766C17.4586 6.7195 17.5937 7.04563 17.8274 7.29538L18.6567 8.18144C19.6144 9.20469 19.6144 10.7953 18.6567 11.8186L17.8274 12.7046C17.5937 12.9544 17.4586 13.2805 17.4473 13.6224L17.4072 14.8353C17.3608 16.2361 16.2361 17.3608 14.8353 17.4072L13.6223 17.4473C13.2805 17.4586 12.9544 17.5937 12.7046 17.8274L11.8186 18.6567C10.7953 19.6144 9.20469 19.6144 8.18144 18.6567L7.29538 17.8274C7.04563 17.5937 6.7195 17.4586 6.37766 17.4473L5.16469 17.4072C3.76394 17.3608 2.6392 16.2361 2.59285 14.8353L2.55272 13.6224C2.54141 13.2805 2.40632 12.9544 2.17259 12.7046L1.34328 11.8186C0.385573 10.7953 0.385573 9.20469 1.34328 8.18144L2.17259 7.29538C2.40632 7.04563 2.54141 6.7195 2.55272 6.37766L2.59285 5.16469C2.6392 3.76394 3.76394 2.6392 5.16469 2.59285L6.37766 2.55272C6.7195 2.54141 7.04563 2.40632 7.29538 2.17259L8.18144 1.34328ZM13.8938 7.92713C14.1297 7.67516 14.1166 7.27963 13.8646 7.04375C13.6127 6.80784 13.2171 6.82088 12.9813 7.07288L8.75666 11.5855L7.01875 9.72913C6.78288 9.47713 6.38734 9.46409 6.13538 9.7C5.88338 9.93588 5.87034 10.3314 6.10625 10.5834L8.30038 12.9271C8.41856 13.0534 8.58375 13.125 8.75666 13.125C8.92956 13.125 9.09475 13.0534 9.21291 12.9271L13.8938 7.92713Z"
                            fill="url(#paint0_linear_0_98)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_0_98"
                            x1="24.5762"
                            y1="23.1634"
                            x2="7.94531"
                            y2="3.70719"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0.00265844" stop-color="#FF37DF" />
                            <stop offset="1" stop-color="#6E00FF" />
                          </linearGradient>
                          <clipPath id="clip0_0_98">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Government Expertise</span>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_0_98)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.18144 1.34328C9.20469 0.385573 10.7953 0.385573 11.8186 1.34328L12.7046 2.17259C12.9544 2.40632 13.2805 2.54141 13.6224 2.55272L14.8353 2.59285C16.2361 2.6392 17.3608 3.76394 17.4072 5.16469L17.4473 6.37766C17.4586 6.7195 17.5937 7.04563 17.8274 7.29538L18.6567 8.18144C19.6144 9.20469 19.6144 10.7953 18.6567 11.8186L17.8274 12.7046C17.5937 12.9544 17.4586 13.2805 17.4473 13.6224L17.4072 14.8353C17.3608 16.2361 16.2361 17.3608 14.8353 17.4072L13.6223 17.4473C13.2805 17.4586 12.9544 17.5937 12.7046 17.8274L11.8186 18.6567C10.7953 19.6144 9.20469 19.6144 8.18144 18.6567L7.29538 17.8274C7.04563 17.5937 6.7195 17.4586 6.37766 17.4473L5.16469 17.4072C3.76394 17.3608 2.6392 16.2361 2.59285 14.8353L2.55272 13.6224C2.54141 13.2805 2.40632 12.9544 2.17259 12.7046L1.34328 11.8186C0.385573 10.7953 0.385573 9.20469 1.34328 8.18144L2.17259 7.29538C2.40632 7.04563 2.54141 6.7195 2.55272 6.37766L2.59285 5.16469C2.6392 3.76394 3.76394 2.6392 5.16469 2.59285L6.37766 2.55272C6.7195 2.54141 7.04563 2.40632 7.29538 2.17259L8.18144 1.34328ZM13.8938 7.92713C14.1297 7.67516 14.1166 7.27963 13.8646 7.04375C13.6127 6.80784 13.2171 6.82088 12.9813 7.07288L8.75666 11.5855L7.01875 9.72913C6.78288 9.47713 6.38734 9.46409 6.13538 9.7C5.88338 9.93588 5.87034 10.3314 6.10625 10.5834L8.30038 12.9271C8.41856 13.0534 8.58375 13.125 8.75666 13.125C8.92956 13.125 9.09475 13.0534 9.21291 12.9271L13.8938 7.92713Z"
                            fill="url(#paint0_linear_0_98)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_0_98"
                            x1="24.5762"
                            y1="23.1634"
                            x2="7.94531"
                            y2="3.70719"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0.00265844" stop-color="#FF37DF" />
                            <stop offset="1" stop-color="#6E00FF" />
                          </linearGradient>
                          <clipPath id="clip0_0_98">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Fair Competition</span>
                    </div>
                  </div>
                  <div className=" bg-black py-4 flex items-start justify-between rounded-xl my-auto">
                    {sections.map((section, index) => (
                      <>
                        <div
                          key={index}
                          className={section.hasBorder ? " w-full " : " w-full"}
                        >
                          <h2 className="lg:px-6 py-2 text-white font-bold xl:text-lg text-[12px] lg:text-sm">
                            {section.title}
                          </h2>
                          <p className="text-white px-8 lg:px-10 font-istok-web xl:text-sm text-[10px] font-normal">
                            {section.description}
                          </p>
                        </div>
                        {section.hasBorder && (
                          <svg
                            className="relative z-50"
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="95"
                            viewBox="0 0 10 95"
                            fill="none"
                          >
                            <line
                              x1="2.5"
                              y1="2.18557e-08"
                              x2="2.5"
                              y2="95"
                              stroke="#F4F4F4"
                            />
                            <path
                              d="M10 48L2.5 54.9282L2.5 41.0718L10 48Z"
                              fill="#F4F4F4"
                              fill-opacity="0.78"
                            />
                          </svg>
                        )}
                      </>
                    ))}
                  </div>
                </div>
                {/* <div className="flex text-gray-100  items-center  text-center justify-center z-50 gap-12  mt-auto  text-base">
                  <Link href={"/terms"}>Terms & Conditions </Link>
                  <Link href={"/privacy-policy"}>Privacy Policy </Link>
                  <Link href={"/cookie"}>Cookie Policy </Link>
                  <Link href={"/refund-policy"}>Refund Policy</Link>
                </div> */}
                {/* <div className="border-b w-full pt-4"></div> */}
                {/* <div className="flex item-center justify-between w-full pt-4 px-4">
                  <div className="flex item-center text-gray-300  mt-auto w-full">
                    <p>© TenderOnline 2024</p>
                  </div>
                  <div className="text-white flex items-center gap-4">
                    <Link href={"/blog"}>Blog</Link>
                    <Link href={"/support"}>Support</Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          {!isLoggedIn && (
            <div className="w-full lg:w-[40%] flex items-start lg:items-center justify-center lg:justify-center">
              {isLogin ? (
                <LoginForm
                  setLoading={setLoading}
                  loading={loading}
                  setIsLogin={setIsLogin}
                />
              ) : (
                <Signup setIsLogin={setIsLogin} />
              )}
            </div>
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}

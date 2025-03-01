"use client";
import ChangePassword from "@/components/shared/passwordChange";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KeyRound, TriangleAlert } from "lucide-react";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const handleChange = () => {
    window.location.href = "/forgot-password";
  };
  return (
    <div>
      <div className="max-w-3xl w-full mx-auto my-5">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-[#222222] px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 justify-center text-white">
              <div>
                <TriangleAlert />
              </div>
              <h3 className="text-lg font-medium">Note</h3>
            </div>
          </div>

          {/* Card content with improved spacing */}
          <div className="px-6 py-5">
            <div className="flex items-center mb-5">
              <div className="bg-gray-300 p-2 rounded-full mr-4">
                <KeyRound size={20} className="text-[#222222]" />
              </div>
              <p className="pt-1 text-[17px] font-medium text-[#222222]">
                If you're a new user, you can first set a new password here.
                otherwise , you can change your password below.
              </p>
            </div>

            <button
              onClick={handleChange}
              className="w-full bg-white border-2 border-[#222222] text-[#222222] hover:text-[#222222] transition-colors duration-300 font-medium rounded-lg py-3 px-4 flex items-center justify-center group"
            >
              <span>Set Password</span>
              <svg
                className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-3xl w-full mx-auto my-5">
        <ChangePassword />
      </div>
    </div>
  );
};

export default Page;

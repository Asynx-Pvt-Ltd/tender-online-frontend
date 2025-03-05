import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-4 bg-white">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between px-4 md:px-10 space-y-6 md:space-y-0">
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Image
                src="/logo.png"
                alt="TenderOnline"
                width={280}
                height={95}
                className="w-48 md:w-72"
              />
            </Link>
            <span className="text-sm md:text-base text-gray-600">
              The People. The Government. The Business
            </span>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-start md:items-end">
              <p className="text-[14px] font-bold uppercase text-[#4A4A4A]">
                Find us Online
              </p>
              <div className="flex gap-4 md:gap-2 mt-1">
                <Link href="https://linkedin.com/in" target="_blank">
                  <Image
                    src="/linkedin1.png"
                    width={26}
                    height={29}
                    alt="Linkedin Handle"
                    className="w-6 h-6"
                  />
                </Link>
                <Link href="https://x.com/in" target="_blank">
                  <Image
                    src="/twitter1.png"
                    width={26}
                    height={29}
                    alt="X Handle"
                    className="w-6 h-6"
                  />
                </Link>
                <Link href="https://facebook.com/in" target="_blank">
                  <Image
                    src="/facebook1.png"
                    width={26}
                    height={29}
                    alt="Facebook Handle"
                    className="w-6 h-6"
                  />
                </Link>
              </div>
            </div>

            <ul className="flex flex-wrap gap-4 items-center text-sm md:text-base">
              <li>
                <Link href="/about-us" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[#202020] mt-4">
          <div className="px-4 md:px-10 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <span className="text-sm md:text-base text-[#D9D9D9]">
                  © 2024{" "}
                  <Link href="/" className="hover:underline">
                    TenderOnline
                  </Link>
                </span>
              </div>

              <div className="w-full md:w-auto">
                <ul className="flex flex-wrap justify-center md:justify-end text-xs md:text-sm text-white items-center gap-4 md:gap-5">
                  <li>
                    <Link href="/terms" className="hover:underline">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookie" className="hover:underline">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund-policy" className="hover:underline">
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

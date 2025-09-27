import React from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";

const Page = () => {
  return (
    <div className="py-22 bg-[#fefaf2] flex items-center justify-center px-4 md:px-6 lg:px-8">
      <div className="max-w-3xl text-center mt-15">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Registrations Are Opening Soon!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-4">
          We’re preparing something exciting for you. Stay tuned and check back soon!
        </p>
        <p className="text-gray-500 mb-8">
          Follow us on our social channels to get the latest updates.
        </p>

        <div className="sm:flex-row flex flex-col justify-center items-center gap-6  w-full">
          <a
            href="https://www.instagram.com/theearthagain_movement?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center gap-2 text-gray-800 hover:text-pink-600 transition-colors"
          >
            <FaInstagram size={24} />
            <span>theearthagain_movement</span>
          </a>

          <a
            href="https://www.facebook.com/earthagainmovement"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center gap-2 text-gray-800 hover:text-blue-700 transition-colors"
          >
            <FaFacebook size={24} />
            <span>earthagainmovement</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;

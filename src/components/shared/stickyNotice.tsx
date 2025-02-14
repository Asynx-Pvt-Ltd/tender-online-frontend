import React from "react";
import { Bell } from "lucide-react";

const StickyNotice = () => {
  return (
    <div className="max-w-lg transform hover:-translate-y-1 transition-transform duration-300">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-8 px-10 rounded-lg shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-12 -mt-9" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full -ml-10 -mb-8" />

        {/* Icon container */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center">
            <Bell className="text-white" size={16} />
          </div>
          <h3 className="text-base font-semibold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notice
          </h3>
        </div>

        {/* Content */}
        <div className="mt-4 relative z-10">
          <p className="text-gray-700 text-md leading-relaxed font-semibold text-center">
            Currently, we are only displaying construction-related tenders. For
            any other tenders, please feel free to contact us, and we'll be
            happy to assist you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickyNotice;

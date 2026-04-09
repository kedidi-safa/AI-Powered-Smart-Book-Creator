import React from "react";

const InputField = ({ icon: Icon, label, name, ...props }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          name={name}
          className={`w-full h-11 px-3 py-2 rounded-md border-gray-300 shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:right-2 focus:ring-yellow-500 focus:border-transparent ${Icon ? "pl-10" : ""}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;

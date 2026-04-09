import React from "react";

const SelectField = ({ icon: Icon, label, name, options, ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <select
          id={name}
          name={name}
          {...props}
          className={`w-full h-11 px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none ${Icon ? "pl-10" : ""}`}
        >
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
          <svg
            className="w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectField;

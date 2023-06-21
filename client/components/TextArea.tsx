import clsx from "clsx";
import React, { ComponentPropsWithoutRef } from "react";

const TextArea: React.FC<ComponentPropsWithoutRef<"textarea">> = ({ className, name, ...props }) => {
  return (
    <div className="relative flex w-full flex-col ">
      <label className="mb-1 text-xs font-semibold text-kashmir-blue-500">{name && name}</label>
      <textarea
        className={clsx(
          `min-h-[15rem] rounded-md bg-white/90 px-3 py-2 text-sm text-kashmir-blue-500 shadow-md outline-none transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500`,
          className
        )}
        name={name}
        {...props}
      />
    </div>
  );
};

export default TextArea;

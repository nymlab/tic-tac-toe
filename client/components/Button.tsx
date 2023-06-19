"use client";
import clsx from "clsx";
import React from "react";
import { motion } from "framer-motion";
import Spinner from "./Spinner";

interface Props<C extends React.ElementType> {
  scale?: "sm" | "lg";
  as?: C;
  variant?: "primary" | "secondary" | "link";
  isLoading?: boolean;
  isActive?: boolean;
}

type ButtonComponent = <C extends React.ElementType = "button">(
  props: Props<C> & Omit<React.ComponentPropsWithoutRef<C>, keyof Props<C>>
) => React.ReactElement | null;

const Button: ButtonComponent = ({ children, className, as: AsComponent, scale = "sm", variant = "primary", isLoading, ...props }) => {
  const Component = AsComponent ? AsComponent : motion.button;
  return (
    <Component
      className={clsx(
        `flex items-center justify-center rounded-lg transition-all duration-150 ease-in hover:brightness-110 disabled:cursor-not-allowed disabled:!opacity-50 disabled:hover:brightness-100`,
        {
          "bg-white font-medium text-kashmir-blue-700 hover:bg-kashmir-blue-500 hover:text-white disabled:hover:bg-white disabled:hover:text-kashmir-blue-700":
            variant.includes("primary"),
          "bg-kashmir-blue-500 font-medium text-white hover:bg-kashmir-blue-600 disabled:hover:bg-kashmir-blue-500 disabled:hover:text-white":
            variant.includes("secondary"),
          "inline-flex !p-0 text-white underline hover:text-kashmir-blue-400": variant.includes("link"),
          "px-4 py-2 text-sm": scale?.includes("sm"),
          "px-8 py-4 text-base": scale?.includes("lg"),
        },
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner className={variant.includes("primary") ? "border-kashmir-blue-500" : "border-white"} /> : children}
    </Component>
  );
};

export default Button;

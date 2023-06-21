import { useState } from "react";
import clsx from "clsx";
import { Rubik, Inter } from "next/font/google";

const rubik = Rubik({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Cronkitty Example",
  description: "Example to show how Cronkitty Pluggin works. ",
  icons: {
    icon: {
      url: "/favicon.svg",
    },
    shortcut: { url: "/favicon.svg", type: "image/svg" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx(rubik.variable, inter.variable, "flex min-h-screen w-full flex-col items-center bg-bg p-4 text-white")}>
      <nav className="flex w-full max-w-screen-lg items-center justify-between rounded-xl bg-white/10 p-4 shadow-md">
        <h5 className="text-kashmir-white text-lg ">Cronkitty Experience</h5>
      </nav>
      <div className="w-full max-w-screen-lg p-4 ">{children}</div>
    </div>
  );
}

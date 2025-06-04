"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Image,
  Send,
  GitCompare,
  Coins,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "NFT", href: "/nft", icon: Image },
  { name: "Send", href: "/send", icon: Send },
  { name: "Bridge", href: "/bridge", icon: GitCompare },
  { name: "Tokens", href: "/tokens", icon: Coins },
  { name: "Buy ENS", href: "/ens", icon: Coins },
];

export default function FloatingDock() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Toggle button */}
      <button
        className="fixed bottom-32 left-6 z-50 bg-yellow-300 border-2 border-black p-3 rounded-full shadow-xl transform hover:scale-110 transition-all duration-300"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Floating Dock */}
      <div
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-6 bg-white border-4 border-black shadow-2xl rounded-3xl px-6 py-4 transition-all duration-700 ease-in-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", // Increase shadow for floating effect
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group relative flex flex-col items-center justify-center transition-all duration-300 ease-out transform hover:scale-110"
          >
            <div className="bg-yellow-200 border-2 border-black p-4 rounded-xl shadow-[3px_3px_0_0_black] transform hover:scale-125 transition-transform duration-300 ease-out">
              <item.icon className="h-6 w-6 text-black" />
            </div>
            <span className="absolute -bottom-6 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

"use client";

import { useState, FC } from "react";
import Link from "next/link";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData, SidebarItem } from "./SidebarData";
import "./Navbar.css";
import Logo from "./Logo";

const Navbar: FC = () => {
  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = () => setSidebar(!sidebar);

  return (
    <IconContext.Provider value={{ color: "#d7f9f1" }}>
      {/* Barre supérieure fixée */}
      <div className="fixed top-0 left-0 w-full z-[800] bg-[#0a0f14] flex items-center justify-between px-6 py-3 shadow-md border-b border-cyan-900">
        {/* Bouton menu gauche */}
        <button
          onClick={toggleSidebar}
          className="text-cyan-400 text-2xl focus:outline-none hover:text-cyan-300 transition-colors"
        >
          <FaIcons.FaBars />
        </button>

        {/* Logo centré */}
        <div className="flex-1 flex justify-center items-center">
          <Logo />
        </div>

        
      </div>

      {/* Menu latéral */}
      <nav
        className={`fixed top-[56px] left-0 h-full w-64 bg-[#0f161c] border-r border-cyan-900 transition-transform duration-300 z-50 ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-3 p-6">
          <li className="flex justify-end">
            <button
              onClick={toggleSidebar}
              className="text-cyan-400 text-2xl hover:text-cyan-300 transition-colors"
            >
              <AiIcons.AiOutlineClose />
            </button>
          </li>
          {SidebarData.map((item: SidebarItem, index: number) => (
            <li key={index}>
              <Link
                href={item.path}
                className="flex items-center gap-3 text-cyan-200 hover:text-cyan-100 font-medium py-2 px-2 rounded-md hover:bg-[#112027] transition-all"
                onClick={toggleSidebar}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </IconContext.Provider>
  );
};

export default Navbar;

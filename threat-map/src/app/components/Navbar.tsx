"use client";

import { useState, FC } from "react";
import Link from "next/link";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData, SidebarItem } from "./SidebarData";
import "./Navbar.css";
import SearchBar from './SearchBar';
const Navbar: FC = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    
    <IconContext.Provider value={{ color: "#fff" }}>
      <div className="navbar">
         
        <Link href="#" className="menu-bars">
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
        
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link href="#" className="menu-bars">
              <AiIcons.AiOutlineClose />
            </Link>
          </li>
          {SidebarData.map((item: SidebarItem, index: number) => (
            <li key={index} className={item.cName}>
              <Link href={item.path} className="flex items-center">
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

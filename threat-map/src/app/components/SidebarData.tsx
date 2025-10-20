import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { JSX } from "react";

export interface SidebarItem {
  title: string;
  path: string;
  icon: JSX.Element;
  cName: string;
}

export const SidebarData: SidebarItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,   
    cName: "nav-text",
  },
  {
    title: "Map",
    path: "/map",
    icon: <FaIcons.FaMapMarkedAlt />, 
    cName: "nav-text",
  },
  {
    title: "Statistics",
    path: "/statistics",
    icon: <IoIcons.IoIosStats />,    
    cName: "nav-text",
  },
  {
    title: "Attacks",
    path: "/attacks",
    icon: <FaIcons.FaBomb />,         
    cName: "nav-text",
  },
  
];

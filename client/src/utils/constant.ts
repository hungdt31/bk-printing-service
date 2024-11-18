import { paths } from "./path"
import { Printer, FolderClock } from "lucide-react"
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { BiSolidUserAccount } from "react-icons/bi";
import { RiFolderHistoryLine } from "react-icons/ri";
import { FaPrint } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { IoBagAdd } from "react-icons/io5";
import { FilePlus } from "lucide-react";

export const SubHeader = [
  {
    name: 'In tài liệu',
    path: paths.Order,
    icon: Printer
  },
  {
    name: 'Lịch sử in',
    path: paths.History,
    icon: FolderClock
  },
  {
    name: 'Mua trang in',
    path: paths.BuyPage,
    icon: FilePlus
  }
]

export const socials = [
  {
    icon: FaLinkedin,
    path: 'https://www.linkedin.com/in/hoang-duc-son-1b1b3b1b4/'
  },
  {
    icon: BsInstagram,
    path: 'https://www.instagram.com/son.hoang.2000/'
  },
  {
    icon: BsTwitterX,
    path: 'https://twitter.com/sonhoang2000'
  },
  {
    icon: FaYoutube,
    path: 'https://www.youtube.com/watch?v=1StQKTAVPfk'
  }
]

export const navbar = [
  {
    name: "Thông tin cá nhân",
    path: paths.Profile,
    icon: BiSolidUserAccount
  },
  {
    name: "Lịch sử in",
    path: paths.History,
    icon: RiFolderHistoryLine
  },
  {
    name: "Đặt in",
    path: paths.Order,
    icon: FaPrint
  },
  {
    name: "Mua trang in",
    path: paths.BuyPage,
    icon: IoBagAdd
  },
  {
    name: "Hỗ trợ",
    path: paths.Support,
    icon: MdContactSupport
  }
]
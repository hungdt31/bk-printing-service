import { paths } from "./path"
import { Printer, PrinterCheck, FolderClock } from "lucide-react"
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";

export const SubHeader = [
  {
    name: 'In tài liệu',
    path: paths.LoginPage,
    icon: Printer
  },
  {
    name: 'Lịch sử in',
    path: paths.Home,
    icon: FolderClock
  },
  {
    name: 'Đặt in',
    path: paths.Home,
    icon: PrinterCheck
  },
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
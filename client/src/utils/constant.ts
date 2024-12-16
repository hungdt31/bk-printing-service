import { paths } from "./path"
import { Printer, FolderClock } from "lucide-react"
import { FaFileExcel, FaFilePowerpoint, FaFileWord, FaLinkedin, FaYoutube } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { BiSolidUserAccount } from "react-icons/bi";
import { RiFolderHistoryLine } from "react-icons/ri";
import { FaPrint } from "react-icons/fa";
import { MdOutlineRequestPage } from "react-icons/md";
import { IoBagAdd } from "react-icons/io5";
import { FilePlus } from "lucide-react";
import { FaFilePdf, FaFileImage } from "react-icons/fa";


export const SubHeader = [
  {
    name: 'In tài liệu',
    path: paths.Document,
    icon: Printer
  },
  {
    name: 'Lịch sử in',
    path: paths.History,
    icon: FolderClock
  },
  {
    name: 'Thanh toán',
    path: paths.Order,
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
    name: "Tài khoản",
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
    path: paths.Document,
    icon: FaPrint
  },
  {
    name: "Thanh toán",
    path: paths.Order,
    icon: IoBagAdd
  },
  {
    name: "Mua trang in",
    path: paths.Purchase,
    icon: MdOutlineRequestPage
  }
]

export const queryKeys = {
  documents: 'documents',
  profile: 'profile',
  printOrderHistory: 'printOrderHistory',
  documentById: 'documentById',
  listPrintOrders: 'listPrintOrders',
  priceForPurchase: 'priceForPurchase',
  config: 'config',
  statistic: 'statistic',
  adminStatistic: 'adminStatistic',
  printers: 'printers',
  purchaseOrders: 'purchaseOrders',
  generateReport: 'generateReport',
  listPrintOrdersByAdmin: 'listPrintOrdersByAdmin',
  myPurchaseOrders: 'myPurchaseOrders'
}

export const formatDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export const formatFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export const iconFiles = [
  {
    type: 'application/pdf',
    icon: FaFilePdf,
    color: 'text-red-500'
  },
  {
    type: 'image/jpeg',
    icon: FaFileImage,
    color: 'text-green-500'
  },
  {
    type: 'image/png',
    icon: FaFileImage,
    color: 'text-green-500'
  },
  {
    type: 'application/msword',
    icon: FaFileWord,
    color: 'text-blue-500'
  },
  {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: FaFileWord,
    color: 'text-blue-500'
  },
  {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: FaFileExcel,
    color: 'text-yellow-500'
  },
  {
    type: 'application/vnd.ms-excel',
    icon: FaFileExcel,
    color: 'text-yellow-500'
  },
  {
    type: 'application/vnd.ms-powerpoint',
    icon: FaFilePowerpoint,
    color: 'text-purple-500'
  }
]

export const localStorageKeys = {
  documentId: 'documentId',
  pageAdded: 'pageAdded'
}

export const paymentMethods = [
  {
    label: 'Chuyển khoản Ngân Hàng/Internet Banking',
    value: 'BANKING',
    logo: `${import.meta.env.VITE_FRONT_END_URL}/logo/vnpay.png`
  },
  {
    label: 'Chuyển khoản qua ZaloPay',
    value: 'ZALOPAY',
    logo: `${import.meta.env.VITE_FRONT_END_URL}/logo/zalopay.webp`
  },
  {
    label: 'Chuyển khoản qua Momo',
    value: 'MOMO',
    logo: `${import.meta.env.VITE_FRONT_END_URL}/logo/momo.png`
  }
]

export const role = {
  ADMIN: 'SPSO',
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER'
}

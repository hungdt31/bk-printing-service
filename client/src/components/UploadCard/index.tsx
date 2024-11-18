import { LuUploadCloud } from "react-icons/lu";
import { Button } from "../ui/button";
import { SiAdguard } from "react-icons/si";
import { Link } from "react-router-dom";
import { paths } from "@/utils/path";
import { IoMdInformationCircle } from "react-icons/io";

export default function UploadCard() {
  return (
    <div className='rounded-lg max-w-lg w-[100%] mx-5 pt-5 pb-5 px-7 bg-white space-y-5 shadow-lg'>
      <h2 className='text-center text-primary'>Tải lên tài liệu</h2>
      <div className='border-dashed border-2 border-gray-500 flex flex-col justify-center items-center p-5 gap-5 rounded-lg'>
        <LuUploadCloud fontSize={50} />
        <div className="flex flex-col items-center">
          <p>Kéo thả tài liệu</p>
          <p>{"<hoặc>"}</p>
          <Button variant={"secondary"}>Chọn tài liệu từ máy</Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SiAdguard fontSize={30} />
        <p className="text-xs">Your files will be securely handled by BKPS servers. <IoMdInformationCircle className="inline text-primary/50" />
          <br />By using this service, you agree to the BKPS <Link to={paths.Home} className="text-primary/50">Terms of Use</Link> and <Link to={paths.Home} className="text-primary/50">Privacy Policy.</Link></p>
      </div>
    </div>
  )
}

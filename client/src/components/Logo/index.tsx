import { Link } from "react-router-dom"
import { paths } from "@/utils/path"

export default function Logo() {
  return (
    <Link to={paths.Home} className="flex items-center gap-3">
      <img src={`${import.meta.env.VITE_FRONT_END_URL}/logo.png`} width={50} height={50} />
      <h2 className="line-clamp-1">SPSS</h2>
    </Link>
  )
}

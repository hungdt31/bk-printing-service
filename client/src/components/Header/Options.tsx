import { paths } from '@/utils/path'
import { Link } from 'react-router-dom'
import {
  useWindowWidth,
} from '@react-hook/window-size'
import { cn } from '@/lib/utils'
import { SubHeader } from '@/utils/constant'

export default function Options() {
  const width = useWindowWidth();
  return (
    <div className={cn("flex items-center justify-around p-2 gap-11",
      width < 768 ? "hidden" : ""
    )}>
      {SubHeader.map((op, index) => (
        <Link
          key={index}
          to={op.path}
          className="flex items-center"
        >
          <h4 className="font-semibold">{op.name}</h4>
        </Link>
      ))}
    </div>
  )
}

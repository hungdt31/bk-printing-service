import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GoDot } from "react-icons/go";
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardWrapperProps {
  children: React.ReactNode
  title?: string
  description?: string
  hrefBack?: string
}

export const DashboardWrapper = ({
  children,
  title,
  description,
  hrefBack
}: DashboardWrapperProps) => {
  return (
    <div className='flex items-center justify-center w-full bg-primary/10 p-3'>
      <Card className="w-full h-full animate-in zoom-in-95 duration-300 fade-in flex flex-col">
        <CardHeader className='border-l-2 border-primary rounded-ss-lg flex items-center justify-between flex-row'>
          <div>
            <CardTitle className="font-bold uppercase text-lg text-primary">{title}</CardTitle>
            {description && <CardDescription className='flex items-center gap-2'><GoDot />{description}</CardDescription>}
          </div>
          {hrefBack && <Link to={hrefBack}><X size={20} /></Link>}
        </CardHeader>
        <CardContent className="grow">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

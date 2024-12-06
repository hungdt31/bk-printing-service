import { cn } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'
import { IconType } from 'react-icons'

interface ProfileStatisticCardProps {
  title: string
  value: number
  percentageChange: number
  className?: string
  icon?: IconType
  iconClassName?: string
  isCurrency?: boolean
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

export const ProfileStatisticCard = ({ 
  title, 
  value, 
  percentageChange, 
  className,
  icon: Icon,
  iconClassName,
  isCurrency = false
}: ProfileStatisticCardProps) => {
  const isIncrease = percentageChange > 0
  const isUnchanged = percentageChange === 0
  const displayValue = isCurrency ? formatCurrency(value) : value.toLocaleString()

  return (
    <div className={cn('rounded-lg bg-white p-4 shadow-md', className)}>
      <div className="flex items-center gap-3 flex-wrap">
        {Icon && (
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100',
            iconClassName
          )}>
            <Icon size={20} />
          </div>
        )}
        <p className="text-md text-gray-500">{title}</p>
      </div>
      
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{displayValue}</span>
        
        <div className={cn(
          'flex items-center gap-0.5 text-sm',
          isIncrease ? 'text-green-600' : 
          isUnchanged ? 'text-gray-500' : 'text-red-600'
        )}>
          {isIncrease ? <ArrowUpIcon size={16} /> : 
           isUnchanged ? <MinusIcon size={16} /> : <ArrowDownIcon size={16} />}
          <span>
            {isUnchanged ? 'No change' : `${Math.abs(percentageChange)}%`} vs Last Month
          </span>
        </div>
      </div>
    </div>
  )
}

import { ScrollArea } from '@radix-ui/react-scroll-area'
import { H2 } from './typography'

interface SidebarProps {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const Sidebar = ({ title, children, footer }: SidebarProps) => {
  return (
    <div className="w-74 h-full border-1 border-t-gray-200 border-r-gray-300 flex flex-col items-start px-6">
      <H2 className="text-start mb-4">{title}</H2>

      <ScrollArea className="flex-1 w-full overflow-x-hidden overflow-y-auto">
        {children}
      </ScrollArea>
      {footer && <>{footer}</>}
    </div>
  )
}

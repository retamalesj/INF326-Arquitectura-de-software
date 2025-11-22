import clsx from 'clsx'

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export const P = ({ children, className, ...props }: ParagraphProps) => {
  return (
    <p className={clsx(className, 'text-base')} {...props}>
      {children}
    </p>
  )
}

import clsx from 'clsx'

interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export const Span = ({ children, className, ...props }: SpanProps) => {
  return (
    <span className={clsx(className, 'text-lg 2xl:text-xl')} {...props}>
      {children}
    </span>
  )
}

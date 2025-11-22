import clsx from 'clsx'

interface H4Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const H4 = ({ children, className, ...props }: H4Props) => {
  return (
    <h4
      className={clsx(
        className,
        'text-base sm:text-lg md:text-xl 2xl:text-2xl',
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

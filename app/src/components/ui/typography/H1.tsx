import clsx from 'clsx'

interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const H1 = ({ children, className, ...props }: H1Props) => {
  return (
    <h1
      className={clsx(
        className,
        'text-3xl sm:text-4xl md:text-6xl 2xl:text-7xl',
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

import clsx from 'clsx'

interface H3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'primary' | 'normal'
  children: React.ReactNode
}

export const H3 = ({
  children,
  variant = 'normal',
  className,
  ...props
}: H3Props) => {
  const textSize =
    variant == 'primary'
      ? 'text-xl sm:text-2xl md:text-4xl 2xl:text-5xl'
      : 'text-lg sm:text-xl md:text-3xl 2xl:text-4xl'

  return (
    <h3 className={clsx(className, textSize)} {...props}>
      {children}
    </h3>
  )
}

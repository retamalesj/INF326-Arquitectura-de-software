import clsx from 'clsx'

interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'primary' | 'normal'
  children: React.ReactNode
}

export const H2 = ({
  children,
  variant = 'normal',
  className,
  ...props
}: H2Props) => {
  const textSize =
    variant == 'primary'
      ? 'text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl'
      : 'text-xl sm:text-2xl md:text-4xl 2xl:text-5xl'

  return (
    <h2 className={clsx(className, textSize)} {...props}>
      {children}
    </h2>
  )
}

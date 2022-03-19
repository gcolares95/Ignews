import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';

interface ActiveLinkProps extends LinkProps { // LinkProps: todas as propriedades que o Link ja recebe href, etc
  children: ReactElement; // para receber o unico elemento dentro, no caso a tag <a>
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath == rest.href
    ? activeClassName
    : '';

    console.log(className, asPath)
  return (
    <Link {...rest}>
      {cloneElement(children, { 
        className
      })}
    </Link>
  )
}
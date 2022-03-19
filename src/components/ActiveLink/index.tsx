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
    <Link {...rest}> { /* Repassando as propriedades que o link ja recebe, exemplo: href*/}
      {cloneElement(children, { // clonando elemento children e adicionando a propriedade className
        className
      })}
    </Link>
  )
}
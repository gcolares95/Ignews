// Componente que irá fazer a autenticação no Github

import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

export function SignInButton() {
  const { data: session } = useSession();

  console.log(session);

  return session ? (
    <button
      className={styles.signInButton}
      type='button'
    >
      <FaGithub color="#04d361" />
      Guilherme Colares
      <FiX
        color="#737380"
        className={styles.closeIcon}
        onClick={() => signOut()}
      />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type='button'
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  )
}
// Componente que vai gerar uma checkout session
import { signIn, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

interface subscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: subscribeButtonProps) {
  const { data: session } = useSession();

  function handleSubscribe() {
    if (!session) {
      signIn('github');
      return; // parando o código por aqui
    }

    // Requisição para a rota subscribe, e com isso criar uma checkout session
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
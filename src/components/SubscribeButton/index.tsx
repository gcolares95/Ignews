// Componente que vai gerar uma checkout session
import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from './styles.module.scss';

interface subscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: subscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return; // parando o código por aqui
    }

    // Requisição para a rota subscribe, e com isso criar uma checkout session
    try {
      const response = await api.post('/subscribe');

      console.log(response.data);
      console.log('oi');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
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
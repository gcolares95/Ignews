import { Match, query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

// função que irá salvar informações no banco de dados
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
) {
  // 1) Buscar o usuário no Faunadb com o ID { customerID }
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  // buscando todos os dados da Subscription e salvando somente os dados mais importantes
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  // 2) Salvar os dados da subscription no Faunadb
  await fauna.query(
    q.Create(
      q.Collection('subscriptions'),
      { data: subscriptionData }
    )
  )
}
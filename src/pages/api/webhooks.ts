import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscripition";

// função que converte a Readable Stream em uma String/Objeto
// função pronta
async function buffer(readble: Readable) {
  const chunks = [];

  for await (const chunk of readble) {
    chunks.push(
      typeof chunk == "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      // construindo evento
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      // switch, pois vamos ouvir mais de 1 evento
      try {
        switch (type) {
          case 'checkout.session.completed':

            const checkoutSession = event.data.object as Stripe.Checkout.Session; // Tipando p/ saber oque tem dentro 

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString()
            )

            break;
          default:
            throw new Error('Unhandled event.')
        }
      } catch (err) {
        // não enviando um erro de fato, pois o stripe vai entender que não deu certo a requisição e tentar" várias vezes a requisição
        // erro de desenvolvimento
        return res.json({ error: 'Web hook handler failed.' })
      }
    }

  
    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed')
  }
}
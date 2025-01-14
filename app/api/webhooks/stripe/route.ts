import prisma from '@/lib/db/index';
import { stripe } from '@/lib/stripe/index';
import { headers } from 'next/headers';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('Stripe-Signature') ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
    console.log(event.type);
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId && session.customer == null) {
    console.error('session customer', session.customer);
    console.error('no metadata for userid');
    return new Response(null, {
      status: 200,
    });
  }

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const updatedData = {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };

    if (session?.metadata?.userId != null) {
      //TODO: Fix the type of subscription
      //@ts-ignore
      await prisma.subscription.upsert({
        where: { userId: session.metadata.userId },
        update: { ...updatedData, userId: session.metadata.userId },
        create: { ...updatedData, userId: session.metadata.userId },
      });
    } else if (
      typeof session.customer === 'string' &&
      session.customer != null
    ) {
      //TODO: Fix the type of subscription
      //@ts-ignore
      await prisma.subscription.update({
        where: { stripeCustomerId: session.customer },
        data: updatedData,
      });
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the price id and set the new period end.
    //TODO: Fix the type of subscription
    //@ts-ignore
    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new Response(null, { status: 200 });
}

'use client';

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useEffect, useMemo, useState } from 'react';
import { createPaymentIntent, finalizeOrder, type CheckoutLine, type ShippingInput } from './actions';

let stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise(pk: string) {
  if (!stripePromise) stripePromise = loadStripe(pk);
  return stripePromise;
}

type Props = {
  publishableKey: string;
  lines: CheckoutLine[];
  total: number;
  getShipping: () => { shipping: ShippingInput; error?: string };
  onDone: (reference: string) => void;
};

const gbp = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p / 100);

/** Loads a PaymentIntent, then renders the Stripe Payment Element + pay button. */
export function StripePayment(props: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    createPaymentIntent(props.lines).then((r) => {
      if (!live) return;
      if (r.ok) setClientSecret(r.clientSecret);
      else setError(r.error);
    });
    return () => { live = false; };
    // create once for this cart
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: {
              theme: 'stripe' as const,
              variables: { colorPrimary: '#fc5257', borderRadius: '10px', fontFamily: 'inherit' },
            },
          }
        : undefined,
    [clientSecret],
  );

  if (error) return <p className="co__error">{error}</p>;
  if (!clientSecret || !options) return <p className="co__loading">Loading secure payment…</p>;

  return (
    <Elements stripe={getStripePromise(props.publishableKey)} options={options}>
      <PayForm {...props} clientSecret={clientSecret} />
    </Elements>
  );
}

function PayForm({ total, getShipping, onDone, lines }: Props & { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    if (!stripe || !elements || busy) return;
    setError(null);

    const { shipping, error: shipErr } = getShipping();
    if (shipErr) { setError(shipErr); return; }

    setBusy(true);
    const submit = await elements.submit();
    if (submit.error) { setBusy(false); setError(submit.error.message ?? 'Please check your card details.'); return; }

    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: { payment_method_data: { billing_details: { name: `${shipping.firstName} ${shipping.lastName}`, email: shipping.email, phone: shipping.phone } } },
    });

    if (confirmErr) { setBusy(false); setError(confirmErr.message ?? 'Payment failed. Please try again.'); return; }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      const res = await finalizeOrder(paymentIntent.id, shipping, lines);
      setBusy(false);
      if (res.ok) onDone(res.reference);
      else setError(res.error);
    } else {
      setBusy(false);
      setError('Payment could not be completed.');
    }
  }

  return (
    <div className="co__pay">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error ? <p className="co__error" style={{ marginTop: 12 }}>{error}</p> : null}
      <button className="co__paybtn" type="button" onClick={pay} disabled={busy || !stripe}>
        {busy ? 'Processing…' : `Pay ${gbp(total)}`}
      </button>
      <div className="co__secure">🔒 Transaction secured · Powered by Stripe</div>
    </div>
  );
}

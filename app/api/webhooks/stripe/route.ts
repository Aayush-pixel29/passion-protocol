import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Use service role for webhooks so we can bypass RLS when updating the payment_status
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const msg = (error as Error).message;
    console.error(`Webhook signature verification failed.`, msg);
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const contractId = session.metadata?.contractId;

    if (contractId) {
      // Update contract to paid
      const { error } = await supabase
        .from("partnership_contracts")
        .update({ payment_status: "paid" })
        .eq("id", contractId);

      if (error) {
        console.error("Error updating contract:", error.message);
        return new NextResponse("Database Error", { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}

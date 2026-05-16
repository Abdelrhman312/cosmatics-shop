"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseClient, hasSupabaseEnv } from "@/lib/supabase";
import { buildWhatsappOrderLink } from "@/lib/whatsapp";
import { CartItem } from "@/types/store";

type PaymentMethod = "cod" | "manual_transfer";

export function CheckoutClient() {
  const { items, totalAmount, clearCart } = useCart();
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderedTotal, setOrderedTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const whatsappLink = useMemo(() => {
    if (!orderId) return null;
    return buildWhatsappOrderLink({
      orderId,
      customerName,
      customerAddress,
      totalAmount: orderedTotal,
      items: orderedItems,
    });
  }, [customerAddress, customerName, orderId, orderedItems, orderedTotal]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (paymentMethod === "manual_transfer" && !proofFile) {
      setError("Please upload transfer screenshot.");
      return;
    }
    if (!customerAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (!hasSupabaseEnv) {
        throw new Error(
          "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
        );
      }
      const supabase = getSupabaseClient();

      let paymentProofUrl: string | null = null;
      if (paymentMethod === "manual_transfer" && proofFile) {
        const extension = proofFile.name.split(".").pop() ?? "jpg";
        const filePath = `proof-${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(filePath, proofFile, { upsert: false });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);
        paymentProofUrl = publicUrl;
      }

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          payment_proof_url: paymentProofUrl,
          status: "pending_review",
        })
        .select("id")
        .single();
      if (orderError || !orderData) {
        throw orderError ?? new Error("Failed to create order.");
      }

      const payload = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }));
      const { error: itemError } = await supabase.from("order_items").insert(payload);
      if (itemError) throw itemError;

      setOrderedItems(items);
      setOrderedTotal(totalAmount);
      setOrderId(orderData.id);
      clearCart();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to submit order.";

      setError(
        message.toLowerCase().includes("row-level security") ||
          message.toLowerCase().includes("rls")
          ? "Supabase rejected the order because RLS policies are missing. Run the updated supabase/schema.sql policies, then try again."
          : message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="py-16 md:py-24"
    >
      <div className="container w-full max-w-5xl">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Complete your order details to place your order.
        </p>

        {orderId ? (
          <div className="mt-8 space-y-4 rounded-xl border border-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Order placed successfully</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-100">Order ID: {orderId}</p>
            {whatsappLink ? (
              <Button asChild className="w-full sm:w-auto">
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  Confirm order via WhatsApp
                </a>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-xl border border-border bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
          >
            <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
              <div className="w-full flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    required
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                  />
                  <Input
                    required
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                  />
                </div>

                <Input
                  required
                  placeholder="Delivery Address"
                  value={customerAddress}
                  onChange={(event) => setCustomerAddress(event.target.value)}
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Method</p>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      className="accent-accent"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    Cash on Delivery
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      className="accent-accent"
                      checked={paymentMethod === "manual_transfer"}
                      onChange={() => setPaymentMethod("manual_transfer")}
                    />
                    Vodafone Cash or InstaPay transfer
                  </label>
                </div>

                {paymentMethod === "manual_transfer" ? (
                  <div className="space-y-3 rounded-lg border border-border bg-muted p-4 text-sm dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                    <p>Vodafone Cash: 201556120214</p>
                    <p>InstaPay: 201556120214</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setProofFile(event.target.files?.[0] ?? null)}
                    />
                  </div>
                ) : null}
              </div>

              <div className="w-full space-y-4 rounded-lg border border-border p-4 text-sm dark:border-zinc-800 dark:text-zinc-100 md:max-w-sm">
                <h2 className="font-semibold">Order Summary</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1 rounded-md bg-muted p-3 dark:bg-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0 break-words">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="shrink-0 font-medium">
                        {(item.price * item.quantity).toFixed(2)} EGP
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 font-semibold dark:border-zinc-800">
                  <span>Total</span>
                  <span>{totalAmount.toFixed(2)} EGP</span>
                </div>
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.section>
  );
}

"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

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
      totalAmount: orderedTotal,
      items: orderedItems,
    });
  }, [customerName, orderId, orderedItems, orderedTotal]);

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

    setError("");
    setIsSubmitting(true);

    try {
      if (!hasSupabaseEnv) throw new Error("Supabase env is missing.");
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
          total_amount: totalAmount,
          payment_method: paymentMethod,
          payment_proof_url: paymentProofUrl,
          status: "pending_review",
        })
        .select("id")
        .single();
      if (orderError || !orderData) throw orderError ?? new Error("Failed to create order.");

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
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to submit order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Complete your order details to place your order.</p>

        {orderId ? (
          <div className="mt-8 space-y-4 rounded-xl border border-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Order placed successfully</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-100">Order ID: {orderId}</p>
            {whatsappLink ? (
              <Button asChild className="w-full sm:w-auto">
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  تاكيد الطلب عبر واتساب
                </a>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-xl border border-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
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
                الدفع عبر فودافون كاش او انستا باي
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

            <div className="space-y-2 rounded-lg border border-border p-4 text-sm dark:border-zinc-800 dark:text-zinc-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-2 font-semibold dark:border-zinc-800">
                <span>Total</span>
                <span>{totalAmount.toFixed(2)} EGP</span>
              </div>
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

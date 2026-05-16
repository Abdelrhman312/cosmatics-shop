import { CartItem } from "@/types/store";

interface BuildWhatsappMessageParams {
  orderId: string;
  customerName: string;
  customerAddress?: string;
  totalAmount: number;
  items: CartItem[];
}

export function buildWhatsappOrderLink({
  orderId,
  customerName,
  customerAddress,
  totalAmount,
  items,
}: BuildWhatsappMessageParams) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER ?? "201556120214";
  const productsText = items
    .map((item) => `- ${item.name} x${item.quantity} (${item.price} EGP)`)
    .join("\n");

  const message = `Order Confirmation
Order ID: ${orderId}
Customer: ${customerName}
Address: ${customerAddress ?? "Not provided"}
Total: ${totalAmount.toFixed(2)} EGP
Products:
${productsText}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

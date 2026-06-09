import type { Booking } from "@/contexts/AppContext";

export function shouldHideBookingPayment(booking: Pick<Booking, "status" | "paymentStatus">) {
  return (booking.status === "Cancelled" && booking.paymentStatus === "Refunded")
    || (booking.status === "Completed" && booking.paymentStatus === "Paid");
}

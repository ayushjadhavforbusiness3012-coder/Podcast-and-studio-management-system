import { jsx, jsxs } from "react/jsx-runtime";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-C98mXwhl.js";
import { useState, useEffect } from "react";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import { toast } from "sonner";
function BookingFormDialog({
  open,
  onOpenChange,
  bookingToEdit
}) {
  const { addBooking, updateBooking } = useAppContext();
  const [guest, setGuest] = useState("");
  const [studio, setStudio] = useState("Studio A");
  const [pkg, setPkg] = useState("Standard Package");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Confirmed");
  useEffect(() => {
    if (open && bookingToEdit) {
      setGuest(bookingToEdit.guest);
      setStudio(bookingToEdit.studio);
      setPkg(bookingToEdit.pkg);
      setDate(bookingToEdit.date);
      setTime(bookingToEdit.time);
      setStatus(bookingToEdit.status);
    } else if (open) {
      setGuest("");
      setStudio("Studio A");
      setPkg("Standard Package");
      setDate("");
      setTime("");
      setStatus("Confirmed");
    }
  }, [open, bookingToEdit]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guest || !date || !time) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const amtMap = {
      "Basic Package": "₹2,500",
      "Standard Package": "₹4,000",
      "Pro Package": "₹6,000",
      "Premium Package": "₹8,500"
    };
    if (bookingToEdit) {
      updateBooking(bookingToEdit.id, {
        guest,
        studio,
        pkg,
        date,
        time,
        status,
        amt: amtMap[pkg] || "₹0"
      });
      toast.success("Booking updated successfully!");
    } else {
      addBooking({
        guest,
        studio,
        pkg,
        date,
        time,
        status,
        amt: amtMap[pkg] || "₹0"
      });
      toast.success("New booking created successfully!");
    }
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: bookingToEdit ? "Edit Booking" : "New Booking" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Guest Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            autoFocus: true,
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            placeholder: "e.g. Rahul Verma",
            value: guest,
            onChange: (e) => setGuest(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Studio" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              value: studio,
              onChange: (e) => setStudio(e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { children: "Studio A" }),
                /* @__PURE__ */ jsx("option", { children: "Studio B" }),
                /* @__PURE__ */ jsx("option", { children: "Studio C" }),
                /* @__PURE__ */ jsx("option", { children: "Main Studio" }),
                /* @__PURE__ */ jsx("option", { children: "Mini Studio" }),
                /* @__PURE__ */ jsx("option", { children: "Premium Studio" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Package" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              value: pkg,
              onChange: (e) => setPkg(e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { children: "Basic Package" }),
                /* @__PURE__ */ jsx("option", { children: "Standard Package" }),
                /* @__PURE__ */ jsx("option", { children: "Pro Package" }),
                /* @__PURE__ */ jsx("option", { children: "Premium Package" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "25 May 2025",
              value: date,
              onChange: (e) => setDate(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Time" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
              placeholder: "10:00 AM - 12:00 PM",
              value: time,
              onChange: (e) => setTime(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Status" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full h-10 px-3 rounded-md border border-border bg-background text-sm",
            value: status,
            onChange: (e) => setStatus(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { children: "Confirmed" }),
              /* @__PURE__ */ jsx("option", { children: "Pending" }),
              /* @__PURE__ */ jsx("option", { children: "Cancelled" }),
              /* @__PURE__ */ jsx("option", { children: "Completed" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "pt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "px-4 py-2 text-sm border border-border rounded-md hover:bg-accent",
            onClick: () => onOpenChange(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90",
            children: bookingToEdit ? "Save Changes" : "Book Studio"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  BookingFormDialog as B
};

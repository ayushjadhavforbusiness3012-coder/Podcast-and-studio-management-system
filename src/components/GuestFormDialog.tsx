import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext, type Guest } from "@/contexts/AppContext";
import { toast } from "sonner";

export function GuestFormDialog({
  open,
  onOpenChange,
  guestToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestToEdit?: Guest;
}) {
  const { addGuest, updateGuest } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<Guest["status"]>("Active");

  useEffect(() => {
    if (open && guestToEdit) {
      setName(guestToEdit.name);
      setEmail(guestToEdit.email);
      setPhone(guestToEdit.phone);
      setTopic(guestToEdit.topic);
      setStatus(guestToEdit.status);
    } else if (open) {
      setName("");
      setEmail("");
      setPhone("");
      setTopic("");
      setStatus("Active");
    }
  }, [open, guestToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required fields.");
      return;
    }

    // Alphanumeric checks to prevent raw numerical values in Name
    if (/^\d+$/.test(name.trim())) {
      toast.error("Guest Name cannot be a raw numerical value.");
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Phone format check (must not contain letters)
    if (phone.trim() && /[a-zA-Z]/.test(phone)) {
      toast.error("Phone number cannot contain alphabetical characters.");
      return;
    }

    if (guestToEdit) {
      updateGuest(guestToEdit.id, {
        name,
        email,
        phone,
        topic,
        status,
      });
      toast.success("Guest updated successfully!");
    } else {
      addGuest({
        name,
        email,
        phone,
        topic,
        status,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        bookings: 0,
        img: Math.floor(Math.random() * 70), // Random avatar
      });
      toast.success("New guest added successfully!");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{guestToEdit ? "Edit Guest" : "Add Guest"}</DialogTitle>
          <DialogDescription className="sr-only">Form to create or edit a guest profile.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="guest-name">Guest Name *</label>
            <input
              id="guest-name"
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. Rahul Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              title="Guest Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="guest-email">Email *</label>
              <input
                id="guest-email"
                type="email"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="Email Address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="guest-phone">Phone</label>
              <input
                id="guest-phone"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                title="Phone Number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="guest-topic">Expertise / Topic</label>
            <input
              id="guest-topic"
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="Technology"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              title="Expertise / Topic"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="guest-status">Status</label>
            <select
              id="guest-status"
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as Guest["status"])}
              title="Select Status"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <DialogFooter className="pt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer"
            >
              {guestToEdit ? "Save Changes" : "Add Guest"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

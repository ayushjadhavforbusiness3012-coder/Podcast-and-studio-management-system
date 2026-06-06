import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
    if (!name || !email) {
      toast.error("Please fill in required fields.");
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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Guest Name *</label>
            <input
              autoFocus
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="e.g. Rahul Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <input
                type="email"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Expertise / Topic</label>
            <input
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              placeholder="Technology"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as Guest["status"])}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <DialogFooter className="pt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              {guestToEdit ? "Save Changes" : "Add Guest"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

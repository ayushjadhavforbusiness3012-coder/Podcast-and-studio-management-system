import { jsxs, jsx } from "react/jsx-runtime";
import { D as DashboardLayout } from "./DashboardLayout-DBeZ8czl.js";
import { Settings, Mic2, CalendarDays, CreditCard, Mail, Plug, Lock, Users, Info, Save, Crown, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import "@tanstack/react-router";
import "./router-Dz_arPe5.js";
import "@tanstack/react-query";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
const tabItems = [{
  icon: Settings,
  label: "General"
}, {
  icon: Mic2,
  label: "Studio Settings"
}, {
  icon: CalendarDays,
  label: "Booking Settings"
}, {
  icon: CreditCard,
  label: "Payment Settings"
}, {
  icon: Mail,
  label: "Email & Notifications"
}, {
  icon: Plug,
  label: "Integrations"
}, {
  icon: Lock,
  label: "Security"
}, {
  icon: Users,
  label: "Team"
}];
function Toggle({
  on,
  onChange
}) {
  return /* @__PURE__ */ jsx("button", { onClick: onChange, className: `w-11 h-6 rounded-full p-0.5 transition-colors ${on ? "bg-primary" : "bg-muted"}`, children: /* @__PURE__ */ jsx("div", { className: `size-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}` }) });
}
function Card({
  title,
  desc,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 mb-4", children: desc }),
    children
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
    /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-1", children })
  ] });
}
function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [dirty, setDirty] = useState(false);
  const [studioName, setStudioName] = useState("Podcast Studio");
  const [tagline, setTagline] = useState("Record. Create. Publish.");
  const [description, setDescription] = useState("A professional podcasting studio for creators, businesses and brands to record high-quality content.");
  const [email, setEmail] = useState("hello@podcaststudio.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [website, setWebsite] = useState("https://podcaststudio.com");
  const [address, setAddress] = useState("123 Creator Street, Andheri West, Mumbai, Maharashtra 400053, India");
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("(IST) Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("31 May 2025");
  const [timeFormat, setTimeFormat] = useState("12 Hour (02:30 PM)");
  const [autoPublish, setAutoPublish] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [liveStreaming, setLiveStreaming] = useState(true);
  const [videoRecording, setVideoRecording] = useState(true);
  const [guestUploads, setGuestUploads] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const handleSave = () => {
    toast.success("Settings saved successfully!");
    setDirty(false);
  };
  const markDirty = () => setDirty(true);
  const renderGeneral = () => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-6", children: [
    /* @__PURE__ */ jsxs(Card, { title: "Studio Profile", desc: "Update your studio information and brand details.", children: [
      /* @__PURE__ */ jsx(Field, { label: "Studio Name", children: /* @__PURE__ */ jsx("input", { value: studioName, onChange: (e) => {
        setStudioName(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Tagline", children: /* @__PURE__ */ jsx("input", { value: tagline, onChange: (e) => {
        setTagline(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Description", children: /* @__PURE__ */ jsx("textarea", { value: description, onChange: (e) => {
        setDescription(e.target.value);
        markDirty();
      }, className: "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm", rows: 3 }) }),
      /* @__PURE__ */ jsx(Field, { label: "Logo", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "size-14 rounded-xl bg-accent grid place-items-center text-primary", children: /* @__PURE__ */ jsx(Mic2, { className: "size-6" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => toast.info("Logo upload coming soon"), className: "h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted", children: "Change Logo" }),
        /* @__PURE__ */ jsx("button", { onClick: () => toast.info("Logo removed"), className: "h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted", children: "Remove" })
      ] }) }),
      /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90", children: "Save Changes" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { title: "Contact Information", desc: "Manage how your studio can be contacted.", children: [
      /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx("input", { value: email, onChange: (e) => {
        setEmail(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsx("input", { value: phone, onChange: (e) => {
        setPhone(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Website", children: /* @__PURE__ */ jsx("input", { value: website, onChange: (e) => {
        setWebsite(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Address", children: /* @__PURE__ */ jsx("textarea", { value: address, onChange: (e) => {
        setAddress(e.target.value);
        markDirty();
      }, rows: 3, className: "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" }) }),
      /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90", children: "Save Changes" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { title: "Localization", desc: "Set your preferred language, timezone and date format.", children: [
      /* @__PURE__ */ jsx(Field, { label: "Language", children: /* @__PURE__ */ jsxs("select", { value: language, onChange: (e) => {
        setLanguage(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: [
        /* @__PURE__ */ jsx("option", { children: "English (US)" }),
        /* @__PURE__ */ jsx("option", { children: "English (UK)" }),
        /* @__PURE__ */ jsx("option", { children: "Hindi" })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Timezone", children: /* @__PURE__ */ jsxs("select", { value: timezone, onChange: (e) => {
        setTimezone(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: [
        /* @__PURE__ */ jsx("option", { children: "(IST) Asia/Kolkata" }),
        /* @__PURE__ */ jsx("option", { children: "(EST) America/New_York" }),
        /* @__PURE__ */ jsx("option", { children: "(PST) America/Los_Angeles" })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Date Format", children: /* @__PURE__ */ jsx("input", { value: dateFormat, onChange: (e) => {
        setDateFormat(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Time Format", children: /* @__PURE__ */ jsxs("select", { value: timeFormat, onChange: (e) => {
        setTimeFormat(e.target.value);
        markDirty();
      }, className: "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm", children: [
        /* @__PURE__ */ jsx("option", { children: "12 Hour (02:30 PM)" }),
        /* @__PURE__ */ jsx("option", { children: "24 Hour (14:30)" })
      ] }) }),
      /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90", children: "Save Changes" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { title: "Subscription", desc: "Manage your subscription and billing.", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-accent rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Crown, { className: "size-4 text-primary" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary", children: "Pro Plan" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-md bg-success/15 text-success-foreground", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: "₹4,999" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "/ month" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Next billing on 15 Jun 2025" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => toast.info("Subscription management coming soon"), className: "mt-3 w-full h-10 rounded-lg border border-border text-sm hover:bg-muted", children: "Manage Subscription" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { title: "Storage Usage", desc: "Track your storage and resource usage.", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold", children: [
          "68 GB ",
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "/ 200 GB" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "34% used" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary", style: {
          width: "34%"
        } }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs mt-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-primary" }),
              "Audio Files"
            ] }),
            /* @__PURE__ */ jsx("span", { children: "42 GB" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-info" }),
              "Video Files"
            ] }),
            /* @__PURE__ */ jsx("span", { children: "18 GB" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-muted-foreground" }),
              "Other Files"
            ] }),
            /* @__PURE__ */ jsx("span", { children: "8 GB" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => toast.info("Storage management coming soon"), className: "mt-3 w-full h-10 rounded-lg border border-border text-sm hover:bg-muted", children: "Manage Storage" })
      ] })
    ] })
  ] });
  const renderDefaultSettings = () => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-6", children: [
    /* @__PURE__ */ jsxs(Card, { title: "Default Settings", desc: "Set default preferences for your studio.", children: [
      [{
        t: "Default Episode Status",
        d: "Set the default status for new episodes",
        control: /* @__PURE__ */ jsxs("select", { className: "h-9 rounded-md border border-border px-2 text-sm bg-card", children: [
          /* @__PURE__ */ jsx("option", { children: "Draft" }),
          /* @__PURE__ */ jsx("option", { children: "Published" }),
          /* @__PURE__ */ jsx("option", { children: "Scheduled" })
        ] })
      }, {
        t: "Auto Publish",
        d: "Automatically publish scheduled episodes",
        control: /* @__PURE__ */ jsx(Toggle, { on: autoPublish, onChange: () => {
          setAutoPublish(!autoPublish);
          markDirty();
          toast.success(`Auto publish ${!autoPublish ? "enabled" : "disabled"}`);
        } })
      }, {
        t: "Require Approval",
        d: "Approve bookings manually",
        control: /* @__PURE__ */ jsx(Toggle, { on: requireApproval, onChange: () => {
          setRequireApproval(!requireApproval);
          markDirty();
          toast.success(`Manual approval ${!requireApproval ? "enabled" : "disabled"}`);
        } })
      }, {
        t: "Booking Buffer Time",
        d: "Gap between two bookings",
        control: /* @__PURE__ */ jsxs("select", { className: "h-9 rounded-md border border-border px-2 text-sm bg-card", children: [
          /* @__PURE__ */ jsx("option", { children: "15 Minutes" }),
          /* @__PURE__ */ jsx("option", { children: "30 Minutes" }),
          /* @__PURE__ */ jsx("option", { children: "1 Hour" })
        ] })
      }].map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5 border-b border-border last:border-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: r.t }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: r.d })
        ] }),
        r.control
      ] }, r.t)),
      /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90", children: "Save Changes" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { title: "Features & Preferences", desc: "Enable or disable studio features.", children: [
      [{
        t: "Enable Live Streaming",
        d: "Allow live streaming sessions",
        on: liveStreaming,
        set: setLiveStreaming
      }, {
        t: "Enable Video Recording",
        d: "Allow video recording in studio",
        on: videoRecording,
        set: setVideoRecording
      }, {
        t: "Allow Guest Uploads",
        d: "Guests can upload files",
        on: guestUploads,
        set: setGuestUploads
      }, {
        t: "Show Public Studio Profile",
        d: "Make studio visible in directory",
        on: publicProfile,
        set: setPublicProfile
      }].map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5 border-b border-border last:border-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: r.t }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: r.d })
        ] }),
        /* @__PURE__ */ jsx(Toggle, { on: r.on, onChange: () => {
          r.set(!r.on);
          markDirty();
          toast.success(`${r.t} ${!r.on ? "enabled" : "disabled"}`);
        } })
      ] }, r.t)),
      /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90", children: "Save Changes" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { title: "Security", desc: "Manage security and access settings.", children: [
      [{
        t: "Two-Factor Authentication",
        d: "Add an extra layer of security",
        control: /* @__PURE__ */ jsx(Toggle, { on: twoFactor, onChange: () => {
          setTwoFactor(!twoFactor);
          markDirty();
          toast.success(`2FA ${!twoFactor ? "enabled" : "disabled"}`);
        } })
      }, {
        t: "Password",
        d: "Update your account password",
        control: /* @__PURE__ */ jsx("button", { onClick: () => toast.info("Password change dialog coming soon"), className: "h-8 px-3 rounded-md border border-border text-xs hover:bg-muted", children: "Change" })
      }, {
        t: "Active Sessions",
        d: "Manage your active login sessions",
        control: /* @__PURE__ */ jsx("button", { onClick: () => toast.info("3 active sessions"), className: "h-8 px-3 rounded-md border border-border text-xs hover:bg-muted", children: "View" })
      }, {
        t: "Login Activity",
        d: "View recent account activity",
        control: /* @__PURE__ */ jsx("button", { onClick: () => toast.info("Last login: Today, 10:30 AM"), className: "h-8 px-3 rounded-md border border-border text-xs hover:bg-muted", children: "View" })
      }].map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5 border-b border-border last:border-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: r.t }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: r.d })
        ] }),
        r.control
      ] }, r.t)),
      /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90", children: "Save Changes" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-destructive", children: "Danger Zone" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 mb-4", children: "Irreversible and sensitive actions." }),
      /* @__PURE__ */ jsxs("button", { onClick: () => toast.success("Data export started. You'll receive a download link via email."), className: "w-full h-10 rounded-lg border border-destructive/40 text-destructive text-sm inline-flex items-center justify-center gap-2 mb-2 hover:bg-destructive/5", children: [
        /* @__PURE__ */ jsx(Download, { className: "size-4" }),
        " Export All Data"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => toast.error("Account deletion requires email confirmation."), className: "w-full h-10 rounded-lg border border-destructive/40 text-destructive text-sm inline-flex items-center justify-center gap-2 hover:bg-destructive/5", children: [
        /* @__PURE__ */ jsx(Trash2, { className: "size-4" }),
        " Delete Studio Account"
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxs(DashboardLayout, { title: "Settings", subtitle: "Manage your studio preferences and configurations", actions: /* @__PURE__ */ jsxs("button", { onClick: handleSave, className: `h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${dirty ? "bg-primary text-primary-foreground" : "bg-primary/60 text-primary-foreground/60"}`, children: [
    /* @__PURE__ */ jsx(Save, { className: "size-4" }),
    " Save Changes"
  ] }), children: [
    /* @__PURE__ */ jsx("div", { className: "bg-card border border-border rounded-2xl p-2 flex flex-wrap gap-1", children: tabItems.map((t) => {
      const Ic = t.icon;
      return /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab(t.label), className: `px-4 py-2.5 rounded-lg text-sm inline-flex items-center gap-2 transition-colors ${activeTab === t.label ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`, children: [
        /* @__PURE__ */ jsx(Ic, { className: "size-4" }),
        " ",
        t.label
      ] }, t.label);
    }) }),
    activeTab === "General" && renderGeneral(),
    activeTab !== "General" && renderDefaultSettings(),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Info, { className: "size-4" }),
        ' Settings are saved when you click "Save Changes".'
      ] }),
      /* @__PURE__ */ jsx("span", { children: "Last updated on 31 May 2025, 11:59 PM by Admin" })
    ] })
  ] });
}
export {
  SettingsPage as component
};

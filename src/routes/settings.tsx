import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings as SettingsIcon, Mic2, CalendarDays, CreditCard, Mail, Plug, Lock, Users as UsersIcon, Crown, Download, Trash2, Info, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Podcast Studio" }] }),
  component: SettingsPage,
});

const tabItems = [
  { icon: SettingsIcon, label: "General" },
  { icon: Mic2, label: "Studio Settings" },
  { icon: CalendarDays, label: "Booking Settings" },
  { icon: CreditCard, label: "Payment Settings" },
  { icon: Mail, label: "Email & Notifications" },
  { icon: Plug, label: "Integrations" },
  { icon: Lock, label: "Security" },
  { icon: UsersIcon, label: "Team" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? "bg-primary" : "bg-muted"}`}>
      <div className={`size-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5 mb-4">{desc}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [dirty, setDirty] = useState(false);

  // Studio profile
  const [studioName, setStudioName] = useState("Podcast Studio");
  const [tagline, setTagline] = useState("Record. Create. Publish.");
  const [description, setDescription] = useState("A professional podcasting studio for creators, businesses and brands to record high-quality content.");

  // Contact
  const [email, setEmail] = useState("hello@podcaststudio.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [website, setWebsite] = useState("https://podcaststudio.com");
  const [address, setAddress] = useState("123 Creator Street, Andheri West, Mumbai, Maharashtra 400053, India");

  // Localization
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("(IST) Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("31 May 2025");
  const [timeFormat, setTimeFormat] = useState("12 Hour (02:30 PM)");

  // Toggles for Default Settings
  const [autoPublish, setAutoPublish] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);

  // Feature toggles
  const [liveStreaming, setLiveStreaming] = useState(true);
  const [videoRecording, setVideoRecording] = useState(true);
  const [guestUploads, setGuestUploads] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  // Security toggles
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    setDirty(false);
  };

  const markDirty = () => setDirty(true);

  const renderGeneral = () => (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <Card title="Studio Profile" desc="Update your studio information and brand details.">
        <Field label="Studio Name">
          <input value={studioName} onChange={(e) => { setStudioName(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" />
        </Field>
        <Field label="Tagline">
          <input value={tagline} onChange={(e) => { setTagline(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" />
        </Field>
        <Field label="Description">
          <textarea value={description} onChange={(e) => { setDescription(e.target.value); markDirty(); }} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" rows={3} />
        </Field>
        <Field label="Logo">
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-xl bg-accent grid place-items-center text-primary"><Mic2 className="size-6" /></div>
            <button onClick={() => toast.info("Logo upload coming soon")} className="h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted">Change Logo</button>
            <button onClick={() => toast.info("Logo removed")} className="h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted">Remove</button>
          </div>
        </Field>
        <button onClick={handleSave} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90">Save Changes</button>
      </Card>

      <Card title="Contact Information" desc="Manage how your studio can be contacted.">
        <Field label="Email"><input value={email} onChange={(e) => { setEmail(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" /></Field>
        <Field label="Phone"><input value={phone} onChange={(e) => { setPhone(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" /></Field>
        <Field label="Website"><input value={website} onChange={(e) => { setWebsite(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" /></Field>
        <Field label="Address"><textarea value={address} onChange={(e) => { setAddress(e.target.value); markDirty(); }} rows={3} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" /></Field>
        <button onClick={handleSave} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90">Save Changes</button>
      </Card>

      <Card title="Localization" desc="Set your preferred language, timezone and date format.">
        <Field label="Language">
          <select value={language} onChange={(e) => { setLanguage(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm">
            <option>English (US)</option><option>English (UK)</option><option>Hindi</option>
          </select>
        </Field>
        <Field label="Timezone">
          <select value={timezone} onChange={(e) => { setTimezone(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm">
            <option>(IST) Asia/Kolkata</option><option>(EST) America/New_York</option><option>(PST) America/Los_Angeles</option>
          </select>
        </Field>
        <Field label="Date Format">
          <input value={dateFormat} onChange={(e) => { setDateFormat(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" />
        </Field>
        <Field label="Time Format">
          <select value={timeFormat} onChange={(e) => { setTimeFormat(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm">
            <option>12 Hour (02:30 PM)</option><option>24 Hour (14:30)</option>
          </select>
        </Field>
        <button onClick={handleSave} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90">Save Changes</button>
      </Card>

      <div className="space-y-6">
        <Card title="Subscription" desc="Manage your subscription and billing.">
          <div className="bg-accent rounded-xl p-4">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Crown className="size-4 text-primary" /><span className="font-semibold text-primary">Pro Plan</span></div><span className="text-xs px-2 py-0.5 rounded-md bg-success/15 text-success-foreground">Active</span></div>
            <div className="mt-2"><span className="text-2xl font-bold">₹4,999</span><span className="text-sm text-muted-foreground">/ month</span></div>
            <div className="text-xs text-muted-foreground">Next billing on 15 Jun 2025</div>
          </div>
          <button onClick={() => toast.info("Subscription management coming soon")} className="mt-3 w-full h-10 rounded-lg border border-border text-sm hover:bg-muted">Manage Subscription</button>
        </Card>

        <Card title="Storage Usage" desc="Track your storage and resource usage.">
          <div className="text-lg font-bold">68 GB <span className="text-sm text-muted-foreground">/ 200 GB</span></div>
          <div className="text-xs text-muted-foreground mb-2">34% used</div>
          <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width:"34%"}} /></div>
          <div className="space-y-1 text-xs mt-3">
            <div className="flex justify-between"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" />Audio Files</span><span>42 GB</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-info" />Video Files</span><span>18 GB</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-muted-foreground" />Other Files</span><span>8 GB</span></div>
          </div>
          <button onClick={() => toast.info("Storage management coming soon")} className="mt-3 w-full h-10 rounded-lg border border-border text-sm hover:bg-muted">Manage Storage</button>
        </Card>
      </div>
    </div>
  );

  const renderDefaultSettings = () => (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <Card title="Default Settings" desc="Set default preferences for your studio.">
        {[
          { t: "Default Episode Status", d: "Set the default status for new episodes", control: <select className="h-9 rounded-md border border-border px-2 text-sm bg-card"><option>Draft</option><option>Published</option><option>Scheduled</option></select> },
          { t: "Auto Publish", d: "Automatically publish scheduled episodes", control: <Toggle on={autoPublish} onChange={() => { setAutoPublish(!autoPublish); markDirty(); toast.success(`Auto publish ${!autoPublish ? "enabled" : "disabled"}`); }} /> },
          { t: "Require Approval", d: "Approve bookings manually", control: <Toggle on={requireApproval} onChange={() => { setRequireApproval(!requireApproval); markDirty(); toast.success(`Manual approval ${!requireApproval ? "enabled" : "disabled"}`); }} /> },
          { t: "Booking Buffer Time", d: "Gap between two bookings", control: <select className="h-9 rounded-md border border-border px-2 text-sm bg-card"><option>15 Minutes</option><option>30 Minutes</option><option>1 Hour</option></select> },
        ].map(r => (
          <div key={r.t} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div><div className="text-sm font-medium">{r.t}</div><div className="text-xs text-muted-foreground">{r.d}</div></div>
            {r.control}
          </div>
        ))}
        <button onClick={handleSave} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90">Save Changes</button>
      </Card>

      <Card title="Features & Preferences" desc="Enable or disable studio features.">
        {[
          { t: "Enable Live Streaming", d: "Allow live streaming sessions", on: liveStreaming, set: setLiveStreaming },
          { t: "Enable Video Recording", d: "Allow video recording in studio", on: videoRecording, set: setVideoRecording },
          { t: "Allow Guest Uploads", d: "Guests can upload files", on: guestUploads, set: setGuestUploads },
          { t: "Show Public Studio Profile", d: "Make studio visible in directory", on: publicProfile, set: setPublicProfile },
        ].map(r => (
          <div key={r.t} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div><div className="text-sm font-medium">{r.t}</div><div className="text-xs text-muted-foreground">{r.d}</div></div>
            <Toggle on={r.on} onChange={() => { r.set(!r.on); markDirty(); toast.success(`${r.t} ${!r.on ? "enabled" : "disabled"}`); }} />
          </div>
        ))}
        <button onClick={handleSave} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90">Save Changes</button>
      </Card>

      <Card title="Security" desc="Manage security and access settings.">
        {[
          { t: "Two-Factor Authentication", d: "Add an extra layer of security", control: <Toggle on={twoFactor} onChange={() => { setTwoFactor(!twoFactor); markDirty(); toast.success(`2FA ${!twoFactor ? "enabled" : "disabled"}`); }} /> },
          { t: "Password", d: "Update your account password", control: <button onClick={() => toast.info("Password change dialog coming soon")} className="h-8 px-3 rounded-md border border-border text-xs hover:bg-muted">Change</button> },
          { t: "Active Sessions", d: "Manage your active login sessions", control: <button onClick={() => toast.info("3 active sessions")} className="h-8 px-3 rounded-md border border-border text-xs hover:bg-muted">View</button> },
          { t: "Login Activity", d: "View recent account activity", control: <button onClick={() => toast.info("Last login: Today, 10:30 AM")} className="h-8 px-3 rounded-md border border-border text-xs hover:bg-muted">View</button> },
        ].map(r => (
          <div key={r.t} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div><div className="text-sm font-medium">{r.t}</div><div className="text-xs text-muted-foreground">{r.d}</div></div>
            {r.control}
          </div>
        ))}
        <button onClick={handleSave} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium mt-4 hover:opacity-90">Save Changes</button>
      </Card>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-destructive">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">Irreversible and sensitive actions.</p>
        <button onClick={() => toast.success("Data export started. You'll receive a download link via email.")} className="w-full h-10 rounded-lg border border-destructive/40 text-destructive text-sm inline-flex items-center justify-center gap-2 mb-2 hover:bg-destructive/5"><Download className="size-4" /> Export All Data</button>
        <button onClick={() => toast.error("Account deletion requires email confirmation.")} className="w-full h-10 rounded-lg border border-destructive/40 text-destructive text-sm inline-flex items-center justify-center gap-2 hover:bg-destructive/5"><Trash2 className="size-4" /> Delete Studio Account</button>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your studio preferences and configurations"
      actions={
        <button onClick={handleSave} className={`h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${dirty ? "bg-primary text-primary-foreground" : "bg-primary/60 text-primary-foreground/60"}`}>
          <Save className="size-4" /> Save Changes
        </button>
      }
    >
      <div className="bg-card border border-border rounded-2xl p-2 flex flex-wrap gap-1">
        {tabItems.map(t => {
          const Ic = t.icon;
          return (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`px-4 py-2.5 rounded-lg text-sm inline-flex items-center gap-2 transition-colors ${activeTab === t.label ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Ic className="size-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "General" && renderGeneral()}
      {activeTab !== "General" && renderDefaultSettings()}

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
        <span className="inline-flex items-center gap-2"><Info className="size-4" /> Settings are saved when you click "Save Changes".</span>
        <span>Last updated on 31 May 2025, 11:59 PM by Admin</span>
      </div>
    </DashboardLayout>
  );
}

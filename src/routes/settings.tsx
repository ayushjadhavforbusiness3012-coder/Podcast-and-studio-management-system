import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings as SettingsIcon, Mic2, CalendarDays, CreditCard, Mail, Lock, Users as UsersIcon, Crown, Download, Info, Save, ShieldCheck, Smartphone, Laptop, Database, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Podcast Studio" }] }),
  component: SettingsPage,
});

import { useAppContext } from "@/contexts/AppContext";

const tabItems = [
  { icon: SettingsIcon, label: "General" },
  { icon: CalendarDays, label: "Booking Settings" },
  { icon: CreditCard, label: "Payment Settings" },
  { icon: Mail, label: "Email & Notifications" },
  { icon: Lock, label: "Security" },
  { icon: UsersIcon, label: "Team" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? "bg-primary" : "bg-muted"}`} aria-label="Toggle preference">
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
  const { settings, updateSettings, users, logout, bookings, guests, episodes, invoices, packages, formatDate, formatTime } = useAppContext();
  const [activeTab, setActiveTab] = useState("General");
  const [dirty, setDirty] = useState(false);

  // General tab states
  const [studioName, setStudioName] = useState(settings.studio.name);
  const [tagline, setTagline] = useState(settings.studio.tagline);
  const [description, setDescription] = useState(settings.studio.description);
  const [email, setEmail] = useState(settings.studio.email);
  const [phone, setPhone] = useState(settings.studio.phone);
  const [website, setWebsite] = useState(settings.studio.website);
  const [address, setAddress] = useState(settings.studio.address);

  const [language, setLanguage] = useState(settings.localization.language);
  const [timezone, setTimezone] = useState(settings.localization.timezone);
  const [dateFormat, setDateFormat] = useState(settings.localization.dateFormat);
  const [timeFormat, setTimeFormat] = useState(settings.localization.timeFormat);

  // Booking tab states
  const [defaultStatus, setDefaultStatus] = useState(settings.booking.defaultStatus);
  const [autoPublish, setAutoPublish] = useState(settings.booking.autoPublish);
  const [requireApproval, setRequireApproval] = useState(settings.booking.requireApproval);
  const [bufferTime, setBufferTime] = useState(settings.booking.bufferTime);
  const [liveStreaming, setLiveStreaming] = useState(settings.booking.liveStreaming);
  const [videoRecording, setVideoRecording] = useState(settings.booking.videoRecording);
  const [guestUploads, setGuestUploads] = useState(settings.booking.guestUploads);
  const [publicProfile, setPublicProfile] = useState(settings.booking.publicProfile);

  // Payment tab states
  const [currency, setCurrency] = useState(settings.payment.currency);
  const [taxRate, setTaxRate] = useState(settings.payment.taxRate);
  const [stripeEnabled, setStripeEnabled] = useState(settings.payment.stripeEnabled);
  const [paypalEnabled, setPaypalEnabled] = useState(settings.payment.paypalEnabled);

  // Email notifications tab states
  const [emailAlerts, setEmailAlerts] = useState(settings.notifications.emailAlerts);
  const [systemAlerts, setSystemAlerts] = useState(settings.notifications.systemAlerts);

  // Security tab states
  const [twoFactor, setTwoFactor] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ old: "", newpwd: "", confirm: "" });
  const [sessions, setSessions] = useState([
    { id: "s1", device: "Windows PC", browser: "Chrome Browser", location: "Mumbai, India", ip: "103.220.198.45", current: true, time: "Current Session" },
    { id: "s2", device: "Apple iPhone 15", browser: "Safari Browser", location: "Pune, India", ip: "103.45.21.90", current: false, time: "Active 2 hours ago" },
    { id: "s3", device: "Mac Studio", browser: "Safari Browser", location: "Mumbai, India", ip: "192.168.1.10", current: false, time: "Active 3 days ago" },
  ]);

  const loginHistory = [
    { time: "08 Jun 2026 10:30 AM", status: "Success", ip: "103.220.198.45", location: "Mumbai, India", device: "Windows Chrome" },
    { time: "08 Jun 2026 08:12 AM", status: "Success", ip: "103.45.21.90", location: "Pune, India", device: "iPhone Safari" },
    { time: "07 Jun 2026 09:45 PM", status: "Failed (Invalid Password)", ip: "203.0.113.88", location: "Beijing, China", device: "Linux Firefox" },
    { time: "02 Jun 2026 11:20 AM", status: "Success", ip: "192.168.1.10", location: "Mumbai, India", device: "Mac Safari" },
  ];

  const handleRevokeSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    if (session.current) {
      toast.info("Logging out from current session...");
      setTimeout(() => {
        logout();
      }, 500);
    } else {
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success(`Revoked login session for ${session.device}`);
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      backupDate: new Date().toISOString(),
      studioName: settings.studio.name,
      database: {
        bookings,
        guests,
        episodes,
        invoices,
        packages,
        users
      }
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `podcast_studio_backup_${dateStamp}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("JSON database backup file generated and downloaded successfully!");
  };

  const handleSave = () => {
    updateSettings({
      studio: {
        name: studioName,
        tagline,
        description,
        email,
        phone,
        website,
        address,
      },
      localization: {
        language,
        timezone,
        dateFormat,
        timeFormat,
      },
      booking: {
        defaultStatus,
        autoPublish,
        requireApproval,
        bufferTime,
        liveStreaming,
        videoRecording,
        guestUploads,
        publicProfile,
      },
      payment: {
        currency,
        taxRate: Number(taxRate),
        stripeEnabled,
        paypalEnabled,
      },
      notifications: {
        emailAlerts,
        systemAlerts,
      }
    });
    toast.success("Settings saved successfully!");
    setDirty(false);
  };

  const markDirty = () => setDirty(true);

  const renderGeneral = () => (
    <div className="space-y-8 mt-4">
      {/* Group 1: Studio Identity & Branding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Studio Identity & Branding</h3>
          <p className="text-xs text-muted-foreground">
            Update your studio branding profile. These values propagate to the dashboard headers, generated receipts, and customer-facing directory lists.
          </p>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Card title="Studio Profile Details" desc="Visual branding and public metadata.">
            <Field label="Studio Name">
              <input value={studioName} onChange={(e) => { setStudioName(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Studio Name" />
            </Field>
            <Field label="Tagline">
              <input value={tagline} onChange={(e) => { setTagline(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Tagline" />
            </Field>
            <Field label="Description">
              <textarea value={description} onChange={(e) => { setDescription(e.target.value); markDirty(); }} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" rows={3} title="Description" />
            </Field>
            <Field label="Logo image">
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl bg-accent grid place-items-center text-primary"><Mic2 className="size-6" /></div>
                <button type="button" onClick={() => toast.info("Logo upload coming soon")} className="h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted transition-colors cursor-pointer bg-card">Change Logo</button>
                <button type="button" onClick={() => toast.info("Logo removed")} className="h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted transition-colors cursor-pointer bg-card">Remove</button>
              </div>
            </Field>
          </Card>
        </div>
      </div>

      {/* Group 2: System Localization & Formats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Localization & System Formats</h3>
          <p className="text-xs text-muted-foreground">
            Configure system language, timezone, and calendar representations. 
            <span className="block mt-1 font-semibold text-primary">Affects: Dashboard timelines, booking lists, invoices, and scheduling tables across the entire application.</span>
          </p>
        </div>
        <div className="lg:col-span-2">
          <Card title="System Locale & Formats" desc="Formatting for date, time, and scheduling offsets.">
            <Field label="Dashboard Language">
              <select value={language} onChange={(e) => { setLanguage(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none cursor-pointer" title="Select Language">
                <option>English (US)</option><option>English (UK)</option><option>Hindi</option>
              </select>
            </Field>
            <Field label="System Timezone">
              <select value={timezone} onChange={(e) => { setTimezone(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none cursor-pointer" title="Select Timezone">
                <option>(IST) Asia/Kolkata</option><option>(EST) America/New_York</option><option>(PST) America/Los_Angeles</option>
              </select>
            </Field>
            <Field label="Global Date Format">
              <select value={dateFormat} onChange={(e) => { setDateFormat(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none cursor-pointer" title="Select Date Format">
                <option value="31 May 2025">31 May 2025 (DD MMM YYYY)</option>
                <option value="YYYY-MM-DD">2025-05-31 (YYYY-MM-DD)</option>
                <option value="MM/DD/YYYY">05/31/2025 (MM/DD/YYYY)</option>
                <option value="DD/MM/YYYY">31/05/2025 (DD/MM/YYYY)</option>
              </select>
              <div className="text-[10px] text-muted-foreground mt-1">Configures standard calendar and listings display format.</div>
            </Field>
            <Field label="Global Time Format">
              <select value={timeFormat} onChange={(e) => { setTimeFormat(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none cursor-pointer" title="Select Time Format">
                <option value="12 Hour (02:30 PM)">12 Hour (02:30 PM)</option>
                <option value="24 Hour (14:30)">24 Hour (14:30)</option>
              </select>
              <div className="text-[10px] text-muted-foreground mt-1">Sets 12-hour AM/PM or 24-hour style for booking hours and timeline indices.</div>
            </Field>
          </Card>
        </div>
      </div>

      {/* Group 3: Contact & Address Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Support Contact & Address</h3>
          <p className="text-xs text-muted-foreground">
            Configure contact details. These are printed onto client invoice receipts and appended to system notification templates.
          </p>
        </div>
        <div className="lg:col-span-2">
          <Card title="Billing Address & Contact details" desc="Used dynamically on generated invoices and system emails.">
            <Field label="Support Email"><input value={email} onChange={(e) => { setEmail(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Email" /></Field>
            <Field label="Public Phone"><input value={phone} onChange={(e) => { setPhone(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Phone" /></Field>
            <Field label="Website Link"><input value={website} onChange={(e) => { setWebsite(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Website" /></Field>
            <Field label="Billing / physical Address"><textarea value={address} onChange={(e) => { setAddress(e.target.value); markDirty(); }} rows={3} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Address" /></Field>
          </Card>
        </div>
      </div>

      {/* Group 4: Subscription & Storage limits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Quota & Studio Resources</h3>
          <p className="text-xs text-muted-foreground">
            Manage your subscription details, features access level, and monthly resource storage allocations.
          </p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Subscription" desc="Manage your subscription tier.">
            <div className="bg-accent rounded-xl p-4">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Crown className="size-4 text-primary" /><span className="font-semibold text-primary">Pro Plan</span></div><span className="text-xs px-2 py-0.5 rounded-md bg-success/15 text-success-foreground font-semibold">Active</span></div>
              <div className="mt-2"><span className="text-2xl font-bold">₹4,999</span><span className="text-sm text-muted-foreground">/ month</span></div>
              <div className="text-xs text-muted-foreground">Next billing on 15 Jun 2025</div>
            </div>
            <button type="button" onClick={() => toast.info("Subscription management coming soon")} className="mt-3 w-full h-10 rounded-lg border border-border text-sm hover:bg-muted transition-colors cursor-pointer bg-card">Manage Subscription</button>
          </Card>

          <Card title="Storage Usage" desc="Track media storage space.">
            <div className="text-lg font-bold">68 GB <span className="text-sm text-muted-foreground">/ 200 GB</span></div>
            <div className="text-xs text-muted-foreground mb-2">34% used</div>
            <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary w-[34%]" /></div>
            <button type="button" onClick={() => toast.info("Storage management coming soon")} className="mt-7 w-full h-10 rounded-lg border border-border text-sm hover:bg-muted transition-colors cursor-pointer bg-card">Manage Storage</button>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderBookingSettings = () => (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <Card title="Booking Process Preferences" desc="Define basic studio scheduling controls.">
        <div className="space-y-4">
          <Field label="Default Episode Status">
            <select value={defaultStatus} onChange={(e) => { setDefaultStatus(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none" title="Default status">
              <option>Draft</option>
              <option>Published</option>
              <option>Scheduled</option>
            </select>
          </Field>
          <Field label="Booking Buffer Duration">
            <select value={bufferTime} onChange={(e) => { setBufferTime(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none" title="Buffer time">
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>1 Hour</option>
            </select>
          </Field>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="text-sm font-medium">Auto Publish</div>
              <div className="text-xs text-muted-foreground">Automatically publish scheduled episodes</div>
            </div>
            <Toggle on={autoPublish} onChange={() => { setAutoPublish(!autoPublish); markDirty(); }} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Require Manual Approval</div>
              <div className="text-xs text-muted-foreground">Approve studio bookings manually</div>
            </div>
            <Toggle on={requireApproval} onChange={() => { setRequireApproval(!requireApproval); markDirty(); }} />
          </div>
        </div>
      </Card>

      <Card title="Studio Features Configuration" desc="Toggle specific recording workspace capabilities.">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="text-sm font-medium">Enable Live Streaming</div>
              <div className="text-xs text-muted-foreground">Allow video live streams from rooms</div>
            </div>
            <Toggle on={liveStreaming} onChange={() => { setLiveStreaming(!liveStreaming); markDirty(); }} />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="text-sm font-medium">Enable Video Recording</div>
              <div className="text-xs text-muted-foreground">Capture multi-cam video streams</div>
            </div>
            <Toggle on={videoRecording} onChange={() => { setVideoRecording(!videoRecording); markDirty(); }} />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="text-sm font-medium">Allow Guest Uploads</div>
              <div className="text-xs text-muted-foreground">Allow remote guests to upload media</div>
            </div>
            <Toggle on={guestUploads} onChange={() => { setGuestUploads(!guestUploads); markDirty(); }} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Show Public Profile</div>
              <div className="text-xs text-muted-foreground">List studio details in directory list</div>
            </div>
            <Toggle on={publicProfile} onChange={() => { setPublicProfile(!publicProfile); markDirty(); }} />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <Card title="Transaction Config" desc="Set currency options and taxation rules.">
        <Field label="Studio Currency">
          <select value={currency} onChange={(e) => { setCurrency(e.target.value); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none" title="Currency">
            <option>₹ (INR)</option>
            <option>$ (USD)</option>
            <option>£ (GBP)</option>
            <option>€ (EUR)</option>
          </select>
        </Field>
        <Field label="Tax Rate Percentage (%)">
          <input type="number" value={taxRate} onChange={(e) => { setTaxRate(Number(e.target.value)); markDirty(); }} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" title="Tax Rate" />
        </Field>
      </Card>

      <Card title="Payment Integrations" desc="Configure your active payment gateway processors.">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2.5 border-b border-border">
            <div>
              <div className="text-sm font-medium">Stripe Gateway</div>
              <div className="text-xs text-muted-foreground">Process cards instantly via Stripe</div>
            </div>
            <Toggle on={stripeEnabled} onChange={() => { setStripeEnabled(!stripeEnabled); markDirty(); }} />
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div>
              <div className="text-sm font-medium">PayPal Checkout</div>
              <div className="text-xs text-muted-foreground">Allow guests to pay with PayPal accounts</div>
            </div>
            <Toggle on={paypalEnabled} onChange={() => { setPaypalEnabled(!paypalEnabled); markDirty(); }} />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderEmailNotifications = () => (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <Card title="Email Delivery Preferences" desc="Choose what events send automated emails.">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="text-sm font-medium">Booking Confirmations</div>
              <div className="text-xs text-muted-foreground">Send receipt email on booking</div>
            </div>
            <Toggle on={emailAlerts} onChange={() => { setEmailAlerts(!emailAlerts); markDirty(); }} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Weekly Performance Digest</div>
              <div className="text-xs text-muted-foreground">Send report summary automatically</div>
            </div>
            <Toggle on={emailAlerts} onChange={() => { setEmailAlerts(!emailAlerts); markDirty(); }} />
          </div>
        </div>
      </Card>

      <Card title="Platform In-App Alerts" desc="Configure live dashboard browser triggers.">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="text-sm font-medium">System Alert Sounds</div>
              <div className="text-xs text-muted-foreground">Play sound on new system logs</div>
            </div>
            <Toggle on={systemAlerts} onChange={() => { setSystemAlerts(!systemAlerts); markDirty(); }} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Real-Time Sidebar Badge</div>
              <div className="text-xs text-muted-foreground">Keep unread notification counters updated</div>
            </div>
            <Toggle on={systemAlerts} onChange={() => { setSystemAlerts(!systemAlerts); markDirty(); }} />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8 mt-4">
      {/* Group 1: Password and 2FA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Account Access & Credentials</h3>
          <p className="text-xs text-muted-foreground">
            Manage passwords, two-factor authentication tokens, and authentication parameters for your studio admin credentials.
          </p>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card title="Update Password" desc="Change administrator credentials regularly to prevent unauthorized dashboard access.">
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Password updated successfully!"); setPasswordForm({ old: "", newpwd: "", confirm: "" }); }} className="space-y-3">
              <Field label="Current Password">
                <input type="password" value={passwordForm.old} onChange={(e) => setPasswordForm(prev => ({ ...prev, old: e.target.value }))} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Current Password" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="New Password">
                  <input type="password" value={passwordForm.newpwd} onChange={(e) => setPasswordForm(prev => ({ ...prev, newpwd: e.target.value }))} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="New Password" />
                </Field>
                <Field label="Confirm New Password">
                  <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))} className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" title="Confirm Password" />
                </Field>
              </div>
              <button type="submit" className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer">Change Password</button>
            </form>
          </Card>

          <Card title="Two-Factor Configuration" desc="Add an extra layer of protection to verification requests.">
            <div className="flex items-center justify-between py-2 bg-muted/20 border border-border rounded-xl px-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 grid place-items-center text-primary shrink-0"><ShieldCheck className="size-5" /></div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Two-Factor Authentication (2FA)</div>
                  <div className="text-xs text-muted-foreground">Request verification token upon sign in</div>
                </div>
              </div>
              <Toggle on={twoFactor} onChange={() => { setTwoFactor(!twoFactor); toast.success(`2FA ${!twoFactor ? "enabled" : "disabled"}`); }} />
            </div>
          </Card>
        </div>
      </div>

      {/* Group 2: Active Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Device Session Management</h3>
          <p className="text-xs text-muted-foreground">
            Review and revoke active sign-in sessions. Revoking a session immediately logs that device out.
          </p>
        </div>
        <div className="lg:col-span-2">
          <Card title="Active Administrator Sessions" desc="Devices currently authenticated and active in this admin panel.">
            <div className="space-y-3">
              {sessions.map(s => {
                const Icon = s.device.includes("iPhone") ? Smartphone : Laptop;
                return (
                  <div key={s.id} className="flex justify-between items-center p-3 border border-border rounded-xl hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-accent grid place-items-center text-primary shrink-0"><Icon className="size-5" /></div>
                      <div>
                        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                          {s.device} 
                          {s.current && <span className="text-[10px] bg-success/20 text-success-foreground px-2 py-0.5 rounded-md font-bold">Current</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{s.browser} • {s.location} (IP: {s.ip})</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground hidden sm:inline">{s.time}</span>
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(s.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${s.current ? "border-border text-muted-foreground hover:bg-muted bg-card animate-pulse-once" : "border-destructive/30 text-destructive hover:bg-destructive/5 bg-card"}`}
                      >
                        {s.current ? "Log Out" : "Revoke"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Group 3: Recent login history logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Recent Security Logs</h3>
          <p className="text-xs text-muted-foreground">
            Review login activity audits to verify recent authentication logs.
          </p>
        </div>
        <div className="lg:col-span-2">
          <Card title="Login Audit Logs" desc="Signin history for the admin profile account.">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-muted-foreground">
                <thead className="text-[10px] uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2">Timestamp</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">IP & Location</th>
                    <th className="py-2">Client Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((h, i) => {
                    const isSuccess = h.status === "Success";
                    const [datePart, timePart] = h.time.split(/(?<=\d{4})\s+/);
                    return (
                      <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/10">
                        <td className="py-2.5 font-medium text-foreground">
                          {formatDate(datePart)} • {formatTime(timePart)}
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${isSuccess ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive flex items-center gap-1 w-fit"}`}>
                            {!isSuccess && <AlertTriangle className="size-3" />}
                            {h.status}
                          </span>
                        </td>
                        <td className="py-2.5">{h.ip} ({h.location})</td>
                        <td className="py-2.5">{h.device}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Group 4: Data Portability System Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Database Portability</h3>
          <p className="text-xs text-muted-foreground">
            Generate and export system configurations, bookings, billing, and episodes lists backups.
          </p>
        </div>
        <div className="lg:col-span-2">
          <Card title="Download System Backup" desc="Export a complete snapshot of the database tables as a JSON backup payload.">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl gap-4">
              <div className="flex gap-3">
                <div className="size-10 rounded-lg bg-primary/10 grid place-items-center text-primary shrink-0"><Database className="size-5" /></div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Full Studio JSON Backup</div>
                  <div className="text-xs text-muted-foreground">Contains packages, bookings, invoices, users, and guest tables.</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-2 hover:opacity-90 cursor-pointer shrink-0 transition-opacity"
              >
                <Download className="size-4" /> Download Backup JSON
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {users.map((u, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
          <img src={`https://i.pravatar.cc/128?img=${u.img}`} alt="" className="size-14 rounded-full object-cover shrink-0 bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm text-foreground truncate">{u.name} {u.you && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md ml-1 font-semibold">You</span>}</div>
            <div className="text-xs text-muted-foreground truncate">{u.email}</div>
            <div className="flex gap-2 mt-2 items-center">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${u.status === "Active" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground border-border"}`}>{u.status}</span>
              <span className="text-[10px] bg-accent/25 text-primary px-2 py-0.5 rounded-md font-bold uppercase">{u.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your studio preferences and configurations"
      actions={
        <button onClick={handleSave} className={`h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-all ${dirty ? "bg-primary text-primary-foreground shadow-sm animate-pulse-once" : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"}`} disabled={!dirty}>
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
              className={`px-4 py-2.5 rounded-lg text-sm inline-flex items-center gap-2 transition-colors cursor-pointer ${activeTab === t.label ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Ic className="size-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "General" && renderGeneral()}
      {activeTab === "Booking Settings" && renderBookingSettings()}
      {activeTab === "Payment Settings" && renderPaymentSettings()}
      {activeTab === "Email & Notifications" && renderEmailNotifications()}
      {activeTab === "Security" && renderSecurity()}
      {activeTab === "Team" && renderTeam()}

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
        <span className="inline-flex items-center gap-2"><Info className="size-4" /> Click "Save Changes" at the top right to persist localization and system configurations.</span>
        <span>Last updated: Today, by Admin</span>
      </div>
    </DashboardLayout>
  );
}

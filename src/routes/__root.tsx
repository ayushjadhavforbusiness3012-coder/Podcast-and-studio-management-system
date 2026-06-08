import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Toaster, toast } from "sonner";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { Mic2, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

function LoginScreen() {
  const { login } = useAppContext();
  const [emailInput, setEmailInput] = useState("admin@podcaststudio.com");
  const [passwordInput, setPasswordInput] = useState("password");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!emailInput || !passwordInput) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      if (emailInput === "admin@podcaststudio.com" && passwordInput === "password") {
        login();
        toast.success("Successfully logged in as Admin!");
      } else {
        setErrorMsg("Invalid email or password. Hint: admin@podcaststudio.com / password");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 size-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="inline-grid place-items-center size-14 rounded-2xl bg-accent text-primary mb-3">
            <Mic2 className="size-8 text-primary" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            PODCAST <span className="text-primary tracking-[0.2em] font-semibold text-sm block">STUDIO</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            Sign in to manage your studio booking and content distribution portal.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg border border-destructive/20 mb-5">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="login-email"
                type="email"
                required
                className="h-10 w-full rounded-lg border border-border bg-background px-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="admin@podcaststudio.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                title="Email Address"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="login-password">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Contact system administrator to reset password."); }} className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="login-password"
                type="password"
                required
                className="h-10 w-full rounded-lg border border-border bg-background px-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                title="Password"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              id="login-remember"
              type="checkbox"
              className="size-4 rounded border-border text-primary focus:ring-primary bg-background"
              title="Remember me"
              defaultChecked
            />
            <label htmlFor="login-remember" className="text-xs text-muted-foreground cursor-pointer font-medium">
              Keep me logged in for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-lg inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md cursor-pointer"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            Hint: Admin login credentials are prefilled.
          </span>
        </div>
      </div>
    </div>
  );
}

function AppLayoutWrapper() {
  const { isLoggedIn } = useAppContext();
  
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return <Outlet />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        {/* Intercept layouts if not authenticated */}
        <AppLayoutWrapper />
        <Toaster position="top-right" />
      </AppProvider>
    </QueryClientProvider>
  );
}

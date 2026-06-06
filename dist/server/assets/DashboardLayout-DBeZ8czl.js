import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useLocation, Link } from "@tanstack/react-router";
import { u as useAppContext } from "./router-Dz_arPe5.js";
import * as React from "react";
import { useState } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Check, Circle, Mic2, X, LayoutDashboard, CalendarDays, Users, Calendar, CreditCard, Package, UserCog, BarChart3, Bell, Settings, HelpCircle, Menu } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bookings", label: "Studio Bookings", icon: CalendarDays },
  { to: "/guests", label: "Guests", icon: Users },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/episodes", label: "Episodes / Shows", icon: Mic2 },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/packages", label: "Packages", icon: Package },
  { to: "/users", label: "Users", icon: UserCog },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
  { to: "/settings", label: "Settings", icon: Settings }
];
function DashboardLayout({
  title,
  subtitle,
  actions,
  children
}) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useAppContext();
  const sidebarContent = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "size-11 rounded-xl bg-sidebar-accent/20 grid place-items-center", children: /* @__PURE__ */ jsx(Mic2, { className: "size-6 text-sidebar-accent", strokeWidth: 2.2 }) }),
      /* @__PURE__ */ jsxs("div", { className: "leading-tight flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold tracking-wide", children: "PODCAST" }),
        /* @__PURE__ */ jsx("div", { className: "text-sidebar-accent text-sm font-semibold tracking-[0.2em]", children: "STUDIO" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "lg:hidden text-sidebar-foreground",
          onClick: () => setMobileOpen(false),
          "aria-label": "Close menu",
          children: /* @__PURE__ */ jsx(X, { className: "size-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 px-3 py-2 space-y-1 overflow-y-auto", children: nav.map((item) => {
      const active = pathname === item.to;
      const Icon = item.icon;
      return /* @__PURE__ */ jsxs(
        Link,
        {
          to: item.to,
          onClick: () => setMobileOpen(false),
          className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-white/5"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "size-[18px]" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.label }),
            item.badge && /* @__PURE__ */ jsx("span", { className: "bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-5 grid place-items-center", children: item.badge })
          ]
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "p-3", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-xl p-3 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "size-9 rounded-full bg-sidebar-accent/20 grid place-items-center", children: /* @__PURE__ */ jsx(HelpCircle, { className: "size-5 text-sidebar-accent" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: "Need Help?" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-sidebar-muted", children: "Contact Support" })
      ] }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 text-sidebar-muted" })
    ] }) })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen", children: sidebarContent }),
    mobileOpen && /* @__PURE__ */ jsxs("div", { className: "lg:hidden fixed inset-0 z-50 flex", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/50",
          onClick: () => setMobileOpen(false)
        }
      ),
      /* @__PURE__ */ jsx("aside", { className: "relative w-72 max-w-[85vw] flex flex-col bg-sidebar text-sidebar-foreground h-full overflow-y-auto", children: sidebarContent })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col", children: [
      /* @__PURE__ */ jsxs("header", { className: "bg-background border-b border-border px-4 lg:px-8 py-5 flex items-center gap-3 lg:gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "lg:hidden size-10 rounded-lg border border-border bg-card grid place-items-center hover:bg-muted",
            onClick: () => setMobileOpen(true),
            "aria-label": "Open menu",
            children: /* @__PURE__ */ jsx(Menu, { className: "size-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl lg:text-2xl font-bold text-foreground truncate", children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-0.5 truncate", children: subtitle })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          actions,
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "relative size-10 rounded-lg border border-border bg-card grid place-items-center hover:bg-muted", children: [
              /* @__PURE__ */ jsx(Bell, { className: "size-4" }),
              /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-4 grid place-items-center", children: "5" })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-64", children: [
              /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Notifications" }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsx(DropdownMenuItem, { children: "New booking from Rahul Verma" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { children: "Payment received: ₹6,000" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { children: "Studio A maintenance scheduled" }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsx(DropdownMenuItem, { className: "text-center text-primary justify-center", children: "View all notifications" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 pl-3 border-l border-border", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-3 hover:opacity-80 transition-opacity text-left", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "https://i.pravatar.cc/64?img=12",
                  alt: "",
                  className: "size-10 rounded-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "hidden sm:block leading-tight", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: "Admin" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Super Admin" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
              /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "My Account" }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { children: [
                /* @__PURE__ */ jsx(UserCog, { className: "mr-2 size-4" }),
                " Profile Settings"
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { children: [
                /* @__PURE__ */ jsx(Settings, { className: "mr-2 size-4" }),
                " Studio Settings"
              ] }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:bg-destructive/10 focus:text-destructive", children: [
                /* @__PURE__ */ jsx(X, { className: "mr-2 size-4" }),
                " Log out"
              ] })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 lg:p-8 space-y-6", children })
    ] })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendType = "up",
  tone = "primary"
}) {
  const tones = {
    primary: "bg-accent text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    info: "bg-info/15 text-info",
    pink: "bg-pink/20 text-pink-foreground",
    destructive: "bg-destructive/10 text-destructive"
  };
  const trendColor = trendType === "up" ? "text-success" : trendType === "down" ? "text-destructive" : "text-muted-foreground";
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 flex items-start gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: `size-12 rounded-xl grid place-items-center ${tones[tone]}`, children: /* @__PURE__ */ jsx(Icon, { className: "size-6" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold mt-0.5", children: value }),
      trend && /* @__PURE__ */ jsx("div", { className: `text-xs mt-1 ${trendColor}`, children: trend })
    ] })
  ] });
}
function Badge({
  children,
  variant = "default"
}) {
  const v = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/15 text-success-foreground border border-success/30",
    warning: "bg-warning/20 text-warning-foreground border border-warning/40",
    destructive: "bg-destructive/10 text-destructive border border-destructive/30",
    info: "bg-info/15 text-info-foreground border border-info/30",
    primary: "bg-accent text-primary border border-primary/20",
    pink: "bg-pink/20 text-pink-foreground border border-pink/30"
  };
  return /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${v[variant]}`, children });
}
export {
  Badge as B,
  DashboardLayout as D,
  StatCard as S,
  DropdownMenu as a,
  DropdownMenuTrigger as b,
  DropdownMenuContent as c,
  DropdownMenuItem as d,
  cn as e
};

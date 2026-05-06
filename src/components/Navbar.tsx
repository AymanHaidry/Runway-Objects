import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, Menu, User, LogOut, Settings, Package, Shield, Star } from "lucide-react";
import logoLight from "/favicon.svg";

const TIER_COLORS: Record<string, string> = {
  standard: "bg-gray-100 text-gray-700",
  silver: "bg-gray-200 text-gray-800",
  gold: "bg-amber-100 text-amber-800",
  platinum: "bg-purple-100 text-purple-800",
};

export function Navbar() {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const { count } = useCart();
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Store" },
    { href: "/registry", label: "ROR Registry" },
    { href: "/membership", label: "Membership" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF4F7]/80 backdrop-blur-xl border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
  <img src={logoLight} alt="Runway Objects" className="h-9 w-9 object-contain" />
  <span className="logo-font text-2xl leading-none">Runway Objects</span>
</Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-black/70 hover:text-black transition-colors tracking-wide"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-black text-white text-xs rounded-full">
                {count}
              </Badge>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-black text-white text-xs">
                      {profile?.full_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold truncate">{profile?.full_name ?? "Collector"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  {profile?.tier && (
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TIER_COLORS[profile.tier]}`}>
                      {profile.tier}
                    </span>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/account")} data-testid="menu-account">
                  <User className="mr-2 h-4 w-4" /> Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")} data-testid="menu-orders">
                  <Package className="mr-2 h-4 w-4" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/achievements")} data-testid="menu-achievements">
                  <Star className="mr-2 h-4 w-4" /> Achievements
                </DropdownMenuItem>
                {profile?.is_admin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")} data-testid="menu-admin">
                      <Shield className="mr-2 h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} data-testid="menu-signout">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={signInWithGoogle}
              className="bg-black text-white hover:bg-black/80 text-sm h-9 px-4 rounded-full"
              data-testid="button-signin"
            >
              Sign In
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FDF4F7]">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-black/80 hover:text-black transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

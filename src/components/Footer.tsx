import { Link } from "wouter";
import logoLight from "/logo-light.png";

export function Footer() {
  return (
    <footer className="border-t border-black/8 bg-[#FDF4F7] mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <img src={logoLight} alt="Runway Objects" className="h-12 w-auto mb-3" />
          <p className="text-sm text-black/50 max-w-xs leading-relaxed">
            It doesn't fly. It aspires. Beautifully.
            <br />
            Precision aviation collectibles for those who dream in altitude.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-4">Navigate</p>
          <div className="flex flex-col gap-2">
            {[["Home", "/"], ["Store", "/store"], ["Membership", "/membership"], ["ROR Registry", "/registry"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm text-black/60 hover:text-black transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-4">Legal</p>
          <div className="flex flex-col gap-2">
            {["Privacy Policy", "Terms of Service", "Return Policy"].map((l) => (
              <span key={l} className="text-sm text-black/60 cursor-pointer hover:text-black transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-black/8 py-4 px-4 text-center text-xs text-black/30">
        © {new Date().getFullYear()} Runway Objects. All rights reserved.
      </div>
    </footer>
  );
}

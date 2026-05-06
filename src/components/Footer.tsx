import { Link } from "wouter";
import logoLight from "/logo-light.png";

export function Footer() {
  return (
    <footer className="border-t border-black/8 bg-[#FDF4F7] mt-24">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="md:col-span-2">
          <img src={logoLight} alt="Runway Objects" className="h-12 w-auto mb-3" />
          <p className="text-sm text-black/50 max-w-xs leading-relaxed">
            It doesn't fly. It aspires. Beautifully.
            <br />
            Precision aviation collectibles for those who dream in altitude.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-4">
            Navigate
          </p>
          <div className="flex flex-col gap-2">
            {[
              ["Home", "/"],
              ["Store", "/store"],
              ["Membership", "/membership"],
              ["ROR Registry", "/registry"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-4">
            Legal
          </p>
          <div className="flex flex-col gap-2">
            {[
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms of Service", href: "/terms-of-service" },
              { name: "Return Policy", href: "/terms-of-service" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/8 py-4 text-center text-xs text-black/30">
        © {new Date().getFullYear()} Runway Objects. All rights reserved.
      </div>

    </footer>
  );
}

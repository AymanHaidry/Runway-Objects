import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/supabase";
import {
  ArrowRight,
  ChevronDown,
  Plane,
  Shield,
  Award,
  QrCode,
} from "lucide-react";

/** Scroll reveal hook */
function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/** Reveal wrapper */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .limit(4)
      .then(({ data }) => {
        if (data) setFeatured(data as Product[]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDF4F7] via-[#FDF4F7]/80 to-[#FDF4F7] pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="mb-10" style={{ animation: "fadeIn 1s ease-out" }}>
          <div
            className="text-5xl md:text-7xl text-black mb-4"
            style={{
              fontFamily: "Balgin",
              fontWeight: 400,
              letterSpacing: "-0.06em",
              fontStyle: "italic",
            }}
          >
            Runway Objects
          </div>
        </div>

        <h1
          style={{
            fontFamily: "Balgin",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            animation: "slideUp 0.8s ease-out 0.2s both",
          }}
          className="text-5xl md:text-7xl text-black mb-4 leading-none text-center"
        >
          It Doesn't Fly.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
            It Aspires. Beautifully.
          </span>
        </h1>

        <p
          className="text-lg md:text-xl text-black/50 max-w-xl mb-10 leading-relaxed text-center"
          style={{ animation: "slideUp 0.8s ease-out 0.4s both" }}
        >
          Precision aviation collectibles. Each piece carries a story, a soul,
          and a serial number. Built for those who dream in altitude.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 items-center"
          style={{ animation: "slideUp 0.8s ease-out 0.6s both" }}
        >
          <Link href="/store">
            <Button className="bg-black text-white hover:bg-black/80 rounded-full px-8 py-6 text-base font-semibold group">
              Explore Collection
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/registry">
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-base border-black/20 hover:border-black/50"
            >
              <QrCode className="mr-2 h-4 w-4" />
              Runway Registry
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-5 w-5 text-black/30" />
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Plane,
                title: "Aircraft Heritage",
                desc: "Every model traces its lineage to a real aircraft with documented history and edition lore.",
              },
              {
                icon: QrCode,
                title: "Runway Passport QR",
                desc: "Each piece comes with a public QR linking to its story, inspiration, and collectible identity.",
              },
              {
                icon: Shield,
                title: "ROR Registry",
                desc: "Tracks ownership, servicing, warranty, and batch provenance securely.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-black/6 hover:border-black/15 transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-black mb-2">
                  {title}
                </h3>
                <p className="text-sm text-black/50 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <RevealSection>
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-black/30">
                  Curated Selection
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-black">
                  Featured Aircraft
                </h2>
              </div>

              <Link href="/store">
                <Button variant="ghost" className="gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </RevealSection>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4">
        <RevealSection>
          <div className="max-w-3xl mx-auto text-center bg-black rounded-3xl p-12 md:p-16">
            <Award className="h-10 w-10 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Join the Collective
            </h2>
            <p className="text-white/50 mb-8">
              Unlock exclusive drops, member pricing, and Runway Passport
              experience.
            </p>

            <Link href="/membership">
              <Button className="bg-amber-400 text-black hover:bg-amber-300 rounded-full px-8 py-6 font-bold">
                View Membership Plans
              </Button>
            </Link>
          </div>
        </RevealSection>
      </section>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

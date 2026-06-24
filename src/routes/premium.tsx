import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Footer } from "../components/marvelo/Footer";
import { Check, Shield, Sparkles, Server, Diamond, AlertCircle, Loader2, ArrowRight } from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5000";

declare global {
  interface Window {
    paypal?: any;
  }
}

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium Plans & Cosmic Shop — MARVELO" },
      {
        name: "description",
        content:
          "Upgrade your Marvelo CCG experience. Join User Premium, level up your Discord server, or buy Gems for booster packs and customized arenas.",
      },
    ],
  }),
  component: PremiumPage,
});

interface PriceItem {
  id: string;
  name: string;
  price: string;
  type: "user_premium" | "server_premium" | "gems";
  description: string;
  image?: string;
  features: string[];
  recommended?: boolean;
}

function PremiumPage() {
  const [activeTab, setActiveTab] = useState<"user" | "server" | "gems">("user");
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null);
  
  // Checkout Modal State
  const [targetId, setTargetId] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedTarget, setVerifiedTarget] = useState<{ name: string } | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [showPaypalButtons, setShowPaypalButtons] = useState(false);
  
  // PayPal SDK Loading State
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [plansConfig, setPlansConfig] = useState<Record<string, string>>({});
  
  // Payment Capture State
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const paypalRef = useRef<HTMLDivElement>(null);

  // User Premium Tiers
  const userTiers: PriceItem[] = [
    {
      id: "user-tier-1",
      name: "S.H.I.E.L.D. Recruit",
      price: "$2.99",
      type: "user_premium",
      image: "/basic-tier.png",
      description: "Casual collector bundle offering daily credit boosts and reduced drop cooldowns.",
      features: [
        "⏱️ 45m Drop Cooldown (down from 60m)",
        "⚡ 1.2x Credits on daily claims",
        "✨ +10 Cosmic Dust bonus daily",
        "🪙 8% Marketplace Tax (down from 10%)",
        "📂 10 Wishlist Slots (up from 5)",
        "🔑 Unlimited Rent-In & 5 Rent-Out slots"
      ]
    },
    {
      id: "user-tier-2",
      name: "Avenger",
      price: "$5.99",
      type: "user_premium",
      image: "/elite-tier.png",
      description: "Designed for active collectors, maximizing trades, rent limits and market revenue.",
      recommended: true,
      features: [
        "⏱️ 30m Drop Cooldown",
        "⚡ 1.5x Credits on daily claims",
        "✨ +25 Cosmic Dust bonus daily",
        "🪙 5% Marketplace Tax (down from 10%)",
        "📂 20 Wishlist Slots (up from 5)",
        "🔑 Unlimited Rent-In & 10 Rent-Out slots"
      ]
    },
    {
      id: "user-tier-3",
      name: "Cosmic Champion",
      price: "$9.99",
      type: "user_premium",
      image: "/cosmic-champion.png",
      description: "Ultimate entity level. Fast drop frequencies, tax immunity, and ultimate collection score perks.",
      features: [
        "⏱️ 20m Drop Cooldown",
        "⚡ 2.0x Credits on daily claims",
        "✨ +50 Cosmic Dust bonus daily",
        "🪙 0% Marketplace Tax (100% tax-free!)",
        "📂 40 Wishlist Slots (up from 5)",
        "🔑 Unlimited Rent-In & 15 Rent-Out slots"
      ]
    }
  ];

  // Server Premium Tiers
  const serverTiers: PriceItem[] = [
    {
      id: "server-tier-1",
      name: "Asgardian Outpost",
      price: "$4.99",
      type: "server_premium",
      description: "Boost your community card activity. Quicker drop rate timers and server happy hours.",
      features: [
        "⏱️ 45m Spawner Intervals (down from 60m)",
        "📢 Up to 5 Auto-Spawn channels (up from 2)",
        "⚙️ 5 Spawner Config Changes per day",
        "🎉 1 Server Happy Hour per week (lasts 2 hours)"
      ]
    },
    {
      id: "server-tier-2",
      name: "Wakandan Hub",
      price: "$9.99",
      type: "server_premium",
      recommended: true,
      description: "Excellent for medium to large size Discord servers that want highly active cards drops.",
      features: [
        "⏱️ 30m Spawner Intervals (down from 60m)",
        "📢 Up to 20 Auto-Spawn channels (up from 2)",
        "⚙️ 5 Spawner Config Changes per day",
        "🎉 2 Server Happy Hours per week (lasts 2 hours each)"
      ]
    },
    {
      id: "server-tier-3",
      name: "Nova Corps HQ",
      price: "$14.99",
      type: "server_premium",
      description: "High-octane server settings. Rapid 20-minute spawn rates for large gaming hubs.",
      features: [
        "⏱️ 20m Spawner Intervals (down from 60m)",
        "📢 Up to 20 Auto-Spawn channels (up from 2)",
        "⚙️ 5 Spawner Config Changes per day",
        "🎉 2 Server Happy Hours per week (lasts 2 hours each)"
      ]
    }
  ];

  // Gems packages
  const gemsPacks: PriceItem[] = [
    {
      id: "gems-100",
      name: "Handful of Gems",
      price: "$0.99",
      type: "gems",
      image: "/mvd.png",
      description: "100 Premium Gems",
      features: ["💎 100 Cosmic Gems", "🛡️ Instantly credited", "📦 Buy collectible booster packs"]
    },
    {
      id: "gems-550",
      name: "Pouch of Gems",
      price: "$4.99",
      type: "gems",
      image: "/mvd.png",
      description: "550 Premium Gems (+10% Bonus)",
      features: ["💎 550 Cosmic Gems", "🎁 50 Free bonus gems included", "🖼️ Unlock profile showcase themes"]
    },
    {
      id: "gems-1200",
      name: "Chest of Gems",
      price: "$9.99",
      type: "gems",
      image: "/mvd.png",
      description: "1,200 Premium Gems (+20% Bonus)",
      recommended: true,
      features: ["💎 1,200 Cosmic Gems", "🎁 200 Free bonus gems included", "⚔️ Obtain PvP duel arena backgrounds"]
    },
    {
      id: "gems-3000",
      name: "Vast Vault of Gems",
      price: "$24.99",
      type: "gems",
      image: "/mvd.png",
      description: "3,000 Premium Gems (+25% Bonus)",
      features: ["💎 3,000 Cosmic Gems", "🎁 600 Free bonus gems included", "🌟 Elite rank pack collector status"]
    }
  ];

  // 1. Fetch PayPal client ID on mount
  useEffect(() => {
    console.log("[paypal] Fetching configuration from:", `${API_BASE}/api/payments/config`);
    fetch(`${API_BASE}/api/payments/config`)
      .then((res) => {
        console.log("[paypal] Config response status:", res.status);
        return res.json();
      })
      .then((resData) => {
        if (resData.success && resData.data.clientId) {
          const cleanId = resData.data.clientId.trim();
          console.log("[paypal] Successfully fetched Client ID:", cleanId);
          setClientId(cleanId);
          if (resData.data.plans) {
            console.log("[paypal] Successfully fetched Plan IDs:", resData.data.plans);
            setPlansConfig(resData.data.plans);
          }
        } else {
          console.error("[paypal] Config did not return a valid client ID:", resData);
        }
      })
      .catch((err) => {
        console.error("[paypal] Failed to fetch configuration:", err);
      });
  }, []);

  // 2. Inject/Reload PayPal SDK script dynamically
  useEffect(() => {
    if (!clientId) {
      console.log("[paypal] Client ID not loaded yet. Skipping script injection.");
      return;
    }

    const cleanId = clientId.trim();
    const activePlanId = selectedItem ? plansConfig[selectedItem.id] : null;
    const isSubscription = (selectedItem?.type === "user_premium" || selectedItem?.type === "server_premium") && activePlanId;

    const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${cleanId}&currency=USD${
      isSubscription ? "&vault=true&intent=subscription" : ""
    }`;

    console.log(`[paypal] Script load initialized. Type: "${selectedItem?.type || "none"}", Plan ID: "${activePlanId || "none"}", Sub Mode: ${!!isSubscription}. URL: ${scriptUrl}`);
    setPaypalLoaded(false);

    const existing = document.getElementById("paypal-sdk-script");
    if (existing) {
      console.log("[paypal] Removing existing script to re-inject with updated parameters.");
      existing.remove();
      if (window.paypal) {
        delete window.paypal;
      }
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk-script";
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      console.log("[paypal] Script loaded successfully. window.paypal initialized:", !!window.paypal);
      setPaypalLoaded(true);
    };
    script.onerror = (e) => {
      console.error("[paypal] Script failed to load:", e);
      setPaymentError("Failed to load PayPal SDK script. Verify Client ID configuration.");
    };
    document.body.appendChild(script);

    return () => {
      const sc = document.getElementById("paypal-sdk-script");
      if (sc) {
        console.log("[paypal] Cleanup: removing script element.");
        sc.remove();
      }
    };
  }, [clientId, selectedItem?.id, plansConfig]);

  // 3. Render PayPal smart buttons when requirements are met
  useEffect(() => {
    if (paypalLoaded && verifiedTarget && showPaypalButtons && agreedTerms && paypalRef.current && selectedItem) {
      console.log(`[paypal-buttons] Preparing to render buttons for item: ${selectedItem.id}`);
      paypalRef.current.innerHTML = "";

      const activePlanId = plansConfig[selectedItem.id];
      const isSubscription = (selectedItem.type === "user_premium" || selectedItem.type === "server_premium") && activePlanId;
      const cleanBuyerId = selectedItem.type === "server_premium" ? buyerId : targetId;

      const buttonOptions: any = {
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: isSubscription ? "subscribe" : "paypal",
        },
        onError: (err: any) => {
          console.error("[paypal-buttons] Error handler callback executed:", err);
          setPaymentError("Checkout transaction failed. Please retry.");
          setPaymentStatus("error");
        }
      };

      if (isSubscription) {
        console.log(`[paypal-buttons] Creating subscription flow with Plan ID: ${activePlanId}`);
        buttonOptions.createSubscription = (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: activePlanId,
            custom_id: `${selectedItem.type}:${selectedItem.id}:${targetId}:${cleanBuyerId}`,
          });
        };
        buttonOptions.onApprove = async (data: any) => {
          console.log("[paypal-buttons] Subscription approved. ID:", data.subscriptionID);
          setPaymentStatus("processing");
          try {
            const res = await fetch(`${API_BASE}/api/payments/capture-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptionId: data.subscriptionID,
                itemId: selectedItem.id,
                targetId: targetId,
                buyerId: cleanBuyerId,
              }),
            });
            const captureData = await res.json();
            if (captureData.success) {
              console.log("[paypal-buttons] Subscription successfully synced to DB.");
              setPaymentStatus("success");
            } else {
              console.error("[paypal-buttons] Subscription sync error:", captureData.error);
              setPaymentError(captureData.error || "Failed to sync subscription details to DB.");
              setPaymentStatus("error");
            }
          } catch (err: any) {
            console.error("[paypal-buttons] Error capturing subscription approval:", err);
            setPaymentError(err.message || "Failed to sync subscription.");
            setPaymentStatus("error");
          }
        };
      } else {
        console.log("[paypal-buttons] Creating standard checkout order flow");
        buttonOptions.createOrder = async () => {
          try {
            console.log("[paypal-buttons] Triggering order creation endpoint");
            const res = await fetch(`${API_BASE}/api/payments/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                itemId: selectedItem.id,
                targetId: targetId,
                buyerId: cleanBuyerId,
              }),
            });
            const data = await res.json();
            if (!data.success) {
              alert(data.error || "Failed to create order.");
              throw new Error(data.error);
            }
            console.log("[paypal-buttons] Order successfully created. ID:", data.orderId);
            return data.orderId;
          } catch (err: any) {
            console.error("[paypal-buttons] createOrder error:", err);
            throw err;
          }
        };
        buttonOptions.onApprove = async (data: any) => {
          console.log("[paypal-buttons] Checkout approved. Capturing order ID:", data.orderId);
          setPaymentStatus("processing");
          try {
            const res = await fetch(`${API_BASE}/api/payments/capture-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
              }),
            });
            const captureData = await res.json();
            if (captureData.success) {
              console.log("[paypal-buttons] Payment captured and database updated.");
              setPaymentStatus("success");
            } else {
              console.error("[paypal-buttons] Capture error:", captureData.error);
              setPaymentError(captureData.error || "Transaction capture failed.");
              setPaymentStatus("error");
            }
          } catch (err: any) {
            console.error("[paypal-buttons] capture order execution failed:", err);
            setPaymentError(err.message || "An unexpected error occurred.");
            setPaymentStatus("error");
          }
        };
      }

      window.paypal.Buttons(buttonOptions).render(paypalRef.current);
    }
  }, [paypalLoaded, verifiedTarget, showPaypalButtons, agreedTerms, selectedItem, targetId, buyerId, plansConfig]);

  const verifyTargetId = async () => {
    if (!targetId || !/^\d+$/.test(targetId)) {
      setVerifyError("Please enter a valid numeric ID.");
      return;
    }

    if (selectedItem?.type === "server_premium" && (!buyerId || !/^\d+$/.test(buyerId))) {
      setVerifyError("Please enter a valid Discord User ID for the buyer.");
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    setVerifiedTarget(null);
    setShowPaypalButtons(false);

    try {
      const type = selectedItem?.type === "server_premium" ? "server" : "user";
      const res = await fetch(`${API_BASE}/api/payments/verify-target`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, targetId }),
      });
      const data = await res.json();
      
      if (data.success) {
        if (type === "server") {
          const buyerRes = await fetch(`${API_BASE}/api/payments/verify-target`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "user", targetId: buyerId }),
          });
          const buyerData = await buyerRes.json();
          if (!buyerData.success) {
            setVerifyError("Buyer Discord ID is not registered in the database. Ensure the buyer ran `/register` first.");
            return;
          }
        }

        setVerifiedTarget(data.data);
        setShowPaypalButtons(true);
      } else {
        setVerifyError(data.error || "ID check failed. Verify target is registered inside Discord.");
      }
    } catch (err) {
      console.error(err);
      setVerifyError("Network request failed. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const closeCheckout = () => {
    setSelectedItem(null);
    setTargetId("");
    setBuyerId("");
    setAgreedTerms(false);
    setVerifiedTarget(null);
    setVerifyError(null);
    setShowPaypalButtons(false);
    setPaymentStatus("idle");
    setPaymentError(null);
  };

  const activePlans = activeTab === "user" ? userTiers : activeTab === "server" ? serverTiers : gemsPacks;

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      <div>
        {/* Header */}
        <header className="fixed inset-x-0 top-0 z-50">
          <div className="mx-auto mt-3 max-w-6xl px-4">
            <nav className="glass-strong flex h-14 items-center justify-between rounded-2xl px-4 sm:px-6">
              <Link to="/" className="font-display text-lg font-black tracking-[0.25em] text-white">
                MARVELO
              </Link>
              <Link to="/" className="text-sm text-white/70 transition-colors hover:text-white">
                ← Back to Home
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">
          <div className="text-center animate-fade-up">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur">
              Cosmic Shop & Subscriptions
            </span>
            <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
              Power Up Your <span className="text-gradient-hero">Marvelo</span> Experience
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-base text-white/55">
              Acquire instant Premium Gem currency, boost your individual player rewards, or upgrade your server spawner drop capabilities.
            </p>

            {/* Switcher Bar */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex rounded-full bg-white/[0.03] border border-white/10 p-1 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("user")}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === "user" ? "bg-white text-black shadow-lg" : "text-white/70 hover:text-white"
                  }`}
                >
                  👤 User Premium
                </button>
                <button
                  onClick={() => setActiveTab("server")}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === "server" ? "bg-white text-black shadow-lg" : "text-white/70 hover:text-white"
                  }`}
                >
                  🏛️ Server Premium
                </button>
                <button
                  onClick={() => setActiveTab("gems")}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === "gems" ? "bg-white text-black shadow-lg" : "text-white/70 hover:text-white"
                  }`}
                >
                  💎 Buy Gems
                </button>
              </div>
            </div>
          </div>

          {/* Grid Layout for items */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {activePlans.map((item) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-2xl border bg-white/[0.02] p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${
                  item.recommended
                    ? "border-amber-500/25 bg-gradient-to-b from-amber-500/[0.04] to-transparent shadow-glow-gold"
                    : "border-white/5"
                }`}
              >
                {item.recommended && (
                  <div className="absolute top-4 right-4 bg-gradient-hero text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Recommended
                  </div>
                )}
                <div>
                  {item.image && (
                    <div className="flex justify-center mb-6 h-36 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`object-contain max-h-36 ${
                          item.type === "gems" ? "animate-float max-h-24" : ""
                        }`}
                      />
                    </div>
                  )}

                  <h3 className="font-display text-2xl font-bold text-white mt-2">{item.name}</h3>
                  <p className="mt-2 text-sm text-white/50">{item.description}</p>
                  
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-black text-white">{item.price}</span>
                    {item.type !== "gems" && <span className="text-sm text-white/50 ml-1"> / month</span>}
                  </div>

                  <ul className="mt-8 space-y-4 border-t border-white/5 pt-6">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-white/80">
                        <span className="mr-2 text-amber-500/90">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className={`mt-8 w-full py-3 px-4 rounded-xl font-bold transition-all ${
                    item.recommended
                      ? "bg-gradient-hero text-white hover:opacity-90 shadow-md"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {item.type === "gems" ? "Purchase" : item.type === "server_premium" ? "Upgrade Server" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>

          {/* Yearly Banner */}
          {activeTab === "user" && (
            <div className="mt-16 relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
              style={{
                background: "radial-gradient(800px 300px at 0% 100%, rgba(59,164,255,0.12), transparent 70%), rgba(10,10,15,0.6)"
              }}
            >
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-400 text-xs px-3 py-1 font-semibold uppercase tracking-wider">
                  Special Value
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold text-white">Yearly Basic Supporter</h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  Support our developmental costs for a full calendar year and get instant access to 250 Cosmic Dust rewards, 3 Battle Credits, and a founding supporter profile emblem!
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {["🎁 250 Cosmic Dust reward", "🎫 3 Battle Credits bonus", "✨ 10% card fusing cost discount", "🛡️ Founding Supporter Emblem"].map((feat, i) => (
                    <div key={i} className="flex items-center text-sm text-white/80">
                      <span className="mr-2">✔️</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center md:text-right min-w-[200px]">
                <div className="text-4xl font-black text-white">$25.00</div>
                <div className="text-sm text-white/50 mt-1">/ year (Save over 30%)</div>
                <button
                  onClick={() => setSelectedItem({
                    id: "user-tier-1-yearly",
                    name: "Yearly Supporter (Basic)",
                    price: "$25.00",
                    type: "user_premium",
                    description: "Annual S.H.I.E.L.D Recruit package with bulk benefits.",
                    features: ["Includes all basic user tier benefits", "Annual registration profile badge"]
                  })}
                  className="mt-6 w-full md:w-auto py-3 px-8 rounded-xl bg-white text-black font-bold hover:bg-white/95 transition-colors shadow-lg"
                >
                  Upgrade Yearly
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Checkout overlay modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-surface p-8 shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto">
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">{selectedItem.type.replace("_", " ")}</span>
                  <h3 className="font-display text-2xl font-black text-white mt-1">{selectedItem.name}</h3>
                </div>
                <button onClick={closeCheckout} className="text-white/40 hover:text-white text-xl font-bold">×</button>
              </div>

              <div className="mt-4 flex items-baseline justify-between border-b border-white/5 pb-4">
                <span className="text-sm text-white/60">Total Amount:</span>
                <span className="text-2xl font-black text-white">{selectedItem.price}</span>
              </div>
            </div>

            {/* Verification Step */}
            {paymentStatus === "idle" && (
              <div className="my-6 space-y-4">
                {/* ID input for Target */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-white/80">
                    {selectedItem.type === "server_premium" ? <Server className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                    <span className="text-sm font-semibold">
                      {selectedItem.type === "server_premium" ? "Discord Server ID" : "Discord User ID"}
                    </span>
                  </div>
                  
                  <p className="text-xs text-white/50 mb-3">
                    Enter the Discord Snowflake ID of the target to upgrade. Enable Developer Mode in Discord settings, right-click, and copy the ID.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      disabled={verifiedTarget !== null}
                      placeholder={selectedItem.type === "server_premium" ? "e.g., 901234567890123456" : "e.g., 1501541929819574296"}
                      className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Additional Buyer ID input for Server upgrades */}
                {selectedItem.type === "server_premium" && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-white/80">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm font-semibold">Buyer Discord User ID</span>
                    </div>
                    <p className="text-xs text-white/50 mb-3">
                      Enter your personal Discord User ID to receive the bot payment receipt DM and confirmation details.
                    </p>
                    <input
                      type="text"
                      value={buyerId}
                      onChange={(e) => setBuyerId(e.target.value)}
                      disabled={verifiedTarget !== null}
                      placeholder="e.g., 1501541929819574296"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                )}

                {/* Verification Actions */}
                {!verifiedTarget && (
                  <button
                    onClick={verifyTargetId}
                    disabled={verifying || !targetId || (selectedItem.type === "server_premium" && !buyerId)}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-white/95 disabled:opacity-50 transition-colors"
                  >
                    {verifying && <Loader2 className="h-4 w-4 animate-spin" />} Verify Discord Configurations
                  </button>
                )}

                {verifyError && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl p-3 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                {verifiedTarget && (
                  <div className="flex items-center justify-between text-green-400 bg-green-950/20 border border-green-900/30 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>Configuration verified: <strong>{verifiedTarget.name}</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setVerifiedTarget(null);
                        setShowPaypalButtons(false);
                      }}
                      className="text-xs underline hover:text-green-300 font-semibold"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Strict Legal Policy Checkbox Section */}
            {showPaypalButtons && paymentStatus === "idle" && (
              <div className="my-4 p-4 border border-white/5 bg-white/[0.01] rounded-2xl text-xs space-y-3">
                <h4 className="font-display font-bold text-white uppercase tracking-wider">Purchase Terms & Strict Return Policy</h4>
                <p className="text-white/60 leading-relaxed">
                  All transactions for premium gems, credits, and subscription packages are final, digital, and strictly **NON-REFUNDABLE**. You may cancel user or server subscriptions at any time via your PayPal account to halt upcoming renewals, but active billing time is non-prorated. Opening a payment dispute or chargeback will result in automatic blacklist ban from all bot services.
                </p>
                <label className="flex items-start gap-2.5 text-white/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>I agree to the strict No-Refund Policy and Terms of Sale.</span>
                </label>
              </div>
            )}

            {/* Smart PayPal Buttons Render Container */}
            {showPaypalButtons && agreedTerms && paymentStatus === "idle" && (
              <div className="mt-2 border-t border-white/5 pt-4">
                {!paypalLoaded ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    <span className="text-xs text-white/50">Loading PayPal Checkout...</span>
                  </div>
                ) : (
                  <div ref={paypalRef} className="w-full"></div>
                )}
              </div>
            )}

            {/* Processing State */}
            {paymentStatus === "processing" && (
              <div className="my-10 flex flex-col items-center justify-center text-center gap-4 animate-pulse">
                <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
                <div>
                  <h4 className="font-display text-lg font-bold text-white">Verifying Transaction</h4>
                  <p className="text-xs text-white/50 mt-1">Please do not refresh or close this tab. Crediting your account details...</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {paymentStatus === "success" && (
              <div className="my-10 text-center flex flex-col items-center gap-4 animate-fade-in">
                <div className="h-16 w-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-400">
                  <Check className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-2xl font-black text-white">Upgrade Active!</h4>
                  <p className="text-sm text-white/60 mt-2">
                    Privileges have been successfully provisioned. We have sent a confirmation direct message directly to your Discord inbox.
                  </p>
                </div>
                <button
                  onClick={closeCheckout}
                  className="mt-6 px-6 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/95 shadow-md"
                >
                  Confirm & Close
                </button>
              </div>
            )}

            {/* Error State */}
            {paymentStatus === "error" && (
              <div className="my-10 text-center flex flex-col items-center gap-4 animate-fade-in">
                <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-white">Transaction Failed</h4>
                  <p className="text-xs text-red-400 mt-2">{paymentError || "An error occurred capturing the order."}</p>
                </div>
                <div className="flex gap-2 w-full mt-4">
                  <button
                    onClick={() => setPaymentStatus("idle")}
                    className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/15"
                  >
                    Retry
                  </button>
                  <button
                    onClick={closeCheckout}
                    className="flex-1 px-4 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

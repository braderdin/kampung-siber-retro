"use client"

// Start: Imports
import { useMemo, useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
// End: Imports

// Start: Type Definitions
interface ContributionMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}
interface DonationPackage {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}
// End: Type Definitions

// Start: DonatePage Component
export default function DonatePage() {
  const { language } = useLanguageStore();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const contributionMethods = useMemo<ContributionMethod[]>(() => [
    { id: "code", title: "Code Contribution", description: "Help improve the platform", icon: "💻", details: ["Submit PRs", "Fix bugs"] },
    { id: "design", title: "Design Contribution", description: "Create retro UI", icon: "🎨", details: ["Design", "Assets"] },
    { id: "donation", title: "Financial Donation", description: "Support server", icon: "💝", details: ["Monthly", "One-time"] },
    { id: "community", title: "Community Support", description: "Help moderate", icon: "🤝", details: ["Discord", "Residents"] },
  ], []);

  const donationPackages = useMemo<DonationPackage[]>(() => [
    { id: "supporter", name: "Supporter", price: "RM10/month", features: ["Early access", "Badge"] },
    { id: "patron", name: "Patron", price: "RM25/month", features: ["All Supporter", "Themes"], popular: true },
    { id: "sponsor", name: "Sponsor", price: "RM50/month", features: ["All Patron", "Priority"] },
  ], []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div id="page-header" className="mb-8 text-center">
          <h1 className="text-3xl font-bold pixel-font mb-2">💝 {language === "ms" ? "Sumbangan" : "Donate"}</h1>
        </div>
        <div id="contribution-methods" className="retro-card mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">Contribution Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contributionMethods.map((m) => (
              <div key={m.id} className="retro-window border-2 border-gray-300 p-4 text-center">
                <div className="text-2xl mb-2">{m.icon}</div>
                <h3 className="font-bold">{m.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <div id="donation-packages" className="retro-card mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">Donation Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {donationPackages.map((pkg) => (
              <div key={pkg.id} id={"package-"+pkg.id} className="retro-window border-2 p-4 text-center">
                <h3 className="font-bold">{pkg.name}</h3>
                <p>{pkg.price}</p>
                <button className="retro-btn-primary w-full mt-2">Select</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
// End: DonatePage Component

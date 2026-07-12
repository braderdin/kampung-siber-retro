"use client"

// Task 25: CLI Help page with terminal tables
// Start: Imports
import { useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
// End: Imports

// Start: Type Definitions
type Command = {
  command: string;
  description: string;
  example: string;
  category: string;
};
// End: Type Definitions

// Start: CLIPage Component
export default function CLIPage() {
  const { language } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState("navigation");

  const commands: Command[] = [
    { command: "/help", description: "Show all commands", example: "/help", category: "navigation" },
    { command: "/home", description: "Go to home page", example: "/home", category: "navigation" },
  ];

  const categories = [
    { id: "navigation", label: "Navigation", icon: "🧭" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <main id="cli-page" className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div id="cli-header" className="mb-8 text-center">
          <h1 className="text-3xl font-bold pixel-font mb-2">🖥️ CLI Help</h1>
        </div>
        <div id="commands-table" className="retro-card p-6">
          <table id="commands-table-content" className="min-w-full">
            <thead><tr><th>Command</th><th>Description</th><th>Example</th></tr></thead>
            <tbody>{commands.map((cmd)=>(<tr key={cmd.command}><td>{cmd.command}</td><td>{cmd.description}</td><td>{cmd.example}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
// End: CLIPage Component
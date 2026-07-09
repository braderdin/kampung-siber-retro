"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ContactForm from '@/components/ContactForm';
import HydrationGuard from '@/components/HydrationGuard';

export default function ContactPage() {
  const [isClient, setIsClient] = useState(false);
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Start: Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-4 inline-block">
            ✉️ Email the Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question, feedback, or need assistance? Send us an email and we'll get back to you as soon as possible.
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Contact Info */}
        <div className="retro-terminal bg-black border-2 border-cyan-500 rounded-none p-4 mb-8">
          <div className="font-mono text-sm text-cyan-300 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">📧</span>
              <span>Admin Email: <span className="text-pink-400">admin@kampungsiber.com</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">⏱️</span>
              <span>Response Time: Within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">📍</span>
              <span>Location: Virtual World, RetroOS 95</span>
            </div>
          </div>
        </div>
        {/* End: Contact Info */}

        {/* Start: Contact Form */}
        <HydrationGuard>
          <ContactForm />
        </HydrationGuard>
        {/* End: Contact Form */}

        {/* Start: Footer Notice */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Your message will be sent via your default email client. Make sure you have email configured on your device.
          </p>
        </div>
        {/* End: Footer Notice */}
      </div>
    </main>
  );
}
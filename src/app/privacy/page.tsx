"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import HydrationGuard from '@/components/HydrationGuard';

export default function PrivacyPage() {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-4 inline-block">
            🔒 Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your data privacy matters to us
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Privacy Content */}
        <div className="retro-card border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-none p-6">
          <div className="prose prose-gray dark:prose-invert max-w-none pixel-font text-sm">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kampung Siber Retro ("we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, and safeguard your information when you use our retro workspace platform.
            </p>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              2. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may collect the following information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Account information: username, email address, profile picture</li>
              <li>Usage data: pages visited, features used, session duration</li>
              <li>Communication data: messages in guestbook, community posts</li>
              <li>Technical data: IP address, browser type, device information</li>
            </ul>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              3. R2 Storage Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kampung Siber Retro uses Cloudflare R2 as our content delivery and storage solution. R2 provides secure, distributed storage for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>User profile images and avatars</li>
              <li>Site assets, themes, and downloadable resources</li>
              <li>File uploads and shared documents</li>
              <li>Static content and media files</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Data Retention:</strong> Files stored in R2 are retained for as long as they remain active and accessible within our platform. When content is deleted, it may take up to 90 days for complete removal from R2's distributed storage.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Security:</strong> All data in R2 is encrypted both at rest and in transit using industry-standard encryption protocols (AES-256). Access to stored content is controlled through secure API keys and authentication tokens.
            </p>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              4. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your information is used to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Personalize your experience and display preferences</li>
              <li>Enable community features and social interactions</li>
              <li>Improve our platform and develop new features</li>
              <li>Communicate important updates and notifications</li>
              <li>Monitor for abuse and maintain platform security</li>
            </ul>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              5. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>To comply with legal obligations or protect our rights</li>
              <li>To investigate fraud or security incidents</li>
              <li>To R2 CDN for content delivery (no personal data is shared)</li>
              <li>With your consent or as required by law</li>
            </ul>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              6. Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Essential cookies: Required for basic functionality</li>
              <li>Preference cookies: Remember your settings and theme choices</li>
              <li>Analytics cookies: Help us understand platform usage</li>
            </ul>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              7. Your Rights and Choices
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Export your content and contributions</li>
              <li>Opt out of non-essential cookies</li>
              <li>Control notification preferences</li>
            </ul>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              8. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>HTTPS encryption for all communications</li>
              <li>Secure authentication with session management</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data</li>
            </ul>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              9. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-none border border-gray-300 dark:border-gray-600 mb-4">
              <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                📧 Email: admin@kampungsiber.com<br />
                📍 Location: Virtual World, RetroOS 95<br />
                🕒 Response Time: Within 24 hours
              </p>
            </div>

            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 border-b-2 border-cyan-500 pb-2">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
            </p>
          </div>
        </div>
        {/* End: Privacy Content */}

        {/* Start: Footer Notice */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Your privacy is protected • Data stored securely in R2 • Never sold or shared
          </p>
        </div>
        {/* End: Footer Notice */}
      </div>
    </main>
  );
}
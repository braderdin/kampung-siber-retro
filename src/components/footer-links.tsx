"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface FooterLink {
  name: string;
  href: string;
}

export default function FooterLinks() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const footerLinks: FooterLink[] = [
    { name: t.dashboardTitle, href: '/about' },
    { name: t.settings, href: '/donate' },
    { name: t.guestbookTitle, href: '/cli' },
    { name: t.fileEditor, href: '/press' },
    { name: t.analytics, href: '/status' },
    { name: t.myFiles, href: '/terms' },
    { name: t.dashboardTitle, href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Themes', href: '/themes' },
    { name: 'Directory', href: '/directory' },
    { name: 'Status', href: '/status' },
    { name: 'Sitemap', href: '/sitemap' },
  ];

  return footerLinks;
}
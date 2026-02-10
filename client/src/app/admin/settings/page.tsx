"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  RefreshCw,
  Globe,
  Bell,
  CreditCard,
  Mail,
  Shield,
  Database,
  CheckCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui";
import { getSettings, updateSettings } from "@/lib/admin-api";

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  pricing: {
    monthlyPrice: number;
    yearlyPrice: number;
    trialDays: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    newUserEmail: boolean;
    ticketEmail: boolean;
    subscriptionEmail: boolean;
    weeklyReport: boolean;
  };
  security: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    requireEmailVerification: boolean;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogType: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    twitterSite: string;
    googleVerification: string;
    bingVerification: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
    structuredData: string;
    favicon: string;
  };
}

const defaultSettings: Settings = {
  general: {
    siteName: "🫶iDocs",
    siteDescription: "All your PDF tools in one place",
    supportEmail: "support@idocs.app",
    maxFileSize: 50,
    allowedFileTypes: ["pdf", "doc", "docx", "jpg", "png"],
  },
  pricing: {
    monthlyPrice: 9,
    yearlyPrice: 79,
    trialDays: 7,
  },
  email: {
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@idocs.app",
    fromName: "🫶iDocs",
  },
  notifications: {
    newUserEmail: true,
    ticketEmail: true,
    subscriptionEmail: true,
    weeklyReport: false,
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 60,
    requireEmailVerification: false,
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "We are currently performing maintenance. Please check back soon.",
  },
  seo: {
    metaTitle: "🫶iDocs — Free Online PDF & Document Tools",
    metaDescription: "Merge, split, compress, convert, edit, and secure your PDF files online — all free. No installation required. Fast, secure, and easy to use.",
    metaKeywords: "PDF tools, merge PDF, split PDF, compress PDF, convert PDF, online PDF editor, free PDF tools, iDocs, document converter, PDF to Word, Word to PDF, image to PDF",
    canonicalUrl: "https://idocs.app",
    ogTitle: "🫶iDocs — Free Online PDF & Document Tools",
    ogDescription: "All your PDF needs in one place. Merge, split, compress, convert, and more. Free, fast, and secure.",
    ogImage: "https://idocs.app/og-image.png",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "🫶iDocs — Free Online PDF & Document Tools",
    twitterDescription: "All your PDF needs in one place. Merge, split, compress, convert, and more.",
    twitterImage: "https://idocs.app/twitter-image.png",
    twitterSite: "@idocsapp",
    googleVerification: "",
    bingVerification: "",
    robotsIndex: true,
    robotsFollow: true,
    structuredData: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "🫶iDocs",
      "url": "https://idocs.app",
      "description": "Free online PDF tools - merge, split, compress, convert PDFs",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }, null, 2),
    favicon: "/favicon.ico",
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof Settings>("general");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings({ ...defaultSettings, ...data });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(settings as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof Settings>(
    category: K,
    key: keyof Settings[K],
    value: Settings[K][keyof Settings[K]]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: "general" as const, label: "General", icon: Globe },
    { id: "seo" as const, label: "SEO", icon: Search },
    { id: "pricing" as const, label: "Pricing", icon: CreditCard },
    { id: "email" as const, label: "Email", icon: Mail },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "maintenance" as const, label: "Maintenance", icon: Database },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <div className="flex items-center gap-2 text-success text-sm">
              <CheckCircle className="w-4 h-4" />
              Saved!
            </div>
          )}
          <Button variant="outline" size="sm" onClick={fetchSettings}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-card border border-border rounded-2xl p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting("general", "siteName", e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Site Description</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting("general", "siteDescription", e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Support Email</label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting("general", "supportEmail", e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={settings.general.maxFileSize}
                    onChange={(e) => updateSetting("general", "maxFileSize", Number(e.target.value))}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">SEO Settings</h2>
              <p className="text-sm text-muted-foreground">Configure search engine optimization settings to improve your site&apos;s visibility on Google and other search engines.</p>
              
              {/* Meta Tags Section */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-2">Meta Tags</h3>
                
                <div>
                  <label className="text-sm font-medium">Meta Title</label>
                  <input
                    type="text"
                    value={settings.seo.metaTitle}
                    onChange={(e) => updateSetting("seo", "metaTitle", e.target.value)}
                    placeholder="Your Site Title | Tagline"
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 50-60 characters. Current: {settings.seo.metaTitle.length}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Meta Description</label>
                  <textarea
                    value={settings.seo.metaDescription}
                    onChange={(e) => updateSetting("seo", "metaDescription", e.target.value)}
                    placeholder="A brief description of your website for search engines..."
                    rows={3}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters. Current: {settings.seo.metaDescription.length}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Meta Keywords</label>
                  <input
                    type="text"
                    value={settings.seo.metaKeywords}
                    onChange={(e) => updateSetting("seo", "metaKeywords", e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords (limited SEO impact but still useful)</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Canonical URL</label>
                  <input
                    type="url"
                    value={settings.seo.canonicalUrl}
                    onChange={(e) => updateSetting("seo", "canonicalUrl", e.target.value)}
                    placeholder="https://yourdomain.com"
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">The preferred URL for your site (prevents duplicate content issues)</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Favicon URL</label>
                  <input
                    type="text"
                    value={settings.seo.favicon}
                    onChange={(e) => updateSetting("seo", "favicon", e.target.value)}
                    placeholder="/favicon.ico"
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Open Graph Section */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-2">Open Graph (Facebook, LinkedIn)</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">OG Title</label>
                    <input
                      type="text"
                      value={settings.seo.ogTitle}
                      onChange={(e) => updateSetting("seo", "ogTitle", e.target.value)}
                      placeholder="Title when shared on social media"
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">OG Type</label>
                    <select
                      value={settings.seo.ogType}
                      onChange={(e) => updateSetting("seo", "ogType", e.target.value)}
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="product">Product</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">OG Description</label>
                  <textarea
                    value={settings.seo.ogDescription}
                    onChange={(e) => updateSetting("seo", "ogDescription", e.target.value)}
                    placeholder="Description when shared on social media..."
                    rows={2}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">OG Image URL</label>
                  <input
                    type="url"
                    value={settings.seo.ogImage}
                    onChange={(e) => updateSetting("seo", "ogImage", e.target.value)}
                    placeholder="https://yourdomain.com/og-image.png"
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x630 pixels</p>
                </div>
              </div>

              {/* Twitter Card Section */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-2">Twitter Card</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Twitter Card Type</label>
                    <select
                      value={settings.seo.twitterCard}
                      onChange={(e) => updateSetting("seo", "twitterCard", e.target.value)}
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Twitter @username</label>
                    <input
                      type="text"
                      value={settings.seo.twitterSite}
                      onChange={(e) => updateSetting("seo", "twitterSite", e.target.value)}
                      placeholder="@yourusername"
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Twitter Title</label>
                  <input
                    type="text"
                    value={settings.seo.twitterTitle}
                    onChange={(e) => updateSetting("seo", "twitterTitle", e.target.value)}
                    placeholder="Title for Twitter shares"
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Twitter Description</label>
                  <textarea
                    value={settings.seo.twitterDescription}
                    onChange={(e) => updateSetting("seo", "twitterDescription", e.target.value)}
                    placeholder="Description for Twitter shares..."
                    rows={2}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Twitter Image URL</label>
                  <input
                    type="url"
                    value={settings.seo.twitterImage}
                    onChange={(e) => updateSetting("seo", "twitterImage", e.target.value)}
                    placeholder="https://yourdomain.com/twitter-image.png"
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x600 pixels for large image cards</p>
                </div>
              </div>

              {/* Search Engine Verification */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-2">Search Engine Verification</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Google Site Verification</label>
                    <input
                      type="text"
                      value={settings.seo.googleVerification}
                      onChange={(e) => updateSetting("seo", "googleVerification", e.target.value)}
                      placeholder="Google verification code"
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">From Google Search Console</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bing Site Verification</label>
                    <input
                      type="text"
                      value={settings.seo.bingVerification}
                      onChange={(e) => updateSetting("seo", "bingVerification", e.target.value)}
                      placeholder="Bing verification code"
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">From Bing Webmaster Tools</p>
                  </div>
                </div>
              </div>

              {/* Robots Settings */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-2">Robots & Indexing</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.seo.robotsIndex}
                      onChange={(e) => updateSetting("seo", "robotsIndex", e.target.checked)}
                      className="w-5 h-5 rounded border-border"
                    />
                    <div>
                      <span className="text-sm font-medium">Allow Indexing</span>
                      <p className="text-xs text-muted-foreground">Let search engines index your pages</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.seo.robotsFollow}
                      onChange={(e) => updateSetting("seo", "robotsFollow", e.target.checked)}
                      className="w-5 h-5 rounded border-border"
                    />
                    <div>
                      <span className="text-sm font-medium">Allow Following Links</span>
                      <p className="text-xs text-muted-foreground">Let search engines follow links on your pages</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Structured Data */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-2">Structured Data (JSON-LD)</h3>
                
                <div>
                  <label className="text-sm font-medium">Schema.org JSON-LD</label>
                  <textarea
                    value={settings.seo.structuredData}
                    onChange={(e) => updateSetting("seo", "structuredData", e.target.value)}
                    placeholder='{"@context": "https://schema.org", ...}'
                    rows={8}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Valid JSON-LD for rich snippets in search results. Test at Google&apos;s Rich Results Test.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Pricing Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Monthly Price ($)</label>
                  <input
                    type="number"
                    value={settings.pricing.monthlyPrice}
                    onChange={(e) => updateSetting("pricing", "monthlyPrice", Number(e.target.value))}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Yearly Price ($)</label>
                  <input
                    type="number"
                    value={settings.pricing.yearlyPrice}
                    onChange={(e) => updateSetting("pricing", "yearlyPrice", Number(e.target.value))}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Annual savings: $
                    {(settings.pricing.monthlyPrice * 12 - settings.pricing.yearlyPrice).toFixed(0)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Trial Days</label>
                  <input
                    type="number"
                    value={settings.pricing.trialDays}
                    onChange={(e) => updateSetting("pricing", "trialDays", Number(e.target.value))}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Email Settings</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSetting("email", "smtpHost", e.target.value)}
                      placeholder="smtp.example.com"
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">SMTP Port</label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting("email", "smtpPort", Number(e.target.value))}
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">SMTP User</label>
                    <input
                      type="text"
                      value={settings.email.smtpUser}
                      onChange={(e) => updateSetting("email", "smtpUser", e.target.value)}
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">SMTP Password</label>
                    <input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => updateSetting("email", "smtpPassword", e.target.value)}
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">From Email</label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateSetting("email", "fromEmail", e.target.value)}
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">From Name</label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) => updateSetting("email", "fromName", e.target.value)}
                      className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Notification Settings</h2>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getNotificationDescription(key)}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        updateSetting("notifications", key as keyof Settings["notifications"], e.target.checked)
                      }
                      className="w-5 h-5 rounded border-border cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting("security", "maxLoginAttempts", Number(e.target.value))}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of failed login attempts before lockout
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Lockout Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => updateSetting("security", "lockoutDuration", Number(e.target.value))}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting("security", "sessionTimeout", Number(e.target.value))}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <label className="flex items-center justify-between p-4 rounded-xl bg-muted/50 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Require Email Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Users must verify their email before accessing the app
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.requireEmailVerification}
                    onChange={(e) =>
                      updateSetting("security", "requireEmailVerification", e.target.checked)
                    }
                    className="w-5 h-5 rounded border-border cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Maintenance Settings</h2>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl bg-danger/5 border border-danger/20 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-danger">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">
                      When enabled, users will see a maintenance message
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenance.maintenanceMode}
                    onChange={(e) =>
                      updateSetting("maintenance", "maintenanceMode", e.target.checked)
                    }
                    className="w-5 h-5 rounded border-border cursor-pointer"
                  />
                </label>

                <div>
                  <label className="text-sm font-medium">Maintenance Message</label>
                  <textarea
                    value={settings.maintenance.maintenanceMessage}
                    onChange={(e) => updateSetting("maintenance", "maintenanceMessage", e.target.value)}
                    rows={4}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    newUserEmail: "Receive email when a new user signs up",
    ticketEmail: "Receive email when a new support ticket is created",
    subscriptionEmail: "Receive email for subscription changes",
    weeklyReport: "Receive weekly analytics report via email",
  };
  return descriptions[key] || "";
}

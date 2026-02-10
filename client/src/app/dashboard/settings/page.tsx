"use client";

import { useState } from "react";
import { User, Mail, Lock, Bell, Shield, Trash2, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock user data
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    fileReady: true,
    weeklyDigest: true,
  });

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile);
    // TODO: integrate with real API
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Changing password");
    // TODO: integrate with real API
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Settings */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold">Profile Settings</h2>
            <p className="text-sm text-muted-foreground">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold">Change Password</h2>
            <p className="text-sm text-muted-foreground">
              Update your password for security
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Min 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
          />

          <Button type="submit">Update Password</Button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground">
              Control what emails you receive
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "email",
              label: "Email Notifications",
              desc: "Receive important account updates",
            },
            {
              key: "fileReady",
              label: "File Ready Alerts",
              desc: "Get notified when your files are processed",
            },
            {
              key: "weeklyDigest",
              label: "Weekly Digest",
              desc: "Summary of your activity and tips",
            },
            {
              key: "marketing",
              label: "Marketing Emails",
              desc: "Product updates and promotions",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold">Security</h2>
            <p className="text-sm text-muted-foreground">
              Additional security options
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div>
              <p className="text-sm font-medium">Active Sessions</p>
              <p className="text-xs text-muted-foreground">
                Manage your logged in devices
              </p>
            </div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-danger/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h2 className="font-bold text-danger">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">
              Irreversible account actions
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-danger/20 bg-danger/5">
          <p className="text-sm mb-3">
            Deleting your account will permanently remove all your data, files,
            and subscription. This action cannot be undone.
          </p>
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h3 className="font-bold">Delete your account?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action is permanent and cannot be undone. All your data
                  will be lost.
                </p>
              </div>
            </div>
            <Input
              label="Type 'DELETE' to confirm"
              placeholder="DELETE"
              className="mb-4"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger">Delete Forever</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

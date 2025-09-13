import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { User, LogOut, Mail, Phone, MapPin, Shield, Bell, Lock } from "lucide-react";

const Section = ({ title, children }) => (
  <section className="bg-white rounded-xl shadow p-5 sm:p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </section>
);

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [prefsOpen, setPrefsOpen] = useState(false);
  const fileRef = useRef(null);

  // hydrate optional fields from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("fitit_profile_optional");
      if (raw) {
        const { phone: p, address: a, avatar: av } = JSON.parse(raw);
        if (p) setPhone(p);
        if (a) setAddress(a);
        if (av) setAvatar(av);
      }
    } catch {}
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    // simulate async save
    setTimeout(() => {
      try {
        localStorage.setItem(
          "fitit_profile_optional",
          JSON.stringify({ phone, address, avatar })
        );
        setMessage("Profile updated successfully.");
      } finally {
        setSaving(false);
      }
    }, 600);
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const initials = (user?.name || "U").slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Overview */}
        <Section title="Profile Overview">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-700 text-2xl">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => fileRef.current?.click()}
              >
                Upload Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" aria-label="Upload avatar" />
            </div>

            <form onSubmit={saveProfile} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm">
                <span className="text-gray-600 mb-1">Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </label>
              <label className="flex flex-col text-sm">
                <span className="text-gray-600 mb-1">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              </label>
              <label className="flex flex-col text-sm">
                <span className="text-gray-600 mb-1">Phone (optional)</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border rounded pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              </label>
              <label className="flex flex-col text-sm sm:col-span-2">
                <span className="text-gray-600 mb-1">Address (optional)</span>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className="border rounded pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              </label>

              <div className="sm:col-span-2 flex items-center gap-3">
                <button disabled={saving} type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60 transition">
                  {saving ? "Saving..." : "Save changes"}
                </button>
                {message && <span className="text-sm text-emerald-600 animate-fade-in">{message}</span>}
              </div>
            </form>
          </div>
        </Section>

        {/* Account settings */}
        <Section title="Account Settings">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><Lock size={18} className="text-purple-600" /><h3 className="font-medium">Change Password</h3></div>
              <div className="grid gap-2">
                <input type="password" placeholder="Current password" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <input type="password" placeholder="New password" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <input type="password" placeholder="Confirm new password" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button className="mt-1 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">Update Password</button>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><Shield size={18} className="text-purple-600" /><h3 className="font-medium">Account Email</h3></div>
              <div className="grid gap-2">
                <input type="email" placeholder="New email" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button className="mt-1 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">Update Email</button>
              </div>
            </div>
          </div>
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <button onClick={() => setPrefsOpen((v) => !v)} className="mb-3 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition">
            <Bell size={16} /> {prefsOpen ? "Hide" : "Show"} notification & privacy settings
          </button>
          {prefsOpen && (
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Notifications</h3>
                <label className="flex items-center justify-between text-sm py-1">
                  <span>Email alerts</span>
                  <input type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between text-sm py-1">
                  <span>Order updates</span>
                  <input type="checkbox" defaultChecked />
                </label>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Privacy</h3>
                <label className="flex items-center justify-between text-sm py-1">
                  <span>Show my profile to others</span>
                  <input type="checkbox" />
                </label>
                <label className="flex items-center justify-between text-sm py-1">
                  <span>Personalized recommendations</span>
                  <input type="checkbox" defaultChecked />
                </label>
              </div>
            </div>
          )}
        </Section>

        {/* Orders/History quick link */}
        <Section title="Orders & History">
          <p className="text-sm text-gray-600">View your recent orders and delivery status.</p>
          <button className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Go to Orders</button>
        </Section>
      </div>
    </main>
  );
};

export default Profile;

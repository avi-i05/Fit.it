import React, { useState } from "react";

const Profile = () => {
  // Dummy user data
  const [user, setUser] = useState({
    name: "Ashish Kumar",
    email: "ashish@example.com",
    role: "Partner",
    joined: "2025-01-15",
    orders: 128,
    earnings: 56000,
    rating: 4.8,
    deliveriesCompleted: 95, // %
    responseRate: 88, // %
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleSave = () => {
    setUser(form);
    setEditing(false);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl overflow-hidden">
        {/* Cover Section */}
        <div className="bg-purple-600 h-32 relative">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=8b5cf6&color=fff&size=150`}
            alt="Profile Avatar"
            className="w-28 h-28 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2 top-12"
          />
        </div>

        <div className="p-6 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2 text-sm text-gray-500">
            <span className="font-semibold">Role:</span> {user.role} •{" "}
            <span className="font-semibold">Joined:</span> {user.joined}
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xl font-bold text-purple-700">{user.orders}</p>
              <p className="text-gray-600 text-sm">Orders</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xl font-bold text-purple-700">₹{user.earnings}</p>
              <p className="text-gray-600 text-sm">Earnings</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xl font-bold text-purple-700">{user.rating}⭐</p>
              <p className="text-gray-600 text-sm">Rating</p>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="mt-6 text-left space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Deliveries Completed: {user.deliveriesCompleted}%</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${user.deliveriesCompleted}%` }}
                ></div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Response Rate: {user.responseRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${user.responseRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setEditing(true)}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
            <button className="px-5 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-purple-700">Edit Profile</h3>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                className="w-full border p-2 rounded"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <select
                className="w-full border p-2 rounded"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>Partner</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

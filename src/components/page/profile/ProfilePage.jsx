import React, { useContext } from "react";
import { motion } from "framer-motion";
import AuthContext from "../../../context/Auth/authcontext";
import DashboardLayout from "../partnerDashboard/dashboard/DashboardLayout";
import Sidebar from "../partnerDashboard/dashboard/Sidebar";

function PartnerProfile() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        User not found
      </div>
    );
  }

  const {
    fullName,
    brandName,
    sellerType,
    storeName,
    storeImage,
    ownerImage,
    email,
    phoneNumber,
    isVerified,
    createdAt,
    govtID,
    govtIDImage,
    gstNumber,
    address = {},
  } = user;

  return (
    <DashboardLayout>
        <Sidebar/>
      <div className="min-h-screen bg-black text-white pb-16">

        {/* STORE BANNER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-64 bg-white/5 border-b border-white/10"
        >
          {storeImage && (
            <img
              src={storeImage}
              className="w-full h-full object-cover opacity-70"
            />
          )}
        </motion.div>

        <div className="max-w-6xl mx-auto px-6">

          {/* PROFILE HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-16"
          >

            {/* OWNER AVATAR */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black bg-white/10">
              {ownerImage ? (
                <img
                  src={ownerImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl">
                  {fullName?.charAt(0)}
                </div>
              )}
            </div>

            {/* STORE INFO */}
            <div className="flex-1">

              <h1 className="text-3xl font-semibold">
                {brandName}
              </h1>

              <p className="text-white/70 mt-1">
                {storeName}
              </p>

              <p className="text-white/50 text-sm">
                Owner: {fullName}
              </p>

              <div className="flex items-center gap-3 mt-3">

                <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                  {sellerType}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    isVerified
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {isVerified ? "Verified" : "Pending Verification"}
                </span>

              </div>

            </div>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {/* CONTACT CARD */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>

              <div className="space-y-2 text-white/80 text-sm">
                <p>Email: {email}</p>
                <p>Phone: {phoneNumber}</p>
                <p>
                  Joined:{" "}
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </motion.div>


            {/* GOVT DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Government Details
              </h3>

              <div className="space-y-2 text-white/80 text-sm">
                <p>Govt ID: {govtID}</p>
                <p>GST: {gstNumber || "N/A"}</p>
              </div>

              {govtIDImage && (
                <img
                  src={govtIDImage}
                  className="mt-4 rounded-lg border border-white/10"
                />
              )}
            </motion.div>


            {/* ADDRESS */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2"
            >
              <h3 className="text-lg font-semibold mb-4">
                Store Address
              </h3>

              <div className="text-white/80 text-sm space-y-1">

                <p>{address.addressLine1}</p>

                <p>{address.addressLine2}</p>

                <p>
                  {[address.city, address.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <p>
                  {[address.postalCode, address.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>

              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PartnerProfile;
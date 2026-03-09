import { useState } from "react";
import { register } from "../../../api/auth";
import MapPicker from "../../map/MapPicker";
import { AnimatePresence, motion } from "framer-motion";

const Register = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [locationAddress, setLocationAddress] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    ownerImage: null,
    sellerType: "freelancer",
    email: "",
    password: "",
    phoneNumber: "",
    storeName: "",
    storeImage: null,
    brandName: "",
    govtID: "",
    govtIDImage: null,
    gstNumber: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    location: null,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateAddress = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  // validations

  const validateStepOne = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.storeName.trim())
      newErrors.storeName = "Store name is required";

    if (!formData.ownerImage) newErrors.ownerImage = "Owner image is required";
    else if (!formData.ownerImage.type.startsWith("image/"))
      newErrors.ownerImage = "Only image files allowed";

    if (!formData.storeImage) newErrors.storeImage = "Store image is required";
    else if (!formData.storeImage.type.startsWith("image/"))
      newErrors.storeImage = "Only image files allowed";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Minimum 8 characters required";

    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";

    if (!formData.brandName.trim())
      newErrors.brandName = "Brand name is required";

    if (!formData.sellerType) newErrors.sellerType = "Seller type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.govtID.trim()) newErrors.govtID = "Government ID is required";

    if (!formData.govtIDImage)
      newErrors.govtIDImage = "Government ID image is required";
    else if (!formData.govtIDImage.type.startsWith("image/"))
      newErrors.govtIDImage = "Only image files allowed";

    if (formData.gstNumber && !/^[0-9A-Z]{15}$/.test(formData.gstNumber))
      newErrors.gstNumber = "Invalid GST number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepThree = () => {
    const newErrors = {};
    const addr = formData.address;

    if (!addr.addressLine1.trim())
      newErrors.addressLine1 = "Address line 1 required";

    if (!addr.city.trim()) newErrors.city = "City is required";

    if (!addr.state.trim()) newErrors.state = "State is required";

    if (!addr.postalCode) newErrors.postalCode = "Postal code required";
    else if (!/^\d{6}$/.test(addr.postalCode))
      newErrors.postalCode = "Invalid postal code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepFour = () => {
    const newErrors = {};

    if (
      !formData.location ||
      !formData.location.coordinates ||
      formData.location.coordinates.length !== 2
    ) {
      newErrors.location = "Location access is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit

  const handleSubmit = async () => {
    const payload = new FormData();

    payload.append("fullName", formData.fullName);
    payload.append("storeName", formData.storeName);

    if (formData.ownerImage) {
      payload.append("ownerImage", formData.ownerImage);
    }

    if (formData.storeImage) {
      payload.append("storeImage", formData.storeImage);
    }
    payload.append("sellerType", formData.sellerType);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("phoneNumber", formData.phoneNumber);
    payload.append("brandName", formData.brandName);
    payload.append("govtID", formData.govtID);
    payload.append("gstNumber", formData.gstNumber);

    payload.append("address", JSON.stringify(formData.address));

    if (formData.location) {
      payload.append("location", JSON.stringify(formData.location));
    }

    if (formData.govtIDImage) {
      payload.append("govtIDImage", formData.govtIDImage);
    }

    console.log("Submitting:", formData);

    try {
      await register(payload);
      alert("Registration successful");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const getDeviceLocation = () => {
    setErrors({});

    if (!navigator.geolocation) {
      setErrors({ location: "Geolocation is not supported by your browser" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        }));

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );

          const data = await res.json();
          console.log(data);

          const addressParts = [
            data.locality,
            data.city || data.principalSubdivision,
            data.principalSubdivision,
            data.countryName,
          ].filter(Boolean);

          setLocationAddress(addressParts.join(", "));
        } catch (err) {
          console.error("OSM reverse geocode failed:", err);
        }
      },
      (error) => {
        setErrors({
          location:
            error.code === 1
              ? "Location permission denied"
              : "Unable to fetch location",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const ProgressBar = ({ step, totalSteps }) => {
    const progress = (step / totalSteps) * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>
            Step {step} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  };

  // ui

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black ">
      {/* lrft half */}
      <div
        className="hidden lg:flex flex-col justify-center px-16 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1489987707025-afc232f7ea0f')",
        }}
      >
        <div className="absolute inset-0 bg-black/70  " />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Join the Fashion Revolution
          </h1>
        </motion.div>
      </div>

      {/* right half */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-8 mt-[110px] "
        >
          <h2 className="text-2xl text-white mb-6">Step {step} of 4</h2>

          {step === 1 && (
            <div className="space-y-4">
              <input
                className="input"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-400">{errors.fullName}</p>
              )}

              {/* Store Name */}
              <input
                className="input"
                placeholder="Store Name"
                value={formData.storeName}
                onChange={(e) => updateField("storeName", e.target.value)}
              />
              {errors.storeName && (
                <p className="text-red-400">{errors.storeName}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {/* Owner Image */}
                <div className="space-y-2">
                  <label className="text-white text-sm">Owner Image</label>

                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/40 transition">
                    {formData.ownerImage ? (
                      <img
                        src={URL.createObjectURL(formData.ownerImage)}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-white/60 text-sm text-center">
                        <p className="text-lg">📷</p>
                        <p>Click to upload owner photo</p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        updateField("ownerImage", e.target.files[0])
                      }
                    />
                  </label>

                  {errors.ownerImage && (
                    <p className="text-red-400 text-xs">{errors.ownerImage}</p>
                  )}
                </div>

                {/* Store Image */}
                <div className="space-y-2">
                  <label className="text-white text-sm">Store Image</label>

                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/40 transition">
                    {formData.storeImage ? (
                      <img
                        src={URL.createObjectURL(formData.storeImage)}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-white/60 text-sm text-center">
                        <p className="text-lg">🏬</p>
                        <p>Click to upload store image</p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        updateField("storeImage", e.target.files[0])
                      }
                    />
                  </label>

                  {errors.storeImage && (
                    <p className="text-red-400 text-xs">{errors.storeImage}</p>
                  )}
                </div>
              </div>

              <select
                className="input"
                value={formData.sellerType}
                onChange={(e) => updateField("sellerType", e.target.value)}
              >
                <option value="freelancer">Freelancer</option>
                <option value="shop">Shop Owner</option>
                <option value="brand">Brand</option>
                <option value="other">Other</option>
              </select>

              <input
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              {errors.email && <p className="text-red-400">{errors.email}</p>}

              <input
                type="password"
                className="input"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
              {errors.password && <p className="error">{errors.password}</p>}

              <input
                className="input"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => updateField("phoneNumber", e.target.value)}
              />
              {errors.phoneNumber && <p className="">{errors.phoneNumber}</p>}

              <input
                className="input"
                placeholder="Brand Name"
                value={formData.brandName}
                onChange={(e) => updateField("brandName", e.target.value)}
              />
              {errors.brandName && <p className="error">{errors.brandName}</p>}

              <button
                className="btn-primary"
                onClick={() => {
                  if (validateStepOne()) {
                    setErrors({});
                    setStep(2);
                  }
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* S2 */}
          {step === 2 && (
            <div className="space-y-4">
              <input
                className="input"
                placeholder="Government ID"
                value={formData.govtID}
                onChange={(e) => updateField("govtID", e.target.value)}
              />
              {errors.govtID && <p className="error">{errors.govtID}</p>}

              <input
                type="file"
                accept="image/*"
                className="text-white"
                onChange={(e) => updateField("govtIDImage", e.target.files[0])}
              />
              {errors.govtIDImage && (
                <p className="error">{errors.govtIDImage}</p>
              )}

              <input
                className="input"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={(e) => updateField("gstNumber", e.target.value)}
              />
              {errors.gstNumber && <p className="error">{errors.gstNumber}</p>}

              <div className="flex gap-3">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (validateStepTwo()) {
                      setErrors({});
                      setStep(3);
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* S3 */}
          {step === 3 && (
            <div className="space-y-4">
              <input
                className="input"
                placeholder="Address Line 1"
                value={formData.address.addressLine1}
                onChange={(e) => updateAddress("addressLine1", e.target.value)}
              />
              {errors.addressLine1 && (
                <p className="error">{errors.addressLine1}</p>
              )}

              <input
                className="input"
                placeholder="City"
                value={formData.address.city}
                onChange={(e) => updateAddress("city", e.target.value)}
              />
              {errors.city && <p className="error">{errors.city}</p>}

              <input
                className="input"
                placeholder="State"
                value={formData.address.state}
                onChange={(e) => updateAddress("state", e.target.value)}
              />
              {errors.state && <p className="error">{errors.state}</p>}

              <input
                className="input"
                placeholder="Postal Code"
                value={formData.address.postalCode}
                onChange={(e) => updateAddress("postalCode", e.target.value)}
              />
              {errors.postalCode && (
                <p className="error">{errors.postalCode}</p>
              )}

              <div className="flex gap-3">
                <button className="btn-secondary" onClick={() => setStep(2)}>
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (validateStepThree()) {
                      setErrors({});
                      setStep(4);
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          {/* S4 — location */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-white text-lg font-semibold">
                Set Your Location
              </h3>

              <p className="text-white/60 text-sm">
                Choose how you want to set your store location
              </p>

              {/* OPTION 1 — GPS */}
              <button
                onClick={getDeviceLocation}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition"
              >
                📍 Use My Current Location
              </button>

              <div className="text-center text-white/40 text-sm">OR</div>

              {/* OPTION 2 — MAP PICKER */}
              <MapPicker
                setLocation={(loc) =>
                  setFormData((prev) => ({ ...prev, location: loc }))
                }
                setAddress={setLocationAddress}
              />

              {/* ADDRESS PREVIEW */}
              {locationAddress && (
                <div className="bg-white/10 p-3 rounded-xl text-white text-sm">
                  📍 {locationAddress}
                </div>
              )}

              {errors.location && (
                <p className="text-red-400 text-xs">{errors.location}</p>
              )}

              <div className="flex gap-3">
                <button className="btn-secondary" onClick={() => setStep(3)}>
                  Back
                </button>

                <button
                  className="btn-primary"
                  onClick={() => {
                    if (validateStepFour()) {
                      handleSubmit();
                    }
                  }}
                >
                  Finish Registration
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

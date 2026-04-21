import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { Appcontext } from "../context/Appccontext";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProfileEditComponent() {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { userData, backendUrl, token, loadUserProfileData } =
    useContext(Appcontext);

  const createInitialTempData = () => ({
    ...userData,
    birthday: userData?.dob ? userData.dob.split("T")[0] : "",
    profile_pic: userData?.image || assets.profile_pic,
    imageFile: null,
  });

  const [tempData, setTempData] = useState(createInitialTempData());

  useEffect(() => {
    if (userData) {
      setTempData(createInitialTempData());
    }
  }, [userData]);

  const handleEdit = () => {
    setTempData(createInitialTempData());
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", tempData.name || "");
      formData.append("email", tempData.email || "");
      formData.append("phone", tempData.phone || "");
      formData.append("gender", tempData.gender || "");
      formData.append("dob", tempData.birthday || "");

      if (typeof tempData.address === "object") {
        formData.append("address", JSON.stringify(tempData.address));
      } else {
        formData.append(
          "address",
          JSON.stringify({
            line1: tempData.address || "",
            line2: "",
          })
        );
      }

      if (tempData.imageFile) {
        formData.append("image", tempData.imageFile);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        await loadUserProfileData();
        setIsEditing(false);
        toast.success(data.message || "Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData(createInitialTempData());
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "address") {
      setTempData((prev) => ({
        ...prev,
        address: {
          line1: value,
          line2:
            typeof prev?.address === "object" ? prev.address?.line2 || "" : "",
        },
      }));
    } else {
      setTempData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempData((prev) => ({
        ...prev,
        profile_pic: imageUrl,
        imageFile: file,
      }));
    }
  };

  if (!userData) return null;

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page title */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1 text-xs sm:text-sm font-medium text-indigo-700">
            My Profile
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
            Manage Your Profile
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 leading-6 max-w-2xl">
            Keep your personal details up to date for a better booking and
            healthcare experience.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          {/* Left profile card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={
                    isEditing
                      ? tempData?.profile_pic || assets.profile_pic
                      : userData?.image || assets.profile_pic
                  }
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-100 shadow-sm"
                />

                {isEditing && (
                  <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap cursor-pointer rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-all">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <h2 className="mt-6 text-xl sm:text-2xl font-bold text-slate-800">
                {isEditing ? tempData?.name || "Your Name" : userData?.name || ""}
              </h2>

              <p className="mt-2 text-sm text-slate-500 break-all">
                {isEditing ? tempData?.email || "" : userData?.email || ""}
              </p>

              <div className="mt-6 w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account Summary
                </p>

                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Phone</span>
                    <span className="text-slate-800 font-medium text-right">
                      {userData?.phone || "Not added"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Gender</span>
                    <span className="text-slate-800 font-medium text-right">
                      {userData?.gender || "Not added"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">DOB</span>
                    <span className="text-slate-800 font-medium text-right">
                      {userData?.dob
                        ? new Date(userData.dob).toLocaleDateString()
                        : "Not added"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right form card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-8">
            {/* Contact info */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Contact Information
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Update your essential contact details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={tempData?.name || ""}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                      {userData?.name || ""}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={tempData?.email || ""}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 break-all">
                      {userData?.email || ""}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={tempData?.phone || ""}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                      {userData?.phone || "Not added"}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={
                        typeof tempData?.address === "object"
                          ? tempData.address?.line1 || ""
                          : tempData?.address || ""
                      }
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                      {typeof userData?.address === "object"
                        ? `${userData.address?.line1 || ""} ${
                            userData.address?.line2 || ""
                          }`.trim() || "Not added"
                        : userData?.address || "Not added"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic info */}
            <div className="mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                Basic Information
              </h3>
              <p className="text-sm text-slate-500 mt-1 mb-5">
                Add personal details for a more complete profile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={tempData?.gender || ""}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                      {userData?.gender || "Not added"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={tempData?.birthday || ""}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                      {userData?.dob
                        ? new Date(userData.dob).toDateString()
                        : "Not added"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="w-full sm:w-auto rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Information"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
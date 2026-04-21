import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function DoctorProfile() {
  const { dToken, profileData, setProfileData, getProfileData , backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fees: "",
    address: "",
    available: false,
  });

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        fees: profileData.fees || "",
        address:
          typeof profileData.address === "object"
            ? profileData.address?.line1 || ""
            : profileData.address || "",
        available: profileData.available || false,
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      const payload = {
        fees: Number(formData.fees),
        address: formData.address,
        available: formData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        payload,
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");

        setProfileData((prev) => ({
          ...prev,
          fees: payload.fees,
          address: payload.address,
          available: payload.available,
        }));

        await getProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-40 rounded-3xl bg-white shadow-sm" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-3xl bg-white shadow-sm lg:col-span-1" />
            <div className="h-96 rounded-3xl bg-white shadow-sm lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top banner */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white/30 bg-white/20 shadow-lg">
                <img
                  src={profileData.image}
                  alt={profileData.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {profileData.name || "Doctor Name"}
                </h1>
                <p className="mt-1 text-sm text-white/90 sm:text-base">
                  {profileData.degree || "Degree"} •{" "}
                  {profileData.speciality || "Speciality"}
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {profileData.experience || "0 Years"} Experience
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                    profileData.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {profileData.available ? "Available" : "Unavailable"}
                </span>

                <button
                  onClick={() => setIsEdit((prev) => !prev)}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
                >
                  {isEdit ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">
                Personal Information
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {profileData.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Speciality</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {profileData.speciality || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Degree</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {profileData.degree || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Experience</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {profileData.experience || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">
                About Doctor
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {profileData.about || "No description available."}
              </p>
            </div>
          </div>

          {/* Right card */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Profile Settings
                  </h2>
                  <p className="text-sm text-slate-500">
                    Update consultation fees, address, and availability
                  </p>
                </div>

                {!isEdit && (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Fees */}
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Consultation Fees
                  </label>

                  {isEdit ? (
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <span className="px-4 text-slate-500">{currency}</span>
                      <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleChange}
                        className="w-full px-2 py-3 outline-none"
                        placeholder="Enter fees"
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-slate-800">
                      {currency}
                      {profileData.fees || 0}
                    </p>
                  )}
                </div>

                {/* Available */}
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Availability Status
                  </label>

                  {isEdit ? (
                    <label className="inline-flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-700">
                        {formData.available ? "Available" : "Unavailable"}
                      </span>
                    </label>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        profileData.available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {profileData.available ? "Available" : "Unavailable"}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Clinic Address
                  </label>

                  {isEdit ? (
                    <textarea
                      name="address"
                      rows="4"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Enter clinic address"
                    />
                  ) : (
                    <p className="text-sm leading-6 text-slate-700">
                      {typeof profileData.address === "object"
                        ? `${profileData.address?.line1 || ""} ${
                            profileData.address?.line2 || ""
                          }`
                        : profileData.address || "No address available"}
                    </p>
                  )}
                </div>
              </div>

              {isEdit && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={() => {
                      setIsEdit(false);
                      setFormData({
                        fees: profileData.fees || "",
                        address:
                          typeof profileData.address === "object"
                            ? profileData.address?.line1 || ""
                            : profileData.address || "",
                        available: profileData.available || false,
                      });
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
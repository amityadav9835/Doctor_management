import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const AddDoctor = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Please upload doctor image");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({
        line1: address1,
        line2: address2,
      }));

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            aToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 Year");
        setFees("");
        setAbout("");
        setSpeciality("General physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
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

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="text-2xl font-medium mb-5">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-5xl">
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />

          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div className="flex flex-col gap-4">
            <div>
              <p>Your name</p>
              <input
                className="border rounded px-3 py-2 w-full"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <p>Your Email</p>
              <input
                className="border rounded px-3 py-2 w-full"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <p>Your Password</p>
              <input
                className="border rounded px-3 py-2 w-full"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <p>Experience</p>
              <select
                className="border rounded px-3 py-2 w-full"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option>1 Year</option>
                <option>2 Years</option>
                <option>3 Years</option>
                <option>4 Years</option>
                <option>5 Years</option>
                <option>6 Years</option>
                <option>7 Years</option>
                <option>8 Years</option>
                <option>9 Years</option>
                <option>10 Years</option>
              </select>
            </div>

            <div>
              <p>Fees</p>
              <input
                className="border rounded px-3 py-2 w-full"
                type="number"
                placeholder="Your fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2 w-full"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div>
              <p>Education</p>
              <input
                className="border rounded px-3 py-2 w-full"
                type="text"
                placeholder="Education"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>

            <div>
              <p>Address</p>
              <input
                className="border rounded px-3 py-2 w-full mb-2"
                type="text"
                placeholder="Address 1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
              <input
                className="border rounded px-3 py-2 w-full"
                type="text"
                placeholder="Address 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-600">
          <p>About me</p>
          <textarea
            className="border rounded px-3 py-2 w-full"
            rows={5}
            placeholder="write about yourself"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-3 rounded-full"
        >
          {loading ? "Adding..." : "Add doctor"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
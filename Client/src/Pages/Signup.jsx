import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail, isPassword } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";
import { creatAccount } from "../Redux/Slices/AuthSlice";

function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: null,
  });

  // handle text inputs
  function handleUserInput(e) {
    const { name, value } = e.target;

    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  // handle image upload
  function getImage(event) {
    const uploadedImage = event.target.files[0];

    if (!uploadedImage) return;

    setSignupData({
      ...signupData,
      avatar: uploadedImage,
    });

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreviewImage(fileReader.result);
    };

    fileReader.readAsDataURL(uploadedImage);
  }

  // create account
  async function createNewAccount(event) {

    event.preventDefault();

    if (!signupData.fullName || !signupData.email || !signupData.password) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupData.fullName.length < 5) {
      toast.error("Name should be at least 5 characters");
      return;
    }

    if (!isEmail(signupData.email)) {
      toast.error("Invalid email");
      return;
    }

    if (!isPassword(signupData.password)) {
      toast.error(
        "Password should be 6-16 characters with number and special character"
      );
      return;
    }

    // send data to redux
    const response = await dispatch(creatAccount(signupData));

    if (response?.payload?.success) {

      toast.success("Account created successfully");

      navigate("/");

      setSignupData({
        fullName: "",
        email: "",
        password: "",
        avatar: null,
      });

      setPreviewImage("");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">

        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 rounded-lg text-white p-4 w-80 shadow-[0_0_10px_black]"
        >

          <h1 className="text-center text-2xl font-bold">
            Registration Page
          </h1>

          {/* Avatar */}
          <label htmlFor="image_uploads" className="cursor-pointer">

            {previewImage ? (
              <img
                src={previewImage}
                className="w-24 h-24 rounded-full m-auto object-cover"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 m-auto" />
            )}

          </label>

          <input
            type="file"
            id="image_uploads"
            accept="image/*"
            className="hidden"
            onChange={getImage}
          />

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.fullName}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 py-2 font-semibold text-lg cursor-pointer transition-all duration-300 rounded-sm"
          >
            Create Account
          </button>

          <p className="text-center">
            Already have an account ?{" "}
            <Link to="/login" className="text-accent cursor-pointer">
              Login
            </Link>
          </p>

        </form>

      </div>
    </HomeLayout>
  );
}

export default Signup;

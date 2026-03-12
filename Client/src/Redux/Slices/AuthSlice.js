import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance";

const isBrowser = typeof window !== "undefined";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const initialState = {
  isLoggedIn: isBrowser ? localStorage.getItem("isLoggedIn") === "true" : false,
  role: isBrowser ? localStorage.getItem("role") || "" : "",
  data: isBrowser ? safeParse(localStorage.getItem("data"), {}) : {},
};


// ================= SIGNUP =================
export const creatAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar);

    const res = axiosInstance.post("user/register", formData);

    toast.promise(res, {
      loading: "Creating your account...",
      success: (data) => data?.data?.message,
      error: "Failed to create account",
    });

    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// ================= LOGIN =================
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("user/login", data);

    toast.promise(res, {
      loading: "Authenticating...",
      success: (data) => data?.data?.message,
      error: "Failed to login",
    });

    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// ================= LOGOUT =================
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.post("user/logout");

    toast.promise(res, {
      loading: "Logging out...",
      success: (data) => data?.data?.message,
      error: "Failed to logout",
    });

    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
  try {
    const res = axiosInstance.put("user/update", data);

    toast.promise(res, {
      loading: "Updating profile...",
      success: (data) => data?.data?.message,
      error: "Failed to update profile",
    });

    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// ================= GET USER DATA =================
export const getuserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = axiosInstance.get("user/me");
    return (await res).data;
  } catch (error) {
    toast.error(error?.message);
  }
});


// ================= FORGET PASSWORD =================
export const forgetPassword = createAsyncThunk("/auth/forget-password", async (data) => {
  try {
    const res = axiosInstance.post("user/reset", data);

    toast.promise(res, {
      loading: "Processing...",
      success: (data) => data?.data?.message,
      error: "Failed to send reset link",
    });

    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// ================= CHANGE PASSWORD =================
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      const res = axiosInstance.post("/user/change-password", userPassword);

      toast.promise(res, {
        loading: "Updating password...",
        success: (data) => data?.data?.message,
        error: "Failed to change password",
      });

      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);


// ================= RESET PASSWORD =================
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    const res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
    });

    toast.promise(res, {
      loading: "Resetting password...",
      success: (data) => data?.data?.message,
      error: "Failed to reset password",
    });

    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // SIGNUP
      .addCase(creatAccount.fulfilled, (state, action) => {
        if (action?.payload?.user) {
          localStorage.setItem("data", JSON.stringify(action.payload.user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", action.payload.user.role);

          state.data = action.payload.user;
          state.role = action.payload.user.role;
          state.isLoggedIn = true;
        }
      })

      // LOGIN
      .addCase(login.fulfilled, (state, action) => {
        if (action?.payload?.user) {
          localStorage.setItem("data", JSON.stringify(action.payload.user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", action.payload.user.role);

          state.data = action.payload.user;
          state.role = action.payload.user.role;
          state.isLoggedIn = true;
        }
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      })

      // GET USER DATA
      .addCase(getuserData.fulfilled, (state, action) => {
        if (!action?.payload?.user) return;

        localStorage.setItem("data", JSON.stringify(action.payload.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", action.payload.user.role);

        state.isLoggedIn = true;
        state.data = action.payload.user;
        state.role = action.payload.user.role;
      });
  },
});

export default authSlice.reducer;


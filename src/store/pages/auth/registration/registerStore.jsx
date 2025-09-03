import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

export const useRegisterStore = create((set) => ({
  users: [],
  isLoading: false,

  addUser: async (newUser) => {
    try {
      set({ isLoading: true });
      const res = await axiosRequest.post(`/Account/register`, newUser);
      set((state) => ({
        users: [...state.users, res.data],
        isLoading: false
      }));
      console.log("User registered:", res.data);
      return { success: true, data: res.data }; 
    } catch (error) {
      console.error("Registration failed:", error.response || error.message || error);
      set({ isLoading: false });
      return { success: false, error: error.response || error.message || error }; 
    }
  },

  addLogin: async (newUser) => {
    try {
      set({ isLoading: true });
      const result = await axiosRequest.post(`/Account/login`, newUser);
      const token = result.data.token;

      set((state) => ({
        users: [...state.users, result.data],
        isLoading: false
      }));

      console.log("User logged in:", result.data);
      return { success: true, token, data: result.data }; 
    } catch (error) {
      console.error("Login failed:", error.response || error.message || error);
      set({ isLoading: false });
      return { success: false, error: error.response || error.message || error }; 
    }
  },
  
  putLogin: async ({ oldPassword, newPassword, confirmPassword }) => {
    try {
      set({ isLoading: true });
      const res = await axiosRequest.put(
        `/Account/ChangePassword`,
        {},
        {
          params: {
            OldPassword: oldPassword,
            Password: newPassword,
            ConfirmPassword: confirmPassword
          }
        }
      );
      set({ isLoading: false });
      console.log("Password changed successfully:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Password change failed:", error.response || error.message || error);
      set({ isLoading: false });
      return { success: false, error: error.response || error.message || error };
    }
  },

}));

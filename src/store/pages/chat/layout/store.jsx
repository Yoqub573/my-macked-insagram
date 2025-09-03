import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useMyProfile = create((set) => ({
  myProfile: [],
  users: [],
  loadingMyProfil: false,
  loadingCreateChat: false,

  getMyProfil: async () => {
    set({ loadingMyProfil: true });
    try {
      const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
      set({ myProfile: data.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingMyProfil: false });
    }
  },

  getUsers: async () => {
    try {
      let { data } = await axiosRequest.get(`/User/get-users`);
      set({ users: data });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  },

  createChat: async (id) => {
    set({ loadingCreateChat: true });

    try {
      await axiosRequest.post(`/Chat/create-chat?receiverUserId=${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingCreateChat: false });
    }
  },
}));

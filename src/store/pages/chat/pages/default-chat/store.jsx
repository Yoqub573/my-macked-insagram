import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useDefaultChat = create((set) => ({
  chats: [],
  loadingChat: false,

  get: async () => {
    set({ loadingChat: true });
    try {
      const { data } = await axiosRequest.get(`/Chat/get-chats`);
      set({ chats: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingChat: false });
    }
  },
}));

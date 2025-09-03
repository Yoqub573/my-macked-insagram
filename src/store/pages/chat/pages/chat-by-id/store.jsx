import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useChatById = create((set) => ({
  messages: [],
  loadingChatById: false,
  loadingDelChat: false,

  getChatById: async (id) => {
    set({ loadingChatById: true });
    try {
      const { data } = await axiosRequest.get(
        `/Chat/get-chat-by-id?chatId=${id}`
      );
      set({ messages: data.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingChatById: false });
    }
  },

  sendMessage: async (formData) => {
    await axiosRequest.put(`/Chat/send-message`, formData);
  },

  deleteMessage: async (id) => {
    await axiosRequest.delete(`/Chat/delete-message?massageId=${id}`);
  },

  deleteChat: async (id) => {
    set({ loadingDelChat: true });
    try {
      await axiosRequest.delete(`/Chat/delete-chat?chatId=${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingDelChat: false });
    }
  },
}));

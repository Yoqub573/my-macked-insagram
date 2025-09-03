"use client";

import img from "@/assets/img/pages/chat/layout/userFoto.jpg";
import { useUserId } from "@/hook/useUserId";
import { useChatById } from "@/store/pages/chat/pages/chat-by-id/store";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { Box, Button, Drawer, Skeleton, Stack } from "@mui/material";
import {
  ArrowLeft,
  EllipsisVertical,
  Loader2,
  Mic,
  SendHorizontal,
  Trash,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import EmojiPicker from "emoji-picker-react";
import Link from "next/link";
import useDarkSide from "@/hook/useDarkSide";
import PeerCall from "@/components/pages/chat/pages/chat-by-id/PeerCall";
import { useTranslation } from "react-i18next";

export default function ChatById() {
  const { "chat-by-id": id } = useParams();
  const userId = useUserId();

  const {
    messages,
    deleteChat,
    getChatById,
    sendMessage,
    deleteMessage,
    loadingDelChat,
  } = useChatById();

  const messagesContainerRef = useRef(null);
  const prevMessagesCount = useRef(0);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    if (!messages) return;

    if (prevMessagesCount.current === 0) {
      scrollToBottom();
    }

    if (messages.length > prevMessagesCount.current) {
      scrollToBottom();
    }

    prevMessagesCount.current = messages.length;
  }, [messages]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const { chats, get, loadingChat } = useDefaultChat();

  const intervalRef = useRef(null);
  const pollingInProgressRef = useRef(false);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      if (!id) return;
      if (pollingInProgressRef.current) return;
      try {
        pollingInProgressRef.current = true;
        await getChatById(id);
      } catch (err) {
        console.error("polling error", err);
      } finally {
        pollingInProgressRef.current = false;
      }
    }, 3000);
  }, [id, getChatById]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    startPolling();
    getChatById(id);

    return () => {
      stopPolling();
    };
  }, [id, getChatById, startPolling, stopPolling]);

  const [inpMessage, setinpMessage] = useState("");
  const [inpFile, setinpFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [openIsVideo, setOpenIsVideo] = useState(false);
  const [openIsAudio, setOpenIsAudio] = useState(false);
  const [delMesModal, setdelMesModal] = useState(null);

  useEffect(() => {
    return () => {
      if (previewFile && previewFile.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewFile);
        } catch {}
      }
      stopPolling();
    };
  }, []);

  let router = useRouter();

  function formatMessageTime(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = date.getDay(); // 0-6
    const week = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    };
    return `${week[day]} ${hours}:${minutes}`;
  }

  async function handleDelChat(chatId) {
    try {
      router.push("/chats");
      await deleteChat(chatId);
      await get();
      setdelMesModal(null);
    } catch (error) {
      console.error(error);
    }
  }

  const isVideoFileName = (name) =>
    /\.(mp4|webm|ogg|mov)$/i.test(String(name || ""));

  const isImageFileName = (name) =>
    /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(String(name || ""));

  const isAudioFileName = (name) =>
    /\.(mp3|wav|ogg|m4a)$/i.test(String(name || ""));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewFile && previewFile.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewFile);
      } catch {}
    }

    setinpFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewFile(objectUrl);
    setOpenIsVideo(isVideoFileName(file.name));
    setOpenIsAudio(isAudioFileName(file.name));
  };

  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inpMessage && !inpFile) return;

    const formData = new FormData();
    formData.append("ChatId", id);
    formData.append("MessageText", inpMessage || "");
    if (inpFile) formData.append("File", inpFile);

    setLoading(true);
    try {
      await sendMessage(formData);
      await getChatById(id);
      setinpMessage("");
      setinpFile(null);
      setPreviewFile(null);
      setOpenIsVideo(false);
      setOpenEmoji(false);
    } catch (err) {
      console.error("sendMessage error:", err);
    } finally {
      setLoading(false);
    }
  };

  async function handleDelMessage(mesId) {
    setLoading(true);
    try {
      await deleteMessage(mesId);
      await getChatById(id);
    } catch (error) {
      console.error("sendMessage error:", error);
    } finally {
    }
    setLoading(false);
    setdelMesModal(null);
  }

  const toggleDelModal = (mesId) =>
    setdelMesModal((e) => (e === mesId ? null : mesId));

  const closePreview = () => {
    setinpFile(null);
    setPreviewFile(null);
    setOpenIsVideo(false);
  };

  const onEmojiClick = (emojiData) => {
    setinpMessage((prev) => prev + emojiData.emoji);
  };

  let [openEmoji, setOpenEmoji] = useState(false);

  let userData = chats?.data?.find((e) => e.chatId == id);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (previewFile && previewFile.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewFile);
        } catch {}
      }

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });

        setinpFile(file);
        setPreviewFile(URL.createObjectURL(blob));
        setOpenIsAudio(true);

        stream.getTracks().forEach((t) => t.stop());
        setMediaStream(null);
        setMediaRecorder(null);
      };

      recorder.start();
      setMediaStream(stream);
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      try {
        if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
      } catch (e) {
        console.warn(e);
      }
      setRecording(false);

      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
        setMediaStream(null);
      }
    }
  };

  const SkeletonRow = () => (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      className="p-3 w-[50%]"
    >
      <Skeleton variant="circular" width={44} height={44} />
      <Stack spacing={0.5} flex={1}>
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="40%" height={12} />
      </Stack>
    </Stack>
  );

  function linkToProfile(id) {
    router.push(`/${id}`);
  }

  const [theme, setTheme] = useDarkSide();
  const { t } = useTranslation();
  //------------------------------------------------------------------------------------------------------
  return (
    <div className="w-full">
      <div className="relative shadow w-[100%] z-10 p-2 flex justify-between items-center">
        <div className="flex items-center gap-3 w-full">
          <Link href={`/chats`} className="lg:hidden block">
            <button>
              <ArrowLeft />
            </button>
          </Link>

          {loadingChat ? (
            <div className="w-1/2">
              <SkeletonRow />
            </div>
          ) : (
            <div className="flex items-center gap-2 ">
              {userData ? (
                <div className="flex items-center gap-2">
                  {!userData.receiveUserImage ? (
                    <Image
                      src={img}
                      width={500}
                      height={500}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src={`http://37.27.29.18:8003/images/${
                        userData.receiveUserId === userId
                          ? userData.sendUserImage
                          : userData.receiveUserImage
                      }`}
                      width={500}
                      height={500}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}

                  <div>
                    <p>
                      {userData.receiveUserId === userId
                        ? userData.sendUserName
                        : userData.receiveUserName}
                    </p>
                  </div>
                </div>
              ) : (
                <SkeletonRow />
              )}
            </div>
          )}
        </div>

        <div>
          <Button onClick={toggleDrawer(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </Button>
        </div>
      </div>

      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          className="flex flex-col justify-end p-5"
        >
          <div>
            <button
              type="button"
              onClick={() => handleDelChat(id)}
              className="text-red-500  p-2 rounded flex items-center justify-between gap-2 w-full"
            >
              {t("chat.removeChat")} <Trash size={18} />
            </button>
          </div>
        </Box>
      </Drawer>

      <div
        ref={messagesContainerRef}
        className="flex flex-col gap-2 overflow-y-auto h-[76vh]"
      >
        <div>
          <div className="flex items-center gap-2 p-5">
            {userData ? (
              <div className="flex items-center gap-2 w-full justify-center flex-col">
                {!userData.receiveUserImage ? (
                  <Image
                    src={img}
                    width={500}
                    height={500}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src={`http://37.27.29.18:8003/images/${
                      userData.receiveUserId === userId
                        ? userData.sendUserImage
                        : userData.receiveUserImage
                    }`}
                    width={500}
                    height={500}
                    alt="avatar"
                    className="w-25 h-25 rounded-full object-cover"
                  />
                )}

                <div>
                  <p className="text-gray-500">
                    {userData.receiveUserId === userId
                      ? userData.sendUserName
                      : userData.receiveUserName}
                    - Instagram
                  </p>
                </div>

                <button
                  onClick={() =>
                    linkToProfile(
                      `${
                        userData.receiveUserId === userId
                          ? userData.sendUserId
                          : userData.receiveUserId
                      }`
                    )
                  }
                  className={`cursor-pointer font-medium rounded px-5 py-1 ${
                    theme == "dark"
                      ? "bg-[rgb(80,80,80)] text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {t("chat.seeProfile")}
                </button>
              </div>
            ) : (
              <SkeletonRow />
            )}
          </div>

          <div ref={messagesContainerRef} className=" flex flex-col">
            {messages &&
              [...messages].reverse().map((e) => {
                const isCurrentUser = e.userId === userId;

                console.log(e.messageText);
                return (
                  <section key={e.messageId}>
                    <p className={`text-[10px] text-center  `}>
                      {formatMessageTime(e.sendMassageDate)}
                    </p>

                    <div
                      className={`flex items-center gap-3  p-3 rounded-lg group w-full ${
                        isCurrentUser
                          ? " self-end rounded-tr-none flex-row-reverse"
                          : " self-start rounded-tl-none "
                      }`}
                    >
                      <div
                        className={`flex flex-col max-w-7/10  ${
                          isCurrentUser ? " self-end" : " self-start"
                        }`}
                      >
                        {e.file && isVideoFileName(e.file) ? (
                          <video
                            src={`http://37.27.29.18:8003/images/${e.file}`}
                            controls
                            className="pb-2 rounded-xl  max-w-xs"
                          />
                        ) : e.file && isAudioFileName(e.file) ? (
                          <audio
                            src={`http://37.27.29.18:8003/images/${e.file}`}
                            controls
                            className="pb-2  max-w-xs"
                          />
                        ) : e.file ? (
                          <Image
                            src={`http://37.27.29.18:8003/images/${e.file}`}
                            alt="image"
                            width={1000}
                            height={1000}
                            className="pb-2 rounded-xl  max-w-xs"
                          />
                        ) : (
                          ""
                        )}

                        {e.messageText &&
                          (isVideoFileName(e.messageText) ? (
                            <div>
                              <video
                                src={`http://37.27.29.18:8003/images/${e.messageText}`}
                                controls
                                className="pb-2 rounded-xl max-w-xs"
                              />
                            </div>
                          ) : e.messageText &&
                            isImageFileName(e.messageText) ? (
                            <div>
                              <img
                                src={`http://37.27.29.18:8003/images/${e.messageText}`}
                                alt="media"
                                className="pb-2 rounded-xl max-w-xs"
                              />
                            </div>
                          ) : (
                            <div
                              className={`rounded-lg  ${
                                isCurrentUser
                                  ? "bg-blue-500 text-white self-end rounded-tr-none p-1.5 px-3"
                                  : "bg-gray-100 text-[#475569] self-start rounded-tl-none p-1.5 px-3"
                              }`}
                            >
                              <p>{e.messageText}</p>
                            </div>
                          ))}
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleDelModal(e.messageId)}
                          className={` ${
                            delMesModal === e.messageId ? "block" : ""
                          }`}
                        >
                          <EllipsisVertical size={15} />
                        </button>

                        {delMesModal === e.messageId && (
                          <div
                            className={`absolute flex flex-col justify-center items-center gap-2 shadow rounded bg-white w-[200px] ${
                              isCurrentUser
                                ? "lg:-ml-60 lg:-mt-30 -mx-20 -mt-32 "
                                : "lg:ml-5 lg:-mt-30  -mx-10 -mt-32"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleDelMessage(e.messageId)}
                              className="text-red-500 p-2 rounded"
                            >
                              {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                              ) : (
                                <p className="flex items-center gap-2">
                                  {t("chat.deleteMessage")} <Trash size={18} />
                                </p>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setdelMesModal(null)}
                              className="p-2"
                            >
                              {t("chat.cancel")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
          </div>
        </div>
      </div>

      <div className="border-2 min-h-12 max-h-12 m-4 p-2 rounded-xl border-[#E2E8F0] flex justify-between gap-1 items-center">
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setOpenEmoji((e) => !e)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-[#475569]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
        </button>
        {openEmoji && (
          <div className="absolute mb-130">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <form
          onSubmit={handleSend}
          className="w-full flex justify-between items-center"
        >
          <input
            type="text"
            className="w-full outline-none px-2"
            placeholder={t("chat.messagePlaceholder")}
            value={inpMessage}
            onChange={(e) => setinpMessage(e.target.value)}
          />

          {!inpMessage ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className={`p-2 rounded-full ${
                  recording ? "bg-red-500 text-white animate-pulse" : ""
                }`}
              >
                <Mic />
              </button>

              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFile}
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </label>
            </div>
          ) : (
            <button
              type="submit"
              className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <SendHorizontal />
              )}
            </button>
          )}
        </form>

        {previewFile && (
          <div
            style={{ backdropFilter: "blur(6px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]"
          >
            <div className="w-[400px] bg-white rounded-xl shadow p-5">
              {openIsVideo ? (
                <video
                  src={previewFile}
                  controls
                  className="max-h-64 mx-auto mb-4"
                />
              ) : openIsAudio ? (
                <audio src={previewFile} controls className="w-full mb-4" />
              ) : (
                <img
                  src={previewFile}
                  alt="preview"
                  className="max-h-64 mx-auto mb-4"
                />
              )}

              <div className="flex justify-between border-t-2 border-gray-300 pt-3">
                <button
                  type="button"
                  onClick={closePreview}
                  className="text-red-500 px-7 py-2 rounded  bg-red-100"
                >
                  <X />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSend}
                    className="px-7 py-2 rounded mr-2 bg-blue-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <SendHorizontal />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

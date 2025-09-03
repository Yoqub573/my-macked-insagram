"use client";

import { Loader2, Send, User, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { useMyProfile } from "@/store/pages/chat/layout/store";
import { useUserId } from "@/hook/useUserId";
import { usegetUserStore } from "@/store/pages/search/store";
import { Skeleton, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useChatById } from "@/store/pages/chat/pages/chat-by-id/store";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import useDarkSide from "@/hook/useDarkSide";

const ModalUsers = ({ media }) => {
    const router = useRouter();
    const userId = useUserId();

    const { chats, get, loadingChat } = useDefaultChat();
    const { getMyProfil, createChat, loadingCreateChat } = useMyProfile();
    const { sendMessage } = useChatById();
    const { users, getUsers, getSearchHistories } = usegetUserStore();

    const [openModalUsers, setOpenModalUsers] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idx, setIdx] = useState(null);

    useEffect(() => {
        get();
        if (userId) getMyProfil(userId);
        getUsers();
        getSearchHistories();
    }, [userId]);

    const allUsers = useMemo(() => users?.data ?? [], [users]);

    useEffect(() => {
        if (!search || !search.trim()) {
            setFilteredUsers(allUsers);
            setLoading(false);
            return;
        }

        setLoading(true);
        const t = setTimeout(() => {
            const q = search.toLowerCase();
            const results = allUsers.filter((u) =>
                String(u.userName ?? "")
                    .toLowerCase()
                    .includes(q)
            );
            setFilteredUsers(results);
            setLoading(false);
        }, 500);

        return () => clearTimeout(t);
    }, [search, allUsers]);

    const SkeletonRow = () => (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            className="p-3 rounded-lg border border-gray-200 shadow-sm"
        >
            <Skeleton variant="circular" width={44} height={44} />
            <Stack spacing={0.5} flex={1}>
                <Skeleton variant="text" width="60%" height={14} />
                <Skeleton variant="text" width="40%" height={12} />
            </Stack>
        </Stack>
    );

    async function handleCreateChat(id) {
        try {
            setIdx(id);

            setOpenModalUsers(false);
            await createChat(id);
            await get();

            const chat = useDefaultChat
                .getState()
                .chats?.data?.find(
                    (e) => e.receiveUserId === id || e.sendUserId === id
                );

            if (chat?.chatId) {
                if (media) {
                    const formData = new FormData();
                    formData.append("chatId", chat.chatId);

                    if (typeof media === "string") {
                        formData.append("MessageText", media);
                    } else if (media instanceof File) {
                        formData.append("file", media);
                    }

                    toast.success("Отправлено");
                    await sendMessage(formData);
                    console.log(formData);
                }

            } else {
                toast.error("Chat not found for this user");
            }

            setSearch("");
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    }

    let { t } = useTranslation()
    const [theme, setTheme] = useDarkSide();

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpenModalUsers((s) => !s)}
                aria-label="New message"
                className="cursor-pointer transition-colors duration-200"
            >
                <Send />
            </button>
            <div className={theme === "dark" ? "bg-[#232323] text-white" : "bg-white text-black"}>
                {openModalUsers && (
                    <section
                        style={{ backdropFilter: "blur(6px)" }}
                        className="fixed inset-0 z-20 flex items-center justify-center bg-[rgba(0,0,0,0.6)]"
                    >
                        <article className={theme === "dark"
                            ? "w-[600px] bg-[#232323] text-white rounded-2xl shadow-lg py-5 px-4"
                            : "w-[600px] bg-white text-black rounded-2xl shadow-lg py-5 px-4"
                        }>
                            <div className="relative border-b border-gray-200 pb-4 mb-3">
                                <p className="text-center font-semibold text-2xl">
                                    {t("exlpore.8")}
                                </p>
                                <button
                                    type="button"
                                    className="absolute right-5 top-2 text-gray-500 hover:text-red-500 transition-colors"
                                    onClick={() => setOpenModalUsers(false)}
                                >
                                    <X />
                                </button>

                                <div className="flex items-center gap-5 mt-4 border border-gray-300 rounded-lg px-3 py-2">
                                    <p className="text-[18px] font-semibold">{t("exlpore.6")}</p>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={t("exlpore.8")}
                                        className="outline-none flex-1 px-2 py-1 text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col overflow-y-auto h-[50vh] space-y-2">
                                <p className="pb-2 px-5 text-left font-semibold text-gray-700">
                                    Рекомендуемые
                                </p>

                                <div className="flex flex-col gap-1">
                                    {loadingChat ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <SkeletonRow key={i} />
                                        ))
                                    ) : search && search.trim() ? (
                                        filteredUsers.length > 0 ? (
                                            filteredUsers.map((u) => (
                                                <div
                                                    key={u.id}
                                                    className="hover:bg-gray-100 rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors duration-200"
                                                    onClick={() => handleCreateChat(u.id)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {u.avatar ? (
                                                            <Image
                                                                src={`http://37.27.29.18:8003/images/${u.avatar}`}
                                                                width={44}
                                                                height={44}
                                                                alt="avatar"
                                                                className="rounded-full object-cover w-12 h-12 border border-gray-300"
                                                                priority
                                                            />
                                                        ) : (
                                                            <User size={44} className="text-gray-400" />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {u.userName}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {u.fullName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {loadingCreateChat && idx == u.id && (
                                                        <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                Пользователи не найдены
                                            </div>
                                        )
                                    ) : (
                                        chats.data?.map((e) => (
                                            <div
                                                key={e.id}
                                                className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg cursor-pointer transition-colors duration-200"
                                                onClick={() =>
                                                    handleCreateChat(
                                                        e.receiveUserId === userId
                                                            ? e.sendUserId
                                                            : e.receiveUserId
                                                    )
                                                }
                                            >
                                                {(e.receiveUserId === userId
                                                    ? e.sendUserImage
                                                    : e.receiveUserImage) ? (
                                                    <Image
                                                        alt=""
                                                        src={`http://37.27.29.18:8003/images/${e.receiveUserId === userId
                                                            ? e.sendUserImage
                                                            : e.receiveUserImage
                                                            }`}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                        priority
                                                    />
                                                ) : (
                                                    <User size={40} className="text-gray-400" />
                                                )}

                                                <div className="font-medium text-gray-800">
                                                    {e.receiveUserId === userId
                                                        ? e.sendUserName
                                                        : e.receiveUserName}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </article>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ModalUsers;

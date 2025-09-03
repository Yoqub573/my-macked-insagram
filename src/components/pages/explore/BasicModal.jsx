"use client"
import { useEffect, useMemo, useState } from "react";
import { Skeleton, Stack } from "@mui/material";
import Image from "next/image";
import { Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDefaultChat } from "@/store/pages/chat/pages/default-chat/store";
import { useMyProfile } from "@/store/pages/chat/layout/store";
import { usegetUserStore } from "@/store/pages/search/store";
import { useUserId } from "@/hook/useUserId";

export default function BasicModal() {
  const router = useRouter();
  const userId = useUserId();

  const { get } = useDefaultChat();
  const { getMyProfil, createChat, loadingCreateChat } = useMyProfile();
  const { users, getUsers, getSearchHistories } = usegetUserStore();

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
        String(u.userName ?? "").toLowerCase().includes(q)
      );
      setFilteredUsers(results);
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, [search, allUsers]);

  async function handleCreateChat(id) {
    try {
      setIdx(id);
      await createChat(id);
      await get();

      const chat = useDefaultChat
        .getState()
        .chats?.data?.find(
          (e) => e.receiveUserId === id || e.sendUserId === id
        );

      if (chat?.chatId) {
        router.push(`/${id}`);
      }
      setSearch("");
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  }

  const SkeletonRow = () => (
    <Stack direction="row" spacing={2} alignItems="center" className="p-3">
      <Skeleton variant="circular" width={44} height={44} />
      <Stack spacing={0.5} flex={1}>
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="40%" height={12} />
      </Stack>
    </Stack>
  );

  return (
    <div className="relative bg-white">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        className="outline-none border w-full p-[10px] rounded fixed z-50 bg-white"
      />

      {/* Оверлей на весь экран */}
      {search && search.trim() && (
        <div className="fixed inset-0 pt-[50px] z-40 bg-white overflow-y-auto">
          <div className="p-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="hover:bg-[#eeeeee] rounded p-3 flex items-center justify-between cursor-pointer"
                  onClick={() => handleCreateChat(u.id)}
                >
                  <div className="flex items-center gap-5">
                    {u.avatar ? (
                      <Image
                        src={`http://37.27.29.18:8003/images/${u.avatar}`}
                        width={44}
                        height={44}
                        alt="avatar"
                        className="rounded-full object-cover w-12 h-12"
                        priority
                      />
                    ) : (
                      <User size={44} />
                    )}
                    <div>
                      <p>{u.userName}</p>
                      <p>{u.fullName}</p>
                    </div>
                  </div>
                  {loadingCreateChat && idx == u.id && (
                    <Loader2 className="animate-spin w-5 h-5" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Пользователи не найдены
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

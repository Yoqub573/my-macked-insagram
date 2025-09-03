import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CommentInput({ value2, onChange2 }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiData) => {
        onChange2({
            target: { value: value2 + emojiData.emoji }
        });
        setShowEmojiPicker(false);
    };
    let { t } = useTranslation()
    return (
        <div className=" flex w-[100%] gap-2 items-center">
            <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
                <Smile color="#ffffff" />
            </button>

            <input
                type="text"
                value={value2}
                onChange={onChange2}
                className="w-1/1 outline-none"
                placeholder={t("exlpore.7")}
            />

            {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
}

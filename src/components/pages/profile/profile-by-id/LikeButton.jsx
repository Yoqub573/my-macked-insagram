import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export const LikeButton = ({ isLiked, onToggle }) => {
    return (
        <motion.button
            onClick={onToggle}
            className="flex items-center justify-center"
            whileTap={{ scale: 0.8 }} // little shrink when pressed
        >
            <motion.div
                key={isLiked} // re-animate whenever `isLiked` changes
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
                <Heart
                    className="cursor-pointer"
                    fill={isLiked ? "red" : "white"}  // 🔴 like -> red, else white
                    stroke={isLiked ? "red" : "gray"} // ⚡ removed black border
                    size={28}
                />
            </motion.div>
        </motion.button>
    )
}

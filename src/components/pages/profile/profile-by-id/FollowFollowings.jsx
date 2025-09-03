"use client"
import { useUserId } from '@/hook/useUserId'
import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import { Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const FollowFollowings = ({ id }) => {
    const userId = useUserId()

    const { follow, unfollow, getFollowings, followings } = useProfileByIdStore()

    const [changeFollow, setChangeFollow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (userId) {
            getFollowings(userId)
        }
    }, [userId, getFollowings])

    useEffect(() => {
        if (followings?.data) {
            setChangeFollow(
                followings.data.some(e => e.userShortInfo.userId === id)
            )
        }
    }, [followings, id])

    async function handleFollow() {
        try {
            setIsLoading(true)
            if (changeFollow) {
                await unfollow(id)
                setChangeFollow(false)
            } else {
                await follow(id)
                setChangeFollow(true)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`${changeFollow ? "bg-[#F3F4F6]" : "bg-[#4a5df9] text-white"} py-[7px] px-4 rounded-lg`}
        >
            {isLoading ? (
                <Loader className="animate-spin w-4 h-4" />
            ) : changeFollow ? (
                "Unfollow"
            ) : (
                "Follow"
            )}
        </button>
    )
}

export default FollowFollowings

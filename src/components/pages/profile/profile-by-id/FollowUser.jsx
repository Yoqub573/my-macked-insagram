"use client"
import useDarkSide from '@/hook/useDarkSide'
import { useUserId } from '@/hook/useUserId'
import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FollowUser = () => {
    const userId = useUserId()
    const { 'profile-by-id': profileId } = useParams()
    const getProfileById = useProfileByIdStore(state => state.getProfileById)

    const { followers, follow, unfollow } = useProfileByIdStore()

    const [changeFollow, setChangeFollow] = useState(
        followers?.data?.some(e => e?.userShortInfo?.userId === userId) || false
    )

    let { t } = useTranslation()

    const [isLoading, setIsLoading] = useState(false)

    async function handleFollow() {
        try {
            setIsLoading(true)
            if (changeFollow) {
                await unfollow(profileId)
                setChangeFollow(false)
            }
            else {
                await follow(profileId)
                setChangeFollow(true)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (followers?.data) {
            setChangeFollow(
                followers.data.some(e => e?.userShortInfo?.userId === userId)
            )
        }
    }, [followers, userId])

    let [theme] = useDarkSide()

    useEffect(() => {
        if (profileId) {
            getProfileById(profileId)
        }
    }, [profileId, getProfileById])

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`${changeFollow ? theme == 'dark' ? "bg-[#25292e] text-white" : "bg-[#F3F4F6]" : "bg-[#4a5df9] text-white"} py-[6px] px-4 rounded-lg`}
        >
            {isLoading ? (
                <Loader className="animate-spin w-4 h-4" />
            ) : changeFollow ? (
                t('profileById.unfollow')
            ) : t('profileById.follow')
            }
        </button>
    )
}

export default FollowUser
'use client'
import * as React from 'react';
import { useEffect, useState } from 'react'
import { Search, User, XCircle, X, Loader2, Loader, Locate, LocationEdit, LocateIcon, MapPin, ArrowLeft } from 'lucide-react'
import { usegetUserStore } from '@/store/pages/search/store'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import { RxDotsVertical } from 'react-icons/rx'
import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
import { Button, Input, Modal } from 'antd';
import { Popover } from '@mui/material';
import useDarkSide from '@/hook/useDarkSide';
import MapImage from '../../../public/newYork.jpg';

const SidebarModal = () => {
    const [focused, setFocused] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const [focused2, setFocused2] = useState(false)
    const [search2, setSearch2] = useState('')
    const [filteredUsers2, setFilteredUsers2] = useState([])
    const [loading2, setLoading2] = useState(false)

    const [searchState, setSearchState] = useState(true)
    const [locationState, setLocationState] = useState(false)
    const [openMiniModal, setOpenMiniModal] = useState(false)
    let navigate = useRouter()

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleClick = (event, locId) => {
        setAnchorEl(event.currentTarget);
        setSelectedLocation(locId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedLocation(null);
    }

    const open = Boolean(anchorEl)

    let { users, getUsers, searchHistories, getSearchHistories, deleteUserHistory, addUserHistory, clearUserHistory, openModal, setOpenModal, location, getLocation, deleteLocation, editLocation, addLocation } = usegetUserStore()

    const SkeletonRow = () => (
        <Stack direction="row" spacing={2} alignItems="center" className="p-3">
            <Skeleton variant="circular" width={44} height={44} />
            <Stack spacing={0.5} flex={1}>
                <Skeleton variant="text" width="60%" height={14} />
                <Skeleton variant="text" width="40%" height={12} />
            </Stack>
        </Stack>
    )
    const [theme] = useDarkSide()

    function linkToProfile(id) {
        navigate.push(`/${id}`)
        setOpenModal(false)
    }

    let [addDialog, setaddDialog] = useState(null)
    let [addCity, setaddCity] = useState(null)
    let [addCountry, setaddCountry] = useState(null)
    let [addState, setaddState] = useState(null)
    let [addzipCode, setaddzipCode] = useState(null)

    let [editDialog, setEditDialog] = useState(null)
    let [editcity, setEditcity] = useState(null)
    let [editcountry, setEditcountry] = useState(null)
    let [editstate, setEditstate] = useState(null)
    let [editzipCode, setEditzipCode] = useState(null)
    let [idx, setidx] = useState(null)

    const [openMap, setOpenMap] = useState(false)

    function editModal(e) {
        setEditDialog(true)
        setidx(e.locationId)
        setEditcity(e.city)
        setEditstate(e.state)
        setEditzipCode(e.zipCode)
        setEditcountry(e.country)
    }

    async function updateLocation() {
        await editLocation({
            locationId: idx,
            city: editcity,
            state: editstate,
            zipCode: editzipCode,
            country: editcountry,
        })
        setEditDialog(false)
    }

    async function newLocation() {
        await addLocation({
            city: addCity,
            state: addState,
            zipCode: addzipCode,
            country: addCountry,
        })
        setaddDialog(false)
    }

    useEffect(() => {
        getUsers()
        getSearchHistories()
        getLocation()
    }, [])

    useEffect(() => {
        if (!search.trim()) {
            setFilteredUsers([])
            setLoading(false)
            return
        }

        setLoading(true)
        const delayDebounce = setTimeout(() => {
            const results = users?.data?.filter(u =>
                u.userName?.toLowerCase().includes(search.toLowerCase())
            ) || []
            setFilteredUsers(results)
            setLoading(false)
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [search, users])

    useEffect(() => {
        if (!search2.trim()) {
            setFilteredUsers2([])
            setLoading2(false)
            return
        }

        setLoading2(true)
        const delayDebounce = setTimeout(() => {
            const results = location?.data?.filter(u =>
                u.state?.toLowerCase().includes(search2.toLowerCase())
            ) || []
            setFilteredUsers2(results)
            setLoading2(false)
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [search2, location])


    return (
        <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed top-0 left-12 p-5 z-30 h-full w-[400px] ${theme == "dark" ? "bg-black" : "bg-[white]"} shadow-xl rounded-r-[16px]`}
        >
            <button
                onClick={() => setOpenModal(false)}
                className={`absolute cursor-pointer top-4 right-4 p-2 rounded-full ${theme == 'dark' ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
            >
                <X size={20} />
            </button>
            <h1 className="font-semibold text-[28px]">Search</h1>
            {searchState && (
                <>
                    <div className="relative mt-9">
                        {!focused && (
                            <Search size={18} className="absolute left-3 top-[25px] -translate-y-1/2 text-gray-500 pointer-events-none" />
                        )}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                            placeholder="Search"
                            className={`py-3 w-full rounded-lg ${theme == 'dark' ? "bg-[black] text-white" : "bg-[rgb(239,239,239)]"} pr-10 ${!focused ? 'pl-10' : 'pl-4'}`}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                        />
                        {loading ? (
                            <Loader className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin" size={18} />
                        ) : (
                            search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle size={18} />
                                </button>
                            )
                        )}
                        <div className="flex mt-4 items-center justify-between">
                            <button onClick={() => {
                                setSearchState(true)
                                setLocationState(false)
                            }} className={`${searchState ? "underline text-blue-600" : 'none'} font-semibold`}>Search</button>
                            <button onClick={() => {
                                setLocationState(true)
                                setSearchState(false)
                            }} className={`${locationState ? "underline text-blue-600" : 'none'} font-semibold`}>Location</button>
                        </div>
                    </div>
                    <hr className='my-5' />
                    <div className="py-7 flex justify-between items-center">
                        <p className='font-semibold'>Recent</p>
                        {!searchHistories?.data?.length <= 0 && (
                            <button onClick={clearUserHistory} className='font-medium hover:underline cursor-pointer text-[rgb(125,161,255)]'>Clear All</button>
                        )}
                    </div>
                    <div className="flex overflow-y-auto h-[400px] flex-col">
                        {!search ? (
                            searchHistories?.data?.length <= 0 && (
                                <p>No recent searches.</p>
                            )
                        ) : (null)}
                        {search ? (
                            loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(e => (
                                    <div onClick={() => addUserHistory(e.id)} key={e.id}>
                                        <div onClick={() => linkToProfile(e.id)} className={`flex ${theme == "dark" ? 'hover:bg-[#2a2a2a]' : "hover:bg-[#eeeeee] "} items-center rounded p-3 w-full gap-[10px]`}>
                                            <Image src={e.avatar ? `http://37.27.29.18:8003/images/${e.avatar}` : defaultUser} className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
                                            <div>
                                                <p>{e.userName}</p>
                                                <p>{e.fullName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-5">No users found with this name</p>
                            )
                        ) : (
                            searchHistories?.data?.map(e => (
                                <div key={e.id} className={`flex ${theme == "dark" ? 'hover:bg-[#2a2a2a]' : "hover:bg-[#eeeeee] "} items-center rounded p-3 w-full justify-between`}>
                                    <div onClick={() => linkToProfile(e?.users.id)} className='flex cursor-pointer items-center gap-5'>
                                        <Image src={e?.users?.avatar ? `http://37.27.29.18:8003/images/${e?.users?.avatar}` : defaultUser} className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
                                        <div>
                                            <p>{e?.users?.userName}</p>
                                            <p>{e?.users?.fullName}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteUserHistory(e.id)} className='cursor-pointer'>
                                        <X />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
            {openMap ? (
                <div>
                    <h1>Here lies map</h1>
                    <button onClick={() => setOpenMap(false)}>Go back</button>
                    <Image
                        width={100}
                        height={100}
                        src={MapImage}
                        alt='map image'
                        className='w-full h-full'
                    />
                </div>
            ) : (
                locationState && (
                    <>
                        <div className="relative mt-9">
                            {!focused2 && (
                                <Search size={18} className="absolute left-3 top-[25px] -translate-y-1/2 text-gray-500 pointer-events-none" />
                            )}
                            <input
                                type="text"
                                value={search2}
                                autoFocus
                                onChange={(e) => setSearch2(e.target.value)}
                                placeholder="Search"
                                className={`py-3 w-full rounded-lg ${theme == 'dark' ? "bg-[black] text-white" : "bg-[rgb(239,239,239)]"} pr-10 ${!focused2 ? 'pl-10' : 'pl-4'}`}
                                onFocus={() => setFocused2(true)}
                                onBlur={() => setFocused2(false)}
                            />
                            {loading2 ? (
                                <Loader className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin" size={18} />
                            ) : (
                                search2 && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch2('')}
                                        className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                )
                            )}
                            <div className="flex mt-4 items-center justify-between">
                                <button onClick={() => {
                                    setSearchState(true)
                                    setLocationState(false)
                                }} className={`${searchState ? "underline text-blue-600" : 'none'} font-semibold`}>Search</button>
                                <button onClick={() => {
                                    setLocationState(true)
                                    setSearchState(false)
                                }} className={`${locationState ? "underline text-blue-600" : 'none'} font-semibold`}>Location</button>
                            </div>
                        </div>
                        <hr className='my-5' />
                        <div className="flex overflow-y-auto h-[400px] flex-col">
                            <div className="">
                                <Button onClick={() => setaddDialog(true)}>Add New Map</Button>
                                <Modal
                                    open={addDialog}
                                    title="add"
                                    onCancel={() => setaddDialog(false)}
                                    onOk={newLocation}
                                >
                                    <Input placeholder='add city' value={addCity} onChange={(e) => setaddCity(e.target.value)} />
                                    <Input placeholder='add state' value={addState} onChange={(e) => setaddState(e.target.value)} />
                                    <Input placeholder='add ZipCode' value={addzipCode} onChange={(e) => setaddzipCode(e.target.value)} />
                                    <Input placeholder='add country' value={addCountry} onChange={(e) => setaddCountry(e.target.value)} />
                                </Modal>
                            </div>
                            {search2 ? (
                                loading2 ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : filteredUsers2?.length > 0 ? (
                                    filteredUsers2?.map(e => (
                                        <div className='flex items-center cursor-pointer hover:bg-[#eeeeee] rounded p-3 w-full gap-[10px]' key={e.locationId}>
                                            <div className="p-2 border-1 border-gray-300 rounded-full">
                                                <MapPin />
                                            </div>
                                            <div className="">
                                                <p className='font-semibold'>{e.state}</p>
                                                <p className='text-[gray] text-[14px]'>{e.city} , {e.country}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No results found</p>
                                )
                            ) : (
                                <div>
                                    {location?.data?.map((e) => (
                                        <div
                                            className={`flex ${theme == "dark" ? 'hover:bg-[#2a2a2a]' : "hover:bg-[#eeeeee] "} items-center rounded p-3 w-full justify-between`}
                                            key={e.locationId}
                                        >
                                            <div onClick={() => setOpenMap(!openMap)} className="flex items-center cursor-pointer gap-[10px]">
                                                <div className="p-2 border-1 border-gray-300 rounded-full">
                                                    <MapPin />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{e.state}</p>
                                                    <p className="text-[gray] text-[14px]">
                                                        {e.city}, {e.country}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                className="cursor-pointer"
                                                onClick={(eBtn) => handleClick(eBtn, e.locationId)}
                                            >
                                                <RxDotsVertical />
                                            </button>
                                            <Popover
                                                open={open}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: "bottom",
                                                    horizontal: "right",
                                                }}
                                                transformOrigin={{
                                                    vertical: "top",
                                                    horizontal: "left",
                                                }}
                                            >
                                                <Box sx={{ p: 2 }}>
                                                    <Button
                                                        type="primary"
                                                        danger
                                                        onClick={() => {
                                                            deleteLocation(selectedLocation);
                                                            handleClose();
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => {
                                                            editModal(e)
                                                            setOpenMiniModal(false)
                                                        }}
                                                    >Edit</Button>
                                                </Box>
                                            </Popover>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Modal
                                open={editDialog}
                                title="edit"
                                onCancel={() => setEditDialog(false)}
                                onOk={updateLocation}
                            >
                                <Input placeholder='edit city' value={editcity} onChange={(e) => setEditcity(e.target.value)} />
                                <Input placeholder='edit state' value={editstate} onChange={(e) => setEditstate(e.target.value)} />
                                <Input placeholder='edit ZipCode' value={editzipCode} onChange={(e) => setEditzipCode(e.target.value)} />
                                <Input placeholder='edit country' value={editcountry} onChange={(e) => setEditcountry(e.target.value)} />
                            </Modal>
                        </div>
                    </>
                )
            )}
        </motion.div >
    )
}

export default SidebarModal

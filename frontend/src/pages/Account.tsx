import { useNavigate } from "react-router-dom"
import { useAppContext } from "../zustand/AppContext"
import { FaUser, FaEnvelope, FaBriefcase, FaSignOutAlt, FaArrowLeft, FaEdit, FaMapMarkerAlt, FaBox } from "react-icons/fa"
import toast from "react-hot-toast"

const Account = () => {
    const user = useAppContext((state) => state.user)
    const clearUser = useAppContext((state) => state.clearUser)
    const navigate = useNavigate()
    
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    const firstLetter = user.name.charAt(0).toUpperCase()

    const handleLogout = () => {
        localStorage.removeItem('token')
        clearUser()
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                    <FaArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Profile Card */}
                <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-lg shadow-amber-100 backdrop-blur-sm sm:p-6">
                    {/* Header */}
                    <div className="mb-5 flex items-start justify-between gap-3">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                My Account
                            </p>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                                Profile Settings
                            </h1>
                        </div>
                        <button
                            type="button"
                            className="rounded-full border border-amber-200 bg-amber-50 p-2 text-amber-600 transition hover:border-amber-300 hover:bg-amber-100"
                            title="Edit profile"
                        >
                            <FaEdit className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Avatar & Name Section */}
                    <div className="mb-5 flex flex-col items-center gap-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl font-bold text-white shadow-md shadow-amber-200">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                firstLetter
                            )}
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                            <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-3 mb-5">
                        {/* Name */}
                        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-amber-200 hover:bg-amber-50/50">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
                                <FaUser className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Full Name
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900 break-words">
                                    {user.name}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-amber-200 hover:bg-amber-50/50">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
                                <FaEnvelope className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Email Address
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-gray-900 break-words">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-amber-200 hover:bg-amber-50/50">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
                                <FaBriefcase className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Account Type
                                </p>
                                <p className="mt-0.5 text-sm font-semibold capitalize text-gray-900">
                                    {user.role}
                                </p>
                            </div>
                        </div>

                        {/* User ID */}
                        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-amber-200 hover:bg-amber-50/50">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
                                <FaUser className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    User ID
                                </p>
                                <p className="mt-0.5 font-mono text-xs text-gray-700 break-all">
                                    {user._id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="mb-5 border-t border-gray-200 pt-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                            My Account
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Addresses */}
                            <button
                                onClick={() => navigate('/addresses')}
                                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-amber-200 hover:bg-amber-50/50"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
                                    <FaMapMarkerAlt className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-900">Addresses</p>
                                    <p className="text-xs text-gray-500">Manage your addresses</p>
                                </div>
                            </button>

                            {/* Orders */}
                            <button
                                onClick={() => navigate('/orders')}
                                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-amber-200 hover:bg-amber-50/50"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
                                    <FaBox className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-900">Orders</p>
                                    <p className="text-xs text-gray-500">View your orders</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                        >
                            Continue Shopping
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                        >
                            <FaSignOutAlt className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
                            
        
            </div>
        </div>
    )
}

export default Account
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { FaUserCircle, FaSignOutAlt, FaSearch, FaUtensils } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAppContext } from '../zustand/AppContext'

const Navbar = () => {
  const isAuth = useAppContext((state) => state.isAuth)
  const isLoadingLocation = useAppContext((state) => state.isLoadingLocation)
  const city = useAppContext((state) => state.city)
  const clearUser = useAppContext((state) => state.clearUser)
  const currentLocation = useLocation()
  const isHomePage = currentLocation.pathname === '/'
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      // Use replace to avoid pushing a new history entry on every search change
      setSearchParams(search ? { search } : {}, { replace: true })
    }, 500)

    return () => clearTimeout(timer)
  }, [search, setSearchParams])


  useEffect(()=>{
    if(!navigator.geolocation) return alert("Geolocation is not supported by your browser. Please allow location access for better experience.")
    useAppContext.setState({ isLoadingLocation: true })
    navigator.geolocation.getCurrentPosition(async (position)=>{
        const {latitude,longitude}=position.coords
        try{
          const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en&email=support@zomato.com`)
          const data=await res.json()
          useAppContext.setState({ location: {
            latitude,
            longitude,
            formattedAddress:data.display_name || "Current Location"
          }
          , isLoadingLocation: false })
          useAppContext.setState({ city: data.address?.city || data.address?.town || data.address?.village || "Current Location" })
        }
        catch(err:any){
          useAppContext.setState({ location: {
            latitude,
            longitude,
            formattedAddress:"Current Location"
          },
          isLoadingLocation: false })
          useAppContext.setState({ city: "Current Location" })
          console.log(err);
        }
    },(err)=>{
        console.log(err);
        useAppContext.setState({ isLoadingLocation: false })
    })
  },[])

  const handleLogout = () => {
    localStorage.removeItem('token')
    clearUser()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (!isAuth || !isHomePage) return null

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/" className="group flex items-center gap-3 self-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-lg shadow-amber-200 transition-transform group-hover:scale-105">
              <FaUtensils className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-gray-900">Zomato</div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber-600">
                Fresh meals, faster
              </div>
            </div>
          </Link>

          <div className="flex flex-1 items-center justify-center lg:px-8">
            <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm transition focus-within:border-amber-300 focus-within:bg-white">
              <FaSearch className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants, dishes, or cuisine..."
                className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              {city && (
                <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 sm:inline-flex">
                  {city}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
            >
              <FaUserCircle className="h-4 w-4" />
              Account
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <FaSignOutAlt className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
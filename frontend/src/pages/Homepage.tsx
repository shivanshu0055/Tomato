import { useEffect, useState } from 'react'
import { useAppContext } from '../zustand/AppContext'
import { useSearchParams } from 'react-router-dom'
import type { IRestaurant } from '../types'
import { RESTAURANT_BACKEND_URL } from '../main'
import axios from 'axios'
import toast from 'react-hot-toast'
import RestaurantCard from '../components/RestaurantCard.tsx'

const Homepage = () => {
  const location = useAppContext((state) => state.location)
  const [searchParams]=useSearchParams()

  const search = searchParams.get('search') || undefined

  const [restaurants, setRestaurants] = useState<(IRestaurant & { distanceKm?: number })[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRestaurants = async () => {
    if (!location) {
      return
    }

    try {
      setLoading(true)
      const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/restaurant/all`, {
        params: {
          latitude:location.latitude,
          longitude:location.longitude,
          search,
          radius: 5000,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = res.data
      if (!data.success) throw new Error(data.message || 'Failed to fetch restaurants')
      setRestaurants(data.restaurants ?? [])
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch restaurants')
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchRestaurants()
  }, [location, search])

  // Cart fetching handled elsewhere; no-op here to avoid missing context property

  if (loading || !location) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 text-sm text-gray-600">
        Loading nearby restaurants...
      </div>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-4xl bg-linear-to-br from-amber-50 via-white to-orange-100 px-6 py-8 shadow-sm ring-1 ring-amber-100 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Nearby restaurants</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Restaurants within 5 km of your location
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              We only show verified restaurants near {location.formattedAddress}. Results are sorted by availability and distance.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200">
            {restaurants.length} place{restaurants.length === 1 ? '' : 's'} found
          </div>
        </div>
      </section>

      {restaurants.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-gray-600">
          No restaurants were found within 5 km for this search.
        </div>
      ) : (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </section>
      )}
    </main>
  )
}

export default Homepage
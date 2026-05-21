import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaUtensils } from 'react-icons/fa'
import { RESTAURANT_BACKEND_URL } from '../../main'
import type { IMenuItem, IRestaurant } from '../../types'
import { useAppContext } from '../../zustand/AppContext'

const RestaurantDetails = () => {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null)
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [menuLoading, setMenuLoading] = useState(false)
  const [addingItemId, setAddingItemId] = useState<string | null>(null)
  const navigate = useNavigate()
  const fetchCart = useAppContext((s) => s.fetchCart)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const loadRestaurant = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/restaurant/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setRestaurant(res.data?.restaurant ?? null)
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load restaurant')
        setRestaurant(null)
      } finally {
        setLoading(false)
      }
    }

    loadRestaurant()
  }, [id])

  useEffect(() => {
    if (!id || !restaurant) {
      return
    }

    const loadMenuItems = async () => {
      setMenuLoading(true)
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/menu-items/all/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setMenuItems(res.data?.items ?? [])
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load menu items')
      } finally {
        setMenuLoading(false)
      }
    }

    void loadMenuItems()
  }, [id, restaurant])

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 text-sm text-gray-600">
        Loading restaurant details...
      </main>
    )
  }

  if (!restaurant) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
          <p className="mt-2 text-sm text-gray-600">The restaurant you selected is no longer available.</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-amber-200 hover:text-amber-700"
      >
        <FaArrowLeft className="h-4 w-4" />
        Back to restaurants
      </Link>

      <section className="mt-6 overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-sm">
        <div className="grid items-stretch lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative h-72 sm:h-96 lg:h-96 bg-gray-100 overflow-hidden">
            {restaurant.image ? (
              <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500">No image available</div>
            )}
          </div>

          <div className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Restaurant profile</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{restaurant.name}</h1>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {restaurant.description || 'A nearby restaurant with fresh food and convenient service.'}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <FaPhoneAlt className="h-4 w-4 text-amber-600" />
                  Phone
                </div>
                <div className="mt-2">{restaurant.phone}</div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <FaMapMarkerAlt className="h-4 w-4 text-amber-600" />
                  Address
                </div>
                <div className="mt-2">{restaurant.autoLocation?.formattedAddress || 'No address saved'}</div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <FaClock className="h-4 w-4 text-amber-600" />
                  Status
                </div>
                <div className="mt-2">{restaurant.isOpen ? 'Open now' : 'Currently closed'}</div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <FaUtensils className="h-4 w-4 text-amber-600" />
                  Verified
                </div>
                <div className="mt-2">{restaurant.isVerified ? 'Yes' : 'Pending'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Menu</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Available dishes</h2>
          </div>
          <div className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
            {menuItems.length} item{menuItems.length === 1 ? '' : 's'}
          </div>
        </div>

        {menuLoading ? (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            Loading menu items...
          </div>
        ) : menuItems.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-600">
            No menu items are available for this restaurant yet.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <article key={item._id} className="h-80 flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="h-40 bg-gray-100 shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                      No image available
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold tracking-tight text-gray-900">{item.name}</h3>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="line-clamp-3 mt-2 text-sm text-gray-600">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={[
                        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                        item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700',
                      ].join(' ')}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!item.isAvailable) return
                          const token = localStorage.getItem('token')
                          if (!token) {
                            navigate('/login')
                            return
                          }
                          setAddingItemId(item._id)
                          try {
                            const res = await axios.post(
                              `${RESTAURANT_BACKEND_URL}/api/cart/add`,
                              { restaurantId: restaurant._id, itemId: item._id },
                              { headers: { Authorization: `Bearer ${token}` } }
                            )
                            toast.success(res.data?.message || 'Added to cart')
                            await fetchCart()
                          } catch (err: any) {
                            toast.error(err?.response?.data?.message || 'Failed to add to cart')
                            console.log(err)
                          } finally {
                            setAddingItemId(null)
                          }
                        }}
                        disabled={!item.isAvailable || addingItemId === item._id}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {addingItemId === item._id ? 'Adding...' : 'Add to cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default RestaurantDetails
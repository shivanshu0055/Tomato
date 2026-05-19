import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEdit, FaStore, FaUtensils, FaPlusCircle, FaListUl, FaCamera, FaChartLine } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { RESTAURANT_BACKEND_URL } from '../../main'
import { useAppContext } from '../../zustand/AppContext'
import type { IRestaurant, RestaurantLayoutContext } from '../../types'

const Restaurant = () => {
  const user = useAppContext((state) => state.user)
  const fetchUser = useAppContext((state) => state.fetchUser)
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [savingRestaurant, setSavingRestaurant] = useState(false)
  const [togglingOpen, setTogglingOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    phone: '',
  })
  
  const [editImage, setEditImage] = useState<File | null>(null)
  const navigate = useNavigate()

  const refreshRestaurant = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    setLoading(true)
    try {
      const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/restaurant/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const nextRestaurant = res.data?.restaurant ?? null
      setRestaurant(nextRestaurant)

      if (!nextRestaurant) {
        navigate('/restaurant/add', { replace: true })
        return
      }

      const nextToken = res.data?.token
      if (nextToken) {
        localStorage.setItem('token', nextToken)
        await fetchUser(nextToken)
      }
    } catch (err: any) {
      const status = err?.response?.status
      const message = err?.response?.data?.message || 'Failed to load restaurant'

      if (status === 404 || status === 400) {
        navigate('/restaurant/add', { replace: true })
        return
      }

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return

    if (user.role !== 'seller') {
      navigate('/', { replace: true })
      return
    }

    void refreshRestaurant()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate])

  useEffect(() => {
    if (!restaurant) return

    setEditForm({
      name: restaurant.name || '',
      description: restaurant.description || '',
      phone: restaurant.phone || '',
    })
  }, [restaurant])

  const restaurantSnapshot = useMemo(
    () => ({
      name: restaurant?.name || '',
      description: restaurant?.description || '',
      phone: restaurant?.phone || '',
    }),
    [restaurant?.description, restaurant?.name, restaurant?.phone]
  )

  const openEditModal = () => {
    setEditImage(null)
    setEditForm(restaurantSnapshot)
    setEditOpen(true)
  }

  const closeEditModal = () => {
    if (savingRestaurant) return
    setEditOpen(false)
    setEditImage(null)
    setEditForm(restaurantSnapshot)
  }

  const handleToggleIsOpen = async () => {
    const token = localStorage.getItem('token')
    if (!token || !restaurant) {
      return
    }

    setTogglingOpen(true)
    try {
      const res = await axios.patch(
        `${RESTAURANT_BACKEND_URL}/api/restaurant/toggleIsOpen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const updatedRestaurant = res.data?.restaurant ?? null
      if (updatedRestaurant) {
        setRestaurant(updatedRestaurant)
      } else {
        setRestaurant((current) => (current ? { ...current, isOpen: !current.isOpen } : current))
      }

      toast.success(res.data?.message || 'Restaurant status updated')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update restaurant status')
    } finally {
      setTogglingOpen(false)
    }
  }

  const handleEditChange =
    (key: keyof typeof editForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditForm((current) => ({ ...current, [key]: event.target.value }))
    }

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    if (!restaurant) {
      toast.error('Restaurant not loaded')
      return
    }

    if (!editImage) {
      toast.error('Please choose a new restaurant image')
      return
    }

    setSavingRestaurant(true)
    try {
      const payload = new FormData()
      payload.append('name', editForm.name)
      payload.append('description', editForm.description)
      payload.append('phone', editForm.phone)
      payload.append('file', editImage)

      await axios.put(`${RESTAURANT_BACKEND_URL}/api/restaurant/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Restaurant updated successfully')
      setEditOpen(false)
      setEditImage(null)
      await refreshRestaurant()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update restaurant')
    } finally {
      setSavingRestaurant(false)
    }
  }

  if (!user || user.role !== 'seller') {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div
        className="min-h-screen px-4 py-10"
        style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #ffedd5 100%)' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-3xl border border-amber-100 bg-white/80 px-6 py-20 text-gray-600 shadow-xl shadow-amber-100 backdrop-blur-sm">
          Loading restaurant profile...
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return null
  }

  const contextValue: RestaurantLayoutContext = {
    restaurant,
    refreshRestaurant,
  }

  return (
    <div
      className="min-h-screen text-gray-900"
      style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #ffedd5 100%)' }}
    >
      <section className="border-b border-amber-100/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div
            className="overflow-hidden rounded-4xl border border-amber-100 p-5 text-white shadow-2xl shadow-amber-100 sm:p-7"
            style={{ background: 'linear-gradient(135deg, #1f1a17 0%, #2a221d 55%, #3a2b20 100%)' }}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-black/20 sm:h-28 sm:w-28">
                  {restaurant.image ? (
                    <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-3xl text-amber-200">
                      <FaStore />
                    </div>
                  )}
                </div>

                <div className="max-w-2xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                    Restaurant profile
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{restaurant.name}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                    {restaurant.description || 'Restaurant profile, menu, and item management live here.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-white/75">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{restaurant.phone}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 capitalize">
                      {restaurant.isOpen ? 'Open now' : 'Temporarily closed'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      {restaurant.isVerified ? 'Verified' : 'Pending verification'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <FaEdit className="h-4 w-4" />
                Edit profile
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleIsOpen}
                disabled={togglingOpen}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-current" />
                {togglingOpen
                  ? 'Updating status...'
                  : restaurant.isOpen
                    ? 'Close restaurant'
                    : 'Open restaurant'}
              </button>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                {restaurant.isOpen ? 'Open now' : 'Currently closed'}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-amber-100 bg-white/90 p-2 shadow-sm shadow-amber-50">
            <NavLink
              end
              to="/restaurant"
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
                  isActive ? 'bg-amber-600 text-white shadow-md shadow-amber-200' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700',
                ].join(' ')
              }
            >
              <FaListUl className="h-4 w-4" />
              Overview
            </NavLink>
            <NavLink
              to="/restaurant/menu"
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
                  isActive ? 'bg-amber-600 text-white shadow-md shadow-amber-200' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700',
                ].join(' ')
              }
            >
              <FaUtensils className="h-4 w-4" />
              Menu
            </NavLink>
            <NavLink
              to="/restaurant/add-item"
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
                  isActive ? 'bg-amber-600 text-white shadow-md shadow-amber-200' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700',
                ].join(' ')
              }
            >
              <FaPlusCircle className="h-4 w-4" />
              Add item
            </NavLink>
            <NavLink
              to="/restaurant/sales"
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
                  isActive ? 'bg-amber-600 text-white shadow-md shadow-amber-200' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700',
                ].join(' ')
              }
            >
              <FaChartLine className="h-4 w-4" />
              Sales
            </NavLink>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet context={contextValue} />
      </main>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-2xl shadow-black/20">
            <div className="border-b border-amber-100 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Edit profile</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Update restaurant details</h2>
            </div>

            <form onSubmit={handleEditSubmit} className="grid gap-5 px-6 py-6">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-gray-700">Name</span>
                <input
                  required
                  value={editForm.name}
                  onChange={handleEditChange('name')}
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-300 focus:bg-white"
                  placeholder="Restaurant name"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-gray-700">Description</span>
                <textarea
                  value={editForm.description}
                  onChange={handleEditChange('description')}
                  rows={4}
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-300 focus:bg-white"
                  placeholder="Short restaurant description"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-gray-700">Phone number</span>
                <input
                  required
                  value={editForm.phone}
                  onChange={handleEditChange('phone')}
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-300 focus:bg-white"
                  placeholder="Restaurant contact number"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-gray-700">New image</span>
                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaCamera className="h-5 w-5 text-amber-600" />
                    <span>{editImage ? editImage.name : 'Choose a new cover image'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setEditImage(event.target.files?.[0] || null)}
                    className="text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-amber-700"
                  />
                </div>
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRestaurant}
                  className="rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingRestaurant ? 'Updating...' : 'Update restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Restaurant

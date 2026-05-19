import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCamera, FaMapMarkerAlt, FaPhone, FaUtensils } from 'react-icons/fa'
import { RESTAURANT_BACKEND_URL } from '../../main'
import { useAppContext } from '../../zustand/AppContext'

const RestaurantAdd = () => {
  const user = useAppContext((state) => state.user)
  const currentLocation = useAppContext((state) => state.location)
  const [submitting, setSubmitting] = useState(false)
  const [resolvingLocation, setResolvingLocation] = useState(true)
  const [locationError, setLocationError] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    latitude: '',
    longitude: '',
    formattedAddress: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role && user.role !== 'seller') {
      navigate('/', { replace: true })
    }
  }, [navigate, user?.role])

  useEffect(() => {
    let cancelled = false

    const applyLocation = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en&email=support@zomato.com`
        )
        const data = await response.json()

        if (cancelled) return

        setForm((current) => ({
          ...current,
          latitude: String(latitude),
          longitude: String(longitude),
          formattedAddress: data.display_name || 'Current location',
        }))
      } catch {
        if (cancelled) return

        setForm((current) => ({
          ...current,
          latitude: String(latitude),
          longitude: String(longitude),
          formattedAddress: 'Current location',
        }))
      } finally {
        if (!cancelled) {
          setResolvingLocation(false)
        }
      }
    }

    // If the app store already has a resolved location from Nominatim, use it
    if (currentLocation?.latitude && currentLocation?.longitude) {
      if (currentLocation.formattedAddress) {
        setForm((current) => ({
          ...current,
          latitude: String(currentLocation.latitude),
          longitude: String(currentLocation.longitude),
          formattedAddress: currentLocation.formattedAddress,
        }))
        setResolvingLocation(false)
        return () => {
          cancelled = true
        }
      }

      // otherwise fall back to resolving via reverse geocoding
      void applyLocation(currentLocation.latitude, currentLocation.longitude)
      
      return () => {
        cancelled = true
      }
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser')
      setResolvingLocation(false)
      return () => {
        cancelled = true
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void applyLocation(position.coords.latitude, position.coords.longitude)
      },
      () => {
        if (cancelled) return

        setLocationError('Allow location access to create the restaurant')
        setResolvingLocation(false)
      }
    )

    return () => {
      cancelled = true
    }
  }, [currentLocation?.latitude, currentLocation?.longitude, currentLocation?.formattedAddress])

  if (!user || user.role !== 'seller') {
    return <Navigate to="/" replace />
  }

  const handleChange = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    if (!image) {
      toast.error('Please upload a restaurant image')
      return
    }

    if (!form.latitude || !form.longitude || !form.formattedAddress) {
      toast.error('Restaurant location is still being resolved')
      return
    }

    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('name', form.name)
      payload.append('description', form.description)
      payload.append('phone', form.phone)
      payload.append('latitude', form.latitude)
      payload.append('longitude', form.longitude)
      payload.append('formattedAddress', form.formattedAddress)
      payload.append('file', image)

      await axios.post(`${RESTAURANT_BACKEND_URL}/api/restaurant/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Restaurant created successfully')
      navigate('/restaurant', { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create restaurant')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #ffedd5 100%)' }}
    >
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate('/restaurant')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-50"
        >
          <FaArrowLeft className="h-4 w-4" />
          Back to restaurant
        </button>

        <div className="overflow-hidden rounded-4xl border border-amber-100 bg-white/90 shadow-xl shadow-amber-100 backdrop-blur-sm">
          <div
            className="border-b border-amber-100 px-6 py-8 text-white sm:px-8"
            style={{ background: 'linear-gradient(90deg, #d97706 0%, #f97316 100%)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Create restaurant</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Add your restaurant profile</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
              Set up the restaurant details once and the dashboard will bring you back here whenever you need to manage it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 p-6 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-gray-700">Restaurant name</span>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-amber-300 focus-within:bg-white">
                  <FaUtensils className="h-4 w-4 text-amber-600" />
                  <input
                    required
                    value={form.name}
                    onChange={handleChange('name')}
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder="Your restaurant name"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-gray-700">Phone number</span>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-amber-300 focus-within:bg-white">
                  <FaPhone className="h-4 w-4 text-amber-600" />
                  <input
                    required
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder="Restaurant contact number"
                  />
                </div>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-gray-700">Description</span>
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                rows={4}
                className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-300 focus:bg-white"
                placeholder="A short story about your restaurant and cuisine"
              />
            </label>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <FaMapMarkerAlt className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Restaurant location</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {resolvingLocation
                      ? 'Resolving your current location automatically...'
                      : locationError || form.formattedAddress || 'Location resolved from your browser'}
                  </p>
                  {!!form.latitude && !!form.longitude && !resolvingLocation && !locationError && (
                    <p className="mt-2 text-xs text-gray-500">
                      Coordinates: {form.latitude}, {form.longitude}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <input type="hidden" value={form.latitude} readOnly />
            <input type="hidden" value={form.longitude} readOnly />
            <input type="hidden" value={form.formattedAddress} readOnly />

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-gray-700">Restaurant image</span>
              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaCamera className="h-5 w-5 text-amber-600" />
                  <span>{image ? image.name : 'Upload a cover photo for your restaurant'}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImage(event.target.files?.[0] || null)}
                  className="text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:bg-amber-700"
                />
              </div>
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate('/restaurant')}
                className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || resolvingLocation}
                className="rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Creating restaurant...' : resolvingLocation ? 'Resolving location...' : 'Create restaurant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RestaurantAdd

import { useOutletContext } from 'react-router-dom'
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaStar } from 'react-icons/fa'
import type { RestaurantLayoutContext } from '../../types'

const RestaurantOverview = () => {
  const { restaurant } = useOutletContext<RestaurantLayoutContext>()

  if (!restaurant) {
    return null
  }

  const metaRows = [
    {
      label: 'Phone',
      value: restaurant.phone,
      icon: FaPhoneAlt,
    },
    {
      label: 'Address',
      value: restaurant.autoLocation?.formattedAddress || 'No address saved',
      icon: FaMapMarkerAlt,
    },
    {
      label: 'Status',
      value: restaurant.isOpen ? 'Open' : 'Closed',
      icon: FaClock,
    },
    {
      label: 'Verification',
      value: restaurant.isVerified ? 'Verified' : 'Pending review',
      icon: FaCheckCircle,
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Overview</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Restaurant summary</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <FaStar className="h-4 w-4" />
            Live dashboard
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {metaRows.map((row) => {
            const Icon = row.icon
            return (
              <div key={row.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{row.label}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{row.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <aside className="grid gap-4">
        <div className="rounded-3xl border border-amber-100 bg-linear-to-br from-[#1f1a17] to-[#34261d] p-6 text-white shadow-lg shadow-amber-100">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Restaurant card</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight">{restaurant.name}</h3>
          <p className="mt-3 text-sm leading-6 text-white/75">
            {restaurant.description || 'Use this area for quick access to restaurant insights, actions, and staffing.'}
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Restaurant ID</span>
              <span className="font-mono text-xs">{restaurant._id}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-50">
          <p className="text-sm font-semibold text-gray-900">Quick stats</p>
          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-sm">
              <span className="text-gray-600">Image</span>
              <span className="font-semibold text-amber-700">{restaurant.image ? 'Uploaded' : 'Missing'}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-sm">
              <span className="text-gray-600">Open status</span>
              <span className="font-semibold text-amber-700">{restaurant.isOpen ? 'Open' : 'Closed'}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default RestaurantOverview

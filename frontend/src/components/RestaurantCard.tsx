import { Link } from 'react-router-dom'
import type { IRestaurant } from '../types'

export type NearbyRestaurant = IRestaurant & {
  distanceKm?: number
}

type RestaurantCardProps = {
  restaurant: NearbyRestaurant
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-48 w-full bg-gray-100">
        {restaurant.image ? (
          <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
            No image available
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
          {typeof restaurant.distanceKm === 'number' ? `${restaurant.distanceKm.toFixed(2)} km away` : 'Nearby'}
        </div>

        <div
          className={[
            'absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
            restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700',
          ].join(' ')}
        >
          {restaurant.isOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">{restaurant.name}</h2>
            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {restaurant.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {restaurant.description || 'Fresh food, fast delivery, and a great dining experience nearby.'}
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center justify-between gap-3">
            <span>Phone</span>
            <span className="font-medium text-gray-900">{restaurant.phone}</span>
          </p>
          <p className="flex items-start justify-between gap-3">
            <span>Address</span>
            <span className="max-w-[14rem] text-right font-medium text-gray-900">
              {restaurant.autoLocation?.formattedAddress || 'No address saved'}
            </span>
          </p>
        </div>

        <div className="inline-flex items-center justify-between gap-2 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition group-hover:bg-amber-50 group-hover:text-amber-700">
          View restaurant
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard
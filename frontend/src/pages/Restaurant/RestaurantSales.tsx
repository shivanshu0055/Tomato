import { useOutletContext } from 'react-router-dom'
import { FaChartLine, FaDollarSign, FaShoppingBag, FaUtensils } from 'react-icons/fa'
import type { RestaurantLayoutContext } from '../../types'

const RestaurantSales = () => {
  const { restaurant } = useOutletContext<RestaurantLayoutContext>()

  if (!restaurant) {
    return null
  }

  const salesCards = [
    {
      label: 'Today\'s revenue',
      value: '$1,280',
      note: 'Based on current orders',
      icon: FaDollarSign,
    },
    {
      label: 'Orders',
      value: '84',
      note: 'Placed in the last 24 hours',
      icon: FaShoppingBag,
    },
    {
      label: 'Popular items',
      value: '12',
      note: 'Items contributing to sales',
      icon: FaUtensils,
    },
  ]

  const topItems = [
    { name: 'Chicken Biryani', sold: 26, revenue: '$390' },
    { name: 'Paneer Tikka', sold: 19, revenue: '$228' },
    { name: 'Masala Fries', sold: 15, revenue: '$120' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Sales</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Restaurant sales dashboard</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <FaChartLine className="h-4 w-4" />
            Live summary
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {salesCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{card.label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="mt-1 text-sm text-gray-600">{card.note}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Top selling items</p>
              <p className="mt-1 text-sm text-gray-600">Best performing menu items for {restaurant.name}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              +18% this week
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {topItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {index + 1}. {item.name}
                  </p>
                  <p className="text-xs text-gray-600">{item.sold} orders sold</p>
                </div>
                <p className="text-sm font-semibold text-amber-700">{item.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="grid gap-4">
        <div className="rounded-3xl border border-amber-100 bg-linear-to-br from-[#1f1a17] to-[#34261d] p-6 text-white shadow-lg shadow-amber-100">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Restaurant</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight">{restaurant.name}</h3>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Use this page to monitor revenue trends, item performance, and order volume.
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Sales overview</span>
              <span className="font-semibold text-amber-300">Updated now</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-50">
          <p className="text-sm font-semibold text-gray-900">Insights</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">Peak hour</p>
              <p className="text-xs text-gray-600">7:00 PM - 9:00 PM</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">Average order value</p>
              <p className="text-xs text-gray-600">$15.20</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">Conversion rate</p>
              <p className="text-xs text-gray-600">4.8%</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default RestaurantSales
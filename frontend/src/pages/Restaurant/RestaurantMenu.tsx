import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FaListUl } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import MenuItems from '../../components/MenuItems'
import { RESTAURANT_BACKEND_URL } from '../../main'
import type { IMenuItem, RestaurantLayoutContext } from '../../types'

const RestaurantMenu = () => {
  const { restaurant } = useOutletContext<RestaurantLayoutContext>()
  const [items, setItems] = useState<IMenuItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    if (!restaurant?._id) return

    const token = localStorage.getItem('token')
    if (!token) {
      setLoadingItems(false)
      return
    }

    const loadItems = async () => {
      setLoadingItems(true)
      try {
        const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/menu-items/all/${restaurant._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setItems(res.data?.items ?? [])
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load menu items')
      } finally {
        setLoadingItems(false)
      }
    }

    void loadItems()
  }, [restaurant?._id])

  if (!restaurant) {
    return null
  }

  return (
    <section className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Menu</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Manage menu items</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
          <FaListUl className="h-4 w-4" />
          Menu view
        </div>
      </div>

      <div className="mt-6">
        {loadingItems ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">Loading menu items...</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No items connected yet</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Go to Add item and create dishes. They will show here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <MenuItems key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default RestaurantMenu

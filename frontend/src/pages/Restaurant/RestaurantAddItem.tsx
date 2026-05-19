import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FaPlusCircle } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import AddMenuItems from '../../components/AddMenuItems'
import { RESTAURANT_BACKEND_URL } from '../../main'
import type { IMenuItem, RestaurantLayoutContext } from '../../types'

const RestaurantAddItem = () => {
  const { restaurant } = useOutletContext<RestaurantLayoutContext>()
  const [openAddModal, setOpenAddModal] = useState(false)
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

  const handleItemAdded = (item: IMenuItem) => {
    setItems((current) => [item, ...current])
  }

  if (!restaurant) {
    return null
  }

  return (
    <section className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Add item</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Create a new dish</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpenAddModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          <FaPlusCircle className="h-4 w-4" />
          New item
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {loadingItems ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">Loading menu items...</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No menu items yet</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Click New item to open the modal and add your first dish.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-gray-900">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-amber-700">Rs {Number(item.price).toFixed(2)}</p>
                  <span
                    className={[
                      'mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700',
                    ].join(' ')}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddMenuItems isOpen={openAddModal} onClose={() => setOpenAddModal(false)} onItemAdded={handleItemAdded} />
    </section>
  )
}

export default RestaurantAddItem

import { useEffect, useState } from 'react'
import { useAppContext } from '../zustand/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { RESTAURANT_BACKEND_URL } from '../main'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const cart = useAppContext((s) => s.cart)
  const quantity = useAppContext((s) => s.quantity)
  const subTotal = useAppContext((s) => s.subTotal)
  const fetchCart = useAppContext((s) => s.fetchCart)
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const [updatingAction, setUpdatingAction] = useState<'inc' | 'dec' | null>(null)
  const hasClosedRestaurant = !!(cart && cart.some((c: any) => c?.restaurantId && c.restaurantId.isOpen === false))
  const navigate=useNavigate()
  
  useEffect(() => {
    void fetchCart()
  }, [fetchCart])

  if (!cart || cart.length === 0) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-gray-600">Add items from a restaurant to get started.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Cart</h2>
            <p className="mt-1 text-sm text-gray-500">Review the items you plan to order — adjust quantities or proceed to checkout.</p>
            {hasClosedRestaurant && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">One or more restaurants in your cart are currently closed. You cannot proceed to checkout.</div>
            )}
          </div>

          <div className="mt-4 space-y-4">
          {cart.map((c: any) => {
            const item = c.itemId as any
            const restaurant = c.restaurantId as any
            const itemTotal = (item?.price ?? 0) * (c.quantity ?? 0)
            return (
              <div key={c._id} className="group rounded-2xl bg-white p-4 shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md">
                <div className="shrink-0">
                  {item?.image ? (
                    <img src={item.image} alt={item?.name} className="h-20 w-20 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-500">No image</div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{item?.name || 'Unknown item'}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div>{restaurant?.name || restaurant?.formattedAddress || 'Unknown restaurant'}</div>
                        {restaurant?.isOpen === false && (
                          <div className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Closed</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">₹{itemTotal.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">₹{(item?.price ?? 0).toFixed(2)} each</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-700">Qty: <span className="font-semibold">{c.quantity}</span></div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          if (updatingItemId) return
                          setUpdatingItemId(c._id)
                          setUpdatingAction('dec')
                          try {
                            const token = localStorage.getItem('token')
                            if (!token) {
                              toast.error('Please login to update cart')
                              return
                            }
                            await axios.post(
                              `${RESTAURANT_BACKEND_URL}/api/cart/remove`,
                              { itemId: c.itemId._id },
                              { headers: { Authorization: `Bearer ${token}` } }
                            )
                            await fetchCart()
                          } catch (err: any) {
                            toast.error(err?.response?.data?.message || 'Failed to update cart')
                            console.log(err)
                          } finally {
                            setUpdatingItemId(null)
                            setUpdatingAction(null)
                          }
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                        disabled={!!updatingItemId}
                        aria-label="Decrease quantity"
                      >
                        {updatingItemId === c._id && updatingAction === 'dec' ? '...' : <FaMinus className="h-3 w-3" />}
                      </button>
                      <div className="px-3 text-sm font-medium">{c.quantity}</div>
                      <button
                        onClick={async () => {
                          if (updatingItemId) return
                          setUpdatingItemId(c._id)
                          setUpdatingAction('inc')
                          try {
                            const token = localStorage.getItem('token')
                            if (!token) {
                              toast.error('Please login to update cart')
                              return
                            }
                            await axios.post(
                              `${RESTAURANT_BACKEND_URL}/api/cart/add`,
                              { restaurantId: c.restaurantId._id, itemId: c.itemId._id },
                              { headers: { Authorization: `Bearer ${token}` } }
                            )
                            await fetchCart()
                          } catch (err: any) {
                            toast.error(err?.response?.data?.message || 'Failed to update cart')
                            console.log(err)
                          } finally {
                            setUpdatingItemId(null)
                            setUpdatingAction(null)
                          }
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                        disabled={!!updatingItemId}
                        aria-label="Increase quantity"
                      >
                        {updatingItemId === c._id && updatingAction === 'inc' ? '...' : <FaPlus className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>Item total</div>
                    <div className="font-semibold text-gray-900">₹{itemTotal.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        </div>

        <aside className="lg:col-span-1 ">
          <div className="rounded-2xl bg-white p-6 shadow-sm sticky top-8" >
            <h3 className="text-lg font-semibold text-gray-900">Order summary</h3>
            <p className="mt-1 text-sm text-gray-500">{quantity} item{quantity === 1 ? '' : 's'}</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>Subtotal</div>
                <div className="font-medium text-gray-900">₹{(subTotal ?? 0).toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>Delivery</div>
                <div className="font-medium text-gray-900">Free</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>Taxes</div>
                <div className="font-medium text-gray-900">—</div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-extrabold">₹{(subTotal ?? 0).toFixed(2)}</div>
              </div>

              <button
                onClick={()=>{
                  navigate('/checkout')
                }}
                className="mt-6 w-full rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={hasClosedRestaurant}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Cart

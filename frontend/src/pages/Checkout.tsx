import { useEffect, useState } from "react"
import { useAppContext } from "../zustand/AppContext"
import { RESTAURANT_BACKEND_URL,UTILS_BACKEND_URL } from "../main"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"

interface Address {
  _id: string
  mobile: number
  formattedAddress: string
}

const Checkout = () => {
  const { cart, subTotal, quantity } = useAppContext()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingRazorpay, setLoadingRazorpay] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)

  const navigate = useNavigate()

  const deliveryCharge = (subTotal && subTotal < 250) ? 50 : 0
  const totalAmount = (subTotal || 0) + deliveryCharge

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!cart || quantity === 0) return
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) return
        const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/address/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAddresses(res.data.addresses || [])
        if (res.data.addresses && res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0]._id)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAddresses()
  }, [cart, quantity])

  const createOrder = async (paymentMethod: "razorpay" | "cod") => {
    if (!selectedAddressId) {
      toast.error("Please select an address")
      return null
    }
    setCreatingOrder(true)
    try {
      const { data } = await axios.post(`${RESTAURANT_BACKEND_URL}/api/order/create`, {
        addressId: selectedAddressId,
        paymentMethod,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      return data
    } catch (err) {
      toast.error("Failed to create order")
      console.error(err)
      return null
    } finally {
      setCreatingOrder(false)
    }
  }

  const handleRazorpayPayment = async () => {
    if (!cart || quantity === 0) {
      toast.error("Your cart is empty")
      return
    }
    setLoadingRazorpay(true)
    const order = await createOrder("razorpay")
    
    if (!order) {
      setLoadingRazorpay(false)
      return
    }

    const { orderId, amount } = order

    try {
      const { data } = await axios.post(`${UTILS_BACKEND_URL}/api/payment/create`, { orderId },{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const { razorpayOrderId, key } = data

      const options = {
        key,
        amount: (amount || totalAmount) * 100,
        currency: "INR",
        name: "Tomato",
        description: "Food order payment",
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            await axios.post(`${UTILS_BACKEND_URL}/api/payment/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            toast.success("Payment successful")
            navigate(`/paymentSuccess/${response.razorpay_payment_id}`)
          } catch (err) {
            toast.error("Payment verification failed")
            console.error(err)
          } finally {
            setLoadingRazorpay(false)
          }
        },
        modal: { escape: false }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()


    } catch (err) {
      toast.error("Payment initialization failed")
      console.error(err)
      setLoadingRazorpay(false)
    }
  }

  // Note: COD removed from UI — keep function removed.

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: addresses + items (span 2 on large) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Delivery address</h3>
            {loading ? (
              <div className="text-sm text-gray-500">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="text-sm text-gray-600">
                No saved addresses. <Link to="/address" className="text-amber-600 hover:underline">Add address</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label key={addr._id} className={`flex items-start gap-3 p-3 rounded-md border ${selectedAddressId === addr._id ? 'border-amber-300 bg-amber-50' : 'border-gray-100'} cursor-pointer`}>
                    <input
                      type="radio"
                      name="address"
                      value={addr._id}
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{addr.formattedAddress}</div>
                      <div className="text-sm text-gray-500">{addr.mobile}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Order summary</h3>
            {cart && cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((cartEntry: any) => {
                  const item = cartEntry?.itemId ?? cartEntry
                  const qty = cartEntry?.quantity ?? item?.quantity ?? 1
                  const price = Number(item?.price) || 0
                  return (
                    <div key={cartEntry._id || item._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {item?.image ? (
                          <img src={item.image} alt={item?.name} className="w-12 h-12 rounded-md object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">No image</div>
                        )}
                        <div>
                          <div className="font-medium">{item?.name || 'Unknown item'}</div>
                          <div className="text-sm text-gray-500">x {qty}</div>
                        </div>
                      </div>
                      <div className="font-medium">₹{(price * qty).toFixed(2)}</div>
                    </div>
                  )
                })}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>Subtotal</div>
                    <div>₹{(subTotal || 0).toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>Delivery</div>
                    <div>₹{deliveryCharge.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <div>Total</div>
                    <div>₹{totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">Your cart is empty</div>
            )}
          </div>
        </div>

        {/* Right: payment card */}
        <aside className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Total to pay</div>
              <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={loadingRazorpay || creatingOrder}
              className={`w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-md text-white font-semibold ${loadingRazorpay || creatingOrder ? 'bg-amber-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'}`}>
              {loadingRazorpay ? 'Redirecting to payment...' : 'Pay with Razorpay'}
            </button>

            <p className="mt-3 text-xs text-gray-500">Secure payment powered by Razorpay. Your card details are handled securely.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 text-sm text-gray-600">
            <div className="font-medium mb-2">Order details</div>
            <div>Items: {cart?.length ?? 0}</div>
            <div>Delivery: ₹{deliveryCharge.toFixed(2)}</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
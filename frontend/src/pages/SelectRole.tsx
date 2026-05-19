import { type FormEvent, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaUser, FaMotorcycle, FaStore, FaCheck } from 'react-icons/fa'
import { AUTH_BACKEND_URL } from '../main'
import { useAppContext } from '../zustand/AppContext'

const roleOptions = [
  {
    value: 'customer',
    label: 'Customer',
    description: 'Order food, save favourites, track deliveries.',
    icon: FaUser,
  },
  {
    value: 'rider',
    label: 'Rider',
    description: 'Deliver orders and earn on completed trips.',
    icon: FaMotorcycle,
  },
  {
    value: 'seller',
    label: 'Seller',
    description: 'Manage your restaurant and receive orders.',
    icon: FaStore,
  },
]

const SelectRole = () => {
  const [role, setRole] = useState('customer')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const fetchUser = useAppContext((state) => state.fetchUser)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      const res = await axios.put(
        `${AUTH_BACKEND_URL}/api/auth/add/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const nextToken = res.data?.token

      if (nextToken) {
        localStorage.setItem('token', nextToken)
        await fetchUser(nextToken)
      }

      toast.success(res.data?.message || 'Role updated successfully')
      navigate('/')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update role')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Choose your role</h1>
            <p className="text-sm text-gray-500">Pick the role that best describes how you’ll use Zomato.</p>
          </div>
          <div className="text-sm text-gray-400">Step 1 of 1</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {roleOptions.map((opt) => {
            const Icon = opt.icon
            const selected = role === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`relative flex flex-col items-start gap-3 p-5 rounded-lg border transition-shadow duration-150 text-left focus:outline-none
                  ${selected ? 'border-2 border-amber-500 shadow-md bg-amber-50' : 'border border-gray-200 hover:shadow-sm'}`}
                aria-pressed={selected}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-white shadow text-amber-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.description}</div>
                  </div>
                </div>
                {selected && (
                  <span className="absolute top-3 right-3 bg-amber-600 text-white p-1 rounded-full">
                    <FaCheck className="w-3 h-3" />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-500">You can change this later in profile settings.</div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-medium px-5 py-2 rounded-lg"
          >
            {submitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SelectRole
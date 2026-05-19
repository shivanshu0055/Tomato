import { type ChangeEvent, type FormEvent, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaTimes, FaUpload } from 'react-icons/fa'
import { RESTAURANT_BACKEND_URL } from '../main'
import type { IMenuItem } from '../types'

interface AddMenuItemsProps {
  isOpen: boolean
  onClose: () => void
  onItemAdded: (item: IMenuItem) => void
}

const AddMenuItems = ({ isOpen, onClose, onItemAdded }: AddMenuItemsProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
  })

  const handleChange = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const resetForm = () => {
    setImage(null)
    setForm({ name: '', description: '', price: '' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login first')
      return
    }

    if (!image) {
      toast.error('Please upload a menu image')
      return
    }

    if (!form.name.trim() || !form.description.trim() || !form.price.trim()) {
      toast.error('Please fill all fields')
      return
    }

    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('name', form.name.trim())
      payload.append('description', form.description.trim())
      payload.append('price', form.price.trim())
      payload.append('file', image)

      const res = await axios.post(`${RESTAURANT_BACKEND_URL}/api/menu-items/new`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      const createdItem = res.data?.menuItem as IMenuItem | undefined
      if (createdItem) {
        onItemAdded(createdItem)
      }

      toast.success(res.data?.message || 'Menu item added successfully')
      resetForm()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add menu item')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-amber-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Add menu item</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Create a new dish</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 px-6 py-6">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-gray-700">Item name</span>
            <input
              required
              value={form.name}
              onChange={handleChange('name')}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-300 focus:bg-white"
              placeholder="Eg. Paneer Butter Masala"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-gray-700">Description</span>
            <textarea
              required
              value={form.description}
              onChange={handleChange('description')}
              rows={4}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-300 focus:bg-white"
              placeholder="Short description of the dish"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-gray-700">Price</span>
            <input
              required
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={handleChange('price')}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-300 focus:bg-white"
              placeholder="Eg. 249"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-gray-700">Item image</span>
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaUpload className="h-4 w-4 text-amber-600" />
                <span>{image ? image.name : 'Upload a dish image'}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0] || null)}
                className="text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-amber-700"
              />
            </div>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Finish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMenuItems
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import type { CSSProperties, ComponentType, ReactNode } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { RESTAURANT_BACKEND_URL } from '../main'


import L from 'leaflet'
import { LuLocateFixed } from 'react-icons/lu'
import { BiLoader, BiPlus, BiTrash } from 'react-icons/bi'

// Fix leaflet default icon paths
const leafletIconPrototype = L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
  _getIconUrl?: () => string
}

delete leafletIconPrototype._getIconUrl

type MapPoint = [number, number]

type MapContainerProps = {
  center: MapPoint
  zoom: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const LeafletMapContainer = MapContainer as unknown as ComponentType<MapContainerProps>

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Address {
  _id: string
  formattedAddress: string
  mobile: string
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
}

const LocationPicker = ({ setLocation }: { setLocation: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e: { latlng: { lat: number; lng: number } }) {
      setLocation(e.latlng.lat, e.latlng.lng)
    },
  })

  return null
}

const LocateMeButton = ({ onLocate }: { onLocate: (lat: number, lng: number) => void }) => {
  const map = useMap()

  const locateUser = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.flyTo([latitude, longitude], 16, { animate: true })
        onLocate(latitude, longitude)
      },
      () => toast.error('Location permission denied')
    )
  }

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-1000">
      <button
        onClick={locateUser}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-sm font-semibold text-amber-950 shadow-[0_10px_24px_rgba(92,49,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white"
      >
        <LuLocateFixed size={16} />
        Use current location
      </button>
    </div>
  )
}

const AddAddressPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [mobile, setMobile] = useState('')
  const [formattedAddress, setFormattedAddress] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  const initialCenter: MapPoint = [latitude ?? 28.6139, longitude ?? 77.209]

  const fetchFormattedAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await res.json()
      setFormattedAddress(data.display_name || '')
    } catch {
      toast.error('Failed to fetch address')
    }
  }

  const setLocation = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
    void fetchFormattedAddress(lat, lng)
  }

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/address/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setAddresses(res.data?.addresses ?? res.data ?? [])
    } catch {
      toast.error('Failed to load addresses')
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadAddresses = async () => {
      await fetchAddresses()
    }

    void loadAddresses()
  }, [])

  const addAddress = async () => {
    if (!mobile || !formattedAddress || latitude === null || longitude === null) {
      toast.error('Please select location on map and provide mobile')
      return
    }

    try {
      setAdding(true)
      await axios.post(
        `${RESTAURANT_BACKEND_URL}/api/address/add`,
        { formattedAddress, mobile, latitude, longitude },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      toast.success('Address added')
      setMobile('')
      setFormattedAddress('')
      setLatitude(null)
      setLongitude(null)
      void fetchAddresses()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to add address')
      } else {
        toast.error('Failed to add address')
      }
    } finally {
      setAdding(false)
    }
  }

  const deleteAddress = async (id: string) => {
    if (!window.confirm('Delete this address?')) return
    try {
      setDeletingId(id)
      await axios.delete(`${RESTAURANT_BACKEND_URL}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      toast.success('Address deleted')
      void fetchAddresses()
    } catch {
      toast.error('Failed to delete address')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_32%),linear-gradient(180deg,#f7ddbd_0%,#f4b56a_42%,#ec8f2e_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[28px] border border-white/35 bg-white/20 p-5 shadow-[0_24px_80px_rgba(92,49,0,0.22)] backdrop-blur-2xl sm:p-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-950/70">Delivery details</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-amber-950 sm:text-4xl lg:text-5xl">
                Select a delivery pin, then save the address you want to reuse.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-950/75 sm:text-base">
                Tap the map to drop a pin, use your current location if it is available, and keep frequently used addresses ready for checkout.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-950/10 bg-white/70 px-4 py-3 text-sm font-medium text-amber-950 shadow-sm">
              {addresses.length} saved address{addresses.length === 1 ? '' : 'es'}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <section className="overflow-hidden rounded-[28px] border border-white/30 bg-[#fff4e5]/90 shadow-[0_18px_60px_rgba(122,67,0,0.18)]">
            <div className="border-b border-amber-900/10 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-amber-950">Map location</h2>
                  <p className="text-sm text-amber-950/65">Zoom, pan, or tap anywhere on the map to pick a point.</p>
                </div>
                <div className="rounded-full bg-amber-950/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-950/60">
                  {latitude !== null && longitude !== null ? 'Pin selected' : 'No pin selected'}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative h-115 overflow-hidden rounded-3xl border border-amber-950/10 bg-amber-100/60 shadow-inner">
                <LeafletMapContainer center={initialCenter} zoom={13} className="h-full w-full" style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker setLocation={setLocation} />
                  <LocateMeButton onLocate={setLocation} />
                  {latitude !== null && longitude !== null && <Marker position={[latitude, longitude]} />}
                </LeafletMapContainer>

                <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-md rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-amber-950 shadow-lg backdrop-blur-md">
                    <p className="font-semibold">Choose the exact delivery point</p>
                    <p className="mt-1 text-amber-950/70">Drop a pin close to your entrance, gate, or building entrance for better delivery accuracy.</p>
                  </div>
                  {formattedAddress && (
                    <div className="max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950 shadow-lg backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Selected place</p>
                      <p className="mt-1 line-clamp-3">{formattedAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-[28px] border border-white/30 bg-white/80 p-5 shadow-[0_18px_60px_rgba(122,67,0,0.14)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-amber-950">Address form</h2>
                  <p className="text-sm text-amber-950/65">Add a mobile number and save the selected location.</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-amber-950/60">Mobile number</span>
                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full rounded-2xl border border-amber-950/10 bg-[#fffaf2] px-4 py-3 text-sm text-amber-950 outline-none transition placeholder:text-amber-950/35 focus:border-[#E23744] focus:ring-4 focus:ring-[#E23744]/15"
                  />
                </label>

                {formattedAddress && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Resolved address</p>
                    <p className="mt-1 leading-6">{formattedAddress}</p>
                  </div>
                )}

                <button
                  disabled={adding}
                  onClick={addAddress}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E23744] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(226,55,68,0.25)] transition hover:-translate-y-0.5 hover:bg-[#cf2f3b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {adding ? <BiLoader className="animate-spin" /> : <BiPlus />}
                  Save Address
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/30 bg-white/80 p-5 shadow-[0_18px_60px_rgba(122,67,0,0.14)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-amber-950">Saved addresses</h2>
                  <p className="text-sm text-amber-950/65">Manage saved locations from one clean list.</p>
                </div>
                <div className="rounded-full bg-amber-950/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-950/55">
                  {loading ? 'Syncing' : `${addresses.length} total`}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-2xl border border-dashed border-amber-950/15 bg-amber-50/60 px-4 py-8 text-sm text-amber-950/55">
                    Loading saved addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-amber-950/15 bg-amber-50/60 px-4 py-8 text-sm text-amber-950/55">
                    No addresses saved yet. Pick a location on the map and store it for later.
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="group rounded-[22px] border border-amber-950/10 bg-linear-to-br from-white to-[#fff4e8] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E23744]/10 text-sm font-bold text-[#E23744]">
                              {addr.formattedAddress.slice(0, 1).toUpperCase()}
                            </span>
                            <p className="truncate text-sm font-semibold text-amber-950">{addr.formattedAddress}</p>
                          </div>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-amber-950/45">Mobile</p>
                          <p className="text-sm text-amber-950/75">{addr.mobile}</p>
                        </div>
                        <button
                          onClick={() => deleteAddress(addr._id)}
                          disabled={deletingId === addr._id}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === addr._id ? <BiLoader size={16} className="animate-spin" /> : <BiTrash size={16} />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default AddAddressPage

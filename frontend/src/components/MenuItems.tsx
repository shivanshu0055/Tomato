import type { IMenuItem } from '../types'

interface MenuItemsProps {
  item: IMenuItem
  canManage?: boolean
  onToggleAvailability?: (itemId: string) => void | Promise<void>
  togglingItemId?: string | null
}

const MenuItems = ({ item, canManage = false, onToggleAvailability, togglingItemId }: MenuItemsProps) => {
  const isToggling = togglingItemId === item._id

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">No image</div>
        )}
      </div>

      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          </div>
          <p className="text-base font-bold text-amber-700">Rs {Number(item.price).toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={[
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
              item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700',
            ].join(' ')}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>

        {canManage && onToggleAvailability && (
          <button
            type="button"
            onClick={() => void onToggleAvailability(item._id)}
            disabled={isToggling}
            className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isToggling ? 'Updating...' : item.isAvailable ? 'Mark unavailable' : 'Mark available'}
          </button>
        )}
      </div>
    </article>
  )
}

export default MenuItems
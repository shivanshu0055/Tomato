const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 text-gray-900">
      <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-xl shadow-amber-100 backdrop-blur-sm sm:p-12">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
              Zomato home
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find food that feels like it was made for you.
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              Use the search bar above to discover restaurants, dishes, and cuisines. Your
              account controls are in the top-right corner.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Homepage
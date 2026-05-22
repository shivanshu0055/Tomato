import { useEffect } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { useAppContext } from './zustand/AppContext'
import SelectRole from './pages/SelectRole'
import Navbar from './components/Navbar'
import Account from './pages/Account'
import Restaurant from './pages/Restaurant/Restaurant'
import RestaurantAdd from './pages/Restaurant/RestaurantAdd'
import RestaurantOverview from './pages/Restaurant/RestaurantOverview'
import RestaurantMenu from './pages/Restaurant/RestaurantMenu'
import RestaurantAddItem from './pages/Restaurant/RestaurantAddItem'
import RestaurantSales from './pages/Restaurant/RestaurantSales'
import RestaurantDetails from './pages/Restaurant/RestaurantDetails'
import Cart from './pages/Cart'
import Address from './pages/Address'
import 'leaflet/dist/leaflet.css'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import { initializeSocketListener } from './zustand/SocketListener'

const App = () => {
  const fetchUser = useAppContext((state) => state.fetchUser)
  const fetchLocation = useAppContext((state) => state.fetchLocation)
  const fetchCart = useAppContext((state) => state.fetchCart)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const init = async () => {
      if (token) {
        await fetchUser(token)
        await fetchCart()
        initializeSocketListener();
      } else {
        useAppContext.setState({ loading: false })
      }

      await fetchLocation()
    }

    void init()
  }, [fetchUser, fetchLocation, fetchCart, token])

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes> 
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/account" element={<Account />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/address" element={<Address />} />
          <Route path="/restaurant/add" element={<RestaurantAdd />} />
          <Route path="/paymentSuccess/:razorpayPaymentId" element={<PaymentSuccess />} />
          <Route path="/restaurant" element={<Restaurant />}>
            <Route index element={<RestaurantOverview />} />
            <Route path="menu" element={<RestaurantMenu />} />
            <Route path="add-item" element={<RestaurantAddItem />} />
            <Route path="sales" element={<RestaurantSales />} />
          </Route>
          
        </Route>
      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App
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


const App = () => {
  const fetchUser = useAppContext((state) => state.fetchUser)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      fetchUser(token)
    } else {
      useAppContext.setState({ loading: false })
    }
  }, [fetchUser, token])

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
          <Route path="/restaurant/add" element={<RestaurantAdd />} />
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
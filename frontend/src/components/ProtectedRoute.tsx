import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppContext } from "../zustand/AppContext"

const ProtectedRoute = () => {
    const isAuth = useAppContext((state)=>state.isAuth)
    const loading = useAppContext((state)=>state.loading)
    const user = useAppContext((state)=>state.user)
    const location=useLocation()
    
    if(loading) return null

    if(!isAuth) return <Navigate to="/login" replace/>
    
    if(user?.role===null && location.pathname!=="/select-role"){
        return <Navigate to="/select-role" replace/>
    }

    if(user?.role!==null && location.pathname==="/select-role"){
        return <Navigate to="/" replace/>
    }

    return <Outlet />
}

export default ProtectedRoute
import {Navigate,Outlet} from 'react-router-dom' 
import { useAppContext } from '../zustand/AppContext'

const PublicRoute=()=>{
    const isAuth = useAppContext((state)=>state.isAuth)
    const loading = useAppContext((state)=>state.loading)

    if(loading) return null

    return isAuth ? <Navigate to="/" replace/> : <Outlet />
}

export default PublicRoute
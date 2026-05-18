import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../main'
import toast from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import { FaGoogle } from 'react-icons/fa'
import axios from 'axios'
import { useAppContext } from '../zustand/AppContext'

const Login = () => {
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const fetchUser = useAppContext((state)=>state.fetchUser)

    const responseGoogle=async(authResults:any)=>{
        setLoading(true)
        try{
            const res=await axios.post(`${BACKEND_URL}/api/auth/login`,{
                code:authResults.code
            })
            const token = res.data.token
            localStorage.setItem("token", token)
            // update global store before navigating so ProtectedRoute sees auth
            await fetchUser(token)
            toast.success(res.data.message)
            navigate('/')
        }
        catch(err:any){
            console.log(err);
            toast.error(err.response?.data?.message || "Login failed")
        }
        finally{
            setLoading(false)
        }
    }

    const googleLogin=useGoogleLogin({
        onSuccess:responseGoogle,
        onError:responseGoogle,
        flow:"auth-code"
    })

  return (
        <div className="login-page">
            <div className="login-shell">
                <div className="login-card">
                    <span className="login-badge">Zomato</span>

                    <div className="login-copy">
                        <h1>Minimal sign in for your next order.</h1>
                        <p>
                            Sign in with Google to keep your favourites, orders, and updates in one simple place.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="google-login-button"
                        onClick={() => googleLogin()}
                        disabled={loading}
                    >
                        {loading ? 'Signing you in...' : (
                            <>
                                <FaGoogle />
                                Continue with Google
                            </>
                        )}
                    </button>

                    <div className="login-note">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Login
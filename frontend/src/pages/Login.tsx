import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BACKEND_URL } from '../main'
import toast from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

const Login = () => {
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

    const responseGoogle=async(authResults:any)=>{
        setLoading(true)
        try{
            const res=await axios.post(`${BACKEND_URL}/api/auth/login`,{
                code:authResults.code
            })
            localStorage.setItem("token",res.data.token)
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
                <div className="login-copy">
                    <span className="login-badge">Welcome back</span>
                    <h1>Sign in to continue your Zomato experience</h1>
                    <p>
                        Discover restaurants, save your favourites, and keep your orders in one place.
                    </p>
                </div>

                <div className="login-card">
                    <div className="login-card-header">
                        <h2>Login</h2>
                        <p>Use your Google account to continue securely.</p>
                    </div>

                    <button
                        type="button"
                        className="google-login-button"
                        onClick={() => googleLogin()}
                        disabled={loading}
                    >
                        {loading ? 'Signing you in...' : 'Continue with Google'}
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
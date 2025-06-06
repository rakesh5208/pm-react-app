import type { FormEvent } from "react";
import { useSessionStore } from "@/stores/session"
import { useNavigate } from "react-router";

const Login = () => {
  const { login, isLoginRequested } = useSessionStore();
  const navigate = useNavigate();
  const onLoginHandler = async (event: FormEvent)=> {
    event.preventDefault();
    await login();
    navigate('/home', { replace: true} )
  }
  return (
    <div className="bg-card-background mx-auto max-w-[500px] h-56 my-[40px] rounded-md p-4">
        <form className="flex flex-col h-full" onSubmit={onLoginHandler}>
            <div className="flex-1">
                <div className="flex flex-col">
                    <label htmlFor="username">Email</label>
                    <input id="username" type="text"/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">password</label>
                    <input id="password" type="password"/>
                </div>
            </div>
            <div className="flex justify-end">
                <button type="submit" className={`flex-1 bg-primary-nav-background text-primary-nav-foreground hover:bg-primary-nav-hover-background rounded p-1 cursor-pointer ${isLoginRequested && 'opacity-60'}`}>
                    { isLoginRequested ? 'Submitted...': 'Login' }
                </button>
            </div>
        </form>
    </div>
  )
}

export default Login
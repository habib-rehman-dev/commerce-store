import { SignIn } from "@clerk/react"

const Login = () => {
  return (
    <div className="flex justify-center p-10">
        <SignIn oauthFlow="redirect" initialValues={{emailAddress:''}}  signUpUrl="/register" forceRedirectUrl={'/dashboard'}/>
    </div>
  )
}

export default Login
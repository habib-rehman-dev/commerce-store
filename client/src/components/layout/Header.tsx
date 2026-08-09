// Header.jsx
import {
  UserButton,
  SignInButton,
  SignUpButton,
  
  SignOutButton,
  Show,
  useAuth,
} from "@clerk/react";
import { Link } from "react-router-dom";

export default function Header() {
  const {isSignedIn} = useAuth()
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg">
      <Link to={"/"} className="text-xl font-bold">
        MyApp
      </Link>

      <div className="flex items-center gap-4">
        

        {/* sign out button */}
        <Show when={"signed-in"}>
          <SignOutButton>
            <button className="border rounded-lg p-4">sign out</button>
          </SignOutButton>
        </Show>
        {isSignedIn ? (
          <div className="border p-3 bg-white rounded-lg">
            {/* <span className="text-sm hidden sm:inline">{user.fullName}</span> */}
            <UserButton showName />
          </div>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition">
                Sign In
              </button>
            </SignInButton>
            {"/"}
            <SignUpButton>
              <button className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition">
                Sign Up
              </button>
            </SignUpButton>
          </>
        )}
      </div>
    </header>
  );
}

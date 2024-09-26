import { useEffect } from "react"
import ProfilePicture from "../components/ProfilePicture.js"

export default function ProfilePreview({ user }) {

  return (
    <>
    <div className="flex justify-center items-center min-h-80">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm">
        <div className="flex items-center space-x-4">
          <div className="flex">
            <ProfilePicture 
            picture={user.picture}
            alt="Profile picture"
            />
            <div className="p-2">
              <h2 className="text-xl font-semibold">Ciao, sono <span className="text-green-600"> {user.fullName}</span>!</h2>
              <p className="text-gray-600">anche conosciuto come: <span className="text-gray-400">{user.username}</span></p>
              <p className="pt-2 text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">{user.bio}</h3>
        </div>
      </div>
    </div>
    </>
  )
}

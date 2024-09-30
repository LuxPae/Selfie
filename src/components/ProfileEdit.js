import { useContext } from "react"
import GlobalContext from "../context/GlobalContext.js"
import ProfilePicture from "../components/ProfilePicture.js"

export default function ProfileEdit() {
  var { newUser, setNewUser, newPicture, setNewPicture, newFullName, setNewFullName, newUsername, setNewUsername, newBio, setNewBio } = useContext(GlobalContext);

  const handleChange = (e => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  });

  //TODO decidi
  const chissà_se_rimarrà = false;

  return (
    <>
    <div className="flex justify-center items-center max-w-auto min-h-80">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-auto">
            <div>
              <label className="flex-auto text-md text-gray-500">
                Immagine profilo (solo URL online)
                <p>[ad esempio <a className="text-indigo-400" target="_blank" href="https://dummyimage.com">Dummy image</a> o <a className="text-indigo-400" target="_blank" href="https://commons.wikimedia.org/w/index.php?search=selfie&title=Special:MediaSearch&go=Vai&uselang=it&type=image">Wikipedia</a>]</p>
                <input className="pl-2 mb-2 text-md" onKeyDown={e => { if(e.key === "Enter") setNewPicture(e.target.value)}} type="url" name="pfp" accept="image/png, image/jpeg, image/svg"/>
              </label>
              { chissà_se_rimarrà &&
                <ProfilePicture
                  picture={newPicture}
                  alt="new profile picture"
                />
              }
            </div>
            <div className="mt-2">
              <label>
                <span className="text-md text-gray-500">Nuovo nome completo</span>
                <input type="textarea" onChange={(e) => {setNewFullName(e.target.value)}} defaultValue={newFullName} className="pl-2 text-lg"/>
              </label>
            </div>
            <div className="mt-2">
              <label>
                <span className="text-md text-gray-500">Nuovo nome utente </span>
                <input type="textarea" onChange={(e) => {setNewUsername(e.target.value)}} defaultValue={newUsername} className="pl-2 text-lg"/>
              </label>
            </div>
            <div className="mt-2">
              <label>
                <span className="text-md text-gray-500">Nuova biografia </span>
                <textarea onChange={(e) => {setNewBio(e.target.value)}} defaultValue={newBio} rows="5" cols="30" className="max-h-30 pl-2 text-lg"/>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

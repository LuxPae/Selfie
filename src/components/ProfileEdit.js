import { useContext } from "react"
import GlobalContext from "../context/GlobalContext.js"
import ProfilePicture from "../components/ProfilePicture.js"
import * as colors from "../scripts/COLORS.js"

export default function ProfileEdit({ error, submitChanges }) {
  var { newUser, setNewUser, newPicture, setNewPicture, newFullName, setNewFullName, newUsername, setNewUsername, newBio, setNewBio } = useContext(GlobalContext);

  const handleChange = (e => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  });

  const dummyImageURL = "https://dummyimage.com"
  const wikipediaURL = "https://commons.wikimedia.org/w/index.php?search=selfie&title=Special:MediaSearch&go=Vai&uselang=it&type=image"

  return (
    <>
    <div className="flex justify-center items-center max-w-auto min-h-80" onKeyPress={e => {if (e.key === "Enter") submitChanges()}}>
      <div className={`${colors.MAIN_BG_MEDIUM} p-6 rounded-lg w-full max-w-sm`}>
        <div className="flex items-center space-x-4">
          <div className="flex-auto">
            <div className="flex">
              <div className="w-full md:hidden">
                <ProfilePicture
                  picture={newPicture}
                  alt="new profile picture"
                />
              </div>
              <div className={`flex items-start justify-center text-md ${colors.MAIN_TEXT_MEDIUM} flex-col`}>
                <p>Nuova immagine profilo</p>
                <p>(solo URL online, ad esempio <a className="text-green-600" target="_blank" href={dummyImageURL}>Dummy image</a> o <a className="text-green-600" target="_blank" href={wikipediaURL}>Wikipedia</a>)</p>
                <input className="pl-2 mb-2 text-md w-full" onChange={(e) => setNewPicture(e.target.value)} defaultValue={newPicture} type="url" name="picture" accept="image/png, image/jpeg, image/svg"/>
              </div>
            </div>
            <div className="mt-2">
              <label>
                <span className={`${colors.MAIN_TEXT_MEDIUM} text-md`}>Nuovo nome completo</span>
                <input type="textarea" onChange={(e) => {setNewFullName(e.target.value)}} defaultValue={newFullName} className="pl-2 text-lg"/>
              </label>
            </div>
            <div className="mt-2">
              <label>
                <span className={`${colors.MAIN_TEXT_MEDIUM} text-md`}>Nuovo nome utente </span>
                <input type="textarea" onChange={(e) => {setNewUsername(e.target.value)}} defaultValue={newUsername} className="pl-2 text-lg"/>
              </label>
            </div>
            <div className="mt-2">
              <label>
                <span className={`${colors.MAIN_TEXT_MEDIUM} text-md`}>Nuova biografia </span>
                <textarea onChange={(e) => {setNewBio(e.target.value)}} defaultValue={newBio} rows="5" cols="30" className="max-h-30 pl-2 text-lg"/>
              </label>
            </div>
            { error && <p className={`text-center p-1 w-full mt-4 flex border ${colors.MAIN_BORDER_LIGHT} justify-center ${colors.MAIN_TEXT_LIGHT} ${colors.CALENDAR_BG_DARK}`}>{error}</p> }
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

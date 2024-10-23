//TODO
// - renderlo più carino (e farlo anche per mobile, non si vede la sezione che stai editanto, ma solo i dati che stai cambiando)

import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../context/GlobalContext.js"
import { useNavigate } from "react-router-dom";
import ProfileEdit from "../components/ProfileEdit.js"
import ProfilePreview from "../components/ProfilePreview.js"
import Header from "../components/Header.js"
import NiceButton from "../components/NiceButton.js"
import axios from "axios"
import { modifyUser } from "../API/profile.js"
import { validateUser } from "../scripts/userValidators.js"
import useCheckForUser from "../hooks/useCheckForUser.js"

const Profile = () => {
  useCheckForUser();

  var { user, dispatchUser, notify, newFullName, setNewFullName, newPicture, setNewPicture, newUsername, setNewUsername, newBio, setNewBio } = useContext(GlobalContext);

  const [ loadingError, setLoadingError ] = useState("");
  const [ modifyingState, setModifyingState ] = useState(false);
  const [ button_edit_text_color, setButtonEditTextColor ] = useState(false);

  const [ modifiedUser, setModifiedUser ] = useState(user);

  const [ confirmDelete, setConfirmDelete ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/");
  }, [user])

  useEffect(() => {
    setNewFullName(user?.fullName);
    setNewUsername(user?.username);
    setNewPicture(user?.picture);
    setNewBio(user?.bio);
  }, [user])

  const newModifiedUser = () => {
    return {
      fullName: newFullName,
      username: newUsername,
      picture: newPicture,
      bio: newBio,
      email: user?.email || "_@email.com"
    }
  }

  useEffect(() => {
    setModifiedUser(newModifiedUser());
  }, [user, newFullName, newUsername, newPicture, newBio])

  useEffect(() => {
    setButtonEditTextColor(modifyingState ? "red" : "green");
  }, [modifyingState]);

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("tokenExpiration")
    dispatchUser({ type: "LOGOUT" });
    navigate("/");
  }

  const handleDeleteUser = async () => {
    //TODO questo così non è il massimo, magari quando avrò sistemato proverò a rimetterlo dentro al try
    const id = user._id;
    const token = user.token;
    localStorage.removeItem("user")
    localStorage.removeItem("tokenExpiration")
    dispatchUser({ type: "DELETE" });
    navigate("/");

    try {
      console.log("Deleting user", id);
      const res = await axios.delete(
        `http://localhost:5000/user/profile/${id}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      if (res.status === 200) { console.log("deleted") }
      else throw new Error("Could not delete user", id);
    }
    catch (error) {
      console.error(error.message);
    }
  }

  const handleEditProfile = async (e) => {
    e.preventDefault();
    //console.log("New profile info:");
    //console.log("  Full name:", newFullName);
    //console.log("  Username:", newUsername);
    //console.log("  Picture:", newPicture);
    //console.log("  Bio:", newBio);
    let new_user = {
      ...user,
      fullName: newFullName,
      username: newUsername,
      picture: newPicture,
      bio: newBio
    }
    try {
      validateUser(new_user);
      const response = await modifyUser(new_user);
      localStorage.setItem("user", JSON.stringify(response))
      dispatchUser({ type: "MODIFY", payload: response });
      notify("Utente", "profilo modificato")
      setModifyingState(false);
    }
    catch(error) {
      //TODO qui ci vanno gli errori di validazione
      notify("error", error.message);
    }
  }

  if (loadingError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-3xl">{loadingError}</div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-3xl">Caricando le informazioni...</div>
    ) 
  }

  return (
      <>
      <Header/>

      {modifyingState ? 
        <>
        <div className="items-center justify-around flex flex-nowrap">
          <div className="hidden sm:block"><ProfilePreview user={modifiedUser}/></div>
          <aside> <ProfileEdit/> </aside>
        </div>
        </>
        : 
        <div className="w-full pt-20 justify-center">
          <ProfilePreview user={user} />
        </div>
      }
      <div id="buttons" className="flex flex-col p-5 max-w-fit ">
        { modifyingState ?
          <>
          <NiceButton
            text="Annulla"
            colour="red"
            when_clicked={() => setModifyingState(!modifyingState)}
          />
          <NiceButton
            text="Salva modifiche"
            colour="green"
            when_clicked={handleEditProfile}
          />
          </>
          :
          <>
          <div>
            <NiceButton
              //TODO da aggiustare quando si hovera il bottone, forse è dello stesso colore dello sfondo?
              text="Modifica profilo"
              extra={<span className="h-4 material-symbols-outlined">edit</span>}
              colour={button_edit_text_color}
              when_clicked={() => setModifyingState(!modifyingState)}
            />
            <NiceButton
              text="Logout"
              colour="blue"
              when_clicked={handleLogout}
            />
            <NiceButton
              text="Elimina Account"
              colour="red"
              when_clicked={() => setConfirmDelete(true)}
            />
            { confirmDelete && <>
              <div className="text-white flex space-x-4">
                <div>Conferma di voler eliminare il tuo account:</div>
                <button className="cursor-pointer hover:bg-red-700 border rounded border-red-700 px-4" onClick={handleDeleteUser}>Sì</button>
                <button className="cursor-pointer hover:bg-green-700 border rounded border-green-700 px-4" onClick={() => setConfirmDelete(false)}>No</button>
              </div>
            </>}
          </div>
          </>
        }
      </div>
      </>
  );
};

export default Profile;

import React, { useState, useEffect, useContext } from "react";
import GlobalContext from "../context/GlobalContext.js"
import { useNavigate } from "react-router-dom";
import ProfileEdit from "../components/ProfileEdit.js"
import ProfilePreview from "../components/ProfilePreview.js"
import Header from "../components/Header.js"
import Button from "../components/Button.js"
import axios from "axios"
import { modifyUser } from "../API/profile.js"
import { validateModifiedUser } from "../scripts/userValidators.js"
import useCheckForUser from "../hooks/useCheckForUser.js"
import dayjs from "dayjs"

const Profile = () => {
  useCheckForUser();

  var { user, dispatchUser, notify, newFullName, setNewFullName, newPicture, setNewPicture, newUsername, setNewUsername, newBio, setNewBio, allEvents, allEvents_initialize, currentDate, setAllEvents } = useContext(GlobalContext);

  if (allEvents.length <= 0) allEvents_initialize()

  const [ loadingError, setLoadingError ] = useState("");
  const [ error, setError ] = useState("");
  const [ modifyingState, setModifyingState ] = useState(false);

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
    setError("")
  }, [modifyingState]);

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("tokenExpiration")
    dispatchUser({ type: "LOGOUT" });
    setAllEvents([])
    navigate("/");
  }

  const handleDeleteUser = async () => {
    setAllEvents([])
    const id = user._id;
    const token = user.token;
    localStorage.removeItem("user")
    localStorage.removeItem("tokenExpiration")
    dispatchUser({ type: "DELETE" });
    navigate("/");

    try {
      console.log("Deleting user", id);
      const res = await axios.delete(
        `http://localhost:5001/user/profile/${id}`, // TODO: 5000
        { headers: { Authorization: `Bearer ${token}` }}
      );
      if (res.status === 200) { console.log("deleted") }
      else throw new Error("Could not delete user", id);
    }
    catch (error) {
      console.error(error.message);
    }
  }

  const handleEditProfile = async () => {
    const editData = {
      fullName: newFullName,
      username: newUsername,
      picture: newPicture,
      bio: newBio
    }
    const new_error = validateModifiedUser(editData)
    setError(new_error)
    if (new_error) return

    let new_user = {
      ...user,
      ...editData
    }
    try {
      const response = await modifyUser(new_user);
      localStorage.setItem("user", JSON.stringify(response))
      dispatchUser({ type: "MODIFY", payload: response });
      notify([{type:"Utente", message:"profilo modificato"}])
      setModifyingState(false);
    }
    catch(error) {
      notify([{type:"error", message:error.message}])
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
        <div className="flex items-center justify-center md:space-x-4">
          <div className="hidden md:block"><ProfilePreview user={modifiedUser} modifying={modifyingState}/></div>
          <ProfileEdit error={error} submitChanges={handleEditProfile}/>
        </div>
        </>
        :
        <div className="">
          <ProfilePreview user={user}/>
        </div>
      }
      <div className="px-4 mt-4">
        { modifyingState ? <div className="flex space-x-4">
            <Button click={handleEditProfile} label="Salva modifiche"/>
            <Button click={() => setModifyingState(!modifyingState)} label="Annulla"/>
          </div>
          :
          <>
          <div className="flex justify-between md:justify-center md:space-x-4">
            <Button click={() => setModifyingState(!modifyingState)} label="Modifica profilo" otherCss="h-fit"/>
            <Button click={handleLogout} label="Logout" otherCss="h-fit"/>
            { confirmDelete ? <div className="flex space-x-4">
                <Button click={handleDeleteUser} label="check" otherCss="material-symbols-outlined"/>
                <Button click={() => setConfirmDelete(false)} label="close" otherCss="material-symbols-outlined"/>
              </div>
              : <Button click={() => setConfirmDelete(true)} label="Elimina account"/>
            }
          </div>
          </>
        }
      </div>
      </>
  );
};

export default Profile;

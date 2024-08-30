import "./globals.ts";
import { useEffect, useState } from 'react';
import './App.css'
import ChatBox from "./chatBox/ChatBox";
import CreateAccount from './createAccount/CreateAccount';
import Login from './login/Login';
import RoomSelection from './roomSelection/RoomSelection';
import RoomList from './roomList/RoomList';

interface ChatRoom {
  name: string,
  createdBy: string,
  content: {
    username: string,
    message: string
  }[]
}

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [isRoomSelected, setIsRoomSelected] = useState<boolean>(false);
  const [chatRoom, setChatRoom] = useState<ChatRoom>({
      name: '',
      createdBy: '',
      content: []
    });
    const [roomList, setRoomList] = useState<ChatRoom[]>([])

  const updateIsLoggedIn = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsRoomSelected(false);
  }

  const updateIsRoomSelected = () => {
    setIsRoomSelected(!isRoomSelected);
  }

  const updateUser = (user: string) => {
    setUser(user)
  }

  const updateRoomList = () => {
    fetch("http://localhost:8080/get-rooms")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        
        setRoomList(data)
      })
  }

  useEffect (() => {
    updateRoomList()
  }, [isLoggedIn, chatRoom]);
  
  const updateChatRoom = (room: ChatRoom) => {
    setChatRoom(room)
    setIsRoomSelected(true)
  }

  return (
    <>
      {isLoggedIn ? <button onClick={updateIsLoggedIn}>Logout</button> : null}
      <h1>Chat Room</h1>
      {isLoggedIn ? <><h2>Hi {user}! Create a new room or join one from the list below... </h2> 
        <RoomSelection updateIsRoomSelected = {updateIsRoomSelected} updateChatRoom= {updateChatRoom} user={user}/>
        <RoomList roomList={roomList} updateChatRoom={updateChatRoom}/></> : 
        <div>
          <CreateAccount />
          <h2> or </h2>
          <Login updateIsLoggedIn = {updateIsLoggedIn} updateUser = {updateUser} updateRoomList={updateRoomList}/> 
        </div> 
      }
      {isLoggedIn && isRoomSelected ? <ChatBox chatRoom = {chatRoom} currentUser={user}/> : null }
    </>
  )
}

export default App

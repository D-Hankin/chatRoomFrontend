import { useState } from "react"

interface Props {
    updateIsRoomSelected : () => void,
    updateChatRoom: (chatRoom: ChatRoom) => void
    user: string
}

interface ChatRoom {
    name: string,
    createdBy: string,
    content: {
      username: string,
      message: string
    }[]
  }

function RoomSelection(props: Props) {

    const [createRoomName, SetCreateRoomName] = useState<string>("");
    const [newMessages] = useState<[]>([])

    const submitNewRoom = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("room name: ", createRoomName);
        fetch("http://localhost:8080/create-room", {
            method: "POST",
            body: JSON.stringify({
                name: createRoomName,
                createdBy: props.user,
                content:  newMessages
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.text())
        .then(data => {
            console.log(data)
            props.updateChatRoom({
                name: createRoomName,
                createdBy: props.user,
                content:  newMessages
            });
            props.updateIsRoomSelected();
            SetCreateRoomName("");
        })

    }

  return (
    <>
        <form onSubmit={submitNewRoom}>
            <h2>Create New Room</h2>
            <label>Room Name:</label>
            <input id="createRoomInput" value={createRoomName} onChange={(e) => SetCreateRoomName(e.target.value)}/>
            <button type="submit">Create</button>
        </form>
    </>
  )
}

export default RoomSelection
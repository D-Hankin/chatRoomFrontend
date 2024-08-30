
interface ChatRoom {
    name: string,
    createdBy: string,
    content: {
      username: string,
      message: string
    }[]
  }

interface Props {
    roomList: ChatRoom[]
    updateChatRoom: (room: ChatRoom) => void
}

function RoomList(props: Props) {
    
  return (
    <ul>
        {props.roomList.map((item, index) => (
            <li key={index}
                style={{
                    color: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    margin: '5px 0',
                    listStyle: "none"
                }}><button onClick={() => props.updateChatRoom(item)}>{item.name}</button>
            </li>
        ))}
    </ul>
  )
}

export default RoomList
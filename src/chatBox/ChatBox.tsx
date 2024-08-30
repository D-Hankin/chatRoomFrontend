import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import SendNewMessage from './sendNewMessage/SendNewMessage';

interface Message {
    username: string;
    message: string;
}

interface ChatRoom {
    name: string;
    createdBy: string;
    content: Message[];
}

interface Props {
    chatRoom: ChatRoom;
    currentUser: string;
}

function ChatBox(props: Props) {
    const stompClientRef = useRef<any>(null);
    const [messages, setMessages] = useState<Message[]>(props.chatRoom.content);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/websocket");
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;

        setMessages([]);
        fetchMessages()
        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/chat/${props.chatRoom.name}`, (chat: any) => {
                const newMessage: Message = JSON.parse(chat.body);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        }, (error: any) => {
            console.error("Connection error:", error);
        });

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, [props.chatRoom.name]);

    const sendMessage = (message: string) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(`/app/chat/${props.chatRoom.name}`, {}, JSON.stringify({
                username: props.currentUser,
                message: message
            }));
            const newMessage = {
              username: props.currentUser,
              message: message
            }
            sendMessageToDatabase(props.chatRoom.name, newMessage)
        }
    };

    const fetchMessages = () => {
        fetch(`http://localhost:8080/fetch-messages/${props.chatRoom.name}`)
          .then(res=>res.json())
          .then(data => {
            setMessages(data);
            console.log(data);
          });
    }
    
    const sendMessageToDatabase = (name: string, newMessage: Message) => {
      fetch(`http://localhost:8080/send-message-to-database/${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: newMessage.username,
          message: newMessage.message
        })
      }).then(res=>res.text())
      .then(data => {
        console.log(data);
      })
    }

    return (
        <div id="chatBoxDiv">
            <h2>{props.chatRoom.name}</h2>
            <SendNewMessage currentUser={props.currentUser} sendMessage={sendMessage}/>
            <ul id="messageList">
                {messages.map((item, index) => (
                    <li 
                        key={index}
                        style={{
                            backgroundColor: item.username === props.currentUser ? 'green' : 'blue',
                            textAlign: item.username === props.currentUser ? 'right' : 'left',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            margin: '5px 0',
                            listStyle: "none"
                        }}
                    >
                        <h3>{item.username}</h3>
                        <p>{item.message}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatBox;



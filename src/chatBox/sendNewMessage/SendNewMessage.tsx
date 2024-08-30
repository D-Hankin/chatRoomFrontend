import React, { useEffect, useState } from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface Message {
    username: string;
    message: string;
}

interface Props {
    currentUser: string;
    sendMessage: (message: string) => void;
}

const SendNewMessage: React.FC<Props> = (props) => {
    const [message, setMessage] = useState<string>("");
    const [stompClient, setStompClient] = useState<any>(null);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/websocket");
        const client = Stomp.over(socket);

        client.connect({}, (frame: any) => {
            console.log('Connected: ' + frame);
            sendHello(props.currentUser);

            client.subscribe("/topic/chat", (chat: any) => {
                const receivedMessage: Message = JSON.parse(chat.body);
                console.log("chat:", receivedMessage);
            });

            setStompClient(client);

        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []); 

    const sendHello = (name: string) => {
        if (stompClient) {
            stompClient.send("/app/hello", {}, JSON.stringify({ name }));
        }
    };

    const submitMessage = (e: React.FormEvent) => {
        e.preventDefault();
        props.sendMessage(message);
    };

    return (
        <form onSubmit={submitMessage}>
            <label>Enter message:</label>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default SendNewMessage;

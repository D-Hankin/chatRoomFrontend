import React, { useState } from 'react'

interface Props {
    updateIsLoggedIn : () => void;
    updateUser : (user: string) => void;
    updateRoomList: ([]) => void;
}

function Login(props: Props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const submitLogin = (e: React.FormEvent) => {
        e.preventDefault();

        
        setUsername("");
        setPassword("");

        fetch("http://localhost:8080/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.text();
        })
        .then(data => {
            if (data) {
                props.updateUser(username);
                props.updateIsLoggedIn();
            } else {
                console.log("No data received");
                props.updateUser("");
                getRooms();
            }
        })
        .catch(error => {
            console.error("Error during fetch:", error);
        });
        
    }

    const getRooms = () => {
        fetch("http://localhost:8080/get-rooms")
            .then(res => res.json())
            .then(data => {
                props.updateRoomList(data)
            })
    }

  return (
    <>
        <div>Login</div>
        <form onSubmit={submitLogin}>
            <label>Username</label>
            <input id='usernameInput' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <label>Password</label>
            <input id='passwordInput' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Submit</button>
        </form>
    </>
  )
}

export default Login
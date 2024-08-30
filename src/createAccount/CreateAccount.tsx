import { useState } from 'react'

function CreateAccount() {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nowLoginIn, setNowLogIn] = useState<string>("");
    const [fetchResonse, setFetchResonse] = useState<string>("");

    const submitCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("username: ", username);
        console.log("password: ", password);
        setUsername("");
        setPassword("");
        fetch("http://localhost:8080/create-user", {
          method: "POST",
          body: JSON.stringify({
            username: username,
            password: password
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => res.text())
        .then(data => {
          console.log(data);
          setFetchResonse(data);
          setNowLogIn("Success! Now log in...")
        })
    }

  return (
    <>
        <div>CreateAccount</div>
        <form onSubmit={submitCreateAccount}>
            <label>Username</label>
            <input id='usernameInput' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <label>Password</label>
            <input id='passwordInput' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Submit</button>
        </form>
        <h3>{fetchResonse}</h3>
        <h2>{nowLoginIn}</h2>
    </>
  )
}

export default CreateAccount
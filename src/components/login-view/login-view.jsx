import React, { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
  // Prevents the default form submission behavior
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const handleSubmit = (event) => { 
    
    event.preventDefault();

    const data = {
      Username: username,
      Password: password
  };

  fetch("https://movies-fx-6586d0468f8f.herokuapp.com/login?username="+username+"&password="+password, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("Login response: ", data);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      onLoggedIn(data.user, data.token);
    } 
    else {
      alert("No such user");
    }
  })
  .catch((e) => {
    console.error("Login error: ", e, username, password);
    alert("Something went wrong");
  });
};

return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
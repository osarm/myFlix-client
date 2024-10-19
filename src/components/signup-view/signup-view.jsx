import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const SignupView = ({ onLoggedIn }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Name: name,
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    fetch("https://movies-fx-6586d0468f8f.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return fetch("https://movies-fx-6586d0468f8f.herokuapp.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Username: username, Password: password })
          });
        } else {
          return response.json().then((data) => {
            if (data.message) {
              throw new Error(data.message);
            } else {
              throw new Error("Signup failed");
            }
          });
        }
      })
      .then((loginResponse) => {
        if (loginResponse.ok) {
          return loginResponse.json();
        } else {
          throw new Error("Auto-login failed after signup");
        }
      })
      .then(({ user, token }) => {
        onLoggedIn(user, token);
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error during signup or login:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Name:</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength="3"
        />
      </Form.Group>

      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="3"
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDate">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </Form.Group>

      {error && <div className="text-danger mt-2">{error}</div>}

      <Button variant="primary" className="mt-3" type="submit">
        Signup
      </Button>
    </Form>
  );
};

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { registerUser } from "../api";

const CreateUserForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("supervisor");

  const handleSubmit = async () => {
    await registerUser({ username, password, role });
    alert("User Created!");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="mb-4">
      <h4>Create New User</h4>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="supervisor">Supervisor</option>
        <option value="operator">Operator</option>
      </select>
      <Button onClick={handleSubmit}>Create User</Button>
    </div>
  );
};

export default CreateUserForm;

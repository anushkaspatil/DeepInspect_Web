import React from "react";
import { Card, Button } from "react-bootstrap";

const SupervisorInfo = () => {
  return (
    <Card className="mt-4 p-4">
      <h1>Supervisor 1</h1>
      <p><strong>Name:</strong> ABCD LMN XYZ</p>
      <p><strong>Email:</strong> abcd@gmail.com</p>
      <p><strong>Username:</strong> abc@27</p>
      <p><strong>Password:</strong> 123456789</p>
      <p><strong>Role:</strong> Supervisor</p>
      <p><strong>Access:</strong> Granted</p>
      <Button variant="warning">Settings</Button>
    </Card>
  );
};

export default SupervisorInfo;

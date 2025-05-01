import React from "react";
import { Card, Button } from "react-bootstrap";

const grantAccess = () => alert("Access Granted!");
const revokeAccess = () => alert("Access Revoked!");

const AccessControl = () => {
  return (
    <Card className="mt-4 p-4" id="access">
      <h1>Access</h1>

      {/* Grant Access */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <p>Grant Access to Supervisor 1</p>
        <div>
          <Button variant="success" onClick={grantAccess}>Yes</Button>
          <Button variant="danger" className="ms-2">No</Button>
        </div>
      </div>

      {/* Revoke Access */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <p>Revoke Access from Supervisor 1</p>
        <div>
          <Button variant="success" onClick={revokeAccess}>Yes</Button>
          <Button variant="danger" className="ms-2">No</Button>
        </div>
      </div>
    </Card>
  );
};

export default AccessControl;

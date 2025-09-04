import { Button } from "@mui/material";
import React from "react";


function Error() {


  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          padding: "200px 0px"
        }}>
        <h1>404 - Page Not Found</h1>
        <Button variant="contained" style={{ width: 200 }} href="/login">
          Go to Login Page
        </Button>
      </div>
    </>
  );
}


export default Error;




import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Test = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ firstname: string; lastname: string }>(
          token
        );
        setFirstName(decoded.firstname);
        setLastName(decoded.lastname);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  return (
    <div>
      <p>First Name: {firstName}</p>
      <p>Last Name: {lastName}</p>
    </div>
  );
};

export default Test;

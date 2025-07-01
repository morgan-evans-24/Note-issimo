import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type Auth,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DBEntry } from "../types/DBEntry";
import {
  getNumberUsers,
  getUserId,
  getUsername,
  writeUserData,
} from "../config/firebase";
import LoginForm from "./LoginForm";
import "./Login.css";

interface Props {
  auth: Auth;
  setLoading: (loading: boolean) => void;
  setUsername: (username: string) => void;
}

const Login = ({ auth, setLoading, setUsername }: Props) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (
    email: string,
    password: string,
    username: string
  ) => {
    console.log("In handleSignup in Login, username = " + username);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const numUsers = await getNumberUsers();

        // Add following line in login form
        //setMessage("Signed in as " + user.email);

        const entry: DBEntry = {
          userId: numUsers,
          email: email,
          username: username,
          notes: [],
        };

        writeUserData(entry);
        setLoading(true);
        setUsername(username);
        navigate("/notes");
      })
      .catch((error) => {
        // Add following line in login form
        //setError(error.message);
      });
  };
  const handleLogin = async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userId = await getUserId(user);

        // Add following line in login form
        //setMessage("Signed in as " + user.email);
        setLoading(true);
        setUsername(await getUsername(userId));
        navigate("/notes");
      })
      .catch((error) => {
        // Add following line in login form
        //setError(error.message);
      });
  };

  return (
    <>
      <div className="introduction-page-div">
        <div className="introduction-text-div">
          <h1 className="introduction-header">Welcome to Noteissimo.</h1>
          <p className="introduction-subtext">Taking markdown notes simply.</p>
          <p className="introduction-instruction-text">
            Log in or Sign up below to get started!
          </p>
        </div>
        <div className="login-buttons">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => {
              setLoggingIn(true);
              setSigningUp(false);
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setSigningUp(true);
              setLoggingIn(false);
            }}
          >
            Sign Up
          </button>
        </div>
        {loggingIn || signingUp ? (
          <>
            <LoginForm
              signingUp={signingUp}
              handleLogin={handleLogin}
              handleSignup={handleSignup}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default Login;

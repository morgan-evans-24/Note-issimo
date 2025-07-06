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
import "./CSS/Login.css";
import { Button } from "react-bootstrap";
import TypeWriter from "typewriter-effect";

interface Props {
  auth: Auth;
  setLoading: (loading: boolean) => void;
  setUsername: (username: string) => void;
}

const Login = ({ auth, setLoading, setUsername }: Props) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (
    email: string,
    password: string,
    username: string,
    setError: (message: string) => void
  ) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const numUsers = await getNumberUsers();

        const entry: DBEntry = {
          userId: numUsers,
          email: email,
          username: username,
          notes: [],
        };

        writeUserData(entry);
        setUsername(username);
        navigate("/notes");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const handleLogin = async (
    email: string,
    password: string,
    setError: (message: string) => void
  ) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("Signing in in Login comp");
        const user = userCredential.user;
        const userId = await getUserId(user);

        setUsername(await getUsername(userId));
        setLoading(true);
        navigate("/notes");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
      <div className="introduction-page-div">
        <div className="color-gradient">
          <div className="introduction-text-div">
            <h1 className="introduction-header">
              {
                <TypeWriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("Welcome to Note-issimo.")
                      .pauseFor(2500)
                      .start();
                  }}
                />
              }
            </h1>
            <p className="introduction-subtext">
              Taking markdown notes simply.
            </p>
            <p className="introduction-instruction-text">
              Log in or Sign up below to get started!
            </p>
          </div>
          <div className="login-buttons">
            <Button
              variant="dark"
              className="shadow-lg"
              type="button"
              onClick={() => {
                setShowModal(true);
                setLoggingIn(true);
                setSigningUp(false);
              }}
            >
              Log In
            </Button>
            <Button
              variant="dark"
              className="shadow-lg"
              type="button"
              onClick={() => {
                setShowModal(true);
                setSigningUp(true);
                setLoggingIn(false);
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
        {loggingIn || signingUp ? (
          <>
            <LoginForm
              signingUp={signingUp}
              handleLogin={handleLogin}
              handleSignup={handleSignup}
              show={showModal}
              handleClose={() => setShowModal(false)}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default Login;

import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface Props {
  signingUp: boolean;
  handleLogin: (email: string, password: string) => void;
  handleSignup: (email: string, password: string, username: string) => void;
  show: boolean;
  handleClose: () => void;
}

const LoginForm = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // or

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                value={email}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {props.signingUp ? (
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  className="form-control"
                  id="username"
                  aria-describedby="usernameHelp"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            ) : null}

            {message && (
              <div className="alert alert-success mt-3">{message}</div>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.signingUp
                ? props.handleSignup(email, password, username)
                : props.handleLogin(email, password);
            }}
          >
            {props.signingUp ? "Sign Up" : "Log In"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginForm;

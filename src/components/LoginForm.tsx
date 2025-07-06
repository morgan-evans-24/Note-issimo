import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

interface Props {
  signingUp: boolean;
  handleLogin: (
    email: string,
    password: string,
    setError: (message: string) => void
  ) => void;
  handleSignup: (
    email: string,
    password: string,
    username: string,
    setError: (message: string) => void
  ) => void;
  show: boolean;
  handleClose: () => void;
}

const LoginForm = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Modal show={props.show} onHide={props.handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.signingUp ? "Signing Up" : "Logging In"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Check
              type="checkbox"
              label="Show my password"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          </Form.Group>

          {props.signingUp && (
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setError("");
            props.handleClose();
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.signingUp
              ? props.handleSignup(email, password, username, setError)
              : props.handleLogin(email, password, setError);
          }}
        >
          {props.signingUp ? "Sign Up" : "Log In"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginForm;

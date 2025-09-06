import { Form, Button, Alert, Container, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import API from '../API';



function TotpForm(props) {
  const [totpCode, setTotpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doTotpVerify = () => {
    API.totpVerify(totpCode)
      .then(() => {
        setErrorMessage('');
        props.totpSuccessful();
        navigate('/');
      })
      .catch(() => {
        setErrorMessage('Wrong code, please try again');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (totpCode === '' || totpCode.length !== 6) {
      setErrorMessage('Invalid code: must be 6 digits.');
      return;
    }

    doTotpVerify(totpCode);
  };

  return (
    <Container fluid className="d-flex vh-100 justify-content-center align-items-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-lg p-4 rounded-4">
            <Card.Body>
              <div className="text-center mb-4">
                <i className="bi bi-shield-lock fs-1 text-primary"></i>
                <h3 className="mt-2" style={{ color: "#6c63ff" }}>Two-Factor Authentication</h3>
                <p className="text-muted">Enter the 6-digit code from your app</p>
              </div>

              <Form onSubmit={handleSubmit}>
                {errorMessage && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setErrorMessage('')}
                  >
                    {errorMessage}
                  </Alert>
                )}

                <Form.Group controlId="totpCode" className="mb-3">
                  <Form.Label>Authentication Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={totpCode}
                    maxLength={6}
                    onChange={ev => setTotpCode(ev.target.value)}
                    placeholder="123456"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#6c63ff", border: "none" }}
                  >
                    <i className="bi bi-check-circle me-2"></i> Validate
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}


function LoginForm(props) {
  const [username, setUsername] = useState('harry@test.com');
  //const [username, setUsername] = useState('');
  const [password, setPassword] = useState('pwd');
  //const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setErrorMessage('');
        props.loginSuccessful(user);
      })
      .catch(() => {
        setErrorMessage('Wrong username or password');
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };
    console.log('Attempting login with credentials:', credentials);
    if (username === '' || password === '') {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    doLogIn(credentials);
  };

  return (
    <Container fluid className="d-flex vh-100 justify-content-center align-items-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-lg p-4 rounded-4">
            <Card.Body>
              <div className="text-center mb-4">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
                <h3 className="mt-2" style={{ color: "#6c63ff" }}>Login</h3>
              </div>

              <Form onSubmit={handleSubmit}>
                {errorMessage && (
                  <Alert
                    variant='danger'
                    dismissible
                    onClose={() => setErrorMessage('')}
                  >
                    {errorMessage}
                  </Alert>
                )}

                <Form.Group controlId='username' className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    placeholder="you@example.com"
                  />
                </Form.Group>

              <Form.Group controlId='password' className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    placeholder="********"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </Button>
                </InputGroup>
              </Form.Group> 

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    type='submit'
                    style={{ backgroundColor: "#6c63ff", border: "none" }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}













function LoginWithTotp(props) {
  if (props.loggedIn) {
    if (props.user.canDoTotp) {
        if (props.loggedInTotp) {
        return <Navigate replace to='/' />;
      } else {
        return <TotpForm totpSuccessful={() => props.setLoggedInTotp(true)} />;
      }
    } else {
      return <Navigate replace to='/' />;
    }
  } else {
    return <LoginForm loginSuccessful={props.loginSuccessful} />;
  }
}


export { LoginForm, TotpForm, LoginWithTotp };

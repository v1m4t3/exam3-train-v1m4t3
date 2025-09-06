import { Form, Button, Alert, Container, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import API from '../API';

function TotpForm(props) {
  const [totpCode, setTotpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('') ;

  const navigate = useNavigate();

  const doTotpVerify = () => {
    API.totpVerify(totpCode)
      .then( () => {
        setErrorMessage('');
        props.totpSuccessful();
        navigate('/');
      })
      .catch( () => {
        // NB: Generic error message
        setErrorMessage('Wrong code, please try again');
      })
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');

      // Some validation
      let valid = true;
      if (totpCode === '' || totpCode.length !== 6)
          valid = false;
      
      if (valid) {
        doTotpVerify(totpCode);
      } else {
        setErrorMessage('Invalid content in form: either empty or not 6-char long');
      }
  };
  
  return (
      <Container>
          <Row>
              <Col xs={3}></Col>
              <Col xs={6}>
                  <h2>Second Factor Authentication</h2>
                  <h5>Please enter the code that you read on your device</h5>
                  <Form onSubmit={handleSubmit}>
                      {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
                      <Form.Group controlId='totpCode'>
                          <Form.Label>Code</Form.Label>
                          <Form.Control type='text' value={totpCode} onChange={ev => setTotpCode(ev.target.value)} />
                      </Form.Group>
                      <Button className='my-2' type='submit'>Validate</Button>
                      <Button className='my-2 mx-2' variant='danger' onClick={()=>navigate('/')}>Cancel</Button>
                  </Form>
              </Col>
              <Col xs={3}></Col>
          </Row>
      </Container>
    )
   
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

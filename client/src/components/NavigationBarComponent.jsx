import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router';

function NavigationBar(props) {
  const name = props.user && props.user.name;

  return (
    <Navbar 
      expand="lg" 
      variant="dark" 
      style={{ backgroundColor: "#6c63ff" }}   // viola moderno
      className="px-3"
    >
      <Navbar.Brand className="mx-auto d-flex align-items-center gap-2 fs-4">
        <i className="bi bi-train-front" />
        {props.appName || "TrainStation"}
      </Navbar.Brand>

      {name ? (
        <div className="d-flex align-items-center gap-3">
          <Navbar.Text className='fs-6'>
            {`Signed in ${props.loggedInTotp ? '(2FA)' : ''} as: ` + name}
          </Navbar.Text>
          <Button variant='outline-light' size="sm" onClick={props.logout}>
            Logout
          </Button>
        </div>
      ) : (
        <Link to='/login'>
          <Button 
            variant='outline-light' 
            size="lg"
            className="d-flex align-items-center gap-2"
          >
            <i className="bi bi-person-circle"></i> Login
          </Button>
        </Link>
      )}
    </Navbar>
  );
}

export { NavigationBar };

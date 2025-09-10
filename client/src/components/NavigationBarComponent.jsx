import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router';

function NavigationBar(props) {
  const name = props.user && props.user.name + ' ' + props.user.surname;

  return (
    <>
    <Navbar 
      expand="lg" 
      variant="dark" 
      style={{ backgroundColor: "#6c63ff" }}  
      className="px-3 d-flex justify-content-between align-items-center fixed-top"
    >
      <Navbar.Brand className="d-flex align-items-center gap-2 fs-4">
        <i className="bi bi-train-front" />
        {props.appName || "TrainStation"}
      </Navbar.Brand>

      {name ? (
        <div className="d-flex align-items-center gap-3">
          <Navbar.Text className='fs-6'>
            Signed in {props.loggedInTotp ? '(2FA)' : ''} as: <strong className="text-white">{name}</strong>
          </Navbar.Text>
          {!props.loggedInTotp && (
            <Button 
              variant="warning" 
              size="lg" 
              className="d-flex align-items-center gap-2"
              onClick={() => window.location.href = '/login'}
            >
              <i className="bi bi-shield-lock"></i> 2FA
            </Button>
          )}
          <Button variant='outline-light' size="lg" onClick={props.logout}>
            <i className="bi bi-box-arrow-right"></i>
          </Button>
        </div>
      ) : (
        <Link to='/login' style={{ textDecoration: 'none' }}>
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

  {/* Spacer to avoid content being hidden behind the fixed navbar */}
    <div style={{ height: '65px' }}></div> 
    </>
  );
}

export { NavigationBar };

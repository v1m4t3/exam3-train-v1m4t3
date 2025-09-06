import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router';

function NavigationBar(props) {
  const name = props.user && props.user.name;

	return (
		<Navbar bg="primary" variant="dark" className="d-flex justify-content-between">
      <Navbar.Brand className="mx-2">
        <i className="bi bi-train-front" />
        {/* props.appName just in case you want to set a different app name */}
        {props.appName || "TrainStation"}
      </Navbar.Brand>
      {name ? <div>
        <Navbar.Text className='fs-5'>
          {`Signed in ${props.loggedInTotp? '(2FA)' : ''} as: ` + name}
        </Navbar.Text>
        <Button className='mx-2' variant='danger' onClick={props.logout}>Logout</Button>
      </div> :
        <Link to='/login'>
          <Button className='mx-2' variant='warning'>Login</Button>
        </Link>}
    </Navbar>
  );
}
export { NavigationBar };
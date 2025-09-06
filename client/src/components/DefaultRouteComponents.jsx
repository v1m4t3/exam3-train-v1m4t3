import { Container } from 'react-bootstrap';
import { Link } from 'react-router';

function DefaultRoute(props) {
  return (
    <Container fluid>
      <p className="my-2">No data here: This is not a valid page!</p>
      <Link to='/'>Please go back to main page</Link>
    </Container>
  );
}
export { DefaultRoute };
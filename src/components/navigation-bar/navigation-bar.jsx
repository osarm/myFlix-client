import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    navigate(`/users/${encodeURIComponent(user._id)}`); // Navigate to the profile route
  };

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" 
        // onClick={handleMovielistClick}
        >
          MoviesFx
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && user._id && (
              <>
                {/* <Nav.Link as={Link} to="/favoritemovies">
                  Favorite Movies
                </Nav.Link> */}
                <Nav.Link
                  as={Link}
                  to={`/users/${encodeURIComponent(user._id)}`}
                  onClick={handleProfileClick}
                >
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={onLoggedOut}>
                  Log Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
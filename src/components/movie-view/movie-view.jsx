import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./movie-view.scss";
import Col from 'react-bootstrap/Col';
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const movie = movies.find((b) => b._id === movieId)

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <>
      <Row className="mb-4">
        <Col md={6}>
          <img className="w-100" src={movie.ImagePath} alt={movie.Title} />
        </Col>
        <Col md={6}>
          <Row className="mb-3">
            <Col>
              <h2>Movie Details</h2>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs="auto" className="font-weight-bold">Title:</Col>
            <Col>{movie.Title}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs="auto" className="font-weight-bold">Description:</Col>
            <Col>{movie.Description}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs="auto" className="font-weight-bold">Director:</Col>
            <Col>{movie.Director.Name}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs="auto" className="font-weight-bold">Genre:</Col>
            <Col>{movie.Genre.Name}</Col>
          </Row>
          <Row>
            <Col className="text-left">
              <Link to={`/`}>
                <Button className="back-button">Back</Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

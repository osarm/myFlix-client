import "./movie-view.scss";
import Col from 'react-bootstrap/Col'
import Row from "react-bootstrap/Row";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <Row className="justify-content-md-center mt-5">
       <Col md={6}>
        <img src={movie.image} />
        </Col>
      <Col md={6}>
      <div>
        <span>Title: </span>
        <span>{movie.Title}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.Description}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.Director.Name}</span>
      </div>
      

      <button 
      onClick={onBackClick} className="back-button md={3}"
      style={{ cursor: "pointer" }}
      >Back</button>
      </Col>
    </Row>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const ProfileView = ({ movies }) => {
  const [userData, setUserData] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({
    Username: '', Password: '', Email: '', Birthday: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const username = useMemo(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return JSON.parse(storedUser)?.Username || storedUser;
    } catch {
      return storedUser;
    }
  }, []);

  const fetchUserData = () => {
    if (!username || !token) return setLoading(false);

    fetch(`https://movies-fx-6586d0468f8f.herokuapp.com/users/${username}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUserData({
          Username: data.Username, Email: data.Email,
          Birthday: data.Birthday ? new Date(data.Birthday).toISOString().substr(0, 10) : '',
          FavoriteMovies: data.FavoriteMovies
        });
        setLoading(false);
      })
      .catch(err => setError('Failed to fetch user data.'));
  };

  useEffect(() => fetchUserData(), [username, token]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUpdatedUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setError(null); setSuccess(null);
    fetch(`https://movies-fx-6586d0468f8f.herokuapp.com/users/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...userData, ...updatedUserData
      })
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setSuccess('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(() => setError('Failed to update profile.'));
  };

  const handleDeregister = () => {
    setError(null); setSuccess(null);
    fetch(`https://movies-fx-6586d0468f8f.herokuapp.com/users/${username}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setSuccess('Profile deleted successfully.');
        localStorage.clear();
        navigate('/');
      })
      .catch(() => setError('Failed to delete profile.'));
  };

  const handleRemoveFavorite = (movieId) => {
    fetch(`https://movies-fx-6586d0468f8f.herokuapp.com/users/${username}/movies/${movieId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setUserData(prev => ({
        ...prev,
        FavoriteMovies: prev.FavoriteMovies.filter(id => id !== movieId)
      })))
      .catch(() => setError('Failed to remove movie.'));
  };

  const favoriteMovies = useMemo(() => {
    return userData ? movies.filter(m => userData.FavoriteMovies.includes(m._id)) : [];
  }, [movies, userData]);

  if (loading) return <Spinner animation="border" role="status" />;

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {userData.Username}</p>
      <p><strong>Email:</strong> {userData.Email}</p>
      <p><strong>Birthday:</strong> {userData.Birthday}</p>
      <Form>
        {['Username', 'Password', 'Email', 'Birthday'].map(field => (
          <Form.Group key={field} controlId={`form${field}`}>
            <Form.Label>{`Update ${field}`}</Form.Label>
            <Form.Control type={field === 'Password' ? 'password' : 'text'} name={field} value={updatedUserData[field]} onChange={handleInputChange} />
          </Form.Group>
        ))}
        <Button onClick={handleSubmit}>Update Profile</Button>
      </Form>
      <Button variant="danger" onClick={handleDeregister}>Delete Profile</Button>
      <h3>Favorite Movies</h3>
      {favoriteMovies.length === 0 ? (
        <p>No favorite movies</p>
      ) : (
        favoriteMovies.map(movie => (
          <Card key={movie._id}>
            <Card.Body>
              <Card.Title>{movie.Title}</Card.Title>
              <Button variant="danger" onClick={() => handleRemoveFavorite(movie._id)}>Remove</Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

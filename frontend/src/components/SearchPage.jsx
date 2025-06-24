import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [ratingInputs, setRatingInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [existingRatings, setExistingRatings] = useState({});
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userID');
  if (!token) {
    navigate('/login');
    return;
  }

  const fetchRatings = async () => {
  try {
    const res = await api.get(`/ratings/getRatingByUser?user_id=${userId}`);
    console.log('Fetched ratings data:', res.data);

    const ratingsArray = res.data.ratings;  // <-- access the array inside the object

    if (!Array.isArray(ratingsArray)) {
      console.error('Expected ratings array but got:', ratingsArray);
      return;
    }

    const ratingsMap = {};
    ratingsArray.forEach(r => {
      ratingsMap[r.giphy_id] = r.rating;
    });

    setExistingRatings(ratingsMap);
    setRatingInputs(ratingsMap);
  } catch (err) {
    console.error('Failed to load ratings', err);
  }
};


  fetchRatings();
}, [navigate]);

  const handleSearch = async () => {
    try {
      const res = await api.get(`/giphy/search?q=${query}`);
      setResults(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching Giphy');
    }
  };

  const handleRatingChange = (giphyId, value) => {
    setRatingInputs({ ...ratingInputs, [giphyId]: value });
  };

  const handleCommentChange = (giphyId, value) => {
    setCommentInputs({ ...commentInputs, [giphyId]: value });
  };

  const submitRating = async (giphyId) => {
  const userId = localStorage.getItem('userID');
  const rating = parseInt(ratingInputs[giphyId]);

  if (!userId || isNaN(rating) || rating < 1 || rating > 5) {
    alert('Rating must be a number between 1 and 5');
    return;
  }

  try {
    await api.post('/ratings', {
      user_id: userId,
      giphy_id: giphyId,
      rating,
    });
    alert('Rating submitted');
    // Optionally update existingRatings
    setExistingRatings(prev => ({ ...prev, [giphyId]: rating }));
  } catch (err) {
    console.error(err);
    alert('Error submitting rating');
  }
};


  const submitComment = async (giphyId) => {
    try {
      const userId = localStorage.getItem('userID'); // ✅ Same here
      await api.post('/comments', {
        user_id: userId,
        giphy_id: giphyId,
        comment: commentInputs[giphyId],
      });
      alert('Comment submitted');
    } catch (err) {
      console.error(err);
      alert('Error submitting comment');
    }
  };

  const renderStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };


  return (
    <>
      <h2>Giphy Search</h2>
      <div>
        <input 
          type="text" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Search gifs..." 
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '10px',
        marginTop: '20px',
    }}>
        {results.map(gif => (
          <div key={gif.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img
                src={gif.images.fixed_height.url}
                alt={gif.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            <div>
              <h4>Rate this GIF</h4>
              <input 
                type="number" 
                min="1" 
                max="5" 
                placeholder="1-5" 
                value={ratingInputs[gif.id] || ''} 
                onChange={e => handleRatingChange(gif.id, e.target.value)} 
              />
              <button onClick={() => submitRating(gif.id)}>Submit Rating</button>
              {existingRatings[gif.id] && (
                <p>{renderStars(existingRatings[gif.id])}</p>
                )}
            </div>

            <div>
              <h4>Comment on this GIF</h4>
              <textarea 
                placeholder="Leave a comment..." 
                value={commentInputs[gif.id] || ''} 
                onChange={e => handleCommentChange(gif.id, e.target.value)} 
              />
              <button onClick={() => submitComment(gif.id)}>Submit Comment</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchPage;

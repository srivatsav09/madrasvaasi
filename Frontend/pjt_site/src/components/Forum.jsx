import { useState, useEffect } from 'react';
import bg from '../assets/newsbg.svg';
import '@fontsource/league-spartan';
import Marquee from "react-fast-marquee";
import Navbar from './Navbar';
import axios from 'axios';
import { useAuth } from '../AuthContext';
const Forum = () => {

  const [locations, setLocations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [locationId,setLocationId] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://127.0.0.1:8000/api/locations/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Failed to load locations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchLocations();
    }
  }, [token]);

  const handleButtonClick = async(locationId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://127.0.0.1:8000/api/locations/${locationId}/posts/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPosts(response.data);
      setLocationId(locationId);

      // Fetch comments for each post
      response.data.forEach(async (post) => {
        const commentsResponse = await axios.get(`http://127.0.0.1:8000/api/locations/${locationId}/posts/${post.id}/comments/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComments((prevComments) => ({
          ...prevComments,
          [post.id]: commentsResponse.data
        }));
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (locationId, postId, userId) => {
    if (!newComment[postId]?.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setError(null);
      const data = {
        "user": userId,
        "post": postId,
        "content": newComment[postId]
      }
      await axios.post(`http://127.0.0.1:8000/api/locations/${locationId}/posts/${postId}/comments/`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const response = await axios.get(`http://127.0.0.1:8000/api/locations/${locationId}/posts/${postId}/comments/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComments((prevComments) => ({
        ...prevComments,
        [postId]: response.data
      }));
      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
    }
  };

  const handlePostSubmit = async (locationId, userId) => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setError(null);
      const data = {
        "user": userId,
        "location": locationId,
        "title": newPostTitle,
        "content": newPostContent,
      }

      await axios.post(`http://127.0.0.1:8000/api/locations/${locationId}/posts/`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const response = await axios.get(`http://127.0.0.1:8000/api/locations/${locationId}/posts/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPosts(response.data);
      setNewPostTitle('');
      setNewPostContent('');
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Failed to submit post. Please try again.');
    }
  };

  return (
    <div className="bg-cover min-h-[642px] h-screen bg-center bg-[#01041C]" style={{backgroundImage: `URL(${bg})`, backgroundRepeat: "no-repeat"}}>
      <Navbar />
      <div>
        <div className="text-[110px] text-white mt-[2%] pl-[5%] absolute" style={{ fontWeight: 1000 }}> LATEST NEWS</div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

      <Marquee speed={90} className='mt-[13%]'>
        {locations.map(location => (
          <div key={location.id} className='pl-20' style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
            <button
              style={{
                width: '335px',
                height: '292px',
                background: '#fff',
                borderRadius: '25px',
                border: 'none',
                padding: '0',
                position: 'relative'
              }}
              onClick={() => handleButtonClick(location.id)}
            >
              <span style={{ position: 'absolute', top: '10px', left: '10px', color: '#000', fontWeight: 'bold' }}>
                {location.name}
              </span>
              <span style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#000', fontWeight: 'bold' }}>
                {location.post_count} posts
              </span>
            </button>
          </div>
        ))}
      </Marquee>
      <div style={{ position: 'relative', width: '1022px', backgroundColor: '#f0f0f0', marginTop: '70px', marginLeft: '220px', borderRadius: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
      {/* Heading for posts */}
      <h1 style={{ textAlign: 'center', padding: '20px 0', fontSize: '2rem', color: '#333' }}>Feed</h1>
      
      {/* SVG-like rectangle */}
      <div style={{ padding: '20px' }}>
        {/* Render posts */}
        {posts.map((post, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            {/* Individual post */}
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '15px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{post.title}</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>{post.content}</p>
            </div>
            {/* Add comment section */}
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            <input type="text" value={newComment[post.id]} onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })} placeholder="Add a comment..." style={{ flex: '1', marginRight: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <button onClick={() => handleCommentSubmit(post.location_id, post.id, user?.id)} style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#3897f0', color: '#fff', border: 'none', cursor: 'pointer' }}>Post</button>
            </div>
            <br />
            {/* Display comments for this post */}
            {comments[post.id] && comments[post.id].map((comment, index) => (
              <div key={index} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '15px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>{comment.content}</p>
                <br />
              </div>
            ))}
          </div>
        ))}

      </div>
      <div style={{ padding: '20px', borderTop: '1px solid #ccc' }}>
      <input
          className="w-full bg-white rounded-md py-2 px-3 mb-2 outline-none"
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Enter post title"
        />
        <textarea
          className="w-full bg-white rounded-md py-2 px-3 mb-2 outline-none"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Enter post content"
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => handlePostSubmit(locationId, user?.id)}
        >
          Add Post
        </button>
      </div>

      
    </div>


    </div>
  );
}

export default Forum;

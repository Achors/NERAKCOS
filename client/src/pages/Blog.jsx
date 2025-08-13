import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import YouTube from 'react-youtube';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch posts from backend
  useEffect(() => {
    fetch('/api/blog')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  const handlePostClick = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, isRead: true } : post
    );
    setPosts(updatedPosts);
    setSelectedPost(updatedPosts.find((post) => post.id === postId));
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  // Background image rotation
  const backgroundImages = ['/tote_1.png', '/tote_2.png', '/tote_3.png'];
  const [currentBackground, setCurrentBackground] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // YouTube video ID
  const videoId = 'YWxjOaJEXhw';

  // YouTube player options
  const youtubeOptions = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section with Changing Background */}
      <section
        className="relative h-96 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${backgroundImages[currentBackground]})` }}
      >
        <div className="absolute inset-0 bg-slate bg-opacity-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-montserrat font-bold mb-4">Behind the Scenes</h1>
            <p className="text-lg font-montserrat mb-6">Updates from the NERAKCOS workshop</p>
            <Link to="/contact" className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-slate-200 transition">
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      <div className="flex-1 flex flex-col md:flex-row px-4 py-8 gap-4 w-full">
        {/* Sidebar: Post List */}
        <aside className="md:w-1/3 bg-slate-100 rounded-lg shadow-lg p-4 overflow-y-auto max-h-[600px]">
          <h2 className="text-2xl font-montserrat font-bold mb-4">Posts</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className={`cursor-pointer p-4 rounded-lg border border-slate-300 hover:bg-slate-100 transition duration-200 ${
                  post.isRead ? 'text-slate-500' : 'text-black font-bold'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img src={post.thumbnail} alt={post.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="text-lg font-montserrat">{post.title}</h3>
                    <p className="text-sm text-gray-500">{post.date}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content: Selected Post */}
        <main className="md:w-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[600px]">
          {selectedPost ? (
            <div>
              <button onClick={handleBack} className="text-blue-500 mb-4 hover:underline">
                Back to Posts
              </button>
              <h1 className="text-3xl font-montserrat font-bold mb-4">{selectedPost.title}</h1>
              <img src={selectedPost.thumbnail} alt={selectedPost.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              <p className="text-gray-700 leading-relaxed">{selectedPost.content}</p>
              <p className="text-sm text-gray-500 mt-4">{selectedPost.date}</p>
            </div>
          ) : (
            <p className="text-center text-gray-500">Select a post to read the story.</p>
          )}
        </main>
      </div>

      {/* Video Section Above Footer */}
      <section className="bg-slate-50 p-6 rounded-lg shadow-lg mx-auto w-1/2 min-w-[50%] max-w-4xl mb-8">
        <h2 className="text-2xl font-montserrat font-bold mb-4">Watch Our Latest Videos</h2>
        <div className="w-full">
          <YouTube videoId={videoId} opts={youtubeOptions} className="w-full" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
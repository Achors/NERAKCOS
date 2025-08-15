import React, { useState, useEffect } from 'react';
import { api, fetchApi } from '../api'; 

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    thumbnail: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [editPost, setEditPost] = useState(null);

  // Fetch posts from database on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(api.blog.list());
      setPosts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPG, JPEG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be less than 5MB');
      return;
    }

    try {
      setImageUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('image', file);

      // Use the full API URL for upload
      const response = await fetch(api.blog.upload(), {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      setNewPost({ ...newPost, thumbnail: data.image_url });
    } catch (err) {
      setError(err.message);
      console.error('Error uploading image:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPost) {
        // Update existing post
        const result = await fetchApi(api.blog.update(editPost.id), {
          method: 'PUT',
          body: JSON.stringify(newPost)
        });
        
        // Update local state with the returned data
        setPosts(posts.map(p => p.id === editPost.id ? result : p));
        setEditPost(null);
      } else {
        // Create new post
        const result = await fetchApi(api.blog.create(), {
          method: 'POST',
          body: JSON.stringify(newPost)
        });
        
        // Add new post to local state with the returned data
        setPosts([...posts, result]);
      }
      
      // Reset form
      setNewPost({ 
        title: '', 
        content: '', 
        thumbnail: '', 
        date: new Date().toISOString().split('T')[0] 
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving post:', err);
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      thumbnail: post.thumbnail,
      date: post.date.split('T')[0] // Convert ISO date to YYYY-MM-DD format
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetchApi(api.blog.delete(id), {
        method: 'DELETE'
      });
      
      // Remove from local state
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting post:', err);
    }
  };

  const handleCancel = () => {
    setEditPost(null);
    setNewPost({ 
      title: '', 
      content: '', 
      thumbnail: '', 
      date: new Date().toISOString().split('T')[0] 
    });
    setError(null);
  };

  const removeImage = () => {
    setNewPost({ ...newPost, thumbnail: '' });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-montserrat font-bold mb-4">Manage Blog Posts</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>Error: {error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="title"
          value={newPost.title}
          onChange={handleInputChange}
          placeholder="Post Title"
          className="w-full p-2 border rounded focus:outline-none focus:border-slate-500"
          required
        />
        
        <textarea
          name="content"
          value={newPost.content}
          onChange={handleInputChange}
          placeholder="Post Content"
          className="w-full p-2 border rounded h-32 focus:outline-none focus:border-slate-500"
          required
        />

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail Image
          </label>
          
          {/* Current image preview */}
          {newPost.thumbnail && (
            <div className="relative inline-block">
              <img 
                src={newPost.thumbnail} 
                alt="Thumbnail preview" 
                className="w-32 h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          
          {/* File upload input */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
            />
            {imageUploading && (
              <div className="text-sm text-gray-500">Uploading...</div>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            Upload PNG, JPG, JPEG, GIF, or WebP files (max 5MB)
          </p>
        </div>

        <input
          type="date"
          name="date"
          value={newPost.date}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-slate-500"
        />
        
        <div className="flex space-x-2">
          <button 
            type="submit" 
            disabled={imageUploading}
            className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {imageUploading ? 'Uploading...' : (editPost ? 'Update Post' : 'Add Post')}
          </button>
          {editPost && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-semibold">
          Posts ({posts.length})
        </h3>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Create your first post above!</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="bg-gray-50 p-4 rounded-lg shadow">
                <h4 className="text-lg font-montserrat font-bold">{post.title}</h4>
                <p className="text-gray-600 mt-1">
                  {post.content.length > 100 
                    ? `${post.content.substring(0, 100)}...` 
                    : post.content
                  }
                </p>
                {post.thumbnail && (
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-32 h-32 object-cover rounded mt-2 border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <div className="mt-2 space-x-2">
                  <button 
                    onClick={() => handleEdit(post)} 
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this post?')) {
                        handleDelete(post.id);
                      }
                    }} 
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
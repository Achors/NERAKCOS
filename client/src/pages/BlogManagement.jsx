import React, { useState } from 'react';

const BlogManagement = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'New Handbag Prototype in Progress', content: 'Today, we started crafting...', date: 'August 06, 2025', thumbnail: '/tote_1.png' },
    { id: 2, title: 'Behind the Scenes: Dyeing Fabrics', content: 'Dyeing our fabrics is an art...', date: 'August 05, 2025', thumbnail: '/tote_2.png' },
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
  const [editPost, setEditPost] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editPost) {
      setPosts(posts.map(p => p.id === editPost.id ? { ...editPost, ...newPost } : p));
      setEditPost(null);
    } else {
      setPosts([...posts, { id: Date.now(), ...newPost }]);
    }
    setNewPost({ title: '', content: '', thumbnail: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setNewPost(post);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-montserrat font-bold mb-4">Manage Blog Posts</h2>
      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="title"
          value={newPost.title}
          onChange={handleInputChange}
          placeholder="Post Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="content"
          value={newPost.content}
          onChange={handleInputChange}
          placeholder="Post Content"
          className="w-full p-2 border rounded h-32"
        />
        <input
          type="text"
          name="thumbnail"
          value={newPost.thumbnail}
          onChange={handleInputChange}
          placeholder="Thumbnail URL (e.g., /tote_1.png)"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={newPost.date}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">
          {editPost ? 'Update Post' : 'Add Post'}
        </button>
        {editPost && (
          <button type="button" onClick={() => { setEditPost(null); setNewPost({ title: '', content: '', thumbnail: '', date: new Date().toISOString().split('T')[0] }); }} className="ml-2 text-red-500 hover:text-red-700">
            Cancel
          </button>
        )}
      </form>
      {/* Posts List */}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-montserrat font-bold">{post.title}</h3>
            <p className="text-gray-600">{post.content.substring(0, 100)}...</p>
            <img src={post.thumbnail} alt={post.title} className="w-32 h-32 object-cover rounded mt-2" />
            <p className="text-sm text-gray-500 mt-2">{post.date}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(post)} className="text-blue-500 hover:text-blue-700">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogManagement;
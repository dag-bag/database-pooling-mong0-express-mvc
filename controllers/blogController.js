const casual = require("casual");
const redisClient = require("../config/redis");

const Blog = require("../model/Blog");

const getAllBlogs = async (req, res) => {
  try {
    const cachedBlogs = await redisClient.lrangeAsync("allBlogs", 0, -1);

    if (cachedBlogs.length > 0) {
      console.log("Data retrieved from Redis cache");
      const parsedBlogs = cachedBlogs.map((blog) => JSON.parse(blog));
      return res.json(parsedBlogs);
    }

    // If not in cache, fetch data from MongoDB
    const blogs = await Blog.find();

    // Set data in Redis cache as a list with an expiration time (e.g., 1 hour)
    const redisData = blogs.map((blog) => JSON.stringify(blog));
    await redisClient.lpushAsync("allBlogs", ...redisData);
    await redisClient.expireAsync("allBlogs", 3600);

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createNewBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content, and author are required." });
    }

    const newBlog = new Blog({ title, content, author });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ message: `Blog ID ${req.params.id} not found` });
    }

    const { title, content, author } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (author) blog.author = author;

    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ message: `Blog ID ${req.params.id} not found` });
    }

    await blog.remove();

    res.json({ message: `Blog ID ${req.params.id} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ message: `Blog ID ${req.params.id} not found` });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addFakeBlogs = async (req, res) => {
  try {
    const numBlogsToAdd = req.params.count || 10; // Default to 10 if count is not provided

    const fakeBlogs = Array.from({ length: numBlogsToAdd }, () => ({
      title: casual.sentence,
      content: casual.sentences(10),
      author: casual.full_name,
    }));

    const addedBlogs = await Blog.create(fakeBlogs);

    res.status(201).json(addedBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllBlogs,
  createNewBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  addFakeBlogs,
};

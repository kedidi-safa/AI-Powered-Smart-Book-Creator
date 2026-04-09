const Book = require("../models/Book");

// @desc.   Create new book
// @route.  Post /api/books
// @access. Private
const createBook = async (req, res) => {
  try {
    const { title, author, subtitle, chapters } = req.body;
    if (!title || !author) {
      return res
        .status(403)
        .json({ message: "Please provide a title and author" });
    }

    const book = await Book.create({
      userId: req.user._id,
      title,
      author,
      subtitle,
      chapters,
    });
    res.status(201).json(book);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Get all books
// @route.  Get /api/books
// @access. Private
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(books);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Get a single book
// @route.  Get /api/books/:id
// @access. Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book does not exist" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this book" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Update book
// @route.  Put /api/books/:id
// @access. Private
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book does not exist" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this book" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Delete book
// @route.  Delete /api/books
// @access. Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book does not exist" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this book" });
    }

    await book.deleteOne();

    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Update book cover image
// @route.  Put /api/books/cover/:id
// @access. Private
const updateBookCover = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book does not exist" });
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this book" });
    }
    if (req.file) {
      book.coverImage = `/${req.file.path}`;
    } else {
      return res.status(400).json({ message: "No image file provided" });
    }

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
};

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";

import { Book, Plus } from "lucide-react";
import BookCard from "../components/cards/BookCard";
import toast from "react-hot-toast";
import CreateBookModal from "../components/modals/createBookModal";

const BookCardSkeleton = () => {
  <div className="animate-pulse flex space-x-4 bg-white p-4 rounded-lg shadow border border-slate-200">
    <div className="max-w-fit aspect-[16/25] bg-slate-300 rounded-r-lg"></div>
    <div className="p4 flex-1 space-y-4">
      <div className="h-6 bg-slate-300 rounded x-3/4 mb-2"></div>
      <div className="h-4 bg-slate-300 rounded x-1/2"></div>
    </div>
  </div>;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="flex items-center justify-center bg-white rounded-lg p-6 space-y-4 w-full max-w-md">
        <div
          className="fixed inset-0 bg-white/50 bg-opacity-25 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="bg-white rounded-lg p-6 space-y-4 relative z-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  console.log("DashboardPage rendered with books: ", books);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch books: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleCreateBookOpen = async () => {
    setIsCreateModalOpen(true);
  };
  const handleCreateBookClose = (newBookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${newBookId}`);
  };
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete._id}`);
      setBooks(books.filter((b) => b._id !== bookToDelete._id));
      setBookToDelete(null);
    } catch (error) {
      console.error("Failed to delete book: ", error);
      toast.error(error.response?.data?.message || "Failed to delete book. Please try again.");
    } finally {
      setBookToDelete(null);
    }
  };
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              All Smart Books
            </h1>
            <p className="text-[13px] text-slate-600 mt-1">
              Create and manage your smart books with ease.
            </p>
          </div>
          <Button className="whitespace-nowrap" onClick={handleCreateBookOpen}>
            Create New Book
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-300 rounded-xl mt-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-slate-400 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              No Books Found
            </h3>
            <p className="text-sm text-slate-600 max-w-md mt-2">
              Start by creating your first smart book!
            </p>
            <Button className="mt-6" icon={Plus} onClick={handleCreateBookOpen}>
              Create Your First Book
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={() => setBookToDelete(book)}
              />
            ))}
          </div>
        )}
        <ConfirmationModal
          isOpen={!!bookToDelete}
          onClose={() => setBookToDelete(null)}
          onConfirm={handleDeleteBook}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the book "${bookToDelete?.title}"? This action cannot be undone.`}
        />

        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={()=> setIsCreateModalOpen(false)}
          onBookCreated={handleCreateBookClose}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

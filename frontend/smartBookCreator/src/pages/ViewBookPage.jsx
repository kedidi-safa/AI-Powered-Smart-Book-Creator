import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Book } from "lucide-react";
import ViewBook from "../components/view/ViewBook";

const ViewBookSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
    <div className="flex gap-8">
      <div className="w-1/4">
        <div className="h-96 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="w-3/4">
        <div className="h-full bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const ViewBookPage = () => {
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.BOOKS.GET_BOOK_BY_ID + `/${bookId}`,
        );
        setBook(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch the book.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);
  return (
    <DashboardLayout>
      {isLoading ? (
        <ViewBookSkeleton />
      ) : book ? (
        <ViewBook book={book} />
      ) : (
        <div className="flex items-center flex-col justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-2">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Book className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">eBook Not Found</h3>
          <p className="text-slate-400 mb-6 .ax-w-md">The book you are looking for does not exist</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ViewBookPage;

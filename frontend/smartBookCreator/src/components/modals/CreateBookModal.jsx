import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../ui/Modal";
import InputField from "../ui/InputField";
import {
  ArrowLeft,
  BookOpen,
  Hash,
  Lightbulb,
  Palette,
  Plus,
  Sparkle,
  Trash2,
} from "lucide-react";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [numChapters, setNumChapters] = useState(5);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [chapters, setChapters] = useState([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const chapterContainerRef = useRef();

  const resetModal = () => {
    setStep(1);
    setTitle("");
    setNumChapters(5);
    setAiTopic("");
    setAiStyle("Informative");
    setChapters([]);
    setIsGeneratingOutline(false);
    setIsFinalizing(false);
  };

  const handleGenerateOutline = async () => {
    if (!title || !numChapters) {
      toast.error("Please provide a title and number of chapters");
      return;
    }
    setIsGeneratingOutline(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
        topic: title,
        description: aiTopic || "",
        style: aiStyle,
        numChapters,
      });
      setChapters(response.data);
      setStep(2);
      toast.success(
        "Outline generated successfully! Now you can review and edit the chapters before finalizing your book.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to generate outline. Please try again.",
      );
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  const handleDeleteChapter = (index) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      { title: `Chapter ${chapters.length + 1}`, description: "" },
    ]);
  };

  const handleFinalizeBook = async () => {
    if (!title || chapters.length === 0) {
      toast.error("Please provide a title and at least one chapter");
      return;
    }
    setIsFinalizing(true);
    try {
      const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
        title: title,
        author: user.name,
        chapters: chapters,
      });
      toast.success("Book created successfully!");
      onBookCreated(response.data.book);
      onClose();
      resetModal();
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create book. Please try again.",
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  useEffect(() => {
    if (step === 2 && chapterContainerRef.current) {
      const scrollableDiv = chapterContainerRef.current;
      scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chapters.length, step]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetModal();
        onClose();
      }}
      title="Create New Book"
    >
      {step === 1 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
              1
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-400 text-sm font-semibold rounded-full">
              2
            </div>
          </div>

          <InputField
            icon={BookOpen}
            label="Book Title"
            placeholder="Enter book title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputField
            icon={Hash}
            label="Nimber of Chapters"
            type="number"
            placeholder="5"
            value={numChapters}
            onChange={(e) => setNumChapters(e.target.value || 1)}
            min="1"
            max="20"
          />

          <InputField
            icon={Lightbulb}
            label="Topic (Optional)"
            placeholder="Specific topic or theme for AI to generate outline around"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
          />

          <SelectField
            icon={Palette}
            label="Writing Style"
            value={aiStyle}
            onChange={(e) => setAiStyle(e.target.value)}
            options={[
              "Informative",
              "Storytelling",
              "Casual",
              "Professional",
              "Conversational",
              "Humorous",
              "Formal",
            ]}
          />

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleGenerateOutline}
              isLoading={isGeneratingOutline}
              icon={Sparkle}
            >
              Generate Outline with AI
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-5">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
              ✓
            </div>
            <div className="flex-1 h-0.5 bg-yellow-600"></div>
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
              2
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Chapters
            </h3>
            <span className="text-sm text-gray-500">
              {chapters.length} chapters
            </span>
          </div>

          <div
            className="space-y-3 max-h-96 overflow-y-auto pr-1"
            ref={chapterContainerRef}
          >
            {chapters.length === 0 ? (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-xl">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No chapters generated. Add one to get started.
                </p>
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="group p-4 border border-gray-200 rounded-xl hover:bg-gray-300 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-50 text-yellow-600 text-xs font-semibold flex-shrink-0 mt-2">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) =>
                        handleChapterChange(index, "title", e.target.value)
                      }
                      className="flex-1 text-base font-medium border-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 mt-2"
                      placeholder="Chapter title"
                    />
                    <button
                      onClick={() => handleDeleteChapter(index)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                      title="Delete Chapter"
                    >
                      <Trash2 className="h-4 w-4 texst-red-500" />
                    </button>
                  </div>
                  <textarea
                    value={chapter.description}
                    onChange={(e) =>
                      handleChapterChange(index, "description", e.target.value)
                    }
                    className="w-full pl-9 text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder-gray-400"
                    placeholder="Brief description or key points for this chapter"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleAddChapter}
                icon={Plus}
              >
                Add Chapter
              </Button>
              <Button onClick={handleFinalizeBook} isLoading={isFinalizing}>
                Create eBook
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateBookModal;

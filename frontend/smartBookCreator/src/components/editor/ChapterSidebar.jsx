import React from "react";
import { useNavigate } from "react-router";
import Button from "../ui/Button";
import { ArrowLeft, GripVertical, Plus, Sparkle, Trash2 } from "lucide-react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({
  chapter,
  index,
  selectedChapterIndex,
  onSelectChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter._id || `new-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
    >
      <button
        className={`flex-1 flex items-center p-3 text-sm rounded-lg text-left transition-colors duration-200 ${
          selectedChapterIndex === index
            ? "bg-yellow-50/50 text-yellow-800 font-semibold"
            : "text-slate-600 hover:bg-gray-100"
        }`}
        onClick={() => onSelectChapter(index)}
      >
        <GripVertical className="w-4 h-4 text-slate-400 mr-2 cursor-grab" {...listeners} {...attributes} />
        <span className="truncate">{chapter.title}</span>
      </button>
      <div className="flex items-center ml-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity px-2 py-3 absolute right-0">
        <Button
          variant="ghost"
          size="small"
          className="py-2 px-2"
          onClick={() => onGenerateChapterContent(index)}
          isLoading={isGenerating === index}
          title="Generate Content"
        >
          {isGenerating !== index && <Sparkle className="w-3.5 h-3.5 text-yellow-800" />}
        </Button>
        <Button
          variant="ghost"
          size="small"
          className="py-2 px-2"
          onClick={() => onDeleteChapter(index)}
          title="Delete Content"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

const ChapterSidebar = ({
  book,
  selectedChapterIndex,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
  onReorderChapters,
}) => {
  const navigate = useNavigate();

  const chapterIds = book.chapters.map(
    (chapter, index) => chapter._id || `new-${index}`,
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = chapterIds.indexOf(active.id);
      const newIndex = chapterIds.indexOf(over.id);
      onReorderChapters(oldIndex, newIndex);
    }
  };

  return (
    <aside className="w-80 h-full bg-white border-r  border-slate-200 flex flex-col justify-items-start">
      <div className="p-4 border-b border-slate-200 text-left">
        <Button
          variant="ghost"
          size="small"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2
          className="text-base font-semibold text-slate-800 mt-4 truncate"
          title={book.title}
        >
          {book.title}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapterIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-4 space-y-2">
              {book.chapters.map((chapter, index) => (
                <SortableItem
                  key={chapter._id || `new-${index}`}
                  chapter={chapter}
                  index={index}
                  selectedChapterIndex={selectedChapterIndex}
                  onSelectChapter={onSelectChapter}
                  onDeleteChapter={onDeleteChapter}
                  onGenerateChapterContent={onGenerateChapterContent}
                  isGenerating={isGenerating}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="p-4 border-t border-slate-200">
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddChapter}
          className="w-full"
          icon={Plus}
        >
          New Chapter
        </Button>
      </div>
    </aside>
  );
};

export default ChapterSidebar;

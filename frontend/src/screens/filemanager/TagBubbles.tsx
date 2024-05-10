import React, { useState, useRef, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import useResizeObserver from "./useResizeObserver";

interface TagBubblesProps {
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

const TagBubbles: React.FC<TagBubblesProps> = ({
  tags,
  selectedTags,
  onTagClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(containerRef);
  const [visibleStart, setVisibleStart] = useState(0);
  const [tagsToShow, setTagsToShow] = useState(10); // Default count, you can adjust this base on a sensible default

  useEffect(() => {
    if (dimensions) {
      // Calculate how many tags can be displayed based on the container's width
      const tagWidth = 80; // Width per tag in pixels (adjust based on your CSS)
      const visibleCount = Math.floor(dimensions.width / tagWidth);
      setTagsToShow(Math.max(visibleCount, 1)); // At least one tag should be visible
    }
  }, [dimensions]);

  const visibleEnd = visibleStart + tagsToShow;
  const scrollTags = (direction: "left" | "right") => {
    setVisibleStart((prev) => {
      const newStart =
        direction === "left"
          ? Math.max(prev - 1, 0)
          : Math.min(prev + 1, tags.length - tagsToShow);
      return newStart;
    });
  };

  const disableLeft = visibleStart === 0;
  const disableRight = visibleEnd >= tags.length;

  return (
    <div
      className="relative max-w-6xl w-11/12 flex items-center ml-4 my-2"
      ref={containerRef}
    >
      <button
        onClick={() => scrollTags("left")}
        className="absolute left-0 z-20"
        disabled={disableLeft}
      >
        <MdChevronLeft size={24} className="text-gray-600" />
      </button>
      <div className="flex overflow-hidden scroll-smooth px-4">
        {tags.slice(visibleStart, visibleEnd).map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center justify-center bg-${
              selectedTags.includes(tag)
                ? "blue-500 text-white hover:bg-blue-600"
                : "blue-50 hover:bg-blue-100"
            } font-semibold cursor-pointer text-gray-600 py-2 px-4 m-1 rounded`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={() => scrollTags("right")}
        className="absolute right-0 z-20"
        disabled={disableRight}
      >
        <MdChevronRight size={24} className="text-gray-600" />
      </button>
    </div>
  );
};

export default TagBubbles;

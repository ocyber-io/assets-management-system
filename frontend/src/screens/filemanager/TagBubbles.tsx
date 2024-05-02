import React, { useState, useRef, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import useResizeObserver from "./useResizeObserver"; // Ensure this import is correct based on your file structure

interface TagBubblesProps {
  tags: string[];
}

const TagBubbles: React.FC<TagBubblesProps> = ({ tags }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(containerRef);
  const [visibleStart, setVisibleStart] = useState(0);
  const [tagsToShow, setTagsToShow] = useState(10);

  useEffect(() => {
    if (dimensions) {
      const visibleCount = Math.floor(dimensions.width / 110); // Assuming each tag width of 120px
      setTagsToShow(visibleCount);
    }
  }, [dimensions]);

  const visibleEnd = visibleStart + tagsToShow;
  const scrollTags = (direction: "left" | "right") => {
    setVisibleStart((prev) => {
      if (direction === "left") {
        return Math.max(prev - 1, 0);
      } else {
        return Math.min(prev + 1, tags.length - tagsToShow);
      }
    });
  };

  const disableLeft = visibleStart === 0;
  const disableRight = visibleEnd >= tags.length;

  return (
    <div
      className="relative w-full flex items-center mx-4 my-2"
      ref={containerRef}
    >
      <button
        onClick={() => scrollTags("left")}
        className="absolute left-0 z-20"
        disabled={disableLeft}
      >
        <MdChevronLeft size={24} className="text-gray-600" />
      </button>
      <div className="flex overflow-hidden scroll-smooth px-4 mr-5">
        {tags.slice(visibleStart, visibleEnd).map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-blue-50 font-semibold cursor-pointer hover:bg-blue-100 text-gray-600 py-2 px-4 m-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={() => scrollTags("right")}
        className="absolute right-0 z-20 mr-10"
        disabled={disableRight}
      >
        <MdChevronRight size={24} className="text-gray-600" />
      </button>
    </div>
  );
};

export default TagBubbles;

import { useEffect, useState } from "react";

const useResizeObserver = (
  ref: React.RefObject<HTMLElement>
): { width: number } | null => {
  const [dimensions, setDimensions] = useState<{ width: number } | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
      const { width } = entries[0].contentRect;
      setDimensions({ width });
    });

    resizeObserver.observe(target);

    return () => {
      resizeObserver.unobserve(target);
    };
  }, [ref]);

  return dimensions;
};

export default useResizeObserver;

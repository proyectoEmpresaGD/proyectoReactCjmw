// src/components/immersive/useInView.js
import { useEffect, useMemo, useRef, useState } from "react";

export function useInView(options) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  const observerOptions = useMemo(
    () => options ?? { threshold: 0.15 },
    [options]
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsInView(true);
    }, observerOptions);

    observer.observe(node);
    return () => observer.disconnect();
  }, [observerOptions]);

  return { ref, isInView };
}

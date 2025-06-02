import { useState, useEffect, useRef } from 'react';

function useIntersectionObserver(elementRef, options) {
  const [isVisible, setIsVisible] = useState(false);

  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current.unobserve(entry.target); // Stop observing after intersecting once
        }
      });
    }, options);

    const currentElement = elementRef.current;

    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elementRef, options]);

  return isVisible;
}

export default useIntersectionObserver;
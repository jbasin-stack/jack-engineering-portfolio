import { useLenis } from 'lenis/react';
import { useState } from 'react';

export function useScrollVisibility(threshold: number = 300) {
  const [isVisible, setIsVisible] = useState(false);

  useLenis(({ scroll }) => {
    setIsVisible(scroll > threshold);
  });

  return isVisible;
}

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom animated cursor component that follows mouse movements and interacts with clickable elements.
 */
export default function CustomCursor() {
  // Используем useMotionValue вместо useState для координат, 
  // чтобы избежать ререндеров React при каждом движении мыши!
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Пружинная физика для плавности, но без нагрузки на React
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Passive listener для максимальной производительности
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#C06334] dark:border-[#D4AF37] pointer-events-none z-[9999] hidden md:flex items-center justify-center"
      style={{ 
        x: cursorXSpring, 
        y: cursorYSpring,
        // Использование willChange сообщает GPU, что элемент будет двигаться
        willChange: 'transform'
      }}
      animate={{ 
        scale: isHovering ? 1.8 : 1,
        backgroundColor: isHovering ? 'rgba(192, 99, 52, 0.15)' : 'transparent'
      }}
      transition={{ duration: 0.2 }}
    />
  );
}
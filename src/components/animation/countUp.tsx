import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

type CountUpProps = {
  end: number;
  duration?: number;
  separator?: string;
  className?: string;
};

export default function CountUp({
  end = 100,
  duration = 1.2,
  separator = ",",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const frames = Math.round(duration * 60);
    const increment = end / frames;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= frames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, end, duration]);

  const formatted = count.toLocaleString(undefined, {
    maximumFractionDigits: 0,
    useGrouping: !!separator,
  });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {formatted}
    </motion.span>
  );
}
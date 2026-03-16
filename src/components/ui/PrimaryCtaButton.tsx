import { motion } from 'framer-motion';
import { Link, LinkProps } from 'react-router-dom';
import type { ReactNode } from 'react';

const MotionLink = motion.create(Link);

const primaryCtaWave = {
  initial: {
    boxShadow: '0 0 0 0 rgba(39, 172, 230,0.0)',
  },
  wave: {
    boxShadow: [
      '0 0 0 0 rgba(39, 172, 230, 0.0)',
      '0 0 0 0 rgba(39, 172, 230, 0.1)',
      '0 0 0 5px rgba(39, 172, 230, 0.5)',
      '0 0 0 10px rgba(39, 172, 230, 0.2)',
      '0 0 0 10px rgba(39, 172, 230, 0.0)',
    ],
  },
};

interface PrimaryCtaButtonProps extends LinkProps {
  children: ReactNode;
  wave?: boolean;
  className?: string;
}

export const PrimaryCtaButton = ({
  children,
  wave = false,
  className,
  ...linkProps
}: PrimaryCtaButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-[10px] bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-700';

  return (
    <MotionLink
      {...linkProps}
      variants={primaryCtaWave}
      initial="initial"
      animate={wave ? 'wave' : 'initial'}
      transition={
        wave
          ? {
              duration: 1.5,
              ease: 'easeOut',
              repeat: Infinity,
              repeatType: 'loop',
              repeatDelay: 0.2,
            }
          : undefined
      }
      className={className ? `${baseClasses} ${className}` : baseClasses}
    >
      {children}
    </MotionLink>
  );
};



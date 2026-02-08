import { Variants, Transition } from "framer-motion";

// ============================================
// TRANSITION CONFIGURATIONS
// ============================================

export const springTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

export const smoothTransition: Transition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.4,
};

export const bounceTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 15,
};

// ============================================
// FADE VARIANTS
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  },
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 }
  },
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  },
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  },
};

// ============================================
// SCALE VARIANTS
// ============================================

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  },
};

export const scaleInBounce: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: bounceTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.5,
    transition: { duration: 0.15 }
  },
};

export const popIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 10
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: bounceTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: -10,
    transition: { duration: 0.15 }
  },
};

// ============================================
// SLIDE VARIANTS
// ============================================

export const slideInFromLeft: Variants = {
  hidden: { 
    x: "-100%",
    opacity: 0
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: smoothTransition
  },
  exit: { 
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

export const slideInFromRight: Variants = {
  hidden: { 
    x: "100%",
    opacity: 0
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: smoothTransition
  },
  exit: { 
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

export const slideInFromTop: Variants = {
  hidden: { 
    y: "-100%",
    opacity: 0
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: smoothTransition
  },
  exit: { 
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

export const slideInFromBottom: Variants = {
  hidden: { 
    y: "100%",
    opacity: 0
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: smoothTransition
  },
  exit: { 
    y: "100%",
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// ============================================
// STAGGER CONTAINERS
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

// ============================================
// STAGGER CHILDREN
// ============================================

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.15 }
  },
};

export const staggerItemScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.15 }
  },
};

// ============================================
// HOVER ANIMATIONS (for whileHover prop)
// ============================================

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverScaleSmall = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -4,
  scale: 1.02,
  transition: springTransition
};

export const hoverGlow = {
  boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
  transition: { duration: 0.3 }
};

// ============================================
// TAP ANIMATIONS (for whileTap prop)
// ============================================

export const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

export const tapScaleSmall = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// ============================================
// SPECIAL EFFECTS
// ============================================

export const shimmer: Variants = {
  hidden: { 
    backgroundPosition: "-200% 0" 
  },
  visible: { 
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear"
    }
  },
};

export const pulse: Variants = {
  hidden: { 
    scale: 1, 
    opacity: 0.5 
  },
  visible: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut"
    }
  },
};

export const float: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [-10, 10, -10],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut"
    }
  },
};

export const rotate: Variants = {
  hidden: { rotate: 0 },
  visible: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 8,
      ease: "linear"
    }
  },
};

export const wiggle: Variants = {
  hidden: { rotate: 0 },
  visible: {
    rotate: [-3, 3, -3],
    transition: {
      repeat: Infinity,
      duration: 0.5,
      ease: "easeInOut"
    }
  },
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: { duration: 0.3 }
  },
};

// ============================================
// MODAL / DIALOG VARIANTS
// ============================================

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  },
};

// ============================================
// DRAWER VARIANTS
// ============================================

export const drawerFromRight: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: smoothTransition
  },
  exit: { 
    x: "100%",
    transition: smoothTransition
  },
};

export const drawerFromLeft: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: 0,
    transition: smoothTransition
  },
  exit: { 
    x: "-100%",
    transition: smoothTransition
  },
};

export const drawerFromBottom: Variants = {
  hidden: { y: "100%" },
  visible: { 
    y: 0,
    transition: smoothTransition
  },
  exit: { 
    y: "100%",
    transition: smoothTransition
  },
};

// ============================================
// LIST ITEM VARIANTS
// ============================================

export const listItem: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.15 }
  },
};

export const gridItem: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.15 }
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a staggered delay based on index
 */
export const getStaggerDelay = (index: number, baseDelay = 0.1) => ({
  transition: { delay: index * baseDelay }
});

/**
 * Create a custom fade in up variant with specific distance
 */
export const createFadeInUp = (distance = 20): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    y: -distance / 2,
    transition: { duration: 0.2 }
  },
});

/**
 * Create a custom scale variant with specific scale values
 */
export const createScale = (from = 0.9, to = 1): Variants => ({
  hidden: { opacity: 0, scale: from },
  visible: { 
    opacity: 1, 
    scale: to,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    scale: from,
    transition: { duration: 0.2 }
  },
});

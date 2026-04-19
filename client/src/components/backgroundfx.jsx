import { motion } from "framer-motion";

const MotionDiv = motion.div;

const floatTransition = (duration) => ({
  duration,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
});

const BackgroundFx = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-mesh" />

      <MotionDiv
        className="absolute left-[-160px] top-[70px] h-[360px] w-[360px] rounded-full bg-emerald-400/12 blur-[110px]"
        animate={{
          x: [0, 55, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={floatTransition(16)}
      />

      <MotionDiv
        className="absolute right-[-150px] top-[140px] h-[460px] w-[460px] rounded-full bg-green-400/10 blur-[130px]"
        animate={{
          x: [0, -50, 24, 0],
          y: [0, 24, -18, 0],
          scale: [1, 0.95, 1.07, 1],
        }}
        transition={floatTransition(18)}
      />

      <MotionDiv
        className="absolute bottom-[-180px] left-[22%] h-[460px] w-[460px] rounded-full bg-teal-300/10 blur-[140px]"
        animate={{
          x: [0, 35, -35, 0],
          y: [0, -30, 14, 0],
          scale: [1, 1.04, 0.94, 1],
        }}
        transition={floatTransition(20)}
      />

      <MotionDiv
        className="absolute left-[6%] top-[22%] h-[220px] w-[220px] rounded-full border border-emerald-300/10"
        animate={{ rotate: 360, scale: [1, 1.04, 1] }}
        transition={{
          rotate: { duration: 28, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <MotionDiv
        className="absolute right-[10%] bottom-[16%] h-[160px] w-[160px] rounded-full border border-emerald-200/10"
        animate={{ rotate: -360, scale: [1, 0.96, 1] }}
        transition={{
          rotate: { duration: 24, repeat: Infinity, ease: "linear" },
          scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <MotionDiv
        className="absolute left-1/2 top-[18%] h-[120px] w-[120px] -translate-x-1/2 rounded-full bg-emerald-300/8 blur-[60px]"
        animate={{
          y: [0, 18, -10, 0],
          opacity: [0.4, 0.7, 0.45, 0.4],
          scale: [1, 1.06, 0.96, 1],
        }}
        transition={floatTransition(12)}
      />

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-400/6 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export default BackgroundFx;
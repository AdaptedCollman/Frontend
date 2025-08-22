import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface HeroSectionProps {
  onHowItWorksClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onHowItWorksClick }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center pt-16 md:pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-100/30 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ left: "10%", top: "20%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl"
          animate={{
            x: [0, -70, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ right: "15%", top: "10%" }}
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-[#3461FF]">
              Welcome to Adapt<span className="text-[#3461FF]">ED</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            Personalized learning that adapts to your unique needs. Experience
            education reimagined.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                className="!bg-[#3461FF] hover:!bg-blue-700 !px-8 !py-3 !text-lg !rounded-full !font-medium"
              >
                START TEST
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                onClick={onHowItWorksClick}
                className="!border-[#3461FF] !text-[#3461FF] hover:!bg-blue-50 !px-8 !py-3 !text-lg !rounded-full !font-medium"
              >
                HOW IT WORKS
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Adaptive Learning",
                description: "Personalized to your pace",
              },
              {
                title: "Real-time Feedback",
                description: "Instant performance insights",
              },
              {
                title: "Expert Support",
                description: "24/7 learning assistance",
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform transition-transform hover:-translate-y-2 duration-150"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <KeyboardArrowDownIcon
          className="text-gray-400 cursor-pointer"
          onClick={onHowItWorksClick}
          fontSize="large"
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;

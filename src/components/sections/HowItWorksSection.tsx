import React from "react";
import { motion } from "framer-motion";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <AssessmentOutlinedIcon sx={{ fontSize: 40 }} />,
      title: "Initial Assessment",
      description:
        "Take a comprehensive assessment to identify your current knowledge level and learning style.",
      color: "bg-blue-500",
    },
    {
      icon: <AutoGraphIcon sx={{ fontSize: 40 }} />,
      title: "Personalized Path",
      description:
        "Our AI creates a customized learning path based on your assessment results and goals.",
      color: "bg-purple-500",
    },
    {
      icon: <SchoolOutlinedIcon sx={{ fontSize: 40 }} />,
      title: "Adaptive Learning",
      description:
        "Learn at your own pace with interactive lessons that adjust to your progress.",
      color: "bg-green-500",
    },
    {
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 40 }} />,
      title: "Track Progress",
      description:
        "Monitor your achievements and receive regular progress reports to stay motivated.",
      color: "bg-orange-500",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It <span className="text-[#3461FF]">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our adaptive learning platform makes education personalized and
            effective
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-gray-200 -z-10" />
              )}

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full transform transition-transform hover:-translate-y-2 duration-150">
                <div
                  className={`${step.color} text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Why Choose AdaptED?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "AI-Powered Learning",
                "24/7 Expert Support",
                "Progress Analytics",
              ].map((feature) => (
                <div
                  key={feature}
                  className="p-4 rounded-lg bg-blue-50 text-[#3461FF] hover:bg-blue-100 transition-colors duration-150"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";

const ScrollRevealSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6 }}
      className="my-24 px-6 max-w-5xl mx-auto"
    >
      {children}
    </motion.section>
  );
};

const LandingPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const steps = [
    {
      title: "Step 1: Set Your Goal",
      description: "Set your goal – like Medicine at Tel Aviv University.",
    },
    {
      title: "Step 2: Take the Test",
      description: "Start answering questions. The system adapts as you go.",
    },
    {
      title: "Step 3: Get Smart Feedback",
      description:
        "See your level, weak points, and track progress in real-time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-black dark:text-white scroll-smooth flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="pt-32 px-6 text-center">
          <motion.h1
            className="text-5xl font-extrabold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to <span className="text-blue-600">AdaptED</span>
          </motion.h1>

          <motion.p
            className="text-lg max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            An adaptive platform that evolves with your skills and goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          ></motion.div>
        </section>

        {/* How It Works Section */}
        <section
          ref={sectionRef}
          id="how-it-works"
          className="mt-32 px-6 max-w-3xl mx-auto text-left"
        >
          <motion.h2
            className="text-4xl font-bold mb-12 text-center"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <CheckCircle className="text-blue-600 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Scroll Reveal Info Section */}
        <ScrollRevealSection>
          <h2 className="text-3xl font-bold mb-4 text-center">Why AdaptED?</h2>
          <p className="text-lg text-center max-w-3xl mx-auto">
            Traditional test preparation is one-size-fits-all. AdaptED changes
            that by tailoring each step to your personal strengths and
            weaknesses, helping you reach your academic goals faster and
            smarter.
          </p>
        </ScrollRevealSection>

        <ScrollRevealSection>
          <h2 className="text-3xl font-bold mb-4 text-center">
            Smart Analytics
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto">
            Our real-time analytics give you immediate feedback on your
            performance, allowing you to focus your efforts where it matters
            most.
          </p>
        </ScrollRevealSection>
      </div>
    </div>
  );
};

export default LandingPage;

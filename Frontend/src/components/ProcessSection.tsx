import React from 'react';
import { motion } from 'framer-motion';

const ProcessSection = () => {
  const processSteps = [
    {
      number: "01",
      icon: (
        <svg
          className="w-12 h-12 text-[#b8a07c]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      ),
      title: "Discover Your Style",
      description: "Explore our diverse collections and find inspiration that perfectly matches your unique aesthetic and home.",
    },
    {
      number: "02",
      icon: (
        <svg
          className="w-12 h-12 text-[#b8a07c]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-2.414-2.414A1 1 0 0015.586 6H7a2 2 0 00-2 2v11a2 2 0 002 2z"
          ></path>
        </svg>
      ),
      title: "Customize & Choose",
      description: "Select from a wide array of materials, colors, and configurations to personalize your furniture to your exact specifications.",
    },
    {
      number: "03",
      icon: (
        <svg
          className="w-12 h-12 text-[#b8a07c]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>
      ),
      title: "Order & Craft",
      description: "Place your order, and our skilled artisans will meticulously craft your chosen pieces with precision and care.",
    },
    {
      number: "04",
      icon: (
        <svg
          className="w-12 h-12 text-[#b8a07c]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
      title: "Deliver & Enjoy",
      description: "We ensure a seamless and safe delivery experience, setting up your new furniture for you to immediately enjoy.",
    },
  ];

  return (
    <section className="text-center relative overflow-hidden">
      <motion.h1 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-bold text-gray-200 z-0 select-none pointer-events-none opacity-5"
        style={{ fontFamily: 'Domine, serif' }}
      >
        Our Approach
      </motion.h1>
      <div className="bg-white p-8 rounded-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-[#b8a07c] mb-2 font-domine">Our Process</p>
            <h2 className="text-4xl md:text-5xl font-bold font-domine text-foreground">How We Bring Your Vision to Life</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Dashed lines for larger screens */}
            <div className="absolute hidden lg:flex top-[70px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] justify-between items-center z-0">
              <span className="w-[calc(100%/3 - 40px)] border-t-2 border-dashed border-gray-200"></span>
              <span className="w-[calc(100%/3 - 40px)] border-t-2 border-dashed border-gray-200"></span>
              <span className="w-[calc(100%/3 - 40px)] border-t-2 border-dashed border-gray-200"></span>
            </div>

            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center p-4 bg-white rounded-lg transition-all duration-300 hover:shadow-[0_12px_40px_rgba(187,154,101,0.4)] hover:-translate-y-3"
              >
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-xl mb-6">
                  <span className="absolute text-2xl font-bold text-[#b8a07c] top-2 right-2">{step.number}</span>
                  <div className="w-24 h-24 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground font-domine">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection; 
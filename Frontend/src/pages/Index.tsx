import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useAnimation } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import ProcessSection from '@/components/ProcessSection';
// import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { Loader2, Star, Award, Users, Truck, Shield, ChevronDown, Mail, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import LogoLoop from './LogoLoop';


interface TestimonialProps {
  quote: string;
  author: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, rating }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
    >
      <div className="absolute top-6 left-6 text-6xl text-[#bb9a65]/20 font-serif">"</div>
      <div className="relative z-10 text-center pt-8">
        <div className="flex justify-center mb-6 space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-xl md:text-2xl font-medium mb-8 max-w-3xl mx-auto leading-relaxed text-gray-800 italic">
          {quote}
        </p>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-[#bb9a65]/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-[#bb9a65]" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{author.split(',')[0]}</p>
            <p className="text-sm text-gray-500">{author.split(',')[1]}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Floating Elements Component
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: '80%',
          }}
        />
      ))}
    </div>
  );
};

// Category Showcase Component
const CategoryShowcase = () => {
  const categories = [
    { name: 'Sofas', image: '/images/sofa-category.jpg', count: '120+ Items' },
    { name: 'Chairs', image: '/images/chair-category.jpg', count: '85+ Items' },
    { name: 'Tables', image: '/images/table-category.jpg', count: '95+ Items' },
    { name: 'Beds', image: '/images/bed-category.jpg', count: '60+ Items' },
    { name: 'Storage', image: '/images/storage-category.jpg', count: '75+ Items' },
    { name: 'Decor', image: '/images/decor-category.jpg', count: '150+ Items' },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Add overflow-x-auto for mobile */}
        <div className="sm:hidden -mx-2 overflow-x-auto pb-2">
          <div className="flex space-x-4 px-2">
            {categories.map((category, index) => (
              <div key={category.name} className="min-w-[140px] max-w-[180px] flex-shrink-0">
                <div className="relative overflow-hidden rounded-xl aspect-square mb-2 shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-base">{category.name}</h3>
                    <p className="text-xs opacity-90">{category.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Keep grid for sm+ */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl aspect-square mb-2 md:mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white">
                  <h3 className="font-semibold text-base md:text-lg">{category.name}</h3>
                  <p className="text-xs md:text-sm opacity-90">{category.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Number Counter Component
const NumberCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let currentValue = 0;
    const increment = numericValue / (duration * 60); // 60fps
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        currentValue = numericValue;
        clearInterval(timer);
      }
      setDisplayValue(Math.floor(currentValue));
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [numericValue, duration]);

  return (
    <motion.div 
      className="text-5xl md:text-7xl font-bold mb-2 text-dark-brown"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {suffix.includes('%') ? (
        <span>{displayValue}</span>
      ) : (
        <span>{displayValue.toLocaleString()}</span>
      )}
      {suffix}
    </motion.div>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { icon: Users, value: '1000+', label: 'Happy Customers' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Truck, value: '50+', label: 'Cities Delivered' },
    { icon: Shield, value: '100%', label: 'Quality Guarantee' },
  ];

  // Decorative floating circles for enhanced glass effect background
  const FloatingBackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: 40 + i * 10,
            height: 40 + i * 10,
            top: `${10 + i * 10}%`,
            left: `${15 + (i * 12) % 70}%`,
            filter: 'blur(12px)',
          }}
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );

  return (
    <section className="py-20 relative">
      <FloatingBackgroundElements />
      <div className="absolute inset-0 backdrop-blur-3xl rounded-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#bb9a65]/15 backdrop-blur-3xl rounded-3xl border border-[#bb9a65]/20 shadow-2xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-[#bb9a65] group-hover:scale-110 transition-transform duration-300" />
              <NumberCounter value={stat.value} />
              <div className="text-[#bb9a65] group-hover:text-[#bb9a65]/80 transition-colors duration-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


// Associate Companies Logos Carousel Component


const associatepartnerslogo = [
  { src: "/logos/client1.jpeg", alt: "Company 1",  },
  { src: "/logos/client2.jpeg", alt: "Company 2",  },
  { src: "/logos/client3.jpeg", alt: "Company 3",  }
];

// Alternative with image sources
const clientlogos = [
  { src: "/logos/partners1.jpeg", alt: "Company 1", href: "https://www.jhaveritrade.com/" },
  { src: "/logos/partners2.jpeg", alt: "Company 2", href: "https://allegianceenviro.com/" },
  { src: "/logos/partners3.jpeg", alt: "Company 3", href: "https://www.google.com/search?q=vadodara+animal+hospital&sca_esv=7cffcbb1fa984c63&sxsrf=AE3TifMnfS3Q9YChBvEkCW309VU0xLBihA%3A1758087817128&ei=iUrKaKPHB5e1vr0Pl5fIiQI&oq=Vadoda&gs_lp=Egxnd3Mtd2l6LXNlcnAiBlZhZG9kYSoCCAAyDRAjGIAEGCcYyQIYigUyExAuGIAEGMcBGCcYigUYjgUYrwEyChAuGIAEGEMYigUyChAAGIAEGEMYigUyBRAAGIAEMgUQABiABDINEAAYgAQYsQMYFBiHAjIIEAAYgAQYsQMyCxAAGIAEGJECGIoFMgUQABiABEj8IVDkBljCEnABeAGQAQCYAY8CoAHFCqoBBTAuMS41uAEDyAEA-AEBmAIHoAL7CqgCEMICBxAjGCcY6gLCAg0QIxjwBRgnGMkCGOoCwgINEC4YxwEYJxjqAhivAcICFBAAGIAEGJECGLQCGIoFGOoC2AEBwgIjEC4YgAQYkQIYtAIYxwEYmAUYmQUYigUY6gIYngUYrwHYAQHCAgsQLhiABBiRAhiKBcICCxAAGIAEGLEDGIMBwgIIEC4YgAQYsQPCAg4QABiABBixAxiDARiKBcICCBAuGIAEGOUEwgIKECMYgAQYJxiKBcICDhAuGIAEGMcBGI4FGK8BmAMS4gMFEgExIEDxBa7LvjMILzEEugYGCAEQARgBkgcFMS4xLjWgB7ResgcFMC4xLjW4B-gKwgcFMi02LjHIBy0&sclient=gws-wiz-serp" },
  { src: "/logos/partners4.png", alt: "Company 4", href: "https://www.shivaayluxuryliving.com/" },
  { src: "/logos/partners5.jpg", alt: "Company 5", href: "https://www.mining.sandvik/en/" },
];

function AssociateLogosCarousel() {
  return (
    <div style={{ height: '400px', position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
      <h1 className=' text-center mb-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-brown font-domine'>Associate Partners</h1>
      <LogoLoop
        logos={associatepartnerslogo}
        speed={100}
        direction="left"
        logoHeight={100}
        gap={100}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
  );
}

function ClientLogosCarousel() {
  return (
    <div style={{ height: '400px', position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
      <h1 className=' text-center mb-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-brown font-domine'>Our Client</h1>
      <LogoLoop
        logos={clientlogos}
        speed={100}
        direction="right"
        logoHeight={150}
        gap={100}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
  );
}

// Our Latest Project Section Component
const OurLatestProject = () => {
  const projects = [
    { id: 1, category: 'Architecture', title: 'Modern Office', image: '/images/project1.jpg' },
    { id: 2, category: 'Furniture', title: 'Minimalism', image: '/images/project2.jpg' },
    { id: 3, category: 'Kitchen', title: 'Contemporary Kitchen', image: '/images/project3.jpg' },
    { id: 4, category: 'Interior', title: 'Spa Bathroom', image: '/images/project4.jpg' },
    { id: 5, category: 'Bedroom', title: 'Elegant Living', image: '/images/project5.jpg' },
    { id: 6, category: 'Architecture', title: 'Spacious Apartment', image: '/images/project6.jpg' },
  ];

  const categories = ['All', 'Architecture', 'Bedroom', 'Furniture', 'Interior', 'Kitchen'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 relative"
        >
          <div className="relative mb-8 md:mb-0">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="absolute -top-1/2 left-0 text-[8rem] font-bold text-[#bb9a65]/5 select-none pointer-events-none transform -translate-y-1/2"
            >
              Projects
            </motion.span>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg font-semibold text-[#bb9a65]/80 mb-2 font-poppins"
            >
              <span className="inline-block w-3 h-3 bg-[#bb9a65] rounded-full mr-2" /> PROCESS
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 40, skewY: 10 }}
              whileInView={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl text-dark-brown font-bold font-domine relative leading-tight"
            >
              Our Latest Project
            </motion.h2>
          </div>

          <div className="flex justify-end flex-wrap gap-x-8 gap-y-3 md:gap-y-0 text-lg font-medium">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => setActiveCategory(category)}
                className={`relative group transition-colors duration-300
                  ${activeCategory === category 
                    ? 'text-[#bb9a65]' 
                    : 'hover:text-[#bb9a65]'}`
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-mono text-[#bb9a65] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {`0${index + 1}`.slice(-2)}
                </span>
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="sm:hidden -mx-2 overflow-x-auto pb-2">
          <div className="flex space-x-4 px-2">
            {filteredProjects.map((project) => (
              <div key={project.id} className="min-w-[240px] max-w-[320px] flex-shrink-0">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover rounded-2xl" 
                />
                <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 rounded-b-2xl -mt-8 relative z-10">
                  <div className="text-white">
                    <p className="text-xs font-light uppercase opacity-80">{project.category}</p>
                    <h3 className="text-lg font-bold font-domine">{project.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Keep grid for sm+ */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform-gpu"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-sm font-light uppercase opacity-80">{project.category}</p>
                    <h3 className="text-2xl font-bold font-domine">{project.title}</h3>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 0, x: 20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute top-4 right-4 p-3 bg-white/20 rounded-full text-white"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// Marquee Section Component
const MarqueeSection = () => {
  const texts = ["Kitchen", "Best Gallery", "Master Bedroom", "Living Room", "Modern Design"];

  const MarqueeItem = ({ text }: { text: string }) => {
    const controls = useAnimation();

    const handleHoverStart = () => {
      controls.start({
        backgroundSize: "100% 100%",
        transition: { duration: 0.5, ease: "easeOut" }
      });
    };

    const handleHoverEnd = () => {
      controls.start({
        backgroundSize: "0% 100%",
        transition: { duration: 0.5, ease: "easeIn" }
      });
    };

    return (
      <motion.span
        className="text-8xl lg:text-9xl font-extrabold whitespace-nowrap 
                   uppercase tracking-tighter mx-8 
                   text-transparent bg-clip-text"
        style={{ 
          WebkitTextStroke: "2px #bb9a65", // Brown outline
          backgroundImage: "linear-gradient(to right, #bb9a65, #bb9a65)", // Brown fill
          backgroundSize: "0% 100%", // Initially no fill
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
        initial={{ backgroundSize: "0% 100%" }}
        animate={controls}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        {text}
      </motion.span>
    );
  };

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="absolute inset-0 bg-white"/>
      <div className="relative z-10 flex items-center h-full">
        <motion.div
          className="flex"
          animate={{
            x: ["0%", "-100%"],
            transition: { 
              x: { 
                repeat: Infinity, 
                repeatType: "loop", 
                duration: 60, 
                ease: "linear" 
              }
            }
          }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {texts.map((text, index) => (
                <span key={index} style={{ display: 'contents' }}>
                  <MarqueeItem text={text} />
                  {index < texts.length - 1 && (
                    <motion.span
                      className="text-7xl font-extrabold text-[#bb9a65] opacity-70 rotate-45 mx-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 0.7, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      +
                    </motion.span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Newsletter Section Component
const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  return (
    <section className="py-20 bg-gradient-to-r from-[#bb9a65] to-[#bb9a65]/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Mail className="w-16 h-16 mx-auto mb-6 text-white" />
          <motion.h2 
            initial={{ opacity: 0, y: 30, rotateX: -30 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Stay Updated
          </motion.h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest furniture trends, exclusive offers, and design inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button variant="secondary" className="bg-white text-[#bb9a65] hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Index = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 3);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const testimonials = [
    {
      quote: "This recliner is super comfortable and stylish. I use it daily for reading and watching TV. Totally worth the investment!",
      author: "Amit Patel, Surat",
      rating: 5,
    },
    {
      quote: "The sofa I bought has completely transformed the look of my home. The design is modern, and the cushioning is very comfortable. Best part is the after-sales service — they really care for their customers.",
      author: "Neha Shah, Vadodara",
      rating: 5,
    },
    {
      quote: "I purchased a queen-size bed from here, and the quality is outstanding. The wood feels strong, and the finish adds elegance to my bedroom. Very happy with my choice!",
      author: "Ketan Joshi, Vadodara",
      rating: 5,
    },
    {
      quote: "We bought a 6-seater dining set, and it has become the highlight of our dining room. The wood quality is excellent, and the chairs are very comfortable. A perfect blend of style and strength.",
      author: "Harshil Patel, Vadodara",
      rating: 5,
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  return (
    <div className="min-h-screen p-2 overflow-x-hidden">
      {/* Enhanced Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-2 sm:p-4 md:p-6 lg:p-8"
      >
        <motion.video
          style={{ y, scale: 1.1 }}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </motion.video>
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" 
        />
        <FloatingElements />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 tracking-tight font-domine px-2 sm:px-0"
          >
            Giving a new lease <br className="hidden sm:block"/> of life to the unwanted
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-2xl sm:max-w-3xl mx-auto mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed px-4 sm:px-0"
          >
            Making the undesirable desirable again
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center w-full sm:w-auto px-4 sm:px-0"
          >
            <Link to="/products" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-[#bb9a65] hover:bg-[#bb9a65]/90 text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 transition-transform duration-300 hover:scale-105"
              >
                Browse Products
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-[#bb9a65] hover:bg-gray-100 text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 transition-transform duration-300 hover:scale-105"
              >
                Custom Orders
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Our Latest Project Section */}
      <OurLatestProject />

      {/* Enhanced Features Section */}
      <section className="py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="bg-gradient-to-br from-muted/30 to-background p-2 sm:p-4 md:p-6 lg:p-8 ">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12 relative"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#bb9a65]/5 select-none pointer-events-none"
              >
                Features
              </motion.span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-brown mb-2 sm:mb-3 md:mb-4 font-domine relative">
                Why Choose Furnisure?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto relative px-4 sm:px-0">
                We're committed to providing you with the highest quality furniture and exceptional service.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-dark-brown">
              {[
                {
                  image: "/images/quality.jpg",
                  icon: Shield,
                  title: "Premium Quality",
                  description: "All our furniture is crafted from the finest materials with attention to every detail.",
                },
                {
                  image: "/images/delivery.jpg",
                  icon: Truck,
                  title: "Free Delivery",
                  description: "Enjoy free delivery and assembly service within our coverage areas.",
                },
                {
                  image: "/images/custom.jpg",
                  icon: Users,
                  title: "Custom Solutions",
                  description: "Need something specific? We offer custom furniture solutions tailored to your needs.",
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(187,154,101,0.4)] transition-all duration-500 rounded-2xl md:rounded-3xl border-0 bg-gradient-to-br from-[#bb9a65]/10 to-[#bb9a65]/5 hover:scale-[1.02] group flex flex-col">
                    <div className="relative h-48 md:h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <feature.icon className="absolute top-4 right-4 w-6 h-6 md:w-8 md:h-8 text-white/80 z-20" />
                    </div>
                    <CardContent className="p-6 md:p-8 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <motion.h3 
                          className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 font-domine group-hover:text-[#bb9a65] transition-colors duration-300"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {feature.title}
                        </motion.h3>
                        <motion.p 
                          className="text-base md:text-lg text-muted-foreground"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {feature.description}
                        </motion.p>
                      </div>
                      <motion.div
                        className="mt-4 md:mt-6 h-0.5 bg-gradient-to-r from-[#bb9a65]/0 via-[#bb9a65] to-[#bb9a65]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Associate Companies Logos Carousel */}
      <AssociateLogosCarousel />
      <ClientLogosCarousel />

      {/* Enhanced Featured Products Section */}
      <section className="py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="bg-gradient-to-br from-white to-gray-50 p-2 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12 relative"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#bb9a65]/5 select-none pointer-events-none"
              >
                Featured
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-brown mb-2 sm:mb-3 md:mb-4 font-domine"
              >
                Featured Products
              </motion.h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto relative px-4 sm:px-0">
                Discover our handpicked selection of premium furniture pieces
              </p>
            </motion.div>

            {loading ? (
              <div className="relative h-[200px] sm:h-[300px] md:h-[400px] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 animate-spin text-[#bb9a65] mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground animate-pulse">
                    Curating the finest pieces for you...
                  </p>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12 lg:mb-16"
              >
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="transform-gpu"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link to="/products">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white hover:bg-[#bb9a65] hover:text-white transition-all duration-300 group"
                >
                  <span className="mr-2 group-hover:translate-x-1 transition-transform duration-300">
                    View All Products
                  </span>
                  →
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <ProcessSection />

      <MarqueeSection />

      {/* Enhanced Testimonials Section */}
      <section className="py-4 sm:py-6 md:py-8 lg:py-12 bg-[#80674C] rounded-xl sm:rounded-2xl lg:rounded-3xl">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 p-2 sm:p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-4 sm:mb-6 md:mb-8"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 40, skewY: 10 }}
              whileInView={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white text-foreground mb-2 sm:mb-3 md:mb-4 font-domine"
            >
              Customer Testimonials
            </motion.h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-xl sm:max-w-2xl mx-auto font-domine text-white/80 px-4 sm:px-0">
              Hear what our valued customers have to say about their experience
            </p>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                <AnimatePresence mode="wait">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      className="flex-[0_0_100%] min-w-0 px-2 sm:px-8"
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TestimonialCard 
                        quote={testimonial.quote} 
                        author={testimonial.author} 
                        rating={testimonial.rating}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col items-center mt-6 sm:mt-8 md:mt-10 space-y-3 sm:space-y-4">
              <div className="flex justify-center space-x-3 sm:space-x-4">
                {scrollSnaps.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                      index === selectedIndex 
                        ? 'bg-yellow-400 scale-150' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    onClick={() => scrollTo(index)}
                  />
                ))}
              </div>
              <motion.p 
                className="text-white/60 text-xs sm:text-sm mt-2 sm:mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Swipe or click to see more stories
              </motion.p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

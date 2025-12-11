import { Card, CardContent } from '@/components/ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, Truck, Shield, Star, Heart, Leaf, Lightbulb } from 'lucide-react';

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen p-2 overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-[40vh] sm:h-[60vh] rounded-3xl flex items-center justify-center overflow-hidden px-2 sm:px-6 lg:px-10"
      >
        <motion.img
          style={{ y, scale: 1.1 }}
          src="/images/hero-poster.jpg"
          alt="About Furnisure"
          className="absolute w-full h-full object-cover"
        />
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" 
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight font-domine"
          >
            About Furnisure
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Your trusted partner in creating beautiful, functional living spaces
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Company Story */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(187,154,101,0.4)] transition-all duration-300 rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white hover:scale-[1.01]">
            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[220px] xs:h-[300px] sm:h-[400px] md:h-[600px]"
              >
                <img
                  src="/images/company-story.jpg"
                  alt="Our Story"
                  className="absolute inset-0 w-full h-full object-cover rounded-l-3xl max-w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-l-3xl" />
              </motion.div>
              <CardContent className="p-4 sm:p-8 md:p-12 flex flex-col justify-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20, rotateX: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 font-domine"
                >
                  Our Story
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed"
                >
                  Founded in 2015, Furnisure began with a simple vision: to make premium furniture accessible to everyone. What started as a small family business has grown into one of the most trusted furniture retailers in the region.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed"
                >
                  We believe that your home should be a reflection of your personality and lifestyle. That's why we curate a diverse collection of furniture that combines style, comfort, and functionality.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed"
                >
                  Our commitment to quality extends beyond our products. We provide exceptional customer service, reliable delivery, and comprehensive after-sales support to ensure your complete satisfaction.
                </motion.p>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] font-bold text-[#bb9a65]/5 select-none pointer-events-none"
            >
              Values
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 40, skewY: 10 }}
              whileInView={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-domine relative"
            >
              Our Core Values
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto relative">
              <span className="text-base sm:text-lg">The principles that guide everything we do</span>
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Award,
                title: "Quality First",
                description: "We source our furniture from trusted manufacturers who share our commitment to quality and craftsmanship. Every piece undergoes rigorous quality checks before reaching our customers.",
                color: "from-blue-500/20 to-blue-600/20"
              },
              {
                icon: Heart,
                title: "Customer Centric",
                description: "Our customers are at the heart of everything we do. We listen to your needs, provide expert advice, and ensure a seamless shopping experience from browsing to delivery.",
                color: "from-red-500/20 to-red-600/20"
              },
              {
                icon: Leaf,
                title: "Sustainable Practices",
                description: "We're committed to environmental responsibility. Our products are sourced from sustainable materials, and we work with eco-conscious manufacturers.",
                color: "from-green-500/20 to-green-600/20"
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "We continuously evolve our product range and services to meet changing customer needs and lifestyle trends while maintaining our high standards.",
                color: "from-yellow-500/20 to-yellow-600/20"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <Card className={`h-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(187,154,101,0.4)] transition-all duration-300 rounded-3xl border-0 bg-white hover:scale-[1.01] group`}>
                  <CardContent className="p-8">
                    <div className="mb-6 flex justify-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4 font-domine group-hover:text-[#bb9a65] transition-colors duration-300">{value.title}</h3>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      <span className="text-base sm:text-lg">{value.description}</span>
                    </p>
                    <motion.div
                      className="mt-6 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          // className="mb-20"
        >
          <Card className="overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(187,154,101,0.4)] transition-all duration-300 rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white hover:scale-[1.01]">
            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
              <CardContent className="p-4 sm:p-8 md:p-12 flex flex-col justify-center">
                <motion.h2 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 font-domine"
                >
                  Our Team
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed"
                >
                  Our experienced team of furniture experts, interior designers, and customer service professionals work together to bring you the best furniture shopping experience. With over 50 combined years of industry experience, we understand what makes a house a home.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed"
                >
                  Whether you're furnishing your first apartment, upgrading your family home, or designing a corporate space, our team is here to guide you every step of the way.
                </motion.p>
              </CardContent>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[180px] xs:h-[250px] sm:h-[350px] md:h-[500px]"
              >
                <img
                  src="/images/team.jpg"
                  alt="Our Team"
                  className="absolute inset-0 w-full h-full object-cover rounded-r-3xl max-w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-r-3xl" />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;


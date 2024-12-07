"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, Globe, Users, Shield, TrendingUp, Award } from "lucide-react";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setAuthenticated(data.authenticated);
    };
    checkAuth();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 text-center z-10">
          <motion.h1 
            className="text-5xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Your Journey,<br />Your Story
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Join the community where every stay becomes a chapter in your travel story. Share, discover, and experience accommodations through authentic reviews.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            {authenticated ? (
              <>
                <Link href="/reviews">
                  <Button size="lg" className="w-full sm:w-auto px-8">Explore Reviews</Button>
                </Link>
                <Link href="/reviews/new">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">Share Your Story</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button size="lg" className="w-full sm:w-auto px-8">Begin Your Journey</Button>
                </Link>
                <Link href="/reviews">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">Browse Stories</Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div 
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
              <div className="w-1 h-3 bg-primary rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose StayScore?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Experience travel reviews reimagined through the lens of authentic storytelling.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Authentic Reviews",
                description: "Real stories from verified travelers ensuring trustworthy recommendations for your next adventure."
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Connect with a worldwide community of travelers sharing experiences from every corner of the globe."
              },
              {
                icon: Shield,
                title: "Trust & Safety",
                description: "Verified reviews and secure platform ensuring your peace of mind while sharing or discovering."
              },
              {
                icon: Users,
                title: "Community First",
                description: "Join a supportive community of passionate travelers sharing authentic experiences."
              },
              {
                icon: TrendingUp,
                title: "Smart Insights",
                description: "Discover trending destinations and hidden gems through data-driven recommendations."
              },
              {
                icon: Award,
                title: "Quality Matters",
                description: "Curated content ensuring you get the most valuable and relevant information."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card hover:bg-accent text-card-foreground rounded-xl shadow-lg p-6 transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section 
        className="py-20 bg-primary text-primary-foreground relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--primary)/10_1px,transparent_1px)] bg-[length:32px_32px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Share Your Story?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Join thousands of travelers who are already sharing their experiences and helping others make informed decisions.
          </p>
          <Link href={authenticated ? "/reviews/new" : "/auth/login"}>
            <Button 
              size="lg"
              variant="secondary"
              className="px-8"
            >
              {authenticated ? "Write Your First Review" : "Join Our Community"}
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Happy Travelers" },
              { number: "50K+", label: "Reviews Shared" },
              { number: "1K+", label: "Destinations" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-card rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on the client side
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setAuthenticated(data.authenticated);
    };
    checkAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-background to-secondary/10">
      <motion.main 
        className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl sm:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to <span className="text-primary">StayScore</span>
        </motion.h1>
        <motion.p 
          className="mt-3 text-xl sm:text-2xl text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Share and discover honest reviews about your stays
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row mt-6 space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {authenticated ? (
            <>
              <Link href="/reviews">
                <Button size="lg" className="w-full sm:w-auto">Go to Reviews</Button>
              </Link>
              <Link href="/reviews/new">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Write a Review</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
              </Link>
              <Link href="/reviews">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Browse Reviews</Button>
              </Link>
            </>
          )}
        </motion.div>
      </motion.main>
      <motion.div 
        className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {[
          { title: "Honest Reviews", description: "Get unbiased opinions from real travelers" },
          { title: "Global Community", description: "Connect with travelers from around the world" },
          { title: "Personalized Recommendations", description: "Discover stays that match your preferences" }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-card text-card-foreground rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
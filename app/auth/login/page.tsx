"use client";

import { useState } from "react";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome to StayScore</h1>
          <p className="text-muted-foreground">Share and discover honest reviews about your stays</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {isLogin ? "Log in" : "Sign up"} with
              </span>
            </div>
          </div>

          {isLogin ? (
            <LoginLink>
              <Button className="w-full" size="lg">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.89-8.9c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67C13.18 4.2 12.38 3 10.06 3 8.59 3 6.81 3.8 6.81 5.81c0 2.17 2.1 2.85 3.89 3.45 1.88.61 2.25 1.04 2.25 1.67 0 .66-.67 1.57-2.05 1.57-1.7 0-2.46-.74-2.64-1.67l-1.6.67c.36 1.72 1.61 2.71 4.24 2.71 2.17 0 3.81-1.17 3.81-3.17 0-2.07-1.87-2.85-3.76-3.45z"/>
                </svg>
                Continue with Kinde
              </Button>
            </LoginLink>
          ) : (
            <RegisterLink>
              <Button className="w-full" size="lg">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.89-8.9c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67C13.18 4.2 12.38 3 10.06 3 8.59 3 6.81 3.8 6.81 5.81c0 2.17 2.1 2.85 3.89 3.45 1.88.61 2.25 1.04 2.25 1.67 0 .66-.67 1.57-2.05 1.57-1.7 0-2.46-.74-2.64-1.67l-1.6.67c.36 1.72 1.61 2.71 4.24 2.71 2.17 0 3.81-1.17 3.81-3.17 0-2.07-1.87-2.85-3.76-3.45z"/>
                </svg>
                Sign up with Kinde
              </Button>
            </RegisterLink>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="ml-1 text-primary hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </motion.div>
      </div>
    </div>
  );
}
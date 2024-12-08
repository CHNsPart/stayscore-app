"use client";

import { useState, useEffect } from 'react';
import { Star, Calendar, BarChart2, MapPin } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from 'next-themes';
import { AnonymousSettings } from '@/components/profile/AnonymousSettings';
import Loader from '../theme/Loader';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

type DynamicFieldValue = string | number | boolean;

interface Review {
  id: string;
  location: string;
  rating: number;
  createdAt: string;
  content: string;
  images?: string;
  dynamicFields?: Record<string, DynamicFieldValue>;
  anonymous?: boolean;
}

interface User {
  image?: string;
  name?: string;
  email?: string;
  createdAt: string;
  anonymous: boolean;
}

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [anonymousGlobal, setAnonymousGlobal] = useState(false);
  const { theme, setTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data.user);
      setReviews(data.reviews);
      setAnonymousGlobal(data.user.anonymous);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Update the reviews state by filtering out the deleted review
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete review. Please try again.",
      });
    }
  };

  const toggleAnonymous = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous: !anonymousGlobal }),
      });
      if (response.ok) {
        setAnonymousGlobal(!anonymousGlobal);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getMostRecentLocation = () => {
    if (reviews.length === 0) return '';
    // Get state from the most recent review's location
    const mostRecentLocation = reviews[0].location.split(',')[1]?.trim() || '';
    return mostRecentLocation;
  };

  if (error) return <div>Error: {error}</div>;
  if (!user) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="md:col-span-2 bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{anonymousGlobal ? 'Anonymous User' : user.name || 'User'}</h1>
                <p className="text-muted-foreground">{anonymousGlobal ? '****@****.com' : user.email}</p>
                <p className="text-sm text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 p-3 bg-chart-1/10 rounded-full">
                      <Star className="h-6 w-6 text-chart-1" />
                    </div>
                    <p className="text-3xl font-bold text-chart-1 mb-1">
                      {reviews.length}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      Total Reviews
                    </p>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 p-3 bg-chart-2/10 rounded-full">
                      <BarChart2 className="h-6 w-6 text-chart-2" />
                    </div>
                    <p className="text-3xl font-bold text-chart-2 mb-1">
                      {getAverageRating()}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      Average Rating
                    </p>
                  </div>
                </div>
                
                <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 p-3 bg-chart-3/10 rounded-full">
                      <MapPin className="h-6 w-6 text-chart-3" />
                    </div>
                    <p className="text-3xl font-bold text-chart-3 mb-1 truncate max-w-[150px]">
                      {getMostRecentLocation()}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      Most Recent Location
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="flex items-center justify-between mb-4">
              <span>Dark Mode</span>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleDarkMode} />
            </div>
            <AnonymousSettings 
              anonymousGlobal={anonymousGlobal} 
              onToggleAnonymous={toggleAnonymous}
            />
          </div>

          {/* Recent Reviews */}
          <div className="md:col-span-3 bg-card text-card-foreground rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-border last:border-b-0 pb-4 hover:bg-accent hover:text-accent-foreground p-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{review.location}</h3>
                      <div className="flex items-center mt-1">
                        {[...Array(10)].map((_, i) => (
                          <Star key={i} className={`size-4 ${i < review.rating ? 'text-chart-4 fill-chart-4' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this review? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteReview(review.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="mt-2 text-muted-foreground">{review.content.substring(0, 100)}...</p>
                  {review.images && 
                    <Image 
                      src={review.images} 
                      alt={review.location} 
                      height={150} 
                      width={150} 
                      className="mt-2 text-sm w-full md:w-fit" 
                    />
                  }
                  {review.dynamicFields && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Additional Information:</p>
                      <ul>
                        {Object.entries(JSON.parse(String(review.dynamicFields))).map(([key, value]) => (
                          <li key={key}>{key}: {String(value)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.anonymous && <p className="mt-2 text-sm text-muted-foreground">(Posted anonymously)</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
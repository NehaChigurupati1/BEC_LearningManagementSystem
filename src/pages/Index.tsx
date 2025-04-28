
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/providers/AuthProvider';

// Sample carousel items for educational platform
const carouselItems = [
  {
    id: 1,
    title: "Learn Anywhere, Anytime",
    description: "Access courses from any device, at your own pace, with our responsive learning platform.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    color: "from-blue-500 to-indigo-700"
  },
  {
    id: 2,
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of experience in their fields.",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    color: "from-green-500 to-teal-700"
  },
  {
    id: 3,
    title: "Interactive Learning Experience",
    description: "Engage with courses through interactive content, quizzes, and projects.",
    imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1200&auto=format&fit=crop",
    color: "from-orange-500 to-amber-700"
  }
];

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-16 gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              Learning Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              Discover courses designed to help you achieve your goals, taught by industry experts.
            </p>
            <div className="flex gap-4">
              {!user ? (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" asChild>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop" 
              alt="E-learning concept" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
        
        {/* Carousel Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Platform?</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {carouselItems.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/1 lg:basis-3/4">
                  <Card className="overflow-hidden h-full">
                    <div className="relative h-64 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-70`}></div>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <h3 className="text-3xl font-bold text-white text-center">{item.title}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-lg text-gray-700 dark:text-gray-300">{item.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="mr-2" />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
        
        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Self-Paced Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Learn at your own speed. Our courses are designed to accommodate your schedule, letting you master new skills on your terms.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Interactive Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Engage with video lectures, quizzes, assignments, and projects that reinforce learning through practical application.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Connect with fellow learners and instructors through discussion forums and community events to enhance your learning experience.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already advancing their careers with our courses.
          </p>
          {!user ? (
            <Button size="lg" asChild>
              <Link to="/register">Sign Up Now</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;

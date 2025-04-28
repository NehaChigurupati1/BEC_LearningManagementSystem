
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getCourseById, 
  enrollInCourse, 
  updateTopicProgress, 
  submitFeedback,
  checkWeekFeedback
} from '@/services/courseService';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2, CheckCircle, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [weekFeedbackStatus, setWeekFeedbackStatus] = useState<{[key: string]: boolean}>({});
  
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id as string),
    enabled: !!id,
    meta: {
      onError: (error: any) => {
        toast.error('Error loading course: ' + error.message);
        navigate('/courses');
      }
    }
  });

  useEffect(() => {
    // Check if user has submitted feedback for each week
    if (isAuthenticated && course?.weeks) {
      course.weeks.forEach(async (week) => {
        const hasSubmitted = await checkWeekFeedback(week.id);
        setWeekFeedbackStatus(prev => ({
          ...prev,
          [week.id]: hasSubmitted
        }));
      });
    }
  }, [course, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to enroll in this course');
      return;
    }

    try {
      await enrollInCourse(id as string);
      toast.success('Successfully enrolled!');
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
    } catch (error: any) {
      console.error('Error enrolling:', error);
    }
  };

  const handleVideoComplete = async () => {
    if (!isAuthenticated || !course) return;
    
    try {
      const currentWeek = course.weeks[currentWeekIndex];
      if (!currentWeek) return;
      
      const currentTopic = currentWeek.topics[currentVideoIndex];
      if (!currentTopic) return;
      
      await updateTopicProgress(currentTopic.id, videoProgress, true);
      toast.success('Progress saved!');
      
      // Show feedback form if this is the last video in the week
      if (currentVideoIndex === currentWeek.topics.length - 1 && !weekFeedbackStatus[currentWeek.id]) {
        setShowFeedbackForm(true);
      }
    } catch (error: any) {
      console.error('Error updating progress:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!isAuthenticated || !course) return;
    
    const currentWeek = course.weeks[currentWeekIndex];
    if (!currentWeek) return;
    
    setSubmittingFeedback(true);
    
    try {
      await submitFeedback(course.id, currentWeek.id, rating, comment);
      setWeekFeedbackStatus(prev => ({
        ...prev,
        [currentWeek.id]: true
      }));
      setShowFeedbackForm(false);
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            {isAuthenticated && (
              <Button onClick={handleEnroll} className="mt-4 md:mt-0">
                Enroll Now
              </Button>
            )}
          </div>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Instructor: {course.instructor}</span>
            <span className="mx-2">•</span>
            <span>{course.weeks.length} {course.weeks.length === 1 ? 'Week' : 'Weeks'}</span>
            <span className="mx-2">•</span>
            <span>
              {course.weeks.reduce((total, week) => total + (week.topics?.length || 0), 0)} Lessons
            </span>
          </div>
        </div>

        {/* Course Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            {isAuthenticated && <TabsTrigger value="learn">Learn</TabsTrigger>}
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                    <ul className="space-y-2">
                      {course.weeks.map((week, index) => (
                        <li key={week.id} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>{week.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Course Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>No prior knowledge required</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span>Basic computer skills</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {course.weeks.map((week, weekIndex) => (
                    <div key={week.id}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{week.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {week.topics?.length || 0} lessons
                        </span>
                      </div>
                      <div className="space-y-2 ml-6">
                        {week.topics?.map((topic, topicIndex) => (
                          <div key={topic.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                            <span>{topic.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.floor(Math.random() * 20) + 5} min
                            </span>
                          </div>
                        ))}
                      </div>
                      {isAuthenticated && !weekFeedbackStatus[week.id] && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-2 ml-6">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Give Feedback
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Week Feedback: {week.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Rate this week's content (1-5 stars)</Label>
                                <RadioGroup 
                                  defaultValue="5" 
                                  className="flex space-x-2"
                                  onValueChange={(value) => setRating(parseInt(value))}
                                >
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <div key={value} className="flex flex-col items-center">
                                      <RadioGroupItem value={String(value)} id={`rating-${value}`} />
                                      <Label htmlFor={`rating-${value}`}>{value}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comment">Comments (optional)</Label>
                                <Textarea 
                                  id="comment"
                                  placeholder="Share your thoughts on this week's content..."
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <Button 
                                onClick={() => {
                                  setCurrentWeekIndex(weekIndex);
                                  handleFeedbackSubmit();
                                }}
                                disabled={submittingFeedback}
                                className="w-full"
                              >
                                {submittingFeedback ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  'Submit Feedback'
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {isAuthenticated && weekFeedbackStatus[week.id] && (
                        <div className="ml-6 mt-2 text-sm text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Feedback submitted
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Learn Tab - Only shown to authenticated users */}
          {isAuthenticated && (
            <TabsContent value="learn">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      {course.weeks[currentWeekIndex]?.topics?.[currentVideoIndex]?.videoUrl ? (
                        <div className="aspect-video bg-black rounded-md overflow-hidden">
                          <video 
                            src={course.weeks[currentWeekIndex].topics[currentVideoIndex].videoUrl} 
                            controls
                            className="w-full h-full"
                            onTimeUpdate={(e) => setVideoProgress(Math.floor(e.currentTarget.currentTime))}
                            onEnded={handleVideoComplete}
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center">
                          <p className="text-white">Video not available</p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {course.weeks[currentWeekIndex]?.topics?.[currentVideoIndex]?.title || "No topic selected"}
                        </h3>
                        <p className="text-muted-foreground">
                          {course.weeks[currentWeekIndex]?.title || ""}
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-2">Resources</h4>
                        <div className="space-y-2">
                          {course.weeks[currentWeekIndex]?.topics?.[currentVideoIndex]?.resources?.length ? (
                            course.weeks[currentWeekIndex].topics[currentVideoIndex].resources.map(resource => (
                              <a 
                                key={resource.id} 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center p-2 rounded hover:bg-muted/50"
                              >
                                <span className="ml-2">{resource.title}</span>
                                <span className="ml-auto text-sm text-muted-foreground">
                                  {resource.type}
                                </span>
                              </a>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No resources available</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Course Content</h3>
                      <div className="space-y-4">
                        {course.weeks.map((week, weekIdx) => (
                          <div key={week.id}>
                            <div 
                              className={`p-3 rounded-md cursor-pointer ${currentWeekIndex === weekIdx ? 'bg-muted' : 'hover:bg-muted/50'}`}
                              onClick={() => setCurrentWeekIndex(weekIdx)}
                            >
                              <h4 className="font-medium">{week.title}</h4>
                              <div className="text-sm text-muted-foreground">
                                {week.topics?.length || 0} lessons
                              </div>
                            </div>
                            
                            {currentWeekIndex === weekIdx && week.topics?.map((topic, topicIdx) => (
                              <div 
                                key={topic.id}
                                className={`ml-4 p-2 rounded-md cursor-pointer ${currentVideoIndex === topicIdx ? 'bg-primary/10 text-primary' : 'hover:bg-muted/30'}`}
                                onClick={() => {
                                  setCurrentVideoIndex(topicIdx);
                                  setVideoProgress(0);
                                }}
                              >
                                {topic.title}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Week Feedback Dialog */}
              <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Week Feedback</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p>How would you rate this week's content?</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          variant={rating === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setRating(value)}
                        >
                          <Star 
                            className={`h-4 w-4 ${rating >= value ? "fill-current" : ""}`} 
                          />
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Share your thoughts about this week's content..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button 
                      onClick={handleFeedbackSubmit}
                      disabled={submittingFeedback}
                      className="w-full"
                    >
                      {submittingFeedback ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default CourseDetails;

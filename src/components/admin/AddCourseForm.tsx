
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createCourse } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ImagePlus } from 'lucide-react';

const courseFormSchema = z.object({
  title: z.string().min(3, {
    message: 'Course title must be at least 3 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  instructor: z.string().min(2, {
    message: 'Instructor name must be at least 2 characters.',
  }),
  thumbnail: z.string().url({
    message: 'Please enter a valid URL for the thumbnail.',
  }).optional().or(z.literal('')),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface AddCourseFormProps {
  onSuccess?: () => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      instructor: '',
      thumbnail: '',
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('thumbnail', url);
    setPreviewUrl(url);
  };

  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting course data:", values);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('instructor', values.instructor);
      
      // If thumbnail URL is provided, add it
      if (values.thumbnail) {
        formData.append('thumbnailUrl', values.thumbnail);
      }
      
      // Send request to backend using the adminService
      const response = await createCourse(formData);
      
      toast.success('Course created successfully!');
      console.log("Course created:", response);
      form.reset();
      setPreviewUrl('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error(error.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter course description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter instructor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter thumbnail URL" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleThumbnailChange(e);
                      }} 
                    />
                  </FormControl>
                  <FormMessage />
                  {previewUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                      <div className="relative h-40 w-full overflow-hidden rounded-md border">
                        <img 
                          src={previewUrl} 
                          alt="Thumbnail preview" 
                          className="h-full w-full object-cover"
                          onError={() => {
                            setPreviewUrl('');
                            toast.error('Failed to load image preview');
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {!previewUrl && (
                    <div className="mt-2 flex items-center justify-center h-40 w-full border border-dashed rounded-md bg-muted/40">
                      <div className="text-center">
                        <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Enter a URL to preview thumbnail
                        </p>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                'Create Course'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddCourseForm;

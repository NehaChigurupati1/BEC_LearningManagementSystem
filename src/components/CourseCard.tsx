
import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="block group">
      <div className="glass-card rounded-2xl overflow-hidden hover-card">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-xl mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {course.weeks.length} {course.weeks.length === 1 ? 'Week' : 'Weeks'}
            </span>
            <span className="text-sm text-muted-foreground">
              {course.instructor}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

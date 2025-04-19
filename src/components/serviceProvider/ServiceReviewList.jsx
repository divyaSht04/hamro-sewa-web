import React, { useState, useEffect } from 'react';
import { Star, User, MessageCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getServiceReviews } from '../../services/reviewService';
import { formatDistanceToNow } from 'date-fns';

const ServiceReviewList = ({ serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!serviceId) return;
      
      setLoading(true);
      try {
        const data = await getServiceReviews(serviceId);
        setReviews(data);
        
        // Calculate average rating
        if (data.length > 0) {
          const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating((totalRating / data.length).toFixed(1));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  // Format review date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Recently';
      
      const formattedString = dateString.includes('T') 
        ? dateString 
        : dateString.replace(' ', 'T');
      
      const date = new Date(formattedString);
      
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  // Generate star rating component
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Display max 3 reviews if not expanded
  const visibleReviews = expanded ? reviews : reviews.slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-500">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-2">
        No reviews yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-900 mr-2">{averageRating}</span>
          {renderStars(Math.round(averageRating))}
        </div>
        <span className="ml-2 text-sm text-gray-500">({reviews.length} reviews)</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {visibleReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="font-medium">{review.customerName || 'Customer'}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div>{renderStars(review.rating)}</div>
              </div>
              <div className="mt-2 text-gray-700">{review.comment}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-3"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} className="mr-1" /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" /> Show all {reviews.length} reviews
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ServiceReviewList;

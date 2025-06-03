import React from 'react';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Denver, CO",
      saved: "$1,342",
      quote: "After my surgery, I was shocked by the bill. VeriCare found over $1,300 in errors and got them corrected within two weeks!",
      stars: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Michael Rodriguez",
      location: "Chicago, IL",
      saved: "$876",
      quote: "I would have paid the bill without questioning it. VeriCare's AI found multiple coding errors that I would never have spotted.",
      stars: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Emily Chen",
      location: "Seattle, WA",
      saved: "$2,105",
      quote: "The process was so simple. I uploaded my bill, and VeriCare handled everything. The hospital adjusted my bill without any hassle.",
      stars: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">Success Stories</h2>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Join thousands of patients who have saved money on their medical bills with VeriCare.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                <p className="text-gray-600 text-sm">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(testimonial.stars)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount Saved:</span>
              <span className="text-lg font-bold text-green-600">{testimonial.saved}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
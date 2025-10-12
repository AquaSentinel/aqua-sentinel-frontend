import React from 'react';
import { Link } from 'react-router-dom';
import shipdetect from '../assets/images/shipdetect.png';
import debrisdetect from '../assets/images/debrisdetect.png';
function Grid() {
  const projects = [
    {
      title: "Ship Detection",
      subtitle: "(YOLOv8, Object Detection)",
      image: shipdetect,
      link: "/home/ship-detection"
    },
    {
      title: "Debris Detection",
      subtitle: "(Mask R-CNN, Instance Segmentation)",
      image: debrisdetect,
      link: "/home/marine-debris-detection"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, idx) => (
            <Link
              to={project.link}
              key={idx}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1"
            >
              {/* Background Image */}
              <div
                className="h-96 md:h-[28rem] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${project.image})`,
                  backgroundColor: '#1a365d'
                }}
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-lg text-gray-300 mb-4">
                      {project.subtitle}
                    </p>
                    <div className="inline-flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-medium">Learn More</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Grid;
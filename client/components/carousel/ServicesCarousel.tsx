import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselSlide {
  image: string;
  title: string;
  subtitle1: string;
  subtitle2: string;
}

const slides: CarouselSlide[] = [
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F62ac195bbfcb40fd8b08f046bf0947dc%2F1384393d255749b4b098dcf904423f2f?format=webp&width=800&height=1200",
    title: "Content Syndication",
    subtitle1: "Distribute your content across multiple channels",
    subtitle2: "Reach your audience wherever they are",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F62ac195bbfcb40fd8b08f046bf0947dc%2F08cdf551d4fa40879c2f905ef94bfdd8?format=webp&width=800&height=1200",
    title: "ABM Campaign Services",
    subtitle1: "Targeted account-based marketing campaigns",
    subtitle2: "Drive higher engagement and conversion rates",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F62ac195bbfcb40fd8b08f046bf0947dc%2Feb2b945adf654ca0ac94b0aa12b0d840?format=webp&width=800&height=1200",
    title: "Programmatic ABM",
    subtitle1: "AI-powered account targeting and personalization",
    subtitle2: "Automate your ABM strategy with machine learning",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F62ac195bbfcb40fd8b08f046bf0947dc%2Fce1af6a757d54c2cabc594308494ec1e?format=webp&width=800&height=1200",
    title: "HQL Programs",
    subtitle1: "Identify high-quality leads with precision scoring",
    subtitle2: "Focus on prospects most likely to convert",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F62ac195bbfcb40fd8b08f046bf0947dc%2F4efb4819cd484ac49fd4817e18b42bee?format=webp&width=800&height=1200",
    title: "MQL Programs",
    subtitle1: "Marketing qualified leads generation at scale",
    subtitle2: "Nurture prospects through automated workflows",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F62ac195bbfcb40fd8b08f046bf0947dc%2Fb5fd99f6232846b0b633dbb69dc85a1d?format=webp&width=800&height=1200",
    title: "Advanced Analytics",
    subtitle1: "Real-time insights into campaign performance",
    subtitle2: "Data-driven decisions for better ROI",
  },
];

export default function ServicesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className={`relative w-full transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: "150ms" }}
    >
      {/* Text Content - Above Carousel */}
      <div
        className={`text-center mb-6 space-y-3 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"}`}
        style={{ transitionDelay: "150ms" }}
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-valasys-gray-900">
          {slides[currentSlide].title}
        </h3>
        <p className="text-sm sm:text-base text-valasys-gray-700">
          {slides[currentSlide].subtitle1}
        </p>
        <p className="text-sm sm:text-base text-valasys-gray-600">
          {slides[currentSlide].subtitle2}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-valasys-orange/20 to-valasys-blue/10 backdrop-blur-sm border border-white/20">
        {/* Slides - Image Only */}
        <div className="relative h-96 w-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-all duration-500 ease-out",
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full",
              )}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-200 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Navigation - Below Carousel */}
      <div
        className={`flex items-center justify-center gap-2 mt-6 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        style={{ transitionDelay: "300ms" }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300 cursor-pointer",
              index === currentSlide
                ? "w-8 bg-valasys-orange"
                : "w-2 bg-valasys-gray-300 hover:bg-valasys-gray-400",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
        <span className="ml-4 text-sm text-valasys-gray-600">
          <span className="font-semibold text-valasys-orange">
            {currentSlide + 1}
          </span>
          {" of "}
          <span className="font-semibold text-valasys-orange">
            {slides.length}
          </span>
        </span>
      </div>
    </div>
  );
}

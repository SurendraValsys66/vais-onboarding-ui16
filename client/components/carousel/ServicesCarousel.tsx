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
      "https://cdn.builder.io/api/v1/image/assets%2Ffbb0339b508345889e143f85a9c96c4d%2Ff417f1558bcf4cd48877dc1b7973886f?format=webp&width=800&height=1200",
    title: "3 Filters for Lead Quality",
    subtitle1: "Separate gold from gravel with intent, authority, and company fit",
    subtitle2: "Precision targeting for higher conversion rates",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Ffbb0339b508345889e143f85a9c96c4d%2F4a3397c618184bad90f6eace8d5c7837?format=webp&width=800&height=1200",
    title: "ABM Missing Insights",
    subtitle1: "Funnel Stage, Market Trend, Alignment Score, Outreach Personalization",
    subtitle2: "Get complete visibility into your ABM performance",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Ffbb0339b508345889e143f85a9c96c4d%2F2d655e9905334b39b91b2e65713a660f?format=webp&width=800&height=1200",
    title: "Qualified Leads Calculator",
    subtitle1: "Apply filters by regions, industries, employee sizes, and revenue",
    subtitle2: "Calculate your ideal lead count instantly",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Ffbb0339b508345889e143f85a9c96c4d%2F024fcc8575404780b645cbb034bbf850?format=webp&width=800&height=1200",
    title: "Industry Intelligence Reimagined",
    subtitle1: "Smart insights with competitive edge and real-time data",
    subtitle2: "Stay ahead with actionable market intelligence",
  },
  {
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Ffbb0339b508345889e143f85a9c96c4d%2Fa7b9672336aa40809abae981577383ca?format=webp&width=800&height=1200",
    title: "Complicated Insights & Limited Customization",
    subtitle1: "Hindring pipeline growth with complex data analysis",
    subtitle2: "Streamline your workflow with smarter insights",
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
      {/* Carousel Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-valasys-orange/20 to-valasys-blue/10 backdrop-blur-sm border border-white/20">
        {/* Slides - Image Only */}
        <div className="relative h-64 w-full overflow-hidden">
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

      {/* Text Content - Below Carousel */}
      <div
        className={`text-center mt-4 space-y-2 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        style={{ transitionDelay: "300ms" }}
      >
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-valasys-orange via-valasys-orange-light to-valasys-orange bg-clip-text text-transparent">
          {slides[currentSlide].title}
        </h3>
        <p className="text-xs sm:text-sm text-valasys-gray-700 leading-tight">
          {slides[currentSlide].subtitle1}
        </p>
        <p className="text-xs sm:text-sm text-valasys-gray-600 leading-tight">
          {slides[currentSlide].subtitle2}
        </p>
      </div>
    </div>
  );
}

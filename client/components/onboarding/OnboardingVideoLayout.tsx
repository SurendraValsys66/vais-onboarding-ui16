import React from "react";
import { Link } from "react-router-dom";
import OnboardingPersonalizationPanel from "./OnboardingPersonalizationPanel";
import { SummaryValues } from "./OnboardingSummaryPanel";

export default function OnboardingVideoLayout({
  content,
  summaryValues,
  summaryTotal,
  logoSrc,
  logoAlt = "VAIS Logo",
  videoSrc = "https://cdn.builder.io/o/assets%2Fca3c5e060b9e43be9ac23c9d5ca30b53%2F4cc5fc7138e447e19726c8591642a50b?alt=media&token=db33d9de-75b4-4476-bd4c-3e6af0d53bcc&apiKey=ca3c5e060b9e43be9ac23c9d5ca30b53",
}: {
  content: React.ReactNode;
  summaryValues: SummaryValues;
  summaryTotal: number;
  logoSrc?: string;
  logoAlt?: string;
  videoSrc?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Blur overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Logo top-left */}
      {logoSrc ? (
        <div className="pointer-events-auto absolute left-4 top-4 md:left-6 md:top-6 z-20">
          <Link to="/" className="inline-flex items-center">
            <img src={logoSrc} alt={logoAlt} className="h-9 w-auto" />
          </Link>
        </div>
      ) : null}

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              {/* Content and Personalization side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side - Main form content */}
                <div className="lg:col-span-2">{content}</div>

                {/* Right side - Personalization panel inside card */}
                <div className="lg:col-span-1">
                  <OnboardingPersonalizationPanel
                    values={summaryValues}
                    total={summaryTotal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

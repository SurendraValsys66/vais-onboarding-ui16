import React from "react";
import { X, Sun, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CongratulatinModalProps {
  onClose: () => void;
  onContinue: () => void;
}

export default function CongratulatinModal({
  onClose,
  onContinue,
}: CongratulatinModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-yellow-100 rounded-3xl p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content container */}
        <div className="flex flex-col items-center gap-6">
          {/* Sun icon */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <Sun className="w-16 h-16 text-yellow-400" strokeWidth={1.5} />
          </div>

          {/* Star progress indicators */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="w-8 h-8 bg-yellow-300 rounded-lg flex items-center justify-center"
              >
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
            ))}
          </div>

          {/* Congratulations heading */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Congratulations
            </h2>
            <p className="text-sm text-gray-600">
              You've completed all the steps — enjoy your reward of{" "}
              <span className="font-semibold text-orange-500">50 bonus credits</span>!{" "}
              🎉
            </p>
          </div>

          {/* Rewards section */}
          <div className="w-full bg-yellow-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Rewards Unlocked:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-yellow-500">★</span>
                50 bonus credits added
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-yellow-500">★</span>
                Priority access to new features
              </li>
            </ul>
          </div>

          {/* Go to Dashboard button */}
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

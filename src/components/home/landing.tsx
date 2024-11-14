"use client";

import { useEffect, useState } from "react";
import LandingAnimation from "@/components/home/animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spline from "@splinetool/react-spline";
import { Search, MapPin, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function Landing() {
  const [destination, setDestination] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Destination:", destination);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/3 flex flex-col justify-center items-center relative">
        <div
          className={`w-full ${
            isMobile ? "h-[40vh] pt-5" : "h-[50vh]"
          } flex justify-center items-center`}
        >
          <div
            className={`${
              isMobile ? "scale-50" : ""
            } transform transition-transform duration-300`}
          >
            <LandingAnimation />
          </div>
        </div>

        {/* Enhanced Form Section */}
        <div className="w-full px-4 lg:px-0 space-y-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Find Your Way
            </h2>
            <p className="text-gray-600 mt-1">
              Enter your destination to get started
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm mx-auto items-center space-x-2"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Go</Button>
          </form>

          {isMobile && (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm mx-auto">
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2 py-6"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Nearby Spots</span>
                </Button>
                <Link href="/forum" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 py-6"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Latest Updates</span>
                  </Button>
                </Link>
              </div>

              {/* Recent Searches */}
              <div className="mt-8 max-w-sm mx-auto">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mall of Asia
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    BGC Central
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="w-full lg:w-2/3 h-[50vh] lg:h-screen flex justify-center overflow-hidden items-center">
          <Spline
            scene="https://prod.spline.design/zpMJQkPWSrM6Shpm/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}

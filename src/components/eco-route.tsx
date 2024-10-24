"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Libraries,
  useLoadScript,
} from "@react-google-maps/api";
import { Bus, Car, Train } from "lucide-react";

// Types
interface RouteInfo {
  distance: string;
  duration: string;
  carbonEmission: string;
}

interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  options: google.maps.MapOptions;
}

// Constants
const LIBRARIES: Libraries = ["places"];
const EMISSION_FACTOR = 0.12; // kg CO2 per km (average car)

const INITIAL_MAP_CONFIG: MapConfig = {
  center: {
    lat: 14.5995,
    lng: 120.9842, // Manila, Philippines
  },
  zoom: 10,
  options: {
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    disableDefaultUI: true,
  },
};

// Custom hook for route calculations
const useRouteCalculator = () => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const calculateRoute = useCallback(
    async (
      originRef: React.RefObject<HTMLInputElement>,
      destinationRef: React.RefObject<HTMLInputElement>
    ) => {
      if (!originRef.current?.value || !destinationRef.current?.value) {
        return;
      }

      try {
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destinationRef.current.value,
          travelMode: google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(results);

        const distance = results.routes[0].legs[0].distance?.text || "";
        const duration = results.routes[0].legs[0].duration?.text || "";
        const distanceInKm = results.routes[0].legs[0].distance?.value
          ? results.routes[0].legs[0].distance.value / 1000
          : 0;

        setRouteInfo({
          distance,
          duration,
          carbonEmission: (distanceInKm * EMISSION_FACTOR).toFixed(2),
        });
      } catch (error) {
        console.error("Error calculating route:", error);
      }
    },
    []
  );

  const clearRoute = useCallback(
    (
      originRef: React.RefObject<HTMLInputElement>,
      destinationRef: React.RefObject<HTMLInputElement>
    ) => {
      setDirectionsResponse(null);
      setRouteInfo(null);
      if (originRef.current) originRef.current.value = "";
      if (destinationRef.current) destinationRef.current.value = "";
    },
    []
  );

  return {
    directionsResponse,
    routeInfo,
    calculateRoute,
    clearRoute,
  };
};

// Main component
export function EcoRoute() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API,
    libraries: LIBRARIES,
  });

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const originAutoCompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const destinationAutoCompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  const { directionsResponse, routeInfo, calculateRoute, clearRoute } =
    useRouteCalculator();

  const onLoadOrigin = (autocomplete: google.maps.places.Autocomplete) => {
    originAutoCompleteRef.current = autocomplete;
  };

  const onPlaceChangedOrigin = () => {
    if (originAutoCompleteRef.current) {
      const place = originAutoCompleteRef.current.getPlace();
      // You can also extract necessary data from the place object
      // Example: console.log(place.formatted_address);
      if (place && originRef.current) {
        originRef.current.value = place.formatted_address || "";
      }
    }
  };

  const onLoadDestination = (autocomplete: google.maps.places.Autocomplete) => {
    destinationAutoCompleteRef.current = autocomplete;
  };

  const onPlaceChangedDestination = () => {
    if (destinationAutoCompleteRef.current) {
      const place = destinationAutoCompleteRef.current.getPlace();
      if (place && destinationRef.current) {
        destinationRef.current.value = place.formatted_address || "";
      }
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading maps...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={INITIAL_MAP_CONFIG.center}
        zoom={INITIAL_MAP_CONFIG.zoom}
        options={INITIAL_MAP_CONFIG.options}
      >
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: false,
              preserveViewport: false,
            }}
          />
        )}
      </GoogleMap>

      <div className="absolute m-4 md:top-0 md:left-0 bottom-0 left-0 right-0 md:right-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Autocomplete
                onLoad={onLoadOrigin}
                onPlaceChanged={onPlaceChangedOrigin}
              >
                <Input
                  ref={originRef}
                  placeholder="Origin"
                  className="flex-grow"
                  aria-label="Origin location"
                />
              </Autocomplete>
              <Autocomplete
                onLoad={onLoadDestination}
                onPlaceChanged={onPlaceChangedDestination}
              >
                <Input
                  ref={destinationRef}
                  placeholder="Destination"
                  className="flex-grow"
                  aria-label="Destination location"
                />
              </Autocomplete>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <Button
                  onClick={() => calculateRoute(originRef, destinationRef)}
                  className="whitespace-nowrap"
                >
                  Calculate Route
                </Button>
                <Button
                  onClick={() => clearRoute(originRef, destinationRef)}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  Clear Route
                </Button>
              </div>
            </div>

            {routeInfo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <RouteInfoCard
                  icon={<Car className="w-6 h-6 mb-2" />}
                  title="Distance"
                  value={routeInfo.distance}
                />
                <RouteInfoCard
                  icon={<Bus className="w-6 h-6 mb-2" />}
                  title="Duration"
                  value={routeInfo.duration}
                />
                <RouteInfoCard
                  icon={<Train className="w-6 h-6 mb-2" />}
                  title="Carbon Emission"
                  value={`${routeInfo.carbonEmission} kg CO2`}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Reusable info card component
interface RouteInfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const RouteInfoCard = ({ icon, title, value }: RouteInfoCardProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg transition-colors hover:bg-black/5">
    {icon}
    <p className="font-semibold text-sm md:text-base">{title}</p>
    <p className="text-sm md:text-base text-gray-600">{value}</p>
  </div>
);

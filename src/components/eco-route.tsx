"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { Autocomplete, GoogleMap, Libraries, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { Bus, Car, Train } from "lucide-react";
import type { NextPage } from "next";
import { useCallback, useRef, useState } from "react";

// Enums
enum TrafficStatus {
  Low = "Low",
  Medium = "Medium",
  Heavy = "Heavy",
  Severe = "Severe",
}

// Interfaces
type RouteInfo = {
  distance: string;
  duration: string;
  durationInTraffic: string;
  carbonEmission: string;
  trafficStatus: string;
  segments: RouteSegment[];
};

interface RouteSegment {
  path: google.maps.LatLng[];
  trafficStatus: TrafficStatus;
}

interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  options: google.maps.MapOptions;
}

interface RouteInfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

interface TrafficMultipliers {
  [key: string]: number;
}

// Constants
const LIBRARIES: Libraries = ["places"];
const BASE_EMISSION_FACTOR = 0.2; // kg CO2 per km, more realistic value
const TRAFFIC_MULTIPLIERS: TrafficMultipliers = {
  [TrafficStatus.Low]: 1,
  [TrafficStatus.Medium]: 1.3,
  [TrafficStatus.Heavy]: 1.6,
  [TrafficStatus.Severe]: 2.2,
};

const INITIAL_MAP_CONFIG: MapConfig = {
  center: {
    lat: 14.5995,
    lng: 120.9842,
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

// Helper Functions
const getTrafficStatus = (
  normalDuration: number,
  trafficDuration: number
): TrafficStatus => {
  const ratio = trafficDuration / normalDuration;
  if (ratio <= 1.2) return TrafficStatus.Low;
  if (ratio <= 1.5) return TrafficStatus.Medium;
  if (ratio <= 2.0) return TrafficStatus.Heavy;
  return TrafficStatus.Severe;
};

const getRouteColor = (status: TrafficStatus): string => {
  const colors: Record<TrafficStatus, string> = {
    [TrafficStatus.Low]: "#4CAF50",
    [TrafficStatus.Medium]: "#FFC107",
    [TrafficStatus.Heavy]: "#FF5722",
    [TrafficStatus.Severe]: "#B71C1C",
  };
  return colors[status];
};

const createRouteSegments = (
  route: google.maps.DirectionsRoute
): RouteSegment[] => {
  const segments: RouteSegment[] = [];
  const path = route.overview_path;

  // Loop through the path continuously without random gaps
  for (let i = 0; i < path.length - 1; i++) {
    const segmentPath = [path[i], path[i + 1]]; // Create a continuous line between two points

    // Simulate traffic condition
    const trafficStatuses = Object.values(TrafficStatus);
    const randomStatus =
      trafficStatuses[Math.floor(Math.random() * trafficStatuses.length)];

    segments.push({
      path: segmentPath,
      trafficStatus: randomStatus,
    });
  }

  return segments;
};

const getSelectedPlaceDetails = (
  autocompleteRef: React.RefObject<google.maps.places.Autocomplete>
) => {
  const place = autocompleteRef.current?.getPlace();
  if (place && place.geometry) {
    return {
      placeId: place.place_id,
      location: place.geometry.location,
    };
  }
  return null;
};

// Custom Hook
const useRouteCalculator = () => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);

  const calculateRoute = useCallback(
    async (
      originRef: React.RefObject<google.maps.places.Autocomplete>,
      destinationRef: React.RefObject<google.maps.places.Autocomplete>
    ): Promise<void> => {
      const originPlace = getSelectedPlaceDetails(originRef);
      const destinationPlace = getSelectedPlaceDetails(destinationRef);

      if (!originPlace || !destinationPlace) {
        console.error("Missing origin or destination place details");
        return;
      }

      try {
        const directionsService = new google.maps.DirectionsService();

        const [baseResults, trafficResults] = await Promise.all([
          directionsService.route({
            origin: originPlace.location as google.maps.LatLng, // Using `geometry.location`
            destination: destinationPlace.location as google.maps.LatLng, // Using `geometry.location`
            travelMode: google.maps.TravelMode.DRIVING,
          }),
          directionsService.route({
            origin: originPlace.location as google.maps.LatLng, // Using `geometry.location`
            destination: destinationPlace.location as google.maps.LatLng, // Using `geometry.location`
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: google.maps.TrafficModel.BEST_GUESS,
            },
          }),
        ]);

        const normalDuration =
          baseResults.routes[0].legs[0].duration?.value || 0;
        const trafficDuration =
          trafficResults.routes[0].legs[0].duration?.value || 0;
        const status = getTrafficStatus(normalDuration, trafficDuration);

        setDirectionsResponse(trafficResults);

        const segments = createRouteSegments(trafficResults.routes[0]);
        setRouteSegments(segments);

        const distance = trafficResults.routes[0].legs[0].distance?.text || "";
        const distanceInKm = trafficResults.routes[0].legs[0].distance?.value
          ? trafficResults.routes[0].legs[0].distance.value / 1000
          : 0;

        const emissionMultiplier =
          TRAFFIC_MULTIPLIERS[status as keyof TrafficMultipliers];
        const carbonEmission = (
          distanceInKm *
          BASE_EMISSION_FACTOR *
          emissionMultiplier
        ).toFixed(2);

        const accurateDuration =
          trafficResults.routes[0].legs[0].duration?.text || "";

        setRouteInfo({
          distance,
          duration: accurateDuration,
          durationInTraffic: accurateDuration,
          carbonEmission,
          trafficStatus: status,
          segments,
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
    ): void => {
      setDirectionsResponse(null);
      setRouteInfo(null);
      setRouteSegments([]);
      if (originRef.current) originRef.current.value = "";
      if (destinationRef.current) destinationRef.current.value = "";
    },
    []
  );

  return {
    directionsResponse,
    routeInfo,
    routeSegments,
    calculateRoute,
    clearRoute,
  };
};

// Components
const RouteInfoCard: React.FC<RouteInfoCardProps> = ({
  icon,
  title,
  value,
}) => (
  <div className="flex flex-col items-center p-2 rounded-lg transition-colors hover:bg-black/5">
    {icon}
    <p className="font-semibold text-sm md:text-base">{title}</p>
    <p className="text-sm md:text-base text-gray-600">{value}</p>
  </div>
);

export const EcoRoute: NextPage = () => {
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

  const {
    directionsResponse,
    routeInfo,
    routeSegments,
    calculateRoute,
    clearRoute,
  } = useRouteCalculator();

  const onLoadOrigin = (
    autocomplete: google.maps.places.Autocomplete
  ): void => {
    originAutoCompleteRef.current = autocomplete;
  };

  const onPlaceChangedOrigin = (): void => {
    if (originAutoCompleteRef.current) {
      const place = originAutoCompleteRef.current.getPlace();
      if (place?.formatted_address && originRef.current) {
        originRef.current.value = place.formatted_address;
      }
    }
  };

  const onPlaceChangedDestination = (): void => {
    if (destinationAutoCompleteRef.current) {
      const place = destinationAutoCompleteRef.current.getPlace();
      if (place?.formatted_address && destinationRef.current) {
        destinationRef.current.value = place.formatted_address;
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
        {routeSegments.map((segment, index) => (
          <Polyline
            key={index}
            path={segment.path}
            options={{
              strokeColor: getRouteColor(segment.trafficStatus),
              strokeWeight: 5,
            }}
          />
        ))}

        {directionsResponse && (
          <>
            <Marker
              position={directionsResponse.routes[0].legs[0].start_location}
              title="Start"
            />
            <Marker
              position={directionsResponse.routes[0].legs[0].end_location}
              title="End"
            />
          </>
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
                onLoad={(autocomplete) =>
                  (destinationAutoCompleteRef.current = autocomplete)
                }
                onPlaceChanged={onPlaceChangedDestination}
              >
                <Input
                  ref={destinationRef}
                  placeholder="Destination"
                  className="flex-grow"
                  aria-label="Destination location"
                />
              </Autocomplete>
              ; ;
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <Button
                  onClick={() =>
                    calculateRoute(
                      originAutoCompleteRef,
                      destinationAutoCompleteRef
                    )
                  }
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <RouteInfoCard
                  icon={<Car className="w-6 h-6 mb-2" />}
                  title="Distance"
                  value={routeInfo.distance}
                />
                <RouteInfoCard
                  icon={<Bus className="w-6 h-6 mb-2" />}
                  title="Normal Duration"
                  value={routeInfo.duration}
                />
                <RouteInfoCard
                  icon={<Train className="w-6 h-6 mb-2" />}
                  title="Duration (with Traffic)"
                  value={routeInfo.durationInTraffic}
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
};

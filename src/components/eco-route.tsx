"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { Bus, Car, Train } from "lucide-react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useRef, useState } from "react";
import Map, { Layer, Source, ViewState } from 'react-map-gl';

// Types
interface RouteInfo {
  distance: string;
  duration: string;
  carbonEmission: string;
}
interface Coordinates {
  lng: number;
  lat: number;
}

// Constants
const EMISSION_FACTOR = 0.12; // kg CO2 per km (average car)
const MAPBOX_TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN;

const INITIAL_VIEW_STATE: Partial<ViewState> = {
  longitude: 120.9842,
  latitude: 14.5995,
  zoom: 10
};

// Custom hook for route calculations
const useRouteCalculator = () => {
  const [route, setRoute] = useState<GeoJSON.Feature | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const getCoordinatesFromAddress = async (address: string): Promise<Coordinates | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lng, lat };
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  const calculateRoute = useCallback(
    async (
      originRef: React.RefObject<HTMLInputElement>,
      destinationRef: React.RefObject<HTMLInputElement>
    ) => {
      if (!originRef.current?.value || !destinationRef.current?.value) {
        return;
      }

      try {
        const originCoords = await getCoordinatesFromAddress(originRef.current.value);
        const destCoords = await getCoordinatesFromAddress(destinationRef.current.value);

        if (!originCoords || !destCoords) {
          console.error("Could not find coordinates for addresses");
          return;
        }

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
        );

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];

          // Create GeoJSON feature for the route
          const routeGeoJSON: GeoJSON.Feature = {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          };

          setRoute(routeGeoJSON);

          // Calculate route information
          const distanceInKm = route.distance / 1000;
          const durationInMinutes = route.duration / 60;

          setRouteInfo({
            distance: `${distanceInKm.toFixed(1)} km`,
            duration: `${Math.round(durationInMinutes)} mins`,
            carbonEmission: (distanceInKm * EMISSION_FACTOR).toFixed(2)
          });
        }
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
      setRoute(null);
      setRouteInfo(null);
      if (originRef.current) originRef.current.value = "";
      if (destinationRef.current) destinationRef.current.value = "";
    },
    []
  );

  return {
    route,
    routeInfo,
    calculateRoute,
    clearRoute,
  };
};

// Route layer style
const routeLayer: mapboxgl.LayerSpecification = {
  id: 'route',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#007cbf',
    'line-width': 8,
    'line-opacity': 0.8
  }
};

// Main component
export function EcoRoute() {
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const { route, routeInfo, calculateRoute, clearRoute } = useRouteCalculator();

  // Suggestions handler
  const handleSuggestions = async (inputRef: React.RefObject<HTMLInputElement>, value: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      // You can implement a suggestions dropdown here using the features from data
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {route && (
          <Source type="geojson" data={route}>
            <Layer {...routeLayer} />
          </Source>
        )}
      </Map>

      <div className="absolute m-4 md:top-0 md:left-0 bottom-0 left-0 right-0 md:right-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Input
                ref={originRef}
                placeholder="Origin"
                className="flex-grow"
                aria-label="Origin location"
                onChange={(e) => handleSuggestions(originRef, e.target.value)}
              />
              <Input
                ref={destinationRef}
                placeholder="Destination"
                className="flex-grow"
                aria-label="Destination location"
                onChange={(e) => handleSuggestions(destinationRef, e.target.value)}
              />
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
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BIKE_LANES from "@/data/bikeLanes";
import type { LatLngTuple } from "leaflet";
import debounce from "lodash/debounce";
import { Bike, Bus, Car, PersonStanding } from "lucide-react";
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from "react";

// Dynamic imports for map components
const MapWithNoSSR = dynamic(
    () => import('./Map'), // Create this component separately
    {
        ssr: false,
        loading: () => <div className="flex-1 h-full w-full bg-gray-100" />
    }
);

enum TransportMode {
    CAR = "driving",
    BIKE = "bicycle",
    WALK = "foot",
}

const INITIAL_MAP_CONFIG = {
    center: [14.5995, 120.9842] as LatLngTuple,
    zoom: 13,
};

// Interfaces
interface Location {
    name: string;
    lat: number;
    lon: number;
}

interface RouteInfo {
    distance: string;
    duration: number;
    durationInTraffic?: number;
    directions: DirectionStep[];
    hasBikeLane?: boolean;
}

interface RouteData {
    coordinates: LatLngTuple[];
    mode: TransportMode;
}

interface RouteInfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
}

interface LocationSearchProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (location: Location) => void;
    disabled?: boolean;
}


interface DirectionStep {
    instruction: string;
    distance: number;
    duration: number;
    name: string;
}

// Interfaces (keep all your existing interfaces)
// ... (keep your existing interfaces)

// Components (keep your existing component definitions except MapComponent)
const RouteInfoCard: React.FC<RouteInfoCardProps> = ({
    icon,
    title,
    value,
}) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur">
        {icon}
        <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

interface LocationSearchProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (location: Location) => void;
    disabled?: boolean;
}


const LocationSearch: React.FC<LocationSearchProps> = ({
    placeholder,
    value,
    onChange,
    onSelect,
    disabled,
}) => {
    const [suggestions, setSuggestions] = useState<Location[]>([]);

    const fetchSuggestions = useCallback(
        debounce(async (searchText: string) => {
            if (searchText.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        searchText
                    )}&limit=5`
                );
                const data = await response.json() as {
                    display_name: string;
                    lat: string;
                    lon: string;
                }[];
                setSuggestions(
                    data.map((item) => ({
                        name: item.display_name,
                        lat: parseFloat(item.lat),
                        lon: parseFloat(item.lon),
                    }))
                );
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        fetchSuggestions(value);
    }, [value, fetchSuggestions]);

    return (
        <div className="relative">
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-white"
            />
            {suggestions.length > 0 && (
                <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg z-50 max-h-48 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onChange(suggestion.name);
                                onSelect(suggestion);
                                setSuggestions([]);
                            }}
                        >
                            {suggestion.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const EcoRoute: React.FC = () => {
    // Move all hooks to the top level
    const [isMounted, setIsMounted] = useState(false);
    const [originValue, setOriginValue] = useState<string>("");
    const [destinationValue, setDestinationValue] = useState<string>("");
    const [selectedMode, setSelectedMode] = useState<TransportMode>(
        TransportMode.CAR
    );
    const [originLocation, setOriginLocation] = useState<Location | null>(null);
    const [destinationLocation, setDestinationLocation] =
        useState<Location | null>(null);
    const [routes, setRoutes] = useState<Record<TransportMode, RouteData | null>>({
        [TransportMode.CAR]: null,
        [TransportMode.BIKE]: null,
        [TransportMode.WALK]: null,
    });
    const [markers, setMarkers] = useState<LatLngTuple[]>([]);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Effect to handle mounting
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Early return if not mounted
    if (!isMounted) {
        return null;
    }

    const calculateRoutes = async (): Promise<void> => {
        if (!originLocation || !destinationLocation) return;

        setIsLoading(true);
        setError(null);

        try {
            const routePromises = Object.values(TransportMode).map(async (mode) => {
                const osrmUrl = `https://router.project-osrm.org/route/v1/${mode}/${originLocation.lon},${originLocation.lat};${destinationLocation.lon},${destinationLocation.lat}?overview=full&geometries=geojson&steps=true`;
                const response = await fetch(osrmUrl);
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const coordinates: LatLngTuple[] = route.geometry.coordinates.map(
                        ([lon, lat]: [number, number]) => [lat, lon] as LatLngTuple
                    );

                    // Extract directions
                    const directions: DirectionStep[] = route.legs[0].steps.map(
                        (step: DirectionStep) => ({
                            instruction: step.instruction,
                            distance: step.distance,
                            duration: Math.round(step.duration / 60),
                            name: step.name || "", // Add name here
                        })
                    );

                    // Check if the bike route has bike lanes
                    const hasBikeLane =
                        mode === TransportMode.BIKE &&
                        coordinates.some((point) =>
                            BIKE_LANES.some((lane) =>
                                lane.path.some(
                                    (lanePoint) =>
                                        lanePoint.lat !== null &&
                                        Math.abs(lanePoint.lat - point[0]) < 0.001 &&
                                        lanePoint.lng !== null &&
                                        Math.abs(lanePoint.lng - point[1]) < 0.001
                                )
                            )
                        );

                    return {
                        mode,
                        routeData: {
                            coordinates,
                            mode,
                        },
                        routeInfo: {
                            distance: (route.distance / 1000).toFixed(2),
                            duration: Math.round(route.duration / 60),
                            durationInTraffic: Math.round((route.duration * 1.2) / 60),
                            directions,
                            hasBikeLane,
                        },
                    };
                }
                return null;
            });

            const results = await Promise.all(routePromises);
            const newRoutes: Record<TransportMode, RouteData | null> = {
                [TransportMode.CAR]: null,
                [TransportMode.BIKE]: null,
                [TransportMode.WALK]: null,
            };

            results.forEach((result) => {
                if (result) {
                    newRoutes[result.mode] = result.routeData;
                    if (result.mode === selectedMode) {
                        setRouteInfo(result.routeInfo);
                    }
                }
            });

            setRoutes(newRoutes);
            setMarkers([
                [originLocation.lat, originLocation.lon],
                [destinationLocation.lat, destinationLocation.lon],
            ]);
        } catch (err) {
            setError("Failed to calculate routes. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearRoute = (): void => {
        setOriginValue("");
        setDestinationValue("");
        setOriginLocation(null);
        setDestinationLocation(null);
        setRoutes({
            [TransportMode.CAR]: null,
            [TransportMode.BIKE]: null,
            [TransportMode.WALK]: null,
        });
        setMarkers([]);
        setRouteInfo(null);
        setError(null);
    };

    const getTransportIcon = (mode: TransportMode): React.ReactNode => {
        switch (mode) {
            case TransportMode.BIKE:
                return <Bike className="w-5 h-5" />;
            case TransportMode.WALK:
                return <PersonStanding className="w-5 h-5" />;
            default:
                return <Car className="w-5 h-5" />;
        }
    };

    const handleModeChange = (mode: TransportMode) => {
        setSelectedMode(mode);

        if (routes[mode]) {
            const route = routes[mode]!;

            // Calculate the distance
            const distance = (
                route.coordinates.reduce((acc, curr, idx, arr) => {
                    if (idx === 0) return 0;
                    const prev = arr[idx - 1];
                    return (
                        acc +
                        Math.sqrt(
                            Math.pow(curr[0] - prev[0], 2) + Math.pow(curr[1] - prev[1], 2)
                        )
                    );
                }, 0) * 111
            ) // Approximate conversion factor for lat/lon to kilometers
                .toFixed(2);

            // Check if the bike route has bike lanes
            const hasBikeLane =
                mode === TransportMode.BIKE &&
                route.coordinates.some((point) =>
                    BIKE_LANES.some((lane) =>
                        lane.path.some(
                            (lanePoint) =>
                                lanePoint.lat !== null &&
                                Math.abs(lanePoint.lat - point[0]) < 0.001 &&
                                lanePoint.lng !== null &&
                                Math.abs(lanePoint.lng - point[1]) < 0.001
                        )
                    )
                );

            setRouteInfo({
                distance,
                duration: Math.round(
                    (route.coordinates.length * (mode === TransportMode.CAR ? 1 : 2)) / 60
                ),
                durationInTraffic: Math.round(
                    (route.coordinates.length * (mode === TransportMode.CAR ? 1.2 : 2)) /
                    60
                ),
                directions: [],
                hasBikeLane,
            });
        }
    };

    return (
        <div className="h-screen w-full relative flex">
            <Card className="w-96 h-full rounded-none shadow-xl z-[1000] overflow-auto">
                <CardHeader>
                    <CardTitle>EcoRoute Planner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-2 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <LocationSearch
                            placeholder="Enter origin location"
                            value={originValue}
                            onChange={setOriginValue}
                            onSelect={setOriginLocation}
                            disabled={isLoading}
                        />

                        <LocationSearch
                            placeholder="Enter destination location"
                            value={destinationValue}
                            onChange={setDestinationValue}
                            onSelect={setDestinationLocation}
                            disabled={isLoading}
                        />

                        <div className="flex gap-2">
                            {Object.values(TransportMode).map((mode) => (
                                <Button
                                    key={mode}
                                    variant={selectedMode === mode ? "default" : "outline"}
                                    className={`p-2 flex-1 ${selectedMode === mode
                                        ? "bg-black hover:bg-gray-800"
                                        : "border-black text-black hover:bg-gray-100"
                                        }`}
                                    onClick={() => handleModeChange(mode)}
                                >
                                    {getTransportIcon(mode)}
                                </Button>
                            ))}
                        </div>

                        <Button
                            onClick={calculateRoutes}
                            disabled={!originLocation || !destinationLocation || isLoading}
                            className="w-full bg-black hover:bg-gray-800"
                        >
                            Calculate Route
                        </Button>

                        <Button
                            onClick={clearRoute}
                            disabled={isLoading}
                            className="w-full bg-gray-300 hover:bg-gray-400"
                        >
                            Clear Route
                        </Button>
                    </div>

                    {routeInfo && (
                        <div className="space-y-4 mt-4">
                            <RouteInfoCard
                                icon={getTransportIcon(selectedMode)}
                                title="Distance"
                                value={`${routeInfo.distance} km`}
                            />
                            <RouteInfoCard
                                icon={<Bus className="w-5 h-5" />}
                                title="Duration"
                                value={`${routeInfo.duration} mins`}
                            />
                            {selectedMode === TransportMode.CAR && (
                                <RouteInfoCard
                                    icon={<Car className="w-5 h-5" />}
                                    title="Estimated Delay"
                                    value={`${routeInfo.durationInTraffic} mins`}
                                />
                            )}
                        </div>
                    )}
                    {routeInfo?.directions && (
                        <div className="space-y-2 mt-6">
                            <h3 className="font-semibold">Directions:</h3>
                            <ul className="list-none list-inside">
                                {routeInfo.directions.map((step, index) => (
                                    <li key={index} className="mb-2">
                                        {step.instruction}
                                        {step.name || "unknown road"} - {step.distance.toFixed(0)}{" "}
                                        meters
                                    </li>
                                ))}
                            </ul>
                            {selectedMode === TransportMode.BIKE && routeInfo.hasBikeLane && (
                                <div className="p-2 mt-4 bg-green-100 text-green-700 rounded-md">
                                    🚴 This route includes bike lanes!
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <MapWithNoSSR
                routes={routes}
                activeMode={selectedMode}
                markers={markers}
                initialConfig={INITIAL_MAP_CONFIG}
            />
        </div>
    );
};

export default EcoRoute;
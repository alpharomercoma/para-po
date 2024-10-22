import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bus, Car, Leaf, MapPin, PlusCircle, Train } from "lucide-react";
import { MapProvider } from "./map/route-provider";
import { MapComponent } from "./map/map";

const Route = () => {
    return (
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto p-4 gap-4">
            <Card className="flex-1">
                <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold">Enter Route</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <Input placeholder="Barrio Pacita, Caloocan City" className="flex-1" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <Input placeholder="FEU Institute of Technology" className="flex-1" />
                    </div>
                    <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                        <MapProvider>
                            <MapComponent />
                        </MapProvider>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-1">
                <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold flex items-center justify-between">
                        Route Options
                        <span className="text-green-500 text-sm font-normal flex items-center">
                            <Leaf className="w-4 h-4 mr-1" />
                            720g carbon reduced
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <RouteOption
                        icon={<Train className="w-5 h-5" />}
                        route="25 mins via LRT-1"
                        color="bg-blue-500"
                    />
                    <RouteOption
                        icon={<Bus className="w-5 h-5" />}
                        route="40 mins via EDSA"
                        color="bg-pink-500"
                    />
                    <RouteOption
                        icon={<Car className="w-5 h-5" />}
                        route="45 mins via Andres Bonifacio Ave."
                        color="bg-yellow-500"
                    />
                    <Button variant="outline" className="w-full flex items-center justify-center">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add route
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

function RouteOption({ icon, route, color }: { icon: React.ReactNode; route: string; color: string; }) {
    return (
        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
            <div className={`p-2 rounded-full ${color} text-white`}>{icon}</div>
            <span className="flex-1">{route}</span>
        </div>
    );
}

export default Route;
import { useState, useEffect, useRef } from "react";
import { MapPin, Users, Gamepad2, List, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MapPin {
  id: string;
  type: "player" | "game";
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  distance: string;
  avatar?: string;
  isAvailable?: boolean;
}

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [showList, setShowList] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Mock map pins data
  const pins: MapPin[] = [
    {
      id: "p1",
      type: "player",
      lat: 37.7749,
      lng: -122.4194,
      title: "Alex Chen",
      subtitle: "12 games • 4.8⭐",
      distance: "2.1km",
      avatar: "A"
    },
    {
      id: "p2",
      type: "player", 
      lat: 37.7849,
      lng: -122.4094,
      title: "Sarah Wilson",
      subtitle: "8 games • 4.9⭐",
      distance: "3.4km",
      avatar: "S"
    },
    {
      id: "g1",
      type: "game",
      lat: 37.7649,
      lng: -122.4294,
      title: "Wingspan",
      subtitle: "Available at Alex's",
      distance: "2.1km",
      isAvailable: true
    },
    {
      id: "g2",
      type: "game",
      lat: 37.7549,
      lng: -122.4394,
      title: "Catan",
      subtitle: "Borrowed until Friday",
      distance: "1.8km",
      isAvailable: false
    }
  ];

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin);
  };

  return (
    <div className="relative h-[calc(100vh-8rem)]">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-accent-light/20 to-primary-light/20 rounded-lg relative overflow-hidden"
      >
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-muted to-background" />
          {/* Grid pattern to simulate map */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Loading State */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center space-y-2">
              <div className="animate-pulse w-8 h-8 bg-primary rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}

        {/* Map Pins */}
        {mapLoaded && pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${20 + (pins.indexOf(pin) * 20)}%`,
              top: `${30 + (pins.indexOf(pin) * 15)}%`
            }}
            onClick={() => handlePinClick(pin)}
          >
            {pin.type === "player" ? (
              <div className="map-pin w-12 h-12 bg-primary flex items-center justify-center text-white font-semibold">
                {pin.avatar}
              </div>
            ) : (
              <div className={cn(
                "map-pin w-10 h-10 flex items-center justify-center",
                pin.isAvailable ? "bg-accent" : "bg-muted-foreground"
              )}>
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
            )}
            
            {/* Distance label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {pin.distance}
              </Badge>
            </div>
          </div>
        ))}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button 
            size="sm" 
            variant="outline"
            className="glass-panel"
            onClick={() => setShowList(!showList)}
          >
            {showList ? <MapPin className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="glass-panel"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-lg">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded-full" />
              <span>Players</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <Gamepad2 className="h-2 w-2 text-white" />
              </div>
              <span>Available Games</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted-foreground rounded-full flex items-center justify-center">
                <Gamepad2 className="h-2 w-2 text-white" />
              </div>
              <span>Borrowed Games</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pin Detail Sheet */}
      {selectedPin && (
        <div className="absolute bottom-0 left-0 right-0 z-40 animate-slide-up">
          <Card className="glass-panel rounded-b-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {selectedPin.type === "player" ? (
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedPin.avatar}
                    </div>
                  ) : (
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      selectedPin.isAvailable ? "bg-accent" : "bg-muted-foreground"
                    )}>
                      <Gamepad2 className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold">{selectedPin.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPin.subtitle}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedPin.distance}
                      </Badge>
                      {selectedPin.type === "game" && (
                        <Badge 
                          variant={selectedPin.isAvailable ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {selectedPin.isAvailable ? "Available" : "Borrowed"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPin(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">
                  {selectedPin.type === "player" ? "View Profile" : "Request to Borrow"}
                </Button>
                <Button size="sm" variant="outline">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* List View Overlay */}
      {showList && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-30 animate-slide-up">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Nearby Players & Games</h2>
              <Button variant="ghost" onClick={() => setShowList(false)}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-3">
              {pins.map((pin) => (
                <Card key={pin.id} className="p-3 cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    {pin.type === "player" ? (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {pin.avatar}
                      </div>
                    ) : (
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        pin.isAvailable ? "bg-accent" : "bg-muted-foreground"
                      )}>
                        <Gamepad2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{pin.title}</h3>
                      <p className="text-xs text-muted-foreground">{pin.subtitle}</p>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {pin.distance}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
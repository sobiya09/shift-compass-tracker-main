
import { useEffect, useRef, useState } from "react";
import { useShift } from "@/context/shift-context";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentShift } = useShift();
  const mapInitializedRef = useRef(false);
  const [mapView, setMapView] = useState<'basic' | 'satellite'>('basic');

  useEffect(() => {
    if (!mapRef.current || !currentShift || mapInitializedRef.current) return;

    // Use a mock map implementation since we don't have an API key
    const renderMockMap = () => {
      if (!mapRef.current) return;

      const { startLocation } = currentShift;
      
      const bgColor = mapView === 'basic' 
        ? 'bg-muted/30 dark:bg-muted/20' 
        : 'bg-blue-50/30 dark:bg-blue-900/20';
      
      mapRef.current.innerHTML = `
        <div class="h-full w-full flex flex-col items-center justify-center p-4 ${bgColor} rounded-lg relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full p-2">
            <div class="text-xs font-medium bg-background/80 rounded px-2 py-1 inline-block">
              ${mapView === 'basic' ? 'Basic Map View' : 'Satellite View'}
            </div>
          </div>
          
          <div class="relative w-full h-full flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
            <div class="absolute w-3 h-3 bg-primary rounded-full"></div>
          </div>
          
          <div class="text-center mt-4 bg-background/80 p-2 rounded-md">
            <div class="font-medium">Current Location</div>
            <div class="text-sm text-muted-foreground">
              Lat: ${startLocation.latitude.toFixed(6)}<br/>
              Lng: ${startLocation.longitude.toFixed(6)}
            </div>
            <div class="text-xs mt-1 text-muted-foreground">
              Accuracy: ${startLocation.accuracy ? `±${Math.round(startLocation.accuracy)}m` : 'Unknown'}
            </div>
          </div>
        </div>
      `;

      mapInitializedRef.current = true;
    };

    renderMockMap();

    // Reset the flag when shift changes
    return () => {
      mapInitializedRef.current = false;
    };
  }, [currentShift, mapView]);

  const toggleMapView = () => {
    setMapView(prev => prev === 'basic' ? 'satellite' : 'basic');
    mapInitializedRef.current = false; // Force re-render
  };

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="w-full h-40 sm:h-60 rounded-lg border overflow-hidden relative"
      ></div>
      
      <div className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={toggleMapView}
        >
          <MapPin className="h-3 w-3" />
          {mapView === 'basic' ? 'Switch to Satellite' : 'Switch to Basic'}
        </Button>
      </div>
      
      <div className="text-xs text-center text-muted-foreground">
        For a production app, connect to Google Maps, Mapbox, or Leaflet
      </div>
    </div>
  );
}

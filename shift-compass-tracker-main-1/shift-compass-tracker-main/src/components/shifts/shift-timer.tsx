
import { useState, useEffect } from "react";
import { useShift } from "@/context/shift-context";

export function ShiftTimer() {
  const { currentShift, shiftStatus, getShiftDuration } = useShift();
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Update the timer every minute
  useEffect(() => {
    if (!currentShift) {
      setElapsedMinutes(0);
      return;
    }

    // Initial calculation
    const duration = getShiftDuration(currentShift);
    setElapsedMinutes(duration);

    // Set up interval for updates
    const intervalId = setInterval(() => {
      const updatedDuration = getShiftDuration(currentShift);
      setElapsedMinutes(updatedDuration);
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [currentShift, getShiftDuration, shiftStatus]);

  // Format minutes as hours and minutes
  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // If no shift is active, return null
  if (!currentShift) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="text-sm font-medium text-muted-foreground mb-1">Total Work Time</div>
      <div className="text-2xl font-bold">{formatTime(elapsedMinutes)}</div>
    </div>
  );
}

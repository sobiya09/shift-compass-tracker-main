
import { useShift } from "@/context/shift-context";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function ShiftStatus() {
  const { currentShift, shiftStatus } = useShift();

  // Helper function to format datetime
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status details
  const getStatusDetails = () => {
    if (!currentShift) {
      return {
        label: "Not Working",
        className: "bg-status-offline",
        time: "",
        description: "Start a shift to begin tracking your work time",
      };
    }

    if (shiftStatus === "working") {
      return {
        label: "Working",
        className: "bg-status-working",
        time: formatTime(currentShift.startTime),
        description: `Started at ${formatTime(currentShift.startTime)}`,
      };
    }

    if (shiftStatus === "break") {
      const activeBreak = currentShift.breaks.find(b => !b.endTime);
      const breakType = activeBreak?.type === "lunch" ? "Lunch Break" : "Short Break";
      return {
        label: breakType,
        className: "bg-status-break",
        time: activeBreak ? formatTime(activeBreak.startTime) : "",
        description: `Break started at ${activeBreak ? formatTime(activeBreak.startTime) : ""}`,
      };
    }

    return {
      label: "Unknown Status",
      className: "bg-status-offline",
      time: "",
      description: "Status information unavailable",
    };
  };

  const { label, className, time, description } = getStatusDetails();

  // Calculate time elapsed since shift or break started
  const getElapsedTime = () => {
    if (!currentShift) return "";

    let targetTime;
    if (shiftStatus === "break") {
      const activeBreak = currentShift.breaks.find(b => !b.endTime);
      targetTime = activeBreak ? new Date(activeBreak.startTime) : null;
    } else if (shiftStatus === "working") {
      // If we just came back from a break, use the last break end time
      const lastBreak = currentShift.breaks.length > 0
        ? currentShift.breaks[currentShift.breaks.length - 1]
        : null;
      
      targetTime = lastBreak?.endTime
        ? new Date(lastBreak.endTime)
        : new Date(currentShift.startTime);
    }

    if (!targetTime) return "";

    try {
      return formatDistanceToNow(targetTime, { addSuffix: false });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const elapsedTime = getElapsedTime();

  return (
    <div className="flex items-center">
      <span className={cn("status-indicator", className)}></span>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        
        {elapsedTime && (
          <div className="mt-1 text-xs font-medium">
            {shiftStatus === "working" ? (
              <span className="text-status-working">Working for {elapsedTime}</span>
            ) : shiftStatus === "break" ? (
              <span className="text-status-break">On break for {elapsedTime}</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

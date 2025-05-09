
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useShift } from "@/context/shift-context";
import { Play, Pause, StopCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";

export function ShiftControls() {
  const { 
    currentShift, 
    shiftStatus, 
    startShift, 
    endShift, 
    startBreak, 
    endBreak,
    isLoading,
    locationError
  } = useShift();
  
  const [breakType, setBreakType] = useState<"lunch" | "short">("short");

  const handleStartShift = async () => {
    try {
      await startShift();
    } catch (error) {
      // Error is handled in context
    }
  };

  const handleEndShift = async () => {
    try {
      await endShift();
    } catch (error) {
      // Error is handled in context
    }
  };

  const handleStartBreak = async () => {
    try {
      await startBreak(breakType);
    } catch (error) {
      // Error is handled in context
    }
  };

  const handleEndBreak = async () => {
    if (!currentShift) return;
    
    // Find the active break (without an end time)
    const activeBreak = currentShift.breaks.find(b => !b.endTime);
    
    if (!activeBreak) {
      toast.error("No active break found");
      return;
    }
    
    try {
      await endBreak(activeBreak.id);
    } catch (error) {
      // Error is handled in context
    }
  };

  if (locationError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="font-semibold text-red-800 dark:text-red-400">Location Error</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{locationError}</p>
        <Button 
          variant="destructive" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  if (shiftStatus === "idle") {
    return (
      <div className="flex flex-col">
        <Button
          className="flex items-center gap-2"
          onClick={handleStartShift}
          disabled={isLoading}
        >
          <Play className="h-4 w-4" />
          <span>{isLoading ? "Starting Shift..." : "Start Shift"}</span>
        </Button>
      </div>
    );
  }

  if (shiftStatus === "working") {
    return (
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="flex space-x-2">
            <Select
              value={breakType}
              onValueChange={(value) => setBreakType(value as "lunch" | "short")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Break Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunch">Lunch Break</SelectItem>
                <SelectItem value="short">Short Break</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={handleStartBreak}
              disabled={isLoading}
            >
              <Pause className="h-4 w-4" />
              <span>Take Break</span>
            </Button>
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <StopCircle className="h-4 w-4" />
              <span>End Shift</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Your Shift?</AlertDialogTitle>
              <AlertDialogDescription>
                This will end your current shift and record the total time worked. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEndShift}>
                Yes, End Shift
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (shiftStatus === "break") {
    return (
      <div className="flex flex-col">
        <Button
          className="flex items-center gap-2"
          onClick={handleEndBreak}
          disabled={isLoading}
        >
          <Play className="h-4 w-4" />
          <span>End Break & Resume Work</span>
        </Button>
      </div>
    );
  }

  return null;
}

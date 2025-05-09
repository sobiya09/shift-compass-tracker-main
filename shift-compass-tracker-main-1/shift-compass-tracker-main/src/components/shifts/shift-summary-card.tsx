
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shift } from "@/context/shift-context";

type ShiftSummaryCardProps = {
  shift: Shift;
};

export function ShiftSummaryCard({ shift }: ShiftSummaryCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Format duration
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="w-full card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {formatDate(shift.date || shift.startTime)} {/* Fallback to startTime if date is not available */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-muted-foreground">Start Time</div>
              <div>{formatTime(shift.startTime)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">End Time</div>
              <div>{formatTime(shift.endTime)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-muted-foreground">Work Time</div>
              <div className="font-medium">{formatDuration(shift.totalWorkTime)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Break Time</div>
              <div>{formatDuration(shift.totalBreakTime)}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Number of Breaks</div>
            <div>{shift.breaks.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import { useShift } from "@/context/shift-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShiftStatistics() {
  const { getShiftStatistics } = useShift();
  const stats = getShiftStatistics();
  
  // Helper function to format minutes as hours and minutes
  const formatMinutes = (totalMinutes: number) => {
    if (totalMinutes === 0) return "0h 0m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Shift Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-xl font-semibold">{formatMinutes(stats.dailyTotal)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">This Week</div>
            <div className="text-xl font-semibold">{formatMinutes(stats.weeklyTotal)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">This Month</div>
            <div className="text-xl font-semibold">{formatMinutes(stats.monthlyTotal)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Average Shift</div>
            <div className="text-xl font-semibold">{formatMinutes(stats.averageShiftLength)}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">Total Shifts Completed</div>
          <div className="text-xl font-semibold">{stats.totalShifts}</div>
        </div>
      </CardContent>
    </Card>
  );
}

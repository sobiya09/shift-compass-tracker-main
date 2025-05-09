
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useShift } from "@/context/shift-context";
import { AppLayout } from "@/components/layout/app-layout";
import { ShiftSummaryCard } from "@/components/shifts/shift-summary-card";
import { RequireAuth } from "@/components/auth/require-auth";

const ShiftsPage = () => {
  const { user } = useAuth();
  const { allShifts } = useShift();
  
  // Sort shifts by start time (newest first)
  const sortedShifts = [...allShifts].sort((a, b) => {
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();
    return dateB - dateA;
  });
  
  // Ensure the page title is set
  useEffect(() => {
    document.title = "My Shifts - ShiftCompass";
  }, []);
  if (user?.role === "employee") {
  return (
    <RequireAuth>
      <AppLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Shifts</h1>
          
          {sortedShifts.length === 0 ? (
            <div className="bg-muted/30 rounded-lg p-10 text-center">
              <h2 className="text-xl font-medium mb-2">No shifts yet</h2>
              <p className="text-muted-foreground">
                Your completed shifts will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedShifts.map((shift) => (
                <ShiftSummaryCard key={shift.id} shift={shift} />
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </RequireAuth>
  );
  }
};

export default ShiftsPage;

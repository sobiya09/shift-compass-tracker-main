import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { RequireAuth } from "@/components/auth/require-auth";
import { useShift, Shift } from "@/context/shift-context";
import api from "@/utils/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type EmployeeWithShifts = {
  _id: string;
  name: string;
  email: string;
  shifts: Shift[];
};

const formatTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

const formatDuration = (mins?: number) => {
  if (!mins) return "N/A";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const AdminEmployeesPage = () => {
  const { exportShifts } = useShift();

  const [employees, setEmployees] = useState<EmployeeWithShifts[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = "Employees - Admin - ShiftCompass";

    (async () => {
      try {
        const { data } = await api.get<EmployeeWithShifts[]>(
          "/admin/employees"
        );
        setEmployees(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees");
      }
    })();
  }, []);

  const filtered = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp._id.toLowerCase().includes(term)
    );
  });

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          {}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">Employees</h1>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportShifts("csv")}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportShifts("json")}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </div>

          {}
          <div className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Name, email, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  <div className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{filtered.length} employees</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {}
          {filtered.length === 0 ? (
            <div className="bg-muted/30 rounded-lg p-10 text-center">
              <h2 className="text-xl font-medium mb-2">No employees found</h2>
              <p className="text-muted-foreground">
                Nothing matches your search criteria
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((emp) => (
                <Card key={emp._id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between text-lg">
                      <span>{emp.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ID: {emp._id}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {emp.shifts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No shifts yet
                      </p>
                    ) : (
                      <div className="rounded-md border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-2 text-left">Date</th>
                              <th className="p-2 text-left">Start</th>
                              <th className="p-2 text-left">End</th>
                              <th className="p-2 text-left">Total Work Time</th>
                              <th className="p-2 text-left">Break</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emp.shifts.map((s) => (
                              <tr key={s.id} className="border-b last:border-0">
                                <td className="p-2">
                                  {formatDate(s.startTime)}
                                </td>
                                <td className="p-2">
                                  {formatTime(s.startTime)}
                                </td>
                                <td className="p-2">{formatTime(s.endTime)}</td>
                                <td className="p-2">
                                  {formatDuration(s.totalWorkTime)}
                                </td>
                                <td className="p-2">
                                  {formatDuration(s.totalBreakTime)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </RequireAuth>
  );
};

export default AdminEmployeesPage;

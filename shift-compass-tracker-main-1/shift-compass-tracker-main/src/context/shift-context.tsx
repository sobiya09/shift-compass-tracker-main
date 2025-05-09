import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./auth-context";
import api from "@/utils/api"; 

export type LocationPoint = {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
};

export type BreakPeriod = {
  id: string;
  type: "lunch" | "short";
  startTime: string;
  endTime?: string;
  location?: LocationPoint;
};

export type ShiftStatus = "idle" | "working" | "break";

export type Shift = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime?: string;
  startLocation: LocationPoint;
  endLocation?: LocationPoint;
  breaks: BreakPeriod[];
  status: ShiftStatus;
  totalWorkTime?: number;
  totalBreakTime?: number;
};

export type ShiftStatistics = {
  dailyTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  totalShifts: number;
  averageShiftLength: number;
};

type ShiftContextType = {
  currentShift: Shift | null;
  allShifts: Shift[];
  shiftStatus: ShiftStatus;
  startShift: () => Promise<void>;
  endShift: () => Promise<void>;
  startBreak: (type: "lunch" | "short") => Promise<void>;
  endBreak: (breakId: string) => Promise<void>;
  getShiftDuration: (shift: Shift) => number;
  getShiftStatistics: () => ShiftStatistics;
  isLoading: boolean;
  locationError: string | null;
  exportShifts: (format: "csv" | "json") => void;
};

const API_URL = "/shifts";

const generateId = (): string => Math.random().toString(36).substr(2, 9);

const getCurrentLocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    }
  });

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const storageKey = user ? `currentShift_${user.id}` : 'currentShift';
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAllShifts([]);
      setCurrentShift(null);
      return;
    }

    (async () => {
      try {
        const url =
          user.role === "admin" ? API_URL : `${API_URL}/employee/${user.id}`;

        const { data } = await api.get<Shift[]>(url);
        setAllShifts(data);
      } catch (err) {
        console.error(err);
        // toast.error("Failed to fetch shifts");
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const storageKey = `currentShift_${user.id}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed: Shift = JSON.parse(stored);
        setCurrentShift(parsed);
        setShiftStatus(parsed.status);
        return;                                  // ← done
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    setShiftStatus('idle');
    setCurrentShift(null);
  }, [user]);

  useEffect(() => {
    if (user && currentShift) {
      localStorage.setItem(storageKey, JSON.stringify(currentShift));
    }
  }, [currentShift, user]);

  const startShift = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const pos = await getCurrentLocation();
      const loc: LocationPoint = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString(),
        accuracy: pos.coords.accuracy,
      };

      const newShift: Shift = {
        id: generateId(),
        employeeId: user.id,
        employeeName: user.name || user.email.split("@")[0],
        date: new Date().toISOString().split("T")[0],
        startTime: new Date().toISOString(),
        startLocation: loc,
        breaks: [],
        status: "working",
      };

      setCurrentShift(newShift);
      setShiftStatus("working");
      toast.success("Shift started");
    } catch {
      setLocationError("Enable location services and try again.");
      toast.error("Location access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  const endShift = async () => {
    if (!currentShift || !user) return;
    setIsLoading(true);
    try {
      const pos = await getCurrentLocation();
      const endLoc: LocationPoint = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString(),
        accuracy: pos.coords.accuracy,
      };

      const endTime = new Date().toISOString();

      const breaks = currentShift.breaks.map((b) =>
        !b.endTime ? { ...b, endTime } : b
      );

      let breakMs = 0;
      breaks.forEach((b) => {
        if (b.startTime && b.endTime) {
          breakMs +=
            new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
        }
      });
      const totalMs =
        new Date(endTime).getTime() -
        new Date(currentShift.startTime).getTime();
      const workMs = totalMs - breakMs;

      const completedShift: Shift = {
        ...currentShift,
        endTime,
        endLocation: endLoc,
        status: "idle",
        breaks,
        totalBreakTime: Math.round(breakMs / 60000),
        totalWorkTime: Math.round(workMs / 60000),
      };

      await api.post(API_URL, completedShift);

      setAllShifts((prev) => [...prev, completedShift]);
      setCurrentShift(null);
      setShiftStatus("idle");
      localStorage.removeItem(`currentShift_${user.id}`);
      toast.success("Shift ended and saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to end shift");
    } finally {
      setIsLoading(false);
    }
  };

  const startBreak = async (type: "lunch" | "short") => {
    if (!currentShift) return;
    setIsLoading(true);
    try {
      const pos = await getCurrentLocation();
      const newBreak: BreakPeriod = {
        id: generateId(),
        type,
        startTime: new Date().toISOString(),
        location: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: pos.coords.accuracy,
        },
      };

      setCurrentShift({
        ...currentShift,
        breaks: [...currentShift.breaks, newBreak],
        status: "break",
      });
      setShiftStatus("break");
      toast.success(`${type} break started`);
    } catch {
      toast.error("Location required to start break");
    } finally {
      setIsLoading(false);
    }
  };

  const endBreak = async (breakId: string) => {
    if (!currentShift) return;
    setIsLoading(true);
    try {
      const updated = currentShift.breaks.map((b) =>
        b.id === breakId && !b.endTime
          ? { ...b, endTime: new Date().toISOString() }
          : b
      );
      setCurrentShift({ ...currentShift, breaks: updated, status: "working" });
      setShiftStatus("working");
      toast.success("Break ended");
    } catch {
      toast.error("Error ending break");
    } finally {
      setIsLoading(false);
    }
  };

  const getShiftDuration = (shift: Shift) => {
    const start = new Date(shift.startTime).getTime();
    const end = shift.endTime ? new Date(shift.endTime).getTime() : Date.now();
    const breakMs = shift.breaks.reduce((sum, b) => {
      if (b.startTime && b.endTime) {
        return (
          sum +
          (new Date(b.endTime).getTime() - new Date(b.startTime).getTime())
        );
      }
      return sum;
    }, 0);
    return Math.round((end - start - breakMs) / 60000);
  };

  const getShiftStatistics = (): ShiftStatistics => {
    const now = new Date();
    const dayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const weekAgo = dayStart - 7 * 86_400_000;
    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    ).getTime();

    let daily = 0,
      weekly = 0,
      monthly = 0,
      total = 0;

    allShifts.forEach((s) => {
      const t = new Date(s.startTime).getTime();
      const mins = s.totalWorkTime ?? getShiftDuration(s);
      total += mins;
      if (t >= dayStart) daily += mins;
      if (t >= weekAgo) weekly += mins;
      if (t >= monthAgo) monthly += mins;
    });

    return {
      dailyTotal: daily,
      weeklyTotal: weekly,
      monthlyTotal: monthly,
      totalShifts: allShifts.length,
      averageShiftLength:
        allShifts.length === 0 ? 0 : Math.round(total / allShifts.length),
    };
  };


const exportShifts = async (format: "csv" | "json") => {
  try {
    const response = await fetch(`/api/admin/export/${format}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Update this based on your auth system
      },
    });

    if (!response.ok) throw new Error("Failed to export data");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shifts-${new Date().toISOString().split("T")[0]}.${format}`;
    document.body.appendChild(link); // For Firefox
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  } catch (err) {
    console.error(err);
    toast.error("Export failed");
  }
};


  return (
    <ShiftContext.Provider
      value={{
        currentShift,
        allShifts,
        shiftStatus,
        startShift,
        endShift,
        startBreak,
        endBreak,
        getShiftDuration,
        getShiftStatistics,
        isLoading,
        locationError,
        exportShifts,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => {
  
  const ctx = useContext(ShiftContext);
  if (!ctx) throw new Error("useShift must be used within ShiftProvider");
  return ctx;
};
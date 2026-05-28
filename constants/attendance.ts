import { MaterialCommunityIcons } from "@expo/vector-icons";

export type AttendanceStatus = "Present" | "Late" | "Absent" | "Leave" | "Weekend";

export type AttendanceDay = {
  date: number;
  day: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workingHours?: string;
};

export const attendance = {
  department: "CelcomDigi Project",
  shiftStart: "9:00 AM",
  shiftEnd: "6:00 PM",
  currentStatus: "working",
};

export const attendanceStatuses: Record<
  string,
  {
    label: string;
    dotColor: string;
    cardColor: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    message?: string;
    showShift: boolean;
  }
> = {
  working: {
    label: "Working",
    dotColor: "#FACC15",
    cardColor: "#A16207",
    icon: "progress-clock",
    showShift: true,
  },

  absent: {
    label: "Absent",
    dotColor: "#F87171",
    cardColor: "#991B1B",
    icon: "close-circle",
    message: "You are marked absent today.",
    showShift: false,
  },

  annualLeave: {
    label: "Annual Leave",
    dotColor: "#60A5FA",
    cardColor: "#1D4ED8",
    icon: "beach",
    message: "Enjoy your well deserved break.",
    showShift: false,
  },

  sickLeave: {
    label: "Sick Leave",
    dotColor: "#C084FC",
    cardColor: "#7E22CE",
    icon: "medical-bag",
    message: "Get well soon and rest properly.",
    showShift: false,
  },

  publicHoliday: {
    label: "Public Holiday",
    dotColor: "#FB923C",
    cardColor: "#C2410C",
    icon: "calendar-star",
    message: "Enjoy your public holiday.",
    showShift: false,
  },
};

export const weeklyAttendanceData: AttendanceDay[] = [
  {
    date: 18,
    day: "Mon",
    status: "Present",
    checkIn: "8:55 AM",
    checkOut: "5:30 PM",
    workingHours: "8h 35m",
  },
  {
    date: 19,
    day: "Tue",
    status: "Late",
    checkIn: "9:12 AM",
    checkOut: "5:30 PM",
    workingHours: "8h 18m",
  },
  {
    date: 20,
    day: "Wed",
    status: "Present",
    checkIn: "8:47 AM",
    checkOut: "5:34 PM",
    workingHours: "8h 47m",
  },
  {
    date: 21,
    day: "Thu",
    status: "Absent",
  },
  {
    date: 22,
    day: "Fri",
    status: "Present",
    checkIn: "8:58 AM",
    checkOut: "5:28 PM",
    workingHours: "8h 30m",
  },
  {
    date: 23,
    day: "Sat",
    status: "Weekend",
  },
  {
    date: 24,
    day: "Sun",
    status: "Weekend",
  },
];

export const monthlyAttendanceData: AttendanceDay[] = Array.from({ length: 31 }).map(
  (_, index) => ({
    date: index + 1,
    day: "",
    status:
      index % 7 === 5 || index % 7 === 6
        ? "Weekend"
        : index % 5 === 0
          ? "Late"
          : "Present",
  }),
);

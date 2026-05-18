import React, { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { design } from "../../constants/design";

type AttendanceStatus = "Present" | "Late" | "Absent" | "Leave" | "Weekend";

type AttendanceDay = {
  date: number;
  day: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workingHours?: string;
};

const weeklyData: AttendanceDay[] = [
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

const monthlyData: AttendanceDay[] = Array.from({ length: 31 }).map(
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

export default function AttendanceOverview() {
  const theme = useTheme();

  const { spacing, radii, typography, sizes, elevation, opacity } = design;

  const [view, setView] = useState<"Weekly" | "Monthly">("Weekly");

  const data = useMemo(
    () => (view === "Weekly" ? weeklyData : monthlyData),
    [view],
  );

  const [selected, setSelected] = useState<AttendanceDay>(weeklyData[0]);

  useEffect(() => {
    setSelected(data[0]);
  }, [view]);

  const firstDayOffset = 4;

  const calendarData = [
    ...Array.from({ length: firstDayOffset }).map((_, index) => ({
      id: `empty-${index}`,
      empty: true,
    })),
    ...monthlyData.map((item) => ({
      ...item,
      empty: false,
    })),
  ];

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "#22C55E";
      case "Late":
        return "#F59E0B";
      case "Absent":
        return "#EF4444";
      case "Leave":
        return "#8B5CF6";
      case "Weekend":
        return theme.colors.outline;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Card
      style={{
        borderRadius: radii["2xl"],
        overflow: "hidden",
        elevation: elevation.level1,
      }}
    >
      <Card.Content
        style={{
          padding: spacing.lg,
          gap: spacing.lg,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              gap: spacing.xxs,
            }}
          >
            <Text
              style={{
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.semibold,
                opacity: typography.opacities.muted,
                letterSpacing: 0.8,
              }}
            >
              ATTENDANCE OVERVIEW
            </Text>

            <Text
              style={{
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.bold,
              }}
            >
              {view === "Weekly" ? "18/5 - 24/5" : "May 2026"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: radii.full,
              padding: spacing.xxs,
              gap: spacing.xxs,
            }}
          >
            {["Weekly", "Monthly"].map((item) => {
              const active = view === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setView(item as "Weekly" | "Monthly")}
                  style={{
                    minHeight: sizes.touch.minHeight,
                    paddingHorizontal: spacing.md,
                    borderRadius: radii.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: active
                      ? theme.colors.primary
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.sizes.sm,
                      fontWeight: typography.weights.semibold,
                      color: active
                        ? theme.colors.onPrimary
                        : theme.colors.onSurface,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={{
            borderRadius: radii.xl,
            padding: spacing.lg,
            backgroundColor: theme.colors.primary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.semibold,
                  color: theme.colors.onPrimary,
                  opacity: 0.7,
                  letterSpacing: 0.6,
                }}
              >
                TODAY STATUS
              </Text>

              <Text
                style={{
                  marginTop: spacing.sm,
                  fontSize: typography.sizes["2xl"],
                  fontWeight: typography.weights.bold,
                  color: theme.colors.onPrimary,
                }}
              >
                {selected.status}
              </Text>

              <Text
                style={{
                  marginTop: spacing.xxs,
                  fontSize: typography.sizes.sm,
                  color: theme.colors.onPrimary,
                  opacity: typography.opacities.muted,
                }}
              >
                {selected.day
                  ? `${selected.day}, ${selected.date} May`
                  : `${selected.date} May`}
              </Text>
            </View>

            <View
              style={{
                width: spacing["3xl"],
                height: spacing["3xl"],
                borderRadius: radii.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `rgba(255,255,255,${opacity.focus})`,
              }}
            >
              <MaterialCommunityIcons
                name={
                  selected.status === "Present"
                    ? "check-decagram"
                    : selected.status === "Late"
                      ? "clock-alert"
                      : selected.status === "Absent"
                        ? "close-octagon"
                        : selected.status === "Weekend"
                          ? "sofa"
                          : "calendar"
                }
                size={sizes.icon.lg}
                color={theme.colors.onPrimary}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginTop: spacing.lg,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: radii.lg,
                padding: spacing.md,
                backgroundColor: `rgba(255,255,255,${opacity.focus})`,
              }}
            >
              <Text
                style={{
                  fontSize: typography.sizes.xs,
                  color: theme.colors.onPrimary,
                  opacity: typography.opacities.muted,
                }}
              >
                Check In
              </Text>

              <Text
                style={{
                  marginTop: spacing.xxs,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                  color: theme.colors.onPrimary,
                }}
              >
                {selected.checkIn || "--"}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                borderRadius: radii.lg,
                padding: spacing.md,
                backgroundColor: `rgba(255,255,255,${opacity.focus})`,
              }}
            >
              <Text
                style={{
                  fontSize: typography.sizes.xs,
                  color: theme.colors.onPrimary,
                  opacity: typography.opacities.muted,
                }}
              >
                Working Hours
              </Text>

              <Text
                style={{
                  marginTop: spacing.xxs,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                  color: theme.colors.onPrimary,
                }}
              >
                {selected.workingHours || "--"}
              </Text>
            </View>
          </View>
        </View>

        {view === "Weekly" ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: spacing.xs,
            }}
          >
            {weeklyData.map((item) => {
              const active = selected.date === item.date;

              return (
                <Pressable
                  key={item.date}
                  onPress={() => setSelected(item)}
                  style={{
                    flex: 1,
                    minHeight: 88,
                    borderRadius: radii.xl,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: active
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.sizes.xs,
                      fontWeight: typography.weights.med,
                      opacity: active ? 0.9 : 0.5,
                      color: active
                        ? theme.colors.onPrimary
                        : theme.colors.onSurface,
                    }}
                  >
                    {item.day}
                  </Text>

                  <Text
                    style={{
                      marginTop: spacing.xs,
                      fontSize: typography.sizes.md,
                      fontWeight: typography.weights.bold,
                      color: active
                        ? theme.colors.onPrimary
                        : theme.colors.onSurface,
                    }}
                  >
                    {item.date}
                  </Text>

                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: radii.full,
                      marginTop: spacing.sm,
                      backgroundColor: active
                        ? theme.colors.onPrimary
                        : getStatusColor(item.status),
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <View
                  key={`${day}-${index}`}
                  style={{
                    width: `${100 / 7}%`,
                    alignItems: "center",
                    marginBottom: spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.sizes.xs,
                      fontWeight: typography.weights.med,
                      opacity: typography.opacities.muted,
                    }}
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {calendarData.map((item: any, index) => {
                if (item.empty) {
                  return (
                    <View
                      key={`empty-${index}`}
                      style={{
                        width: `${100 / 7}%`,
                        padding: spacing.xxs,
                      }}
                    >
                      <View
                        style={{
                          aspectRatio: 1,
                        }}
                      />
                    </View>
                  );
                }

                const active = selected.date === item.date;

                return (
                  <View
                    key={`date-${item.date}`}
                    style={{
                      width: `${100 / 7}%`,
                      padding: spacing.xxs,
                    }}
                  >
                    <Pressable
                      onPress={() => setSelected(item)}
                      style={{
                        aspectRatio: 1,
                        borderRadius: radii.lg,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: active
                          ? theme.colors.primary
                          : theme.colors.surfaceVariant,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.sizes.sm,
                          fontWeight: typography.weights.bold,
                          color: active
                            ? theme.colors.onPrimary
                            : theme.colors.onSurface,
                        }}
                      >
                        {item.date}
                      </Text>

                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: radii.full,
                          marginTop: spacing.xxs,
                          backgroundColor: active
                            ? theme.colors.onPrimary
                            : getStatusColor(item.status),
                        }}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

import {
    FlatList,
    View,
    Text,
    Pressable,
    StyleSheet
} from "react-native";

import {
    useState,
} from "react";

import { lightTheme } from "./Themes";
import { useFilters } from "@/context/FilterContext";

const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());


const getStartDayOfMonth = ({ year, month }: { year: number; month: number }) => {
    return {
        startDayOfMonth: new Date(year, month - 1, 1).getDay(), // 0=Sun
        daysInMonth: new Date(year, month, 0).getDate(),
    };
};

function* monthYearGenerator(startYear: number, startMonth: number, monthsAhead: number) {
    let year = startYear;
    let month = startMonth;

    for (let i = 0; i <= monthsAhead; i++) {
        yield { year, month };

        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
    }
}

const CreateCalendarArray = () => {
    const calendarArray = [];
    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const MONTHSAHEAD = 12;

    for (const { year, month } of monthYearGenerator(currentYear, currentMonth, MONTHSAHEAD)) {
        const { startDayOfMonth, daysInMonth } = getStartDayOfMonth({ year, month });
        const monthArray = new Array(35).fill(0);
        let counter = 1;

        for (let dayIndex = 0; dayIndex < 35; dayIndex++) {
            if (dayIndex >= startDayOfMonth && counter <= daysInMonth) {
                monthArray[dayIndex] = counter++;
            }
        }

        calendarArray.push({ year, month, days: monthArray });
    }

    return calendarArray;
};

export const DatePicker = () => {


    const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null)
    const setToday = () => {
        const date = new Date()
        const normalized = normalizeDate(date);

        const today = normalized
        setBeginDate(today)
        setEndDate(null)
        setSelectedDateRange("today")
        console.log(filters.beginDate, filters.endDate)
    }

    const setThisWeek = () => {
        const date = normalizeDate(new Date())
        const nextWeek = normalizeDate(new Date())
        nextWeek.setDate(date.getDate() + 7)
        setBeginDate(date)
        setSelectedDateRange("this week")
        setEndDate(nextWeek)
    }

    const setAllTime = () => {
        setSelectedDateRange("all time")
        setBeginDate(null)
        setEndDate(null)
    }


    const displayDateRange = () => {
        const { beginDate, endDate } = filters;
        if (!beginDate && !endDate) return "Add Date";
        const format = (date: Date) => date.toDateString();
        if (beginDate && endDate === null) return `${format(beginDate!)} ~`
        return endDate
            ? `${format(beginDate!)} ~ ${format(endDate)}`
            : format(beginDate!);
    };

    const { filters, setBeginDate, setEndDate } = useFilters()
    const [calendar] = useState(CreateCalendarArray());
    const { beginDate, endDate } = filters

    const dateOptionStyle = (option: string) => {


        if (selectedDateRange === option) {
            return [styles.dateOptionsSelected, styles.dateOptions]
        }
        return [styles.dateOptionsUnSelected, styles.dateOptions]
    }
    const handleDateChange = (date: Date) => {

        const normalized = normalizeDate(date);

        // Case 1: No dates selected yet
        if (!beginDate && !endDate) {
            setBeginDate(normalized);
            return;
        }

        // Case 2: Begin date selected, no end date yet
        if (beginDate && !endDate) {
            if (date > beginDate) {
                // valid range forward
                setEndDate(normalized);
            } else {
                // clicked before begin — reset start
                setBeginDate(normalized);
            }
            return;
        }

        // Case 3: Both selected → start a new selection
        if (beginDate && endDate) {
            setBeginDate(normalized);
            setEndDate(null);
            return;
        }
    };

    return (
        <>
            <FlatList
                data={calendar}
                keyExtractor={(item) => `${item.year}-${item.month}`}
                renderItem={({ item }) => <Month
                    {...item}
                    handleDateChange={handleDateChange}
                />}
                extraData={[filters.beginDate, filters.endDate]}
            />
            <View className="flex-row justify-between">
                <Pressable className=""
                    style={dateOptionStyle("today")}
                    onPress={setToday}>
                    <Text className="font-bold">Today</Text>
                </Pressable>
                <Pressable className=""
                    style={dateOptionStyle("this week")}
                    onPress={setThisWeek}>
                    <Text className="font-bold">This Week</Text>
                </Pressable>
                <Pressable className=""
                    style={dateOptionStyle("all time")}
                    onPress={setAllTime}>
                    <Text className="font-bold">All Time</Text>
                </Pressable>
            </View>
        </>
    );
};

interface MonthProps {
    year: number;
    month: number;
    days: number[];
    handleDateChange: (date: Date) => void
}

const Month = ({ year, month, days, handleDateChange }: MonthProps) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const { filters } = useFilters()
    const { beginDate, endDate } = filters

    const getStatus = (day: number) => {
        if (day === 0 || !beginDate) return "none";
        const date = new Date(year, month - 1, day);

        if (+beginDate === +date && !endDate) return "single";
        if (+beginDate === +date && endDate) return "start"
        if (endDate && +endDate === +date) return "end";
        if (endDate && date > beginDate && date < endDate) return "between";

        return "none"
    }


    return (
        <View style={styles.monthContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {monthNames[month - 1]} {year}
            </Text>
            <View className="w-full">
                <FlatList
                    data={days}
                    numColumns={7}
                    renderItem={({ item }) => (
                        <Day
                            day={item}
                            month={month}
                            year={year}
                            status={getStatus(item)}
                            handleDateChange={handleDateChange}
                        />
                    )}
                    keyExtractor={(key, index) => index.toString()}
                />
            </View>
        </View>
    );
};


const Day = ({
    day,
    month,
    year,
    handleDateChange,
    status
}: {
    day: number;
    month: number;
    year: number;
    handleDateChange: (date: Date) => void
    status: "none" | "start" | "end" | "between" | "single"
}) => {


    const date = new Date(year, month - 1, day)
    const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const isSelected = (status === "start" || status === "end") || status === "single";

    const dateStyle = () => {
        switch (status) {
            case "single":
                console.log(status)
                return styles.dateSelected
            case "start":
                return styles.dateSelected;
            case "end":
                return styles.dateSelected;
            default:
                return styles.dayUnselected;
        }
    }

    const betweenStyle = () => {
        switch (status) {
            case "start":
                return styles.betweenBegin
            case "end":
                return styles.betweenEnd
            case "none":
                return styles.betweenDates
        }
    }


    return (
        <View style={[{ flex: 1, alignItems: "center", position: "relative" },
        day === 0 ? { opacity: 0 } : { opacity: 100 },
        status === "between" ? { backgroundColor: lightTheme.bgDark } : { backgroundColor: "transparent" }]}>
            <Pressable
                style={[styles.day, dateStyle()]}
                onPress={() => {
                    handleDateChange(date)
                }}>
                <Text style={[
                    { color: isSelected ? lightTheme.bgLight : lightTheme.text },
                    +normalizeDate(date) < +normalizeDate(new Date()) ? styles.beforeToday : styles.afterToday
                ]}>{day}</Text>
            </Pressable>
            <View style={betweenStyle()}>

            </View>
        </View>

    );
};



const styles = StyleSheet.create({
    monthContainer: {
        marginBottom: 20,
        width: "100%",
    },

    day: {
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        aspectRatio: 1,
        marginTop: 2,
        marginBottom: 2,
        zIndex: 300
    },
    dayUnselected: {
        borderRadius: 100,
    },
    dateSelected: {
        color: lightTheme.bgLight,
        backgroundColor: lightTheme.text,
        borderRadius: 100,
    },
    betweenDates: {
        backgroundColor: lightTheme.bgDark,
    },

    betweenBegin: {
        backgroundColor: lightTheme.bgDark,
        width: "50%",
        height: "100%",
        borderRadius: 0,
        right: 0,
        position: "absolute"
    },
    betweenEnd: {
        backgroundColor: lightTheme.bgDark,
        width: "50%",
        height: "100%",
        left: 0,
        position: "absolute"

    },
    dateOptions: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: lightTheme.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4, // Android only
        borderRadius: 10,
        backgroundColor: lightTheme.bgDark,
        borderWidth: 3,
        borderColor: lightTheme.bgDark,
        borderTopColor: lightTheme.bg,
    },
    dateOptionsSelected: {
        backgroundColor: lightTheme.bgDark
    },
    dateOptionsUnSelected: {

    },
    beforeToday: {
        textDecorationLine: "line-through"
    },
    afterToday: {
        textDecorationLine: "none"
    }
})
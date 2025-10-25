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


    const { filters, setBeginDate, setEndDate } = useFilters()
    const [calendar] = useState(CreateCalendarArray());
    const { beginDate, endDate } = filters

    const handleDateChange = (date: Date) => {
        // Case 1: No dates selected yet
        if (!beginDate && !endDate) {
            setBeginDate(date);
            return;
        }

        // Case 2: Begin date selected, no end date yet
        if (beginDate && !endDate) {
            if (date > beginDate) {
                // valid range forward
                setEndDate(date);
            } else {
                // clicked before begin — reset start
                setBeginDate(date);
            }
            return;
        }

        // Case 3: Both selected → start a new selection
        if (beginDate && endDate) {
            setBeginDate(date);
            setEndDate(null);
            return;
        }
    };

    return (
        <FlatList
            data={calendar}
            keyExtractor={(item) => `${item.year}-${item.month}`}
            renderItem={({ item }) => <Month
                {...item}
                handleDateChange={handleDateChange}
                beginDate={beginDate}
                endDate={endDate}
            />}
        />
    );
};

interface MonthProps {
    year: number;
    month: number;
    days: number[];
    handleDateChange: (date: Date) => void
    beginDate: Date | null
    endDate: Date | null
}

const Month = ({ year, month, days, handleDateChange, beginDate, endDate }: MonthProps) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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
                            beginDate={beginDate}
                            endDate={endDate}
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
    beginDate,
    endDate,
    handleDateChange
}: {
    day: number;
    month: number;
    year: number;
    beginDate: Date | null
    endDate: Date | null
    handleDateChange: (date: Date) => void
}) => {
    const date = new Date(year, month - 1, day)
    const isSelected = (beginDate && +beginDate === +date || endDate && +endDate === +date);
    const dateStyle = () => {
        // If beginDate and endDate both don't exist, return default styling
        // if date is neither endDate or beginDate nor in between them, show default styling
        // If date is beginDate, show beginDate styling
        // if date is endDate, show endDate stying
        // If date is inbetweeen beginDate and endDate, show inbetween styling

        if (beginDate === null && endDate === null) {
            return styles.dayUnselected
        } else if (beginDate && +beginDate === +date || endDate && +endDate === +date) {
            return styles.dateSelected
        } else if (beginDate && endDate && beginDate < date && endDate > date) {
            return styles.betweenDates
        } else {
            return styles.dayUnselected
        }
    }
    const betweenStyle = () => {
        if (beginDate === null || endDate === null) {
            return {}
        }
        if (+beginDate === +date) {
            return styles.betweenBegin
        } else if (+endDate === +date) {
            return styles.betweenEnd
        }
        return {}
    }


    return (
        <View style={[{ flex: 1, alignItems: "center", position: "relative" },
        day === 0 ? { opacity: 0 } : { opacity: 100 },
        beginDate && endDate && beginDate < date && endDate > date ? { backgroundColor: lightTheme.bgDark } : { backgroundColor: "transparent" }]}>
            <Pressable
                style={[styles.day, dateStyle()]}
                onPress={() => {
                    handleDateChange(date)
                }}>
                <Text style={{ color: isSelected ? lightTheme.bgLight : lightTheme.text }}>{day}</Text>
            </Pressable>
            <View style={[betweenStyle(), {}]}>

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
        height: 34,
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

    }
})
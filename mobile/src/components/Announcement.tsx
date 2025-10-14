import {
    View,
    Text,
    StyleSheet
} from "react-native"

import { useState, useEffect } from "react"
import { lightTheme } from "./Themes"

interface AnnouncementProps {
    message: string
    type: "danger" | "warning" | "success" | "info"
}

export const Announcement = ({ message, type }: AnnouncementProps) => {


    useEffect(() => {
        console.log(type)
    }, [type]) // 

    return (
        <View className="absolute inset-0 justify-center items-center" pointerEvents="none">
            <View className={"px-6 py-3 rounded-2xl flex-col justify-center"}
                style={[
                    styles.announcement,
                    { backgroundColor: `${lightTheme[type]}` }
                ]}>
                <Text className="text-text text-lg font-bold text-center">{message}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    announcement: {
        minWidth: 200,
        minHeight: 100,
        shadowColor: lightTheme.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4, // Android only
        borderRadius: 24,
        borderTopWidth: 3,
        borderColor: lightTheme.bgLight,
        borderTopColor: lightTheme.highlight

    }
})
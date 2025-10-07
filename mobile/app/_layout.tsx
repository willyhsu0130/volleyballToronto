import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Volleyball, Home } from 'lucide-react-native';
import React from 'react';
import '../global.css';

export default function RootLayout() {

    return (
        <React.Fragment>
            <StatusBar style="auto" />
            <Tabs screenOptions={{ tabBarActiveTintColor: "teal" }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: () => (
                            <Volleyball />
                        )
                    }} />
                <Tabs.Screen
                    name="DropIns"
                    options={{
                        title: "Drop Ins",
                        tabBarIcon: () => (
                            <Home />
                        )
                    }}

                />
                <Tabs.Screen name="Locations" />
            </Tabs>
        </React.Fragment>
    )
}



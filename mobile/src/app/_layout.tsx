import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Volleyball, Home } from 'lucide-react-native'
import { FilterProvider } from '@/context/FilterContext'
import { DropInsProvider } from '@/context/DropInsContext'
import React from 'react'
import '@/global.css'

export default function RootLayout() {

    return (

        <FilterProvider>
            <DropInsProvider>
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
                        <Tabs.Screen name="Locations"
                            options={{
                                href: null,
                            }} />
                        <Tabs.Screen name="locations/[communityCenterId]"
                            options={{
                                href: null,
                            }} />
                    </Tabs>
                </React.Fragment>
            </DropInsProvider>
        </FilterProvider>
    )
}



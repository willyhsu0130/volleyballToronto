import React from "react";
import { View, Pressable, BlurEvent } from "react-native";
import { BlurView } from 'expo-blur';
import { SafeAreaView } from "react-native-safe-area-context";

interface ModalProps {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
    content?: React.ReactNode
    color?: string
}

export const Modal = ({ modalVisible, setModalVisible, children, content, color }: ModalProps) => {
    // If modal is not visible, don't render anything
    if (!modalVisible) return children;

    return (
        <View
            className={`absolute top-0 left-0 w-screen h-screen items-center justify-center`}
        >
            {/* Pressable overlay that closes modal on tap outside */}
            <View className={`bg-slate-500/90 absolute top-0 left-0 w-screen z-50 h-screen color-${color}`}>
                {content}
            </View>
            {/* Modal content area */}
            <View className="w-full h-full">
                <BlurView intensity={100} className="bg-white w-full h-full shadow-lg">
                    {children}
                </BlurView>
            </View>
        </View>
    );
};
import { createContext, useContext, useState, ReactNode} from "react";

interface ModalContextType {
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;

}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <ModalContext.Provider value={{
           modalVisible,
           setModalVisible
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalContextProvider");
    }
    return context;
};

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface BagsModalProps {
    visible: boolean;
    onClose: () => void;
    qtdClasseA: number;
    setQtdClasseA: (val: number) => void;
    qtdClasseB: number;
    setQtdClasseB: (val: number) => void;
    qtdClasseCD: number;
    setQtdClasseCD: (val: number) => void;
    podeSolicitar: boolean;
    onSubmit: () => void;
}

export default function BagsModal({
    visible,
    onClose,
    qtdClasseA,
    setQtdClasseA,
    qtdClasseB,
    setQtdClasseB,
    qtdClasseCD,
    setQtdClasseCD,
    podeSolicitar,
    onSubmit,
}: BagsModalProps) {
    const renderCounter = (label: string, value: number, setter: (val: number) => void) => (
        <View className="flex-row justify-between items-center bg-gray-50 p-4 mb-3 rounded-xl border border-gray-200">
            <Text className="font-semibold text-black text-base flex-1">{label}</Text>
            <View className="flex-row items-center gap-5">
                <TouchableOpacity
                    onPress={() => setter(Math.max(0, value - 1))}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-300 shadow-sm"
                    activeOpacity={0.8}
                >
                    <Text className="font-bold text-xl text-gray-600">-</Text>
                </TouchableOpacity>
                <Text className="font-bold text-xl w-6 text-center">{value}</Text>
                <TouchableOpacity
                    onPress={() => setter(value + 1)}
                    className="w-10 h-10 bg-[#297C2A] rounded-full items-center justify-center shadow-sm"
                    activeOpacity={0.8}
                >
                    <Text className="font-bold text-white text-xl">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-lg">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-black">Quantidade de Sacos</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-gray-600 font-bold">X</Text>
                        </TouchableOpacity>
                    </View>

                    {renderCounter('Classe A', qtdClasseA, setQtdClasseA)}
                    {renderCounter('Classe B', qtdClasseB, setQtdClasseB)}
                    {renderCounter('Classe C/D', qtdClasseCD, setQtdClasseCD)}

                    <TouchableOpacity
                        className={`w-full rounded-xl py-4 mt-6 items-center shadow-sm ${podeSolicitar ? 'bg-[#297C2A]' : 'bg-gray-400'}`}
                        disabled={!podeSolicitar}
                        activeOpacity={0.8}
                        onPress={onSubmit}
                    >
                        <Text className="text-white font-bold text-lg">SOLICITAR COLETA</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
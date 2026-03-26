import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSession, signOut } from '../../services/auth.service';
import Loader from '../../components/common/loader';

// Importando os ícones
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function ClienteHomeScreen() {
  const [userName, setUserName] = useState('Cliente');

  // Estados de Localização
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [enderecoManual, setEnderecoManual] = useState('');

  // Estados dos Pedidos
  const [qtdClasseA, setQtdClasseA] = useState(0);
  const [qtdClasseB, setQtdClasseB] = useState(0);
  const [qtdClasseCD, setQtdClasseCD] = useState(0);

  // Estados de Visibilidade dos Modais
  const [modalEnderecoVisible, setModalEnderecoVisible] = useState(false);
  const [modalSacosVisible, setModalSacosVisible] = useState(false);
  const [modalPagamentoVisible, setModalPagamentoVisible] = useState(false);

  // Estados de Pagamento
  const [metodoPagamento, setMetodoPagamento] = useState<'PIX' | 'CARTAO' | 'ENTREGA'>('PIX');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.nome) setUserName(session.user.nome);
    });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setEnderecoManual('Rua Atual do Usuário, 123 - Londrina, PR');
    })();
  }, []);

  const totalSacos = qtdClasseA + qtdClasseB + qtdClasseCD;
  const podeSolicitar = totalSacos > 0 && enderecoManual.trim().length > 0;

  const handleLogout = async () => {
    await signOut();
  };

  const abrirModalDeSacos = () => {
    if (enderecoManual.trim().length === 0) {
      alert("Por favor, confirme ou digite um endereço antes de prosseguir.");
      return;
    }
    setModalSacosVisible(true);
  };

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

  const handleConfirmarColeta = async () => {
    setIsConfirming(true);
    setTimeout(async () => {
      const statusInicial = metodoPagamento === 'ENTREGA' ? 'ABERTO' : 'PENDENTE';
      const novoPedido = {
        id: Math.random().toString(36).substring(7),
        endereco: enderecoManual,
        itens: { classeA: qtdClasseA, classeB: qtdClasseB, classeCD: qtdClasseCD },
        pagamento: metodoPagamento,
        status: statusInicial,
        data: new Date().toISOString()
      };

      const pedidosSalvos = await AsyncStorage.getItem('@mock_pedidos');
      const pedidos = pedidosSalvos ? JSON.parse(pedidosSalvos) : [];
      pedidos.unshift(novoPedido);
      await AsyncStorage.setItem('@mock_pedidos', JSON.stringify(pedidos));

      setIsConfirming(false);
      setModalPagamentoVisible(false);
      router.push('/(cliente)/minhas-coletas');
    }, 3000);
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Cabeçalho com Botão de Logout */}
      <View className="px-6 pt-16 pb-6 bg-[#297C2A] flex-row justify-between items-center shadow-sm z-10">
        <View>
          <Text className="text-white text-2xl font-bold">Olá, {userName}</Text>
          <Text className="text-white/90 text-sm mt-1">Onde está o entulho?</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white/20 px-4 py-2 rounded-full border border-white/30"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-sm">Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Seção do Mapa e Endereço */}
        <View className="px-6 pt-6">
          <TouchableOpacity
            className="bg-white p-4 rounded-xl border border-gray-200 mb-4 shadow-sm flex-row items-center"
            onPress={() => setModalEnderecoVisible(true)}
            activeOpacity={0.7}
          >
            <Text className="text-gray-500 flex-1 font-medium" numberOfLines={1}>
              {enderecoManual ? `📍 ${enderecoManual}` : '🔍 Digite o endereço manualmente...'}
            </Text>
          </TouchableOpacity>

          <View className="h-[300px] bg-gray-200 rounded-2xl overflow-hidden border border-gray-300 shadow-sm">
            {location ? (
              <MapView
                style={{ 
                  flex: 1
                }}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
              >
                <Marker coordinate={location.coords} title="Local da Coleta"/>
              </MapView>
            ) : (
              <View className="flex-1 justify-center items-center">
                <Loader visible={true}/> 
              </View>
            )}
          </View>

          <TouchableOpacity
            className="w-full bg-[#297C2A] rounded-xl py-4 mt-5 items-center shadow-sm"
            onPress={abrirModalDeSacos}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">Confirmar Endereço</Text>
          </TouchableOpacity>
        </View>

        {/* Tabela de Resíduos Flutuante */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-black mb-3">Guia de Resíduos</Text>
          <View
            className="rounded-xl overflow-hidden bg-white border border-gray-100"
            style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 }}
          >
            <View className="flex-row bg-[#297C2A] p-3">
              <Text className="flex-[1.2] text-white font-bold border-r border-white/30 pr-2">Tipo de Resíduo</Text>
              <Text className="flex-[2] text-white font-bold pl-3">Resíduos</Text>
            </View>
            <View className="flex-row border-b border-gray-100 p-3 bg-white">
              <Text className="flex-[1.2] font-semibold text-gray-800 border-r border-gray-200 pr-2">Classe A</Text>
              <Text className="flex-[2] pl-3 text-gray-600 text-sm">Argamassa, concreto, bloco, tijolo e solo (terra)</Text>
            </View>
            <View className="flex-row border-b border-gray-100 p-3 bg-gray-50/50">
              <Text className="flex-[1.2] font-semibold text-gray-800 border-r border-gray-200 pr-2">Classe B</Text>
              <Text className="flex-[2] pl-3 text-gray-600 text-sm">Plásticos, papel, papelão, metais, vidros, gesso e madeiras</Text>
            </View>
            <View className="flex-row p-3 bg-white">
              <Text className="flex-[1.2] font-semibold text-gray-800 border-r border-gray-200 pr-2">Classe C/D</Text>
              <Text className="flex-[2] pl-3 text-gray-600 text-sm">Tintas, solventes, óleos, telhas de amianto e lixo hospitalar</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ----------------- RODAPÉ DE NAVEGAÇÃO ----------------- */}
      <View className="flex-row bg-white border-t border-gray-200 py-3 pb-6 px-6 justify-around items-center shadow-lg">
        {/* Botão Home */}
        <TouchableOpacity
          className="items-center justify-center p-2"
          activeOpacity={0.8}
        >
          <FontAwesome name="home" size={26} color="#297C2A" />
          <Text className="text-[#297C2A] text-xs font-bold mt-1">Início</Text>
        </TouchableOpacity>

        {/* Botão Lista */}
        <TouchableOpacity
          className="items-center justify-center p-2"
          onPress={() => router.push('/(cliente)/minhas-coletas')}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="list-alt" size={24} color="#297C2A" />
          <Text className="text-[#297C2A] text-xs font-bold mt-1">Pedidos</Text>
        </TouchableOpacity>
      </View>


      {/* ----------------- MODAIS ----------------- */}

      {/* Digitar Endereço */}
      <Modal animationType="fade" transparent={true} visible={modalEnderecoVisible}>
        <View className="flex-1 justify-center bg-black/50 px-6">
          <View className="bg-white rounded-2xl p-6 shadow-xl">
            <Text className="text-xl font-bold text-black mb-4">Qual o endereço da coleta?</Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-300 text-black mb-6"
              placeholder="Rua, Número, Bairro, Cidade"
              value={enderecoManual}
              onChangeText={setEnderecoManual}
              autoFocus={true}
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="px-5 py-3 rounded-lg bg-gray-200"
                onPress={() => setModalEnderecoVisible(false)}
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-bold">Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-5 py-3 rounded-lg bg-[#297C2A]"
                onPress={() => setModalEnderecoVisible(false)}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold">Salvar Endereço</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Seleção de Sacos (Bottom Sheet) */}
      <Modal animationType="slide" transparent={true} visible={modalSacosVisible}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-lg">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-black">Quantidade de Sacos</Text>
              <TouchableOpacity
                onPress={() => setModalSacosVisible(false)}
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
              onPress={() => {
                setModalSacosVisible(false); // Fecha os sacos
                setTimeout(() => setModalPagamentoVisible(true), 300); // Abre o pagamento
              }}
            >
              <Text className="text-white font-bold text-lg">SOLICITAR COLETA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmação e Pagamento */}
      <Modal animationType="slide" transparent={true} visible={modalPagamentoVisible}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[80%]">
            {isConfirming ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#297C2A" />
                <Text className="text-xl font-bold text-[#297C2A] mt-4">Processando pedido...</Text>
                <Text className="text-gray-500 mt-2 text-center">Aguardando confirmação do pagamento ♻️</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-2xl font-bold text-black mb-6">Resumo do Pedido</Text>

                <View className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                  <Text className="font-bold text-gray-800 mb-1">Local da Retirada:</Text>
                  <Text className="text-gray-600 mb-4">{enderecoManual}</Text>

                  <Text className="font-bold text-gray-800 mb-1">Resíduos (Sacos):</Text>
                  {qtdClasseA > 0 && <Text className="text-gray-600">• {qtdClasseA}x Classe A</Text>}
                  {qtdClasseB > 0 && <Text className="text-gray-600">• {qtdClasseB}x Classe B</Text>}
                  {qtdClasseCD > 0 && <Text className="text-gray-600">• {qtdClasseCD}x Classe C/D</Text>}
                </View>

                <Text className="text-lg font-bold text-black mb-3">Método de Pagamento</Text>

                <View className="gap-3 mb-8">
                  {['PIX', 'CARTAO', 'ENTREGA'].map((metodo) => (
                    <TouchableOpacity
                      key={metodo}
                      onPress={() => setMetodoPagamento(metodo as any)}
                      activeOpacity={0.8}
                      className={`p-4 rounded-xl border-2 flex-row items-center justify-between ${metodoPagamento === metodo ? 'border-[#297C2A] bg-[#297C2A]/5' : 'border-gray-200 bg-white'}`}
                    >
                      <Text className={`font-bold ${metodoPagamento === metodo ? 'text-[#297C2A]' : 'text-gray-600'}`}>
                        {metodo === 'CARTAO' ? '💳 Cartão de Crédito/Débito' : metodo === 'ENTREGA' ? '🚚 Pagamento na Entrega' : '💠 PIX'}
                      </Text>
                      {metodoPagamento === metodo && <View className="w-4 h-4 rounded-full bg-[#297C2A]" />}
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-gray-200 rounded-xl py-4 items-center"
                    onPress={() => setModalPagamentoVisible(false)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-gray-700 font-bold">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-[2] bg-[#297C2A] rounded-xl py-4 items-center"
                    onPress={handleConfirmarColeta}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-bold text-lg">CONFIRMAR COLETA</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}
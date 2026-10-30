import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useTallerStore } from '../../lib/store';

export default function Vehiculos() {
  const router = useRouter();
  const todos = useTallerStore((s) => s.vehiculos);
  const mecanico = useTallerStore((s) => s.mecanicoActual);
  const logout = useTallerStore((s) => s.logout);
  const [busqueda, setBusqueda] = useState('');

  const texto = busqueda.trim().toLowerCase();
  const vehiculos = todos
    .filter((v) => v.mecanicoId === mecanico?.id)
    .filter(
      (v) =>
        v.marca.toLowerCase().includes(texto) ||
        v.modelo.toLowerCase().includes(texto) ||
        v.patente.toLowerCase().includes(texto)
    );

  const salir = () => {
    logout();
    router.replace('/');
  };

  return (
    <Container>
      <Title>Hola, {mecanico?.nombre}</Title>
      <Search
        placeholder="Buscar por marca, modelo o patente"
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
        autoCapitalize="none"
      />

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <EmptyText>
            {texto ? 'No hay resultados para tu búsqueda' : 'Todavía no hay vehículos cargados'}
          </EmptyText>
        }

        renderItem={({ item }) => (
          <Card onPress={() => router.push({ pathname: '/vehiculos/[id]', params: { id: String(item.id) } })}>
            {item.foto && <Thumb source={{ uri: item.foto }} />}
            <Info>
              <CardTitle>
                {item.marca} {item.modelo}
              </CardTitle>
              <CardText>Patente: {item.patente}</CardText>
            </Info>
          </Card>
        )}
      />

      <Button onPress={() => router.push('/vehiculos/nuevo')}>
        <ButtonText>+ Agregar vehículo</ButtonText>
      </Button>

      <LogoutButton onPress={salir}>
        <LogoutText>Cerrar sesión</LogoutText>
      </LogoutButton>

    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #1b2a4a;
  padding: 24px;
  padding-top: 60px;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #00c9a7;
  margin-bottom: 16px;
`;

const Search = styled.TextInput`
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

const Card = styled.TouchableOpacity`
  background-color: #27406b;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

const Thumb = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  margin-right: 12px;
`;

const Info = styled.View`
  flex: 1;
`;

const CardTitle = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const CardText = styled.Text`
  color: #cbd5e1;
`;

const EmptyText = styled.Text`
  color: #9ca3af;
  text-align: center;
  margin-top: 24px;
`;

const Button = styled.TouchableOpacity`
  background-color: #00c9a7;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-weight: bold;
`;

const LogoutButton = styled.TouchableOpacity`
  padding: 14px;
  align-items: center;
  margin-top: 8px;
`;

const LogoutText = styled.Text`
  color: #f59e0b;
`;

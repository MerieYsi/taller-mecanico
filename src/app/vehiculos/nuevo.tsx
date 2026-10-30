import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { elegirDeGaleria, sacarFoto } from '../../lib/foto';
import { useTallerStore } from '../../lib/store';
import { validarPatente } from '../../lib/validaciones';

export default function NuevoVehiculo() {
  const router = useRouter();
  const agregarVehiculo = useTallerStore((s) => s.agregarVehiculo);

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [patente, setPatente] = useState('');
  const [foto, setFoto] = useState<string | undefined>();

  const [intentado, setIntentado] = useState(false);
  const errMarca = !marca.trim() ? 'Ingresá la marca' : undefined;
  const errModelo = !modelo.trim() ? 'Ingresá el modelo' : undefined;
  const errPatente = !validarPatente(patente) ? 'La patente debe tener al menos 6 caracteres' : undefined;

  const tomarFoto = async () => {
    const uri = await sacarFoto();
    if (uri) setFoto(uri);
  };

  const elegirFoto = async () => {
    const uri = await elegirDeGaleria();
    if (uri) setFoto(uri);
  };

  const guardar = () => {
    setIntentado(true);
    if (errMarca || errModelo || errPatente) return;
    agregarVehiculo({
      marca: marca.trim(),
      modelo: modelo.trim(),
      patente: patente.trim().toUpperCase(),
      foto,
    });
    router.back();
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        <Title>Nuevo vehículo</Title>

        {foto ? (
          <Preview source={{ uri: foto }} resizeMode="cover" />
        ) : (
          <Placeholder>
            <PlaceholderText>Sin foto</PlaceholderText>
          </Placeholder>
        )}

        <Fila>
          <SmallButton onPress={tomarFoto}>
            <ButtonText>Cámara</ButtonText>
          </SmallButton>

          <SmallButton onPress={elegirFoto}>
            <ButtonText>Galería</ButtonText>
          </SmallButton>
        </Fila>

        <Input
          placeholder="Marca"
          placeholderTextColor="#888"
          value={marca} onChangeText={setMarca}
        />
        {intentado && !!errMarca && <ErrorText>{errMarca}</ErrorText>}

        <Input
          placeholder="Modelo"
          placeholderTextColor="#888"
          value={modelo} onChangeText={setModelo}
        />
        {intentado && !!errModelo && <ErrorText>{errModelo}</ErrorText>}

        <Input
          placeholder="Patente"
          placeholderTextColor="#888"
          value={patente}
          onChangeText={setPatente}
          autoCapitalize="characters"
        />
        {intentado && !!errPatente && <ErrorText>{errPatente}</ErrorText>}

        <Button onPress={guardar}>
          <ButtonText>Guardar</ButtonText>
        </Button>

        <LinkButton onPress={() => router.back()}>
          <LinkText>Cancelar</LinkText>
        </LinkButton>

      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #1b2a4a;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #00c9a7;
  margin-bottom: 20px;
  text-align: center;
`;

const Preview = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const Placeholder = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  background-color: #27406b;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const PlaceholderText = styled.Text`
  color: #9ca3af;
`;

const Fila = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

const SmallButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #00c9a7;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-horizontal: 4px;
`;

const Input = styled.TextInput`
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 6px;
`;

const ErrorText = styled.Text`
  color: #fca5a5;
  font-size: 12px;
  margin-bottom: 8px;
  margin-left: 4px;
`;

const Button = styled.TouchableOpacity`
  background-color: #00c9a7;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

const ButtonText = styled.Text`
  font-weight: bold;
`;

const LinkButton = styled.TouchableOpacity`
  padding: 14px;
  align-items: center;
  margin-top: 8px;
`;

const LinkText = styled.Text`
  color: #f59e0b;
`;

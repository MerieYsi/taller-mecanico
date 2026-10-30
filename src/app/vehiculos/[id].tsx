import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTallerStore } from '../../lib/store';
import { validarPatente } from '../../lib/validaciones';

export default function DetalleVehiculo() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehiculo = useTallerStore((s) => s.vehiculos.find((v) => v.id === Number(id)));
  
  const [foto, setFoto] = useState(vehiculo?.foto);
  const [marca, setMarca] = useState(vehiculo?.marca ?? '');
  const [modelo, setModelo] = useState(vehiculo?.modelo ?? '');
  const [patente, setPatente] = useState(vehiculo?.patente ?? '');

  const editarVehiculo = useTallerStore((s) => s.editarVehiculo);
  const eliminarVehiculo = useTallerStore((s) => s.eliminarVehiculo);

  const [editando, setEditando] = useState(false);
  const [intentado, setIntentado] = useState(false);

  if (!vehiculo) {
    return (
      <Container>
        <Title>Vehículo no encontrado</Title>
        <LinkButton onPress={() => router.back()}>
          <LinkText>Volver</LinkText>
        </LinkButton>
      </Container>
    );
  }

  const errMarca = !marca.trim() ? 'Ingresá la marca' : undefined;
  const errModelo = !modelo.trim() ? 'Ingresá el modelo' : undefined;
  const errPatente = !validarPatente(patente) ? 'La patente debe tener al menos 6 caracteres' : undefined;

  const guardar = () => {
    setIntentado(true);
    if (errMarca || errModelo || errPatente) return;
        editarVehiculo(vehiculo.id, {
          marca: marca.trim(),
          modelo: modelo.trim(),
          patente: patente.trim().toUpperCase(),
          foto,
    });
    setEditando(false);
    setIntentado(false);
  };

  const cancelarEdicion = () => {
    setMarca(vehiculo.marca);
    setModelo(vehiculo.modelo);
    setPatente(vehiculo.patente);
    setEditando(false);
    setIntentado(false);
    setFoto(vehiculo.foto);
  };

  const cambiarFoto = async (obtener: () => Promise<string | null>) => {
    const uri = await obtener();
    if (uri) setFoto(uri);
  };

  const borrar = () => {
    Alert.alert('Eliminar vehículo', `¿Seguro que querés eliminar ${vehiculo.marca} ${vehiculo.modelo}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          eliminarVehiculo(vehiculo.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Container>
      <Title>{editando ? 'Editar vehículo' : 'Detalle del vehículo'}</Title>

      {editando ? (
        <>
          {foto && <Foto source={{ uri: foto }} resizeMode="cover" />}

          <Fila>
            <SmallButton onPress={() => cambiarFoto(sacarFoto)}>
              <ButtonText>Cámara</ButtonText>
            </SmallButton>

            <SmallButton onPress={() => cambiarFoto(elegirDeGaleria)}>
              <ButtonText>Galería</ButtonText>
            </SmallButton>
          </Fila>

          <Input
            placeholder="Marca"
            placeholderTextColor="#888"
            value={marca}
            onChangeText={setMarca}
          />
          {intentado && !!errMarca && <ErrorText>{errMarca}</ErrorText>}

          <Input
            placeholder="Modelo"
            placeholderTextColor="#888"
            value={modelo}
            onChangeText={setModelo}
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
            <ButtonText>Guardar cambios</ButtonText>
          </Button>

          <LinkButton onPress={cancelarEdicion}>
            <LinkText>Cancelar</LinkText>
          </LinkButton>
        </>

      ) : (
        <>
          <Card>
            {vehiculo.foto && <Foto source={{ uri: vehiculo.foto }} resizeMode="cover" />}
            
            <Label>Marca</Label>
            <Value>{vehiculo.marca}</Value>

            <Label>Modelo</Label>
            <Value>{vehiculo.modelo}</Value>

            <Label>Patente</Label>
            <Value>{vehiculo.patente}</Value>
          </Card>

          <Button onPress={() => setEditando(true)}>
            <ButtonText>Editar</ButtonText>
          </Button>

          <DeleteButton onPress={borrar}>
            <ButtonText>Eliminar</ButtonText>
          </DeleteButton>

          <LinkButton onPress={() => router.back()}>
            <LinkText>Volver</LinkText>
          </LinkButton>
        </>
      )}
    </Container>
  );
}

const Foto = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #1b2a4a;
  padding: 24px;
  padding-top: 60px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #00c9a7;
  margin-bottom: 20px;
  text-align: center;
`;

const Card = styled.View`
  background-color: #27406b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  color: #9ca3af;
  font-size: 12px;
  margin-top: 8px;
`;

const Value = styled.Text`
  color: white;
  font-size: 18px;
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

const DeleteButton = styled.TouchableOpacity`
  background-color: #ef4444;
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

const Fila = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
`;

const SmallButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #00c9a7;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-horizontal: 4px;
`;

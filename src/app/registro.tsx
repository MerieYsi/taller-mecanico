import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { useTallerStore } from '../lib/store';
import { validarDni, validarEmail, validarNombre, validarPassword, validarTelefono, } from '../lib/validaciones';

type CampoProps = TextInputProps & { error?: string };

const Campo = ({ error, ...props }: CampoProps) => (
  <Fila>
    <Input hasError={!!error} placeholderTextColor="#888" {...props} />
    {!!error && <ErrorText>{error}</ErrorText>}
  </Fila>
);

export default function Registro() {
  const router = useRouter();
  const registrarMecanico = useTallerStore((s) => s.registrarMecanico);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [confirmar, setConfirmar] = useState('');
  const [intentado, setIntentado] = useState(false);
  const [duplicado, setDuplicado] = useState<{ campo: string; mensaje: string } | null>(null);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = 'Ingresá el nombre';
    else if (!validarNombre(nombre)) e.nombre = 'El nombre solo puede tener letras (mínimo 2)';

    if (!apellido.trim()) e.apellido = 'Ingresá el apellido';
    else if (!validarNombre(apellido)) e.apellido = 'El apellido solo puede tener letras (mínimo 2)';

    if (!dni) e.dni = 'Ingresá el DNI';
    else if (!validarDni(dni)) e.dni = 'El DNI debe tener 7 u 8 números';

    if (!telefono) e.telefono = 'Ingresá el teléfono';
    else if (!validarTelefono(telefono)) e.telefono = 'El teléfono debe tener entre 8 y 15 números';

    if (!especialidad.trim()) e.especialidad = 'Ingresá la especialidad';
    else if (!validarNombre(especialidad)) e.especialidad = 'La especialidad solo puede tener letras';

    if (!email.trim()) e.email = 'Ingresá el email';
    else if (!validarEmail(email)) e.email = 'Email inválido (ej: nombre@correo.com)';

    if (!password) e.password = 'Ingresá una contraseña';
    else if (!validarPassword(password))
      e.password = 'Mínimo 6 caracteres, con al menos una letra y un número';

    if (!confirmar) e.confirmar = 'Repetí la contraseña';
    else if (confirmar !== password) e.confirmar = 'Las contraseñas no coinciden';

    return e;
  };

  const errores = validar();

  const errorDe = (campo: string) => {
    if (!intentado) return undefined;
    return errores[campo] ?? (duplicado?.campo === campo ? duplicado.mensaje : undefined);
  };

  const guardar = () => {
    setIntentado(true);
    if (Object.keys(errores).length > 0) return;

    const resultado = registrarMecanico({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni,
      telefono,
      especialidad: especialidad.trim(),
      email,
      password,
    });

    if (resultado === 'email_repetido') {
      setDuplicado({ campo: 'email', mensaje: 'Ya existe un mecánico con ese email' });
      return;
    }
    if (resultado === 'dni_repetido') {
      setDuplicado({ campo: 'dni', mensaje: 'Ya existe un mecánico con ese DNI' });
      return;
    }

    Alert.alert('Listo', 'Mecánico registrado. Ya podés iniciar sesión.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        <Title>Nuevo mecánico</Title>

        <Campo placeholder="Nombre" value={nombre} onChangeText={setNombre}
          autoCapitalize="words" error={errorDe('nombre')} />
        <Campo placeholder="Apellido" value={apellido} onChangeText={setApellido}
          autoCapitalize="words" error={errorDe('apellido')} />
        <Campo placeholder="DNI" value={dni}
          onChangeText={(t) => { setDni(t.replace(/\D/g, '')); setDuplicado(null); }}
          keyboardType="numeric" maxLength={8} error={errorDe('dni')} />
        <Campo placeholder="Teléfono" value={telefono}
          onChangeText={(t) => setTelefono(t.replace(/\D/g, ''))}
          keyboardType="phone-pad" maxLength={15} error={errorDe('telefono')} />
        <Campo placeholder="Especialidad (ej: Frenos)" value={especialidad}
          onChangeText={setEspecialidad} autoCapitalize="sentences"
          error={errorDe('especialidad')} />
        <Campo placeholder="Email" value={email}
          onChangeText={(t) => { setEmail(t); setDuplicado(null); }}
          keyboardType="email-address" autoCapitalize="none" error={errorDe('email')} />
        <Campo placeholder="Contraseña" value={password} onChangeText={setPassword}
          secureTextEntry error={errorDe('password')} />
        <Campo placeholder="Confirmar contraseña" value={confirmar}
          onChangeText={setConfirmar} secureTextEntry error={errorDe('confirmar')} />

        <Button onPress={guardar}>
          <ButtonText>Registrar</ButtonText>
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
  font-size: 28px;
  font-weight: bold;
  color: #00c9a7;
  margin-bottom: 20px;
  text-align: center;
`;
const Fila = styled.View`
  margin-bottom: 12px;
`;
const Input = styled.TextInput<{ hasError?: boolean }>`
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  border-width: 2px;
  border-color: ${(p) => (p.hasError ? '#ef4444' : 'transparent')};
`;
const ErrorText = styled.Text`
  color: #fca5a5;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;
const Button = styled.TouchableOpacity`
  background-color: #00c9a7;
  border-radius: 8px;
  padding: 14px;
  align-items: center;
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
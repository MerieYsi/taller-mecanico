import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTallerStore } from '../lib/store';
import { validarEmail } from '../lib/validaciones';

export default function Login() {
  const router = useRouter();
  const login = useTallerStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const ingresar = () => {
    if (!validarEmail(email)) {
      Alert.alert('Error', 'Email inválido');
      return;
    }

    if (!login(email, password)) {
        Alert.alert('Error', 'Credenciales incorrectas');
        return;
    }

    router.replace('/vehiculos');
  };

  return (
    <Container>
      
      <Title>Taller Mecánico </Title>
      <Input placeholder = "Email" value = { email } onChangeText = { setEmail } keyboardType = "email-address" autoCapitalize = "none"/>
      <Input placeholder="Contraseña" value = { password } onChangeText = { setPassword } secureTextEntry />
      
      <Button onPress={ ingresar }>
        <ButtonText>Ingresar </ButtonText>
      </Button>
      
      <LinkButton onPress={() => router.push('/registro')}>
        <LinkText>Registrar nuevo mecánico</LinkText>
      </LinkButton>
    
    </Container>    
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #1b2a4a;
  justify-content: center;
  padding: 24px;
`;
const Title = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: #00c9a7;
  margin-bottom: 24px;
  text-align: center;
`;
const Input = styled.TextInput`
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
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
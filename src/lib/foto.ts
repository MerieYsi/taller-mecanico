import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

const pedirAjustes = (titulo: string, mensaje: string) =>
  Alert.alert(titulo, mensaje, [
    { text: 'Ahora no', style: 'cancel' },
    { text: 'Ajustes', onPress: () => Linking.openSettings() },
  ]);

export async function sacarFoto(): Promise<string | null> {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    pedirAjustes('Sin acceso a la cámara', 'Habilitá el permiso de cámara desde Ajustes.');
    return null;
  }
  const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
  return res.canceled ? null : res.assets[0].uri;
}

export async function elegirDeGaleria(): Promise<string | null> {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) {
    pedirAjustes('Sin acceso a las fotos', 'Habilitá el permiso de fotos desde Ajustes.');
    return null;
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.7,
  });
  return res.canceled ? null : res.assets[0].uri;
}
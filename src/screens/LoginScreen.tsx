import { BrandHomeLink } from '@/components/BrandHomeLink';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/hooks/useAuth';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { validateLoginFields } from '@/utils/validation';

export function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const validation = validateLoginFields(email, password);
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao entrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 px-6 pt-10">
        <BrandHomeLink />
        <Text className="text-3xl font-bold text-health-navy">Bem-vindo de volta</Text>
        <Text className="mt-2 text-base text-slate-600">Entre para ver seu painel de saúde.</Text>
        <View className="mt-10">
          <TextField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextField label="Senha" value={password} onChangeText={setPassword} secureTextEntry withPasswordToggle />
          {error ? <Text className="mb-4 text-sm text-red-600">{error}</Text> : null}
          <PrimaryButton label="Entrar" onPress={() => void handleSubmit()} loading={loading} />
        </View>
        <Pressable className="mt-6 items-center" onPress={() => navigation.navigate('Register')}>
          <Text className="text-sm text-health-sky">Criar conta</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

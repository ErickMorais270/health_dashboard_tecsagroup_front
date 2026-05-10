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
import { validateRegisterFields } from '@/utils/validation';

export function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const validation = validateRegisterFields({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 px-6 pt-10">
        <BrandHomeLink />
        <Text className="text-3xl font-bold text-health-navy">Crie sua conta</Text>
        <Text className="mt-2 text-base text-slate-600">Leva menos de um minuto.</Text>
        <View className="mt-8">
          <TextField label="Nome" value={name} onChangeText={setName} />
          <TextField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextField label="Senha" value={password} onChangeText={setPassword} secureTextEntry withPasswordToggle />
          <TextField
            label="Confirmar senha"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
            withPasswordToggle
          />
          {error ? <Text className="mb-4 text-sm text-red-600">{error}</Text> : null}
          <PrimaryButton label="Cadastrar" onPress={() => void handleSubmit()} loading={loading} />
        </View>
        <Pressable className="mt-6 items-center" onPress={() => navigation.navigate('Login')}>
          <Text className="text-sm text-health-sky">Já tenho conta</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

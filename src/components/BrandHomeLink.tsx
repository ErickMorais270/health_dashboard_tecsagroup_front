import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Sparkles } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

/**
 * Mesmo cabeçalho da introdução: ao tocar, volta à simulação inicial (Onboarding).
 */
export function BrandHomeLink(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <Pressable
      onPress={goHome}
      accessibilityRole="link"
      accessibilityLabel="Voltar à tela inicial Health Dashboard"
      className="mb-6 flex-row items-center gap-2 self-start active:opacity-75"
    >
      <Sparkles size={18} color="#2EC4B6" strokeWidth={2.4} />
      <Text className="text-xs font-bold uppercase tracking-[0.14em] text-health-mint">Health Dashboard</Text>
    </Pressable>
  );
}

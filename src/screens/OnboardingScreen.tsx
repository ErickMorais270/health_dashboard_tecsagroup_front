import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/hooks/useAuth';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Droplets, HeartPulse, Moon, Sparkles } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Valores fixos só para exibição na simulação (não enviados ao servidor). */
const DEMO_BIOMARKERS = {
  sleep_hours: '7.5',
  glucose_level: '95',
  heart_rate: '72',
} as const;

function MetricRow({
  icon: Icon,
  iconTint,
  label,
  valueDisplay,
  suffix,
  isLast,
}: {
  icon: typeof Moon;
  iconTint: string;
  label: string;
  valueDisplay: string;
  suffix: string;
  isLast?: boolean;
}): React.JSX.Element {
  return (
    <View
      className={`flex-row items-stretch overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/90 ${isLast ? '' : 'mb-3'}`}
    >
      <View className="w-[52px] items-center justify-center bg-white">
        <View className="rounded-xl bg-health-mint/15 p-2">
          <Icon size={22} color={iconTint} strokeWidth={2.2} />
        </View>
      </View>
      <View className="min-w-0 flex-1 justify-center py-3 pr-3">
        <Text className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{label}</Text>
        <View className="mt-2 flex-row items-baseline">
          <Text
            className="min-w-0 flex-1 shrink text-2xl font-bold leading-tight text-health-navy"
            accessibilityRole="text"
            accessibilityLabel={`${label} ${valueDisplay} ${suffix}`}
          >
            {valueDisplay}
          </Text>
          <Text className="pl-1.5 text-sm font-medium text-slate-400">{suffix}</Text>
        </View>
      </View>
    </View>
  );
}

export function OnboardingScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const { completeOnboarding } = useAuth();

  const persistDemoAndFinish = async (next: 'Login' | 'Register') => {
    await completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: next }] });
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="grow pb-8"
      >
        <View className="relative overflow-hidden px-5 pb-2 pt-2">
          <View className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-health-mint/20" />
          <View className="absolute -left-16 top-28 h-36 w-36 rounded-full bg-health-sky/15" />

          <View className="mb-1 flex-row items-center gap-2">
            <Sparkles size={18} color="#2EC4B6" strokeWidth={2.4} />
            <Text className="text-xs font-bold uppercase tracking-[0.14em] text-health-mint">Health Dashboard</Text>
          </View>
          <Text className="mt-3 text-3xl font-bold leading-tight text-health-navy">Simule seus biomarcadores</Text>
          <Text className="mt-3 max-w-[95%] text-base leading-6 text-slate-600">
            Veja como nossa inteligência processa seus índices de sono, glicose e frequência cardíaca para otimizar sua
            longevidade.
          </Text>
        </View>

        <View className="mx-5 mt-4 rounded-3xl border border-white bg-white p-5 shadow-sm">
          <Text className="text-base font-semibold text-health-navy">Parâmetros de análise</Text>
          <Text className="mt-1.5 text-xs leading-5 text-slate-500">
            Estes valores são apenas para demonstração. A análise clínica completa estará disponível após o seu registro.
          </Text>

          <View className="mt-5">
            <MetricRow
              icon={Moon}
              iconTint="#0B3C5D"
              label="Sono"
              valueDisplay={DEMO_BIOMARKERS.sleep_hours}
              suffix="h"
            />
            <MetricRow
              icon={Droplets}
              iconTint="#328CC1"
              label="Glicose"
              valueDisplay={DEMO_BIOMARKERS.glucose_level}
              suffix="mg/dL"
            />
            <MetricRow
              icon={HeartPulse}
              iconTint="#1B998B"
              label="FC"
              valueDisplay={DEMO_BIOMARKERS.heart_rate}
              suffix="bpm"
              isLast
            />
          </View>

          <View className="mt-4 rounded-xl bg-health-cloud px-3 py-2.5">
            <Text className="text-center text-xs leading-5 text-slate-500">
              Pronto para ver seus resultados reais? Cadastre-se para processar seus dados e receber orientações práticas para sua rotina.
            </Text>
          </View>
        </View>

        <View className="mt-8 gap-3 px-5">
          <PrimaryButton label="Criar conta" onPress={() => void persistDemoAndFinish('Register')} />
          <PrimaryButton
            label="Já possuo conta"
            variant="ghost"
            onPress={() => void persistDemoAndFinish('Login')}
            className="border-health-navy/12"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

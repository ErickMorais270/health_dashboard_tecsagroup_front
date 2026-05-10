import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'solid' | 'ghost';
  className?: string;
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  variant = 'solid',
  className,
}: Props): React.JSX.Element {
  const base =
    variant === 'solid'
      ? 'bg-health-navy active:bg-health-sky'
      : 'border border-health-sky bg-white active:bg-health-cloud';

  const textColor = variant === 'solid' ? 'text-white' : 'text-health-navy';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      className={`rounded-2xl px-5 py-3 ${base} ${loading ? 'opacity-60' : ''} ${className ?? ''}`}
    >
      {loading ? (
        <View className="flex-row items-center justify-center gap-3">
          <ActivityIndicator color={variant === 'solid' ? '#ffffff' : '#0B3C5D'} />
          <Text className={`text-base font-semibold ${textColor}`}>Aguarde…</Text>
        </View>
      ) : (
        <Text className={`text-center text-base font-semibold ${textColor}`}>{label}</Text>
      )}
    </Pressable>
  );
}

import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  /** Quando true (com senha), mostra ícones Lucide para exibir/ocultar. */
  withPasswordToggle?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'decimal-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  withPasswordToggle = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: Props): React.JSX.Element {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = Boolean(secureTextEntry);
  const obscured = withPasswordToggle && isPassword ? !passwordVisible : Boolean(secureTextEntry);

  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-health-navy">{label}</Text>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={obscured}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className={`rounded-xl border border-slate-200 bg-white py-3 pl-4 text-base text-slate-900 ${
            withPasswordToggle && isPassword ? 'pr-12' : 'pr-4'
          }`}
          placeholderTextColor="#94a3b8"
        />
        {withPasswordToggle && isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={12}
            onPress={() => setPasswordVisible((v) => !v)}
            className="absolute bottom-0 right-2 top-0 justify-center"
          >
            {passwordVisible ? (
              <EyeOff size={22} color="#64748b" strokeWidth={2} />
            ) : (
              <Eye size={22} color="#64748b" strokeWidth={2} />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

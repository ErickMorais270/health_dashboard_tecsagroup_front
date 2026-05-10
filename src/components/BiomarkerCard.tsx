import type { Biomarker } from '@/services/api/types';
import { formatBrazilDateFromIso, formatBrazilTimeFromIso } from '@/utils/biomarkerDates';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';

type Props = {
  biomarker: Biomarker;
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function BiomarkerCard({ biomarker }: Props): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const rec = biomarker.health_recommendation;
  const hasTips = Boolean(rec && rec.recommendations.length > 0);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View className="mb-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200">
      <View className="p-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-health-sky">Medição</Text>
        <View className="mt-3 flex-row justify-between border-b border-slate-100 pb-3">
          <View className="min-w-[45%]">
            <Text className="text-xs text-slate-500">Data</Text>
            <Text className="mt-0.5 text-base font-semibold text-health-navy">
              {formatBrazilDateFromIso(biomarker.created_at)}
            </Text>
          </View>
          <View className="min-w-[45%]">
            <Text className="text-xs text-slate-500">Hora</Text>
            <Text className="mt-0.5 text-base font-semibold text-health-navy">
              {formatBrazilTimeFromIso(biomarker.created_at)}
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row justify-between">
          <View className="min-w-[28%]">
            <Text className="text-xs text-slate-500">Sono</Text>
            <Text className="text-lg font-semibold text-health-navy">{biomarker.sleep_hours} h</Text>
          </View>
          <View className="min-w-[28%]">
            <Text className="text-xs text-slate-500">Glicose</Text>
            <Text className="text-lg font-semibold text-health-navy">{biomarker.glucose_level} mg/dL</Text>
          </View>
          <View className="min-w-[28%]">
            <Text className="text-xs text-slate-500">FC</Text>
            <Text className="text-lg font-semibold text-health-navy">{biomarker.heart_rate} bpm</Text>
          </View>
        </View>

        {hasTips ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            accessibilityLabel={expanded ? 'Ocultar recomendações da IA' : 'Ver recomendações da IA'}
            onPress={toggle}
            className="mt-4 flex-row items-center justify-between rounded-xl bg-health-mint/10 px-3 py-2.5 active:bg-health-mint/20"
          >
            <View className="flex-row items-center gap-2">
              <Sparkles size={18} color="#2EC4B6" strokeWidth={2.2} />
              <Text className="text-sm font-semibold text-health-navy">Recomendações da IA</Text>
              <Text className="rounded-full bg-health-mint/25 px-2 py-0.5 text-xs font-bold text-health-navy">
                {rec!.recommendations.length}
              </Text>
            </View>
            {expanded ? (
              <ChevronUp size={22} color="#0B3C5D" strokeWidth={2} />
            ) : (
              <ChevronDown size={22} color="#0B3C5D" strokeWidth={2} />
            )}
          </Pressable>
        ) : (
          <View className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
            <Text className="text-center text-xs text-slate-500">Sem recomendações salvas para esta medição.</Text>
          </View>
        )}
      </View>

      {expanded && hasTips ? (
        <View className="border-t border-slate-100 bg-health-cloud/80 px-4 pb-4 pt-2">
          {rec!.recommendations.map((tip, index) => (
            <View key={`${rec!.id}-${index}`} className="mb-2 rounded-2xl border border-health-mint/20 bg-white p-3 shadow-sm">
              <Text className="text-xs font-bold uppercase tracking-wide text-health-mint">Dica {index + 1}</Text>
              <Text className="mt-1.5 text-sm leading-5 text-slate-700">{tip}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

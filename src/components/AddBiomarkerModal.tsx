import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { createBiomarker } from '@/services/biomarkerApi';
import { validateBiomarkerForm } from '@/utils/validation';
import { Modal, Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
};

export function AddBiomarkerModal({ visible, onClose, onCreated }: Props): React.JSX.Element {
  const [sleep, setSleep] = useState('');
  const [glucose, setGlucose] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSleep('');
      setGlucose('');
      setHeartRate('');
      setError(null);
      setLoading(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    setError(null);
    const validation = validateBiomarkerForm({
      sleep_hours: sleep,
      glucose_level: glucose,
      heart_rate: heartRate,
    });

    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    try {
      await createBiomarker({
        sleep_hours: Number(sleep),
        glucose_level: Number(glucose),
        heart_rate: Math.round(Number(heartRate)),
      });
      await onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-3xl bg-white px-5 pb-8 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-semibold text-health-navy">Novo biomarcador</Text>
            <Pressable onPress={onClose} accessibilityRole="button">
              <Text className="text-base font-semibold text-health-sky">Fechar</Text>
            </Pressable>
          </View>
          <TextField
            label="Sono (horas)"
            value={sleep}
            onChangeText={setSleep}
            keyboardType="decimal-pad"
            placeholder="Ex.: 7,5 ou 8"
          />
          <TextField
            label="Glicose (mg/dL)"
            value={glucose}
            onChangeText={setGlucose}
            keyboardType="decimal-pad"
            placeholder="Ex.: 95 (jejum)"
          />
          <TextField
            label="Frequência cardíaca (bpm)"
            value={heartRate}
            onChangeText={setHeartRate}
            keyboardType="number-pad"
            placeholder="Ex.: 72 em repouso"
          />
          {error ? <Text className="mb-3 text-sm text-red-600">{error}</Text> : null}
          <PrimaryButton label="Salvar e gerar recomendações" onPress={() => void handleSubmit()} loading={loading} />
        </View>
      </View>
    </Modal>
  );
}

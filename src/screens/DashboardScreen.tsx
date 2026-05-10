import { AddBiomarkerModal } from '@/components/AddBiomarkerModal';
import { BiomarkerCard } from '@/components/BiomarkerCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { WebDateInput } from '@/components/WebDateInput';
import { useAuth } from '@/hooks/useAuth';
import type { RootStackParamList } from '@/navigation/types';
import type { Biomarker } from '@/services/api/types';
import { fetchDashboard } from '@/services/dashboardApi';
import type { DashboardData } from '@/services/api/types';
import {
  dateToLocalDayKey,
  formatBrazilDateLocal,
  isoToLocalDayKey,
} from '@/utils/biomarkerDates';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CalendarRange, LogOut, Plus, X } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

function sortByCreatedAtDesc(list: Biomarker[]): Biomarker[] {
  return [...list].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function initialsFromName(name: string | undefined): string {
  const n = name?.trim();
  if (!n) {
    return '?';
  }
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function DashboardScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  /** null = mostrar todo o histórico (mais recentes primeiro) */
  const [filterDay, setFilterDay] = useState<Date | null>(null);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [pendingDay, setPendingDay] = useState(() => new Date());

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetchDashboard();
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar painel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const markers = data?.biomarkers ?? [];

  const displayedMarkers = useMemo(() => {
    const sorted = sortByCreatedAtDesc(markers);
    if (filterDay === null) {
      return sorted;
    }
    const key = dateToLocalDayKey(filterDay);
    return sorted.filter((m) => isoToLocalDayKey(m.created_at) === key);
  }, [markers, filterDay]);

  const openDateFilter = () => {
    const initial = filterDay ?? new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initial,
        mode: 'date',
        maximumDate: new Date(),
        onChange: (event, date) => {
          if (event.type === 'dismissed' || !date) {
            return;
          }
          setFilterDay(date);
        },
      });
      return;
    }
    setPendingDay(filterDay ?? new Date());
    setDayPickerOpen(true);
  };

  const applyPickedDay = () => {
    setFilterDay(pendingDay);
    setDayPickerOpen(false);
  };

  const clearDateFilter = () => {
    setFilterDay(null);
  };

  const displayName = user?.name?.trim() || 'Visitante';
  const firstName = displayName.split(/\s+/)[0] ?? displayName;

  return (
    <Screen>
      <View className="px-6 pt-4">
        <View className="overflow-hidden rounded-3xl border border-slate-100/90 bg-white shadow-sm shadow-slate-200/80">
          <View className="border-b border-slate-100 bg-health-cloud px-4 py-4">
            <View className="flex-row items-center justify-between gap-3">
              <View className="min-w-0 flex-1 flex-row items-center gap-3">
                <View className="h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-health-mint shadow-md shadow-emerald-200/50">
                  <Text className="text-lg font-bold text-white" accessibilityLabel={`Iniciais: ${initialsFromName(user?.name)}`}>
                    {initialsFromName(user?.name)}
                  </Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-health-sky">Painel de saúde</Text>
                  <Text className="mt-0.5 text-lg font-bold text-health-navy" numberOfLines={1}>
                    Olá, {firstName}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => void handleLogout()}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
                className="shrink-0 flex-row items-center gap-1.5 rounded-2xl border border-health-navy/10 bg-white px-3.5 py-2.5 active:bg-slate-50"
              >
                <LogOut size={18} color="#0B3C5D" strokeWidth={2.2} />
                <Text className="text-sm font-semibold text-health-navy">Sair</Text>
              </Pressable>
            </View>
          </View>
          <View className="px-4 py-4">
            <Text className="text-xl font-bold text-health-navy">Minhas medições</Text>
            <Text className="mt-2 text-sm leading-5 text-slate-500">
              Transforme suas medições em hábitos saudáveis com recomendações inteligentes.
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0B3C5D" />
        </View>
      ) : (
        <ScrollView className="mt-4 flex-1 px-6" contentContainerStyle={{ paddingBottom: 120 }}>
          {error ? <Text className="mb-4 text-sm text-red-600">{error}</Text> : null}

          {markers.length > 0 ? (
            <View className="mb-4 flex-col gap-2">
              <View className="flex-row flex-wrap items-center gap-2">
                <Pressable
                  onPress={openDateFilter}
                  accessibilityRole="button"
                  accessibilityLabel="Filtrar por data"
                  className="flex-row items-center gap-2 rounded-2xl border border-health-sky/40 bg-white px-4 py-2.5 active:bg-health-cloud"
                >
                  <CalendarRange size={20} color="#328CC1" strokeWidth={2.2} />
                  <Text className="text-sm font-semibold text-health-navy">
                    {filterDay ? formatBrazilDateLocal(filterDay) : 'Filtrar por dia'}
                  </Text>
                </Pressable>
                {filterDay ? (
                  <Pressable
                    onPress={clearDateFilter}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar filtro de data"
                    className="flex-row items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                  >
                    <X size={18} color="#64748b" strokeWidth={2.2} />
                    <Text className="text-sm font-medium text-slate-600">Todos</Text>
                  </Pressable>
                ) : null}
              </View>
              {filterDay ? (
                <Text className="text-xs text-slate-500">
                  Mostrando medições de <Text className="font-semibold text-slate-700">{formatBrazilDateLocal(filterDay)}</Text>
                </Text>
              ) : null}
            </View>
          ) : null}

          {markers.length === 0 ? (
            <View className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6">
              <Text className="text-center text-sm text-slate-600">
                Nenhum dado ainda. Toque no botão + para registrar sono, glicose e frequência cardíaca.
              </Text>
            </View>
          ) : displayedMarkers.length === 0 ? (
            <View className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6">
              <Text className="mb-3 text-center text-sm text-slate-600">
                Nenhuma medição neste dia. Escolha outra data ou toque em &quot;Todos&quot;.
              </Text>
              <PrimaryButton label="Limpar filtro" onPress={clearDateFilter} variant="ghost" className="border-slate-200" />
            </View>
          ) : (
            displayedMarkers.map((item) => <BiomarkerCard key={item.id} biomarker={item} />)
          )}
        </ScrollView>
      )}

      <View className="absolute bottom-8 right-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar biomarcador"
          onPress={() => setModalOpen(true)}
          className="h-14 w-14 items-center justify-center rounded-full bg-health-mint shadow-lg shadow-emerald-300"
        >
          <Plus color="#ffffff" size={28} strokeWidth={2.5} />
        </Pressable>
      </View>

      <AddBiomarkerModal visible={modalOpen} onClose={() => setModalOpen(false)} onCreated={load} />

      {Platform.OS !== 'android' ? (
        <Modal visible={dayPickerOpen} animationType="slide" transparent>
          <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setDayPickerOpen(false)}>
            <Pressable
              className="max-h-[88%] rounded-t-3xl bg-white px-4 pb-8 pt-4"
              onPress={(e) => e.stopPropagation()}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 8 }}
              >
                <Text className="mb-3 text-center text-base font-semibold text-health-navy">Escolher dia</Text>
                {Platform.OS === 'web' ? (
                  <WebDateInput value={pendingDay} onChange={setPendingDay} maximumDate={new Date()} />
                ) : (
                  <View className="min-h-[216px] w-full justify-center">
                    <DateTimePicker
                      value={pendingDay}
                      mode="date"
                      display="spinner"
                      maximumDate={new Date()}
                      onChange={(_, date) => {
                        if (date) {
                          setPendingDay(date);
                        }
                      }}
                      locale="pt-BR"
                      style={{ width: '100%' }}
                    />
                  </View>
                )}
                <View className="mt-4 gap-2">
                  <PrimaryButton label="Aplicar" onPress={applyPickedDay} />
                  <Pressable onPress={() => setDayPickerOpen(false)} className="items-center py-2" accessibilityRole="button">
                    <Text className="text-sm font-semibold text-slate-500">Cancelar</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </Screen>
  );
}

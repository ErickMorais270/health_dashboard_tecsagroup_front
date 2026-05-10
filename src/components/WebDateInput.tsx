import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type Props = {
  value: Date;
  onChange: (d: Date) => void;
  maximumDate: Date;
};

const WEEK_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function localDateAtNoon(y: number, monthIndex: number, day: number): Date {
  return new Date(y, monthIndex, day, 12, 0, 0, 0);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function monthTitlePt(date: Date): string {
  const raw = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function buildMonthGrid(year: number, monthIndex: number): (number | null)[][] {
  const first = new Date(year, monthIndex, 1);
  const pad = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const flat: (number | null)[] = [];
  for (let i = 0; i < pad; i++) {
    flat.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    flat.push(d);
  }
  while (flat.length % 7 !== 0) {
    flat.push(null);
  }

  const rows: (number | null)[][] = [];
  for (let i = 0; i < flat.length; i += 7) {
    rows.push(flat.slice(i, i + 7) as (number | null)[]);
  }

  return rows;
}

function canAdvanceMonth(cursorYear: number, cursorMonthIndex: number, max: Date): boolean {
  const firstOfNext = new Date(cursorYear, cursorMonthIndex + 1, 1);
  const maxDay = startOfDay(max);
  return firstOfNext <= maxDay;
}

/**
 * Calendário mensal para web (substitui o input nativo `type="date"`, que usa o picker feio do navegador).
 */
export function WebDateInput({ value, onChange, maximumDate }: Props): React.JSX.Element | null {
  const [cursorMonth, setCursorMonth] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));

  useEffect(() => {
    setCursorMonth(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [value.getTime()]);

  const maxDay = useMemo(() => startOfDay(maximumDate), [maximumDate]);

  const grid = useMemo(
    () => buildMonthGrid(cursorMonth.getFullYear(), cursorMonth.getMonth()),
    [cursorMonth],
  );

  const showNext = canAdvanceMonth(cursorMonth.getFullYear(), cursorMonth.getMonth(), maximumDate);

  const goPrevMonth = () => {
    setCursorMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    if (!showNext) {
      return;
    }
    setCursorMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const pickDay = (day: number) => {
    const picked = localDateAtNoon(cursorMonth.getFullYear(), cursorMonth.getMonth(), day);
    if (startOfDay(picked) > maxDay) {
      return;
    }
    onChange(picked);
  };

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-health-cloud/90">
      <View className="flex-row items-center justify-between border-b border-slate-100 px-2 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
          hitSlop={8}
          onPress={goPrevMonth}
          className="rounded-xl p-2 active:bg-white"
        >
          <ChevronLeft size={22} color="#0B3C5D" strokeWidth={2.2} />
        </Pressable>
        <Text className="text-base font-semibold capitalize text-health-navy">{monthTitlePt(cursorMonth)}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Próximo mês"
          hitSlop={8}
          onPress={goNextMonth}
          disabled={!showNext}
          className={`rounded-xl p-2 ${showNext ? 'active:bg-white' : 'opacity-30'}`}
        >
          <ChevronRight size={22} color="#0B3C5D" strokeWidth={2.2} />
        </Pressable>
      </View>

      <View className="flex-row px-2 pb-1 pt-2">
        {WEEK_LABELS.map((label, i) => (
          <View key={`${label}-${i}`} className="flex-1 items-center py-1">
            <Text className="text-xs font-semibold text-slate-400">{label}</Text>
          </View>
        ))}
      </View>

      <View className="px-2 pb-3">
        {grid.map((row, ri) => (
          <View key={`row-${ri}`} className="flex-row">
            {row.map((day, di) => {
              const key = `c-${ri}-${di}`;
              if (day === null) {
                return <View key={key} className="aspect-square flex-1 p-0.5" />;
              }

              const cellDate = localDateAtNoon(cursorMonth.getFullYear(), cursorMonth.getMonth(), day);
              const disabled = startOfDay(cellDate) > maxDay;
              const selected = isSameDay(cellDate, value);

              return (
                <View key={key} className="aspect-square flex-1 p-0.5">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Dia ${day}`}
                    accessibilityState={{ disabled, selected }}
                    disabled={disabled}
                    onPress={() => pickDay(day)}
                    className={`flex-1 items-center justify-center rounded-xl border ${
                      selected
                        ? 'border-health-mint bg-health-mint shadow-sm shadow-emerald-200/60'
                        : disabled
                          ? 'border-transparent bg-transparent'
                          : 'border-transparent bg-white active:border-health-sky/40'
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        selected ? 'text-white' : disabled ? 'text-slate-300' : 'text-health-navy'
                      }`}
                    >
                      {day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View className="border-t border-slate-100 bg-white/80 px-4 py-3">
        <Text className="text-center text-xs text-slate-500">
          Toque em um dia para selecionar (até hoje).
        </Text>
      </View>
    </View>
  );
}

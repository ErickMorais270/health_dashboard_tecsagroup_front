import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import type { Edge } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  className?: string;
  edges?: readonly Edge[];
};

export function Screen({ children, className, edges }: Props): React.JSX.Element {
  return (
    <SafeAreaView edges={edges} className={`flex-1 bg-health-cloud ${className ?? ''}`}>
      {children}
    </SafeAreaView>
  );
}

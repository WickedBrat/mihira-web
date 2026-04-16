import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastInput {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastPayload extends ToastInput {
  id: number;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-18)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { colors, isDark } = useTheme();
  const toastAccents: Record<ToastType, string> = {
    success: colors.primaryFixed,
    error: colors.error,
    info: colors.secondaryFixed,
  };

  const hideToast = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -18,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setToast(null);
      }
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 2600 }: ToastInput) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      setToast({
        id: Date.now(),
        type,
        title,
        message,
        duration,
      });
    },
    []
  );

  useEffect(() => {
    if (!toast) return;

    opacity.setValue(0);
    translateY.setValue(-18);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    hideTimeoutRef.current = setTimeout(hideToast, toast.duration);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [hideToast, opacity, toast, translateY]);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  const Icon = toast
    ? toast.type === 'success'
      ? CheckCircle2
      : toast.type === 'error'
        ? AlertCircle
        : Info
    : Info;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {toast ? (
        <View pointerEvents="box-none" className="absolute inset-0">
          <Animated.View
            pointerEvents="box-none"
            className="absolute left-4 right-4 z-[300]"
            style={{
              top: insets.top + 12,
              opacity,
              transform: [{ translateY }],
            }}
          >
            <Pressable onPress={hideToast} className="overflow-hidden rounded-[22px]">
              <BlurView intensity={42} tint={isDark ? 'dark' : 'light'} className="absolute inset-0" />
              <View
                className="flex-row items-start gap-3 border bg-[rgba(250,247,242,0.95)] px-4 py-3.5 dark:bg-[rgba(25,26,26,0.9)]"
                style={{ borderColor: `${toastAccents[toast.type]}55` }}
              >
                <View
                  className="h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${toastAccents[toast.type]}22` }}
                >
                  <Icon size={18} color={toastAccents[toast.type]} />
                </View>

                <View className="flex-1 gap-[3px]">
                  <Text className="font-label text-sm text-on-surface">{toast.title}</Text>
                  {toast.message ? (
                    <Text className="font-body text-xs leading-[18px] text-on-surface-variant">
                      {toast.message}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  return context ?? { showToast: () => undefined };
}

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
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/lib/theme';

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

const TOAST_ACCENTS: Record<ToastType, string> = {
  success: colors.primaryFixed,
  error: colors.error,
  info: colors.secondaryFixed,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-18)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.host,
              {
                top: insets.top + 12,
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <Pressable onPress={hideToast} style={styles.pressable}>
              <BlurView intensity={42} tint="dark" style={StyleSheet.absoluteFill} />
              <View
                style={[
                  styles.toast,
                  {
                    borderColor: `${TOAST_ACCENTS[toast.type]}55`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: `${TOAST_ACCENTS[toast.type]}22`,
                    },
                  ]}
                >
                  <Icon size={18} color={TOAST_ACCENTS[toast.type]} />
                </View>

                <View style={styles.copy}>
                  <Text style={styles.title}>{toast.title}</Text>
                  {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
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

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 300,
  },
  pressable: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(25, 26, 26, 0.9)',
    borderWidth: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onSurface,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
});

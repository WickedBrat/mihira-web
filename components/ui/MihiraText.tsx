import {
  StyleSheet,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { fonts } from '@/lib/theme';

export type MihiraTextProps = {
  bold?: boolean;
  className?: string;
  style?: StyleProp<TextStyle>;
};

export function MihiraText({ bold = false, className, style }: MihiraTextProps) {
  return (
    <Text
      className={className}
      style={[
        styles.word,
        { fontFamily: bold ? fonts.brandBold : fonts.brand },
        style,
      ]}
    >
      Mihira
    </Text>
  );
}

const styles = StyleSheet.create({
  word: {
    letterSpacing: 0,
    textTransform: 'none',
  },
});

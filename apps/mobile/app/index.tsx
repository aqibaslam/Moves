import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@moves/ui';
import {
  darkTheme,
  fontSize,
  lightTheme,
  lineHeight,
  radius,
  space,
} from '@moves/design-tokens';

/**
 * Mirror of the web homepage's proof sheet — same tokens, same Button API,
 * platform-appropriate implementation.
 */
export default function HomeScreen() {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={[
        styles.content,
        // Never hardcode status-bar or home-indicator offsets.
        { paddingBottom: insets.bottom + space[8] },
      ]}
    >
      <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
        SCAFFOLD READY
      </Text>

      <Text style={[styles.title, { color: theme.text }]}>Moves</Text>

      <Text style={[styles.lede, { color: theme.textMuted }]}>
        The same design tokens that drive the web app render this screen. Change
        a value in packages/design-tokens and both platforms follow.
      </Text>

      <View style={styles.actions}>
        <Button size="lg" fullWidth>
          Get started
        </Button>
        <Button size="lg" variant="secondary" fullWidth>
          Read the docs
        </Button>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textMuted }]}>THEME</Text>
        <View style={styles.swatches}>
          {[
            theme.bgMuted,
            theme.border,
            theme.textMuted,
            theme.text,
            theme.accent,
            theme.success,
            theme.danger,
          ].map((c) => (
            <View
              key={c}
              style={[styles.swatch, { backgroundColor: c, borderColor: theme.border }]}
            />
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textMuted }]}>BUTTONS</Text>
        <View style={styles.buttonRow}>
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="danger">
            Danger
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: space[6],
    gap: space[4],
  },
  eyebrow: {
    fontSize: fontSize.xs,
    letterSpacing: 1,
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize['5xl'],
    fontWeight: '700',
    // RN takes lineHeight in px, not a multiplier — a very common bug.
    lineHeight: fontSize['5xl'] * lineHeight.tight,
    letterSpacing: -1,
  },
  lede: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.relaxed,
  },
  actions: {
    gap: space[3],
    marginTop: space[2],
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space[5],
    gap: space[4],
    marginTop: space[2],
  },
  cardTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
});

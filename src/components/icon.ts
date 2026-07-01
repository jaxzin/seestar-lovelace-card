/**
 * Icon-name normalisation shared by the visual primitives.
 *
 * The design prototypes name icons via Material Design Icons CSS classes
 * (`mdi-sync`). Home Assistant instead ships `<ha-icon>`, which expects the
 * `mdi:sync` scheme — so no external icon font needs bundling. {@link haIconName}
 * accepts any of the three forms a caller might hand in (`mdi:sync`, `mdi-sync`,
 * or the bare slug `sync`) and returns the `<ha-icon>` form.
 */

/** The icon collection prefix `<ha-icon>` uses. */
const MDI_SCHEME = 'mdi:';

/** The Material Design Icons CSS class prefix used by the design prototypes. */
const MDI_CLASS_PREFIX = 'mdi-';

/**
 * Normalise an icon reference to the `<ha-icon>` `mdi:<name>` scheme.
 *
 * @example haIconName('mdi-sync') // → 'mdi:sync'
 * @example haIconName('sync')     // → 'mdi:sync'
 * @example haIconName('mdi:sync') // → 'mdi:sync'
 */
export function haIconName(icon: string): string {
  if (icon.startsWith(MDI_SCHEME)) {
    return icon;
  }
  const slug = icon.startsWith(MDI_CLASS_PREFIX) ? icon.slice(MDI_CLASS_PREFIX.length) : icon;
  return `${MDI_SCHEME}${slug}`;
}

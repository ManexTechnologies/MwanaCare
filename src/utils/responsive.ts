/**
 * Responsive utility for React Native (Expo)
 * Provides scaling functions based on screen dimensions.
 * Uses a base width of 375px (iPhone SE/standard phone width).
 */
import { useWindowDimensions, PixelRatio, Platform, ScaledSize } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

let cachedDimensions: ScaledSize | null = null;

/**
 * Get current screen dimensions safely (cached after first call within a render cycle)
 */
function getDimensions(): ScaledSize {
  // Use the hook in components, this is for non-hook fallback
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { width, height, scale: PixelRatio.get(), fontScale: PixelRatio.getFontScale() };
  }
  return { width: BASE_WIDTH, height: BASE_HEIGHT, scale: 1, fontScale: 1 };
}

/**
 * Hook to get responsive screen info.
 * Use this in all components instead of raw useWindowDimensions.
 */
export function useScreenDimensions() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const widthScale = screenWidth / BASE_WIDTH;
  const heightScale = screenHeight / BASE_HEIGHT;
  const avgScale = Math.min(widthScale, heightScale);

  const isSmallDevice = screenWidth < 360;
  const isTablet = screenWidth >= 768;
  const isLargePhone = screenWidth >= 414;

  return {
    screenWidth,
    screenHeight,
    widthScale,
    heightScale,
    avgScale,
    isSmallDevice,
    isTablet,
    isLargePhone,
  };
}

/**
 * Scale a size linearly based on screen width (for layouts, padding, margins, heights)
 * @param size - The size at 375px base width
 */
export function scale(size: number): number {
  const { width } = typeof window !== 'undefined'
    ? { width: window.innerWidth }
    : { width: BASE_WIDTH };
  const scaleFactor = width / BASE_WIDTH;
  return Math.round(size * Math.min(scaleFactor, 1.5)); // cap at 1.5x for large screens
}

/**
 * Moderate scale - scales more gently for larger screens (good for icons, buttons)
 * @param size - The size at 375px base width
 * @param factor - How much scaling to apply (0 = no scaling, 1 = full linear scaling)
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  const { width } = typeof window !== 'undefined'
    ? { width: window.innerWidth }
    : { width: BASE_WIDTH };
  const scaleFactor = width / BASE_WIDTH;
  return Math.round(size + (scaleFactor - 1) * size * Math.min(factor, 1));
}

/**
 * Responsive font size - scales fonts but keeps them readable
 * Uses moderate scaling for better typography across devices
 */
export function rfValue(size: number): number {
  const { width } = typeof window !== 'undefined'
    ? { width: window.innerWidth }
    : { width: BASE_WIDTH };
  const scaleFactor = width / BASE_WIDTH;
  // Moderate scale with factor 0.3 for fonts (less aggressive than layouts)
  const newSize = size + (scaleFactor - 1) * size * 0.3;
  // Round to nearest 0.5 for cleaner values
  return Math.round(newSize * 2) / 2;
}

/**
 * Get responsive horizontal padding for screens
 */
export function getHorizontalPadding(): number {
  const { width } = typeof window !== 'undefined'
    ? { width: window.innerWidth }
    : { width: BASE_WIDTH };
  if (width >= 768) return 32;
  if (width >= 414) return 20;
  if (width <= 360) return 12;
  return 16;
}

/**
 * Get responsive gap for grid/flex layouts
 */
export function getGridGap(): number {
  const { width } = typeof window !== 'undefined'
    ? { width: window.innerWidth }
    : { width: BASE_WIDTH };
  if (width >= 414) return 14;
  if (width <= 360) return 8;
  return 12;
}

/**
 * Determine if the app is running on web
 */
export function isWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Determine if the current device is iOS
 */
export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

/**
 * Determine if the current device is Android
 */
export function isAndroid(): boolean {
  return Platform.OS === 'android';
}


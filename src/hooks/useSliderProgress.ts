export function sliderProgressStyle(
  value: number,
  min: number,
  max: number,
): React.CSSProperties {
  const progress = ((value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, var(--color-app-accent) 0%, var(--color-app-accent) ${progress}%, #DDDDDD ${progress}%, #DDDDDD 100%)`,
  }
}

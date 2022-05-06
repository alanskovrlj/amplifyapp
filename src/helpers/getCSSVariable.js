export default function getCSSVariable(variable) {
  if (typeof window !== 'undefined') {
    return window.getComputedStyle(document.documentElement).getPropertyValue(variable);
  }
}

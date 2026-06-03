export type TooltipPlacement = "top" | "bottom";

export type TooltipPosition = {
  left: number;
  top: number;
  placement: TooltipPlacement;
};

const VIEWPORT_MARGIN = 8;
const TOOLTIP_GAP = 8;

export function calculateTooltipPosition(
  triggerRect: Pick<DOMRect, "left" | "right" | "top" | "bottom" | "width">,
  tooltipSize: { width: number; height: number },
  viewport: { width: number; height: number },
): TooltipPosition {
  const maxLeft = Math.max(VIEWPORT_MARGIN, viewport.width - tooltipSize.width - VIEWPORT_MARGIN);
  const centeredLeft = triggerRect.left + triggerRect.width / 2 - tooltipSize.width / 2;
  const left = clamp(centeredLeft, VIEWPORT_MARGIN, maxLeft);
  const topPosition = triggerRect.top - tooltipSize.height - TOOLTIP_GAP;

  if (topPosition >= VIEWPORT_MARGIN) {
    return { left, top: topPosition, placement: "top" };
  }

  const bottomPosition = triggerRect.bottom + TOOLTIP_GAP;
  const maxTop = Math.max(VIEWPORT_MARGIN, viewport.height - tooltipSize.height - VIEWPORT_MARGIN);
  return { left, top: clamp(bottomPosition, VIEWPORT_MARGIN, maxTop), placement: "bottom" };
}

export function setupAutoTooltip(root: Document = document) {
  const tooltip = root.createElement("div");
  tooltip.className = "floating-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-hidden", "true");
  root.body.appendChild(tooltip);

  let activeTarget: HTMLElement | null = null;

  function show(target: HTMLElement) {
    const text = target.dataset.tooltip;
    if (!text) return;

    activeTarget = target;
    tooltip.textContent = text;
    tooltip.setAttribute("aria-hidden", "false");
    tooltip.classList.add("visible");
    positionTooltip();
  }

  function hide(target?: HTMLElement | null) {
    if (target && activeTarget !== target) return;
    activeTarget = null;
    tooltip.classList.remove("visible");
    tooltip.setAttribute("aria-hidden", "true");
  }

  function positionTooltip() {
    if (!activeTarget) return;
    const triggerRect = activeTarget.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const position = calculateTooltipPosition(
      triggerRect,
      { width: tooltipRect.width, height: tooltipRect.height },
      { width: window.innerWidth, height: window.innerHeight },
    );

    tooltip.style.left = `${position.left}px`;
    tooltip.style.top = `${position.top}px`;
    tooltip.dataset.placement = position.placement;
  }

  function findTooltipTarget(event: Event) {
    return event.target instanceof Element ? event.target.closest<HTMLElement>("[data-tooltip]") : null;
  }

  function handlePointerOver(event: Event) {
    const target = findTooltipTarget(event);
    if (target) show(target);
  }

  function handlePointerOut(event: Event) {
    const target = findTooltipTarget(event);
    if (target) hide(target);
  }

  function handleFocusIn(event: Event) {
    const target = findTooltipTarget(event);
    if (target) show(target);
  }

  function handleFocusOut(event: Event) {
    const target = findTooltipTarget(event);
    if (target) hide(target);
  }

  root.addEventListener("pointerover", handlePointerOver);
  root.addEventListener("pointerout", handlePointerOut);
  root.addEventListener("focusin", handleFocusIn);
  root.addEventListener("focusout", handleFocusOut);
  window.addEventListener("resize", positionTooltip);
  window.addEventListener("scroll", positionTooltip, true);

  return () => {
    root.removeEventListener("pointerover", handlePointerOver);
    root.removeEventListener("pointerout", handlePointerOut);
    root.removeEventListener("focusin", handleFocusIn);
    root.removeEventListener("focusout", handleFocusOut);
    window.removeEventListener("resize", positionTooltip);
    window.removeEventListener("scroll", positionTooltip, true);
    tooltip.remove();
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

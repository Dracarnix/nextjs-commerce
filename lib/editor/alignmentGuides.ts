export interface Guide {
  type: 'vertical' | 'horizontal';
  value: number;
}

export interface ElementBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SNAP_DISTANCE = 10;

export function getAlignmentGuides(
  draggingElement: ElementBounds,
  otherElements: ElementBounds[]
): Guide[] {
  const guides: Guide[] = [];

  otherElements.forEach((el) => {
    // Vertical alignments
    if (Math.abs(draggingElement.x - el.x) < SNAP_DISTANCE) {
      guides.push({ type: 'vertical', value: el.x });
    }
    if (Math.abs(draggingElement.x + draggingElement.width - (el.x + el.width)) < SNAP_DISTANCE) {
      guides.push({ type: 'vertical', value: el.x + el.width - draggingElement.width });
    }
    if (
      Math.abs(
        draggingElement.x + draggingElement.width / 2 - (el.x + el.width / 2)
      ) < SNAP_DISTANCE
    ) {
      guides.push({
        type: 'vertical',
        value: el.x + el.width / 2 - draggingElement.width / 2,
      });
    }

    // Horizontal alignments
    if (Math.abs(draggingElement.y - el.y) < SNAP_DISTANCE) {
      guides.push({ type: 'horizontal', value: el.y });
    }
    if (Math.abs(draggingElement.y + draggingElement.height - (el.y + el.height)) < SNAP_DISTANCE) {
      guides.push({
        type: 'horizontal',
        value: el.y + el.height - draggingElement.height,
      });
    }
    if (
      Math.abs(
        draggingElement.y + draggingElement.height / 2 - (el.y + el.height / 2)
      ) < SNAP_DISTANCE
    ) {
      guides.push({
        type: 'horizontal',
        value: el.y + el.height / 2 - draggingElement.height / 2,
      });
    }
  });

  return guides;
}

export function snapToGuides(
  element: ElementBounds,
  guides: Guide[]
): { x: number; y: number } {
  let x = element.x;
  let y = element.y;

  guides.forEach((guide) => {
    if (guide.type === 'vertical') {
      x = guide.value;
    } else {
      y = guide.value;
    }
  });

  return { x, y };
}

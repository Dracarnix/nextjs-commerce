import type { PageLayout, EditorElement } from './types';

export function generateComponentCode(page: PageLayout): string {
  const elementCode = generateElementsCode(page.elements);

  return `'use client';

import React from 'react';

export default function ${toPascalCase(page.slug)}() {
  return (
    <main className="w-full min-h-screen bg-yellow-400">
      ${elementCode}
    </main>
  );
}
`;
}

function generateElementsCode(elements: EditorElement[], indent = 6): string {
  return elements
    .map((el) => generateElementCode(el, indent))
    .join('\n');
}

function generateElementCode(element: EditorElement, indent: number): string {
  const spaces = ' '.repeat(indent);
  const styles = generateStyles(element);
  const styleAttr = styles ? ` className="${styles}"` : '';

  switch (element.type) {
    case 'text':
      return `${spaces}<${getTextTag(element)}${styleAttr}>${element.content}</${getTextTag(element)}>`;

    case 'rectangle':
    case 'shape':
      return `${spaces}<div${styleAttr}></div>`;

    case 'button':
      return `${spaces}<button${styleAttr}>${element.content}</button>`;

    case 'link':
      return `${spaces}<a href="${element.href || '#'}"${styleAttr}>${element.content}</a>`;

    case 'image':
      return `${spaces}<img src="${element.src || ''}" alt="" style={{ width: '${element.width}px', height: '${element.height}px' }} />`;

    case 'frame':
      return `${spaces}<div${styleAttr}></div>`;

    case 'navbar':
      return `${spaces}<nav${styleAttr}></nav>`;

    case 'spacer':
      return `${spaces}<div${styleAttr}></div>`;

    default:
      return '';
  }
}

function getTextTag(element: EditorElement): string {
  if (element.content?.toLowerCase().includes('heading')) return 'h1';
  if (element.type === 'link') return 'a';
  return 'p';
}

function generateStyles(element: EditorElement): string {
  const classes: string[] = [];

  // Position and sizing
  classes.push(`absolute`);
  classes.push(`left-[${Math.round(element.x)}px]`);
  classes.push(`top-[${Math.round(element.y)}px]`);

  if (element.width) classes.push(`w-[${Math.round(element.width)}px]`);
  if (element.height) classes.push(`h-[${Math.round(element.height)}px]`);

  // Colors
  if (element.backgroundColor) {
    classes.push(`bg-[${element.backgroundColor}]`);
  }
  if (element.color) {
    classes.push(`text-[${element.color}]`);
  }

  // Text styling
  if (element.fontSize) {
    classes.push(`text-[${element.fontSize}px]`);
  }
  if (element.fontWeight === 'bold') classes.push('font-bold');
  if (element.fontStyle === 'italic') classes.push('italic');

  // Text alignment
  if (element.textAlign === 'center') classes.push('text-center');
  if (element.textAlign === 'right') classes.push('text-right');

  // Opacity
  if (element.opacity && element.opacity < 1) {
    classes.push(`opacity-${Math.round(element.opacity * 100)}`);
  }

  // Border
  if (element.borderWidth) {
    classes.push(`border`);
    if (element.borderColor) {
      classes.push(`border-[${element.borderColor}]`);
    }
  }

  if (element.borderRadius) {
    classes.push(`rounded-[${element.borderRadius}px]`);
  }

  return classes.filter(Boolean).join(' ');
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

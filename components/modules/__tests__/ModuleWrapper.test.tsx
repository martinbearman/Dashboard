import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import ModuleWrapper from '../ModuleWrapper';

describe('ModuleWrapper', () => {
  it('renders children correctly', () => {
    render(
      <ModuleWrapper moduleId="test-module-1" gridPosition={{ x: 0, y: 0, w: 12, h: 1 }}>
        <div>Test Content</div>
      </ModuleWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with different moduleIds', () => {
    const { rerender } = render(
      <ModuleWrapper moduleId="module-1" gridPosition={{ x: 1, y: 0, w: 6, h: 1 }}>
        <div>Content 1</div>
      </ModuleWrapper>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    rerender(
      <ModuleWrapper moduleId="module-2" gridPosition={{ x: 7, y: 0, w: 5, h: 1 }}>
        <div>Content 2</div>
      </ModuleWrapper>
    );

    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});


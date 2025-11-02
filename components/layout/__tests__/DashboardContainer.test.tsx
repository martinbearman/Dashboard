import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import DashboardContainer from '../DashboardContainer';

describe('DashboardContainer', () => {
  it('renders children correctly', () => {
    render(
      <DashboardContainer>
        <div>Dashboard Content</div>
      </DashboardContainer>
    );

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <DashboardContainer>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </DashboardContainer>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });
});


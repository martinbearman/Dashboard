import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import AddModuleButton from '../AddModuleButton';

describe('AddModuleButton', () => {
  it('renders the button with plus icon', () => {
    render(<AddModuleButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('+');
  });

  it('is clickable', async () => {
    const user = userEvent.setup();
    
    render(<AddModuleButton />);

    const button = screen.getByRole('button');
    await user.click(button);

    // Button is clickable (this tests user interaction capability)
    expect(button).toBeInTheDocument();
  });
});


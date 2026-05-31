import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import Contact_Form from './Contact_Form';

describe('Property Tests: Contact_Form', () => {
  /**
   * **Validates: Requirements 7.3**
   * 
   * Property 9: Contact Form Input Acceptance
   * For any valid input string entered into a Contact_Form field,
   * the form field value should update to reflect that input.
   */
  it('Property 9: Contact Form Input Acceptance - name field', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (inputValue) => {
          const mockOnSubmit = vi.fn();
          const { unmount } = render(<Contact_Form onSubmit={mockOnSubmit} />);
          
          const nameInput = screen.getByLabelText(/name/i);
          
          fireEvent.change(nameInput, { target: { value: inputValue } });
          
          expect(nameInput.value).toBe(inputValue);
          
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('Property 9: Contact Form Input Acceptance - email field', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (inputValue) => {
          const mockOnSubmit = vi.fn();
          const { unmount } = render(<Contact_Form onSubmit={mockOnSubmit} />);
          
          const emailInput = screen.getByLabelText(/email/i);
          
          fireEvent.change(emailInput, { target: { value: inputValue } });
          
          // Email inputs trim whitespace, so we need to account for that
          expect(emailInput.value).toBe(inputValue.trim());
          
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('Property 9: Contact Form Input Acceptance - phone field', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (inputValue) => {
          const mockOnSubmit = vi.fn();
          const { unmount } = render(<Contact_Form onSubmit={mockOnSubmit} />);
          
          const phoneInput = screen.getByLabelText(/phone/i);
          
          fireEvent.change(phoneInput, { target: { value: inputValue } });
          
          expect(phoneInput.value).toBe(inputValue);
          
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('Property 9: Contact Form Input Acceptance - message field', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (inputValue) => {
          const mockOnSubmit = vi.fn();
          const { unmount } = render(<Contact_Form onSubmit={mockOnSubmit} />);
          
          const messageInput = screen.getByLabelText(/message/i);
          
          fireEvent.change(messageInput, { target: { value: inputValue } });
          
          expect(messageInput.value).toBe(inputValue);
          
          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

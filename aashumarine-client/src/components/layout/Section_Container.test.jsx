import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Section_Container from './Section_Container';

describe('Section_Container', () => {
  it('renders children when provided', () => {
    render(
      <Section_Container>
        <div data-testid="test-child">Test Content</div>
      </Section_Container>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders heading when provided', () => {
    render(
      <Section_Container heading="Test Heading">
        <div>Content</div>
      </Section_Container>
    );
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Heading');
  });

  it('renders subheading when provided', () => {
    render(
      <Section_Container subheading="Test Subheading">
        <div>Content</div>
      </Section_Container>
    );
    
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
  });

  it('renders both heading and subheading when both are provided', () => {
    render(
      <Section_Container heading="Main Heading" subheading="Sub Heading">
        <div>Content</div>
      </Section_Container>
    );
    
    expect(screen.getByText('Main Heading')).toBeInTheDocument();
    expect(screen.getByText('Sub Heading')).toBeInTheDocument();
  });

  it('does not render heading when not provided', () => {
    render(
      <Section_Container>
        <div>Content</div>
      </Section_Container>
    );
    
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('does not render subheading when not provided', () => {
    const { container } = render(
      <Section_Container heading="Only Heading">
        <div>Content</div>
      </Section_Container>
    );
    
    const subheading = container.querySelector('.section-subheading');
    expect(subheading).not.toBeInTheDocument();
  });

  it('renders only children when no heading or subheading provided', () => {
    render(
      <Section_Container>
        <div data-testid="only-child">Only Content</div>
      </Section_Container>
    );
    
    expect(screen.getByTestId('only-child')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders multiple children correctly', () => {
    render(
      <Section_Container heading="Multiple Children">
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </Section_Container>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <Section_Container heading="Test" subheading="Test Sub">
        <div>Content</div>
      </Section_Container>
    );
    
    expect(container.querySelector('.section-container')).toBeInTheDocument();
    expect(container.querySelector('.section-content')).toBeInTheDocument();
    expect(container.querySelector('.section-heading')).toBeInTheDocument();
    expect(container.querySelector('.section-subheading')).toBeInTheDocument();
    expect(container.querySelector('.section-children')).toBeInTheDocument();
  });

  it('renders as a section element', () => {
    const { container } = render(
      <Section_Container>
        <div>Content</div>
      </Section_Container>
    );
    
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('handles empty heading string gracefully', () => {
    render(
      <Section_Container heading="" subheading="Test Subheading">
        <div data-testid="test-child">Content</div>
      </Section_Container>
    );
    
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('handles empty subheading string gracefully', () => {
    const { container } = render(
      <Section_Container heading="Test Heading" subheading="">
        <div data-testid="test-child">Content</div>
      </Section_Container>
    );
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(container.querySelector('.section-subheading')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('handles both empty heading and subheading strings', () => {
    const { container } = render(
      <Section_Container heading="" subheading="">
        <div data-testid="test-child">Only Content</div>
      </Section_Container>
    );
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(container.querySelector('.section-subheading')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});

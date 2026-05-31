import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FilterPanel from './FilterPanel';

// Helper to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FilterPanel Component', () => {
  const mockCategories = ['Diesel', 'Gasoline', 'Electric'];
  const mockManufacturers = ['Caterpillar', 'Cummins', 'Volvo'];
  const mockOnCategoryChange = vi.fn();
  const mockOnManufacturerChange = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.innerWidth for mobile/desktop tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('renders filter panel with all controls', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByLabelText(/filter by engine type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by manufacturer/i)).toBeInTheDocument();
  });

  it('displays all categories in dropdown', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    const categorySelect = screen.getByLabelText(/filter by engine type/i);
    mockCategories.forEach((category) => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument();
    });
  });

  it('displays all manufacturers in dropdown', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    const manufacturerSelect = screen.getByLabelText(/filter by manufacturer/i);
    mockManufacturers.forEach((manufacturer) => {
      expect(screen.getByRole('option', { name: manufacturer })).toBeInTheDocument();
    });
  });

  it('calls onCategoryChange with debounce when category is selected', async () => {
    vi.useFakeTimers();
    
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    const categorySelect = screen.getByLabelText(/filter by engine type/i);
    fireEvent.change(categorySelect, { target: { value: 'Diesel' } });

    // Should not call immediately
    expect(mockOnCategoryChange).not.toHaveBeenCalled();

    // Fast-forward 300ms and flush promises
    await vi.advanceTimersByTimeAsync(300);

    // Should call after debounce
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Diesel');

    vi.useRealTimers();
  });

  it('calls onManufacturerChange with debounce when manufacturer is selected', async () => {
    vi.useFakeTimers();
    
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    const manufacturerSelect = screen.getByLabelText(/filter by manufacturer/i);
    fireEvent.change(manufacturerSelect, { target: { value: 'Caterpillar' } });

    // Should not call immediately
    expect(mockOnManufacturerChange).not.toHaveBeenCalled();

    // Fast-forward 300ms and flush promises
    await vi.advanceTimersByTimeAsync(300);

    // Should call after debounce
    expect(mockOnManufacturerChange).toHaveBeenCalledWith('Caterpillar');

    vi.useRealTimers();
  });

  it('displays active filter count badge when filters are selected', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory="Diesel"
        selectedManufacturer="Caterpillar"
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText(/2 active filters/i)).toBeInTheDocument();
  });

  it('displays clear filters button when filters are active', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory="Diesel"
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
  });

  it('does not display clear filters button when no filters are active', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.queryByRole('button', { name: /clear all filters/i })).not.toBeInTheDocument();
  });

  it('calls onReset when clear filters button is clicked', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory="Diesel"
        selectedManufacturer="Caterpillar"
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(clearButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('displays toggle button on mobile viewport', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    // Trigger resize event
    fireEvent(window, new Event('resize'));

    // Wait for state update
    waitFor(() => {
      expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
    });
  });

  it('toggles filter panel on mobile when toggle button is clicked', async () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { rerender } = renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    // Trigger resize event to set mobile state
    await act(async () => {
      fireEvent(window, new Event('resize'));
    });

    // Wait for the toggle button to appear
    const toggleButton = await screen.findByRole('button', { name: /filters/i });
    expect(toggleButton).toBeInTheDocument();

    // Check initial state (not collapsed by default)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Click to collapse
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays filter badge on mobile toggle button when filters are active', async () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory="Diesel"
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    // Trigger resize event
    await act(async () => {
      fireEvent(window, new Event('resize'));
    });

    // Wait for badge to appear
    const badge = await screen.findByLabelText(/1 active filter/i);
    expect(badge).toBeInTheDocument();
  });

  it('debounces multiple rapid filter changes', async () => {
    vi.useFakeTimers();
    
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    const categorySelect = screen.getByLabelText(/filter by engine type/i);
    
    // Rapid changes
    fireEvent.change(categorySelect, { target: { value: 'Diesel' } });
    await vi.advanceTimersByTimeAsync(100);
    fireEvent.change(categorySelect, { target: { value: 'Gasoline' } });
    await vi.advanceTimersByTimeAsync(100);
    fireEvent.change(categorySelect, { target: { value: 'Electric' } });

    // Should not have called yet
    expect(mockOnCategoryChange).not.toHaveBeenCalled();

    // Fast-forward to complete debounce
    await vi.advanceTimersByTimeAsync(300);

    // Should only call once with the last value
    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Electric');

    vi.useRealTimers();
  });

  it('has proper ARIA labels for accessibility', () => {
    renderWithRouter(
      <FilterPanel
        categories={mockCategories}
        manufacturers={mockManufacturers}
        selectedCategory=""
        selectedManufacturer=""
        onCategoryChange={mockOnCategoryChange}
        onManufacturerChange={mockOnManufacturerChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByRole('region', { name: /product filters/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by engine type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by manufacturer/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadsPage } from './LeadsPage';
import { leadService } from '../services/leadService';
import { ToastContext } from '../components/common/Toast';

// Mock the leadService
vi.mock('../services/leadService', () => ({
  leadService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock useToast hook
const mockShowToast = vi.fn();
const mockToastContextValue = {
  showToast: mockShowToast,
};

const renderWithToast = (component) => {
  return render(
    <ToastContext.Provider value={mockToastContextValue}>
      {component}
    </ToastContext.Provider>
  );
};

describe('LeadsPage', () => {
  const mockLeads = [
    {
      lead_id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0101',
      message: 'Interested in marine GPS',
      source: 'website',
      status: 'new',
      created_at: '2024-02-05T09:15:00Z',
    },
    {
      lead_id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0102',
      message: 'Need VHF radio',
      source: 'email',
      status: 'contacted',
      created_at: '2024-02-04T14:30:00Z',
    },
  ];

  const mockResponse = {
    leads: mockLeads,
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    leadService.getAll.mockResolvedValue(mockResponse);
  });

  it('should render the page title', async () => {
    renderWithToast(<LeadsPage />);
    
    expect(screen.getByRole('heading', { name: /contact leads/i })).toBeInTheDocument();
  });

  it('should fetch and display leads on mount', async () => {
    renderWithToast(<LeadsPage />);
    
    await waitFor(() => {
      expect(leadService.getAll).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('should render search input', () => {
    renderWithToast(<LeadsPage />);
    
    const searchInput = screen.getByPlaceholderText(/search by name or email/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should render status filter dropdown', () => {
    renderWithToast(<LeadsPage />);
    
    const statusFilter = screen.getByRole('combobox', { name: '' });
    expect(statusFilter).toBeInTheDocument();
  });

  it('should filter leads by search query', async () => {
    const user = userEvent.setup();
    renderWithToast(<LeadsPage />);
    
    const searchInput = screen.getByPlaceholderText(/search by name or email/i);
    await user.type(searchInput, 'john');
    
    await waitFor(() => {
      expect(leadService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'john' })
      );
    });
  });

  it('should display View Details and Delete buttons for each lead', async () => {
    renderWithToast(<LeadsPage />);
    
    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: /view details/i });
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      
      expect(viewButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  it('should open details modal when View Details is clicked', async () => {
    const user = userEvent.setup();
    leadService.getById.mockResolvedValue(mockLeads[0]);
    
    renderWithToast(<LeadsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButton = screen.getAllByRole('button', { name: /view details/i })[0];
    await user.click(viewButton);
    
    await waitFor(() => {
      expect(leadService.getById).toHaveBeenCalledWith(1);
      expect(screen.getByText(/lead details/i)).toBeInTheDocument();
    });
  });

  it('should open confirm dialog when Delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithToast(<LeadsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    await user.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
  });

  it('should update lead status when status dropdown changes', async () => {
    const user = userEvent.setup();
    leadService.updateStatus.mockResolvedValue({ ...mockLeads[0], status: 'contacted' });
    
    renderWithToast(<LeadsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const statusDropdowns = screen.getAllByRole('combobox');
    const leadStatusDropdown = statusDropdowns.find(dropdown => 
      dropdown.value === 'new'
    );
    
    if (leadStatusDropdown) {
      await user.selectOptions(leadStatusDropdown, 'contacted');
      
      await waitFor(() => {
        expect(leadService.updateStatus).toHaveBeenCalledWith(1, 'contacted');
      });
    }
  });

  it('should show error toast when fetching leads fails', async () => {
    leadService.getAll.mockRejectedValue(new Error('Network error'));
    
    renderWithToast(<LeadsPage />);
    
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Network error',
        'error'
      );
    });
  });

  it('should show loading spinner while fetching data', () => {
    leadService.getAll.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithToast(<LeadsPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

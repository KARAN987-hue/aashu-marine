import { describe, it, expect, beforeEach } from 'vitest';
import { leadService } from './leadService';

describe('leadService', () => {
  describe('getAll', () => {
    it('should return all leads with default pagination', async () => {
      const result = await leadService.getAll();
      
      expect(result).toHaveProperty('leads');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.leads)).toBe(true);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should filter leads by status', async () => {
      const result = await leadService.getAll({ status: 'new' });
      
      expect(result.leads.every(lead => lead.status === 'new')).toBe(true);
    });

    it('should filter leads by search query', async () => {
      const result = await leadService.getAll({ search: 'james' });
      
      expect(result.leads.length).toBeGreaterThan(0);
      expect(
        result.leads.some(lead => 
          lead.name.toLowerCase().includes('james') || 
          lead.email.toLowerCase().includes('james')
        )
      ).toBe(true);
    });

    it('should paginate results correctly', async () => {
      const page1 = await leadService.getAll({ page: 1, limit: 5 });
      const page2 = await leadService.getAll({ page: 2, limit: 5 });
      
      expect(page1.leads.length).toBeLessThanOrEqual(5);
      expect(page2.leads.length).toBeLessThanOrEqual(5);
      expect(page1.leads[0].lead_id).not.toBe(page2.leads[0]?.lead_id);
    });

    it('should sort leads by name', async () => {
      const result = await leadService.getAll({ sort_by: 'name', sort_order: 'asc' });
      
      const names = result.leads.map(l => l.name.toLowerCase());
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });
  });

  describe('getById', () => {
    it('should return a lead by id', async () => {
      const lead = await leadService.getById(1);
      
      expect(lead).toBeDefined();
      expect(lead.lead_id).toBe(1);
      expect(lead).toHaveProperty('name');
      expect(lead).toHaveProperty('email');
    });

    it('should throw error for non-existent lead', async () => {
      await expect(leadService.getById(99999)).rejects.toThrow('Lead not found');
    });
  });

  describe('updateStatus', () => {
    it('should update lead status', async () => {
      const updatedLead = await leadService.updateStatus(1, 'contacted');
      
      expect(updatedLead.status).toBe('contacted');
      expect(updatedLead.lead_id).toBe(1);
    });

    it('should throw error for invalid status', async () => {
      await expect(leadService.updateStatus(1, 'invalid')).rejects.toThrow('Invalid status value');
    });

    it('should throw error for non-existent lead', async () => {
      await expect(leadService.updateStatus(99999, 'contacted')).rejects.toThrow('Lead not found');
    });

    it('should accept all valid status values', async () => {
      const validStatuses = ['new', 'contacted', 'converted', 'closed'];
      
      for (const status of validStatuses) {
        const result = await leadService.updateStatus(1, status);
        expect(result.status).toBe(status);
      }
    });
  });

  describe('delete', () => {
    it('should delete a lead', async () => {
      const result = await leadService.delete(1);
      
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw error for non-existent lead', async () => {
      await expect(leadService.delete(99999)).rejects.toThrow('Lead not found');
    });
  });
});

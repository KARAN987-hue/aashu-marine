import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoPreview } from './VideoPreview';

describe('VideoPreview', () => {
  it('renders video element with correct src', () => {
    const src = 'test-video.mp4';
    render(<VideoPreview src={src} />);
    
    const video = screen.getByRole('application');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', src);
  });

  it('renders with custom alt text', () => {
    const alt = 'Custom video description';
    render(<VideoPreview src="test.mp4" alt={alt} />);
    
    const video = screen.getByRole('application');
    expect(video).toBeInTheDocument();
  });

  it('shows remove button by default', () => {
    render(<VideoPreview src="test.mp4" />);
    
    const removeButton = screen.getByRole('button', { name: /remove video/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('hides remove button when showRemove is false', () => {
    render(<VideoPreview src="test.mp4" showRemove={false} />);
    
    const removeButton = screen.queryByRole('button', { name: /remove video/i });
    expect(removeButton).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<VideoPreview src="test.mp4" onRemove={onRemove} />);
    
    const removeButton = screen.getByRole('button', { name: /remove video/i });
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('displays error message when video fails to load', () => {
    render(<VideoPreview src="invalid-video.mp4" />);
    
    const video = screen.getByRole('application');
    fireEvent.error(video);
    
    expect(screen.getByText('Unable to load video')).toBeInTheDocument();
  });

  it('does not show remove button in error state', () => {
    render(<VideoPreview src="invalid-video.mp4" />);
    
    const video = screen.getByRole('application');
    fireEvent.error(video);
    
    const removeButton = screen.queryByRole('button', { name: /remove video/i });
    expect(removeButton).not.toBeInTheDocument();
  });

  it('has controls attribute for video playback', () => {
    render(<VideoPreview src="test.mp4" />);
    
    const video = screen.getByRole('application');
    expect(video).toHaveAttribute('controls');
  });

  it('has preload metadata attribute', () => {
    render(<VideoPreview src="test.mp4" />);
    
    const video = screen.getByRole('application');
    expect(video).toHaveAttribute('preload', 'metadata');
  });
});

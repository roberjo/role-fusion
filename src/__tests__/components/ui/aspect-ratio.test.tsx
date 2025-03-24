import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AspectRatio } from '../../../components/ui/aspect-ratio';

describe('AspectRatio', () => {
  it('should render with default ratio', () => {
    const { container } = render(
      <AspectRatio>
        <img src="test.jpg" alt="test" />
      </AspectRatio>
    );
    
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('relative');
  });

  it('should render with custom ratio', () => {
    const { container } = render(
      <AspectRatio ratio={16/9}>
        <img src="test.jpg" alt="test" />
      </AspectRatio>
    );
    
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveStyle({
      paddingBottom: '56.25%'
    });
  });

  it('should render children', () => {
    const { getByAltText } = render(
      <AspectRatio>
        <img src="test.jpg" alt="test image" />
      </AspectRatio>
    );
    
    expect(getByAltText('test image')).toBeInTheDocument();
  });

  it('should maintain aspect ratio styles', () => {
    const { container } = render(
      <AspectRatio ratio={4/3}>
        <div>Content</div>
      </AspectRatio>
    );
    
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('relative');
    expect(root).toHaveStyle({
      paddingBottom: '75%'
    });
  });
}); 
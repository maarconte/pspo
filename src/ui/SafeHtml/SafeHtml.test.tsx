import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SafeHtml from './SafeHtml';

describe('SafeHtml', () => {
  it('renders allowed formatting tags', () => {
    const { container } = render(
      <SafeHtml html="Some text <i>emphasis</i> and a <br> line break." />
    );
    expect(container.querySelector('i')?.textContent).toBe('emphasis');
    expect(container.querySelector('br')).toBeInTheDocument();
  });

  it('renders links and forces rel="noopener noreferrer" on target="_blank"', () => {
    const { container } = render(
      <SafeHtml html="<a href='https://scrum.org' target='_blank'>Source</a>" />
    );
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://scrum.org');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('strips disallowed tags and attributes (e.g. script, event handlers)', () => {
    const malicious =
      "<script>alert('xss')</script><i onclick=\"alert('xss')\">text</i>";
    const { container } = render(<SafeHtml html={malicious} />);
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.innerHTML).not.toContain('onclick');
    expect(container.querySelector('i')?.textContent).toBe('text');
  });

  it('applies the given className to the wrapper', () => {
    const { container } = render(<SafeHtml html="text" className="feedback-text" />);
    expect(container.querySelector('span.feedback-text')).toBeInTheDocument();
  });
});

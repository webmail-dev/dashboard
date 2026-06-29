import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import mermaid from 'mermaid';
import './style.css';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window === 'undefined') return;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'dark'
    });

    const renderMermaid = async () => {
      const blocks = document.querySelectorAll<HTMLElement>('div.language-mermaid');

      for (const block of blocks) {
        if (block.dataset.rendered === 'true') continue;

        const code = block.querySelector('code')?.textContent?.trim();
        if (!code) continue;

        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const container = document.createElement('div');
        container.className = 'mermaid-rendered';

        try {
          const { svg } = await mermaid.render(id, code);
          container.innerHTML = svg;
          block.replaceWith(container);
        } catch (error) {
          block.dataset.rendered = 'true';
          block.classList.add('mermaid-error');
          console.error('Mermaid render failed', error);
        }
      }
    };

    router.onAfterRouteChanged = () => {
      window.setTimeout(() => void renderMermaid(), 0);
    };

    window.addEventListener('load', () => {
      void renderMermaid();
    });
  }
};

export default theme;

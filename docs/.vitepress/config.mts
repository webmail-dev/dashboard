import { defineConfig } from 'vitepress';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = dirname(dirname(fileURLToPath(import.meta.url)));

interface SidebarItem {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
}

function humanize(value: string): string {
  return value
    .replace(/\.md$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readTitle(filePath: string): string {
  const content = readFileSync(filePath, 'utf8');
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || humanize(basename(filePath));
}

function sidebarItems(dir: string): SidebarItem[] {
  return readdirSync(dir)
    .filter((entry) => !entry.startsWith('.') && entry !== 'node_modules')
    .sort((left, right) => {
      if (left === 'index.md') return -1;
      if (right === 'index.md') return 1;
      return left.localeCompare(right);
    })
    .map((entry) => {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        return {
          text: humanize(entry),
          collapsed: false,
          items: sidebarItems(fullPath)
        } as SidebarItem;
      }

      if (!entry.endsWith('.md')) {
        return null;
      }

      const pathFromDocs = relative(docsRoot, fullPath).split(sep).join('/');
      const link = `/${pathFromDocs.replace(/index\.md$/, '').replace(/\.md$/, '')}`;

      return {
        text: entry === 'index.md' ? 'Inicio' : readTitle(fullPath),
        link: link === '/' ? '/' : link
      };
    })
    .filter((item): item is SidebarItem => Boolean(item));
}

export default defineConfig({
  title: 'Dale Pues Dashboard',
  description: 'Documentacion tecnica del dashboard Angular para Dale Pues',
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'dark',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '/favicon.ico',
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Analisis', link: '/DALE_PUES_INTEGRATION_ANALYSIS' },
      { text: 'Modulos', link: '/DALE_PUES_DASHBOARD_MODULES' }
    ],
    sidebar: [
      {
        text: 'Documentacion',
        items: sidebarItems(docsRoot)
      }
    ],
    outline: {
      level: [2, 3],
      label: 'Indice'
    },
    docFooter: {
      prev: 'Anterior',
      next: 'Siguiente'
    },
    lastUpdated: {
      text: 'Actualizado',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    darkModeSwitchLabel: 'Tema',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Volver arriba',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Buscar',
            buttonAriaLabel: 'Buscar'
          },
          modal: {
            displayDetails: 'Mostrar detalles',
            resetButtonTitle: 'Limpiar busqueda',
            backButtonTitle: 'Cerrar busqueda',
            noResultsText: 'Sin resultados',
            footer: {
              selectText: 'seleccionar',
              selectKeyAriaLabel: 'enter',
              navigateText: 'navegar',
              navigateUpKeyAriaLabel: 'flecha arriba',
              navigateDownKeyAriaLabel: 'flecha abajo',
              closeText: 'cerrar',
              closeKeyAriaLabel: 'escape'
            }
          }
        }
      }
    }
  },
  vite: {
    optimizeDeps: {
      include: ['mermaid']
    }
  }
});

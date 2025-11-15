import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'authentication',
    {
      type: 'category',
      label: 'Entities',
      items: [
        {
          type: 'category',
          label: 'Lighting & Power',
          items: [
            'entities/light',
            'entities/switch',
            'entities/fan',
          ],
        },
        {
          type: 'category',
          label: 'Climate & Environment',
          items: [
            'entities/climate',
            'entities/sensor',
            'entities/binary-sensor',
          ],
        },
        {
          type: 'category',
          label: 'Security & Access',
          items: [
            'entities/camera',
            'entities/lock',
            'entities/cover',
          ],
        },
        {
          type: 'category',
          label: 'Entertainment',
          items: [
            'entities/media-player',
          ],
        },
        {
          type: 'category',
          label: 'Productivity',
          items: [
            'entities/todo',
          ],
        },
      ],
    },
    'multiple-entities',
    'error-handling',
    'development-testing',
  ],
};

export default sidebars;
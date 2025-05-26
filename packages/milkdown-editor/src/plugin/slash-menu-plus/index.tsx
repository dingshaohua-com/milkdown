import { SlashView } from './view';
import { createSlice, Ctx } from '@milkdown/kit/ctx';
import { slashFactory } from '@milkdown/kit/plugin/slash';
import { usePluginViewFactory } from '@prosemirror-adapter/react';

export const slashPlus = slashFactory('slashPlus');
export const useSlashPlus = () => {
  const pluginViewFactory = usePluginViewFactory();
  return {
    plugin: slashPlus,
    config: (ctx: Ctx) => {
      ctx.set(slashPlus.key, {
        props: {
          handleKeyDown: (view, event) => {
            if (!ctx.get(slashPlus.key).opened) return false;
            return ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key);
          },
        },
        view: pluginViewFactory({
          component: SlashView,
        }),
        opened: false,
      });
    },
  };
};

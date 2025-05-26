import { SlashView } from './view';
import { Ctx } from '@milkdown/kit/ctx';
import { slashFactory } from '@milkdown/kit/plugin/slash';
import { usePluginViewFactory } from '@prosemirror-adapter/react';

export const slashBlock = slashFactory('slashBlock');
export const useSlashBlock = () => {
  const pluginViewFactory = usePluginViewFactory();
  return {
    plugin: slashBlock,
    config: (ctx: Ctx) => {
      ctx.set(slashBlock.key, {
        // props: {
        //   handleKeyDown: (view, event) => {
        //     if (!ctx.get(slashBlock.key).opened) return false;
        //     return ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key);
        //   },
        // },
        view: pluginViewFactory({
          component: SlashView,
        })
      });
    },
  };
};

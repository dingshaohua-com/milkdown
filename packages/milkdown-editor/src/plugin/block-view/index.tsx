import { BlockView } from './view';
import { createSlice, Ctx } from '@milkdown/kit/ctx';
import { slashFactory } from '@milkdown/kit/plugin/slash';
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import { block } from '@milkdown/kit/plugin/block';

// export const slash = slashFactory('slashMenu');
export const useBlock = () => {
  const pluginViewFactory = usePluginViewFactory();
  return {
    plugin: block,
    config: (ctx: Ctx) => {
      ctx.set(block.key, {
        // props: {
        //   handleKeyDown: (view, event) => {
        //     if (!ctx.get(slash.key).opened) return false;
        //     return ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key);
        //   },
        // },
        view: pluginViewFactory({
          component: BlockView,
        }),
        opened: false,
      });
    },
  };
};

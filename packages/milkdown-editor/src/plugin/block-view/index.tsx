import { BlockView } from './view';
import { Ctx } from '@milkdown/kit/ctx';
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import { block } from '@milkdown/kit/plugin/block';


export const useBlock = () => {
  const pluginViewFactory = usePluginViewFactory();
  return {
    plugin: block,
    config: (ctx: Ctx) => {
      ctx.set(block.key, {
        view: pluginViewFactory({
          component: BlockView
        }),
        shouldShow: (view: any) => {
          const { state } = view;
          const { selection } = state;
          return selection.$anchor.parent.type.name !== 'doc';
        }
      });
    },
  };
};

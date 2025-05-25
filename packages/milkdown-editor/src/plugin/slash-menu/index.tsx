import { SlashView } from './view';
import { createSlice, Ctx } from '@milkdown/kit/ctx';
import { slashFactory } from '@milkdown/kit/plugin/slash';
import { usePluginViewFactory } from '@prosemirror-adapter/react';

export const slash = slashFactory('slashMenu');
// export const slashCtx:any = createSlice(null, 'slash-ctx')
export const useSlash = () => {
  const pluginViewFactory = usePluginViewFactory();
  return {
    plugin: slash,
    config: (ctx: Ctx) => {
      ctx.set(slash.key, {
        props: {
          handleKeyDown: (view, event) => {
            if (!ctx.get(slash.key).opened) return false;
            return ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key);
          },
        },
        view: pluginViewFactory({
          component: SlashView,
        }),
        opened: false,
      });

      // // 添加控制 slash-menu 显示的方法
      // const showSlashMenu = () => {
      //   const state = ctx.get(slash.key);
      //   state.opened = true;
      //   ctx.set(slash.key, state);
      // };

      // const hideSlashMenu = () => {
      //   const state = ctx.get(slash.key);
      //   state.opened = false;
      //   ctx.set(slash.key, state);
      // };

      // ctx.set(slashCtx, slash);

      // return {
      //   showSlashMenu,
      //   hideSlashMenu,
      // };
    },
  };
};

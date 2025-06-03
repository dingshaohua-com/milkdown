import { api } from './index';
import { slash } from './index';
import { Ctx } from '@milkdown/kit/ctx';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import React, { useCallback, useEffect, useRef } from 'react';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { createCodeBlockCommand } from '@milkdown/kit/preset/commonmark';

const View = () => {
  const ref = useRef<HTMLDivElement>(null);
  const slashProvider = useRef<SlashProvider>(null);

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  //   const action = useCallback(
  //     (fn: (ctx: Ctx) => void) => {
  //       if (loading) return;
  //       get().action(fn);
  //     },
  //     [loading],
  //   );

  const show = () => {
    console.log('show');

    if (!view || !ref.current) return;
    const { state } = view;
    const { selection } = state;
    const { $anchor } = selection;
    const pos = view.coordsAtPos($anchor.pos);
    ref.current.style.top = `${pos.top + 30}px`;
    ref.current.style.left = `${pos.left - 40}px`;
    slashProvider.current?.show();
  };
  const hide = () => {
    console.log('hide');
    slashProvider.current?.hide();
  };

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) {
      return;
    }
    slashProvider.current = new SlashProvider({
      content: div,
      trigger: '',
      //   offset: 100,
    });

    const editor = get();
    if (editor) {
      editor.ctx.set(api.key, {
        show: () => show(),
        hide: () => hide(),
      });
    }

    return () => {
      slashProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

  //   const command = (e: React.KeyboardEvent | React.MouseEvent) => {
  //     e.preventDefault(); // Prevent the keyboad key to be inserted in the editor.
  //     action((ctx) => {
  //       const view = ctx.get(editorViewCtx);
  //       const { dispatch, state } = view;
  //       const { tr, selection } = state;
  //       const { from } = selection;
  //       dispatch(tr.deleteRange(from - 1, from));
  //       view.focus();
  //       return callCommand(createCodeBlockCommand.key)(ctx);
  //     });
  //   };

  return (
    // <div ref={ref} aria-expanded="false" className="absolute data-[show='false']:hidden">
    //   <button
    //     className="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
    //     onKeyDown={(e) => command(e)}
    //     onMouseDown={(e) => {
    //       command(e);
    //     }}
    //   >
    //     Code Block
    //   </button>
    // </div>
    <div className="slash-view" ref={ref}>
      <div className="slash-view-content">
        {/* <div className="slash-view-content-item" onClick={onDelete}>
          删除
        </div> */}
        <div className="slash-view-content-item">插入标题1</div>
      </div>
    </div>
  );
};
export default View;

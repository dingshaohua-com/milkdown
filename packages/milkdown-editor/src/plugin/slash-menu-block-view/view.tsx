import { api } from './index';
import { slash } from './index';
import { Ctx } from '@milkdown/kit/ctx';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { codeImg, boldImg } from '../../utils/img-helper';
import { TextSelection } from '@milkdown/kit/prose/state';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import React, { useCallback, useEffect, useRef } from 'react';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { createCodeBlockCommand, toggleStrongCommand, toggleEmphasisCommand } from '@milkdown/kit/preset/commonmark';

const View = () => {
  const ref = useRef<HTMLDivElement>(null);
  const slashProvider = useRef<SlashProvider>(null);

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (loading) return;
      get().action(fn);
    },
    [loading],
  );

  const show = () => {
    console.log('show');

    if (!view || !ref.current) return;
    const { state } = view;
    const { selection } = state;
    const { $anchor } = selection;
    const pos = view.coordsAtPos($anchor.pos);
    ref.current.style.top = `${pos.top + 30}px`;
    ref.current.style.left = `${pos.left - 40}px`;
    setTimeout(() => {
      slashProvider.current?.show();
    }, 200);
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

  // const insertTitle1 = (e: React.MouseEvent) => {
  //   console.log('insertTitle1');
  //   e.preventDefault();

  //   action((ctx) => {
  //     const view = ctx.get(editorViewCtx);
  //     const { dispatch, state } = view;
  //     const { tr, selection } = state;

  //     const { from } = selection;

  //     if (from === 0) {
  //       dispatch(tr.deleteRange(0, 0));
  //     } else {
  //       dispatch(tr.deleteRange(from - 1, from));
  //     }

  //     view.focus();
  //     console.log(from);
  //     return callCommand(createCodeBlockCommand.key)(ctx);
  //   });
  // };

  const transformToCode = (e: React.MouseEvent) => {
    e.preventDefault();
    action((ctx) => {
      return callCommand(createCodeBlockCommand.key)(ctx);
    });
  };

  const transformToBold = (e: React.MouseEvent) => {
    e.preventDefault();
    action((ctx) => {
      return callCommand(toggleStrongCommand.key)(ctx);
    });
  };

  const insertHeading = (level: number) => {
    action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const { dispatch, state } = view;
      const { tr, selection } = state;
      const { $from } = selection;

      const safeInsertPos = Math.min($from.end() + 1, tr.doc.content.size);
      const heading = state.schema.nodes.heading.create({ level: level }, state.schema.text('标题'));
      tr.insert(safeInsertPos, heading);
      tr.setSelection(TextSelection.near(tr.doc.resolve(safeInsertPos)));
      view.dispatch(tr.scrollIntoView());
      view.focus();
    });
  };

  return (
    <div className="slash-menu-block-view" ref={ref}>
      <div className="content">
        {/* <div className="slash-view-content-item" onClick={onDelete}>
          删除
        </div> */}
        <div className="group">
          <div className="title">在下方插入</div>
          <div className="items">
            <div className="item" onClick={() => insertHeading(1)}>
              H1
            </div>
            <div className="item" onClick={() => insertHeading(2)}>
              H2
            </div>
            <div className="item" onClick={() => insertHeading(3)}>
              H3
            </div>
          </div>
        </div>

        <div className="group">
          <div className="title">转换为</div>
          <div className="items">
            <div className="item">
              <img src={boldImg} alt="" onClick={transformToBold} />
            </div>
            <div className="item">
              <img src={codeImg} alt="" onClick={transformToCode} />
            </div>
          </div>
        </div>

        {/* <div className="slash-view-content-item" onClick={insertTitle1}>
          转换为代码
        </div> */}
      </div>
    </div>
  );
};
export default View;

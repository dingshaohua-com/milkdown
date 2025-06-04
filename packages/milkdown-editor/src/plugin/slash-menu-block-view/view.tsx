import { api } from './index';
import { slash } from './index';
import { Ctx } from '@milkdown/kit/ctx';
import { Editor } from '@milkdown/kit/core';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { EditorView } from '@milkdown/kit/prose/view';
import { TextSelection } from '@milkdown/kit/prose/state';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import React, { useCallback, useEffect, useRef } from 'react';
import { Node, ResolvedPos } from '@milkdown/kit/prose/model';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { codeImg, boldImg, tableImg } from '../../utils/img-helper';
import { EditorState, Selection, Transaction } from '@milkdown/kit/prose/state';
import { createCodeBlockCommand, toggleStrongCommand, toggleEmphasisCommand } from '@milkdown/kit/preset/commonmark';
import { createTable } from '@milkdown/kit/preset/gfm'

// 首先定义参数类型
type CreateNodeParams = {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  tr: Transaction;
  selection: Selection;
  $from: ResolvedPos;
};

function clearRange(tr: Transaction) {
  const { $from, $to } = tr.selection
  const { pos: from } = $from
  const { pos: to } = $to
  tr = tr.deleteRange(from - $from.node().content.size, to)
  return tr
}

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

  const insertSome = (creatNode: (params: CreateNodeParams) => Node) => {
    const editor = get();
    if (!editor) return;
    const view = editor.ctx.get(editorViewCtx);
    const { state } = view;
    const { tr, selection } = state;
    const { $from } = selection;

    // 获取当前节点结束位置
    const currentNodeendPos = $from.end();

    // 创建一个新节点
    const newNode = creatNode({ editor, view, state, tr, selection, $from });

    // 插入到当前节点结束位置（即作为下一个节点）
    tr.insert(currentNodeendPos, newNode);

    // 设置光标位置（加2是因为要计算新节点的起始占位标记长度）
    const finalPos = tr.doc.resolve(currentNodeendPos + newNode.nodeSize);
    tr.setSelection(TextSelection.near(finalPos));
    view.dispatch(tr); // tr为此次事务的对象，必须通过视图对象的dispatch通知，页面才会有更新

    // 聚焦（在 ProseMirror 中，设置光标位置和聚焦是两个不同的操作）
    view.focus();
  };

  const insertHeading = (level: number) => {
    insertSome(({ state }) => {
      const text = state.schema.text('标题');
      const node = state.schema.nodes.heading.create({ level: level }, text);
      return node;
    });
  };

  const insertTabel = () => {
    // insertSome(({ state }) => {

    // });
    const editor = get();
    if (!editor) return;

    const view = editor.ctx.get(editorViewCtx);
    const { dispatch, state } = view;
    let { tr } = state;
    // tr = clearRange(tr);
    const from = tr.selection.from;
    const table = createTable(editor.ctx, 3, 3);
    tr = tr.replaceSelectionWith(table);
    dispatch(tr);

    requestAnimationFrame(() => {
      const docSize = view.state.doc.content.size;
      const $pos = view.state.doc.resolve(from > docSize ? docSize : from < 0 ? 0 : from);
      const selection = TextSelection.near($pos);
      const tr = view.state.tr;
      tr.setSelection(selection);
      dispatch(tr.scrollIntoView());
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
            <div className="item" onClick={insertTabel}>
              <img src={tableImg} alt="" />
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

import { api } from './index';
import { slash } from './index';
import { Ctx } from '@milkdown/kit/ctx';
import { Editor } from '@milkdown/kit/core';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { EditorView } from '@milkdown/kit/prose/view';
import { createTable } from '@milkdown/kit/preset/gfm';
import { TextSelection } from '@milkdown/kit/prose/state';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import React, { useCallback, useEffect, useRef } from 'react';
import { Node, ResolvedPos } from '@milkdown/kit/prose/model';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { EditorState, Selection, Transaction } from '@milkdown/kit/prose/state';
import { createCodeBlockCommand, toggleStrongCommand, listItemSchema, orderedListSchema } from '@milkdown/kit/preset/commonmark';
import { codeImg, boldImg, tableImg, quoteImg, dividerImg, orderListImg, bulletListImg, todoListImg, imgImg, latexImg } from '../../utils/img-helper';
// import {
//   blockquoteSchema,
//   bulletListSchema,
//   codeBlockSchema,
//   headingSchema,
//   hrSchema,
//   listItemSchema,
//   orderedListSchema,
//   paragraphSchema,
// } from '@milkdown/kit/preset/commonmark'

// 首先定义参数类型
type CreateNodeParams = {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  tr: Transaction;
  selection: Selection;
  $from: ResolvedPos;
  ctx: Ctx;
};

function clearRange(tr: Transaction) {
  const { $from, $to } = tr.selection;
  const { pos: from } = $from;
  const { pos: to } = $to;
  tr = tr.deleteRange(from - $from.node().content.size, to);
  return tr;
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

  const insertSome = (creatNode: (params: CreateNodeParams) => Node | Node[]) => {
    const editor = get();
    if (!editor) return;
    const ctx = editor.ctx;
    const view = ctx.get(editorViewCtx);
    const { state } = view;
    const { tr, selection } = state;
    const { $from } = selection;

    // 获取当前节点结束位置
    const currentNodeendPos = $from.end();

    // 创建一个或多个新节点
    const newNode = creatNode({ editor, ctx, view, state, tr, selection, $from });
    const nodes = Array.isArray(newNode) ? newNode : [newNode];

    // 插入到当前节点结束位置
    tr.insert(currentNodeendPos, nodes);

    // 设置光标位置
    const finalPos = tr.doc.resolve(currentNodeendPos + nodes.reduce((sum, node) => sum + node.nodeSize, 0));
    tr.setSelection(TextSelection.near(finalPos));
    view.dispatch(tr);

    // 聚焦
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
    insertSome(({ ctx, state }) => {
      const table = createTable(ctx, 3, 3);
      const paragraph = state.schema.nodes.paragraph.create();
      return [table, paragraph];
    });
  };

  const insertQuote = () => {
    insertSome(({ ctx, state }) => {
      const text = state.schema.text('引用');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const quote = state.schema.nodes.blockquote.create(null, paragraph);
      return quote;
    });
  };

  const insertDivider = () => {
    insertSome(({ ctx, state }) => {
      const divider = state.schema.nodes.hr.create();
      const paragraph = state.schema.nodes.paragraph.create();
      return [divider, paragraph];
    });
  };

  const insertOrderList = () => {
    insertSome(({ ctx, state }) => {
      const text = state.schema.text('有序列表');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const orderList = orderedListSchema.type(ctx).create(null, paragraph);
      return orderList;
    });
  };

  const insertBulletList = () => {
    insertSome(({ ctx, state }) => {
      const text = state.schema.text('有序列表');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const orderList = listItemSchema.type(ctx).create(null, paragraph);
      return orderList;
    });
    
  };

  const insertTodoList = () => {
    insertSome(({ ctx, state }) => {
      const text = state.schema.text('待办列表');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const todoList = listItemSchema.type(ctx).create(null, paragraph);
      return todoList;
    });
  };

  const insertImg = () => {
    insertSome(({ ctx, state }) => {
      const text = state.schema.text('图片');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const img = state.schema.nodes.img.create(null, paragraph);
      return img;
    });
  };

  const insertLatex = () => {
    insertSome(({ ctx, state }) => {
      const text = state.schema.text('Latex');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const latex = state.schema.nodes.latex.create(null, paragraph);
      return latex;
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
            <div className="item" onClick={insertQuote}>
              <img src={quoteImg} alt="" />
            </div>
            <div className="item" onClick={insertDivider}>
              <img src={dividerImg} alt="" />
            </div>
            <div className="item" onClick={insertOrderList}>
              <img src={orderListImg} alt="" />
            </div>
            <div className="item" onClick={insertBulletList}>
              <img src={bulletListImg} alt="" />
            </div>
            <div className="item" onClick={insertTodoList}>
              <img src={todoListImg} alt="" />
            </div>
            <div className="item" onClick={insertImg}>
              <img src={imgImg} alt="" />
            </div>
            <div className="item" onClick={insertLatex}>
              <img src={latexImg} alt="" style={{ height: 12 }}  />
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

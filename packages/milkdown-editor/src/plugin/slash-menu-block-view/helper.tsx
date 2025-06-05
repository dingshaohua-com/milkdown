import { Editor, editorViewCtx } from '@milkdown/kit/core';
import type { ClearRangeFn, SetBlockTypeFn, ClearContentAndSetBlockTypeFn, creatNodeFn } from './type';
import { TextSelection } from '@milkdown/kit/prose/state';

/**
 * 清除选中范围的实现
 */
export const clearRange: ClearRangeFn = (tr) => {
  const { $from, $to } = tr.selection;
  const { pos: from } = $from;
  const { pos: to } = $to;
  tr = tr.deleteRange(from - $from.node().content.size, to);
  return tr;
};

/**
 * 设置块类型的实现
 */
export const setBlockType: SetBlockTypeFn = (tr, nodeType, attrs = null) => {
  const { from, to } = tr.selection;
  return tr.setBlockType(from, to, nodeType, attrs);
};

/**
 * 清除内容并设置块类型的命令函数实现
 */
export const clearContentAndSetBlockType: ClearContentAndSetBlockTypeFn = (nodeType, attrs = null) => {
  return (state, dispatch) => {
    if (dispatch) {
      const tr = setBlockType(clearRange(state.tr), nodeType, attrs);
      dispatch(tr.scrollIntoView());
    }
    return true;
  };
};
// const command = clearContentAndSetBlockType(headingSchema.type(ctx), { level: 2 });
// command(state, dispatch);




export const insertSome = (editor: Editor, creatNode: creatNodeFn) => {
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
  const nodes = newNode ? (Array.isArray(newNode) ? newNode : [newNode]) : [];

  if (nodes.length > 0) {
    // 插入到当前节点结束位置
    tr.insert(currentNodeendPos, nodes);

    // 设置光标位置
    const finalPos = tr.doc.resolve(currentNodeendPos + nodes.reduce((sum, node) => sum + node.nodeSize, 0));
    tr.setSelection(TextSelection.near(finalPos));
    view.dispatch(tr);

    // 聚焦
    view.focus();
  }
};
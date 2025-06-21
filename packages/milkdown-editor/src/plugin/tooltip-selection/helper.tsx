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



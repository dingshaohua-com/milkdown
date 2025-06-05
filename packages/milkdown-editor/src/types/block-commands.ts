import type { Attrs, NodeType } from '@milkdown/kit/prose/model';
import type { Command, Transaction } from '@milkdown/kit/prose/state';

/**
 * 清除选中范围的函数类型
 */
export type ClearRangeFunction = (tr: Transaction) => Transaction;

/**
 * 设置块类型的函数类型
 */
export type SetBlockTypeFunction = (
  tr: Transaction,
  nodeType: NodeType,
  attrs?: Attrs | null
) => Transaction;

/**
 * 清除内容并设置块类型的命令函数类型
 */
export type ClearContentAndSetBlockTypeCommand = (
  nodeType: NodeType,
  attrs?: Attrs | null
) => Command;

/**
 * 清除选中范围的实现
 */
export const clearRange: ClearRangeFunction = (tr) => {
  const { $from, $to } = tr.selection;
  const { pos: from } = $from;
  const { pos: to } = $to;
  tr = tr.deleteRange(from - $from.node().content.size, to);
  return tr;
};

/**
 * 设置块类型的实现
 */
export const setBlockType: SetBlockTypeFunction = (tr, nodeType, attrs = null) => {
  const { from, to } = tr.selection;
  return tr.setBlockType(from, to, nodeType, attrs);
};

/**
 * 清除内容并设置块类型的命令函数实现
 */
export const clearContentAndSetBlockType: ClearContentAndSetBlockTypeCommand = (
  nodeType,
  attrs = null
) => {
  return (state, dispatch) => {
    if (dispatch) {
      const tr = setBlockType(clearRange(state.tr), nodeType, attrs);
      dispatch(tr.scrollIntoView());
    }
    return true;
  };
}; 
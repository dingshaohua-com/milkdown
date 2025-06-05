import type { Command } from '@milkdown/kit/prose/state';
import type { NodeType } from '@milkdown/kit/prose/model';
import type { Attrs } from '@milkdown/kit/prose/model';
import { setBlockType } from '@milkdown/kit/prose/commands';
import { clearRange } from '@milkdown/kit/prose/commands';


/**
 * 清除内容并设置块类型的命令函数
 * @param nodeType 要设置的节点类型
 * @param attrs 节点属性，默认为 null
 * @returns 返回一个命令函数
 */
export type ClearContentAndSetBlockTypeCommand = (
  nodeType: NodeType,
  attrs?: Attrs | null
) => Command;

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
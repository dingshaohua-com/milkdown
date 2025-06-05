import type { Attrs, NodeType, ResolvedPos } from '@milkdown/kit/prose/model';
import type {  EditorState, Selection ,Command, Transaction } from '@milkdown/kit/prose/state';
import type { Editor } from '@milkdown/kit/core';
import { EditorView } from '@milkdown/kit/prose/view';
import { Ctx } from '@milkdown/kit/ctx';


/**
 * 清除选中范围的函数类型
 */
export type ClearRangeFn = (tr: Transaction) => Transaction;

/**
 * 设置块类型的函数类型
 */
export type SetBlockTypeFn = (
  tr: Transaction,
  nodeType: NodeType,
  attrs?: Attrs | null
) => Transaction;

/**
 * 清除内容并设置块类型的命令函数类型
 */
export type ClearContentAndSetBlockTypeFn = (
  nodeType: NodeType,
  attrs?: Attrs | null
) => Command;


// 首先定义参数类型
declare type CreateNodeParams = {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  tr: Transaction;
  selection: Selection;
  $from: ResolvedPos;
  ctx: Ctx;
};


export type creatNodeFn = (params: CreateNodeParams) => Node | Node[] | any
import type { Editor } from '@milkdown/core';
import type { Node } from 'prosemirror-model';

export interface MathPluginOptions {
  /**
   * 是否启用数学公式功能
   * @default true
   */
  enabled?: boolean;
  
  /**
   * 数学公式处理函数
   * @param text 公式文本
   * @param display 是否为块级公式
   * @param editor 编辑器实例
   * @param node 当前节点
   * @returns 处理后的公式文本
   */
  math?: (text: string, display: boolean, editor: Editor, node: Node) => string;
}

export type MathHandler = NonNullable<MathPluginOptions['math']>; 
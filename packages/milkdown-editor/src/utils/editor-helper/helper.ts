import { createTable } from '@milkdown/kit/preset/gfm';
import { TextSelection } from '@milkdown/kit/prose/state';
import { Editor, editorViewCtx } from '@milkdown/kit/core';
import { creatNodeFn } from '../../plugin/slash-menu-block-view/type';
import { createCodeBlockCommand, toggleStrongCommand, blockquoteSchema, bulletListSchema, codeBlockSchema, headingSchema, hrSchema, listItemSchema, orderedListSchema, paragraphSchema } from '@milkdown/kit/preset/commonmark';

export default class EditorHelper {
  private static instance: EditorHelper | null = null;
  private static editor: Editor | null = null;

  private constructor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * 获取 InsertHelper 的单例实例
   * @param editor Editor 实例
   * @returns InsertHelper 单例
   */
  static getInstance(editor: Editor): EditorHelper {
    if (!this.instance || this.editor !== editor) {
      this.editor = editor;
      this.instance = new EditorHelper(editor);
    }
    return this.instance;
  }

  /**
   * 销毁单例实例
   */
  static destroyInstance(): void {
    this.instance = null;
    this.editor = null;
  }

  editor: Editor;

  insertSome(creatNode: creatNodeFn) {
    const editor = this.editor;
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
  }

  insertHeading = (level: number) => {
    this.insertSome(({ state }) => {
      const text = state.schema.text('标题');
      const node = state.schema.nodes.heading.create({ level: level }, text);
      return node;
    });
  };

  insertTabel() {
    this.insertSome(({ ctx, state }) => {
      const table = createTable(ctx, 3, 3);
      const paragraph = state.schema.nodes.paragraph.create();
      return [table, paragraph];
    });
  }

  insertQuote() {
    this.insertSome(({ ctx, state }) => {
      const text = state.schema.text('引用');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const quote = state.schema.nodes.blockquote.create(null, paragraph);
      return quote;
    });
  }

  insertDivider() {
    this.insertSome(({ ctx, state }) => {
      const divider = state.schema.nodes.hr.create();
      const paragraph = state.schema.nodes.paragraph.create();
      return [divider, paragraph];
    });
  }

  insertBulletList() {
    this.insertSome(({ ctx, state }) => {
      const text = state.schema.text('无序列表');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const listItem = listItemSchema.type(ctx).create(null, paragraph);
      const bulletList = bulletListSchema.type(ctx).create(null, listItem);
      return bulletList;
    });
  }

  insertOrderList() {
    this.insertSome(({ ctx, state }) => {
      const text = state.schema.text('有序列表');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const listItem = listItemSchema.type(ctx).create(null, paragraph);
      const orderList = orderedListSchema.type(ctx).create(null, listItem);
      return orderList;
    });
  }

  insertTodoList = () => {
    this.insertSome(({ ctx, state }) => {
      const text = state.schema.text('待办列表');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const todoList = listItemSchema.type(ctx).create(null, paragraph);
      return todoList;
    });
  };

  insertImg() {
    this.insertSome(({ ctx, state }) => {
      const text = state.schema.text('图片');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const img = state.schema.nodes.img.create(null, paragraph);
      return img;
    });
  }

  insertLatex = () => {
    this.insertSome(({ ctx, state }) => {
      const text = state.schema.text('Latex');
      const paragraph = state.schema.nodes.paragraph.create(null, text);
      const latex = state.schema.nodes.latex.create(null, paragraph);
      return latex;
    });
  };

  // const transformToCode = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   action((ctx) => {
  //     return callCommand(createCodeBlockCommand.key)(ctx);
  //   });
  // };

  // const transformToBold = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   action((ctx) => {
  //     return callCommand(toggleStrongCommand.key)(ctx);
  //   });
  // };
}

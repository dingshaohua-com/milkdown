import { Editor, editorStateCtx } from '@milkdown/kit/core';

// 更新按钮状态
export const checkMarkActive = (type: string, editor: Editor) => {

  const editorState = editor.ctx.get(editorStateCtx);
  const typeObject = editorState.schema.marks[type];
  const { from, to, empty } = editorState.selection;
  let isActive;
  // if (empty) {
  //   isActive = typeObject.isInSet(editorState.storedMarks || editorState.selection.$from.marks()) != null;
  // } else {
  //   isActive = editorState.doc.rangeHasMark(from, to, typeObject);
  // }
  return isActive;
};


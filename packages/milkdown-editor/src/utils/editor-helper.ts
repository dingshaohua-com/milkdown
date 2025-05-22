import { commandsCtx, editorStateCtx } from '@milkdown/kit/core';
 
 // 更新按钮状态
 export const checkMarkActive = (type: string, ctx, selection, prevSelection) => {
    const editorState = ctx.get(editorStateCtx);
    console.log(111, editorState.schema.marks);
    const typeObject = editorState.schema.marks[type];


    

    const { from, to, empty } = selection;
    let isActive;
    if (empty) {
      isActive = typeObject.isInSet(editorState.storedMarks || selection.$from.marks()) != null;
    } else {
      isActive = editorState.doc.rangeHasMark(from, to, typeObject);
    }
    console.log(isActive, 'isActive');
    
    return isActive;
  };
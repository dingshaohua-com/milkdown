import { useEditor } from '@milkdown/react';
import { Editor } from '@milkdown/kit/core';
import { useInstance } from '@milkdown/react';
import InsertHelper from './helper';
import { useMemo } from 'react';

const useEditorHelper = () => {
  const [loading, get] = useInstance();
  const editor: Editor = get()!;

  if (!editor) {
    return { editor, loading };
  }

//   const action = useCallback(
//     (fn: (ctx: Ctx) => void) => editor.action(fn),
//     [loading],
//   );

  // 因为做了单例，所以这里不用 useRef来保持引用
  let insertHelper: InsertHelper = InsertHelper.getInstance(editor);
  // 使用 useMemo 缓存带参数的函数，以及保持作用域
  const insert = useMemo(
    () => ({
      h1: () => insertHelper.insertHeading(1),
      h2: () => insertHelper.insertHeading(2),
      h3: () => insertHelper.insertHeading(3),
      tabel: () => insertHelper.insertTabel(),
      quote: () => insertHelper.insertQuote(),
      divider: () => insertHelper.insertDivider(),
      bulletList: () => insertHelper.insertBulletList(),
      orderList: () => insertHelper.insertOrderList(),
      todoList: () => insertHelper.insertTodoList(),
      img: () => insertHelper.insertImg(),
      latex: () => insertHelper.insertLatex(),
    }),
    [insertHelper],
  );

  return { editor, insert, loading };
};

export default useEditorHelper;

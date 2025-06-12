import { useEditor } from '@milkdown/react';
import { Editor } from '@milkdown/kit/core';
import { useInstance } from '@milkdown/react';
import InsertHelper from './helper';
import { useMemo } from 'react';

type UseEditorHelperProps = {
  afterAction?: () => void;
  insertPos?: string;
};

type UseEditorHelperReturn = {
  editor: Editor | null;
  loading: boolean;
  insert?: {
    h1: () => void;
    h2: () => void;
    h3: () => void;
    tabel: () => void;
    quote: () => void;
    divider: () => void;
    bulletList: () => void;
    orderList: () => void;
    todoList: () => void;
    img: () => void;
    latex: () => void;
  };
};

const useEditorHelper = (props: UseEditorHelperProps): UseEditorHelperReturn => {
  const [loading, get] = useInstance();
  const editor: Editor = get()!;

  console.log(props.insertPos);
  

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
      h1: () => {
        insertHelper.insertHeading(1);
        props.afterAction && props.afterAction();
      },
      h2: () => {
        insertHelper.insertHeading(2);
        props.afterAction && props.afterAction();
      },
      h3: () => {
        insertHelper.insertHeading(3);
        props.afterAction && props.afterAction();
      },
      tabel: () => {
        insertHelper.insertTabel();
        props.afterAction && props.afterAction();
      },
      quote: () => {
        insertHelper.insertQuote();
        props.afterAction && props.afterAction();
      },
      divider: () => {
        insertHelper.insertDivider();
        props.afterAction && props.afterAction();
      },
      bulletList: () => {
        insertHelper.insertBulletList();
        props.afterAction && props.afterAction();
      },
      orderList: () => {
        insertHelper.insertOrderList();
        props.afterAction && props.afterAction();
      },
      todoList: () => {
        insertHelper.insertTodoList();
        props.afterAction && props.afterAction();
      },
      img: () => {
        insertHelper.insertImg();
        props.afterAction && props.afterAction();
      },
      latex: () => {
        insertHelper.insertLatex();
        props.afterAction && props.afterAction();
      },
    }),
    [insertHelper],
  );

  return { editor, insert, loading };
};

export default useEditorHelper;

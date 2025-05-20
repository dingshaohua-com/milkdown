import './style.scss';
import { Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import emitter from '../../../utils/emitter';
import { commandsCtx, editorStateCtx } from '@milkdown/kit/core';
import { toggleStrongCommand } from '@milkdown/kit/preset/commonmark';
import { RiBold, RiItalic, RiUnderline, RiStrikethrough, RiEmphasisCn } from '@remixicon/react';

const buttonGroup: Array<any> = [
  {
    value: 'bold',
    label: 'Bold',
    icon: RiBold,
    action: (editor) => {
      editor.action((ctx) => {
        // 获取命令管理器
        const commandManager = ctx.get(commandsCtx);
        // 调用命令
        commandManager.call(toggleStrongCommand.key);
      });
    },
    isActive: (editor) => editor.isActive('bold'),
    canExecute: (editor) => editor.can().chain().focus().toggleBold().run() && !editor.isActive('codeBlock'),
    tooltip: '粗体',
  },
  // {
  //   value: 'italic',
  //   label: 'Italic',
  //   icon: RiItalic,
  //   action: (editor) => editor.chain().focus().toggleItalic().run(),
  //   isActive: (editor) => editor.isActive('italic'),
  //   canExecute: (editor) =>
  //     editor.can().chain().focus().toggleItalic().run() &&
  //     !editor.isActive('codeBlock'),
  //   tooltip: '斜体',
  // },
  // {
  //   value: 'underline',
  //   label: 'Underline',
  //   icon: RiUnderline,
  //   action: (editor) => editor.chain().focus().toggleUnderline().run(),
  //   isActive: (editor) => editor.isActive('underline'),
  //   canExecute: (editor) =>
  //     editor.can().chain().focus().toggleUnderline().run() &&
  //     !editor.isActive('codeBlock'),
  //   tooltip: '下划线',
  // },
  // {
  //   value: 'strike',
  //   label: 'Strike',
  //   icon: RiStrikethrough,
  //   action: (editor) => editor.chain().focus().toggleStrike().run(),
  //   isActive: (editor) => editor.isActive('strike'),
  //   canExecute: (editor) =>
  //     editor.can().chain().focus().toggleStrike().run() &&
  //     !editor.isActive('codeBlock'),
  //   tooltip: '删除线',
  // },
  //   {
  //     value: 'color',
  //     label: 'Color',
  //     icon: RiFontColor,
  //     action: editor => editor.chain().focus().toggleStrike().run(),
  //     isActive: editor => editor.isActive('strike'),
  //     canExecute: editor => editor.can().chain().focus().toggleUnderline().run() && !editor.isActive('codeBlock'),
  //     tooltip:"颜色",
  //   },
  // {
  //   value: 'dot',
  //   label: 'Dot',
  //   icon: RiEmphasisCn,
  //   action: (editor) => editor.chain().focus().toggleDot().run(),
  //   isActive: (editor) => editor.isActive('dot'),
  //   canExecute: (editor) =>
  //     editor.can().chain().focus().toggleUnderline().run() &&
  //     !editor.isActive('codeBlock'),
  //   tooltip: '强调',
  // },
];

const FontStyle = ({ editor }) => {
  const [isStrongActive, setIsStrongActive] = useState(false);

  // 更新按钮状态
  const updateActiveState = (ctx, selection, prevSelection) => {
    const editorState = ctx.get(editorStateCtx);
    const strongType = editorState.schema.marks.strong;
    const { from, to, empty } = selection;
    let isActive;
    if (empty) {
      isActive = strongType.isInSet(editorState.storedMarks || selection.$from.marks()) != null;
    } else {
      isActive = editorState.doc.rangeHasMark(from, to, strongType);
    }
    setIsStrongActive(isActive);
  };

  useEffect(() => {
    emitter.on('selectionUpdated', (arg) => {
      updateActiveState(arg.ctx, arg.selection, arg.prevSelection);
    });
  }, []);
  return (
    <div className="fontStyle">
      {buttonGroup.map(({ icon: Icon, tooltip, isActive, action, value }) => (
        <Tooltip title={tooltip} key={value}>
          <Button onClick={() => action(editor)} color="default" variant={isStrongActive ? 'solid' : 'filled'} autoInsertSpace>
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default FontStyle;

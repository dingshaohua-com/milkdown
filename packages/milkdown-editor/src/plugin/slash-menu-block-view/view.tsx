import cs from 'classnames';
import { api } from './index';
import { slash } from './index';
import { creatNodeFn } from './type';
import { Ctx } from '@milkdown/kit/ctx';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import useEditorHelper from '../../utils/editor-helper/hook';
import { Node, ResolvedPos } from '@milkdown/kit/prose/model';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { EditorState, Selection, Transaction } from '@milkdown/kit/prose/state';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RiH1, RiH2, RiH3, RiTableLine, RiChatQuoteLine, RiSeparator, RiListUnordered, RiListOrdered, RiTodoLine, RiImageLine, RiFunctions, RiAddLine, RiDeleteBinLine, RiCodeLine } from '@remixicon/react';

const View = () => {
  const [insertPosVal, setInsertPosVal] = useState('bottom');
  const { editor, insert, loading, deleteNode } = useEditorHelper({
    afterAction: () => {
      hide();
    },
    insertPos: insertPosVal,
  });
  if (!insert) return null;
  const ref = useRef<HTMLDivElement>(null);
  const slashProvider = useRef<SlashProvider>(null);
  const { view, prevState } = usePluginViewContext();
  const hide = () => slashProvider.current?.hide();
  const show = (x: number, y: number) => {
    console.log(8989);
    
    if (!view || !ref.current) return;
    
    // // 获取编辑器容器的位置信息
    // const editorRect = view.dom.getBoundingClientRect();
    
    // // 使用传入的鼠标坐标，这些坐标已经是相对于视口的
    // const tooltipX = x - 100; // 向左偏移120px
    // const tooltipY = y - 20;  // 向上偏移10px
    
    // // 检查边界，确保工具提示不会超出视口
    // const tooltipWidth = 120; // 工具提示的宽度
    // const tooltipHeight = 200; // 工具提示的估计高度
    
    // // 如果工具提示会超出右边界，则向左调整
    // // if (tooltipX + tooltipWidth > window.innerWidth) {
    // //   ref.current.style.left = `${window.innerWidth - tooltipWidth - 10}px`;
    // // } else {
    // //   ref.current.style.left = `${tooltipX}px`;
    // // }
    // ref.current.style.left = `${tooltipX}px`;
    
    // // 如果工具提示会超出下边界，则向上调整
    // if (tooltipY + tooltipHeight > window.innerHeight) {
    //   ref.current.style.top = `${window.innerHeight - tooltipHeight - 50}px`;
    // } else {
    //   ref.current.style.top = `${tooltipY}px`;
    // }

    const { $anchor } = view.state.selection;
    const pos = view.coordsAtPos($anchor.pos);
    ref.current.style.top = `${pos.top - 10}px`;
    ref.current.style.left = `${pos.left - 180}px`;
    slashProvider.current?.show();
  };

  const initializeApi = useCallback(() => {
    try {
      // if (editor.ctx.get(api.key))  return;
      editor.ctx.set(api.key, {
        show: (x: number, y: number) => show(x, y),
        hide: () => hide(),
        ref
      });
    } catch (e) {
      // console.warn('HRM会导致 初始化api失败，这是正常现象:', e);
    }
  }, [editor]);

  useEffect(() => {
    initializeApi();
    const div = ref.current;
    if (loading || !div) return;
    slashProvider.current = new SlashProvider({
      content: div,
      trigger: '',
    });

    // 添加全局点击事件监听
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (div && !div.contains(target)) {
        hide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      slashProvider.current?.destroy();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loading]);

  // 禁用更新
  // useEffect(() => {
  //   if (view && prevState && slashProvider.current) {
  //     slashProvider.current.update(view, prevState);
  //   }
  // }, [view, prevState]);

  const insertPosNodes = [
    {
      label: '下',
      value: 'bottom',
    },
    {
      label: '中',
      value: 'center',
    },
    {
      label: '上',
      value: 'top',
    },
  ];

  const onInsertPosClick = (item: any) => {
    setInsertPosVal(item.value);
  };

  const onDelete = () => {
    deleteNode?.();
  };

  if (!editor) {
    return null;
  }
  return (
    <div className="slash-menu-block-view" ref={ref}>
      <div className="content">
        <div className="slash-view-content-item" onClick={onDelete}>
          <RiDeleteBinLine />
          删除
        </div>
        <div className="group">
          <div className="title">
            <RiAddLine />插
            <div className="title-radios">
              {insertPosNodes.map((it) => (
                <div className={cs('title-radio', { active: insertPosVal === it.value })} onClick={(e) => onInsertPosClick(it)} key={it.value}>
                  {it.label}
                </div>
              ))}
            </div>
          </div>
          <div className="items">
            <div className="item" onClick={insert.h1}>
              <RiH1 />
            </div>
            <div className="item" onClick={insert.h2}>
              <RiH2 />
            </div>
            <div className="item" onClick={insert.h3}>
              <RiH3 />
            </div>
            <div className="item" onClick={insert.tabel}>
              <RiTableLine />
            </div>
            <div className="item" onClick={insert.quote}>
              <RiChatQuoteLine />
            </div>
            <div className="item" onClick={insert.divider}>
              <RiSeparator />
            </div>
            <div className="item" onClick={insert.bulletList}>
              <RiListUnordered />
            </div>
            <div className="item" onClick={insert.orderList}>
              <RiListOrdered />
            </div>
            <div className="item" onClick={insert.todoList}>
              <RiTodoLine />
            </div>
            <div className="item" onClick={insert.img}>
              <RiImageLine />
            </div>
            <div className="item" onClick={insert.latex}>
              <RiFunctions />
            </div>
            <div className="item" onClick={insert.latex}>
              <RiCodeLine />
            </div>
          </div>
        </div>

        {/* <div className="group">
          <div className="title">转换为</div>
          <div className="items">
            <div className="item">
              <img src={boldImg} alt="" onClick={transformToBold} />
            </div>
            <div className="item">
              <img src={codeImg} alt="" onClick={transformToCode} />
            </div>
          </div>
        </div> */}

        {/* <div className="slash-view-content-item" onClick={insertTitle1}>
          转换为代码
        </div> */}
      </div>
    </div>
  );
};
export default View;

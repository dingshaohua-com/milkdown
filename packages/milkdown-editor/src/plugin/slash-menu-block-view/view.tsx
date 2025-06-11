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
import { codeImg, boldImg, tableImg, quoteImg, dividerImg, orderListImg, bulletListImg, todoListImg, imgImg, latexImg } from '../../utils/img-helper';

const View = () => {
  const { editor, insert, loading } = useEditorHelper();
  if (!insert) return null;

  const ref = useRef<HTMLDivElement>(null);
  const slashProvider = useRef<SlashProvider>(null);
  const { view, prevState } = usePluginViewContext();

  const show = () => {
    console.log(123);
    
    if (!view || !ref.current) return;
    const { selection } = view.state;
    const { $anchor } = selection;
    const pos = view.coordsAtPos($anchor.pos);
    ref.current.style.top = `${pos.top + 30}px`;
    ref.current.style.left = `${pos.left - 40}px`;
    setTimeout(() => {
      slashProvider.current?.show();
    }, 200);
  };

  const hide = () => slashProvider.current?.hide();

  const initialized = useRef(false);
  const initializeApi = useCallback(() => {
    // if (initialized.current) return;

    try {
      // if (editor.ctx.get(api.key)) {
      //   return;
      // }
      editor.ctx.set(api.key, {
        show: () => show(),
        hide: () => hide(),
      });
      console.log(editor.ctx.get(api.key))
     
      initialized.current = true
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
    return () => {
      slashProvider.current?.destroy();
      initialized.current = false;
    };
  }, [loading]);


  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

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

  const [insertPosVal, setInsertPosVal] = useState('bottom');
  const onClick = (item: any) => {
    setInsertPosVal(item.value);
  };

  if (!editor) {
    return null;
  }
  return (
    <div className="slash-menu-block-view" ref={ref}>
      <div className="content">
        {/* <div className="slash-view-content-item" onClick={onDelete}>
          删除
        </div> */}
        <div className="group">
          <div className="title">
            插到
            <div className="title-radios">
              {insertPosNodes.map((it) => (
                <div className={cs('title-radio', { active: insertPosVal === it.value })} onClick={() => onClick(it)} key={it.value} onMouseDownCapture={(e) => e.stopPropagation()}>
                  {it.label}
                </div>
              ))}
            </div>
          </div>
          <div className="items">
            <div className="item" onClick={insert.h1}>
              H1
            </div>
            <div className="item" onClick={insert.h2}>
              H2
            </div>
            <div className="item" onClick={insert.h3}>
              H3
            </div>
            <div className="item" onClick={insert.tabel}>
              <img src={tableImg} alt="" />
            </div>
            <div className="item" onClick={insert.quote}>
              <img src={quoteImg} alt="" />
            </div>
            <div className="item" onClick={insert.divider}>
              <img src={dividerImg} alt="" />
            </div>
            <div className="item" onClick={insert.bulletList}>
              <img src={bulletListImg} alt="" />
            </div>
            <div className="item" onClick={insert.orderList}>
              <img src={orderListImg} alt="" />
            </div>

            <div className="item" onClick={insert.todoList}>
              <img src={todoListImg} alt="" />
            </div>
            <div className="item" onClick={insert.img}>
              <img src={imgImg} alt="" />
            </div>
            <div className="item" onClick={insert.latex}>
              <img src={latexImg} alt="" style={{ height: 12 }} />
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

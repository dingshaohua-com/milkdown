import cs from 'classnames';

import { useState } from 'react';
import useEditorHelper from '../../utils/editor-helper/hook';
import { RiH1, RiH2, RiH3, RiTableLine, RiChatQuoteLine, RiSeparator, RiListUnordered, RiListOrdered, RiTodoLine, RiImageLine, RiFunctions, RiAddLine, RiDeleteBinLine, RiCodeLine } from '@remixicon/react';

function MenuView() {
  const [insertPosVal, setInsertPosVal] = useState('bottom');
  const { editor, insert, loading, deleteNode } = useEditorHelper({
    afterAction: () => {
      // hide();
      console.log(8989);
      
    },
    insertPos: insertPosVal,
  });
  if (!insert) return null;
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
    <div className="slash-menu-block-view">
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
}

export default MenuView;

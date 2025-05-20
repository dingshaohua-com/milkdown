import './style.scss';
import presets from './latex-presets';
import { useEffect, useState } from 'react';
import { RiFormula } from '@remixicon/react';
import emitter from '../../../utils/emitter';
import { Button, Popover, Tabs, TabsProps } from 'antd';

const Shape = ({ editor }) => {
  const [open, setOpen] = useState(false);

  const show = () => {
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const description = () => {
    const [mfPreviewVal, setMfPreviewVal] = useState('');
    const onChange = (key: string) => {
      console.log(key);
    };

    const onClickItem = (value) => {
      setMfPreviewVal(mfPreviewVal + value.latex);
    };
    const insertFormula = () => {
      if (pos) {
        editor.commands.updateFormula(pos, mfPreviewVal);
      } else {
        editor.commands.insertFormula(mfPreviewVal);
      }
      // editor.commands.blur();
      hide();
    };

    useEffect(() => {
      if (!open) {
        setPos(0);
        setMfPreviewVal('');
      }
    }, [open]);

    const [pos, setPos] = useState(0);
    useEffect(() => {
      emitter.on('formula-click', ({ content, pos }) => {
        if (Boolean(editor.isEditable)) {
          setPos(pos);
          setMfPreviewVal(content);
          show();
        }
      });
    }, []);

    const items: TabsProps['items'] = presets.map((item) => ({
      key: item.key,
      label: item.label,
      children: (
        <div className="custom-tabpanel" key={item.key}>
          {item.content.map((it) => (
            <div className="formula-item" key={it.latex}>
              {/* https://github.com/arnog/mathlive/issues/2102 */}
              <div
                className="formula-item-mask"
                onClick={() => {
                  onClickItem(it);
                }}
              ></div>
              <math-field contentEditable={false}>{it.latex}</math-field>
            </div>
          ))}
        </div>
      ),
    }));
    return (
      <div>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        <div className="mf-preview">
          <div className="mf-preview-title"> 预览：</div>
          <div className="mf">
            <math-field onInput={(evt) => setMfPreviewVal((evt.target as HTMLInputElement)?.value)}>{mfPreviewVal}</math-field>
          </div>
        </div>
        <div className="mf-preview-input">
          <div className="mf-preview-input-title"> 源码：</div>
          <input type="text" value={mfPreviewVal} onChange={(evt) => setMfPreviewVal(evt.target.value)} />
        </div>
        <div className="mf-preview-input-btn">
          <Button type="primary" onClick={insertFormula}>
            插入
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="formula">
      <Popover content={description} open={open} trigger="click" destroyOnHidden={true} onOpenChange={handleOpenChange} getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}>
        <Button onClick={show} color="default" variant="filled" autoInsertSpace>
          <RiFormula />
        </Button>
      </Popover>
    </div>
  );
};

export default Shape;

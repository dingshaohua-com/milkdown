import './style.scss';
import { Button, Popover } from 'antd';
import { useState } from 'react';
import { RiShapesLine } from '@remixicon/react';

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
    const urlBase = import.meta.env.BASE_URL + '/img/shape/';
    const items = [
      'circle',
      'square',
      'triangle',
      'trapezoid',
      'iphone',
      'star',
      'kefu',
    ];
    const onClickItem = (item) => {
      hide();
      editor.commands.setImage({ src: item });
    };

    return (
      <div className="shapItems">
        {items.map((item) => {
          const imgFullUrl = urlBase + item + '.svg';
          return (
            <div
              key={item}
              className="shapItem"
              onClick={() => {
                onClickItem(imgFullUrl);
              }}
            >
              <img src={imgFullUrl} alt={item} width={24} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="shap">
      <Popover content={description} title="" open={open} trigger="click"
        onOpenChange={handleOpenChange}>
        <Button
          onClick={show}
          color="default"
          variant="filled"
          autoInsertSpace
        >
          <RiShapesLine />
        </Button>
      </Popover>
    </div>
  );
};

export default Shape;

import { useState } from 'react';
import { RiFileImageLine } from '@remixicon/react';
import { Button, Tooltip, Popover, Input } from 'antd';
import { useFileUploader } from '../../../hooks/use-file-uploader';

function fileToBase64(file): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

const DesCmp = ({ editor, setOpen, uploadFileConfig }) => {
  const { inputRef, file, uploading, error, selectFile, onFileChange } = useFileUploader({
    // url: 'http://localhost:3002/file/upload',
    handler: uploadFileConfig.handler,
    // onProgress: (percent, file) => {
    //   console.log(`Uploading ${file.name}: ${percent}%`);
    // },
    onSuccess: (res, file) => {
      setOpen(false);

      const imgUrl = (uploadFileConfig.imgHost || '') + res;

      // 调用内置的 @tiptap/extension-image
      editor.chain().focus().setImage({ src: imgUrl }).run();
      if (uploadFileConfig.transformBase64) {
        fileToBase64(file).then((base64) => {
          uploadFileConfig.onSuccess && uploadFileConfig.onSuccess({ base64, file, url: imgUrl });
        });
      } else {
        uploadFileConfig.onSuccess && uploadFileConfig.onSuccess({ file, url: imgUrl });
      }
    },
    onError: (err, file) => {
      console.error(`Failed to upload ${file.name}`, err);
    },
  });
  // http://localhost:3003/assets/images/fe-fw-lib-7961ee52ada77d43b6b3d68daef3794d.png
  const onSelectFile = () => {
    selectFile();
  };

  const insertNetImg = () => {
    if (netImg) {
      editor.chain().focus().setImage({ src: netImg }).run();
      setOpen(false);
    } else {
      alert('图片地址为空！');
    }
  };

  const [netImg, setNetImg] = useState();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Input
        value={netImg}
        onChange={(e: any) => setNetImg(e.target.value)}
        style={{ width: '120px' }}
        addonAfter={
          <span style={{ cursor: 'pointer' }} onClick={insertNetImg}>
            确定
          </span>
        }
        placeholder="网络地址"
      />
      或
      <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onSelectFile}>
        本地上传
      </span>
      {/* 渲染隐藏的input元素 */}
      <input type="file" ref={inputRef} onChange={onFileChange} style={{ display: 'none' }} multiple />
    </div>
  );
};

const imgUpload = ({ editor, uploadFileConfig }) => {
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

  // useEffect(() => {
  //   !uploadFileConfig.handler && console.error('既然开启了图片上传能力，请完善图片上传配置');
  // }, [uploadFileConfig]);


  return (
    <div className="fontStyle">
      {uploadFileConfig.handler ? (
        <Tooltip title="图片">
          <Popover content={<DesCmp editor={editor} setOpen={setOpen} uploadFileConfig={uploadFileConfig} />} title="" open={open} trigger="click" destroyOnHidden={true} onOpenChange={handleOpenChange} getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}>
            <Button onClick={show} color="default" variant="filled" autoInsertSpace>
              <RiFileImageLine />
            </Button>
          </Popover>
        </Tooltip>
      ) : (
        <Button color="default" variant="filled" autoInsertSpace style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <RiFileImageLine />
        </Button>
      )}
    </div>
  );
};

export default imgUpload;

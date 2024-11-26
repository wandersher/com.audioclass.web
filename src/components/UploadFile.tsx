import { Upload } from 'antd'
import { ReactElement } from 'react'
import Icons from './Icons'

type UploadFile = {
  accept?: string
  icon?: ReactElement
  onSelect: (file: ArrayBuffer) => any
}

export default function UploadFile(props: UploadFile) {
  const { accept, icon, onSelect } = props
  return (
    <Upload.Dragger
      name={'file'}
      accept={accept}
      beforeUpload={async file => {
        onSelect(await file.arrayBuffer())
        return Upload.LIST_IGNORE
      }}
    >
      <p className="ant-upload-drag-icon">{icon ?? <Icons.FileAttachment size={48} />}</p>
      <p className="ant-upload-text">Натисніть щоб обрати або перетягнуть сюди файл</p>
      <p className="ant-upload-hint">Підтримуються наступні формати: {accept}</p>
    </Upload.Dragger>
  )
}

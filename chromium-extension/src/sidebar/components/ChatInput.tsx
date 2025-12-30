import React, { useRef } from "react";
import {
  SendOutlined,
  StopOutlined,
  FileOutlined,
  DeleteOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import type { UploadedFile } from "../types";
import { Button, Space, Image, Typography } from "antd";
import { WebpageMentionInput } from "./WebpageMentionInput";

const { Text } = Typography;

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileId: string) => void;
  uploadedFiles: UploadedFile[];
  sending: boolean;
  currentMessageId: string | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSend,
  onStop,
  onFileSelect,
  onRemoveFile,
  uploadedFiles,
  sending,
  currentMessageId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 bg-gray-100">
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mb-3">
          <Space wrap>
            {uploadedFiles.map((file) => {
              const isImage = file.mimeType.startsWith("image/");
              return (
                <div
                  key={file.id}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 rounded border border-gray-200"
                >
                  {isImage ? (
                    <Image
                      src={
                        file.url
                          ? file.url
                          : `data:${file.mimeType};base64,${file.base64Data}`
                      }
                      alt={file.filename}
                      className="w-10 h-10 object-cover rounded mr-2"
                      preview={false}
                    />
                  ) : (
                    <FileOutlined className="mr-2" />
                  )}
                  <Text className="text-xs mr-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {file.filename}
                  </Text>
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveFile(file.id)}
                    className="p-0 w-5 h-5"
                  />
                </div>
              );
            })}
          </Space>
        </div>
      )}

      {/* Floating Chat Input Box */}
      <div className="relative bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.docx,.xlsx,.txt,.md,.json"
          onChange={onFileSelect}
          className="hidden"
        />

        {/* Input Area */}
        <div className="px-4 pt-3 pb-12">
          <WebpageMentionInput
            value={inputValue}
            onChange={onInputChange}
            disabled={sending || currentMessageId !== null}
            onSend={onSend}
          />
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2">
          {/* Left: Attachment Button */}
          <Button
            type="text"
            icon={<PaperClipOutlined />}
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || currentMessageId !== null}
            className="text-gray-500 hover:text-gray-700"
          />

          {/* Right: Send/Stop Button */}
          {currentMessageId ? (
            <Button
              type="text"
              danger
              icon={<StopOutlined />}
              onClick={onStop}
              className="text-red-500 hover:text-red-600"
            />
          ) : (
            <Button
              type="text"
              icon={<SendOutlined />}
              onClick={onSend}
              loading={sending}
              disabled={
                (!inputValue.trim() && uploadedFiles.length === 0) || sending
              }
              className="text-blue-500 hover:text-blue-600 disabled:text-gray-300"
            />
          )}
        </div>
      </div>
    </div>
  );
};

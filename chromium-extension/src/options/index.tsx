import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Form, Input, Button, message, Card, Select, AutoComplete, Tooltip } from "antd";
import { Settings } from "lucide-react";
import "./styles/options.css";

const { Option } = Select;

const OptionsPage = () => {
  const [form] = Form.useForm();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [config, setConfig] = useState({
    provider: "anthropic",
    apiKey: "",
    modelName: "claude-sonnet-4-5-20250929",
    options: {
      baseURL: "https://api.anthropic.com/v1",
    },
  });

  const [agentConfig, setAgentConfig] = useState({
    mode: "normal" as "fast" | "normal" | "expert",
    markImageMode: "dom" as "dom" | "draw",
  });

  const [customModels, setCustomModels] = useState<Record<string, string[]>>({});

  useEffect(() => {
    chrome.storage.sync.get(["llmConfig", "agentConfig", "customModels"], (result) => {
      if (result.llmConfig) {
        if (result.llmConfig.provider === "") {
          result.llmConfig.provider = "anthropic";
        }
        setConfig(result.llmConfig);
        form.setFieldsValue(result.llmConfig);
      }
      if (result.agentConfig) {
        setAgentConfig(result.agentConfig);
        form.setFieldsValue(result.agentConfig);
      }
      if (result.customModels) {
        setCustomModels(result.customModels);
      }
    });
  }, []);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const llmConfig = {
          provider: values.provider,
          apiKey: values.apiKey,
          modelName: values.modelName,
          options: values.options,
        };
        const agentConfig = {
          mode: values.mode,
          markImageMode: values.markImageMode,
        };
        const updatedCustomModels = { ...customModels };
        const currentProvider = values.provider;
        const currentModel = values.modelName;

        const defaultModels = modelOptions[currentProvider]?.map(m => m.value) || [];
        if (!defaultModels.includes(currentModel)) {
          if (!updatedCustomModels[currentProvider]) {
            updatedCustomModels[currentProvider] = [];
          }
          if (!updatedCustomModels[currentProvider].includes(currentModel)) {
            updatedCustomModels[currentProvider].push(currentModel);
          }
        }

        setConfig(llmConfig);
        setAgentConfig(agentConfig);
        setCustomModels(updatedCustomModels);

        chrome.storage.sync.set(
          {
            llmConfig,
            agentConfig,
            customModels: updatedCustomModels,
          },
          () => {
            message.success("Save Success!");
            chrome.runtime.sendMessage({
              type: "update_mode",
              mode: agentConfig.mode,
              markImageMode: agentConfig.markImageMode
            });
          }
        );
      })
      .catch(() => {
        message.error("Please check the form field");
      });
  };

  const modelLLMs = [
    { value: "anthropic", label: "Anthropic (default)" },
    { value: "openai", label: "OpenAI" },
    { value: "google", label: "Google Gemini" },
    { value: "opencode", label: "OpenCode Zen" },
    { value: "openrouter", label: "OpenRouter" },
  ];

  const modelOptions = {
    anthropic: [
      { value: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5 (default)" },
      { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
      { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
      { value: "claude-opus-4-5-20251124", label: "Claude Opus 4.5" },
      { value: "claude-opus-4-1", label: "Claude Opus 4.1" },
    ],
    openai: [
      { value: "gpt-5.2", label: "GPT-5.2 (default)" },
      { value: "gpt-5.1", label: "GPT-5.1" },
      { value: "gpt-5", label: "GPT-5" },
      { value: "gpt-5-mini", label: "GPT-5 Mini" },
      { value: "gpt-5-nano", label: "GPT-5 Nano" },
      { value: "gpt-5-pro", label: "GPT-5 Pro" },
      { value: "gpt-5-codex", label: "GPT-5 Codex" },
      { value: "gpt-5.1-codex", label: "GPT-5.1 Codex" },
      { value: "gpt-5.1-codex-max", label: "GPT-5.1 Codex Max" },
      { value: "gpt-5.1-codex-mini", label: "GPT-5.1 Codex Mini" },
      { value: "gpt-5.2-pro", label: "GPT-5.2 Pro" },
      { value: "gpt-4.1", label: "GPT-4.1" },
      { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
      { value: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini" },
      { value: "o1", label: "o1" },
      { value: "o3-mini", label: "o3-mini" },
      { value: "o3-pro", label: "o3-pro" },
      { value: "o4-mini", label: "o4-mini" },
      { value: "o4-mini-deep-research", label: "o4-mini Deep Research" },
    ],
    google: [
      { value: "gemini-3-pro-preview", label: "Gemini 3 Pro Preview (default)" },
      { value: "gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
      { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { value: "gemini-2.5-pro-preview-05-06", label: "Gemini 2.5 Pro Preview 05-06" },
      { value: "gemini-2.5-pro-preview-06-05", label: "Gemini 2.5 Pro Preview 06-05" },
      { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
      { value: "gemini-2.5-flash-preview-04-17", label: "Gemini 2.5 Flash Preview 04-17" },
      { value: "gemini-2.5-flash-preview-05-20", label: "Gemini 2.5 Flash Preview 05-20" },
      { value: "gemini-2.5-flash-preview-09-2025", label: "Gemini 2.5 Flash Preview 09-25" },
      { value: "gemini-2.5-flash-lite-preview-06-17", label: "Gemini 2.5 Flash Lite Preview 06-17" },
      { value: "gemini-2.5-flash-lite-preview-09-2025", label: "Gemini 2.5 Flash Lite Preview 09-25" },
      { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
      { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
      { value: "gemini-1.5-flash-8b", label: "Gemini 1.5 Flash-8B" },
      { value: "gemini-flash-latest", label: "Gemini Flash Latest" },
      { value: "gemini-flash-lite-latest", label: "Gemini Flash-Lite Latest" },
      { value: "gemini-live-2.5-flash", label: "Gemini Live 2.5 Flash" },
      { value: "gemini-live-2.5-flash-preview-native-audio", label: "Gemini Live 2.5 Flash Preview Native Audio" },
    ],
    opencode: [
      { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5 (default)" },
      { value: "claude-sonnet-4", label: "Claude Sonnet 4" },
      { value: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
      { value: "claude-opus-4-5", label: "Claude Opus 4.5" },
      { value: "claude-opus-4-1", label: "Claude Opus 4.1" },
      { value: "gemini-3-pro", label: "Gemini 3 Pro" },
      { value: "gemini-3-flash", label: "Gemini 3 Flash" },
      { value: "gpt-5.2", label: "GPT 5.2" },
      { value: "gpt-5.1", label: "GPT 5.1" },
      { value: "gpt-5", label: "GPT 5" },
      { value: "gpt-5-nano", label: "GPT 5 Nano" },
      { value: "gpt-5-codex", label: "GPT 5 Codex" },
      { value: "gpt-5.1-codex", label: "GPT 5.1 Codex" },
      { value: "gpt-5.1-codex-max", label: "GPT 5.1 Codex Max" },
    ],
    openrouter: [
      { value: "openai/gpt-4", label: "GPT-4 (default)" },
      { value: "openai/gpt-4-32k", label: "GPT-4 32K" },
      { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
      { value: "google/gemini-pro-1.5", label: "Gemini Pro 1.5" },
    ],
  };

  const handleLLMChange = (value: string) => {
    const baseURLMap = {
      anthropic: "https://api.anthropic.com",
      openai: "https://api.openai.com/v1",
      google: "https://generativelanguage.googleapis.com/v1beta/openai/",
      opencode: "https://opencode.ai/zen/v1",
      openrouter: "https://openrouter.ai/api/v1",
    };
    const newConfig = {
      provider: value,
      apiKey: "",
      modelName: modelOptions[value][0].value,
      options: {
        baseURL: baseURLMap[value]
      },
    };
    setConfig(newConfig);
    form.setFieldsValue(newConfig);
  };

  return (
    <div className="options-container">
      <div className="options-header">
        <h1 className="options-title">OpenBrowser Settings</h1>
        <p className="options-subtitle">Configure your AI model and API settings</p>
      </div>
      <Card title="Agent Configuration" className="shadow-md" style={{ marginBottom: "20px" }}>
        <Form form={form} layout="vertical" initialValues={{ ...config, ...agentConfig }}>
          <Form.Item
            name="mode"
            label="Agent Mode"
            rules={[
              {
                required: true,
                message: "Please select an agent mode",
              },
            ]}
          >
            <Select placeholder="Choose agent mode">
              <Option value="fast">Fast - Quick responses with basic reasoning</Option>
              <Option value="normal">Normal - Balanced performance and accuracy</Option>
              <Option value="expert">Expert - Deep reasoning and complex tasks</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="markImageMode"
            label="Visual Marking Mode"
            rules={[
              {
                required: true,
                message: "Please select a marking mode",
              },
            ]}
          >
            <Select placeholder="Choose marking mode">
              <Option value="dom">DOM - Use DOM tree for element detection</Option>
              <Option value="draw">Draw - Use visual drawing for element marking</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Model Configuration" className="shadow-md">
        <Form form={form} layout="vertical" initialValues={{ ...config, ...agentConfig }}>
          <Form.Item
            name="provider"
            label={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                Provider
                <Tooltip title="Advanced Settings">
                  <Settings
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{ cursor: "pointer" }}
                    size={16}
                  />
                </Tooltip>
              </div>
            }
            rules={[
              {
                required: true,
                message: "Please select a provider",
              },
            ]}
          >
            <Select placeholder="Choose a provider" onChange={handleLLMChange}>
              {modelLLMs.map((llm) => (
                <Option key={llm.value} value={llm.value}>
                  {llm.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {showAdvanced && (
            <Form.Item
              name={["options", "baseURL"]}
              label="Base URL"
              rules={[
                {
                  required: true,
                  message: "Please enter the base URL",
                },
              ]}
            >
              <Input placeholder="Please enter the base URL" />
            </Form.Item>
          )}

          <Form.Item
            name="modelName"
            label="Model Name"
            rules={[
              {
                required: true,
                message: "Please select a model",
              },
            ]}
          >
            <AutoComplete
              placeholder="Model name"
              options={[
                ...(modelOptions[config.provider] || []),
                ...(customModels[config.provider] || []).map(model => ({ value: model, label: model }))
              ]}
              filterOption={(inputValue, option) =>
                (option.value as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[
              {
                required: true,
                message: "Please enter the API Key",
              },
            ]}
          >
            <Input.Password placeholder="Please enter the API Key" allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSave} block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);

"use client";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OpenAIConfigProps {
  openaiApiKey: string;
  openaiModel: string;
  onInputChange: (value: string, field: string) => void;
}

export default function OpenAIConfig({
  openaiApiKey,
  openaiModel,
  onInputChange
}: OpenAIConfigProps) {
  const [openModelSelect, setOpenModelSelect] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsChecked, setModelsChecked] = useState(false);
  const [apiKey, setApiKey] = useState(openaiApiKey);

  const openaiUrl = "https://api.openai.com/v1";

  useEffect(() => {
    setAvailableModels([]);
    setModelsChecked(false);
    onInputChange("", "openai_model");
  }, [apiKey]);

  const onApiKeyChange = (value: string) => {
    setApiKey(value);
    onInputChange(value, "openai_api_key");
  };

  const fetchAvailableModels = async () => {
    if (!openaiApiKey) return;

    setModelsLoading(true);
    try {
      const response = await fetch('/api/v1/ppt/openai/models/available', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: openaiUrl,
          api_key: openaiApiKey
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data);
        setModelsChecked(true);
        onInputChange("gpt-4.1", "openai_model");
      } else {
        console.error('Failed to fetch models');
        setAvailableModels([]);
        setModelsChecked(true);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Error fetching models');
      setAvailableModels([]);
      setModelsChecked(true);
    } finally {
      setModelsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OpenAI API Key
        </label>
        <div className="relative">
          <input
            type="text"
            value={openaiApiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="w-full px-4 py-2.5 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            placeholder="Enter your API key"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <span className="block w-1 h-1 rounded-full bg-gray-400"></span>
          Your API key will be stored locally and never shared
        </p>
      </div>



      {/* Check for available models button - show when no models checked or no models found */}
      {(!modelsChecked || (modelsChecked && availableModels.length === 0)) && (
        <div className="mb-4">
          <button
            onClick={fetchAvailableModels}
            disabled={modelsLoading || !openaiApiKey}
            className={`w-full py-2.5 px-4 rounded-lg transition-all duration-200 border-2 ${modelsLoading || !openaiApiKey
              ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500"
              : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500/20"
              }`}
          >
            {modelsLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking for models...
              </div>
            ) : (
              "Check for available models"
            )}
          </button>
        </div>
      )}

      {/* Show message if no models found */}
      {modelsChecked && availableModels.length === 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            No models found. Please make sure your API key is valid and has access to OpenAI models.
          </p>
        </div>
      )}

      {/* Model Selection - only show if models are available */}
      {modelsChecked && availableModels.length > 0 ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select OpenAI Model
          </label>
          <div className="w-full">
            <Popover
              open={openModelSelect}
              onOpenChange={setOpenModelSelect}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openModelSelect}
                  className="w-full h-12 px-4 py-4 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors hover:border-gray-400 justify-between"
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {openaiModel
                        ? availableModels.find(model => model === openaiModel) || openaiModel
                        : "Select a model"}
                    </span>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandInput placeholder="Search models..." />
                  <CommandList>
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                      {availableModels.map((model, index) => (
                        <CommandItem
                          key={index}
                          value={model}
                          onSelect={(value) => {
                            onInputChange(value, "openai_model");
                            setOpenModelSelect(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              openaiModel === model
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex gap-3 items-center">
                            <div className="flex flex-col space-y-1 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {model}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ) : null}
    </div>
  );
}
import { useRef, useEffect, DependencyList, MutableRefObject } from "react";

export const useAutoScroll = (
  dependencies: DependencyList,
  skipScrollRef?: MutableRefObject<boolean>
) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Skip scroll if we're loading older messages
    if (skipScrollRef?.current) {
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, dependencies);

  return messagesEndRef;
};

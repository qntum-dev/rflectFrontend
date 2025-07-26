import React, { useRef, useEffect, Dispatch, SetStateAction, useState, useCallback } from 'react';
import { SendHorizonal } from 'lucide-react';

const ChatInputBox = ({
    newMessage,
    setNewMessage,
    handleSendMessage
}: {
    newMessage: string,
    setNewMessage: Dispatch<SetStateAction<string>>,
    handleSendMessage: () => void
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [bottomInset, setBottomInset] = useState(0);
    const isKeyboardOpenRef = useRef(false); // Track keyboard state

    // Function to resize the textarea
    const resizeTextarea = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '40px'; // Reset to min height
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 200;
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
    }, []);

    // Effect for initial focus and textarea resize on mount
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.focus();
            resizeTextarea(); // Initial resize
        }
    }, [resizeTextarea]);

    // Visual viewport listener to adjust padding when keyboard opens
    useEffect(() => {
        const vv = window.visualViewport;
        if (vv) {
            const handleViewportChange = () => {
                const heightDiff = window.innerHeight - vv.height;
                // Consider a small threshold for height difference to account for browser UI or subtle changes
                // If heightDiff is significant, keyboard is likely open
                if (heightDiff > 100) { // Arbitrary threshold, adjust if needed
                    setBottomInset(heightDiff);
                    isKeyboardOpenRef.current = true;
                } else {
                    setBottomInset(0); // Keyboard is closed or nearly closed
                    isKeyboardOpenRef.current = false;
                }
            };

            // Using 'resize' is usually sufficient for keyboard detection
            vv.addEventListener('resize', handleViewportChange);

            return () => {
                vv.removeEventListener('resize', handleViewportChange);
            };
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        // resizeTextarea will be called via useEffect on newMessage change
    };

    // New function to handle sending message and keeping focus
    const handleSendMessageAndKeepFocus = () => {
        if (newMessage.trim() === '') {
            return; // Prevent sending empty messages
        }
        handleSendMessage();
        // Immediately refocus and resize after sending
        // Use a slight delay if refocusing causes issues with input clearing,
        // but typically direct focus works best.
        if (textareaRef.current) {
            textareaRef.current.focus();
            resizeTextarea(); // Ensure textarea resizes correctly after clearing content
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessageAndKeepFocus();
        }
    };

    // Effect to resize textarea whenever newMessage changes
    useEffect(() => {
        resizeTextarea();
    }, [newMessage, resizeTextarea]);

    const handleFocus = () => {
        // Only scroll into view if the keyboard is not already detected as open
        // This prevents unnecessary scrolling when the keyboard is already up
        if (!isKeyboardOpenRef.current && textareaRef.current) {
            textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col justify-between"
            style={{ paddingBottom: bottomInset }}
        >
            {/* Input */}
            <div className="border-t bg-secondary">
                <div className="p-2 lg:p-4">
                    <div className="flex items-end bg-white rounded-md px-4 py-2 shadow-md lg:mx-12">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                className="w-full border-none focus:ring-0 focus:outline-none text-base bg-transparent text-black placeholder-transparent caret-accent resize-none leading-6"
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={handleFocus}
                                rows={1}
                                style={{
                                    minHeight: '40px',
                                    lineHeight: '20px',
                                    padding: '10px 0',
                                    fontSize: '16px',
                                }}
                            />
                            {!newMessage && (
                                <div
                                    className="absolute top-0 left-0 pointer-events-none select-none text-[#8696A0]"
                                    style={{
                                        fontSize: '16px',
                                        padding: '10px 0',
                                    }}
                                >
                                    Type a message
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSendMessageAndKeepFocus}
                            className="ml-2 bg-[#0a2259] hover:bg-[#0a1e4d] text-white p-2 rounded-full transition-colors cursor-pointer flex-shrink-0"
                            title="Send Message"
                            // Disable button if message is empty to prevent sending empty messages
                            disabled={newMessage.trim() === ''}
                        >
                            <SendHorizonal size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInputBox;
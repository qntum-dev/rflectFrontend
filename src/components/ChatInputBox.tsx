import React, { useRef, useEffect, Dispatch, SetStateAction, useState } from 'react';
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
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.readOnly = true;
            textarea.focus();
            textarea.readOnly = false;
        }
    }, []);
    // Visual viewport listener to adjust padding when keyboard opens
    useEffect(() => {

        const vv = window.visualViewport;
        if (vv) {

            const handleViewportResize = () => {
                const heightDiff = vv.height < window.innerHeight ? window.innerHeight - vv.height : 0;
                setBottomInset(heightDiff);
            };

            vv.addEventListener('resize', handleViewportResize);
            vv.addEventListener('scroll', handleViewportResize);

            return () => {
                vv.removeEventListener('resize', handleViewportResize);
                vv.removeEventListener('scroll', handleViewportResize);
            };
        }

    }, []);

    const resizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '40px';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 200;
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        resizeTextarea();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        resizeTextarea();
    }, [newMessage]);

    const handleFocus = () => {
        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col justify-between "
            style={{ paddingBottom: bottomInset }}
        >
            {/* Chat Messages */}


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
                            onClick={handleSendMessage}
                            className="ml-2 bg-[#0a2259] hover:bg-[#0a1e4d] text-white p-2 rounded-full transition-colors cursor-pointer flex-shrink-0"
                            title="Send Message"
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
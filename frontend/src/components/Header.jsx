import React from 'react';

const MessageIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={className}
    >
        <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"/>
    </svg>
);

export function Header() {
    return (
        <div className="space-y-7 flex flex-col items-start w-full">
            {/* Логотип-контейнер */}
            <div className="p-3 bg-brand-accent rounded-xl">
                <MessageIcon className="w-7 h-7 text-white"/>
            </div>

            {/* Текстовый блок */}
            <div className="space-y-5 w-full max-w-xl">
                <p className="text-3xl font-medium tracking-tight">Hi there!</p>
                <h1 className="text-4xl font-[500] text-white tracking-tighter">
                    What would you like to know?
                </h1>
                <p className="text-base text-brand-muted mt-4 max-w-md">
                    Use one of the most common prompts below or ask your own question
                </p>
            </div>
        </div>
    );
}
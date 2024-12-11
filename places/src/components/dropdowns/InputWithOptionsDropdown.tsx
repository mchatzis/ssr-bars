'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props<P extends string> {
    className?: string;
    allOptions: P[];
    currentChoice: P;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}
export default function InputWithOptionsDropdown<P extends string>({ className = '', allOptions, currentChoice, value, setValue }: Props<P>) {
    const [focused, setFocused] = useState(false);
    const [options, setOptions] = useState(allOptions);

    useEffect(() => {
        let filteredSuggestions = allOptions;

        if (value.trim() !== "") {
            filteredSuggestions = filteredSuggestions.filter(suggestion => {
                return suggestion.includes(value);
            });
        }

        setOptions(filteredSuggestions);
    }, [value])

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
        e.target.setAttribute('placeholder', '');
        setFocused(true);
    }
    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        e.target.setAttribute('placeholder', currentChoice);
        setFocused(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setValue(value);
    };

    return (
        <div className={`h-[3vh] w-[8vw] ${className}`}>
            <input
                className="h-full w-full bg-[var(--background)] border border-gray-300 rounded-md focus:outline-none
                  placeholder-gray-500 pl-2"
                type="text"
                value={value}
                placeholder={currentChoice}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleInputChange}
            />
            {focused ? <DropDown options={options} setValue={setValue} /> : null}
        </div>
    )
}

interface DropdownProps {
    options: string[];
    setValue: Dispatch<SetStateAction<string>>;
}
export function DropDown({ options, setValue }: DropdownProps) {
    return (
        <div className="w-full h-[13vh] relative z-[var(--z-popup)]">
            <ul className='w-full h-full text-sm text-gray-700 bg-white rounded-lg shadow overflow-y-scroll'>
                {options.map((option, index) => {
                    return (
                        <li
                            key={index}
                            className='block px-1 py-1 hover:bg-gray-200 hover:rounded-lg'
                            onMouseDown={() => setValue(option)}
                        >{option}</li>
                    );
                })}
            </ul>
        </div>
    )
}
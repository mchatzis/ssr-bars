'use client'

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

interface Props {
    className?: string;
    allOptions: string[];
    currentChoice: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}
export default function InputWithOptionsDropdown({ className = '', allOptions, currentChoice, value, setValue }: Props) {
    const [focused, setFocused] = useState(false);
    const [options, setOptions] = useState(allOptions);
    const [placeholder, setPlaceHolder] = useState('');

    useEffect(() => {
        let filteredSuggestions = allOptions;

        if (value.trim() !== "") {
            filteredSuggestions = filteredSuggestions.filter(suggestion => {
                return suggestion.includes(value);
            });
        }

        setOptions(filteredSuggestions);
    }, [value, allOptions])

    // Need this because using currentChoice directly would cause a hydration issue.
    useEffect(() => {
        setPlaceHolder(currentChoice);
    }, [currentChoice])

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setPlaceHolder('');
        setFocused(true);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setPlaceHolder(currentChoice);
        setFocused(false);
    }, [currentChoice]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
    }, []);

    return (
        <div className={`h-7 w-36 ${className}`}>
            <input
                className="h-full w-full bg-[var(--background)] border border-[var(--accent-color)] rounded-full focus:outline-none
                  placeholder-gray-500 pl-3"
                type="text"
                value={value}
                placeholder={placeholder}
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
        <div className="w-full h-fit max-h-[15vh] relative z-[var(--z-popup)] rounded-xl overflow-y-scroll bg-white">
            <ul className='w-full h-full text-base text-gray-700'>
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
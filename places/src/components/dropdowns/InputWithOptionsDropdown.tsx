'use client'

import { DropDown } from "@/components/dropdowns/DropDown";
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

    const handleFocus = useCallback(() => {
        setPlaceHolder('');
        setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
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
                className="h-full w-full bg-transparent border border-accent rounded-full focus:outline-none
                  placeholder-textColor/60 pl-3 backdrop-blur-[1px]"
                type="text"
                value={value}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleInputChange}
            />
            {focused &&
                <DropDown
                    options={options}
                    onMouseDown={(option: string) => setValue(option)}
                />
            }
        </div>
    )
}
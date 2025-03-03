'use client'

import { DropDown } from "@/components/dropdowns/DropDown";
import usePlaceholderFadeIn from "@/hooks/usePlaceholderFadeIn";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";

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
    const placeholderClass = usePlaceholderFadeIn();

    const enclosingDivRef = useRef<HTMLDivElement>(null);
    useClickAway(enclosingDivRef, () => {
        setPlaceHolder(currentChoice);
        setFocused(false);
    })

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

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
    }, []);

    const handleClickOption = useCallback((e: React.MouseEvent, option: string) => {
        e.preventDefault(); //Prevent context menu when right clicking
        setValue(option)
        setFocused(false);
    }, []);

    return (
        <div ref={enclosingDivRef} className={`h-7 w-36 ${className}`}>
            <input
                className={`h-full w-full bg-transparent border border-primary rounded-full focus:outline-none
                  pl-3 backdrop-blur-[1px] ${placeholderClass}`}
                type="text"
                value={value}
                placeholder={placeholder}
                onFocus={handleFocus}
                onChange={handleInputChange}
            />
            {focused &&
                <DropDown
                    options={options}
                    onClick={handleClickOption}
                    onContextMenu={handleClickOption}
                />
            }
        </div>
    )
}
'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectAppAvailableCategories, selectCachedCategories, setActiveCategories, setCachedCategories } from '@/lib/redux/slices/appStateSlice';
import { useCallback, useEffect, useRef, useState } from "react";
import useClickAway from 'react-use/lib/useClickAway';
import { DropDown } from './DropDown';


export default function FilterCategoryDropdown({ className = '' }) {
    const dispatch = useAppDispatch();
    const availableCategories = useAppSelector(selectAppAvailableCategories);
    const activeCategories = useAppSelector(selectAppActiveCategories);
    const cachedCategories = useAppSelector(selectCachedCategories);

    const [allDropdownOptions, setAllDropdownOptions] = useState<string[]>([]);
    const [recentCategories, setRecentCategories] = useState<string[]>([]);

    useEffect(() => {
        setRecentCategories(cachedCategories.filter((category) => !activeCategories.includes(category)))
    }, [activeCategories])

    useEffect(() => {
        const availableMinusActiveMinusCached = availableCategories
            .filter((category) => !activeCategories.includes(category))
            .filter((category) => !cachedCategories.includes(category));

        setAllDropdownOptions(availableMinusActiveMinusCached);
    }, [availableCategories, activeCategories])

    const handleOptionClick = useCallback((inputCategory: string) => {
        dispatch(setActiveCategories([...activeCategories, inputCategory]))

        if (!cachedCategories.includes(inputCategory)) {
            dispatch(setCachedCategories([...cachedCategories, inputCategory]));
        }
    }, [activeCategories, cachedCategories]);

    const handleActiveCategoriesClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const inputCategory = e.currentTarget.innerText;

        dispatch(setActiveCategories(activeCategories.filter((category) => category !== inputCategory)));
    }, [activeCategories]);

    const handleRecentCategoriesClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const inputCategory = e.currentTarget.innerText;

        dispatch(setActiveCategories([...activeCategories, inputCategory]));
    }, [activeCategories])

    return (
        <div className={`${className}`}>
            <InputField
                allOptions={allDropdownOptions}
                placeholder='Categories...'
                onClick={handleOptionClick}
            />
            {activeCategories.map((category) =>
                <button
                    className={`block w-36 bg-accent text-black rounded-xl
                    border border-accent m-3`}
                    key={category}
                    onClick={handleActiveCategoriesClick}
                >
                    {category}
                </button>
            )}
            <hr className='m-3 border border-accent'></hr>
            {recentCategories.map((category) =>
                <button
                    className={`block w-36 text-accent rounded-xl
                    border border-accent m-3`}
                    key={category}
                    onClick={handleRecentCategoriesClick}
                >
                    {category}
                </button>
            )}
        </div>
    )
}

interface InputFieldProps {
    allOptions: string[];
    placeholder?: string;
    onClick: (option: string) => any;
}
function InputField({ allOptions, placeholder = '', onClick }: InputFieldProps) {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);

    const enclosingDivRef = useRef<HTMLDivElement>(null);
    useClickAway(enclosingDivRef, () => {
        setValue('');
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

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.target.setAttribute('placeholder', '');
        setFocused(true);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.target.setAttribute('placeholder', placeholder);
        setFocused(false);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
    }, []);

    return (
        <div ref={enclosingDivRef}>
            <input
                className="h-full w-36 bg-transparent border border-accent rounded-full focus:outline-none
                  placeholder-textColor/50 px-3 py-1 m-3"
                value={value}
                type="text"
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleInputChange}
            />
            {focused &&
                <DropDown
                    options={options}
                    onMouseDown={onClick}
                />
            }
        </div>
    )
}

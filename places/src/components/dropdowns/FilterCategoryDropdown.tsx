'use client'

import usePlaceholderFadeIn from '@/lib/hooks/usePlaceholderFadeIn';
import { getOperationFromButton } from '@/lib/map/helpers';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { FilterOperation, selectAppActiveCategories, selectAppAvailableCategories, selectCachedCategories, setActiveCategories, setCachedCategories } from '@/lib/redux/slices/appStateSlice';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
        setRecentCategories(cachedCategories.filter((cachedCategory) =>
            !activeCategories.some((activeCategory) => activeCategory.name === cachedCategory))
        )
    }, [activeCategories])

    useEffect(() => {
        const availableMinusActiveMinusCachedCategories = availableCategories
            .filter((availableCategory) => !activeCategories.some((activeCategory) => activeCategory.name === availableCategory))
            .filter((category) => !cachedCategories.includes(category));

        setAllDropdownOptions(availableMinusActiveMinusCachedCategories);
    }, [availableCategories, activeCategories])

    const activateClickedCategory =
        useCallback(({ chosenCategory, pressedButton }: { chosenCategory: string, pressedButton: number }) => {
            let operation = getOperationFromButton(pressedButton);
            if (!operation) { return }
            if (activeCategories.length === 0) {
                operation = 'or'; // First activated category is always or
            }

            dispatch(setActiveCategories([...activeCategories, { name: chosenCategory, operation }]))

            if (!cachedCategories.includes(chosenCategory)) {
                dispatch(setCachedCategories([...cachedCategories, chosenCategory]));
            }
        }, [activeCategories, cachedCategories]);

    const handleClickActiveCategories = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const inputCategory = e.currentTarget.innerText;

        dispatch(setActiveCategories(activeCategories.filter((category) => category.name !== inputCategory)));
    }, [activeCategories]);

    const handleClickRecentCategories = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        let operation = getOperationFromButton(e.button);
        if (!operation) { return }
        if (activeCategories.length === 0) {
            operation = 'or'; // First activated category is always or
        }

        const inputCategory = e.currentTarget.innerText;

        dispatch(setActiveCategories([...activeCategories, { name: inputCategory, operation }]));
    }, [activeCategories])

    const categoriesByOperation = useMemo(() => {
        return activeCategories.reduce((acc, category) => {
            const operation = category.operation;
            if (!(operation in acc)) {
                acc[operation] = [];
            }
            acc[operation].push(category.name);
            return acc
        }, {} as { [operation in FilterOperation]: string[] })
    }, [activeCategories]);

    const categoryButton = (
        category: string,
        handleClick: (e: any) => void,
        handleContextMenu?: (e: any) => void,
        className: string = '',
    ) => (
        <button
            className={`block w-36 bg-primary text-black rounded-xl border border-primary m-3 ${className}`}
            key={category}
            onClick={handleClick}
            onContextMenu={(e) => {
                e.preventDefault();
                if (handleContextMenu) handleContextMenu(e);
            }}
        >
            {category}
        </button>
    );

    return (
        <div className={`${className}`}>
            <InputField
                allOptions={allDropdownOptions}
                placeholder='Categories...'
                activateClickedCategory={activateClickedCategory}
            />
            <div className="max-h-[55vh] overflow-scroll">
                {categoriesByOperation['or']?.map((category, index) =>
                    <>
                        {categoryButton(category, handleClickActiveCategories)}
                        {(categoriesByOperation['or']?.length > 1 && index === 0) ?
                            <p className='text-primary'>OR</p>
                            : null
                        }
                    </>
                )}
                {categoriesByOperation['and']?.map((category, index) => {
                    if (!categoriesByOperation['or'] || categoriesByOperation['or']?.length === 0) {
                        return (
                            <>
                                {categoryButton(category, handleClickActiveCategories)}
                                {(categoriesByOperation['and'].length > 1 && index === 0) ?
                                    <p className='text-primary'>AND</p>
                                    : null
                                }
                            </>
                        )
                    } else {
                        return (
                            <>
                                {(categoriesByOperation['and'].length > 0 && index === 0) ?
                                    <>
                                        <hr className='m-3 border border-primary'></hr>
                                        <p className='text-primary'>AND</p>
                                    </>
                                    : null
                                }
                                {categoryButton(category, handleClickActiveCategories)}
                            </>
                        )
                    }
                })}

                <hr className='m-3 border border-primary'></hr>
                {recentCategories.map((category) =>
                    categoryButton(category,
                        handleClickRecentCategories,
                        handleClickRecentCategories,
                        className = 'bg-transparent text-primary'
                    )
                )}
            </div>
        </div>
    )
}

interface InputFieldProps {
    allOptions: string[];
    placeholder?: string;
    activateClickedCategory: ({ chosenCategory, pressedButton }: { chosenCategory: string, pressedButton: number }) => any;
}
function InputField({ allOptions, placeholder = '', activateClickedCategory }: InputFieldProps) {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);
    const placeholderClass = usePlaceholderFadeIn();

    const enclosingDivRef = useRef<HTMLDivElement>(null);
    useClickAway(enclosingDivRef, () => {
        setValue('');
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

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.target.setAttribute('placeholder', '');
        setFocused(true);
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.target.setAttribute('placeholder', placeholder);
    }, [placeholder]);

    const handleClick = useCallback((e: React.MouseEvent, chosenCategory: string) => {
        e.preventDefault(); // Prevent context menu when right clicking
        setFocused(false);
        activateClickedCategory({ chosenCategory, pressedButton: e.button });
    }, [activateClickedCategory])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
    }, []);

    return (
        <div ref={enclosingDivRef}>
            <input
                className={`h-full w-36 bg-transparent border border-primary rounded-full focus:outline-none
                  px-3 py-1 m-3 ${placeholderClass}`}
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
                    onClick={handleClick}
                    onContextMenu={handleClick}
                />
            }
        </div>
    )
}
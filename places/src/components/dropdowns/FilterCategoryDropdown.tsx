'use client'

import { getOperationFromButton } from '@/lib/map/helpers';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectAppAvailableCategories, selectCachedCategories, setActiveCategories, setCachedCategories } from '@/lib/redux/slices/appStateSlice';
import { FilterOperation } from '@/lib/redux/types';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import CategoriesTips from "../dialog/CategoriesTips";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DropDown } from './DropDown';


export default function FilterCategoryDropdown({ className = '' }) {
    const dispatch = useAppDispatch();
    const availableCategories = useAppSelector(selectAppAvailableCategories);
    const activeCategories = useAppSelector(selectAppActiveCategories);
    const cachedCategories = useAppSelector(selectCachedCategories);

    const [isCategoriesCardOpen, setIsCategoriesCardOpen] = useState(false);
    const [categoriesButtonPosition, setCategoriesButtonPosition] = useState<{ top: number, right: number } | null>(null);
    const [isTipsDialogOpen, setIsTipsDialogOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        if (buttonRef.current) {
            const { top, right } = buttonRef.current.getBoundingClientRect();
            setCategoriesButtonPosition({ top, right });
        }
    }, []);

    const handleActivateCategory = useCallback(
        (e: React.MouseEvent, clickedCategory: string) => {
            e.preventDefault(); // Prevent context menu when right clicking

            let operation = getOperationFromButton(e.button);
            if (!operation) { return }
            if (activeCategories.length === 0) {
                operation = 'or'; // First activated category is always 'or'-ed
            }

            dispatch(setActiveCategories(prev => [...prev, { name: clickedCategory, operation }]))

            if (!cachedCategories.includes(clickedCategory)) {
                dispatch(setCachedCategories(prev => [...prev, clickedCategory]));
            }
        },
        [activeCategories, cachedCategories]
    );

    const handleDeactivateCategory = (_e: React.MouseEvent<HTMLButtonElement>, clickedCategory: string) =>
        dispatch(setActiveCategories(prev => prev.filter((category) => category.name !== clickedCategory)));

    const recentCategories = useMemo(() => cachedCategories.filter((cachedCategory) =>
        !activeCategories.some((activeCategory) => activeCategory.name === cachedCategory)
    ), [cachedCategories, activeCategories]);

    const allDropdownOptions = useMemo(() => availableCategories.filter((availableCategory) =>
        !activeCategories.some((activeCategory) => activeCategory.name === availableCategory)
    ), [availableCategories, activeCategories]);

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

    const handleOpenTipsDialog = useCallback(() => {
        const firstVisit = localStorage.getItem('firstVisit');
        if (firstVisit === null || firstVisit === "true") {
            localStorage.setItem('firstVisit', 'false');
            setIsTipsDialogOpen(true);
            return;
        }
        setIsCategoriesCardOpen(true);
    }, [])

    const handleCloseTipsDialog = useCallback(() => {
        setIsCategoriesCardOpen(false);
    }, []);

    const categoryButton = (
        category: string,
        handleClick: (e: any, category: string) => void,
        handleContextMenu?: (e: any, category: string) => void,
        className: string = '',
    ) => (
        <button
            className={`block w-36 bg-primary text-black rounded-xl border border-primary m-3 ${className}`}
            key={category}
            onClick={(e) => handleClick(e, category)}
            onContextMenu={(e) => {
                e.preventDefault();
                if (handleContextMenu) handleContextMenu(e, category);
            }}
        >
            {category}
        </button>
    );

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <button
                ref={buttonRef}
                className="block w-36 bg-transparent text-primary rounded-xl m-3 border border-primary hover:bg-primary hover:text-black"
                onClick={handleOpenTipsDialog}
            >
                Categories
            </button>
            <div className="max-h-[55vh] overflow-y-auto">
                {categoriesByOperation['or']?.map((category, index) =>
                    <>
                        {categoryButton(category, handleDeactivateCategory)}
                        {(categoriesByOperation['or']?.length > 1 && index === 0) ?
                            <p className='text-primary'>OR</p>
                            : null
                        }
                    </>
                )}
                {categoriesByOperation['and']?.length > 0 &&
                    <p className='text-primary'>AND</p>
                }
                {categoriesByOperation['and']?.map((category) =>
                    categoryButton(category, handleDeactivateCategory)
                )}

                <hr className='m-3 w-36 border border-primary'></hr>
                {recentCategories.slice(-5).map((category) =>
                    categoryButton(category,
                        handleActivateCategory,
                        handleActivateCategory,
                        className = 'bg-transparent text-primary'
                    )
                )}
            </div>
            {isCategoriesCardOpen &&
                createPortal(
                    <Card
                        className="fixed w-[50vw] h-[80vh] z-display bg-transparent backdrop-blur-[2px]"
                        style={{
                            top: categoriesButtonPosition ? categoriesButtonPosition.top - 35 + 'px' : '0px',
                            left: categoriesButtonPosition ? categoriesButtonPosition.right + 60 + 'px' : '0px'
                        }}
                    >
                        <CardHeader className="relative">
                            <CardTitle>Choose categories</CardTitle>
                            <CardDescription>You can use both left and right click</CardDescription>
                            <button onClick={handleCloseTipsDialog} className="absolute text-gray-400">
                                Close
                            </button>
                        </CardHeader>
                        <CardContent className="w-full flex justify-center items-center">
                            <div className="grid grid-cols-3 gap-y-6 gap-x-20">
                                {Array.from({ length: 9 }).map((item, index) => (
                                    <div key={index}>
                                        <h1>Title {index}</h1>
                                        <DropDown
                                            options={allDropdownOptions}
                                            onClick={handleActivateCategory}
                                            onContextMenu={handleActivateCategory}
                                            className="w-40 max-h-32 bg-transparent border border-primary border-opacity-35 rounded-xl"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>,
                    document.body
                )}
            <CategoriesTips open={isTipsDialogOpen} onOpenChange={setIsTipsDialogOpen} />
        </div>
    )
}

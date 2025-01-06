'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectAppAvailableCategories, selectCachedCategories, setActiveCategories, setCachedCategories } from '@/lib/redux/slices/appStateSlice';
import { useCallback } from "react";


export default function FilterCategoryDropdown({ className = '' }) {
    const dispatch = useAppDispatch();
    const availableCategories = useAppSelector(selectAppAvailableCategories);
    const activeCategories = useAppSelector(selectAppActiveCategories);
    const cachedCategories = useAppSelector(selectCachedCategories);

    const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const category = e.currentTarget.innerText;
        const isActive = activeCategories.includes(category);
        if (isActive) {
            dispatch(setActiveCategories(activeCategories.filter(item => item !== category)));
        } else {
            dispatch(setActiveCategories([...activeCategories, category]))
        }
        if (!cachedCategories.includes(category)) {
            dispatch(setCachedCategories([...cachedCategories, category]));
        }
    }, [activeCategories]);

    return (
        <div className={`${className}`}>
            {availableCategories.map((cat) =>
                <button
                    className={`block ${(activeCategories.includes(cat)) ? 'bg-[var(--accent-color)]' : 'bg-gray-300'} w-full text-black`}
                    key={cat}
                    onClick={onClick}
                >
                    {cat}
                </button>
            )}
        </div>
    )
}

'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectAppAvailableCategories, selectCachedCategories, setActiveCategories, setAvailableCategories, setCachedCategories } from '@/lib/redux/slices/appStateSlice';
import { useCallback, useEffect } from "react";


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

    useEffect(() => {
        fetch("/api/data/categories", {
            cache: 'force-cache',
        })
            .then(res => res.json())
            .then(data => dispatch(setAvailableCategories(data)));
    }, []);

    return (
        <div className={`${className}`}>
            {availableCategories.map((cat) =>
                <button
                    className={`block ${(activeCategories.includes(cat)) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} w-full`}
                    key={cat}
                    onClick={onClick}
                >
                    {cat}
                </button>
            )}
        </div>
    )
}

import { useAppDispatch } from '@/redux/hooks';
import { setArea, setPlaceType } from '@/redux/slices/appStateSlice';
import { setViewState } from '@/redux/slices/mapStateSlice';
import { isArea, isPlaceType } from '@/redux/types';
import { useEffect } from 'react';

const useStoredSessionState = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const storedAreaString = localStorage.getItem('area');
        const storedPlaceTypeString = localStorage.getItem('placeType');

        if (storedAreaString && storedPlaceTypeString) {
            try {
                const storedArea = JSON.parse(storedAreaString);
                const storedPlaceType = JSON.parse(storedPlaceTypeString);

                if (isArea(storedArea)) {
                    dispatch(setArea(storedArea));
                }
                if (isPlaceType(storedPlaceType)) {
                    dispatch(setPlaceType(storedPlaceType));
                }

                dispatch(setViewState(prev => ({
                    ...prev,
                    viewState: {
                        longitude: storedArea.longitude,
                        latitude: storedArea.latitude,
                        zoom: storedArea.initialZoom
                    }
                })))
            } catch (error) {
                console.error('Failed to parse stored state:', error);
            }
        }


    }, [dispatch]);
};

export default useStoredSessionState;
'use client'

import { createPlace } from "@/app/actions/data/createPlace";
import FormInput from "@/components/auth/FormInput";
import ErrorList from "@/components/list/ErrorList";
import { useFormState, useFormStatus } from "react-dom";

export type PlaceCreationFormError = {
    name?: string[],
    area?: string[],
    placeType?: string[],
    category?: string[],
    longitude?: string[],
    latitude?: string[],
    description?: string[],
    general?: string[];
}
export type PlaceCreationFormState = {
    errors?: PlaceCreationFormError;
    success?: boolean;
    attempts?: number;
}

export default function PlaceCreationForm() {
    const [state, action] = useFormState<PlaceCreationFormState, FormData>(createPlace, { attempts: 0 });

    return (
        <div className='absolute top-[37vh] left-[42vw] flex flex-col'>
            <form action={action} className='min-w-32 max-w-52'>
                <FormInput id="name" name="name" placeholder="name" />
                <FormInput id="area" name="area" placeholder="area" />
                <FormInput id="placeType" name="placeType" placeholder="place type" />
                <FormInput id="category" name="category" placeholder="category" />
                <FormInput id="longitude" name="longitude" placeholder="longitude" />
                <FormInput id="latitude" name="latitude" placeholder="latitude" />
                <FormInput id="description" name="description" placeholder="description" />
                <div className="w-full pt-1">
                    <SubmitButton></SubmitButton>
                </div>
            </form>
            <div className='relative right-0 ml-4 w-[20vw]'>
                {state.errors &&
                    <ErrorList
                        errors={state.errors}
                        className="">
                    </ErrorList>
                }
            </div>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit" className='border rounded-full p-2 bg-gray-400 hover:bg-gray-300 transition-colors duration-300'>
            create place
        </button>
    )
}
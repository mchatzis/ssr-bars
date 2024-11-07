'use server'

import { redirect } from "next/navigation"

export async function register(formData: FormData) {
    console.log(formData)
    redirect('/')
}

export async function authenticate(formData: FormData) {
    console.log(formData)
    redirect('/')
}
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface MarketingPlanState {
    user: "Solo Artist" | "Band" | "Producer" | "Manager"
    goals: "Grow my audience" | "Release new music" | "Book more gigs",
    artist_name: string,
    genre: string,
    target_audience: string,
    budget: string,
    timeline: string,
    channel: string,
    assets: string,
    additional_information: string
}

const initialState: MarketingPlanState = {
    user: 'Solo Artist',
    goals: 'Grow my audience',
    artist_name: '',
    genre: '',
    target_audience: '',
    additional_information: '',
    assets: '',
    budget: '',
    channel: '',
    timeline: ''
}

export const marketingPlanSlice = createSlice({
    name: 'marketing-plan',
    initialState,
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
        },
        decrement: (state) => {
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {

        },
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = marketingPlanSlice.actions

export default marketingPlanSlice.reducer
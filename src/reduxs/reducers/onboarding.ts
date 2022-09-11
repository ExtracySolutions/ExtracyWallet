import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type OnBoardingState = {
  processOnboarding: boolean
}

const defaultOnBoardingState: OnBoardingState = {
  processOnboarding: false,
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: defaultOnBoardingState,
  reducers: {
    setProcessOnBoarding(
      state: OnBoardingState,
      action: PayloadAction<boolean>,
    ) {
      state.processOnboarding = action.payload
    },
  },
})

export const { setProcessOnBoarding } = onboardingSlice.actions
export const OnBoardingReducer = onboardingSlice.reducer

type TRepeaterState = {
    attemptsCount: number
    repeatAfterMs: number
    result: any
    timeout: ReturnType<typeof setTimeout> | null
}
type TRepeaterCall = (
    state: TRepeaterState
) => Promise<boolean | void> | (boolean | void)
type TRepeaterOptions = {
    call: TRepeaterCall
    repeatAfterMs?: number
    attemptsAmount?: number
}
export const useRepeater = async (options: TRepeaterOptions) => {
    const { call, repeatAfterMs, attemptsAmount } = options
    const state: TRepeaterState = {
        attemptsCount: 0,
        repeatAfterMs: repeatAfterMs || 0,
        result: null,
        timeout: null,
    }
    for (;;) {
        if (
            typeof attemptsAmount === 'number' &&
            state.attemptsCount >= attemptsAmount
        ) {
            return state.result
        }
        state.attemptsCount++
        const result = await call(state)
        state.result = result
        if (result) {
            return result
        }
        await new Promise(resolve => {
            state.timeout = setTimeout(resolve, state.repeatAfterMs)
        })
    }
}

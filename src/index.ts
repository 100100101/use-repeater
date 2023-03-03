import {
    TRepeaterOptions,
    TRepeaterPromiseExtended,
    TRepeaterState,
} from '../types'
export const useRepeater = (options: TRepeaterOptions) => {
    const { call, repeatAfterMs, attemptsAmount } = options
    const state: TRepeaterState = {
        attemptsCount: 0,
        repeatAfterMs: repeatAfterMs || 0,
        result: null,
        timeout: null,
        isStopped: false,
    }
    const repeater = async () => {
        for (;;) {
            if (
                (typeof attemptsAmount === 'number' &&
                    state.attemptsCount >= attemptsAmount) ||
                state.isStopped
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
    const repeaterPromise = repeater() as TRepeaterPromiseExtended
    repeaterPromise.state = state
    repeaterPromise.stop = () => {
        state.isStopped = true
        const { timeout } = state
        if (timeout) clearTimeout(timeout)
    }
    return repeaterPromise
}

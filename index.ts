export type TRepeaterState = {
    attemptsCount: number
    repeatAfterMs: number
    result: any
    timeout: ReturnType<typeof setTimeout> | null
    isStopped: boolean
}
export type TRepeaterCall = (
    state: TRepeaterState
) => Promise<boolean | void> | (boolean | void)
export type TRepeaterOptions = {
    call: TRepeaterCall
    repeatAfterMs?: number
    attemptsAmount?: number
}
export type TRepeaterPromise = Promise<any>
export type TStopMethod = () => void
export type TRepeaterPromiseExtended = TRepeaterPromise & {
    state: TRepeaterState
    stop: TStopMethod
}
let i = 0
export const useRepeater = (options: TRepeaterOptions) => {
    i++
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
        clearTimeout(state.timeout)
    }
    return repeaterPromise
}

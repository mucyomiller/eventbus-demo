import { eventbus } from './eventbus'

describe('eventbus', () => {
  it('instantiate an event bus', () => {
    const bus = eventbus()
    expect(Object.getOwnPropertyNames(bus)).toHaveLength(3)
    expect(bus).toHaveProperty('on')
    expect(bus).toHaveProperty('off')
    expect(bus).toHaveProperty('emit')
  })

  it('adds an event with a handler without paylaod', () => {
    const bus = eventbus<{
      'on-event-1': () => void
    }>()

    const handler = jest.fn()
    bus.on('on-event-1', handler)

    bus.emit('on-event-1')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('adds an event with a handler with paylaod', () => {
    const bus = eventbus<{
      'on-event-1': (payload: { data: string }) => void
    }>()

    const handler = jest.fn()
    bus.on('on-event-1', handler)

    const payload = { data: 'serialized::test=sample&' }
    bus.emit('on-event-1', payload)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('adds multiple events with one handler', () => {
    const bus = eventbus<{
      'on-event-1': () => void
      'on-event-2': () => void
    }>()

    const handler1 = jest.fn()
    bus.on('on-event-1', handler1)

    const handler2 = jest.fn()
    bus.on('on-event-2', handler2)

    bus.emit('on-event-1')
    expect(handler1).toBeCalledTimes(1)
    expect(handler2).not.toBeCalled()

    bus.emit('on-event-2')
    expect(handler1).toBeCalledTimes(1)
    expect(handler2).toBeCalledTimes(1)
  })

  it('adds one event with multiple handlers', () => {
    const bus = eventbus<{
      'on-test-event': (payload: { data: string }) => void
    }>()

    const handler1 = jest.fn()
    const handler2 = jest.fn()
    bus.on('on-test-event', handler1)
    bus.on('on-test-event', handler2)

    const payload = { data: 'serialized::test=sample&' }
    bus.emit('on-test-event', payload)
    expect(handler1).toBeCalledTimes(1)
    expect(handler1).toBeCalledWith(payload)
    expect(handler2).toBeCalledTimes(1)
    expect(handler2).toBeCalledWith(payload)
  })

  it('unsubscribes an event', () => {
    const bus = eventbus<{
      'on-event-1': (payload: number) => void
      'on-event-2': () => void
    }>()

    const handler1 = jest.fn()
    const unsubscribe = bus.on('on-event-1', handler1)

    bus.emit('on-event-1', 198237)
    expect(handler1).toHaveBeenCalledTimes(1)

    unsubscribe()

    bus.emit('on-event-1', 198238)
    expect(handler1).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes an event using `eventbus.off`', () => {
    const bus = eventbus<{
      'on-event-1': (payload: number) => void
      'on-event-2': () => void
    }>()

    const handler1 = jest.fn()
    bus.on('on-event-1', handler1)

    bus.emit('on-event-1', 198237)
    expect(handler1).toHaveBeenCalledTimes(1)

    bus.off('on-event-1', handler1)

    bus.emit('on-event-1', 198238)
    expect(handler1).toHaveBeenCalledTimes(1)
  })
})

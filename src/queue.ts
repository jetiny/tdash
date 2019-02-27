
export enum QueueEventType {
  QET_PUSH = 1,
  QET_REDO = 2,
  QET_UNDO = 3,
}

export interface QueueNotifyEvent<T> {
  type: QueueEventType
  data: T,
  undoCount: number,
  redoCount: number,
}

export type QueueHandler<T> = (object: QueueNotifyEvent<T>) => void

export class Queue<T> {
  private redoQueues: Array<T> = []
  private undoQueues: Array<T> = []
  private limit: Number = 100
  private handler : QueueHandler<T>
  private currentQueues: Array<T> = []
  private grouped: boolean = false
  constructor(handler: QueueHandler<T>) {
    this.handler = handler
  }
  setLimit(value: number) {
    this.limit = value
  }
  beginGroup() {
    this.grouped = true
    this.currentQueues = []
  }
  endGroup() {
    this.grouped = false
    this.currentQueues = []
  }
  push(value: T) : T {
    if (this.grouped) {
      this.currentQueues.push(value)
      if (this.currentQueues.length === 1) {
        this.undoQueues.push(<T><unknown>this.currentQueues)
        if (this.undoQueues.length > this.limit) {
          this.undoQueues.splice(0, 1)
        }
        this.redoQueues.splice(0)
      }
    } else {
      this.undoQueues.push(value)
      if (this.undoQueues.length > this.limit) {
        this.undoQueues.splice(0, 1)
      }
      this.redoQueues.splice(0)
    }
    this._notify(QueueEventType.QET_PUSH, value)
    return value
  }
  redo () : T | undefined {
    let value = this.redoQueues.pop()
    if (value) {
      this.undoQueues.push(value)
      if (Array.isArray(value)) {
        value.forEach(it => {
          this._notify(QueueEventType.QET_REDO, it)  
        })
      } else {
        this._notify(QueueEventType.QET_REDO, value)
      }
    }
    return value
  }
  undo () :T | undefined {
    let value = this.undoQueues.pop()
    if (value) {
      this.redoQueues.push(value)
      if (Array.isArray(value)) {
        value.forEach(it => {
          this._notify(QueueEventType.QET_UNDO, it)  
        })
      } else {
        this._notify(QueueEventType.QET_UNDO, value)
      }
    }
    return value
  }
  _notify(type: QueueEventType, data: any) {
    this.handler({
      type,
      data,
      undoCount: this.undoQueues.length,
      redoCount: this.redoQueues.length,
    })
  }
}

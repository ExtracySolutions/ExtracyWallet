import { Buffer } from 'buffer'
import { EventEmitter } from 'events'

import { Duplex } from 'readable-stream'

import {
  JS_IFRAME_POST_MESSAGE_TO_PROVIDER,
  JS_POST_MESSAGE_TO_PROVIDER,
} from '../ultils/browserScript'

const noop = () => {}

/**
 * Module that listens for and responds to messages from an InpageBridge using postMessage
 */

export class Port extends EventEmitter {
  private _window: any
  private _isMainFrame: any

  constructor(window: any, isMainFrame: any) {
    super()
    this._window = window
    this._isMainFrame = isMainFrame
  }

  postMessage = (msg: any, origin = '*') => {
    const js = this._isMainFrame
      ? JS_POST_MESSAGE_TO_PROVIDER(msg, origin)
      : JS_IFRAME_POST_MESSAGE_TO_PROVIDER(msg, origin)
    if (this._window.webViewRef && this._window.webViewRef.current) {
      this._window && this._window.injectJavaScript(js)
    }
  }
}

export default class PortDuplexStream extends Duplex {
  private _port: Port
  private _url: string

  constructor(port: Port, url: string) {
    super({
      objectMode: true,
    })
    this._port = port
    this._url = url
    this._port.addListener('message', this._onMessage.bind(this))
    this._port.addListener('disconnect', this._onDisconnect.bind(this))
    // this._port.addListener('stream_pause', this._onPause.bind(this))
    // this._port.addListener('stream_resume', this._onResume.bind(this))
    // this._port.addListener()
  }

  // /**
  //  * Callback trigger make stream pause
  //  */
  // _onPause = () => {
  //   console.log('[STREAM]---Stream pause')
  //   this.pause && this.pause()
  // }

  // /**
  //  * Callback trigger make stream resume
  //  */
  // _onResume = () => {
  //   console.log('[STREAM]---Stream resume')
  //   this.resume && this.resume()
  // }

  /**
   * Callback triggered when a message is received from
   * the remote Port associated with this Stream.
   *
   * @private
   * @param {Object} msg - Payload from the onMessage listener of Port
   */
  _onMessage = (msg: any) => {
    if (Buffer.isBuffer(msg)) {
      delete msg._isBuffer
      const data = new Buffer.from(msg)

      this.push(data)
    } else {
      this.push(msg)
    }
  }

  /**
   * Callback triggered when the remote Port
   * associated with this Stream disconnects.
   *
   * @private
   */
  _onDisconnect = () => {
    this.destroy && this.destroy()
  }

  /**
   * Explicitly sets read operations to a no-op
   */
  _read = noop

  /**
   * Called internally when data should be written to
   * this writable stream.
   *
   * @private
   * @param {*} msg Arbitrary object to write
   * @param {string} encoding Encoding to use when writing payload
   * @param {Function} cb Called when writing is complete or an error occurs
   */
  _write = (msg, encoding, cb) => {
    try {
      if (Buffer.isBuffer(msg)) {
        const data = msg.toJSON()
        data._isBuffer = true
        this._port.postMessage(data, this._url)
      } else {
        this._port.postMessage(msg, this._url)
      }
    } catch (err) {
      return cb(new Error('PortDuplexStream - disconnected'))
    }
    cb()
  }
}

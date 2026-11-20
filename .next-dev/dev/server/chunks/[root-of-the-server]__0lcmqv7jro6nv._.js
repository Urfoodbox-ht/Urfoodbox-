module.exports = [
"[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
var mod = await __turbopack_context__.y("pg-587764f78a6c7a9c");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/node_modules/@fastify/busboy/deps/dicer/lib/Dicer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const WritableStream = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)").Writable;
const inherits = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)").inherits;
const StreamSearch = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/deps/streamsearch/sbmh.js [app-route] (ecmascript)");
const PartStream = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/deps/dicer/lib/PartStream.js [app-route] (ecmascript)");
const HeaderParser = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/deps/dicer/lib/HeaderParser.js [app-route] (ecmascript)");
const DASH = 45;
const B_ONEDASH = Buffer.from('-');
const B_CRLF = Buffer.from('\r\n');
const EMPTY_FN = function() {};
function Dicer(cfg) {
    if (!(this instanceof Dicer)) {
        return new Dicer(cfg);
    }
    WritableStream.call(this, cfg);
    if (!cfg || !cfg.headerFirst && typeof cfg.boundary !== 'string') {
        throw new TypeError('Boundary required');
    }
    if (typeof cfg.boundary === 'string') {
        this.setBoundary(cfg.boundary);
    } else {
        this._bparser = undefined;
    }
    this._headerFirst = cfg.headerFirst;
    this._dashes = 0;
    this._parts = 0;
    this._finished = false;
    this._realFinish = false;
    this._isPreamble = true;
    this._justMatched = false;
    this._firstWrite = true;
    this._inHeader = true;
    this._part = undefined;
    this._cb = undefined;
    this._ignoreData = false;
    this._partOpts = {
        highWaterMark: cfg.partHwm
    };
    this._pause = false;
    const self = this;
    this._hparser = new HeaderParser(cfg);
    this._hparser.on('header', function(header) {
        self._inHeader = false;
        self._part.emit('header', header);
    });
}
inherits(Dicer, WritableStream);
Dicer.prototype.emit = function(ev) {
    if (ev === 'finish' && !this._realFinish) {
        if (!this._finished) {
            const self = this;
            process.nextTick(function() {
                self.emit('error', new Error('Unexpected end of multipart data'));
                if (self._part && !self._ignoreData) {
                    const type = self._isPreamble ? 'Preamble' : 'Part';
                    self._part.emit('error', new Error(type + ' terminated early due to unexpected end of multipart data'));
                    self._part.push(null);
                    process.nextTick(function() {
                        self._realFinish = true;
                        self.emit('finish');
                        self._realFinish = false;
                    });
                    return;
                }
                self._realFinish = true;
                self.emit('finish');
                self._realFinish = false;
            });
        }
    } else {
        WritableStream.prototype.emit.apply(this, arguments);
    }
};
Dicer.prototype._write = function(data, encoding, cb) {
    // ignore unexpected data (e.g. extra trailer data after finished)
    if (!this._hparser && !this._bparser) {
        return cb();
    }
    if (this._headerFirst && this._isPreamble) {
        if (!this._part) {
            this._part = new PartStream(this._partOpts);
            if (this.listenerCount('preamble') !== 0) {
                this.emit('preamble', this._part);
            } else {
                this._ignore();
            }
        }
        const r = this._hparser.push(data);
        if (!this._inHeader && r !== undefined && r < data.length) {
            data = data.slice(r);
        } else {
            return cb();
        }
    }
    // allows for "easier" testing
    if (this._firstWrite) {
        this._bparser.push(B_CRLF);
        this._firstWrite = false;
    }
    this._bparser.push(data);
    if (this._pause) {
        this._cb = cb;
    } else {
        cb();
    }
};
Dicer.prototype.reset = function() {
    this._part = undefined;
    this._bparser = undefined;
    this._hparser = undefined;
};
Dicer.prototype.setBoundary = function(boundary) {
    const self = this;
    this._bparser = new StreamSearch('\r\n--' + boundary);
    this._bparser.on('info', function(isMatch, data, start, end) {
        self._oninfo(isMatch, data, start, end);
    });
};
Dicer.prototype._ignore = function() {
    if (this._part && !this._ignoreData) {
        this._ignoreData = true;
        this._part.on('error', EMPTY_FN);
        // we must perform some kind of read on the stream even though we are
        // ignoring the data, otherwise node's Readable stream will not emit 'end'
        // after pushing null to the stream
        this._part.resume();
    }
};
Dicer.prototype._oninfo = function(isMatch, data, start, end) {
    let buf;
    const self = this;
    let i = 0;
    let r;
    let shouldWriteMore = true;
    if (!this._part && this._justMatched && data) {
        while(this._dashes < 2 && start + i < end){
            if (data[start + i] === DASH) {
                ++i;
                ++this._dashes;
            } else {
                if (this._dashes) {
                    buf = B_ONEDASH;
                }
                this._dashes = 0;
                break;
            }
        }
        if (this._dashes === 2) {
            if (start + i < end && this.listenerCount('trailer') !== 0) {
                this.emit('trailer', data.slice(start + i, end));
            }
            this.reset();
            this._finished = true;
            // no more parts will be added
            if (self._parts === 0) {
                self._realFinish = true;
                self.emit('finish');
                self._realFinish = false;
            }
        }
        if (this._dashes) {
            return;
        }
    }
    if (this._justMatched) {
        this._justMatched = false;
    }
    if (!this._part) {
        this._part = new PartStream(this._partOpts);
        this._part._read = function(n) {
            self._unpause();
        };
        if (this._isPreamble && this.listenerCount('preamble') !== 0) {
            this.emit('preamble', this._part);
        } else if (this._isPreamble !== true && this.listenerCount('part') !== 0) {
            this.emit('part', this._part);
        } else {
            this._ignore();
        }
        if (!this._isPreamble) {
            this._inHeader = true;
        }
    }
    if (data && start < end && !this._ignoreData) {
        if (this._isPreamble || !this._inHeader) {
            if (buf) {
                shouldWriteMore = this._part.push(buf);
            }
            shouldWriteMore = this._part.push(data.slice(start, end));
            if (!shouldWriteMore) {
                this._pause = true;
            }
        } else if (!this._isPreamble && this._inHeader) {
            if (buf) {
                this._hparser.push(buf);
            }
            r = this._hparser.push(data.slice(start, end));
            if (!this._inHeader && r !== undefined && r < end) {
                this._oninfo(false, data, start + r, end);
            }
        }
    }
    if (isMatch) {
        this._hparser.reset();
        if (this._isPreamble) {
            this._isPreamble = false;
        } else {
            // A part whose header block is still incomplete never emits 'header',
            // so nothing will consume it and its 'end' would never fire. Do not
            // count it as outstanding, just like an empty part.
            if (start !== end && !this._inHeader) {
                ++this._parts;
                this._part.on('end', function() {
                    if (--self._parts === 0) {
                        if (self._finished) {
                            self._realFinish = true;
                            self.emit('finish');
                            self._realFinish = false;
                        } else {
                            self._unpause();
                        }
                    }
                });
            }
        }
        this._part.push(null);
        this._part = undefined;
        this._ignoreData = false;
        this._justMatched = true;
        this._dashes = 0;
    }
};
Dicer.prototype._unpause = function() {
    if (!this._pause) {
        return;
    }
    this._pause = false;
    if (this._cb) {
        const cb = this._cb;
        this._cb = undefined;
        cb();
    }
};
module.exports = Dicer;
}),
"[project]/node_modules/@fastify/busboy/deps/dicer/lib/HeaderParser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const EventEmitter = __turbopack_context__.r("[externals]/node:events [external] (node:events, cjs)").EventEmitter;
const inherits = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)").inherits;
const getLimit = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/getLimit.js [app-route] (ecmascript)");
const B_DCRLF = Buffer.from('\r\n\r\n');
const S_DCRLF = '\r\n\r\n';
function HeaderParser(cfg) {
    EventEmitter.call(this);
    cfg = cfg || {};
    this.nread = 0;
    this.maxed = false;
    // Number of trailing header bytes received but not kept in this.buffer
    // because maxHeaderSize was reached.
    this.dropped = 0;
    this.npairs = 0;
    this.maxHeaderPairs = getLimit(cfg, 'maxHeaderPairs', 2000);
    this.maxHeaderSize = getLimit(cfg, 'maxHeaderSize', 80 * 1024);
    this.buffer = '';
    this.header = Object.create(null);
    this.finished = false;
    this.tail = '';
}
inherits(HeaderParser, EventEmitter);
HeaderParser.prototype.push = function(data) {
    if (!Buffer.isBuffer(data)) {
        data = Buffer.from(data, 'binary');
    }
    let end = data.length;
    let appendEnd = data.length;
    let found = false;
    let splitTail = 0;
    const tail = this.tail;
    for(let i = tail.length; i > 0; --i){
        if (tail.endsWith(S_DCRLF.slice(0, i))) {
            let matched = data.length >= S_DCRLF.length - i;
            for(let j = i; matched && j < S_DCRLF.length; ++j){
                matched = data[j - i] === S_DCRLF.charCodeAt(j);
            }
            if (matched) {
                end = S_DCRLF.length - i;
                appendEnd = 0;
                splitTail = i;
                found = true;
                break;
            }
        }
    }
    if (!found) {
        const pos = data.indexOf(B_DCRLF);
        if (pos !== -1) {
            end = pos + B_DCRLF.length;
            appendEnd = pos;
            found = true;
        }
    }
    if (!found) {
        this.tail = data.length >= 3 ? data.toString('binary', data.length - 3) : (tail + data.toString('binary')).slice(-3);
    } else {
        this.tail = '';
    }
    if (appendEnd !== 0 && !this.maxed) {
        const remaining = this.maxHeaderSize - this.nread;
        if (appendEnd >= remaining) {
            this.buffer += data.toString('binary', 0, remaining);
            this.nread = this.maxHeaderSize;
            this.maxed = true;
            this.dropped = appendEnd - remaining;
        } else {
            this.buffer += data.toString('binary', 0, appendEnd);
            this.nread += appendEnd;
        }
    } else {
        this.dropped += appendEnd;
    }
    if (found) {
        // A CRLFCRLF header terminator split across pushes left its leading bytes
        // in this.buffer on the previous push; drop them so they do not trail the
        // last header value. splitTail is 0 in the common case, making this a no-op.
        // When maxHeaderSize truncation dropped some trailing bytes, only the
        // terminator bytes that actually made it into this.buffer are removed.
        const buffered = splitTail - this.dropped;
        if (buffered > 0) {
            this.buffer = this.buffer.slice(0, this.buffer.length - buffered);
        }
        this._finish();
        return end;
    }
};
HeaderParser.prototype.reset = function() {
    this.finished = false;
    // A delimiter can cut off an incomplete header block; do not let its size
    // and pair counts carry over into the next part's header block.
    this.nread = this.npairs = 0;
    this.maxed = false;
    this.buffer = '';
    this.header = Object.create(null);
    this.tail = '';
    this.dropped = 0;
};
HeaderParser.prototype._finish = function() {
    if (this.buffer) {
        this._parseHeader();
    }
    const header = this.header;
    this.header = Object.create(null);
    this.buffer = '';
    this.tail = '';
    this.finished = true;
    this.nread = this.npairs = 0;
    this.maxed = false;
    this.dropped = 0;
    this.emit('header', header);
};
HeaderParser.prototype._parseHeader = function() {
    if (this.npairs === this.maxHeaderPairs) {
        return;
    }
    const buffer = this.buffer;
    let h;
    let lineStart = 0;
    while(lineStart < buffer.length){
        let lineEnd = buffer.indexOf('\r\n', lineStart);
        if (lineEnd === -1) {
            lineEnd = buffer.length;
        }
        if (lineEnd === lineStart) {
            lineStart = lineEnd + 2;
            continue;
        }
        // Reject bare line breaks instead of exposing them in parsed values
        const line = buffer.slice(lineStart, lineEnd);
        if (line.includes('\r') || line.includes('\n')) {
            return;
        }
        if ((buffer[lineStart] === '\t' || buffer[lineStart] === ' ') && h) {
            // folded header content
            // RFC2822 says to just remove the CRLF and not the whitespace following
            // it, so we follow the RFC and include the leading whitespace ...
            this.header[h][this.header[h].length - 1] += buffer.slice(lineStart, lineEnd);
            lineStart = lineEnd + 2;
            continue;
        }
        const posColon = buffer.indexOf(':', lineStart);
        if (posColon === -1 || posColon === lineStart || posColon > lineEnd) {
            return;
        }
        h = buffer.slice(lineStart, posColon).toLowerCase();
        let valueStart = posColon + 1;
        if (buffer[valueStart] === ' ' || buffer[valueStart] === '\t') {
            ++valueStart;
        }
        const values = this.header[h] || (this.header[h] = []);
        values.push(buffer.slice(valueStart, lineEnd));
        if (++this.npairs === this.maxHeaderPairs) {
            break;
        }
        lineStart = lineEnd + 2;
    }
};
module.exports = HeaderParser;
}),
"[project]/node_modules/@fastify/busboy/deps/dicer/lib/PartStream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const inherits = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)").inherits;
const ReadableStream = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)").Readable;
function PartStream(opts) {
    ReadableStream.call(this, opts);
}
inherits(PartStream, ReadableStream);
PartStream.prototype._read = function(n) {};
module.exports = PartStream;
}),
"[project]/node_modules/@fastify/busboy/deps/streamsearch/sbmh.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright Brian White. All rights reserved.
 *
 * @see https://github.com/mscdex/streamsearch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * Based heavily on the Streaming Boyer-Moore-Horspool C++ implementation
 * by Hongli Lai at: https://github.com/FooBarWidget/boyer-moore-horspool
 */ const { EventEmitter } = __turbopack_context__.r("[externals]/node:events [external] (node:events, cjs)");
const { inherits } = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)");
function SBMH(needle) {
    if (typeof needle === 'string') {
        needle = Buffer.from(needle);
    }
    if (!Buffer.isBuffer(needle)) {
        throw new TypeError('The needle has to be a String or a Buffer.');
    }
    const needleLength = needle.length;
    const needleLastCharIndex = needleLength - 1;
    if (needleLength === 0) {
        throw new Error('The needle cannot be an empty String/Buffer.');
    }
    if (needleLength > 256) {
        throw new Error('The needle cannot have a length bigger than 256.');
    }
    this.maxMatches = Infinity;
    this.matches = 0;
    this._occ = new Uint16Array(256).fill(needleLength); // Initialize occurrence table.
    this._lookbehind_size = 0;
    this._needle = needle;
    this._bufpos = 0;
    this._lookbehind = Buffer.alloc(needleLastCharIndex);
    // Populate occurrence table with analysis of the needle,
    // ignoring last letter.
    for(var i = 0; i < needleLastCharIndex; ++i){
        this._occ[needle[i]] = needleLastCharIndex - i;
    }
}
inherits(SBMH, EventEmitter);
SBMH.prototype.reset = function() {
    this._lookbehind_size = 0;
    this.matches = 0;
    this._bufpos = 0;
};
SBMH.prototype.push = function(chunk, pos) {
    if (!Buffer.isBuffer(chunk)) {
        chunk = Buffer.from(chunk, 'binary');
    }
    const chlen = chunk.length;
    this._bufpos = pos || 0;
    let r;
    while(r !== chlen && this.matches < this.maxMatches){
        r = this._sbmh_feed(chunk);
    }
    return r;
};
SBMH.prototype._sbmh_feed = function(data) {
    const len = data.length;
    const needle = this._needle;
    const needleLength = needle.length;
    const needleLastCharIndex = needleLength - 1;
    const needleLastChar = needle[needleLastCharIndex];
    // Positive: points to a position in `data`
    //           pos == 3 points to data[3]
    // Negative: points to a position in the lookbehind buffer
    //           pos == -2 points to lookbehind[lookbehind_size - 2]
    let pos = -this._lookbehind_size;
    let ch;
    if (pos < 0) {
        // Lookbehind buffer is not empty. Perform Boyer-Moore-Horspool
        // search with character lookup code that considers both the
        // lookbehind buffer and the current round's haystack data.
        //
        // Loop until
        //   there is a match.
        // or until
        //   we've moved past the position that requires the
        //   lookbehind buffer. In this case we switch to the
        //   optimized loop.
        // or until
        //   the character to look at lies outside the haystack.
        while(pos < 0 && pos <= len - needleLength){
            ch = data[pos + needleLastCharIndex];
            if (ch === needleLastChar && this._sbmh_memcmp(data, pos, needleLastCharIndex)) {
                this._lookbehind_size = 0;
                ++this.matches;
                this.emit('info', true);
                return this._bufpos = pos + needleLength;
            }
            pos += this._occ[ch];
        }
        // No match.
        while(pos < 0 && !this._sbmh_memcmp(data, pos, len - pos)){
            // There's too few data for Boyer-Moore-Horspool to run,
            // so let's use a different algorithm to skip as much as
            // we can.
            // Forward pos until
            //   the trailing part of lookbehind + data
            //   looks like the beginning of the needle
            // or until
            //   pos == 0
            ++pos;
        }
        if (pos >= 0) {
            // Discard lookbehind buffer.
            this.emit('info', false, this._lookbehind, 0, this._lookbehind_size);
            this._lookbehind_size = 0;
        } else {
            // Cut off part of the lookbehind buffer that has
            // been processed and append the entire haystack
            // into it.
            const bytesToCutOff = this._lookbehind_size + pos;
            if (bytesToCutOff > 0) {
                // The cut off data is guaranteed not to contain the needle.
                this.emit('info', false, this._lookbehind, 0, bytesToCutOff);
            }
            this._lookbehind_size -= bytesToCutOff;
            this._lookbehind.copy(this._lookbehind, 0, bytesToCutOff, this._lookbehind_size);
            data.copy(this._lookbehind, this._lookbehind_size);
            this._lookbehind_size += len;
            this._bufpos = len;
            return len;
        }
    }
    // Lookbehind buffer is now empty. We only need to check if the
    // needle is in the haystack.
    pos = data.indexOf(needle, pos + this._bufpos);
    if (pos !== -1) {
        ++this.matches;
        if (pos === 0) {
            this.emit('info', true);
        } else {
            this.emit('info', true, data, this._bufpos, pos);
        }
        return this._bufpos = pos + needleLength;
    }
    pos = len - needleLastCharIndex;
    if (pos < 0) {
        pos = 0;
    }
    // There was no match. If there's trailing haystack data that we cannot
    // match yet using the Boyer-Moore-Horspool algorithm (because the trailing
    // data is less than the needle size) then match using a modified
    // algorithm that starts matching from the beginning instead of the end.
    // Whatever trailing data is left after running this algorithm is added to
    // the lookbehind buffer.
    while(pos !== len && (data[pos] !== needle[0] || Buffer.compare(data.subarray(pos + 1, len), needle.subarray(1, len - pos)) !== 0)){
        ++pos;
    }
    if (pos !== len) {
        data.copy(this._lookbehind, 0, pos, len);
        this._lookbehind_size = len - pos;
    }
    // Everything until pos is guaranteed not to contain needle data.
    if (pos !== 0) {
        this.emit('info', false, data, this._bufpos, pos);
    }
    this._bufpos = len;
    return len;
};
SBMH.prototype._sbmh_lookup_char = function(data, pos) {
    return pos < 0 ? this._lookbehind[this._lookbehind_size + pos] : data[pos];
};
SBMH.prototype._sbmh_memcmp = function(data, pos, len) {
    for(var i = 0; i < len; ++i){
        if (this._sbmh_lookup_char(data, pos + i) !== this._needle[i]) {
            return false;
        }
    }
    return true;
};
module.exports = SBMH;
}),
"[project]/node_modules/@fastify/busboy/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const WritableStream = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)").Writable;
const { inherits } = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)");
const Dicer = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/deps/dicer/lib/Dicer.js [app-route] (ecmascript)");
const MultipartParser = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/types/multipart.js [app-route] (ecmascript)");
const UrlencodedParser = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/types/urlencoded.js [app-route] (ecmascript)");
const parseParams = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/parseParams.js [app-route] (ecmascript)");
function Busboy(opts) {
    if (!(this instanceof Busboy)) {
        return new Busboy(opts);
    }
    if (typeof opts !== 'object') {
        throw new TypeError('Busboy expected an options-Object.');
    }
    if (typeof opts.headers !== 'object') {
        throw new TypeError('Busboy expected an options-Object with headers-attribute.');
    }
    if (typeof opts.headers['content-type'] !== 'string') {
        throw new TypeError('Missing Content-Type-header.');
    }
    const { headers, ...streamOptions } = opts;
    this.opts = {
        autoDestroy: false,
        ...streamOptions
    };
    WritableStream.call(this, this.opts);
    this._done = false;
    this._parser = this.getParserByHeaders(headers);
    this._finished = false;
}
inherits(Busboy, WritableStream);
Busboy.prototype.emit = function(ev) {
    if (ev === 'finish') {
        if (!this._done) {
            this._parser?.end();
            return;
        } else if (this._finished) {
            return;
        }
        this._finished = true;
    }
    WritableStream.prototype.emit.apply(this, arguments);
};
Busboy.prototype.getParserByHeaders = function(headers) {
    const parsed = parseParams(headers['content-type']);
    const cfg = {
        defCharset: this.opts.defCharset,
        fileHwm: this.opts.fileHwm,
        headers,
        highWaterMark: this.opts.highWaterMark,
        isPartAFile: this.opts.isPartAFile,
        limits: this.opts.limits,
        parsedConType: parsed,
        preservePath: this.opts.preservePath
    };
    if (MultipartParser.detect.test(parsed[0])) {
        return new MultipartParser(this, cfg);
    }
    if (UrlencodedParser.detect.test(parsed[0])) {
        return new UrlencodedParser(this, cfg);
    }
    throw new Error('Unsupported Content-Type.');
};
Busboy.prototype._write = function(chunk, encoding, cb) {
    this._parser.write(chunk, cb);
};
module.exports = Busboy;
module.exports.default = Busboy;
module.exports.Busboy = Busboy;
module.exports.Dicer = Dicer;
}),
"[project]/node_modules/@fastify/busboy/lib/types/multipart.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// TODO:
//  * support 1 nested multipart level
//    (see second multipart example here:
//     https://www.w3.org/TR/html401/interact/forms.html#didx-multipartform-data)
//  * support limits.fieldNameSize
//     -- this will require modifications to utils.parseParams
const { Readable } = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)");
const { inherits } = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)");
const Dicer = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/deps/dicer/lib/Dicer.js [app-route] (ecmascript)");
const parseParams = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/parseParams.js [app-route] (ecmascript)");
const decodeText = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/decodeText.js [app-route] (ecmascript)");
const basename = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/basename.js [app-route] (ecmascript)");
const getLimit = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/getLimit.js [app-route] (ecmascript)");
const RE_BOUNDARY = /^boundary$/i;
const RE_FIELD = /^form-data$/i;
const RE_CHARSET = /^charset$/i;
const RE_FILENAME = /^filename$/i;
const RE_NAME = /^name$/i;
Multipart.detect = /^multipart\/form-data/i;
function Multipart(boy, cfg) {
    let i;
    let len;
    const self = this;
    let boundary;
    const limits = cfg.limits;
    const isPartAFile = cfg.isPartAFile || ((fieldName, contentType, fileName)=>contentType === 'application/octet-stream' || fileName !== undefined);
    const parsedConType = cfg.parsedConType || [];
    const defCharset = cfg.defCharset || 'utf8';
    const preservePath = cfg.preservePath;
    const fileOpts = {
        highWaterMark: cfg.fileHwm
    };
    for(i = 0, len = parsedConType.length; i < len; ++i){
        if (Array.isArray(parsedConType[i]) && RE_BOUNDARY.test(parsedConType[i][0])) {
            boundary = parsedConType[i][1];
            break;
        }
    }
    function checkFinished() {
        if (nends === 0 && finished && !boy._done) {
            finished = false;
            self.end();
        }
    }
    if (typeof boundary !== 'string') {
        throw new Error('Multipart: Boundary not found');
    }
    const fieldSizeLimit = getLimit(limits, 'fieldSize', 1 * 1024 * 1024);
    const fileSizeLimit = getLimit(limits, 'fileSize', Infinity);
    const filesLimit = getLimit(limits, 'files', Infinity);
    const fieldsLimit = getLimit(limits, 'fields', Infinity);
    const partsLimit = getLimit(limits, 'parts', Infinity);
    const headerPairsLimit = getLimit(limits, 'headerPairs', 2000);
    const headerSizeLimit = getLimit(limits, 'headerSize', 80 * 1024);
    let nfiles = 0;
    let nfields = 0;
    let nends = 0;
    let curFile;
    let curField;
    let finished = false;
    this._needDrain = false;
    this._pause = false;
    this._cb = undefined;
    this._nparts = 0;
    this._boy = boy;
    const parserCfg = {
        boundary,
        maxHeaderPairs: headerPairsLimit,
        maxHeaderSize: headerSizeLimit,
        partHwm: fileOpts.highWaterMark,
        highWaterMark: cfg.highWaterMark
    };
    this.parser = new Dicer(parserCfg);
    this.parser.on('drain', function() {
        self._needDrain = false;
        if (self._cb && !self._pause) {
            const cb = self._cb;
            self._cb = undefined;
            cb();
        }
    }).on('part', function onPart(part) {
        if (++self._nparts > partsLimit) {
            self.parser.removeListener('part', onPart);
            self.parser.on('part', skipPart);
            boy.hitPartsLimit = true;
            boy.emit('partsLimit');
            return skipPart(part);
        }
        // hack because streams2 _always_ doesn't emit 'end' until nextTick, so let
        // us emit 'end' early since we know the part has ended if we are already
        // seeing the next part
        if (curField) {
            const field = curField;
            field.emit('end');
            field.removeAllListeners('end');
        }
        part.on('header', function(header) {
            let contype;
            let fieldname;
            let parsed;
            let charset;
            let encoding;
            let filename;
            let nsize = 0;
            if (header['content-type']) {
                const contentType = header['content-type'][0];
                if (contentType.length !== 0 && contentType.indexOf(';') === -1 && contentType.indexOf(' ') === -1 && contentType.indexOf('\t') === -1) {
                    contype = contentType.toLowerCase();
                } else {
                    parsed = parseParams(contentType);
                    if (parsed[0]) {
                        contype = parsed[0].toLowerCase();
                        for(i = 0, len = parsed.length; i < len; ++i){
                            if (RE_CHARSET.test(parsed[i][0])) {
                                charset = parsed[i][1].toLowerCase();
                                break;
                            }
                        }
                    }
                }
            }
            if (contype === undefined) {
                contype = 'text/plain';
            }
            if (charset === undefined) {
                charset = defCharset;
            }
            if (header['content-disposition']) {
                parsed = parseParams(header['content-disposition'][0]);
                if (!RE_FIELD.test(parsed[0])) {
                    return skipPart(part);
                }
                for(i = 0, len = parsed.length; i < len; ++i){
                    if (RE_NAME.test(parsed[i][0])) {
                        fieldname = parsed[i][1];
                        if (hasBareLineBreak(fieldname)) {
                            return skipPart(part);
                        }
                    } else if (RE_FILENAME.test(parsed[i][0])) {
                        filename = parsed[i][1];
                        if (hasBareLineBreak(filename)) {
                            return skipPart(part);
                        }
                        if (!preservePath) {
                            filename = basename(filename);
                        }
                    }
                }
            } else {
                return skipPart(part);
            }
            if (header['content-transfer-encoding']) {
                encoding = header['content-transfer-encoding'][0].toLowerCase();
            } else {
                encoding = '7bit';
            }
            let onData, onEnd;
            if (isPartAFile(fieldname, contype, filename)) {
                // file/binary field
                if (nfiles === filesLimit) {
                    if (!boy.hitFilesLimit) {
                        boy.hitFilesLimit = true;
                        boy.emit('filesLimit');
                    }
                    return skipPart(part);
                }
                ++nfiles;
                if (boy.listenerCount('file') === 0) {
                    self.parser._ignore();
                    return;
                }
                ++nends;
                const file = new FileStream(fileOpts);
                curFile = file;
                file.on('end', function() {
                    --nends;
                    self._pause = false;
                    checkFinished();
                    if (self._cb && !self._needDrain) {
                        const cb = self._cb;
                        self._cb = undefined;
                        cb();
                    }
                });
                file._read = function(n) {
                    if (!self._pause) {
                        return;
                    }
                    self._pause = false;
                    if (self._cb && !self._needDrain) {
                        const cb = self._cb;
                        self._cb = undefined;
                        cb();
                    }
                };
                boy.emit('file', fieldname, file, filename, encoding, contype);
                onData = function(data) {
                    if ((nsize += data.length) > fileSizeLimit) {
                        const extralen = fileSizeLimit - nsize + data.length;
                        if (extralen > 0) {
                            file.push(data.slice(0, extralen));
                        }
                        file.truncated = true;
                        file.bytesRead = fileSizeLimit;
                        part.removeAllListeners('data');
                        file.emit('limit');
                        return;
                    } else if (!file.push(data)) {
                        self._pause = true;
                    }
                    file.bytesRead = nsize;
                };
                onEnd = function() {
                    curFile = undefined;
                    file.push(null);
                };
            } else {
                // non-file field
                if (nfields === fieldsLimit) {
                    if (!boy.hitFieldsLimit) {
                        boy.hitFieldsLimit = true;
                        boy.emit('fieldsLimit');
                    }
                    return skipPart(part);
                }
                ++nfields;
                ++nends;
                let buffer = '';
                let truncated = false;
                curField = part;
                onData = function(data) {
                    if ((nsize += data.length) > fieldSizeLimit) {
                        const extralen = fieldSizeLimit - (nsize - data.length);
                        buffer += data.toString('binary', 0, extralen);
                        truncated = true;
                        part.removeAllListeners('data');
                    } else {
                        buffer += data.toString('binary');
                    }
                };
                onEnd = function() {
                    curField = undefined;
                    if (buffer.length) {
                        buffer = decodeText(buffer, 'binary', charset);
                    }
                    boy.emit('field', fieldname, buffer, false, truncated, encoding, contype);
                    --nends;
                    checkFinished();
                };
            }
            /* As of node@2efe4ab761666 (v0.10.29+/v0.11.14+), busboy had become
         broken. Streams2/streams3 is a huge black box of confusion, but
         somehow overriding the sync state seems to fix things again (and still
         seems to work for previous node versions).
      */ part._readableState.sync = false;
            part.on('data', onData);
            part.on('end', onEnd);
        }).on('error', function(err) {
            if (curFile) {
                curFile.emit('error', err);
            }
        });
    }).on('error', function(err) {
        boy.emit('error', err);
    }).on('finish', function() {
        finished = true;
        checkFinished();
    });
}
Multipart.prototype.write = function(chunk, cb) {
    // After the closing delimiter Dicer is no longer writable. A later
    // chunk can still carry an RFC 2046 epilogue; ignore it so the write
    // callback still runs instead of hanging on a destroyed parser.
    if (!this.parser.writable) {
        cb();
        return;
    }
    const r = this.parser.write(chunk);
    if (r && !this._pause) {
        cb();
    } else {
        this._needDrain = !r;
        this._cb = cb;
    }
};
Multipart.prototype.end = function() {
    const self = this;
    if (self.parser.writable) {
        self.parser.end();
    } else if (!self._boy._done) {
        process.nextTick(function() {
            self._boy._done = true;
            self._boy.emit('finish');
        });
    }
};
function skipPart(part) {
    // A skipped part has no consumer. If the request body ends in the middle of
    // the part, Dicer emits a "terminated early" error on it. Without a listener
    // Node throws an unhandled 'error' event and exits the process.
    part.on('error', ()=>{});
    part.resume();
}
function hasBareLineBreak(value) {
    return typeof value === 'string' && (value.includes('\r') || value.includes('\n'));
}
function FileStream(opts) {
    Readable.call(this, opts);
    this.bytesRead = 0;
    this.truncated = false;
}
inherits(FileStream, Readable);
FileStream.prototype._read = function(n) {};
module.exports = Multipart;
}),
"[project]/node_modules/@fastify/busboy/lib/types/urlencoded.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Decoder = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/Decoder.js [app-route] (ecmascript)");
const decodeText = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/decodeText.js [app-route] (ecmascript)");
const getLimit = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/getLimit.js [app-route] (ecmascript)");
const RE_CHARSET = /^charset$/i;
UrlEncoded.detect = /^application\/x-www-form-urlencoded/i;
function UrlEncoded(boy, cfg) {
    const limits = cfg.limits;
    const parsedConType = cfg.parsedConType;
    this.boy = boy;
    this.fieldSizeLimit = getLimit(limits, 'fieldSize', 1 * 1024 * 1024);
    this.fieldNameSizeLimit = getLimit(limits, 'fieldNameSize', 100);
    this.fieldsLimit = getLimit(limits, 'fields', Infinity);
    let charset;
    for(var i = 0, len = parsedConType.length; i < len; ++i){
        if (Array.isArray(parsedConType[i]) && RE_CHARSET.test(parsedConType[i][0])) {
            charset = parsedConType[i][1].toLowerCase();
            break;
        }
    }
    if (charset === undefined) {
        charset = cfg.defCharset || 'utf8';
    }
    this.decoder = new Decoder();
    this.charset = charset;
    this._fields = 0;
    this._state = 'key';
    this._checkingBytes = true;
    this._bytesKey = 0;
    this._bytesVal = 0;
    this._key = '';
    this._val = '';
    this._keyTrunc = false;
    this._valTrunc = false;
    this._hitLimit = false;
}
UrlEncoded.prototype.write = function(data, cb) {
    if (this._fields === this.fieldsLimit) {
        if (!this.boy.hitFieldsLimit) {
            this.boy.hitFieldsLimit = true;
            this.boy.emit('fieldsLimit');
        }
        return cb();
    }
    let idxeq;
    let idxamp;
    let i;
    let p = 0;
    const len = data.length;
    while(p < len){
        if (this._state === 'key') {
            idxeq = idxamp = undefined;
            for(i = p; i < len; ++i){
                if (!this._checkingBytes) {
                    ++p;
                }
                if (data[i] === 0x3D /* = */ ) {
                    idxeq = i;
                    break;
                } else if (data[i] === 0x26 /* & */ ) {
                    idxamp = i;
                    break;
                }
                if (this._checkingBytes && this._bytesKey === this.fieldNameSizeLimit) {
                    this._hitLimit = true;
                    break;
                } else if (this._checkingBytes) {
                    ++this._bytesKey;
                }
            }
            if (idxeq !== undefined) {
                // key with assignment
                if (idxeq > p) {
                    this._key += this.decoder.write(data.toString('binary', p, idxeq));
                }
                this._endKey();
                this._state = 'val';
                this._hitLimit = false;
                this._checkingBytes = true;
                this._val = '';
                this._bytesVal = 0;
                this._valTrunc = false;
                this.decoder.reset();
                p = idxeq + 1;
            } else if (idxamp !== undefined) {
                // key with no assignment
                ++this._fields;
                if (idxamp > p) {
                    this._key += this.decoder.write(data.toString('binary', p, idxamp));
                }
                this._endKey();
                const key = this._key;
                const keyTrunc = this._keyTrunc;
                this._hitLimit = false;
                this._checkingBytes = true;
                this._key = '';
                this._bytesKey = 0;
                this._keyTrunc = false;
                this.decoder.reset();
                if (key.length) {
                    this.boy.emit('field', decodeText(key, 'binary', this.charset), '', keyTrunc, false);
                }
                p = idxamp + 1;
                if (this._fields === this.fieldsLimit) {
                    return cb();
                }
            } else if (this._hitLimit) {
                // we may not have hit the actual limit if there are encoded bytes...
                if (i > p) {
                    this._key += this.decoder.write(data.toString('binary', p, i));
                }
                p = i;
                // A malformed percent escape is emitted verbatim once the decoder sees
                // it is invalid, so the decoded length can jump past the limit.
                if ((this._bytesKey = this._key.length) >= this.fieldNameSizeLimit) {
                    // yep, we actually did hit the limit
                    this._key = this._key.substring(0, this.fieldNameSizeLimit);
                    this._checkingBytes = false;
                    this._keyTrunc = true;
                }
            } else {
                if (p < len) {
                    this._key += this.decoder.write(data.toString('binary', p));
                }
                p = len;
            }
        } else {
            idxamp = undefined;
            for(i = p; i < len; ++i){
                if (!this._checkingBytes) {
                    ++p;
                }
                if (data[i] === 0x26 /* & */ ) {
                    idxamp = i;
                    break;
                }
                if (this._checkingBytes && this._bytesVal === this.fieldSizeLimit) {
                    this._hitLimit = true;
                    break;
                } else if (this._checkingBytes) {
                    ++this._bytesVal;
                }
            }
            if (idxamp !== undefined) {
                ++this._fields;
                if (idxamp > p) {
                    this._val += this.decoder.write(data.toString('binary', p, idxamp));
                }
                this._endVal();
                this.boy.emit('field', decodeText(this._key, 'binary', this.charset), decodeText(this._val, 'binary', this.charset), this._keyTrunc, this._valTrunc);
                this._state = 'key';
                this._hitLimit = false;
                this._checkingBytes = true;
                this._key = '';
                this._bytesKey = 0;
                this._keyTrunc = false;
                this.decoder.reset();
                p = idxamp + 1;
                if (this._fields === this.fieldsLimit) {
                    return cb();
                }
            } else if (this._hitLimit) {
                // we may not have hit the actual limit if there are encoded bytes...
                if (i > p) {
                    this._val += this.decoder.write(data.toString('binary', p, i));
                }
                p = i;
                // A malformed percent escape is emitted verbatim once the decoder sees
                // it is invalid, so the decoded length can jump past the limit.
                if ((this._bytesVal = this._val.length) >= this.fieldSizeLimit) {
                    // yep, we actually did hit the limit
                    this._val = this._val.substring(0, this.fieldSizeLimit);
                    this._checkingBytes = false;
                    this._valTrunc = true;
                }
            } else {
                if (p < len) {
                    this._val += this.decoder.write(data.toString('binary', p));
                }
                p = len;
            }
        }
    }
    cb();
};
UrlEncoded.prototype.end = function() {
    if (this.boy._done) {
        return;
    }
    if (this._state === 'key') {
        this._endKey();
        if (this._key.length > 0) {
            this.boy.emit('field', decodeText(this._key, 'binary', this.charset), '', this._keyTrunc, false);
        }
    } else {
        this._endVal();
        this.boy.emit('field', decodeText(this._key, 'binary', this.charset), decodeText(this._val, 'binary', this.charset), this._keyTrunc, this._valTrunc);
    }
    this.boy._done = true;
    this.boy.emit('finish');
};
UrlEncoded.prototype._endKey = function() {
    this._key += this.decoder.end();
    if (this._key.length > this.fieldNameSizeLimit) {
        this._key = this._key.substring(0, this.fieldNameSizeLimit);
        this._keyTrunc = true;
    }
};
UrlEncoded.prototype._endVal = function() {
    this._val += this.decoder.end();
    if (this._val.length > this.fieldSizeLimit) {
        this._val = this._val.substring(0, this.fieldSizeLimit);
        this._valTrunc = true;
    }
};
module.exports = UrlEncoded;
}),
"[project]/node_modules/@fastify/busboy/lib/utils/Decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const RE_PLUS = /\+/g;
const HEX = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];
function Decoder() {
    this.buffer = undefined;
}
Decoder.prototype.write = function(str) {
    // Replace '+' with ' ' before decoding
    str = str.replace(RE_PLUS, ' ');
    let res = '';
    let i = 0;
    let p = 0;
    const len = str.length;
    for(; i < len; ++i){
        if (this.buffer !== undefined) {
            if (!HEX[str.charCodeAt(i)]) {
                res += '%' + this.buffer;
                this.buffer = undefined;
                --i; // retry character
            } else {
                this.buffer += str[i];
                ++p;
                if (this.buffer.length === 2) {
                    res += String.fromCharCode(parseInt(this.buffer, 16));
                    this.buffer = undefined;
                }
            }
        } else if (str[i] === '%') {
            if (i > p) {
                res += str.substring(p, i);
                p = i;
            }
            this.buffer = '';
            ++p;
        }
    }
    if (p < len && this.buffer === undefined) {
        res += str.substring(p);
    }
    return res;
};
Decoder.prototype.end = function() {
    // An incomplete escape at the end of the input is kept literally
    const res = this.buffer === undefined ? '' : '%' + this.buffer;
    this.buffer = undefined;
    return res;
};
Decoder.prototype.reset = function() {
    this.buffer = undefined;
};
module.exports = Decoder;
}),
"[project]/node_modules/@fastify/busboy/lib/utils/basename.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = function basename(path) {
    if (typeof path !== 'string') {
        return '';
    }
    for(var i = path.length - 1; i >= 0; --i){
        switch(path.charCodeAt(i)){
            case 0x2F:
            case 0x5C:
                path = path.slice(i + 1);
                return path === '..' || path === '.' ? '' : path;
        }
    }
    return path === '..' || path === '.' ? '' : path;
};
}),
"[project]/node_modules/@fastify/busboy/lib/utils/decodeText.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Node has always utf-8
const utf8Decoder = new TextDecoder('utf-8');
const textDecoders = new Map([
    [
        'utf-8',
        utf8Decoder
    ],
    [
        'utf8',
        utf8Decoder
    ]
]);
function getDecoder(charset) {
    let lc;
    while(true){
        switch(charset){
            case 'utf-8':
            case 'utf8':
                return decoders.utf8;
            case 'latin1':
            case 'ascii':
            case 'us-ascii':
            case 'iso-8859-1':
            case 'iso8859-1':
            case 'iso88591':
            case 'iso_8859-1':
            case 'windows-1252':
            case 'iso_8859-1:1987':
            case 'cp1252':
            case 'x-cp1252':
                return decoders.latin1;
            case 'utf16le':
            case 'utf-16le':
            case 'ucs2':
            case 'ucs-2':
                return decoders.utf16le;
            case 'base64':
                return decoders.base64;
            default:
                if (lc === undefined) {
                    lc = true;
                    charset = charset.toLowerCase();
                    continue;
                }
                return decoders.other.bind(charset);
        }
    }
}
function isAscii(data) {
    for(var i = 0, len = data.length; i < len; ++i){
        if (data.charCodeAt(i) > 0x7F) {
            return false;
        }
    }
    return true;
}
const decoders = {
    utf8: (data, sourceEncoding)=>{
        if (data.length === 0) {
            return '';
        }
        if (typeof data === 'string') {
            if (isAscii(data)) {
                return data;
            }
            data = Buffer.from(data, sourceEncoding);
        }
        return data.utf8Slice(0, data.length);
    },
    latin1: (data, sourceEncoding)=>{
        if (data.length === 0) {
            return '';
        }
        if (typeof data === 'string') {
            return data;
        }
        return data.latin1Slice(0, data.length);
    },
    utf16le: (data, sourceEncoding)=>{
        if (data.length === 0) {
            return '';
        }
        if (typeof data === 'string') {
            data = Buffer.from(data, sourceEncoding);
        }
        return data.ucs2Slice(0, data.length);
    },
    base64: (data, sourceEncoding)=>{
        if (data.length === 0) {
            return '';
        }
        if (typeof data === 'string') {
            data = Buffer.from(data, sourceEncoding);
        }
        return data.base64Slice(0, data.length);
    },
    other: (data, sourceEncoding)=>{
        if (data.length === 0) {
            return '';
        }
        if (typeof data === 'string') {
            data = Buffer.from(data, sourceEncoding);
        }
        if (textDecoders.has(/*TURBOPACK member replacement*/ __turbopack_context__.e.toString())) {
            try {
                return textDecoders.get(/*TURBOPACK member replacement*/ __turbopack_context__.e).decode(data);
            } catch  {}
        }
        return typeof data === 'string' ? data : data.toString();
    }
};
function decodeText(text, sourceEncoding, destEncoding) {
    if (text) {
        return getDecoder(destEncoding)(text, sourceEncoding);
    }
    return text;
}
module.exports = decodeText;
}),
"[project]/node_modules/@fastify/busboy/lib/utils/getLimit.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = function getLimit(limits, name, defaultLimit) {
    if (!limits || limits[name] === undefined || limits[name] === null) {
        return defaultLimit;
    }
    if (typeof limits[name] !== 'number' || isNaN(limits[name])) {
        throw new TypeError('Limit ' + name + ' is not a valid number');
    }
    return limits[name];
};
}),
"[project]/node_modules/@fastify/busboy/lib/utils/parseParams.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const decodeText = __turbopack_context__.r("[project]/node_modules/@fastify/busboy/lib/utils/decodeText.js [app-route] (ecmascript)");
const RE_ENCODED = /%[a-fA-F0-9][a-fA-F0-9]/g;
const EncodedLookup = {
    '%00': '\x00',
    '%01': '\x01',
    '%02': '\x02',
    '%03': '\x03',
    '%04': '\x04',
    '%05': '\x05',
    '%06': '\x06',
    '%07': '\x07',
    '%08': '\x08',
    '%09': '\x09',
    '%0a': '\x0a',
    '%0A': '\x0a',
    '%0b': '\x0b',
    '%0B': '\x0b',
    '%0c': '\x0c',
    '%0C': '\x0c',
    '%0d': '\x0d',
    '%0D': '\x0d',
    '%0e': '\x0e',
    '%0E': '\x0e',
    '%0f': '\x0f',
    '%0F': '\x0f',
    '%10': '\x10',
    '%11': '\x11',
    '%12': '\x12',
    '%13': '\x13',
    '%14': '\x14',
    '%15': '\x15',
    '%16': '\x16',
    '%17': '\x17',
    '%18': '\x18',
    '%19': '\x19',
    '%1a': '\x1a',
    '%1A': '\x1a',
    '%1b': '\x1b',
    '%1B': '\x1b',
    '%1c': '\x1c',
    '%1C': '\x1c',
    '%1d': '\x1d',
    '%1D': '\x1d',
    '%1e': '\x1e',
    '%1E': '\x1e',
    '%1f': '\x1f',
    '%1F': '\x1f',
    '%20': '\x20',
    '%21': '\x21',
    '%22': '\x22',
    '%23': '\x23',
    '%24': '\x24',
    '%25': '\x25',
    '%26': '\x26',
    '%27': '\x27',
    '%28': '\x28',
    '%29': '\x29',
    '%2a': '\x2a',
    '%2A': '\x2a',
    '%2b': '\x2b',
    '%2B': '\x2b',
    '%2c': '\x2c',
    '%2C': '\x2c',
    '%2d': '\x2d',
    '%2D': '\x2d',
    '%2e': '\x2e',
    '%2E': '\x2e',
    '%2f': '\x2f',
    '%2F': '\x2f',
    '%30': '\x30',
    '%31': '\x31',
    '%32': '\x32',
    '%33': '\x33',
    '%34': '\x34',
    '%35': '\x35',
    '%36': '\x36',
    '%37': '\x37',
    '%38': '\x38',
    '%39': '\x39',
    '%3a': '\x3a',
    '%3A': '\x3a',
    '%3b': '\x3b',
    '%3B': '\x3b',
    '%3c': '\x3c',
    '%3C': '\x3c',
    '%3d': '\x3d',
    '%3D': '\x3d',
    '%3e': '\x3e',
    '%3E': '\x3e',
    '%3f': '\x3f',
    '%3F': '\x3f',
    '%40': '\x40',
    '%41': '\x41',
    '%42': '\x42',
    '%43': '\x43',
    '%44': '\x44',
    '%45': '\x45',
    '%46': '\x46',
    '%47': '\x47',
    '%48': '\x48',
    '%49': '\x49',
    '%4a': '\x4a',
    '%4A': '\x4a',
    '%4b': '\x4b',
    '%4B': '\x4b',
    '%4c': '\x4c',
    '%4C': '\x4c',
    '%4d': '\x4d',
    '%4D': '\x4d',
    '%4e': '\x4e',
    '%4E': '\x4e',
    '%4f': '\x4f',
    '%4F': '\x4f',
    '%50': '\x50',
    '%51': '\x51',
    '%52': '\x52',
    '%53': '\x53',
    '%54': '\x54',
    '%55': '\x55',
    '%56': '\x56',
    '%57': '\x57',
    '%58': '\x58',
    '%59': '\x59',
    '%5a': '\x5a',
    '%5A': '\x5a',
    '%5b': '\x5b',
    '%5B': '\x5b',
    '%5c': '\x5c',
    '%5C': '\x5c',
    '%5d': '\x5d',
    '%5D': '\x5d',
    '%5e': '\x5e',
    '%5E': '\x5e',
    '%5f': '\x5f',
    '%5F': '\x5f',
    '%60': '\x60',
    '%61': '\x61',
    '%62': '\x62',
    '%63': '\x63',
    '%64': '\x64',
    '%65': '\x65',
    '%66': '\x66',
    '%67': '\x67',
    '%68': '\x68',
    '%69': '\x69',
    '%6a': '\x6a',
    '%6A': '\x6a',
    '%6b': '\x6b',
    '%6B': '\x6b',
    '%6c': '\x6c',
    '%6C': '\x6c',
    '%6d': '\x6d',
    '%6D': '\x6d',
    '%6e': '\x6e',
    '%6E': '\x6e',
    '%6f': '\x6f',
    '%6F': '\x6f',
    '%70': '\x70',
    '%71': '\x71',
    '%72': '\x72',
    '%73': '\x73',
    '%74': '\x74',
    '%75': '\x75',
    '%76': '\x76',
    '%77': '\x77',
    '%78': '\x78',
    '%79': '\x79',
    '%7a': '\x7a',
    '%7A': '\x7a',
    '%7b': '\x7b',
    '%7B': '\x7b',
    '%7c': '\x7c',
    '%7C': '\x7c',
    '%7d': '\x7d',
    '%7D': '\x7d',
    '%7e': '\x7e',
    '%7E': '\x7e',
    '%7f': '\x7f',
    '%7F': '\x7f',
    '%80': '\x80',
    '%81': '\x81',
    '%82': '\x82',
    '%83': '\x83',
    '%84': '\x84',
    '%85': '\x85',
    '%86': '\x86',
    '%87': '\x87',
    '%88': '\x88',
    '%89': '\x89',
    '%8a': '\x8a',
    '%8A': '\x8a',
    '%8b': '\x8b',
    '%8B': '\x8b',
    '%8c': '\x8c',
    '%8C': '\x8c',
    '%8d': '\x8d',
    '%8D': '\x8d',
    '%8e': '\x8e',
    '%8E': '\x8e',
    '%8f': '\x8f',
    '%8F': '\x8f',
    '%90': '\x90',
    '%91': '\x91',
    '%92': '\x92',
    '%93': '\x93',
    '%94': '\x94',
    '%95': '\x95',
    '%96': '\x96',
    '%97': '\x97',
    '%98': '\x98',
    '%99': '\x99',
    '%9a': '\x9a',
    '%9A': '\x9a',
    '%9b': '\x9b',
    '%9B': '\x9b',
    '%9c': '\x9c',
    '%9C': '\x9c',
    '%9d': '\x9d',
    '%9D': '\x9d',
    '%9e': '\x9e',
    '%9E': '\x9e',
    '%9f': '\x9f',
    '%9F': '\x9f',
    '%a0': '\xa0',
    '%A0': '\xa0',
    '%a1': '\xa1',
    '%A1': '\xa1',
    '%a2': '\xa2',
    '%A2': '\xa2',
    '%a3': '\xa3',
    '%A3': '\xa3',
    '%a4': '\xa4',
    '%A4': '\xa4',
    '%a5': '\xa5',
    '%A5': '\xa5',
    '%a6': '\xa6',
    '%A6': '\xa6',
    '%a7': '\xa7',
    '%A7': '\xa7',
    '%a8': '\xa8',
    '%A8': '\xa8',
    '%a9': '\xa9',
    '%A9': '\xa9',
    '%aa': '\xaa',
    '%Aa': '\xaa',
    '%aA': '\xaa',
    '%AA': '\xaa',
    '%ab': '\xab',
    '%Ab': '\xab',
    '%aB': '\xab',
    '%AB': '\xab',
    '%ac': '\xac',
    '%Ac': '\xac',
    '%aC': '\xac',
    '%AC': '\xac',
    '%ad': '\xad',
    '%Ad': '\xad',
    '%aD': '\xad',
    '%AD': '\xad',
    '%ae': '\xae',
    '%Ae': '\xae',
    '%aE': '\xae',
    '%AE': '\xae',
    '%af': '\xaf',
    '%Af': '\xaf',
    '%aF': '\xaf',
    '%AF': '\xaf',
    '%b0': '\xb0',
    '%B0': '\xb0',
    '%b1': '\xb1',
    '%B1': '\xb1',
    '%b2': '\xb2',
    '%B2': '\xb2',
    '%b3': '\xb3',
    '%B3': '\xb3',
    '%b4': '\xb4',
    '%B4': '\xb4',
    '%b5': '\xb5',
    '%B5': '\xb5',
    '%b6': '\xb6',
    '%B6': '\xb6',
    '%b7': '\xb7',
    '%B7': '\xb7',
    '%b8': '\xb8',
    '%B8': '\xb8',
    '%b9': '\xb9',
    '%B9': '\xb9',
    '%ba': '\xba',
    '%Ba': '\xba',
    '%bA': '\xba',
    '%BA': '\xba',
    '%bb': '\xbb',
    '%Bb': '\xbb',
    '%bB': '\xbb',
    '%BB': '\xbb',
    '%bc': '\xbc',
    '%Bc': '\xbc',
    '%bC': '\xbc',
    '%BC': '\xbc',
    '%bd': '\xbd',
    '%Bd': '\xbd',
    '%bD': '\xbd',
    '%BD': '\xbd',
    '%be': '\xbe',
    '%Be': '\xbe',
    '%bE': '\xbe',
    '%BE': '\xbe',
    '%bf': '\xbf',
    '%Bf': '\xbf',
    '%bF': '\xbf',
    '%BF': '\xbf',
    '%c0': '\xc0',
    '%C0': '\xc0',
    '%c1': '\xc1',
    '%C1': '\xc1',
    '%c2': '\xc2',
    '%C2': '\xc2',
    '%c3': '\xc3',
    '%C3': '\xc3',
    '%c4': '\xc4',
    '%C4': '\xc4',
    '%c5': '\xc5',
    '%C5': '\xc5',
    '%c6': '\xc6',
    '%C6': '\xc6',
    '%c7': '\xc7',
    '%C7': '\xc7',
    '%c8': '\xc8',
    '%C8': '\xc8',
    '%c9': '\xc9',
    '%C9': '\xc9',
    '%ca': '\xca',
    '%Ca': '\xca',
    '%cA': '\xca',
    '%CA': '\xca',
    '%cb': '\xcb',
    '%Cb': '\xcb',
    '%cB': '\xcb',
    '%CB': '\xcb',
    '%cc': '\xcc',
    '%Cc': '\xcc',
    '%cC': '\xcc',
    '%CC': '\xcc',
    '%cd': '\xcd',
    '%Cd': '\xcd',
    '%cD': '\xcd',
    '%CD': '\xcd',
    '%ce': '\xce',
    '%Ce': '\xce',
    '%cE': '\xce',
    '%CE': '\xce',
    '%cf': '\xcf',
    '%Cf': '\xcf',
    '%cF': '\xcf',
    '%CF': '\xcf',
    '%d0': '\xd0',
    '%D0': '\xd0',
    '%d1': '\xd1',
    '%D1': '\xd1',
    '%d2': '\xd2',
    '%D2': '\xd2',
    '%d3': '\xd3',
    '%D3': '\xd3',
    '%d4': '\xd4',
    '%D4': '\xd4',
    '%d5': '\xd5',
    '%D5': '\xd5',
    '%d6': '\xd6',
    '%D6': '\xd6',
    '%d7': '\xd7',
    '%D7': '\xd7',
    '%d8': '\xd8',
    '%D8': '\xd8',
    '%d9': '\xd9',
    '%D9': '\xd9',
    '%da': '\xda',
    '%Da': '\xda',
    '%dA': '\xda',
    '%DA': '\xda',
    '%db': '\xdb',
    '%Db': '\xdb',
    '%dB': '\xdb',
    '%DB': '\xdb',
    '%dc': '\xdc',
    '%Dc': '\xdc',
    '%dC': '\xdc',
    '%DC': '\xdc',
    '%dd': '\xdd',
    '%Dd': '\xdd',
    '%dD': '\xdd',
    '%DD': '\xdd',
    '%de': '\xde',
    '%De': '\xde',
    '%dE': '\xde',
    '%DE': '\xde',
    '%df': '\xdf',
    '%Df': '\xdf',
    '%dF': '\xdf',
    '%DF': '\xdf',
    '%e0': '\xe0',
    '%E0': '\xe0',
    '%e1': '\xe1',
    '%E1': '\xe1',
    '%e2': '\xe2',
    '%E2': '\xe2',
    '%e3': '\xe3',
    '%E3': '\xe3',
    '%e4': '\xe4',
    '%E4': '\xe4',
    '%e5': '\xe5',
    '%E5': '\xe5',
    '%e6': '\xe6',
    '%E6': '\xe6',
    '%e7': '\xe7',
    '%E7': '\xe7',
    '%e8': '\xe8',
    '%E8': '\xe8',
    '%e9': '\xe9',
    '%E9': '\xe9',
    '%ea': '\xea',
    '%Ea': '\xea',
    '%eA': '\xea',
    '%EA': '\xea',
    '%eb': '\xeb',
    '%Eb': '\xeb',
    '%eB': '\xeb',
    '%EB': '\xeb',
    '%ec': '\xec',
    '%Ec': '\xec',
    '%eC': '\xec',
    '%EC': '\xec',
    '%ed': '\xed',
    '%Ed': '\xed',
    '%eD': '\xed',
    '%ED': '\xed',
    '%ee': '\xee',
    '%Ee': '\xee',
    '%eE': '\xee',
    '%EE': '\xee',
    '%ef': '\xef',
    '%Ef': '\xef',
    '%eF': '\xef',
    '%EF': '\xef',
    '%f0': '\xf0',
    '%F0': '\xf0',
    '%f1': '\xf1',
    '%F1': '\xf1',
    '%f2': '\xf2',
    '%F2': '\xf2',
    '%f3': '\xf3',
    '%F3': '\xf3',
    '%f4': '\xf4',
    '%F4': '\xf4',
    '%f5': '\xf5',
    '%F5': '\xf5',
    '%f6': '\xf6',
    '%F6': '\xf6',
    '%f7': '\xf7',
    '%F7': '\xf7',
    '%f8': '\xf8',
    '%F8': '\xf8',
    '%f9': '\xf9',
    '%F9': '\xf9',
    '%fa': '\xfa',
    '%Fa': '\xfa',
    '%fA': '\xfa',
    '%FA': '\xfa',
    '%fb': '\xfb',
    '%Fb': '\xfb',
    '%fB': '\xfb',
    '%FB': '\xfb',
    '%fc': '\xfc',
    '%Fc': '\xfc',
    '%fC': '\xfc',
    '%FC': '\xfc',
    '%fd': '\xfd',
    '%Fd': '\xfd',
    '%fD': '\xfd',
    '%FD': '\xfd',
    '%fe': '\xfe',
    '%Fe': '\xfe',
    '%fE': '\xfe',
    '%FE': '\xfe',
    '%ff': '\xff',
    '%Ff': '\xff',
    '%fF': '\xff',
    '%FF': '\xff'
};
function encodedReplacer(match) {
    return EncodedLookup[match];
}
function decodeUtf8Text(text) {
    for(var i = 0, len = text.length; i < len; ++i){
        if (text.charCodeAt(i) > 0x7F) {
            return decodeText(text, 'binary', 'utf8');
        }
    }
    return text;
}
const STATE_KEY = 0;
const STATE_VALUE = 1;
const STATE_CHARSET = 2;
const STATE_LANG = 3;
function parseFormDataDisposition(str) {
    if (!str.startsWith('form-data; name="')) {
        return;
    }
    let valueStart = 17;
    let valueEnd = str.indexOf('"', valueStart);
    if (valueEnd === -1 || str.indexOf('\\', valueStart) !== -1) {
        return;
    }
    const res = [
        'form-data',
        [
            'name',
            decodeUtf8Text(str.slice(valueStart, valueEnd))
        ]
    ];
    let pos = valueEnd + 1;
    while(pos < str.length && str[pos] !== ';'){
        ++pos;
    }
    if (pos === str.length) {
        return res;
    }
    ++pos;
    while(str[pos] === ' ' || str[pos] === '\t'){
        ++pos;
    }
    if (!str.startsWith('filename="', pos)) {
        return;
    }
    valueStart = pos + 10;
    valueEnd = str.indexOf('"', valueStart);
    if (valueEnd === -1 || str.indexOf('\\', valueStart) !== -1) {
        return;
    }
    res.push([
        'filename',
        decodeUtf8Text(str.slice(valueStart, valueEnd))
    ]);
    return res;
}
function parseParams(str) {
    if (str.indexOf(';') === -1) {
        return [
            decodeUtf8Text(str)
        ];
    }
    const fastFormData = parseFormDataDisposition(str);
    if (fastFormData !== undefined) {
        return fastFormData;
    }
    const res = [];
    let state = STATE_KEY;
    let charset = '';
    let inquote = false;
    let escaping = false;
    let p = 0;
    let tmp = '';
    const len = str.length;
    for(var i = 0; i < len; ++i){
        const char = str[i];
        if (char === '\\' && inquote) {
            if (escaping) {
                escaping = false;
            } else {
                escaping = true;
                continue;
            }
        } else if (char === '"') {
            if (!escaping) {
                if (inquote) {
                    inquote = false;
                    state = STATE_KEY;
                    // Skip any remaining characters until we hit a semicolon or end of string
                    // This ensures we don't include characters after the closing quote
                    while(i + 1 < len && str[i + 1] !== ';'){
                        ++i;
                    }
                } else {
                    inquote = true;
                }
                continue;
            } else {
                escaping = false;
            }
        } else {
            if (escaping && inquote) {
                tmp += '\\';
            }
            escaping = false;
            if ((state === STATE_CHARSET || state === STATE_LANG) && char === "'") {
                if (state === STATE_CHARSET) {
                    state = STATE_LANG;
                    charset = tmp.substring(1);
                } else {
                    state = STATE_VALUE;
                }
                tmp = '';
                continue;
            } else if (state === STATE_KEY && (char === '*' || char === '=') && res.length) {
                state = char === '*' ? STATE_CHARSET : STATE_VALUE;
                res[p] = [
                    tmp,
                    undefined
                ];
                tmp = '';
                continue;
            } else if (!inquote && char === ';') {
                state = STATE_KEY;
                if (charset) {
                    if (tmp.length) {
                        tmp = decodeText(tmp.replace(RE_ENCODED, encodedReplacer), 'binary', charset);
                    }
                    charset = '';
                } else if (tmp.length) {
                    tmp = decodeUtf8Text(tmp);
                }
                if (res[p] === undefined) {
                    res[p] = tmp;
                } else {
                    res[p][1] = tmp;
                }
                tmp = '';
                ++p;
                continue;
            } else if (!inquote && (char === ' ' || char === '\t')) {
                continue;
            }
        }
        tmp += char;
    }
    if (charset && tmp.length) {
        tmp = decodeText(tmp.replace(RE_ENCODED, encodedReplacer), 'binary', charset);
    } else if (tmp) {
        tmp = decodeUtf8Text(tmp);
    }
    if (res[p] === undefined) {
        if (tmp) {
            res[p] = tmp;
        }
    } else {
        res[p][1] = tmp;
    }
    return res;
}
module.exports = parseParams;
}),
"[project]/node_modules/@opentelemetry/api/dist/api/context.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_global_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)");
const require_diag = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)");
const require_NoopContextManager = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/context/NoopContextManager.cjs [app-route] (ecmascript)");
//#region src/api/context.ts
const API_NAME = "context";
const NOOP_CONTEXT_MANAGER = new require_NoopContextManager.NoopContextManager();
const NOOP_TOKEN = Object.freeze({
    dispose: ()=>{}
});
/**
* Singleton object which represents the entry point to the OpenTelemetry Context API
*
* @since 1.0.0
*/ var ContextAPI = class ContextAPI {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ constructor(){
        this._attachUnsupportedWarned = false;
    }
    /** Get the singleton instance of the Context API */ static getInstance() {
        if (!this._instance) this._instance = new ContextAPI();
        return this._instance;
    }
    /**
	* Set the current context manager.
	*
	* @returns true if the context manager was successfully registered, else false
	*/ setGlobalContextManager(contextManager) {
        return require_global_utils.registerGlobal(API_NAME, contextManager, require_diag.DiagAPI.instance());
    }
    /**
	* Get the currently active context
	*/ active() {
        return this._getContextManager().active();
    }
    /**
	* Execute a function with an active context
	*
	* @param context context to be active during function execution
	* @param fn function to execute in a context
	* @param thisArg optional receiver to be used for calling fn
	* @param args optional arguments forwarded to fn
	*/ with(context, fn, thisArg, ...args) {
        return this._getContextManager().with(context, fn, thisArg, ...args);
    }
    /**
	* Bind a context to a target function or event emitter
	*
	* @param context context to bind to the event emitter or function. Defaults to the currently active context
	* @param target function or event emitter to bind
	*/ bind(context, target) {
        return this._getContextManager().bind(context, target);
    }
    /**
	* Imperatively sets `context` as active, returning a {@link ContextManagementToken} whose
	* {@link ContextManagementToken.dispose} restores the previous context.
	*
	* This is a delicate, low-level API - prefer {@link with}/{@link bind}, which
	* restore context automatically. Use `attach` only to bridge callback
	* boundaries that `with` cannot wrap. Call `token.dispose()` when the
	* operation is done.
	*
	* **Caveat for async functions:** If called inside an async function before
	* the first `await`, the context change may leak into the caller's context
	* and remain active there. Prefer {@link with} for async code.
	*
	* Support is best-effort and varies by the active ContextManager (see
	* {@link ContextManager.attach}); if it does not implement `attach`, this logs
	* a warning and returns a no-op token.
	*
	* @param context The Context to attach
	* @returns A {@link ContextManagementToken} whose dispose() restores the previous Context
	* @since 1.10.0
	* @experimental This API is experimental and may change in minor releases without prior notice.
	*/ attach(context) {
        const contextManager = this._getContextManager();
        if (contextManager.attach) return contextManager.attach(context);
        if (!this._attachUnsupportedWarned) {
            this._attachUnsupportedWarned = true;
            require_diag.DiagAPI.instance().warn("The current ContextManager does not implement attach(). The context will not be attached. Use a ContextManager that supports attach() (e.g. AsyncLocalStorageContextManager) or use with()/bind() instead.");
        }
        return NOOP_TOKEN;
    }
    _getContextManager() {
        return require_global_utils.getGlobal(API_NAME) || NOOP_CONTEXT_MANAGER;
    }
    /** Disable and remove the global context manager */ disable() {
        this._getContextManager().disable();
        require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
    }
};
//#endregion
exports.ContextAPI = ContextAPI;
}),
"[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_global_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)");
const require_ComponentLogger = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/diag/ComponentLogger.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/diag/types.cjs [app-route] (ecmascript)");
const require_logLevelLogger = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/diag/internal/logLevelLogger.cjs [app-route] (ecmascript)");
//#region src/api/diag.ts
const API_NAME = "diag";
/**
* Singleton object which represents the entry point to the OpenTelemetry internal
* diagnostic API
*
* @since 1.0.0
*/ var DiagAPI = class DiagAPI {
    /** Get the singleton instance of the DiagAPI API */ static instance() {
        if (!this._instance) this._instance = new DiagAPI();
        return this._instance;
    }
    /**
	* Private internal constructor
	* @private
	*/ constructor(){
        function _logProxy(funcName) {
            return function(...args) {
                const logger = require_global_utils.getGlobal("diag");
                if (!logger) return;
                return logger[funcName](...args);
            };
        }
        const self = this;
        const setLogger = (logger, optionsOrLogLevel = {
            logLevel: 60
        })=>{
            var _optionsOrLogLevel$lo;
            if (logger === self) {
                var _err$stack;
                const err = /* @__PURE__ */ new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                self.error((_err$stack = err.stack) !== null && _err$stack !== void 0 ? _err$stack : err.message);
                return false;
            }
            if (typeof optionsOrLogLevel === "number") optionsOrLogLevel = {
                logLevel: optionsOrLogLevel
            };
            const oldLogger = require_global_utils.getGlobal("diag");
            const newLogger = require_logLevelLogger.createLogLevelDiagLogger((_optionsOrLogLevel$lo = optionsOrLogLevel.logLevel) !== null && _optionsOrLogLevel$lo !== void 0 ? _optionsOrLogLevel$lo : 60, logger);
            if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
                var _Error$stack;
                const stack = (_Error$stack = /* @__PURE__ */ new Error().stack) !== null && _Error$stack !== void 0 ? _Error$stack : "<failed to generate stacktrace>";
                oldLogger.warn(`Current logger will be overwritten from ${stack}`);
                newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
            }
            return require_global_utils.registerGlobal("diag", newLogger, self, true);
        };
        self.setLogger = setLogger;
        self.disable = ()=>{
            require_global_utils.unregisterGlobal(API_NAME, self);
        };
        self.createComponentLogger = (options)=>{
            return new require_ComponentLogger.DiagComponentLogger(options);
        };
        self.verbose = _logProxy("verbose");
        self.debug = _logProxy("debug");
        self.info = _logProxy("info");
        self.warn = _logProxy("warn");
        self.error = _logProxy("error");
    }
};
//#endregion
exports.DiagAPI = DiagAPI;
}),
"[project]/node_modules/@opentelemetry/api/dist/api/logs.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_global_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)");
const require_diag = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)");
const require_ProxyLoggerProvider = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs/ProxyLoggerProvider.cjs [app-route] (ecmascript)");
//#region src/api/logs.ts
const API_NAME = "logs";
/**
* Singleton object which represents the entry point to the OpenTelemetry Logs API
*
* @since 1.10.0
*/ var LogsAPI = class LogsAPI {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ constructor(){
        this._proxyLoggerProvider = new require_ProxyLoggerProvider.ProxyLoggerProvider();
    }
    /** Get the singleton instance of the Logs API */ static getInstance() {
        if (!this._instance) this._instance = new LogsAPI();
        return this._instance;
    }
    setGlobalLoggerProvider(provider) {
        const success = require_global_utils.registerGlobal(API_NAME, provider, require_diag.DiagAPI.instance());
        if (success) this._proxyLoggerProvider._setDelegate(provider);
        return success;
    }
    /**
	* Returns the global logger provider.
	*
	* @returns LoggerProvider
	*/ getLoggerProvider() {
        return require_global_utils.getGlobal(API_NAME) || this._proxyLoggerProvider;
    }
    /**
	* Returns a Logger, creating one if one with the given name, version,
	* schemaUrl, and attributes is not already created.
	*
	* Getting a Logger may be expensive, especially when `attributes` are
	* provided. Reuse Logger instances where possible instead of calling
	* `getLogger()` on hot paths.
	*
	* @param name The name of the logger or instrumentation library.
	* @param version The version of the logger or instrumentation library.
	* @param options The options of the logger or instrumentation library.
	* @returns {@link Logger}
	*/ getLogger(name, version, options) {
        return this.getLoggerProvider().getLogger(name, version, options);
    }
    /** Remove the global logger provider */ disable() {
        require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
        this._proxyLoggerProvider = new require_ProxyLoggerProvider.ProxyLoggerProvider();
    }
};
//#endregion
exports.LogsAPI = LogsAPI;
}),
"[project]/node_modules/@opentelemetry/api/dist/api/metrics.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_global_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)");
const require_diag = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)");
const require_NoopMeterProvider = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/metrics/NoopMeterProvider.cjs [app-route] (ecmascript)");
//#region src/api/metrics.ts
const API_NAME = "metrics";
/**
* Singleton object which represents the entry point to the OpenTelemetry Metrics API
*
* @since 1.4.1
*/ var MetricsAPI = class MetricsAPI {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ constructor(){}
    /** Get the singleton instance of the Metrics API */ static getInstance() {
        if (!this._instance) this._instance = new MetricsAPI();
        return this._instance;
    }
    /**
	* Set the current global meter provider.
	* Returns true if the meter provider was successfully registered, else false.
	*/ setGlobalMeterProvider(provider) {
        return require_global_utils.registerGlobal(API_NAME, provider, require_diag.DiagAPI.instance());
    }
    /**
	* Returns the global meter provider.
	*/ getMeterProvider() {
        return require_global_utils.getGlobal(API_NAME) || require_NoopMeterProvider.NOOP_METER_PROVIDER;
    }
    /**
	* Returns a meter from the global meter provider.
	*/ getMeter(name, version, options) {
        return this.getMeterProvider().getMeter(name, version, options);
    }
    /** Remove the global meter provider */ disable() {
        require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
    }
};
//#endregion
exports.MetricsAPI = MetricsAPI;
}),
"[project]/node_modules/@opentelemetry/api/dist/api/propagation.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_global_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)");
const require_diag = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/baggage/utils.cjs [app-route] (ecmascript)");
const require_TextMapPropagator = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/propagation/TextMapPropagator.cjs [app-route] (ecmascript)");
const require_NoopTextMapPropagator = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/propagation/NoopTextMapPropagator.cjs [app-route] (ecmascript)");
const require_context_helpers = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/baggage/context-helpers.cjs [app-route] (ecmascript)");
//#region src/api/propagation.ts
const API_NAME = "propagation";
const NOOP_TEXT_MAP_PROPAGATOR = new require_NoopTextMapPropagator.NoopTextMapPropagator();
/**
* Singleton object which represents the entry point to the OpenTelemetry Propagation API
*
* @since 1.0.0
*/ var PropagationAPI = class PropagationAPI {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ constructor(){
        this.createBaggage = require_utils.createBaggage;
        this.getBaggage = require_context_helpers.getBaggage;
        this.getActiveBaggage = require_context_helpers.getActiveBaggage;
        this.setBaggage = require_context_helpers.setBaggage;
        this.deleteBaggage = require_context_helpers.deleteBaggage;
    }
    /** Get the singleton instance of the Propagator API */ static getInstance() {
        if (!this._instance) this._instance = new PropagationAPI();
        return this._instance;
    }
    /**
	* Set the current propagator.
	*
	* @returns true if the propagator was successfully registered, else false
	*/ setGlobalPropagator(propagator) {
        return require_global_utils.registerGlobal(API_NAME, propagator, require_diag.DiagAPI.instance());
    }
    /**
	* Inject context into a carrier to be propagated inter-process
	*
	* @param context Context carrying tracing data to inject
	* @param carrier carrier to inject context into
	* @param setter Function used to set values on the carrier
	*/ inject(context, carrier, setter = require_TextMapPropagator.defaultTextMapSetter) {
        return this._getGlobalPropagator().inject(context, carrier, setter);
    }
    /**
	* Extract context from a carrier
	*
	* @param context Context which the newly created context will inherit from
	* @param carrier Carrier to extract context from
	* @param getter Function used to extract keys from a carrier
	*/ extract(context, carrier, getter = require_TextMapPropagator.defaultTextMapGetter) {
        return this._getGlobalPropagator().extract(context, carrier, getter);
    }
    /**
	* Return a list of all fields which may be used by the propagator.
	*/ fields() {
        return this._getGlobalPropagator().fields();
    }
    /** Remove the global propagator */ disable() {
        require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
    }
    _getGlobalPropagator() {
        return require_global_utils.getGlobal(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
    }
};
//#endregion
exports.PropagationAPI = PropagationAPI;
}),
"[project]/node_modules/@opentelemetry/api/dist/api/trace.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_global_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)");
const require_diag = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)");
const require_context_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/context-utils.cjs [app-route] (ecmascript)");
const require_spancontext_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/spancontext-utils.cjs [app-route] (ecmascript)");
const require_ProxyTracerProvider = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/ProxyTracerProvider.cjs [app-route] (ecmascript)");
//#region src/api/trace.ts
const API_NAME = "trace";
/**
* Singleton object which represents the entry point to the OpenTelemetry Tracing API
*
* @since 1.0.0
*/ var TraceAPI = class TraceAPI {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ constructor(){
        this._proxyTracerProvider = new require_ProxyTracerProvider.ProxyTracerProvider();
        this.wrapSpanContext = require_spancontext_utils.wrapSpanContext;
        this.isSpanContextValid = require_spancontext_utils.isSpanContextValid;
        this.deleteSpan = require_context_utils.deleteSpan;
        this.getSpan = require_context_utils.getSpan;
        this.getActiveSpan = require_context_utils.getActiveSpan;
        this.getSpanContext = require_context_utils.getSpanContext;
        this.setSpan = require_context_utils.setSpan;
        this.setSpanContext = require_context_utils.setSpanContext;
    }
    /** Get the singleton instance of the Trace API */ static getInstance() {
        if (!this._instance) this._instance = new TraceAPI();
        return this._instance;
    }
    /**
	* Set the current global tracer.
	*
	* @returns true if the tracer provider was successfully registered, else false
	*/ setGlobalTracerProvider(provider) {
        const success = require_global_utils.registerGlobal(API_NAME, this._proxyTracerProvider, require_diag.DiagAPI.instance());
        if (success) this._proxyTracerProvider.setDelegate(provider);
        return success;
    }
    /**
	* Returns the global tracer provider.
	*/ getTracerProvider() {
        return require_global_utils.getGlobal(API_NAME) || this._proxyTracerProvider;
    }
    /**
	* Returns a tracer from the global tracer provider.
	*/ getTracer(name, version) {
        return this.getTracerProvider().getTracer(name, version);
    }
    /** Remove the global tracer provider */ disable() {
        require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
        this._proxyTracerProvider = new require_ProxyTracerProvider.ProxyTracerProvider();
    }
};
//#endregion
exports.TraceAPI = TraceAPI;
}),
"[project]/node_modules/@opentelemetry/api/dist/baggage/context-helpers.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_context = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/context/context.cjs [app-route] (ecmascript)");
const require_context$1 = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/context.cjs [app-route] (ecmascript)");
//#region src/baggage/context-helpers.ts
/**
* Baggage key
*/ const BAGGAGE_KEY = require_context.createContextKey("OpenTelemetry Baggage Key");
/**
* Retrieve the current baggage from the given context
*
* @param {Context} Context that manage all context values
* @returns {Baggage} Extracted baggage from the context
*/ function getBaggage(context) {
    return context.getValue(BAGGAGE_KEY) || void 0;
}
/**
* Retrieve the current baggage from the active/current context
*
* @returns {Baggage} Extracted baggage from the context
*/ function getActiveBaggage() {
    return getBaggage(require_context$1.ContextAPI.getInstance().active());
}
/**
* Store a baggage in the given context
*
* @param {Context} Context that manage all context values
* @param {Baggage} baggage that will be set in the actual context
*/ function setBaggage(context, baggage) {
    return context.setValue(BAGGAGE_KEY, baggage);
}
/**
* Delete the baggage stored in the given context
*
* @param {Context} Context that manage all context values
*/ function deleteBaggage(context) {
    return context.deleteValue(BAGGAGE_KEY);
}
//#endregion
exports.deleteBaggage = deleteBaggage;
exports.getActiveBaggage = getActiveBaggage;
exports.getBaggage = getBaggage;
exports.setBaggage = setBaggage;
}),
"[project]/node_modules/@opentelemetry/api/dist/baggage/internal/baggage-impl.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/baggage/internal/baggage-impl.ts
var BaggageImpl = class BaggageImpl {
    constructor(entries){
        this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
    }
    getEntry(key) {
        const entry = this._entries.get(key);
        if (!entry) return;
        return Object.assign({}, entry);
    }
    getAllEntries() {
        return Array.from(this._entries.entries());
    }
    setEntry(key, entry) {
        const newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
    }
    removeEntry(key) {
        const newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
    }
    removeEntries(...keys) {
        const newBaggage = new BaggageImpl(this._entries);
        for (const key of keys)newBaggage._entries.delete(key);
        return newBaggage;
    }
    clear() {
        return new BaggageImpl();
    }
};
//#endregion
exports.BaggageImpl = BaggageImpl;
}),
"[project]/node_modules/@opentelemetry/api/dist/baggage/internal/symbol.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/baggage/internal/symbol.ts
/**
* Symbol used to make BaggageEntryMetadata an opaque type
*/ const baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
//#endregion
exports.baggageEntryMetadataSymbol = baggageEntryMetadataSymbol;
}),
"[project]/node_modules/@opentelemetry/api/dist/baggage/utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_diag = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)");
const require_baggage_impl = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/baggage/internal/baggage-impl.cjs [app-route] (ecmascript)");
const require_symbol = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/baggage/internal/symbol.cjs [app-route] (ecmascript)");
//#region src/baggage/utils.ts
const diag = require_diag.DiagAPI.instance();
/**
* Create a new Baggage with optional entries
*
* @param entries An array of baggage entries the new baggage should contain
*/ function createBaggage(entries = {}) {
    return new require_baggage_impl.BaggageImpl(new Map(Object.entries(entries)));
}
/**
* Create a serializable BaggageEntryMetadata object from a string.
*
* @param str string metadata. Format is currently not defined by the spec and has no special meaning.
*
* @since 1.0.0
*/ function baggageEntryMetadataFromString(str) {
    if (typeof str !== "string") {
        diag.error(`Cannot create baggage metadata from unknown type: ${typeof str}`);
        str = "";
    }
    return {
        __TYPE__: require_symbol.baggageEntryMetadataSymbol,
        toString () {
            return str;
        }
    };
}
//#endregion
exports.baggageEntryMetadataFromString = baggageEntryMetadataFromString;
exports.createBaggage = createBaggage;
}),
"[project]/node_modules/@opentelemetry/api/dist/context-api.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/context-api.ts
/**
* Entrypoint for context API
* @since 1.0.0
*/ const context = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/context.cjs [app-route] (ecmascript)").ContextAPI.getInstance();
//#endregion
exports.context = context;
}),
"[project]/node_modules/@opentelemetry/api/dist/context/NoopContextManager.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_context = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/context/context.cjs [app-route] (ecmascript)");
//#region src/context/NoopContextManager.ts
var NoopContextManager = class {
    active() {
        return require_context.ROOT_CONTEXT;
    }
    with(_context, fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
    }
    bind(_context, target) {
        return target;
    }
    enable() {
        return this;
    }
    disable() {
        return this;
    }
    /** @experimental This API is experimental and may change in minor releases without prior notice. */ attach(_context) {
        return {
            dispose () {}
        };
    }
};
//#endregion
exports.NoopContextManager = NoopContextManager;
}),
"[project]/node_modules/@opentelemetry/api/dist/context/context.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/context/context.ts
/**
* Get a key to uniquely identify a context value
*
* @since 1.0.0
*/ function createContextKey(description) {
    return Symbol.for(description);
}
/**
* The root context is used as the default parent context when there is no active context
*
* @since 1.0.0
*/ const ROOT_CONTEXT = new class BaseContext {
    /**
	* Construct a new context which inherits values from an optional parent context.
	*
	* @param parentContext a context from which to inherit values
	*/ constructor(parentContext){
        const self = this;
        self._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self.getValue = (key)=>self._currentContext.get(key);
        self.setValue = (key, value)=>{
            const context = new BaseContext(self._currentContext);
            context._currentContext.set(key, value);
            return context;
        };
        self.deleteValue = (key)=>{
            const context = new BaseContext(self._currentContext);
            context._currentContext.delete(key);
            return context;
        };
    }
}();
//#endregion
exports.ROOT_CONTEXT = ROOT_CONTEXT;
exports.createContextKey = createContextKey;
}),
"[project]/node_modules/@opentelemetry/api/dist/diag-api.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/diag-api.ts
/**
* Entrypoint for Diag API.
* Defines Diagnostic handler used for internal diagnostic logging operations.
* The default provides a Noop DiagLogger implementation which may be changed via the
* diag.setLogger(logger: DiagLogger) function.
*
* @since 1.0.0
*/ const diag = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/diag.cjs [app-route] (ecmascript)").DiagAPI.instance();
//#endregion
exports.diag = diag;
}),
"[project]/node_modules/@opentelemetry/api/dist/diag/ComponentLogger.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_global_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)");
//#region src/diag/ComponentLogger.ts
/**
* Component Logger which is meant to be used as part of any component which
* will add automatically additional namespace in front of the log message.
* It will then forward all message to global diag logger
* @example
* const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
* cLogger.debug('test');
* // @opentelemetry/instrumentation-http test
*/ var DiagComponentLogger = class {
    constructor(props){
        this._namespace = props.namespace || "DiagComponentLogger";
    }
    debug(...args) {
        return logProxy("debug", this._namespace, args);
    }
    error(...args) {
        return logProxy("error", this._namespace, args);
    }
    info(...args) {
        return logProxy("info", this._namespace, args);
    }
    warn(...args) {
        return logProxy("warn", this._namespace, args);
    }
    verbose(...args) {
        return logProxy("verbose", this._namespace, args);
    }
};
function logProxy(funcName, namespace, args) {
    const logger = require_global_utils.getGlobal("diag");
    if (!logger) return;
    return logger[funcName](namespace, ...args);
}
//#endregion
exports.DiagComponentLogger = DiagComponentLogger;
}),
"[project]/node_modules/@opentelemetry/api/dist/diag/consoleLogger.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/diag/consoleLogger.ts
const consoleMap = [
    {
        n: "error",
        c: "error"
    },
    {
        n: "warn",
        c: "warn"
    },
    {
        n: "info",
        c: "info"
    },
    {
        n: "debug",
        c: "debug"
    },
    {
        n: "verbose",
        c: "trace"
    }
];
const _originalConsoleMethods = {};
if (typeof console !== "undefined") {
    for (const key of [
        "error",
        "warn",
        "info",
        "debug",
        "trace",
        "log"
    ])if (typeof console[key] === "function") _originalConsoleMethods[key] = console[key];
}
/**
* A simple Immutable Console based diagnostic logger which will output any messages to the Console.
* If you want to limit the amount of logging to a specific level or lower use the
* {@link createLogLevelDiagLogger}
*
* @since 1.0.0
*/ var DiagConsoleLogger = class {
    constructor(){
        function _consoleFunc(funcName) {
            return function(...args) {
                let theFunc = _originalConsoleMethods[funcName];
                if (typeof theFunc !== "function") theFunc = _originalConsoleMethods["log"];
                if (typeof theFunc !== "function" && console) {
                    theFunc = console[funcName];
                    if (typeof theFunc !== "function") theFunc = console.log;
                }
                if (typeof theFunc === "function") return theFunc.apply(console, args);
            };
        }
        for(let i = 0; i < consoleMap.length; i++)this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
    }
};
//#endregion
exports.DiagConsoleLogger = DiagConsoleLogger;
exports._originalConsoleMethods = _originalConsoleMethods;
}),
"[project]/node_modules/@opentelemetry/api/dist/diag/internal/logLevelLogger.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/diag/types.cjs [app-route] (ecmascript)");
//#region src/diag/internal/logLevelLogger.ts
function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < 0) maxLevel = 0;
    else if (maxLevel > 9999) maxLevel = 9999;
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
        const theFunc = logger[funcName];
        if (typeof theFunc === "function" && maxLevel >= theLevel) return theFunc.bind(logger);
        return function() {};
    }
    return {
        error: _filterFunc("error", 30),
        warn: _filterFunc("warn", 50),
        info: _filterFunc("info", 60),
        debug: _filterFunc("debug", 70),
        verbose: _filterFunc("verbose", 80)
    };
}
//#endregion
exports.createLogLevelDiagLogger = createLogLevelDiagLogger;
}),
"[project]/node_modules/@opentelemetry/api/dist/diag/types.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/diag/types.ts
/**
* Defines the available internal logging levels for the diagnostic logger, the numeric values
* of the levels are defined to match the original values from the initial LogLevel to avoid
* compatibility/migration issues for any implementation that assume the numeric ordering.
*
* @since 1.0.0
*/ let DiagLogLevel = /* @__PURE__ */ function(DiagLogLevel) {
    /** Diagnostic Logging level setting to disable all logging (except and forced logs) */ DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
    /** Identifies an error scenario */ DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
    /** Identifies a warning scenario */ DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
    /** General informational log message */ DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
    /** General debug log message */ DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
    /**
	* Detailed trace level logging should only be used for development, should only be set
	* in a development environment.
	*/ DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
    /** Used to set the logging level to include all logging */ DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
    return DiagLogLevel;
}({});
//#endregion
exports.DiagLogLevel = DiagLogLevel;
}),
"[project]/node_modules/@opentelemetry/api/dist/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperties(exports, {
    __esModule: {
        value: true
    },
    [Symbol.toStringTag]: {
        value: "Module"
    }
});
const require_types = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/diag/types.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/baggage/utils.cjs [app-route] (ecmascript)");
const require_context = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/context/context.cjs [app-route] (ecmascript)");
const require_consoleLogger = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/diag/consoleLogger.cjs [app-route] (ecmascript)");
const require_NoopMeter = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/metrics/NoopMeter.cjs [app-route] (ecmascript)");
const require_Metric = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/metrics/Metric.cjs [app-route] (ecmascript)");
const require_NoopLogger = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs/NoopLogger.cjs [app-route] (ecmascript)");
const require_LogRecord = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs/LogRecord.cjs [app-route] (ecmascript)");
const require_TextMapPropagator = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/propagation/TextMapPropagator.cjs [app-route] (ecmascript)");
const require_trace_flags = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/trace_flags.cjs [app-route] (ecmascript)");
const require_invalid_span_constants = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/invalid-span-constants.cjs [app-route] (ecmascript)");
const require_spancontext_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/spancontext-utils.cjs [app-route] (ecmascript)");
const require_ProxyTracer = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/ProxyTracer.cjs [app-route] (ecmascript)");
const require_span_kind = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/span_kind.cjs [app-route] (ecmascript)");
const require_status = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/status.cjs [app-route] (ecmascript)");
const require_utils$1 = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/internal/utils.cjs [app-route] (ecmascript)");
const require_ProxyTracerProvider = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/ProxyTracerProvider.cjs [app-route] (ecmascript)");
const require_SamplingResult = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/SamplingResult.cjs [app-route] (ecmascript)");
const require_context_api = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/context-api.cjs [app-route] (ecmascript)");
const require_diag_api = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/diag-api.cjs [app-route] (ecmascript)");
const require_logs_api = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs-api.cjs [app-route] (ecmascript)");
const require_metrics_api = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/metrics-api.cjs [app-route] (ecmascript)");
const require_propagation_api = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/propagation-api.cjs [app-route] (ecmascript)");
const require_trace_api = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace-api.cjs [app-route] (ecmascript)");
//#region src/index.ts
var src_default = {
    context: require_context_api.context,
    diag: require_diag_api.diag,
    logs: require_logs_api.logs,
    metrics: require_metrics_api.metrics,
    propagation: require_propagation_api.propagation,
    trace: require_trace_api.trace
};
//#endregion
exports.DiagConsoleLogger = require_consoleLogger.DiagConsoleLogger;
exports.DiagLogLevel = require_types.DiagLogLevel;
exports.INVALID_SPANID = require_invalid_span_constants.INVALID_SPANID;
exports.INVALID_SPAN_CONTEXT = require_invalid_span_constants.INVALID_SPAN_CONTEXT;
exports.INVALID_TRACEID = require_invalid_span_constants.INVALID_TRACEID;
exports.ProxyTracer = require_ProxyTracer.ProxyTracer;
exports.ProxyTracerProvider = require_ProxyTracerProvider.ProxyTracerProvider;
exports.ROOT_CONTEXT = require_context.ROOT_CONTEXT;
exports.SamplingDecision = require_SamplingResult.SamplingDecision;
exports.SeverityNumber = require_LogRecord.SeverityNumber;
exports.SpanKind = require_span_kind.SpanKind;
exports.SpanStatusCode = require_status.SpanStatusCode;
exports.TraceFlags = require_trace_flags.TraceFlags;
exports.ValueType = require_Metric.ValueType;
exports.baggageEntryMetadataFromString = require_utils.baggageEntryMetadataFromString;
exports.context = require_context_api.context;
exports.createContextKey = require_context.createContextKey;
exports.createNoopLogger = require_NoopLogger.createNoopLogger;
exports.createNoopMeter = require_NoopMeter.createNoopMeter;
exports.createTraceState = require_utils$1.createTraceState;
exports.default = src_default;
exports.defaultTextMapGetter = require_TextMapPropagator.defaultTextMapGetter;
exports.defaultTextMapSetter = require_TextMapPropagator.defaultTextMapSetter;
exports.diag = require_diag_api.diag;
exports.isSpanContextValid = require_spancontext_utils.isSpanContextValid;
exports.isValidSpanId = require_spancontext_utils.isValidSpanId;
exports.isValidTraceId = require_spancontext_utils.isValidTraceId;
exports.logs = require_logs_api.logs;
exports.metrics = require_metrics_api.metrics;
exports.propagation = require_propagation_api.propagation;
exports.trace = require_trace_api.trace;
}),
"[project]/node_modules/@opentelemetry/api/dist/internal/global-utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_version = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/version.cjs [app-route] (ecmascript)");
const require_semver = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/internal/semver.cjs [app-route] (ecmascript)");
//#region src/internal/global-utils.ts
const major = require_version.VERSION.split(".")[0];
const GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for(`opentelemetry.js.api.${major}`);
const _global = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : ("TURBOPACK compile-time truthy", 1) ? /*TURBOPACK member replacement*/ __turbopack_context__.g : "TURBOPACK unreachable";
function _makeGlobalApi() {
    return Object.defineProperty({}, "version", {
        value: require_version.VERSION,
        enumerable: true,
        writable: false,
        configurable: false
    });
}
function registerGlobal(type, instance, diag, allowOverride = false) {
    var _global$GLOBAL_OPENTE;
    const api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_global$GLOBAL_OPENTE = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _global$GLOBAL_OPENTE !== void 0 ? _global$GLOBAL_OPENTE : _makeGlobalApi();
    if (!allowOverride && api[type]) {
        const err = /* @__PURE__ */ new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
        diag.error(err.stack || err.message);
        return false;
    }
    if (api.version !== "1.10.0") {
        const err = /* @__PURE__ */ new Error(`@opentelemetry/api: Registration of version v${api.version} for ${type} does not match previously registered API v${require_version.VERSION}`);
        diag.error(err.stack || err.message);
        return false;
    }
    api[type] = instance;
    diag.debug(`@opentelemetry/api: Registered a global for ${type} v${require_version.VERSION}.`);
    return true;
}
let _compatibleGlobalApi;
function getGlobal(type) {
    const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api == null) return;
    if (api !== _compatibleGlobalApi) {
        if (!api.version || !require_semver.isCompatible(api.version)) return;
        _compatibleGlobalApi = api;
    }
    return api[type];
}
function unregisterGlobal(type, diag) {
    diag.debug(`@opentelemetry/api: Unregistering a global for ${type} v${require_version.VERSION}.`);
    const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) delete api[type];
}
//#endregion
exports.getGlobal = getGlobal;
exports.registerGlobal = registerGlobal;
exports.unregisterGlobal = unregisterGlobal;
}),
"[project]/node_modules/@opentelemetry/api/dist/internal/semver.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_version = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/version.cjs [app-route] (ecmascript)");
//#region src/internal/semver.ts
const re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
/**
* Create a function to test an API version to see if it is compatible with the provided ownVersion.
*
* The returned function has the following semantics:
* - Exact match is always compatible
* - Major versions must match exactly
*    - 1.x package cannot use global 2.x package
*    - 2.x package cannot use global 1.x package
* - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
*    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
*    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
* - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
* - Patch and build tag differences are not considered at this time
*
* @param ownVersion version which should be checked against
*/ function _makeCompatibilityCheck(ownVersion) {
    const acceptedVersions = /* @__PURE__ */ new Set([
        ownVersion
    ]);
    const rejectedVersions = /* @__PURE__ */ new Set();
    const myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) return ()=>false;
    const ownVersionParsed = {
        major: +myVersionMatch[1],
        minor: +myVersionMatch[2],
        patch: +myVersionMatch[3],
        prerelease: myVersionMatch[4]
    };
    if (ownVersionParsed.prerelease != null) return function isExactmatch(globalVersion) {
        return globalVersion === ownVersion;
    };
    function _reject(v) {
        rejectedVersions.add(v);
        return false;
    }
    function _accept(v) {
        acceptedVersions.add(v);
        return true;
    }
    return function isCompatible(globalVersion) {
        if (acceptedVersions.has(globalVersion)) return true;
        if (rejectedVersions.has(globalVersion)) return false;
        const globalVersionMatch = globalVersion.match(re);
        if (!globalVersionMatch) return _reject(globalVersion);
        const globalVersionParsed = {
            major: +globalVersionMatch[1],
            minor: +globalVersionMatch[2],
            patch: +globalVersionMatch[3],
            prerelease: globalVersionMatch[4]
        };
        if (globalVersionParsed.prerelease != null) return _reject(globalVersion);
        if (ownVersionParsed.major !== globalVersionParsed.major) return _reject(globalVersion);
        if (ownVersionParsed.major === 0) {
            if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) return _accept(globalVersion);
            return _reject(globalVersion);
        }
        if (ownVersionParsed.minor <= globalVersionParsed.minor) return _accept(globalVersion);
        return _reject(globalVersion);
    };
}
/**
* Test an API version to see if it is compatible with this API.
*
* - Exact match is always compatible
* - Major versions must match exactly
*    - 1.x package cannot use global 2.x package
*    - 2.x package cannot use global 1.x package
* - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
*    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
*    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
* - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
* - Patch and build tag differences are not considered at this time
*
* @param version version of the API requesting an instance of the global API
*/ const isCompatible = _makeCompatibilityCheck(require_version.VERSION);
//#endregion
exports._makeCompatibilityCheck = _makeCompatibilityCheck;
exports.isCompatible = isCompatible;
}),
"[project]/node_modules/@opentelemetry/api/dist/logs-api.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/logs-api.ts
/**
* Entrypoint for logs API
*
* @since 1.10.0
*/ const logs = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/logs.cjs [app-route] (ecmascript)").LogsAPI.getInstance();
//#endregion
exports.logs = logs;
}),
"[project]/node_modules/@opentelemetry/api/dist/logs/LogRecord.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/logs/LogRecord.ts
let SeverityNumber = /* @__PURE__ */ function(SeverityNumber) {
    SeverityNumber[SeverityNumber["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    SeverityNumber[SeverityNumber["TRACE"] = 1] = "TRACE";
    SeverityNumber[SeverityNumber["TRACE2"] = 2] = "TRACE2";
    SeverityNumber[SeverityNumber["TRACE3"] = 3] = "TRACE3";
    SeverityNumber[SeverityNumber["TRACE4"] = 4] = "TRACE4";
    SeverityNumber[SeverityNumber["DEBUG"] = 5] = "DEBUG";
    SeverityNumber[SeverityNumber["DEBUG2"] = 6] = "DEBUG2";
    SeverityNumber[SeverityNumber["DEBUG3"] = 7] = "DEBUG3";
    SeverityNumber[SeverityNumber["DEBUG4"] = 8] = "DEBUG4";
    SeverityNumber[SeverityNumber["INFO"] = 9] = "INFO";
    SeverityNumber[SeverityNumber["INFO2"] = 10] = "INFO2";
    SeverityNumber[SeverityNumber["INFO3"] = 11] = "INFO3";
    SeverityNumber[SeverityNumber["INFO4"] = 12] = "INFO4";
    SeverityNumber[SeverityNumber["WARN"] = 13] = "WARN";
    SeverityNumber[SeverityNumber["WARN2"] = 14] = "WARN2";
    SeverityNumber[SeverityNumber["WARN3"] = 15] = "WARN3";
    SeverityNumber[SeverityNumber["WARN4"] = 16] = "WARN4";
    SeverityNumber[SeverityNumber["ERROR"] = 17] = "ERROR";
    SeverityNumber[SeverityNumber["ERROR2"] = 18] = "ERROR2";
    SeverityNumber[SeverityNumber["ERROR3"] = 19] = "ERROR3";
    SeverityNumber[SeverityNumber["ERROR4"] = 20] = "ERROR4";
    SeverityNumber[SeverityNumber["FATAL"] = 21] = "FATAL";
    SeverityNumber[SeverityNumber["FATAL2"] = 22] = "FATAL2";
    SeverityNumber[SeverityNumber["FATAL3"] = 23] = "FATAL3";
    SeverityNumber[SeverityNumber["FATAL4"] = 24] = "FATAL4";
    return SeverityNumber;
}({});
//#endregion
exports.SeverityNumber = SeverityNumber;
}),
"[project]/node_modules/@opentelemetry/api/dist/logs/NoopLogger.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/logs/NoopLogger.ts
var NoopLogger = class {
    emit(_logRecord) {}
    enabled() {
        return false;
    }
};
const NOOP_LOGGER = new NoopLogger();
/**
* Create a no-op Logger
*/ function createNoopLogger() {
    return NOOP_LOGGER;
}
//#endregion
exports.NOOP_LOGGER = NOOP_LOGGER;
exports.NoopLogger = NoopLogger;
exports.createNoopLogger = createNoopLogger;
}),
"[project]/node_modules/@opentelemetry/api/dist/logs/NoopLoggerProvider.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_NoopLogger = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs/NoopLogger.cjs [app-route] (ecmascript)");
//#region src/logs/NoopLoggerProvider.ts
var NoopLoggerProvider = class {
    getLogger(_name, _version, _options) {
        return new require_NoopLogger.NoopLogger();
    }
};
const NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
//#endregion
exports.NOOP_LOGGER_PROVIDER = NOOP_LOGGER_PROVIDER;
exports.NoopLoggerProvider = NoopLoggerProvider;
}),
"[project]/node_modules/@opentelemetry/api/dist/logs/ProxyLogger.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_NoopLogger = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs/NoopLogger.cjs [app-route] (ecmascript)");
//#region src/logs/ProxyLogger.ts
var ProxyLogger = class {
    constructor(provider, name, version, options){
        this._provider = provider;
        this.name = name;
        this.version = version;
        this.options = options;
    }
    /**
	* Emit a log record. This method should only be used by log appenders.
	*
	* @param logRecord
	*/ emit(logRecord) {
        this._getLogger().emit(logRecord);
    }
    enabled(options) {
        return this._getLogger().enabled(options);
    }
    /**
	* Try to get a logger from the proxy logger provider.
	* If the proxy logger provider has no delegate, return a noop logger.
	*/ _getLogger() {
        if (this._delegate) return this._delegate;
        const logger = this._provider._getDelegateLogger(this.name, this.version, this.options);
        if (!logger) return require_NoopLogger.NOOP_LOGGER;
        this._delegate = logger;
        return this._delegate;
    }
};
//#endregion
exports.ProxyLogger = ProxyLogger;
}),
"[project]/node_modules/@opentelemetry/api/dist/logs/ProxyLoggerProvider.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_NoopLoggerProvider = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs/NoopLoggerProvider.cjs [app-route] (ecmascript)");
const require_ProxyLogger = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/logs/ProxyLogger.cjs [app-route] (ecmascript)");
//#region src/logs/ProxyLoggerProvider.ts
var ProxyLoggerProvider = class {
    getLogger(name, version, options) {
        var _this$_getDelegateLog;
        return (_this$_getDelegateLog = this._getDelegateLogger(name, version, options)) !== null && _this$_getDelegateLog !== void 0 ? _this$_getDelegateLog : new require_ProxyLogger.ProxyLogger(this, name, version, options);
    }
    /**
	* Get the delegate logger provider.
	* Used by tests only.
	* @internal
	*/ _getDelegate() {
        var _this$_delegate;
        return (_this$_delegate = this._delegate) !== null && _this$_delegate !== void 0 ? _this$_delegate : require_NoopLoggerProvider.NOOP_LOGGER_PROVIDER;
    }
    /**
	* Set the delegate logger provider
	* @internal
	*/ _setDelegate(delegate) {
        this._delegate = delegate;
    }
    /**
	* @internal
	*/ _getDelegateLogger(name, version, options) {
        var _this$_delegate2;
        return (_this$_delegate2 = this._delegate) === null || _this$_delegate2 === void 0 ? void 0 : _this$_delegate2.getLogger(name, version, options);
    }
};
//#endregion
exports.ProxyLoggerProvider = ProxyLoggerProvider;
}),
"[project]/node_modules/@opentelemetry/api/dist/metrics-api.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/metrics-api.ts
/**
* Entrypoint for metrics API
*
* @since 1.3.0
*/ const metrics = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/metrics.cjs [app-route] (ecmascript)").MetricsAPI.getInstance();
//#endregion
exports.metrics = metrics;
}),
"[project]/node_modules/@opentelemetry/api/dist/metrics/Metric.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/metrics/Metric.ts
/**
* The Type of value. It describes how the data is reported.
*
* @since 1.3.0
*/ let ValueType = /* @__PURE__ */ function(ValueType) {
    ValueType[ValueType["INT"] = 0] = "INT";
    ValueType[ValueType["DOUBLE"] = 1] = "DOUBLE";
    return ValueType;
}({});
//#endregion
exports.ValueType = ValueType;
}),
"[project]/node_modules/@opentelemetry/api/dist/metrics/NoopMeter.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/metrics/NoopMeter.ts
/**
* NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
* constant NoopMetrics for all of its methods.
*/ var NoopMeter = class {
    constructor(){}
    /**
	* @see {@link Meter.createGauge}
	*/ createGauge(_name, _options) {
        return NOOP_GAUGE_METRIC;
    }
    /**
	* @see {@link Meter.createHistogram}
	*/ createHistogram(_name, _options) {
        return NOOP_HISTOGRAM_METRIC;
    }
    /**
	* @see {@link Meter.createCounter}
	*/ createCounter(_name, _options) {
        return NOOP_COUNTER_METRIC;
    }
    /**
	* @see {@link Meter.createUpDownCounter}
	*/ createUpDownCounter(_name, _options) {
        return NOOP_UP_DOWN_COUNTER_METRIC;
    }
    /**
	* @see {@link Meter.createObservableGauge}
	*/ createObservableGauge(_name, _options) {
        return NOOP_OBSERVABLE_GAUGE_METRIC;
    }
    /**
	* @see {@link Meter.createObservableCounter}
	*/ createObservableCounter(_name, _options) {
        return NOOP_OBSERVABLE_COUNTER_METRIC;
    }
    /**
	* @see {@link Meter.createObservableUpDownCounter}
	*/ createObservableUpDownCounter(_name, _options) {
        return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
    }
    /**
	* @see {@link Meter.addBatchObservableCallback}
	*/ addBatchObservableCallback(_callback, _observables) {}
    /**
	* @see {@link Meter.removeBatchObservableCallback}
	*/ removeBatchObservableCallback(_callback) {}
};
var NoopMetric = class {
};
var NoopCounterMetric = class extends NoopMetric {
    add(_value, _attributes) {}
};
var NoopUpDownCounterMetric = class extends NoopMetric {
    add(_value, _attributes) {}
};
var NoopGaugeMetric = class extends NoopMetric {
    record(_value, _attributes) {}
};
var NoopHistogramMetric = class extends NoopMetric {
    record(_value, _attributes) {}
};
var NoopObservableMetric = class {
    addCallback(_callback) {}
    removeCallback(_callback) {}
};
var NoopObservableCounterMetric = class extends NoopObservableMetric {
};
var NoopObservableGaugeMetric = class extends NoopObservableMetric {
};
var NoopObservableUpDownCounterMetric = class extends NoopObservableMetric {
};
const NOOP_METER = new NoopMeter();
const NOOP_COUNTER_METRIC = new NoopCounterMetric();
const NOOP_GAUGE_METRIC = new NoopGaugeMetric();
const NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
const NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
const NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
const NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
const NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
/**
* Create a no-op Meter
*
* @since 1.3.0
*/ function createNoopMeter() {
    return NOOP_METER;
}
//#endregion
exports.NOOP_COUNTER_METRIC = NOOP_COUNTER_METRIC;
exports.NOOP_GAUGE_METRIC = NOOP_GAUGE_METRIC;
exports.NOOP_HISTOGRAM_METRIC = NOOP_HISTOGRAM_METRIC;
exports.NOOP_METER = NOOP_METER;
exports.NOOP_OBSERVABLE_COUNTER_METRIC = NOOP_OBSERVABLE_COUNTER_METRIC;
exports.NOOP_OBSERVABLE_GAUGE_METRIC = NOOP_OBSERVABLE_GAUGE_METRIC;
exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
exports.NOOP_UP_DOWN_COUNTER_METRIC = NOOP_UP_DOWN_COUNTER_METRIC;
exports.NoopCounterMetric = NoopCounterMetric;
exports.NoopGaugeMetric = NoopGaugeMetric;
exports.NoopHistogramMetric = NoopHistogramMetric;
exports.NoopMeter = NoopMeter;
exports.NoopMetric = NoopMetric;
exports.NoopObservableCounterMetric = NoopObservableCounterMetric;
exports.NoopObservableGaugeMetric = NoopObservableGaugeMetric;
exports.NoopObservableMetric = NoopObservableMetric;
exports.NoopObservableUpDownCounterMetric = NoopObservableUpDownCounterMetric;
exports.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
exports.createNoopMeter = createNoopMeter;
}),
"[project]/node_modules/@opentelemetry/api/dist/metrics/NoopMeterProvider.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_NoopMeter = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/metrics/NoopMeter.cjs [app-route] (ecmascript)");
//#region src/metrics/NoopMeterProvider.ts
/**
* An implementation of the {@link MeterProvider} which returns an impotent Meter
* for all calls to `getMeter`
*/ var NoopMeterProvider = class {
    getMeter(_name, _version, _options) {
        return require_NoopMeter.NOOP_METER;
    }
};
const NOOP_METER_PROVIDER = new NoopMeterProvider();
//#endregion
exports.NOOP_METER_PROVIDER = NOOP_METER_PROVIDER;
exports.NoopMeterProvider = NoopMeterProvider;
}),
"[project]/node_modules/@opentelemetry/api/dist/propagation-api.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/propagation-api.ts
/**
* Entrypoint for propagation API
*
* @since 1.0.0
*/ const propagation = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/propagation.cjs [app-route] (ecmascript)").PropagationAPI.getInstance();
//#endregion
exports.propagation = propagation;
}),
"[project]/node_modules/@opentelemetry/api/dist/propagation/NoopTextMapPropagator.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/propagation/NoopTextMapPropagator.ts
/**
* No-op implementations of {@link TextMapPropagator}.
*/ var NoopTextMapPropagator = class {
    /** Noop inject function does nothing */ inject(_context, _carrier) {}
    /** Noop extract function does nothing and returns the input context */ extract(context, _carrier) {
        return context;
    }
    fields() {
        return [];
    }
};
//#endregion
exports.NoopTextMapPropagator = NoopTextMapPropagator;
}),
"[project]/node_modules/@opentelemetry/api/dist/propagation/TextMapPropagator.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/propagation/TextMapPropagator.ts
/**
* @since 1.0.0
*/ const defaultTextMapGetter = {
    get (carrier, key) {
        if (carrier == null) return;
        return carrier[key];
    },
    keys (carrier) {
        if (carrier == null) return [];
        return Object.keys(carrier);
    }
};
/**
* @since 1.0.0
*/ const defaultTextMapSetter = {
    set (carrier, key, value) {
        if (carrier == null) return;
        carrier[key] = value;
    }
};
//#endregion
exports.defaultTextMapGetter = defaultTextMapGetter;
exports.defaultTextMapSetter = defaultTextMapSetter;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace-api.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/trace-api.ts
/**
* Entrypoint for trace API
*
* @since 1.0.0
*/ const trace = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/trace.cjs [app-route] (ecmascript)").TraceAPI.getInstance();
//#endregion
exports.trace = trace;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/NonRecordingSpan.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_invalid_span_constants = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/invalid-span-constants.cjs [app-route] (ecmascript)");
//#region src/trace/NonRecordingSpan.ts
/**
* The NonRecordingSpan is the default {@link Span} that is used when no Span
* implementation is available. All operations are no-op including context
* propagation.
*/ var NonRecordingSpan = class {
    constructor(spanContext = require_invalid_span_constants.INVALID_SPAN_CONTEXT){
        this._spanContext = spanContext;
    }
    spanContext() {
        return this._spanContext;
    }
    setAttribute(_key, _value) {
        return this;
    }
    setAttributes(_attributes) {
        return this;
    }
    addEvent(_name, _attributes) {
        return this;
    }
    addLink(_link) {
        return this;
    }
    addLinks(_links) {
        return this;
    }
    setStatus(_status) {
        return this;
    }
    updateName(_name) {
        return this;
    }
    end(_endTime) {}
    isRecording() {
        return false;
    }
    recordException(_exception, _time) {}
};
//#endregion
exports.NonRecordingSpan = NonRecordingSpan;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/NoopTracer.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_context = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/context.cjs [app-route] (ecmascript)");
const require_NonRecordingSpan = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/NonRecordingSpan.cjs [app-route] (ecmascript)");
const require_context_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/context-utils.cjs [app-route] (ecmascript)");
const require_spancontext_utils = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/spancontext-utils.cjs [app-route] (ecmascript)");
//#region src/trace/NoopTracer.ts
const contextApi = require_context.ContextAPI.getInstance();
/**
* No-op implementations of {@link Tracer}.
*/ var NoopTracer = class {
    startSpan(name, options, context = contextApi.active()) {
        if (Boolean(options === null || options === void 0 ? void 0 : options.root)) return new require_NonRecordingSpan.NonRecordingSpan();
        const parentFromContext = context && require_context_utils.getSpanContext(context);
        if (isSpanContext(parentFromContext) && require_spancontext_utils.isSpanContextValid(parentFromContext)) return new require_NonRecordingSpan.NonRecordingSpan(parentFromContext);
        else return new require_NonRecordingSpan.NonRecordingSpan();
    }
    startActiveSpan(name, arg2, arg3, arg4) {
        var _ctx;
        let opts;
        let ctx;
        let fn;
        if (arguments.length < 2) return;
        else if (arguments.length === 2) fn = arg2;
        else if (arguments.length === 3) {
            opts = arg2;
            fn = arg3;
        } else {
            opts = arg2;
            ctx = arg3;
            fn = arg4;
        }
        const parentContext = (_ctx = ctx) !== null && _ctx !== void 0 ? _ctx : contextApi.active();
        const span = this.startSpan(name, opts, parentContext);
        const contextWithSpanSet = require_context_utils.setSpan(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, void 0, span);
    }
};
function isSpanContext(spanContext) {
    return spanContext !== null && typeof spanContext === "object" && "spanId" in spanContext && typeof spanContext["spanId"] === "string" && "traceId" in spanContext && typeof spanContext["traceId"] === "string" && "traceFlags" in spanContext && typeof spanContext["traceFlags"] === "number";
}
//#endregion
exports.NoopTracer = NoopTracer;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/NoopTracerProvider.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_NoopTracer = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/NoopTracer.cjs [app-route] (ecmascript)");
//#region src/trace/NoopTracerProvider.ts
/**
* An implementation of the {@link TracerProvider} which returns an impotent
* Tracer for all calls to `getTracer`.
*
* All operations are no-op.
*/ var NoopTracerProvider = class {
    getTracer(_name, _version, _options) {
        return new require_NoopTracer.NoopTracer();
    }
};
//#endregion
exports.NoopTracerProvider = NoopTracerProvider;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/ProxyTracer.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/trace/ProxyTracer.ts
const NOOP_TRACER = new (__turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/NoopTracer.cjs [app-route] (ecmascript)")).NoopTracer();
/**
* Proxy tracer provided by the proxy tracer provider
*
* @since 1.0.0
*/ var ProxyTracer = class {
    constructor(provider, name, version, options){
        this._provider = provider;
        this.name = name;
        this.version = version;
        this.options = options;
    }
    startSpan(name, options, context) {
        return this._getTracer().startSpan(name, options, context);
    }
    startActiveSpan(_name, _options, _context, _fn) {
        const tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
    }
    /**
	* Try to get a tracer from the proxy tracer provider.
	* If the proxy tracer provider has no delegate, return a noop tracer.
	*/ _getTracer() {
        if (this._delegate) return this._delegate;
        const tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) return NOOP_TRACER;
        this._delegate = tracer;
        return this._delegate;
    }
};
//#endregion
exports.ProxyTracer = ProxyTracer;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/ProxyTracerProvider.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_ProxyTracer = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/ProxyTracer.cjs [app-route] (ecmascript)");
//#region src/trace/ProxyTracerProvider.ts
const NOOP_TRACER_PROVIDER = new (__turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/NoopTracerProvider.cjs [app-route] (ecmascript)")).NoopTracerProvider();
/**
* Tracer provider which provides {@link ProxyTracer}s.
*
* Before a delegate is set, tracers provided are NoOp.
*   When a delegate is set, traces are provided from the delegate.
*   When a delegate is set after tracers have already been provided,
*   all tracers already provided will use the provided delegate implementation.
*
* @deprecated This will be removed in the next major version.
* @since 1.0.0
*/ var ProxyTracerProvider = class {
    /**
	* Get a {@link ProxyTracer}
	*/ getTracer(name, version, options) {
        var _this$getDelegateTrac;
        return (_this$getDelegateTrac = this.getDelegateTracer(name, version, options)) !== null && _this$getDelegateTrac !== void 0 ? _this$getDelegateTrac : new require_ProxyTracer.ProxyTracer(this, name, version, options);
    }
    getDelegate() {
        var _this$_delegate;
        return (_this$_delegate = this._delegate) !== null && _this$_delegate !== void 0 ? _this$_delegate : NOOP_TRACER_PROVIDER;
    }
    /**
	* Set the delegate tracer provider
	*/ setDelegate(delegate) {
        this._delegate = delegate;
    }
    getDelegateTracer(name, version, options) {
        var _this$_delegate2;
        return (_this$_delegate2 = this._delegate) === null || _this$_delegate2 === void 0 ? void 0 : _this$_delegate2.getTracer(name, version, options);
    }
};
//#endregion
exports.ProxyTracerProvider = ProxyTracerProvider;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/SamplingResult.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/trace/SamplingResult.ts
/**
* @deprecated use the one declared in @opentelemetry/sdk-trace instead.
* A sampling decision that determines how a {@link Span} will be recorded
* and collected.
*
* @since 1.0.0
*/ let SamplingDecision = /* @__PURE__ */ function(SamplingDecision) {
    /**
	* `Span.isRecording() === false`, span will not be recorded and all events
	* and attributes will be dropped.
	*/ SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
    /**
	* `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
	* MUST NOT be set.
	*/ SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
    /**
	* `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
	* MUST be set.
	*/ SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
    return SamplingDecision;
}({});
//#endregion
exports.SamplingDecision = SamplingDecision;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/context-utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_context = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/context/context.cjs [app-route] (ecmascript)");
const require_context$1 = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/api/context.cjs [app-route] (ecmascript)");
const require_NonRecordingSpan = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/NonRecordingSpan.cjs [app-route] (ecmascript)");
//#region src/trace/context-utils.ts
/**
* span key
*/ const SPAN_KEY = require_context.createContextKey("OpenTelemetry Context Key SPAN");
/**
* Return the span if one exists
*
* @param context context to get span from
*/ function getSpan(context) {
    return context.getValue(SPAN_KEY) || void 0;
}
/**
* Gets the span from the current context, if one exists.
*/ function getActiveSpan() {
    return getSpan(require_context$1.ContextAPI.getInstance().active());
}
/**
* Set the span on a context
*
* @param context context to use as parent
* @param span span to set active
*/ function setSpan(context, span) {
    return context.setValue(SPAN_KEY, span);
}
/**
* Remove current span stored in the context
*
* @param context context to delete span from
*/ function deleteSpan(context) {
    return context.deleteValue(SPAN_KEY);
}
/**
* Wrap span context in a NoopSpan and set as span in a new
* context
*
* @param context context to set active span on
* @param spanContext span context to be wrapped
*/ function setSpanContext(context, spanContext) {
    return setSpan(context, new require_NonRecordingSpan.NonRecordingSpan(spanContext));
}
/**
* Get the span context of the span if it exists.
*
* @param context context to get values from
*/ function getSpanContext(context) {
    var _getSpan;
    return (_getSpan = getSpan(context)) === null || _getSpan === void 0 ? void 0 : _getSpan.spanContext();
}
//#endregion
exports.deleteSpan = deleteSpan;
exports.getActiveSpan = getActiveSpan;
exports.getSpan = getSpan;
exports.getSpanContext = getSpanContext;
exports.setSpan = setSpan;
exports.setSpanContext = setSpanContext;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/internal/tracestate-impl.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_tracestate_validators = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/internal/tracestate-validators.cjs [app-route] (ecmascript)");
//#region src/trace/internal/tracestate-impl.ts
const MAX_TRACE_STATE_ITEMS = 32;
const MAX_TRACE_STATE_LEN = 512;
const LIST_MEMBERS_SEPARATOR = ",";
const LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
/**
* TraceState must be a class and not a simple object type because of the spec
* requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
*
* Here is the list of allowed mutations:
* - New key-value pair should be added into the beginning of the list
* - The value of any key can be updated. Modified keys MUST be moved to the
* beginning of the list.
*
* @deprecated Use TraceState from "@opentelemetry/core". This will be removed in the next major version.
*/ var TraceStateImpl = class TraceStateImpl {
    constructor(rawTraceState){
        this._internalState = /* @__PURE__ */ new Map();
        if (rawTraceState) this._parse(rawTraceState);
    }
    set(key, value) {
        const currValue = this._internalState.get(key);
        let newLength = this.serialize().length;
        if (typeof currValue === "string") newLength += value.length - currValue.length;
        else {
            if (this._internalState.size >= MAX_TRACE_STATE_ITEMS) return this;
            newLength += key.length + value.length + (this._internalState.size > 0 ? 2 : 1);
        }
        if (newLength > MAX_TRACE_STATE_LEN) return this;
        const traceState = this._clone();
        if (traceState._internalState.has(key)) traceState._internalState.delete(key);
        traceState._internalState.set(key, value);
        return traceState;
    }
    unset(key) {
        const traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
    }
    get(key) {
        return this._internalState.get(key);
    }
    serialize() {
        return Array.from(this._internalState.keys()).reduceRight((agg, key)=>{
            agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
            return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR);
    }
    _parse(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reduceRight((agg, part)=>{
            const listMember = part.trim();
            const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
            if (i !== -1) {
                const key = listMember.slice(0, i);
                const value = listMember.slice(i + 1, part.length);
                if (require_tracestate_validators.validateKey(key) && require_tracestate_validators.validateValue(value)) agg.set(key, value);
            }
            return agg;
        }, /* @__PURE__ */ new Map());
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
    }
    _keys() {
        return Array.from(this._internalState.keys()).reverse();
    }
    _clone() {
        const traceState = new TraceStateImpl();
        traceState._internalState = new Map(this._internalState);
        return traceState;
    }
};
//#endregion
exports.TraceStateImpl = TraceStateImpl;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/internal/tracestate-validators.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/trace/internal/tracestate-validators.ts
const VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
const VALID_KEY_REGEX = new RegExp(`^(?:${`[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`}|${`[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`})$`);
const VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
const INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
/**
* Key is opaque string up to 256 characters printable. It MUST begin with a
* lowercase letter, and can only contain lowercase letters a-z, digits 0-9,
* underscores _, dashes -, asterisks *, and forward slashes /.
* For multi-tenant vendor scenarios, an at sign (@) can be used to prefix the
* vendor name. Vendors SHOULD set the tenant ID at the beginning of the key.
* see https://www.w3.org/TR/trace-context/#key
*/ function validateKey(key) {
    return VALID_KEY_REGEX.test(key);
}
/**
* Value is opaque string up to 256 characters printable ASCII RFC0020
* characters (i.e., the range 0x20 to 0x7E) except comma , and =.
*/ function validateValue(value) {
    return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}
//#endregion
exports.validateKey = validateKey;
exports.validateValue = validateValue;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/internal/utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_tracestate_impl = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/internal/tracestate-impl.cjs [app-route] (ecmascript)");
//#region src/trace/internal/utils.ts
/**
* @deprecated Use TraceState from "@opentelemetry/core". This will be removed in the next major version.
* @since 1.1.0
*/ function createTraceState(rawTraceState) {
    return new require_tracestate_impl.TraceStateImpl(rawTraceState);
}
//#endregion
exports.createTraceState = createTraceState;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/invalid-span-constants.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/trace_flags.cjs [app-route] (ecmascript)");
//#region src/trace/invalid-span-constants.ts
/**
* @since 1.0.0
*/ const INVALID_SPANID = "0000000000000000";
/**
* @since 1.0.0
*/ const INVALID_TRACEID = "00000000000000000000000000000000";
/**
* @since 1.0.0
*/ const INVALID_SPAN_CONTEXT = {
    traceId: INVALID_TRACEID,
    spanId: INVALID_SPANID,
    traceFlags: 0
};
//#endregion
exports.INVALID_SPANID = INVALID_SPANID;
exports.INVALID_SPAN_CONTEXT = INVALID_SPAN_CONTEXT;
exports.INVALID_TRACEID = INVALID_TRACEID;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/span_kind.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/trace/span_kind.ts
/**
* @since 1.0.0
*/ let SpanKind = /* @__PURE__ */ function(SpanKind) {
    /** Default value. Indicates that the span is used internally. */ SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
    /**
	* Indicates that the span covers server-side handling of an RPC or other
	* remote request.
	*/ SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
    /**
	* Indicates that the span covers the client-side wrapper around an RPC or
	* other remote request.
	*/ SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
    /**
	* Indicates that the span describes producer sending a message to a
	* broker. Unlike client and server, there is no direct critical path latency
	* relationship between producer and consumer spans.
	*/ SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
    /**
	* Indicates that the span describes consumer receiving a message from a
	* broker. Unlike client and server, there is no direct critical path latency
	* relationship between producer and consumer spans.
	*/ SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
    return SpanKind;
}({});
//#endregion
exports.SpanKind = SpanKind;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/spancontext-utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/invalid-span-constants.cjs [app-route] (ecmascript)");
const require_NonRecordingSpan = __turbopack_context__.r("[project]/node_modules/@opentelemetry/api/dist/trace/NonRecordingSpan.cjs [app-route] (ecmascript)");
//#region src/trace/spancontext-utils.ts
const isHex = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1
]);
function isValidHex(id, length) {
    if (typeof id !== "string" || id.length !== length) return false;
    let r = 0;
    for(let i = 0; i < id.length; i += 4)r += (isHex[id.charCodeAt(i)] | 0) + (isHex[id.charCodeAt(i + 1)] | 0) + (isHex[id.charCodeAt(i + 2)] | 0) + (isHex[id.charCodeAt(i + 3)] | 0);
    return r === length;
}
/**
* @since 1.0.0
*/ function isValidTraceId(traceId) {
    return isValidHex(traceId, 32) && traceId !== "00000000000000000000000000000000";
}
/**
* @since 1.0.0
*/ function isValidSpanId(spanId) {
    return isValidHex(spanId, 16) && spanId !== "0000000000000000";
}
/**
* Returns true if this {@link SpanContext} is valid.
* @return true if this {@link SpanContext} is valid.
*
* @since 1.0.0
*/ function isSpanContextValid(spanContext) {
    return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
/**
* Wrap the given {@link SpanContext} in a new non-recording {@link Span}
*
* @param spanContext span context to be wrapped
* @returns a new non-recording {@link Span} with the provided context
*/ function wrapSpanContext(spanContext) {
    return new require_NonRecordingSpan.NonRecordingSpan(spanContext);
}
//#endregion
exports.isSpanContextValid = isSpanContextValid;
exports.isValidSpanId = isValidSpanId;
exports.isValidTraceId = isValidTraceId;
exports.wrapSpanContext = wrapSpanContext;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/status.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/trace/status.ts
/**
* An enumeration of status codes.
*
* @since 1.0.0
*/ let SpanStatusCode = /* @__PURE__ */ function(SpanStatusCode) {
    /**
	* The default status.
	*/ SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
    /**
	* The operation has been validated by an Application developer or
	* Operator to have completed successfully.
	*/ SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
    /**
	* The operation contains an error.
	*/ SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
    return SpanStatusCode;
}({});
//#endregion
exports.SpanStatusCode = SpanStatusCode;
}),
"[project]/node_modules/@opentelemetry/api/dist/trace/trace_flags.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/trace/trace_flags.ts
/**
* @since 1.0.0
*/ let TraceFlags = /* @__PURE__ */ function(TraceFlags) {
    /** Represents no flag set. */ TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
    /** Bit to represent whether trace is sampled in trace flags. */ TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
    return TraceFlags;
}({});
//#endregion
exports.TraceFlags = TraceFlags;
}),
"[project]/node_modules/@opentelemetry/api/dist/version.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/version.ts
const VERSION = "1.10.0";
//#endregion
exports.VERSION = VERSION;
}),
"[project]/node_modules/base64-js/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for(var i = 0, len = code.length; i < len; ++i){
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    }
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength){
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
    }
    return parts.join('');
}
}),
"[project]/node_modules/bignumber.js/bignumber.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

;
(function(globalObject) {
    'use strict';
    /*
 *      bignumber.js v9.3.1
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */ var BigNumber, isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = '[BigNumber Error] ', tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ', BASE = 1e14, LOG_BASE = 14, MAX_SAFE_INTEGER = 0x1fffffffffffff, // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [
        1,
        10,
        100,
        1e3,
        1e4,
        1e5,
        1e6,
        1e7,
        1e8,
        1e9,
        1e10,
        1e11,
        1e12,
        1e13
    ], SQRT_BASE = 1e7, // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9; // 0 to MAX_INT32
    /*
   * Create and return a BigNumber constructor.
   */ function clone(configObject) {
        var div, convertBase, parseNumeric, P = BigNumber.prototype = {
            constructor: BigNumber,
            toString: null,
            valueOf: null
        }, ONE = new BigNumber(1), //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------
        // The default values below must be integers within the inclusive ranges stated.
        // The values can also be changed at run-time using BigNumber.set.
        // The maximum number of decimal places for operations involving division.
        DECIMAL_PLACES = 20, // The rounding mode used when rounding to the above decimal places, and when using
        // toExponential, toFixed, toFormat and toPrecision, and round (default value).
        // UP         0 Away from zero.
        // DOWN       1 Towards zero.
        // CEIL       2 Towards +Infinity.
        // FLOOR      3 Towards -Infinity.
        // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
        // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
        // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
        // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
        // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
        ROUNDING_MODE = 4, // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]
        // The exponent value at and beneath which toString returns exponential notation.
        // Number type: -7
        TO_EXP_NEG = -7, // The exponent value at and above which toString returns exponential notation.
        // Number type: 21
        TO_EXP_POS = 21, // RANGE : [MIN_EXP, MAX_EXP]
        // The minimum exponent value, beneath which underflow to zero occurs.
        // Number type: -324  (5e-324)
        MIN_EXP = -1e7, // The maximum exponent value, above which overflow to Infinity occurs.
        // Number type:  308  (1.7976931348623157e+308)
        // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
        MAX_EXP = 1e7, // Whether to use cryptographically-secure random number generation, if available.
        CRYPTO = false, // The modulo mode used when calculating the modulus: a mod n.
        // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
        // The remainder (r) is calculated as: r = a - n * q.
        //
        // UP        0 The remainder is positive if the dividend is negative, else is negative.
        // DOWN      1 The remainder has the same sign as the dividend.
        //             This modulo mode is commonly known as 'truncated division' and is
        //             equivalent to (a % n) in JavaScript.
        // FLOOR     3 The remainder has the same sign as the divisor (Python %).
        // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
        // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
        //             The remainder is always positive.
        //
        // The truncated division, floored division, Euclidian division and IEEE 754 remainder
        // modes are commonly used for the modulus operation.
        // Although the other rounding modes can also be used, they may not give useful results.
        MODULO_MODE = 1, // The maximum number of significant digits of the result of the exponentiatedBy operation.
        // If POW_PRECISION is 0, there will be unlimited significant digits.
        POW_PRECISION = 0, // The format specification used by the BigNumber.prototype.toFormat method.
        FORMAT = {
            prefix: '',
            groupSize: 3,
            secondaryGroupSize: 0,
            groupSeparator: ',',
            decimalSeparator: '.',
            fractionGroupSize: 0,
            fractionGroupSeparator: '\xA0',
            suffix: ''
        }, // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
        // '-', '.', whitespace, or repeated character.
        // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz', alphabetHasNormalDecimalDigits = true;
        //------------------------------------------------------------------------------------------
        // CONSTRUCTOR
        /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
     */ function BigNumber(v, b) {
            var alphabet, c, caseChanged, e, i, isNum, len, str, x = this;
            // Enable constructor call without `new`.
            if (!(x instanceof BigNumber)) return new BigNumber(v, b);
            if (b == null) {
                if (v && v._isBigNumber === true) {
                    x.s = v.s;
                    if (!v.c || v.e > MAX_EXP) {
                        x.c = x.e = null;
                    } else if (v.e < MIN_EXP) {
                        x.c = [
                            x.e = 0
                        ];
                    } else {
                        x.e = v.e;
                        x.c = v.c.slice();
                    }
                    return;
                }
                if ((isNum = typeof v == 'number') && v * 0 == 0) {
                    // Use `1 / n` to handle minus zero also.
                    x.s = 1 / v < 0 ? (v = -v, -1) : 1;
                    // Fast path for integers, where n < 2147483648 (2**31).
                    if (v === ~~v) {
                        for(e = 0, i = v; i >= 10; i /= 10, e++);
                        if (e > MAX_EXP) {
                            x.c = x.e = null;
                        } else {
                            x.e = e;
                            x.c = [
                                v
                            ];
                        }
                        return;
                    }
                    str = String(v);
                } else {
                    if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
                    x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
                }
                // Decimal point?
                if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
                // Exponential form?
                if ((i = str.search(/e/i)) > 0) {
                    // Determine exponent.
                    if (e < 0) e = i;
                    e += +str.slice(i + 1);
                    str = str.substring(0, i);
                } else if (e < 0) {
                    // Integer.
                    e = str.length;
                }
            } else {
                // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
                intCheck(b, 2, ALPHABET.length, 'Base');
                // Allow exponential notation to be used with base 10 argument, while
                // also rounding to DECIMAL_PLACES as with other bases.
                if (b == 10 && alphabetHasNormalDecimalDigits) {
                    x = new BigNumber(v);
                    return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
                }
                str = String(v);
                if (isNum = typeof v == 'number') {
                    // Avoid potential interpretation of Infinity and NaN as base 44+ values.
                    if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
                    x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
                    // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
                    if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
                        throw Error(tooManyDigits + v);
                    }
                } else {
                    x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
                }
                alphabet = ALPHABET.slice(0, b);
                e = i = 0;
                // Check that str is a valid base b number.
                // Don't use RegExp, so alphabet can contain special characters.
                for(len = str.length; i < len; i++){
                    if (alphabet.indexOf(c = str.charAt(i)) < 0) {
                        if (c == '.') {
                            // If '.' is not the first character and it has not be found before.
                            if (i > e) {
                                e = len;
                                continue;
                            }
                        } else if (!caseChanged) {
                            // Allow e.g. hexadecimal 'FF' as well as 'ff'.
                            if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                                caseChanged = true;
                                i = -1;
                                e = 0;
                                continue;
                            }
                        }
                        return parseNumeric(x, String(v), isNum, b);
                    }
                }
                // Prevent later check for length on converted number.
                isNum = false;
                str = convertBase(str, b, 10, x.s);
                // Decimal point?
                if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
                else e = str.length;
            }
            // Determine leading zeros.
            for(i = 0; str.charCodeAt(i) === 48; i++);
            // Determine trailing zeros.
            for(len = str.length; str.charCodeAt(--len) === 48;);
            if (str = str.slice(i, ++len)) {
                len -= i;
                // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
                if (isNum && BigNumber.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
                    throw Error(tooManyDigits + x.s * v);
                }
                // Overflow?
                if ((e = e - i - 1) > MAX_EXP) {
                    // Infinity.
                    x.c = x.e = null;
                // Underflow?
                } else if (e < MIN_EXP) {
                    // Zero.
                    x.c = [
                        x.e = 0
                    ];
                } else {
                    x.e = e;
                    x.c = [];
                    // Transform base
                    // e is the base 10 exponent.
                    // i is where to slice str to get the first element of the coefficient array.
                    i = (e + 1) % LOG_BASE;
                    if (e < 0) i += LOG_BASE; // i < 1
                    if (i < len) {
                        if (i) x.c.push(+str.slice(0, i));
                        for(len -= LOG_BASE; i < len;){
                            x.c.push(+str.slice(i, i += LOG_BASE));
                        }
                        i = LOG_BASE - (str = str.slice(i)).length;
                    } else {
                        i -= len;
                    }
                    for(; i--; str += '0');
                    x.c.push(+str);
                }
            } else {
                // Zero.
                x.c = [
                    x.e = 0
                ];
            }
        }
        // CONSTRUCTOR PROPERTIES
        BigNumber.clone = clone;
        BigNumber.ROUND_UP = 0;
        BigNumber.ROUND_DOWN = 1;
        BigNumber.ROUND_CEIL = 2;
        BigNumber.ROUND_FLOOR = 3;
        BigNumber.ROUND_HALF_UP = 4;
        BigNumber.ROUND_HALF_DOWN = 5;
        BigNumber.ROUND_HALF_EVEN = 6;
        BigNumber.ROUND_HALF_CEIL = 7;
        BigNumber.ROUND_HALF_FLOOR = 8;
        BigNumber.EUCLID = 9;
        /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *     prefix                 {string}
     *     groupSize              {number}
     *     secondaryGroupSize     {number}
     *     groupSeparator         {string}
     *     decimalSeparator       {string}
     *     fractionGroupSize      {number}
     *     fractionGroupSeparator {string}
     *     suffix                 {string}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */ BigNumber.config = BigNumber.set = function(obj) {
            var p, v;
            if (obj != null) {
                if (typeof obj == 'object') {
                    // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
                    // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
                    if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
                        v = obj[p];
                        intCheck(v, 0, MAX, p);
                        DECIMAL_PLACES = v;
                    }
                    // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
                    // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
                    if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
                        v = obj[p];
                        intCheck(v, 0, 8, p);
                        ROUNDING_MODE = v;
                    }
                    // EXPONENTIAL_AT {number|number[]}
                    // Integer, -MAX to MAX inclusive or
                    // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
                    // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
                    if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
                        v = obj[p];
                        if (v && v.pop) {
                            intCheck(v[0], -MAX, 0, p);
                            intCheck(v[1], 0, MAX, p);
                            TO_EXP_NEG = v[0];
                            TO_EXP_POS = v[1];
                        } else {
                            intCheck(v, -MAX, MAX, p);
                            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
                        }
                    }
                    // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
                    // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
                    // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
                    if (obj.hasOwnProperty(p = 'RANGE')) {
                        v = obj[p];
                        if (v && v.pop) {
                            intCheck(v[0], -MAX, -1, p);
                            intCheck(v[1], 1, MAX, p);
                            MIN_EXP = v[0];
                            MAX_EXP = v[1];
                        } else {
                            intCheck(v, -MAX, MAX, p);
                            if (v) {
                                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                            } else {
                                throw Error(bignumberError + p + ' cannot be zero: ' + v);
                            }
                        }
                    }
                    // CRYPTO {boolean} true or false.
                    // '[BigNumber Error] CRYPTO not true or false: {v}'
                    // '[BigNumber Error] crypto unavailable'
                    if (obj.hasOwnProperty(p = 'CRYPTO')) {
                        v = obj[p];
                        if (v === !!v) {
                            if (v) {
                                if (typeof crypto != 'undefined' && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                                    CRYPTO = v;
                                } else {
                                    CRYPTO = !v;
                                    throw Error(bignumberError + 'crypto unavailable');
                                }
                            } else {
                                CRYPTO = v;
                            }
                        } else {
                            throw Error(bignumberError + p + ' not true or false: ' + v);
                        }
                    }
                    // MODULO_MODE {number} Integer, 0 to 9 inclusive.
                    // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
                    if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
                        v = obj[p];
                        intCheck(v, 0, 9, p);
                        MODULO_MODE = v;
                    }
                    // POW_PRECISION {number} Integer, 0 to MAX inclusive.
                    // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
                    if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
                        v = obj[p];
                        intCheck(v, 0, MAX, p);
                        POW_PRECISION = v;
                    }
                    // FORMAT {object}
                    // '[BigNumber Error] FORMAT not an object: {v}'
                    if (obj.hasOwnProperty(p = 'FORMAT')) {
                        v = obj[p];
                        if (typeof v == 'object') FORMAT = v;
                        else throw Error(bignumberError + p + ' not an object: ' + v);
                    }
                    // ALPHABET {string}
                    // '[BigNumber Error] ALPHABET invalid: {v}'
                    if (obj.hasOwnProperty(p = 'ALPHABET')) {
                        v = obj[p];
                        // Disallow if less than two characters,
                        // or if it contains '+', '-', '.', whitespace, or a repeated character.
                        if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                            alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
                            ALPHABET = v;
                        } else {
                            throw Error(bignumberError + p + ' invalid: ' + v);
                        }
                    }
                } else {
                    // '[BigNumber Error] Object expected: {v}'
                    throw Error(bignumberError + 'Object expected: ' + obj);
                }
            }
            return {
                DECIMAL_PLACES: DECIMAL_PLACES,
                ROUNDING_MODE: ROUNDING_MODE,
                EXPONENTIAL_AT: [
                    TO_EXP_NEG,
                    TO_EXP_POS
                ],
                RANGE: [
                    MIN_EXP,
                    MAX_EXP
                ],
                CRYPTO: CRYPTO,
                MODULO_MODE: MODULO_MODE,
                POW_PRECISION: POW_PRECISION,
                FORMAT: FORMAT,
                ALPHABET: ALPHABET
            };
        };
        /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
     *
     * v {any}
     *
     * '[BigNumber Error] Invalid BigNumber: {v}'
     */ BigNumber.isBigNumber = function(v) {
            if (!v || v._isBigNumber !== true) return false;
            if (!BigNumber.DEBUG) return true;
            var i, n, c = v.c, e = v.e, s = v.s;
            out: if (({}).toString.call(c) == '[object Array]') {
                if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
                    // If the first element is zero, the BigNumber value must be zero.
                    if (c[0] === 0) {
                        if (e === 0 && c.length === 1) return true;
                        break out;
                    }
                    // Calculate number of digits that c[0] should have, based on the exponent.
                    i = (e + 1) % LOG_BASE;
                    if (i < 1) i += LOG_BASE;
                    // Calculate number of digits of c[0].
                    //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
                    if (String(c[0]).length == i) {
                        for(i = 0; i < c.length; i++){
                            n = c[i];
                            if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
                        }
                        // Last element cannot be zero, unless it is the only element.
                        if (n !== 0) return true;
                    }
                }
            // Infinity/NaN
            } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
                return true;
            }
            throw Error(bignumberError + 'Invalid BigNumber: ' + v);
        };
        /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */ BigNumber.maximum = BigNumber.max = function() {
            return maxOrMin(arguments, -1);
        };
        /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */ BigNumber.minimum = BigNumber.min = function() {
            return maxOrMin(arguments, 1);
        };
        /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */ BigNumber.random = function() {
            var pow2_53 = 0x20000000000000;
            // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
            // Check if Math.random() produces more than 32 bits of randomness.
            // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
            // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
            var random53bitInt = Math.random() * pow2_53 & 0x1fffff ? function() {
                return mathfloor(Math.random() * pow2_53);
            } : function() {
                return (Math.random() * 0x40000000 | 0) * 0x800000 + (Math.random() * 0x800000 | 0);
            };
            return function(dp) {
                var a, b, e, k, v, i = 0, c = [], rand = new BigNumber(ONE);
                if (dp == null) dp = DECIMAL_PLACES;
                else intCheck(dp, 0, MAX);
                k = mathceil(dp / LOG_BASE);
                if (CRYPTO) {
                    // Browsers supporting crypto.getRandomValues.
                    if (crypto.getRandomValues) {
                        a = crypto.getRandomValues(new Uint32Array(k *= 2));
                        for(; i < k;){
                            // 53 bits:
                            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                            //                                     11111 11111111 11111111
                            // 0x20000 is 2^21.
                            v = a[i] * 0x20000 + (a[i + 1] >>> 11);
                            // Rejection sampling:
                            // 0 <= v < 9007199254740992
                            // Probability that v >= 9e15, is
                            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                            if (v >= 9e15) {
                                b = crypto.getRandomValues(new Uint32Array(2));
                                a[i] = b[0];
                                a[i + 1] = b[1];
                            } else {
                                // 0 <= v <= 8999999999999999
                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push(v % 1e14);
                                i += 2;
                            }
                        }
                        i = k / 2;
                    // Node.js supporting crypto.randomBytes.
                    } else if (crypto.randomBytes) {
                        // buffer
                        a = crypto.randomBytes(k *= 7);
                        for(; i < k;){
                            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                            // 0x100000000 is 2^32, 0x1000000 is 2^24
                            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                            // 0 <= v < 9007199254740992
                            v = (a[i] & 31) * 0x1000000000000 + a[i + 1] * 0x10000000000 + a[i + 2] * 0x100000000 + a[i + 3] * 0x1000000 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
                            if (v >= 9e15) {
                                crypto.randomBytes(7).copy(a, i);
                            } else {
                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push(v % 1e14);
                                i += 7;
                            }
                        }
                        i = k / 7;
                    } else {
                        CRYPTO = false;
                        throw Error(bignumberError + 'crypto unavailable');
                    }
                }
                // Use Math.random.
                if (!CRYPTO) {
                    for(; i < k;){
                        v = random53bitInt();
                        if (v < 9e15) c[i++] = v % 1e14;
                    }
                }
                k = c[--i];
                dp %= LOG_BASE;
                // Convert trailing digits to zeros according to dp.
                if (k && dp) {
                    v = POWS_TEN[LOG_BASE - dp];
                    c[i] = mathfloor(k / v) * v;
                }
                // Remove trailing elements which are zero.
                for(; c[i] === 0; c.pop(), i--);
                // Zero?
                if (i < 0) {
                    c = [
                        e = 0
                    ];
                } else {
                    // Remove leading elements which are zero and adjust exponent accordingly.
                    for(e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);
                    // Count the digits of the first element of c to determine leading zeros, and...
                    for(i = 1, v = c[0]; v >= 10; v /= 10, i++);
                    // adjust the exponent accordingly.
                    if (i < LOG_BASE) e -= LOG_BASE - i;
                }
                rand.e = e;
                rand.c = c;
                return rand;
            };
        }();
        /*
     * Return a BigNumber whose value is the sum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */ BigNumber.sum = function() {
            var i = 1, args = arguments, sum = new BigNumber(args[0]);
            for(; i < args.length;)sum = sum.plus(args[i++]);
            return sum;
        };
        // PRIVATE FUNCTIONS
        // Called by BigNumber and BigNumber.prototype.toString.
        convertBase = function() {
            var decimal = '0123456789';
            /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */ function toBaseOut(str, baseIn, baseOut, alphabet) {
                var j, arr = [
                    0
                ], arrL, i = 0, len = str.length;
                for(; i < len;){
                    for(arrL = arr.length; arrL--; arr[arrL] *= baseIn);
                    arr[0] += alphabet.indexOf(str.charAt(i++));
                    for(j = 0; j < arr.length; j++){
                        if (arr[j] > baseOut - 1) {
                            if (arr[j + 1] == null) arr[j + 1] = 0;
                            arr[j + 1] += arr[j] / baseOut | 0;
                            arr[j] %= baseOut;
                        }
                    }
                }
                return arr.reverse();
            }
            // Convert a numeric string of baseIn to a numeric string of baseOut.
            // If the caller is toString, we are converting from base 10 to baseOut.
            // If the caller is BigNumber, we are converting from baseIn to base 10.
            return function(str, baseIn, baseOut, sign, callerIsToString) {
                var alphabet, d, e, k, r, x, xc, y, i = str.indexOf('.'), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
                // Non-integer.
                if (i >= 0) {
                    k = POW_PRECISION;
                    // Unlimited precision.
                    POW_PRECISION = 0;
                    str = str.replace('.', '');
                    y = new BigNumber(baseIn);
                    x = y.pow(str.length - i);
                    POW_PRECISION = k;
                    // Convert str as if an integer, then restore the fraction part by dividing the
                    // result by its base raised to a power.
                    y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'), 10, baseOut, decimal);
                    y.e = y.c.length;
                }
                // Convert the number as integer.
                xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
                // xc now represents str as an integer and converted to baseOut. e is the exponent.
                e = k = xc.length;
                // Remove trailing zeros.
                for(; xc[--k] == 0; xc.pop());
                // Zero?
                if (!xc[0]) return alphabet.charAt(0);
                // Does str represent an integer? If so, no need for the division.
                if (i < 0) {
                    --e;
                } else {
                    x.c = xc;
                    x.e = e;
                    // The sign is needed for correct rounding.
                    x.s = sign;
                    x = div(x, y, dp, rm, baseOut);
                    xc = x.c;
                    r = x.r;
                    e = x.e;
                }
                // xc now represents str converted to baseOut.
                // The index of the rounding digit.
                d = e + dp + 1;
                // The rounding digit: the digit to the right of the digit that may be rounded up.
                i = xc[d];
                // Look at the rounding digits and mode to determine whether to round up.
                k = baseOut / 2;
                r = r || d < 0 || xc[d + 1] != null;
                r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
                // If the index of the rounding digit is not greater than zero, or xc represents
                // zero, then the result of the base conversion is zero or, if rounding up, a value
                // such as 0.00001.
                if (d < 1 || !xc[0]) {
                    // 1^-dp or 0
                    str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
                } else {
                    // Truncate xc to the required number of decimal places.
                    xc.length = d;
                    // Round up?
                    if (r) {
                        // Rounding up may mean the previous digit has to be rounded up and so on.
                        for(--baseOut; ++xc[--d] > baseOut;){
                            xc[d] = 0;
                            if (!d) {
                                ++e;
                                xc = [
                                    1
                                ].concat(xc);
                            }
                        }
                    }
                    // Determine trailing zeros.
                    for(k = xc.length; !xc[--k];);
                    // E.g. [4, 11, 15] becomes 4bf.
                    for(i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));
                    // Add leading zeros, decimal point and trailing zeros as required.
                    str = toFixedPoint(str, e, alphabet.charAt(0));
                }
                // The caller will add the sign.
                return str;
            };
        }();
        // Perform division in the specified base. Called by div and convertBase.
        div = function() {
            // Assume non-zero x and k.
            function multiply(x, k, base) {
                var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
                for(x = x.slice(); i--;){
                    xlo = x[i] % SQRT_BASE;
                    xhi = x[i] / SQRT_BASE | 0;
                    m = khi * xlo + xhi * klo;
                    temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
                    carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
                    x[i] = temp % base;
                }
                if (carry) x = [
                    carry
                ].concat(x);
                return x;
            }
            function compare(a, b, aL, bL) {
                var i, cmp;
                if (aL != bL) {
                    cmp = aL > bL ? 1 : -1;
                } else {
                    for(i = cmp = 0; i < aL; i++){
                        if (a[i] != b[i]) {
                            cmp = a[i] > b[i] ? 1 : -1;
                            break;
                        }
                    }
                }
                return cmp;
            }
            function subtract(a, b, aL, base) {
                var i = 0;
                // Subtract b from a.
                for(; aL--;){
                    a[aL] -= i;
                    i = a[aL] < b[aL] ? 1 : 0;
                    a[aL] = i * base + a[aL] - b[aL];
                }
                // Remove leading zeros.
                for(; !a[0] && a.length > 1; a.splice(0, 1));
            }
            // x: dividend, y: divisor.
            return function(x, y, dp, rm, base) {
                var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
                // Either NaN, Infinity or 0?
                if (!xc || !xc[0] || !yc || !yc[0]) {
                    return new BigNumber(// Return NaN if either NaN, or both Infinity or 0.
                    !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                    xc && xc[0] == 0 || !yc ? s * 0 : s / 0);
                }
                q = new BigNumber(s);
                qc = q.c = [];
                e = x.e - y.e;
                s = dp + e + 1;
                if (!base) {
                    base = BASE;
                    e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
                    s = s / LOG_BASE | 0;
                }
                // Result exponent may be one less then the current value of e.
                // The coefficients of the BigNumbers from convertBase may have trailing zeros.
                for(i = 0; yc[i] == (xc[i] || 0); i++);
                if (yc[i] > (xc[i] || 0)) e--;
                if (s < 0) {
                    qc.push(1);
                    more = true;
                } else {
                    xL = xc.length;
                    yL = yc.length;
                    i = 0;
                    s += 2;
                    // Normalise xc and yc so highest order digit of yc is >= base / 2.
                    n = mathfloor(base / (yc[0] + 1));
                    // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
                    // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
                    if (n > 1) {
                        yc = multiply(yc, n, base);
                        xc = multiply(xc, n, base);
                        yL = yc.length;
                        xL = xc.length;
                    }
                    xi = yL;
                    rem = xc.slice(0, yL);
                    remL = rem.length;
                    // Add zeros to make remainder as long as divisor.
                    for(; remL < yL; rem[remL++] = 0);
                    yz = yc.slice();
                    yz = [
                        0
                    ].concat(yz);
                    yc0 = yc[0];
                    if (yc[1] >= base / 2) yc0++;
                    // Not necessary, but to prevent trial digit n > base, when using base 3.
                    // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;
                    do {
                        n = 0;
                        // Compare divisor and remainder.
                        cmp = compare(yc, rem, yL, remL);
                        // If divisor < remainder.
                        if (cmp < 0) {
                            // Calculate trial digit, n.
                            rem0 = rem[0];
                            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
                            // n is how many times the divisor goes into the current remainder.
                            n = mathfloor(rem0 / yc0);
                            //  Algorithm:
                            //  product = divisor multiplied by trial digit (n).
                            //  Compare product and remainder.
                            //  If product is greater than remainder:
                            //    Subtract divisor from product, decrement trial digit.
                            //  Subtract product from remainder.
                            //  If product was less than remainder at the last compare:
                            //    Compare new remainder and divisor.
                            //    If remainder is greater than divisor:
                            //      Subtract divisor from remainder, increment trial digit.
                            if (n > 1) {
                                // n may be > base only when base is 3.
                                if (n >= base) n = base - 1;
                                // product = divisor * trial digit.
                                prod = multiply(yc, n, base);
                                prodL = prod.length;
                                remL = rem.length;
                                // Compare product and remainder.
                                // If product > remainder then trial digit n too high.
                                // n is 1 too high about 5% of the time, and is not known to have
                                // ever been more than 1 too high.
                                while(compare(prod, rem, prodL, remL) == 1){
                                    n--;
                                    // Subtract divisor from product.
                                    subtract(prod, yL < prodL ? yz : yc, prodL, base);
                                    prodL = prod.length;
                                    cmp = 1;
                                }
                            } else {
                                // n is 0 or 1, cmp is -1.
                                // If n is 0, there is no need to compare yc and rem again below,
                                // so change cmp to 1 to avoid it.
                                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                                if (n == 0) {
                                    // divisor < remainder, so n must be at least 1.
                                    cmp = n = 1;
                                }
                                // product = divisor
                                prod = yc.slice();
                                prodL = prod.length;
                            }
                            if (prodL < remL) prod = [
                                0
                            ].concat(prod);
                            // Subtract product from remainder.
                            subtract(rem, prod, remL, base);
                            remL = rem.length;
                            // If product was < remainder.
                            if (cmp == -1) {
                                // Compare divisor and new remainder.
                                // If divisor < new remainder, subtract divisor from remainder.
                                // Trial digit n too low.
                                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                                while(compare(yc, rem, yL, remL) < 1){
                                    n++;
                                    // Subtract divisor from remainder.
                                    subtract(rem, yL < remL ? yz : yc, remL, base);
                                    remL = rem.length;
                                }
                            }
                        } else if (cmp === 0) {
                            n++;
                            rem = [
                                0
                            ];
                        } // else cmp === 1 and n will be 0
                        // Add the next digit, n, to the result array.
                        qc[i++] = n;
                        // Update the remainder.
                        if (rem[0]) {
                            rem[remL++] = xc[xi] || 0;
                        } else {
                            rem = [
                                xc[xi]
                            ];
                            remL = 1;
                        }
                    }while ((xi++ < xL || rem[0] != null) && s--)
                    more = rem[0] != null;
                    // Leading zero?
                    if (!qc[0]) qc.splice(0, 1);
                }
                if (base == BASE) {
                    // To calculate q.e, first get the number of digits of qc[0].
                    for(i = 1, s = qc[0]; s >= 10; s /= 10, i++);
                    round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
                // Caller is convertBase.
                } else {
                    q.e = e;
                    q.r = +more;
                }
                return q;
            };
        }();
        /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */ function format(n, i, rm, id) {
            var c0, e, ne, len, str;
            if (rm == null) rm = ROUNDING_MODE;
            else intCheck(rm, 0, 8);
            if (!n.c) return n.toString();
            c0 = n.c[0];
            ne = n.e;
            if (i == null) {
                str = coeffToString(n.c);
                str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, '0');
            } else {
                n = round(new BigNumber(n), i, rm);
                // n.e may have changed if the value was rounded up.
                e = n.e;
                str = coeffToString(n.c);
                len = str.length;
                // toPrecision returns exponential notation if the number of significant digits
                // specified is less than the number of digits necessary to represent the integer
                // part of the value in fixed-point notation.
                // Exponential notation.
                if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
                    // Append zeros?
                    for(; len < i; str += '0', len++);
                    str = toExponential(str, e);
                // Fixed-point notation.
                } else {
                    i -= ne + (id === 2 && e > ne);
                    str = toFixedPoint(str, e, '0');
                    // Append zeros?
                    if (e + 1 > len) {
                        if (--i > 0) for(str += '.'; i--; str += '0');
                    } else {
                        i += e - len;
                        if (i > 0) {
                            if (e + 1 == len) str += '.';
                            for(; i--; str += '0');
                        }
                    }
                }
            }
            return n.s < 0 && c0 ? '-' + str : str;
        }
        // Handle BigNumber.max and BigNumber.min.
        // If any number is NaN, return NaN.
        function maxOrMin(args, n) {
            var k, y, i = 1, x = new BigNumber(args[0]);
            for(; i < args.length; i++){
                y = new BigNumber(args[i]);
                if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
                    x = y;
                }
            }
            return x;
        }
        /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */ function normalise(n, c, e) {
            var i = 1, j = c.length;
            // Remove trailing zeros.
            for(; !c[--j]; c.pop());
            // Calculate the base 10 exponent. First get the number of digits of c[0].
            for(j = c[0]; j >= 10; j /= 10, i++);
            // Overflow?
            if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
                // Infinity.
                n.c = n.e = null;
            // Underflow?
            } else if (e < MIN_EXP) {
                // Zero.
                n.c = [
                    n.e = 0
                ];
            } else {
                n.e = e;
                n.c = c;
            }
            return n;
        }
        // Handle values that fail the validity test in BigNumber.
        parseNumeric = function() {
            var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
            return function(x, str, isNum, b) {
                var base, s = isNum ? str : str.replace(whitespaceOrPlus, '');
                // No exception on ±Infinity or NaN.
                if (isInfinityOrNaN.test(s)) {
                    x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
                } else {
                    if (!isNum) {
                        // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                        s = s.replace(basePrefix, function(m, p1, p2) {
                            base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                            return !b || b == base ? p1 : m;
                        });
                        if (b) {
                            base = b;
                            // E.g. '1.' to '1', '.1' to '0.1'
                            s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
                        }
                        if (str != s) return new BigNumber(s, base);
                    }
                    // '[BigNumber Error] Not a number: {n}'
                    // '[BigNumber Error] Not a base {b} number: {n}'
                    if (BigNumber.DEBUG) {
                        throw Error(bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
                    }
                    // NaN
                    x.s = null;
                }
                x.c = x.e = null;
            };
        }();
        /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */ function round(x, sd, rm, r) {
            var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
            // if x is not Infinity or NaN...
            if (xc) {
                // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
                // n is a base 1e14 number, the value of the element of array x.c containing rd.
                // ni is the index of n within x.c.
                // d is the number of digits of n.
                // i is the index of rd within n including leading zeros.
                // j is the actual index of rd within n (if < 0, rd is a leading zero).
                out: {
                    // Get the number of digits of the first element of xc.
                    for(d = 1, k = xc[0]; k >= 10; k /= 10, d++);
                    i = sd - d;
                    // If the rounding digit is in the first element of xc...
                    if (i < 0) {
                        i += LOG_BASE;
                        j = sd;
                        n = xc[ni = 0];
                        // Get the rounding digit at index j of n.
                        rd = mathfloor(n / pows10[d - j - 1] % 10);
                    } else {
                        ni = mathceil((i + 1) / LOG_BASE);
                        if (ni >= xc.length) {
                            if (r) {
                                // Needed by sqrt.
                                for(; xc.length <= ni; xc.push(0));
                                n = rd = 0;
                                d = 1;
                                i %= LOG_BASE;
                                j = i - LOG_BASE + 1;
                            } else {
                                break out;
                            }
                        } else {
                            n = k = xc[ni];
                            // Get the number of digits of n.
                            for(d = 1; k >= 10; k /= 10, d++);
                            // Get the index of rd within n.
                            i %= LOG_BASE;
                            // Get the index of rd within n, adjusted for leading zeros.
                            // The number of leading zeros of n is given by LOG_BASE - d.
                            j = i - LOG_BASE + d;
                            // Get the rounding digit at index j of n.
                            rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
                        }
                    }
                    r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
                    // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
                    // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
                    xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
                    r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
                    (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
                    if (sd < 1 || !xc[0]) {
                        xc.length = 0;
                        if (r) {
                            // Convert sd to decimal places.
                            sd -= x.e + 1;
                            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                            x.e = -sd || 0;
                        } else {
                            // Zero.
                            xc[0] = x.e = 0;
                        }
                        return x;
                    }
                    // Remove excess digits.
                    if (i == 0) {
                        xc.length = ni;
                        k = 1;
                        ni--;
                    } else {
                        xc.length = ni + 1;
                        k = pows10[LOG_BASE - i];
                        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                        // j > 0 means i > number of leading zeros of n.
                        xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
                    }
                    // Round up?
                    if (r) {
                        for(;;){
                            // If the digit to be rounded up is in the first element of xc...
                            if (ni == 0) {
                                // i will be the length of xc[0] before k is added.
                                for(i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                                j = xc[0] += k;
                                for(k = 1; j >= 10; j /= 10, k++);
                                // if i != k the length has increased.
                                if (i != k) {
                                    x.e++;
                                    if (xc[0] == BASE) xc[0] = 1;
                                }
                                break;
                            } else {
                                xc[ni] += k;
                                if (xc[ni] != BASE) break;
                                xc[ni--] = 0;
                                k = 1;
                            }
                        }
                    }
                    // Remove trailing zeros.
                    for(i = xc.length; xc[--i] === 0; xc.pop());
                }
                // Overflow? Infinity.
                if (x.e > MAX_EXP) {
                    x.c = x.e = null;
                // Underflow? Zero.
                } else if (x.e < MIN_EXP) {
                    x.c = [
                        x.e = 0
                    ];
                }
            }
            return x;
        }
        function valueOf(n) {
            var str, e = n.e;
            if (e === null) return n.toString();
            str = coeffToString(n.c);
            str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, '0');
            return n.s < 0 ? '-' + str : str;
        }
        // PROTOTYPE/INSTANCE METHODS
        /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */ P.absoluteValue = P.abs = function() {
            var x = new BigNumber(this);
            if (x.s < 0) x.s = 1;
            return x;
        };
        /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */ P.comparedTo = function(y, b) {
            return compare(this, new BigNumber(y, b));
        };
        /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */ P.decimalPlaces = P.dp = function(dp, rm) {
            var c, n, v, x = this;
            if (dp != null) {
                intCheck(dp, 0, MAX);
                if (rm == null) rm = ROUNDING_MODE;
                else intCheck(rm, 0, 8);
                return round(new BigNumber(x), dp + x.e + 1, rm);
            }
            if (!(c = x.c)) return null;
            n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
            // Subtract the number of trailing zeros of the last number.
            if (v = c[v]) for(; v % 10 == 0; v /= 10, n--);
            if (n < 0) n = 0;
            return n;
        };
        /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */ P.dividedBy = P.div = function(y, b) {
            return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
        };
        /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */ P.dividedToIntegerBy = P.idiv = function(y, b) {
            return div(this, new BigNumber(y, b), 0, 1);
        };
        /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */ P.exponentiatedBy = P.pow = function(n, m) {
            var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
            n = new BigNumber(n);
            // Allow NaN and ±Infinity, but not other non-integers.
            if (n.c && !n.isInteger()) {
                throw Error(bignumberError + 'Exponent not an integer: ' + valueOf(n));
            }
            if (m != null) m = new BigNumber(m);
            // Exponent of MAX_SAFE_INTEGER is 15.
            nIsBig = n.e > 14;
            // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
            if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
                // The sign of the result of pow when x is negative depends on the evenness of n.
                // If +n overflows to ±Infinity, the evenness of n would be not be known.
                y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
                return m ? y.mod(m) : y;
            }
            nIsNeg = n.s < 0;
            if (m) {
                // x % m returns NaN if abs(m) is zero, or m is NaN.
                if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);
                isModExp = !nIsNeg && x.isInteger() && m.isInteger();
                if (isModExp) x = x.mod(m);
            // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
            // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
            } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
                // If x is negative and n is odd, k = -0, else k = 0.
                k = x.s < 0 && isOdd(n) ? -0 : 0;
                // If x >= 1, k = ±Infinity.
                if (x.e > -1) k = 1 / k;
                // If n is negative return ±0, else return ±Infinity.
                return new BigNumber(nIsNeg ? 1 / k : k);
            } else if (POW_PRECISION) {
                // Truncating each coefficient array to a length of k after each multiplication
                // equates to truncating significant digits to POW_PRECISION + [28, 41],
                // i.e. there will be a minimum of 28 guard digits retained.
                k = mathceil(POW_PRECISION / LOG_BASE + 2);
            }
            if (nIsBig) {
                half = new BigNumber(0.5);
                if (nIsNeg) n.s = 1;
                nIsOdd = isOdd(n);
            } else {
                i = Math.abs(+valueOf(n));
                nIsOdd = i % 2;
            }
            y = new BigNumber(ONE);
            // Performs 54 loop iterations for n of 9007199254740991.
            for(;;){
                if (nIsOdd) {
                    y = y.times(x);
                    if (!y.c) break;
                    if (k) {
                        if (y.c.length > k) y.c.length = k;
                    } else if (isModExp) {
                        y = y.mod(m); //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
                    }
                }
                if (i) {
                    i = mathfloor(i / 2);
                    if (i === 0) break;
                    nIsOdd = i % 2;
                } else {
                    n = n.times(half);
                    round(n, n.e + 1, 1);
                    if (n.e > 14) {
                        nIsOdd = isOdd(n);
                    } else {
                        i = +valueOf(n);
                        if (i === 0) break;
                        nIsOdd = i % 2;
                    }
                }
                x = x.times(x);
                if (k) {
                    if (x.c && x.c.length > k) x.c.length = k;
                } else if (isModExp) {
                    x = x.mod(m); //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
                }
            }
            if (isModExp) return y;
            if (nIsNeg) y = ONE.div(y);
            return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
        };
        /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */ P.integerValue = function(rm) {
            var n = new BigNumber(this);
            if (rm == null) rm = ROUNDING_MODE;
            else intCheck(rm, 0, 8);
            return round(n, n.e + 1, rm);
        };
        /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */ P.isEqualTo = P.eq = function(y, b) {
            return compare(this, new BigNumber(y, b)) === 0;
        };
        /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */ P.isFinite = function() {
            return !!this.c;
        };
        /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */ P.isGreaterThan = P.gt = function(y, b) {
            return compare(this, new BigNumber(y, b)) > 0;
        };
        /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */ P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
            return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;
        };
        /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */ P.isInteger = function() {
            return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
        };
        /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */ P.isLessThan = P.lt = function(y, b) {
            return compare(this, new BigNumber(y, b)) < 0;
        };
        /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */ P.isLessThanOrEqualTo = P.lte = function(y, b) {
            return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
        };
        /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */ P.isNaN = function() {
            return !this.s;
        };
        /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */ P.isNegative = function() {
            return this.s < 0;
        };
        /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */ P.isPositive = function() {
            return this.s > 0;
        };
        /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */ P.isZero = function() {
            return !!this.c && this.c[0] == 0;
        };
        /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */ P.minus = function(y, b) {
            var i, j, t, xLTy, x = this, a = x.s;
            y = new BigNumber(y, b);
            b = y.s;
            // Either NaN?
            if (!a || !b) return new BigNumber(NaN);
            // Signs differ?
            if (a != b) {
                y.s = -b;
                return x.plus(y);
            }
            var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
            if (!xe || !ye) {
                // Either Infinity?
                if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);
                // Either zero?
                if (!xc[0] || !yc[0]) {
                    // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                    return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x : // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                    ROUNDING_MODE == 3 ? -0 : 0);
                }
            }
            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();
            // Determine which is the bigger number.
            if (a = xe - ye) {
                if (xLTy = a < 0) {
                    a = -a;
                    t = xc;
                } else {
                    ye = xe;
                    t = yc;
                }
                t.reverse();
                // Prepend zeros to equalise exponents.
                for(b = a; b--; t.push(0));
                t.reverse();
            } else {
                // Exponents equal. Check digit by digit.
                j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
                for(a = b = 0; b < j; b++){
                    if (xc[b] != yc[b]) {
                        xLTy = xc[b] < yc[b];
                        break;
                    }
                }
            }
            // x < y? Point xc to the array of the bigger number.
            if (xLTy) {
                t = xc;
                xc = yc;
                yc = t;
                y.s = -y.s;
            }
            b = (j = yc.length) - (i = xc.length);
            // Append zeros to xc if shorter.
            // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
            if (b > 0) for(; b--; xc[i++] = 0);
            b = BASE - 1;
            // Subtract yc from xc.
            for(; j > a;){
                if (xc[--j] < yc[j]) {
                    for(i = j; i && !xc[--i]; xc[i] = b);
                    --xc[i];
                    xc[j] += BASE;
                }
                xc[j] -= yc[j];
            }
            // Remove leading zeros and adjust exponent accordingly.
            for(; xc[0] == 0; xc.splice(0, 1), --ye);
            // Zero?
            if (!xc[0]) {
                // Following IEEE 754 (2008) 6.3,
                // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
                y.s = ROUNDING_MODE == 3 ? -1 : 1;
                y.c = [
                    y.e = 0
                ];
                return y;
            }
            // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
            // for finite x and y.
            return normalise(y, xc, ye);
        };
        /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */ P.modulo = P.mod = function(y, b) {
            var q, s, x = this;
            y = new BigNumber(y, b);
            // Return NaN if x is Infinity or NaN, or y is NaN or zero.
            if (!x.c || !y.s || y.c && !y.c[0]) {
                return new BigNumber(NaN);
            // Return x if y is Infinity or x is zero.
            } else if (!y.c || x.c && !x.c[0]) {
                return new BigNumber(x);
            }
            if (MODULO_MODE == 9) {
                // Euclidian division: q = sign(y) * floor(x / abs(y))
                // r = x - qy    where  0 <= r < abs(y)
                s = y.s;
                y.s = 1;
                q = div(x, y, 0, 3);
                y.s = s;
                q.s *= s;
            } else {
                q = div(x, y, 0, MODULO_MODE);
            }
            y = x.minus(q.times(y));
            // To match JavaScript %, ensure sign of zero is sign of dividend.
            if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
            return y;
        };
        /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */ P.multipliedBy = P.times = function(y, b) {
            var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber(y, b)).c;
            // Either NaN, ±Infinity or ±0?
            if (!xc || !yc || !xc[0] || !yc[0]) {
                // Return NaN if either is NaN, or one is 0 and the other is Infinity.
                if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
                    y.c = y.e = y.s = null;
                } else {
                    y.s *= x.s;
                    // Return ±Infinity if either is ±Infinity.
                    if (!xc || !yc) {
                        y.c = y.e = null;
                    // Return ±0 if either is ±0.
                    } else {
                        y.c = [
                            0
                        ];
                        y.e = 0;
                    }
                }
                return y;
            }
            e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
            y.s *= x.s;
            xcL = xc.length;
            ycL = yc.length;
            // Ensure xc points to longer array and xcL to its length.
            if (xcL < ycL) {
                zc = xc;
                xc = yc;
                yc = zc;
                i = xcL;
                xcL = ycL;
                ycL = i;
            }
            // Initialise the result array with zeros.
            for(i = xcL + ycL, zc = []; i--; zc.push(0));
            base = BASE;
            sqrtBase = SQRT_BASE;
            for(i = ycL; --i >= 0;){
                c = 0;
                ylo = yc[i] % sqrtBase;
                yhi = yc[i] / sqrtBase | 0;
                for(k = xcL, j = i + k; j > i;){
                    xlo = xc[--k] % sqrtBase;
                    xhi = xc[k] / sqrtBase | 0;
                    m = yhi * xlo + xhi * ylo;
                    xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
                    c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
                    zc[j--] = xlo % base;
                }
                zc[j] = c;
            }
            if (c) {
                ++e;
            } else {
                zc.splice(0, 1);
            }
            return normalise(y, zc, e);
        };
        /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */ P.negated = function() {
            var x = new BigNumber(this);
            x.s = -x.s || null;
            return x;
        };
        /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */ P.plus = function(y, b) {
            var t, x = this, a = x.s;
            y = new BigNumber(y, b);
            b = y.s;
            // Either NaN?
            if (!a || !b) return new BigNumber(NaN);
            // Signs differ?
            if (a != b) {
                y.s = -b;
                return x.minus(y);
            }
            var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
            if (!xe || !ye) {
                // Return ±Infinity if either ±Infinity.
                if (!xc || !yc) return new BigNumber(a / 0);
                // Either zero?
                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
            }
            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();
            // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
            if (a = xe - ye) {
                if (a > 0) {
                    ye = xe;
                    t = yc;
                } else {
                    a = -a;
                    t = xc;
                }
                t.reverse();
                for(; a--; t.push(0));
                t.reverse();
            }
            a = xc.length;
            b = yc.length;
            // Point xc to the longer array, and b to the shorter length.
            if (a - b < 0) {
                t = yc;
                yc = xc;
                xc = t;
                b = a;
            }
            // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
            for(a = 0; b;){
                a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
                xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
            }
            if (a) {
                xc = [
                    a
                ].concat(xc);
                ++ye;
            }
            // No need to check for zero, as +x + +y != 0 && -x + -y != 0
            // ye = MAX_EXP + 1 possible
            return normalise(y, xc, ye);
        };
        /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */ P.precision = P.sd = function(sd, rm) {
            var c, n, v, x = this;
            if (sd != null && sd !== !!sd) {
                intCheck(sd, 1, MAX);
                if (rm == null) rm = ROUNDING_MODE;
                else intCheck(rm, 0, 8);
                return round(new BigNumber(x), sd, rm);
            }
            if (!(c = x.c)) return null;
            v = c.length - 1;
            n = v * LOG_BASE + 1;
            if (v = c[v]) {
                // Subtract the number of trailing zeros of the last element.
                for(; v % 10 == 0; v /= 10, n--);
                // Add the number of digits of the first element.
                for(v = c[0]; v >= 10; v /= 10, n++);
            }
            if (sd && x.e + 1 > n) n = x.e + 1;
            return n;
        };
        /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */ P.shiftedBy = function(k) {
            intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
            return this.times('1e' + k);
        };
        /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */ P.squareRoot = P.sqrt = function() {
            var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber('0.5');
            // Negative/NaN/Infinity/zero?
            if (s !== 1 || !c || !c[0]) {
                return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
            }
            // Initial estimate.
            s = Math.sqrt(+valueOf(x));
            // Math.sqrt underflow/overflow?
            // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
            if (s == 0 || s == 1 / 0) {
                n = coeffToString(c);
                if ((n.length + e) % 2 == 0) n += '0';
                s = Math.sqrt(+n);
                e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
                if (s == 1 / 0) {
                    n = '5e' + e;
                } else {
                    n = s.toExponential();
                    n = n.slice(0, n.indexOf('e') + 1) + e;
                }
                r = new BigNumber(n);
            } else {
                r = new BigNumber(s + '');
            }
            // Check for zero.
            // r could be zero if MIN_EXP is changed after the this value was created.
            // This would cause a division by zero (x/t) and hence Infinity below, which would cause
            // coeffToString to throw.
            if (r.c[0]) {
                e = r.e;
                s = e + dp;
                if (s < 3) s = 0;
                // Newton-Raphson iteration.
                for(;;){
                    t = r;
                    r = half.times(t.plus(div(x, t, dp, 1)));
                    if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
                        // The exponent of r may here be one less than the final result exponent,
                        // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                        // are indexed correctly.
                        if (r.e < e) --s;
                        n = n.slice(s - 3, s + 1);
                        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                        // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                        // iteration.
                        if (n == '9999' || !rep && n == '4999') {
                            // On the first iteration only, check to see if rounding up gives the
                            // exact result as the nines may infinitely repeat.
                            if (!rep) {
                                round(t, t.e + DECIMAL_PLACES + 2, 0);
                                if (t.times(t).eq(x)) {
                                    r = t;
                                    break;
                                }
                            }
                            dp += 4;
                            s += 4;
                            rep = 1;
                        } else {
                            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                            // result. If not, then there are further digits and m will be truthy.
                            if (!+n || !+n.slice(1) && n.charAt(0) == '5') {
                                // Truncate to the first rounding digit.
                                round(r, r.e + DECIMAL_PLACES + 2, 1);
                                m = !r.times(r).eq(x);
                            }
                            break;
                        }
                    }
                }
            }
            return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
        };
        /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */ P.toExponential = function(dp, rm) {
            if (dp != null) {
                intCheck(dp, 0, MAX);
                dp++;
            }
            return format(this, dp, rm, 1);
        };
        /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */ P.toFixed = function(dp, rm) {
            if (dp != null) {
                intCheck(dp, 0, MAX);
                dp = dp + this.e + 1;
            }
            return format(this, dp, rm);
        };
        /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the format or FORMAT object (see BigNumber.set).
     *
     * The formatting object may contain some or all of the properties shown below.
     *
     * FORMAT = {
     *   prefix: '',
     *   groupSize: 3,
     *   secondaryGroupSize: 0,
     *   groupSeparator: ',',
     *   decimalSeparator: '.',
     *   fractionGroupSize: 0,
     *   fractionGroupSeparator: '\xA0',      // non-breaking space
     *   suffix: ''
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     * [format] {object} Formatting options. See FORMAT pbject above.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     * '[BigNumber Error] Argument not an object: {format}'
     */ P.toFormat = function(dp, rm, format) {
            var str, x = this;
            if (format == null) {
                if (dp != null && rm && typeof rm == 'object') {
                    format = rm;
                    rm = null;
                } else if (dp && typeof dp == 'object') {
                    format = dp;
                    dp = rm = null;
                } else {
                    format = FORMAT;
                }
            } else if (typeof format != 'object') {
                throw Error(bignumberError + 'Argument not an object: ' + format);
            }
            str = x.toFixed(dp, rm);
            if (x.c) {
                var i, arr = str.split('.'), g1 = +format.groupSize, g2 = +format.secondaryGroupSize, groupSeparator = format.groupSeparator || '', intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
                if (g2) {
                    i = g1;
                    g1 = g2;
                    g2 = i;
                    len -= i;
                }
                if (g1 > 0 && len > 0) {
                    i = len % g1 || g1;
                    intPart = intDigits.substr(0, i);
                    for(; i < len; i += g1)intPart += groupSeparator + intDigits.substr(i, g1);
                    if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
                    if (isNeg) intPart = '-' + intPart;
                }
                str = fractionPart ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize) ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'), '$&' + (format.fractionGroupSeparator || '')) : fractionPart) : intPart;
            }
            return (format.prefix || '') + str + (format.suffix || '');
        };
        /*
     * Return an array of two BigNumbers representing the value of this BigNumber as a simple
     * fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to the specified
     * maximum denominator. If a maximum denominator is not specified, the denominator will be
     * the lowest value necessary to represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */ P.toFraction = function(md) {
            var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
            if (md != null) {
                n = new BigNumber(md);
                // Throw if md is less than one or is not an integer, unless it is Infinity.
                if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
                    throw Error(bignumberError + 'Argument ' + (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
                }
            }
            if (!xc) return new BigNumber(x);
            d = new BigNumber(ONE);
            n1 = d0 = new BigNumber(ONE);
            d1 = n0 = new BigNumber(ONE);
            s = coeffToString(xc);
            // Determine initial denominator.
            // d is a power of 10 and the minimum max denominator that specifies the value exactly.
            e = d.e = s.length - x.e - 1;
            d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
            md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
            exp = MAX_EXP;
            MAX_EXP = 1 / 0;
            n = new BigNumber(s);
            // n0 = d1 = 0
            n0.c[0] = 0;
            for(;;){
                q = div(n, d, 0, 1);
                d2 = d0.plus(q.times(d1));
                if (d2.comparedTo(md) == 1) break;
                d0 = d1;
                d1 = d2;
                n1 = n0.plus(q.times(d2 = n1));
                n0 = d2;
                d = n.minus(q.times(d2 = d));
                n = d2;
            }
            d2 = div(md.minus(d0), d1, 0, 1);
            n0 = n0.plus(d2.times(n1));
            d0 = d0.plus(d2.times(d1));
            n0.s = n1.s = x.s;
            e = e * 2;
            // Determine which fraction is closer to x, n0/d0 or n1/d1
            r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [
                n1,
                d1
            ] : [
                n0,
                d0
            ];
            MAX_EXP = exp;
            return r;
        };
        /*
     * Return the value of this BigNumber converted to a number primitive.
     */ P.toNumber = function() {
            return +valueOf(this);
        };
        /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */ P.toPrecision = function(sd, rm) {
            if (sd != null) intCheck(sd, 1, MAX);
            return format(this, sd, rm, 2);
        };
        /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */ P.toString = function(b) {
            var str, n = this, s = n.s, e = n.e;
            // Infinity or NaN?
            if (e === null) {
                if (s) {
                    str = 'Infinity';
                    if (s < 0) str = '-' + str;
                } else {
                    str = 'NaN';
                }
            } else {
                if (b == null) {
                    str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, '0');
                } else if (b === 10 && alphabetHasNormalDecimalDigits) {
                    n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
                    str = toFixedPoint(coeffToString(n.c), n.e, '0');
                } else {
                    intCheck(b, 2, ALPHABET.length, 'Base');
                    str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
                }
                if (s < 0 && n.c[0]) str = '-' + str;
            }
            return str;
        };
        /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */ P.valueOf = P.toJSON = function() {
            return valueOf(this);
        };
        P._isBigNumber = true;
        if (configObject != null) BigNumber.set(configObject);
        return BigNumber;
    }
    // PRIVATE HELPER FUNCTIONS
    // These functions don't need access to variables,
    // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.
    function bitFloor(n) {
        var i = n | 0;
        return n > 0 || n === i ? i : i - 1;
    }
    // Return a coefficient array as a string of base 10 digits.
    function coeffToString(a) {
        var s, z, i = 1, j = a.length, r = a[0] + '';
        for(; i < j;){
            s = a[i++] + '';
            z = LOG_BASE - s.length;
            for(; z--; s = '0' + s);
            r += s;
        }
        // Determine trailing zeros.
        for(j = r.length; r.charCodeAt(--j) === 48;);
        return r.slice(0, j + 1 || 1);
    }
    // Compare the value of BigNumbers x and y.
    function compare(x, y) {
        var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
        // Either NaN?
        if (!i || !j) return null;
        a = xc && !xc[0];
        b = yc && !yc[0];
        // Either zero?
        if (a || b) return a ? b ? 0 : -j : i;
        // Signs differ?
        if (i != j) return i;
        a = i < 0;
        b = k == l;
        // Either Infinity?
        if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;
        // Compare exponents.
        if (!b) return k > l ^ a ? 1 : -1;
        j = (k = xc.length) < (l = yc.length) ? k : l;
        // Compare digit by digit.
        for(i = 0; i < j; i++)if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;
        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
    }
    /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */ function intCheck(n, min, max, name) {
        if (n < min || n > max || n !== mathfloor(n)) {
            throw Error(bignumberError + (name || 'Argument') + (typeof n == 'number' ? n < min || n > max ? ' out of range: ' : ' not an integer: ' : ' not a primitive number: ') + String(n));
        }
    }
    // Assumes finite n.
    function isOdd(n) {
        var k = n.c.length - 1;
        return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
    }
    function toExponential(str, e) {
        return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) + (e < 0 ? 'e' : 'e+') + e;
    }
    function toFixedPoint(str, e, z) {
        var len, zs;
        // Negative exponent?
        if (e < 0) {
            // Prepend zeros.
            for(zs = z + '.'; ++e; zs += z);
            str = zs + str;
        // Positive exponent
        } else {
            len = str.length;
            // Append zeros.
            if (++e > len) {
                for(zs = z, e -= len; --e; zs += z);
                str += zs;
            } else if (e < len) {
                str = str.slice(0, e) + '.' + str.slice(e);
            }
        }
        return str;
    }
    // EXPORT
    BigNumber = clone();
    BigNumber['default'] = BigNumber.BigNumber = BigNumber;
    // AMD.
    if (typeof define == 'function' && define.amd) {
        ((r)=>r !== undefined && __turbopack_context__.v(r))(function() {
            return BigNumber;
        }(__turbopack_context__.r, exports, module));
    // Node.js and other environments that support module.exports.
    } else if (("TURBOPACK compile-time value", "object") != 'undefined' && module.exports) {
        module.exports = BigNumber;
    // Browser.
    } else {
        if (!globalObject) {
            globalObject = typeof self != 'undefined' && self ? self : window;
        }
        globalObject.BigNumber = BigNumber;
    }
})(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/buffer-equal-constant-time/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*jshint node:true */ var Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer; // browserify
var SlowBuffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").SlowBuffer;
module.exports = bufferEq;
function bufferEq(a, b) {
    // shortcutting on type is necessary for correctness
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        return false;
    }
    // buffer sizes should be well-known information, so despite this
    // shortcutting, it doesn't leak any information about the *contents* of the
    // buffers.
    if (a.length !== b.length) {
        return false;
    }
    var c = 0;
    for(var i = 0; i < a.length; i++){
        /*jshint bitwise:false */ c |= a[i] ^ b[i]; // XOR
    }
    return c === 0;
}
bufferEq.install = function() {
    Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
    };
};
var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function() {
    Buffer.prototype.equal = origBufEqual;
    SlowBuffer.prototype.equal = origSlowBufEqual;
};
}),
"[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* eslint-env browser */ /**
 * This is the web browser implementation of `debug()`.
 */ exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (()=>{
    let warned = false;
    return ()=>{
        if (!warned) {
            warned = true;
            console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
        }
    };
})();
/**
 * Colors.
 */ exports.colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33'
];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */ // eslint-disable-next-line complexity
function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
    }
    let m;
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    // eslint-disable-next-line no-return-assign
    return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
    if (!this.useColors) {
        return;
    }
    const c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');
    // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match)=>{
        if (match === '%%') {
            return;
        }
        index++;
        if (match === '%c') {
            // We only are interested in the *last* %c
            // (the user may have provided their own)
            lastC = index;
        }
    });
    args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */ exports.log = console.debug || console.log || (()=>{});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    try {
        if (namespaces) {
            exports.storage.setItem('debug', namespaces);
        } else {
            exports.storage.removeItem('debug');
        }
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    let r;
    try {
        r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG');
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
    }
    return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */ function localstorage() {
    try {
        // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
        // The Browser also has localStorage in the global context.
        return localStorage;
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */ formatters.j = function(v) {
    try {
        return JSON.stringify(v);
    } catch (error) {
        return '[UnexpectedJSONParseError]: ' + error.message;
    }
};
}),
"[project]/node_modules/debug/src/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */ function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = __turbopack_context__.r("[project]/node_modules/ms/index.js [app-route] (ecmascript)");
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key)=>{
        createDebug[key] = env[key];
    });
    /**
	* The currently active debug mode names, and names to skip.
	*/ createDebug.names = [];
    createDebug.skips = [];
    /**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/ createDebug.formatters = {};
    /**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/ function selectColor(namespace) {
        let hash = 0;
        for(let i = 0; i < namespace.length; i++){
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    /**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/ function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
            // Disabled?
            if (!debug.enabled) {
                return;
            }
            const self = debug;
            // Set `diff` timestamp
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== 'string') {
                // Anything else let's inspect with %O
                args.unshift('%O');
            }
            // Apply any `formatters` transformations
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format)=>{
                // If we encounter an escaped % then don't increase the array index
                if (match === '%%') {
                    return '%';
                }
                index++;
                const formatter = createDebug.formatters[format];
                if (typeof formatter === 'function') {
                    const val = args[index];
                    match = formatter.call(self, val);
                    // Now we need to remove `args[index]` since it's inlined in the `format`
                    args.splice(index, 1);
                    index--;
                }
                return match;
            });
            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            const logFn = self.log || createDebug.log;
            logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.
        Object.defineProperty(debug, 'enabled', {
            enumerable: true,
            configurable: false,
            get: ()=>{
                if (enableOverride !== null) {
                    return enableOverride;
                }
                if (namespacesCache !== createDebug.namespaces) {
                    namespacesCache = createDebug.namespaces;
                    enabledCache = createDebug.enabled(namespace);
                }
                return enabledCache;
            },
            set: (v)=>{
                enableOverride = v;
            }
        });
        // Env-specific initialization logic for debug instances
        if (typeof createDebug.init === 'function') {
            createDebug.init(debug);
        }
        return debug;
    }
    function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
    }
    /**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/ function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === 'string' ? namespaces : '').trim().replace(/\s+/g, ',').split(',').filter(Boolean);
        for (const ns of split){
            if (ns[0] === '-') {
                createDebug.skips.push(ns.slice(1));
            } else {
                createDebug.names.push(ns);
            }
        }
    }
    /**
	 * Checks if the given string matches a namespace template, honoring
	 * asterisks as wildcards.
	 *
	 * @param {String} search
	 * @param {String} template
	 * @return {Boolean}
	 */ function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while(searchIndex < search.length){
            if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
                // Match character or proceed with wildcard
                if (template[templateIndex] === '*') {
                    starIndex = templateIndex;
                    matchIndex = searchIndex;
                    templateIndex++; // Skip the '*'
                } else {
                    searchIndex++;
                    templateIndex++;
                }
            } else if (starIndex !== -1) {
                // Backtrack to the last '*' and try to match more characters
                templateIndex = starIndex + 1;
                matchIndex++;
                searchIndex = matchIndex;
            } else {
                return false; // No match
            }
        }
        // Handle trailing '*' in template
        while(templateIndex < template.length && template[templateIndex] === '*'){
            templateIndex++;
        }
        return templateIndex === template.length;
    }
    /**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/ function disable() {
        const namespaces = [
            ...createDebug.names,
            ...createDebug.skips.map((namespace)=>'-' + namespace)
        ].join(',');
        createDebug.enable('');
        return namespaces;
    }
    /**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/ function enabled(name) {
        for (const skip of createDebug.skips){
            if (matchesTemplate(name, skip)) {
                return false;
            }
        }
        for (const ns of createDebug.names){
            if (matchesTemplate(name, ns)) {
                return true;
            }
        }
        return false;
    }
    /**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/ function coerce(val) {
        if (val instanceof Error) {
            return val.stack || val.message;
        }
        return val;
    }
    /**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/ function destroy() {
        console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
    createDebug.enable(createDebug.load());
    return createDebug;
}
module.exports = setup;
}),
"[project]/node_modules/debug/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */ if (typeof process === 'undefined' || process.type === 'renderer' || ("TURBOPACK compile-time value", false) === true || process.__nwjs) {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)");
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/node.js [app-route] (ecmascript)");
}
}),
"[project]/node_modules/debug/src/node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Module dependencies.
 */ const tty = __turbopack_context__.r("[externals]/tty [external] (tty, cjs)");
const util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
/**
 * This is the Node.js implementation of `debug()`.
 */ exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(()=>{}, 'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
/**
 * Colors.
 */ exports.colors = [
    6,
    2,
    3,
    4,
    5,
    1
];
try {
    // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
    // eslint-disable-next-line import/no-extraneous-dependencies
    const supportsColor = (()=>{
        const e = new Error("Cannot find module 'supports-color'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    })();
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221
        ];
    }
} catch (error) {
// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}
/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */ exports.inspectOpts = Object.keys(process.env).filter((key)=>{
    return /^debug_/i.test(key);
}).reduce((obj, key)=>{
    // Camel-case
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k)=>{
        return k.toUpperCase();
    });
    // Coerce string value into JS value
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
    } else if (val === 'null') {
        val = null;
    } else {
        val = Number(val);
    }
    obj[prop] = val;
    return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */ function useColors() {
    return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    const { namespace: name, useColors } = this;
    if (useColors) {
        const c = this.color;
        const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
        const prefix = `  ${colorCode};1m${name} \u001B[0m`;
        args[0] = prefix + args[0].split('\n').join('\n' + prefix);
        args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
    } else {
        args[0] = getDate() + name + ' ' + args[0];
    }
}
function getDate() {
    if (exports.inspectOpts.hideDate) {
        return '';
    }
    return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
 */ function log(...args) {
    return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    if (namespaces) {
        process.env.DEBUG = namespaces;
    } else {
        // If you set a process.env field to null or undefined, it gets cast to the
        // string 'null' or 'undefined'. Just delete instead.
        delete process.env.DEBUG;
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */ function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for(let i = 0; i < keys.length; i++){
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */ formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split('\n').map((str)=>str.trim()).join(' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */ formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
};
}),
"[project]/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var getParamBytesForAlg = __turbopack_context__.r("[project]/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js [app-route] (ecmascript)");
var MAX_OCTET = 0x80, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 0x20, TAG_SEQ = 0x10, TAG_INT = 0x02, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
function base64Url(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function signatureAsBuffer(signature) {
    if (Buffer.isBuffer(signature)) {
        return signature;
    } else if ('string' === typeof signature) {
        return Buffer.from(signature, 'base64');
    }
    throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
}
function derToJose(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    // the DER encoded param should at most be the param size, plus a padding
    // zero, since due to being a signed integer
    var maxEncodedParamLength = paramBytes + 1;
    var inputLength = signature.length;
    var offset = 0;
    if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
    }
    var seqLength = signature[offset++];
    if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
    }
    if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
    }
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
    }
    var rLength = signature[offset++];
    if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
    }
    if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var rOffset = offset;
    offset += rLength;
    if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
    }
    var sLength = signature[offset++];
    if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
    }
    if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    }
    var sOffset = offset;
    offset += sLength;
    if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
    }
    var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
    var dst = Buffer.allocUnsafe(rPadding + rLength + sPadding + sLength);
    for(offset = 0; offset < rPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
    offset = paramBytes;
    for(var o = offset; offset < o + sPadding; ++offset){
        dst[offset] = 0;
    }
    signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
    dst = dst.toString('base64');
    dst = base64Url(dst);
    return dst;
}
function countPadding(buf, start, stop) {
    var padding = 0;
    while(start + padding < stop && buf[start + padding] === 0){
        ++padding;
    }
    var needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign) {
        --padding;
    }
    return padding;
}
function joseToDer(signature, alg) {
    signature = signatureAsBuffer(signature);
    var paramBytes = getParamBytesForAlg(alg);
    var signatureBytes = signature.length;
    if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
    }
    var rPadding = countPadding(signature, 0, paramBytes);
    var sPadding = countPadding(signature, paramBytes, signature.length);
    var rLength = paramBytes - rPadding;
    var sLength = paramBytes - sPadding;
    var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
    var shortLength = rsBytes < MAX_OCTET;
    var dst = Buffer.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
    var offset = 0;
    dst[offset++] = ENCODED_TAG_SEQ;
    if (shortLength) {
        // Bit 8 has value "0"
        // bits 7-1 give the length.
        dst[offset++] = rsBytes;
    } else {
        // Bit 8 of first octet has value "1"
        // bits 7-1 give the number of additional length octets.
        dst[offset++] = MAX_OCTET | 1;
        // length, base 256
        dst[offset++] = rsBytes & 0xff;
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = rLength;
    if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
    } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
    }
    dst[offset++] = ENCODED_TAG_INT;
    dst[offset++] = sLength;
    if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
    } else {
        signature.copy(dst, offset, paramBytes + sPadding);
    }
    return dst;
}
module.exports = {
    derToJose: derToJose,
    joseToDer: joseToDer
};
}),
"[project]/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function getParamSize(keySize) {
    var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
    return result;
}
var paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521)
};
function getParamBytesForAlg(alg) {
    var paramBytes = paramBytesForAlg[alg];
    if (paramBytes) {
        return paramBytes;
    }
    throw new Error('Unknown algorithm "' + alg + '"');
}
module.exports = getParamBytesForAlg;
}),
"[project]/node_modules/extend/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;
var isArray = function isArray(arr) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    }
    return toStr.call(arr) === '[object Array]';
};
var isPlainObject = function isPlainObject(obj) {
    if (!obj || toStr.call(obj) !== '[object Object]') {
        return false;
    }
    var hasOwnConstructor = hasOwn.call(obj, 'constructor');
    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    // Not own constructor property must be Object
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
    }
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for(key in obj){}
    return typeof key === 'undefined' || hasOwn.call(obj, key);
};
// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
    if (defineProperty && options.name === '__proto__') {
        defineProperty(target, options.name, {
            enumerable: true,
            configurable: true,
            value: options.newValue,
            writable: true
        });
    } else {
        target[options.name] = options.newValue;
    }
};
// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
    if (name === '__proto__') {
        if (!hasOwn.call(obj, name)) {
            return void 0;
        } else if (gOPD) {
            // In early versions of node, obj['__proto__'] is buggy when obj has
            // __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
            return gOPD(obj, name).value;
        }
    }
    return obj[name];
};
module.exports = function extend() {
    var options, name, src, copy, copyIsArray, clone;
    var target = arguments[0];
    var i = 1;
    var length = arguments.length;
    var deep = false;
    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }
    if (target == null || typeof target !== 'object' && typeof target !== 'function') {
        target = {};
    }
    for(; i < length; ++i){
        options = arguments[i];
        // Only deal with non-null/undefined values
        if (options != null) {
            // Extend the base object
            for(name in options){
                src = getProperty(target, name);
                copy = getProperty(options, name);
                // Prevent never-ending loop
                if (target !== copy) {
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        // Never move original objects, clone them
                        setProperty(target, {
                            name: name,
                            newValue: extend(deep, clone, copy)
                        });
                    // Don't bring in undefined values
                    } else if (typeof copy !== 'undefined') {
                        setProperty(target, {
                            name: name,
                            newValue: copy
                        });
                    }
                }
            }
        }
    }
    // Return the modified object
    return target;
};
}),
"[project]/node_modules/fast-deep-equal/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// do not edit .js files directly - edit src/index.jst
module.exports = function equal(a, b) {
    if (a === b) return true;
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length) return false;
            for(i = length; i-- !== 0;)if (!equal(a[i], b[i])) return false;
            return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for(i = length; i-- !== 0;)if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for(i = length; i-- !== 0;){
            var key = keys[i];
            if (!equal(a[key], b[key])) return false;
        }
        return true;
    }
    // true if both NaN, false otherwise
    return a !== a && b !== b;
};
}),
"[project]/node_modules/gcp-metadata/build/src/gcp-residency.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GCE_LINUX_BIOS_PATHS = void 0;
exports.isGoogleCloudServerless = isGoogleCloudServerless;
exports.isGoogleComputeEngineLinux = isGoogleComputeEngineLinux;
exports.isGoogleComputeEngineMACAddress = isGoogleComputeEngineMACAddress;
exports.isGoogleComputeEngine = isGoogleComputeEngine;
exports.detectGCPResidency = detectGCPResidency;
const fs_1 = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const os_1 = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
/**
 * Known paths unique to Google Compute Engine Linux instances
 */ exports.GCE_LINUX_BIOS_PATHS = {
    BIOS_DATE: '/sys/class/dmi/id/bios_date',
    BIOS_VENDOR: '/sys/class/dmi/id/bios_vendor'
};
const GCE_MAC_ADDRESS_REGEX = /^42:01/;
/**
 * Environment variables used to detect Google Cloud Serverless environments
 * (Cloud Run Services, Cloud Run Jobs, Cloud Run Worker Pools, and Cloud Functions).
 */ const SERVERLESS_ENV_VARS = [
    'CLOUD_RUN_JOB',
    'FUNCTION_NAME',
    'K_SERVICE',
    'CLOUD_RUN_WORKER_POOL'
];
/**
 * Determines if the process is running on a Google Cloud Serverless environment
 * (Cloud Run Services/Jobs/Worker Pools or Cloud Functions).
 *
 * Environment variables checked:
 * - `CLOUD_RUN_JOB` is used for Cloud Run Jobs:
 *   {@link https://cloud.google.com/run/docs/container-contract#env-vars Cloud Run environment variables}.
 * - `FUNCTION_NAME` is used in older Cloud Functions environments:
 *   {@link https://cloud.google.com/functions/docs/env-var Python 3.7 and Go 1.11}.
 * - `K_SERVICE` is used in Cloud Run and newer Cloud Functions environments:
 *   {@link https://cloud.google.com/run/docs/container-contract#env-vars Cloud Run environment variables},
 *   {@link https://cloud.google.com/functions/docs/env-var Cloud Functions newer runtimes}.
 * - `CLOUD_RUN_WORKER_POOL` is used in Cloud Run Worker Pools:
 *   {@link https://cloud.google.com/run/docs/container-contract#env-vars Cloud Run environment variables},
 *   {@link https://cloud.google.com/run/docs/deploy-worker-pools Deploy Worker Pools to Cloud Run}.
 *
 * @returns {boolean} `true` if the process is running on GCP serverless, `false` otherwise.
 */ function isGoogleCloudServerless() {
    return SERVERLESS_ENV_VARS.some((key)=>Boolean(process.env[key]));
}
/**
 * Determines if the process is running on a Linux Google Compute Engine instance.
 *
 * @returns {boolean} `true` if the process is running on Linux GCE, `false` otherwise.
 */ function isGoogleComputeEngineLinux() {
    if ((0, os_1.platform)() !== 'linux') //TURBOPACK unreachable
    ;
    try {
        // ensure this file exist
        (0, fs_1.statSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
        // ensure this file exist and matches
        const biosVendor = (0, fs_1.readFileSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, 'utf8');
        return /Google/.test(biosVendor);
    } catch  {
        return false;
    }
}
/**
 * Determines if the process is running on a Google Compute Engine instance with a known
 * MAC address.
 *
 * @returns {boolean} `true` if the process is running on GCE (as determined by MAC address), `false` otherwise.
 */ function isGoogleComputeEngineMACAddress() {
    const interfaces = (0, os_1.networkInterfaces)();
    for (const item of Object.values(interfaces)){
        if (!item) continue;
        for (const { mac } of item){
            if (GCE_MAC_ADDRESS_REGEX.test(mac)) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Determines if the process is running on a Google Compute Engine instance.
 *
 * @returns {boolean} `true` if the process is running on GCE, `false` otherwise.
 */ function isGoogleComputeEngine() {
    return isGoogleComputeEngineLinux() || isGoogleComputeEngineMACAddress();
}
/**
 * Determines if the process is running on Google Cloud Platform.
 *
 * @returns {boolean} `true` if the process is running on GCP, `false` otherwise.
 */ function detectGCPResidency() {
    return isGoogleCloudServerless() || isGoogleComputeEngine();
}
}),
"[project]/node_modules/gcp-metadata/build/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gcpResidencyCache = exports.METADATA_SERVER_DETECTION = exports.HEADERS = exports.HEADER_VALUE = exports.HEADER_NAME = exports.SECONDARY_HOST_ADDRESS = exports.HOST_ADDRESS = exports.BASE_PATH = void 0;
exports.instance = instance;
exports.project = project;
exports.universe = universe;
exports.bulk = bulk;
exports.isAvailable = isAvailable;
exports.resetIsAvailableCache = resetIsAvailableCache;
exports.getGCPResidency = getGCPResidency;
exports.setGCPResidency = setGCPResidency;
exports.requestTimeout = requestTimeout;
/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const gaxios_1 = __turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/index.js [app-route] (ecmascript)");
const jsonBigint = __turbopack_context__.r("[project]/node_modules/json-bigint/index.js [app-route] (ecmascript)");
const gcp_residency_1 = __turbopack_context__.r("[project]/node_modules/gcp-metadata/build/src/gcp-residency.js [app-route] (ecmascript)");
const logger = __importStar(__turbopack_context__.r("[project]/node_modules/google-logging-utils/build/src/index.js [app-route] (ecmascript)"));
exports.BASE_PATH = '/computeMetadata/v1';
exports.HOST_ADDRESS = 'http://169.254.169.254';
exports.SECONDARY_HOST_ADDRESS = 'http://metadata.google.internal.';
exports.HEADER_NAME = 'Metadata-Flavor';
exports.HEADER_VALUE = 'Google';
exports.HEADERS = Object.freeze({
    [exports.HEADER_NAME]: exports.HEADER_VALUE
});
const log = logger.log('gcp-metadata');
/**
 * Metadata server detection override options.
 *
 * Available via `process.env.METADATA_SERVER_DETECTION`.
 */ exports.METADATA_SERVER_DETECTION = Object.freeze({
    'assume-present': "don't try to ping the metadata server, but assume it's present",
    none: "don't try to ping the metadata server, but don't try to use it either",
    'bios-only': "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
    'ping-only': 'skip the BIOS probe, and go straight to pinging'
});
/**
 * Returns the base URL while taking into account the GCE_METADATA_HOST
 * environment variable if it exists.
 *
 * @returns The base URL, e.g., http://169.254.169.254/computeMetadata/v1.
 */ function getBaseUrl(baseUrl) {
    if (!baseUrl) {
        baseUrl = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || exports.HOST_ADDRESS;
    }
    // If no scheme is provided default to HTTP:
    if (!/^https?:\/\//.test(baseUrl)) {
        baseUrl = `http://${baseUrl}`;
    }
    return new URL(exports.BASE_PATH, baseUrl).href;
}
// Accepts an options object passed from the user to the API. In previous
// versions of the API, it referred to a `Request` or an `Axios` request
// options object.  Now it refers to an object with very limited property
// names. This is here to help ensure users don't pass invalid options when
// they  upgrade from 0.4 to 0.5 to 0.8.
function validate(options) {
    Object.keys(options).forEach((key)=>{
        switch(key){
            case 'params':
            case 'property':
            case 'headers':
                break;
            case 'qs':
                throw new Error("'qs' is not a valid configuration option. Please use 'params' instead.");
            default:
                throw new Error(`'${key}' is not a valid configuration option.`);
        }
    });
}
async function metadataAccessor(type, options = {}, noResponseRetries = 3, fastFail = false) {
    const headers = new Headers(exports.HEADERS);
    let metadataKey = '';
    let params = {};
    if (typeof type === 'object') {
        const metadataAccessor = type;
        new Headers(metadataAccessor.headers).forEach((value, key)=>headers.set(key, value));
        metadataKey = metadataAccessor.metadataKey;
        params = metadataAccessor.params || params;
        noResponseRetries = metadataAccessor.noResponseRetries || noResponseRetries;
        fastFail = metadataAccessor.fastFail || fastFail;
    } else {
        metadataKey = type;
    }
    if (typeof options === 'string') {
        metadataKey += `/${options}`;
    } else {
        validate(options);
        if (options.property) {
            metadataKey += `/${options.property}`;
        }
        new Headers(options.headers).forEach((value, key)=>headers.set(key, value));
        params = options.params || params;
    }
    const requestMethod = fastFail ? fastFailMetadataRequest : gaxios_1.request;
    const req = {
        url: `${getBaseUrl()}/${metadataKey}`,
        headers,
        retryConfig: {
            noResponseRetries
        },
        params,
        responseType: 'text',
        timeout: requestTimeout()
    };
    log.debug('instance request %j', req);
    const res = await requestMethod(req);
    log.debug('instance metadata is %s', res.data);
    const metadataFlavor = res.headers.get(exports.HEADER_NAME);
    if (metadataFlavor !== exports.HEADER_VALUE) {
        throw new RangeError(`Invalid response from metadata service: incorrect ${exports.HEADER_NAME} header. Expected '${exports.HEADER_VALUE}', got ${metadataFlavor ? `'${metadataFlavor}'` : 'no header'}`);
    }
    if (typeof res.data === 'string') {
        try {
            return jsonBigint.parse(res.data);
        } catch  {
        /* ignore */ }
    }
    return res.data;
}
async function fastFailMetadataRequest(options) {
    const secondaryOptions = {
        ...options,
        url: options.url?.toString().replace(getBaseUrl(), getBaseUrl(exports.SECONDARY_HOST_ADDRESS))
    };
    // We race a connection between DNS/IP to metadata server. There are a couple
    // reasons for this:
    //
    // 1. the DNS is slow in some GCP environments; by checking both, we might
    //    detect the runtime environment significantly faster.
    // 2. we can't just check the IP, which is tarpitted and slow to respond
    //    on a user's local machine.
    //
    // Returns first resolved promise or if all promises get rejected we return an AggregateError.
    //
    // Note, however, if a failure happens prior to a success, a rejection should
    // occur, this is for folks running locally.
    //
    const r1 = (0, gaxios_1.request)(options);
    const r2 = (0, gaxios_1.request)(secondaryOptions);
    try {
        return await Promise.any([
            r1,
            r2
        ]);
    } catch (err) {
        // Per ECMA-262 (PerformPromiseAny), Promise.any constructs AggregateError
        // without a message argument, so err.message defaults to '' in Bun
        // (JavaScriptCore), whereas Node.js (V8) sets 'All promises were rejected'.
        // Backfill 'All promises were rejected' so Bun matches Node.js behavior
        // (including MetadataLookupWarning output and test expectations).
        if (err instanceof AggregateError && !err.message) {
            err.message = 'All promises were rejected';
        }
        throw err;
    }
}
/**
 * Obtain metadata for the current GCE instance.
 *
 * @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
 *
 * @example
 * ```
 * const serviceAccount: {} = await instance('service-accounts/');
 * const serviceAccountEmail: string = await instance('service-accounts/default/email');
 * ```
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function instance(options) {
    return metadataAccessor('instance', options);
}
/**
 * Obtain metadata for the current GCP project.
 *
 * @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
 *
 * @example
 * ```
 * const projectId: string = await project('project-id');
 * const numericProjectId: number = await project('numeric-project-id');
 * ```
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function project(options) {
    return metadataAccessor('project', options);
}
/**
 * Obtain metadata for the current universe.
 *
 * @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
 *
 * @example
 * ```
 * const universeDomain: string = await universe('universe-domain');
 * ```
 */ function universe(options) {
    return metadataAccessor('universe', options);
}
/**
 * Retrieve metadata items in parallel.
 *
 * @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
 *
 * @example
 * ```
 * const data = await bulk([
 *   {
 *     metadataKey: 'instance',
 *   },
 *   {
 *     metadataKey: 'project/project-id',
 *   },
 * ] as const);
 *
 * // data.instance;
 * // data['project/project-id'];
 * ```
 *
 * @param properties The metadata properties to retrieve
 * @returns The metadata in `metadatakey:value` format
 */ async function bulk(properties) {
    const r = {};
    await Promise.all(properties.map((item)=>{
        return (async ()=>{
            const res = await metadataAccessor(item);
            const key = item.metadataKey;
            r[key] = res;
        })();
    }));
    return r;
}
/*
 * How many times should we retry detecting GCP environment.
 */ function detectGCPAvailableRetries() {
    return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0;
}
let cachedIsAvailableResponse;
const EXPECTED_NETWORK_ERROR_CODES = new Set([
    'EHOSTDOWN',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'ENOENT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'ConnectionRefused',
    'FailedToOpenSocket'
]);
const TIMEOUT_NAMES_AND_CODES = new Set([
    'AbortError',
    'TimeoutError'
]);
const TIMEOUT_TYPES = new Set([
    'aborted',
    'request-timeout'
]);
const MAX_ERROR_DEPTH = 20;
function isErrorWithDetails(val) {
    return typeof val === 'object' && val !== null;
}
/**
 * Recursively extracts and normalizes POSIX/network error codes from potentially
 * nested Error objects (`AggregateError.errors` from `Promise.any`, `.cause`, `.error`).
 * Guards against circular references and deep recursion.
 */ function getErrorCodes(err, visited = new Set(), depth = 0) {
    if (!isErrorWithDetails(err) || visited.has(err) || depth > MAX_ERROR_DEPTH) {
        return [
            'UNKNOWN'
        ];
    }
    visited.add(err);
    if (err.name === 'AggregateError' && Array.isArray(err.errors)) {
        if (err.errors.length === 0) {
            return [
                'UNKNOWN'
            ];
        }
        return err.errors.flatMap((subErr)=>getErrorCodes(subErr, visited, depth + 1));
    }
    if (err.name !== undefined && TIMEOUT_NAMES_AND_CODES.has(err.name) || err.code !== undefined && TIMEOUT_NAMES_AND_CODES.has(err.code) || err.type !== undefined && TIMEOUT_TYPES.has(err.type)) {
        return [
            'ETIMEDOUT'
        ];
    }
    if ((typeof err.code === 'string' || typeof err.code === 'number') && err.code !== '') {
        return [
            String(err.code)
        ];
    }
    const nested = err.cause ?? err.error;
    if (nested !== undefined) {
        return getErrorCodes(nested, visited, depth + 1);
    }
    return [
        'UNKNOWN'
    ];
}
/**
 * Determine if the metadata server is currently available.
 */ async function isAvailable() {
    if (process.env.METADATA_SERVER_DETECTION) {
        const value = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
        if (!(value in exports.METADATA_SERVER_DETECTION)) {
            throw new RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${value}\`, but it should be \`${Object.keys(exports.METADATA_SERVER_DETECTION).join('`, `')}\`, or unset`);
        }
        switch(value){
            case 'assume-present':
                return true;
            case 'none':
                return false;
            case 'bios-only':
                return getGCPResidency();
            case 'ping-only':
        }
    }
    try {
        // If a user is instantiating several GCP libraries at the same time,
        // this may result in multiple calls to isAvailable(), to detect the
        // runtime environment. We use the same promise for each of these calls
        // to reduce the network load.
        if (cachedIsAvailableResponse === undefined) {
            cachedIsAvailableResponse = (async ()=>{
                try {
                    await metadataAccessor('instance', undefined, detectGCPAvailableRetries(), // If the default HOST_ADDRESS has been overridden, we should not
                    // make an effort to try SECONDARY_HOST_ADDRESS (as we are likely in
                    // a non-GCP environment):
                    !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
                    return true;
                } catch (e) {
                    if (process.env.DEBUG_AUTH) {
                        console.info(e);
                    }
                    if (!isErrorWithDetails(e)) {
                        process.emitWarning(`received unexpected error = ${String(e)} code = UNKNOWN`, 'MetadataLookupWarning');
                        return false;
                    }
                    if (e.type === 'request-timeout' || e.response?.status === 404) {
                        // If running in a GCP environment, metadata endpoint should return
                        // within ms.
                        return false;
                    }
                    const codes = getErrorCodes(e);
                    const isExpected = codes.length > 0 && codes.every((code)=>EXPECTED_NETWORK_ERROR_CODES.has(code));
                    if (!isExpected) {
                        const code = [
                            ...new Set(codes)
                        ].join(', ');
                        process.emitWarning(`received unexpected error = ${e.message} code = ${code}`, 'MetadataLookupWarning');
                    }
                    // Failure to resolve the metadata service means that it is not available.
                    return false;
                }
            })();
        }
        return await cachedIsAvailableResponse;
    } catch (e) {
        // This block should technically not be reached because the async IIFE catches its own errors
        return false;
    }
}
/**
 * reset the memoized isAvailable() lookup.
 */ function resetIsAvailableCache() {
    cachedIsAvailableResponse = undefined;
}
/**
 * A cache for the detected GCP Residency.
 */ exports.gcpResidencyCache = null;
/**
 * Detects GCP Residency.
 * Caches results to reduce costs for subsequent calls.
 *
 * @see setGCPResidency for setting
 */ function getGCPResidency() {
    if (exports.gcpResidencyCache === null) {
        setGCPResidency();
    }
    return exports.gcpResidencyCache;
}
/**
 * Sets the detected GCP Residency.
 * Useful for forcing metadata server detection behavior.
 *
 * Set `null` to autodetect the environment (default behavior).
 * @see getGCPResidency for getting
 */ function setGCPResidency(value = null) {
    exports.gcpResidencyCache = value !== null ? value : (0, gcp_residency_1.detectGCPResidency)();
}
/**
 * Obtain the timeout for requests to the metadata server.
 *
 * In certain environments and conditions requests can take longer than
 * the default timeout to complete. This function will determine the
 * appropriate timeout based on the environment.
 *
 * @returns {number} a request timeout duration in milliseconds.
 */ function requestTimeout() {
    return getGCPResidency() ? 0 : 3000;
}
__exportStar(__turbopack_context__.r("[project]/node_modules/gcp-metadata/build/src/gcp-residency.js [app-route] (ecmascript)"), exports);
}),
"[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GaxiosError = exports.GAXIOS_ERROR_SYMBOL = void 0;
exports.defaultErrorRedactor = defaultErrorRedactor;
const extend_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/extend/index.js [app-route] (ecmascript)"));
const util_cjs_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/util.cjs [app-route] (ecmascript)"));
const pkg = util_cjs_1.default.pkg;
/**
 * Support `instanceof` operator for `GaxiosError`s in different versions of this library.
 *
 * @see {@link GaxiosError[Symbol.hasInstance]}
 */ exports.GAXIOS_ERROR_SYMBOL = Symbol.for(`${pkg.name}-gaxios-error`);
class GaxiosError extends Error {
    config;
    response;
    /**
     * An error code.
     * Can be a system error code, DOMException error name, or any error's 'code' property where it is a `string`.
     *
     * It is only a `number` when the cause is sourced from an API-level error (AIP-193).
     *
     * @see {@link https://nodejs.org/api/errors.html#errorcode error.code}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMException#error_names DOMException#error_names}
     * @see {@link https://google.aip.dev/193#http11json-representation AIP-193}
     *
     * @example
     * 'ECONNRESET'
     *
     * @example
     * 'TimeoutError'
     *
     * @example
     * 500
     */ code;
    /**
     * An HTTP Status code.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Response/status Response#status}
     *
     * @example
     * 500
     */ status;
    /**
     * @deprecated use {@link GaxiosError.cause} instead.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause Error#cause}
     *
     * @privateRemarks
     *
     * We will want to remove this property later as the modern `cause` property is better suited
     * for displaying and relaying nested errors. Keeping this here makes the resulting
     * error log larger than it needs to be.
     *
     */ error;
    /**
     * Support `instanceof` operator for `GaxiosError` across builds/duplicated files.
     *
     * @see {@link GAXIOS_ERROR_SYMBOL}
     * @see {@link GaxiosError[Symbol.hasInstance]}
     * @see {@link https://github.com/microsoft/TypeScript/issues/13965#issuecomment-278570200}
     * @see {@link https://stackoverflow.com/questions/46618852/require-and-instanceof}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/@@hasInstance#reverting_to_default_instanceof_behavior}
     */ [exports.GAXIOS_ERROR_SYMBOL] = pkg.version;
    /**
     * Support `instanceof` operator for `GaxiosError` across builds/duplicated files.
     *
     * @see {@link GAXIOS_ERROR_SYMBOL}
     * @see {@link GaxiosError[GAXIOS_ERROR_SYMBOL]}
     */ static [Symbol.hasInstance](instance) {
        if (instance && typeof instance === 'object' && exports.GAXIOS_ERROR_SYMBOL in instance && instance[exports.GAXIOS_ERROR_SYMBOL] === pkg.version) {
            return true;
        }
        // fallback to native
        return Function.prototype[Symbol.hasInstance].call(GaxiosError, instance);
    }
    constructor(message, config, response, cause){
        super(message, {
            cause
        });
        this.config = config;
        this.response = response;
        this.error = cause instanceof Error ? cause : undefined;
        // deep-copy config as we do not want to mutate
        // the existing config for future retries/use
        this.config = (0, extend_1.default)(true, {}, config);
        if (this.response) {
            this.response.config = (0, extend_1.default)(true, {}, this.response.config);
        }
        if (this.response) {
            try {
                this.response.data = translateData(this.config.responseType, // workaround for `node-fetch`'s `.data` deprecation...
                this.response?.bodyUsed ? this.response?.data : undefined);
            } catch  {
            // best effort - don't throw an error within an error
            // we could set `this.response.config.responseType = 'unknown'`, but
            // that would mutate future calls with this config object.
            }
            this.status = this.response.status;
        }
        if (cause instanceof DOMException) {
            // The DOMException's equivalent to code is its name
            // E.g.: name = `TimeoutError`, code = number
            // https://developer.mozilla.org/en-US/docs/Web/API/DOMException/name
            this.code = cause.name;
        } else if (cause && typeof cause === 'object' && 'code' in cause && (typeof cause.code === 'string' || typeof cause.code === 'number')) {
            this.code = cause.code;
        }
    }
    /**
     * An AIP-193 conforming error extractor.
     *
     * @see {@link https://google.aip.dev/193#http11json-representation AIP-193}
     *
     * @internal
     * @expiremental
     *
     * @param res the response object
     * @returns the extracted error information
     */ static extractAPIErrorFromResponse(res, defaultErrorMessage = 'The request failed') {
        let message = defaultErrorMessage;
        // Use res.data as the error message
        if (typeof res.data === 'string') {
            message = res.data;
        }
        if (res.data && typeof res.data === 'object' && 'error' in res.data && res.data.error && !res.ok) {
            if (typeof res.data.error === 'string') {
                return {
                    message: res.data.error,
                    code: res.status,
                    status: res.statusText
                };
            }
            if (typeof res.data.error === 'object') {
                // extract status from data.message
                message = 'message' in res.data.error && typeof res.data.error.message === 'string' ? res.data.error.message : message;
                // extract status from data.error
                const status = 'status' in res.data.error && typeof res.data.error.status === 'string' ? res.data.error.status : res.statusText;
                // extract code from data.error
                const code = 'code' in res.data.error && typeof res.data.error.code === 'number' ? res.data.error.code : res.status;
                if ('errors' in res.data.error && Array.isArray(res.data.error.errors)) {
                    const errorMessages = [];
                    for (const e of res.data.error.errors){
                        if (typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
                            errorMessages.push(e.message);
                        }
                    }
                    return Object.assign({
                        message: errorMessages.join('\n') || message,
                        code,
                        status
                    }, res.data.error);
                }
                return Object.assign({
                    message,
                    code,
                    status
                }, res.data.error);
            }
        }
        return {
            message,
            code: res.status,
            status: res.statusText
        };
    }
}
exports.GaxiosError = GaxiosError;
function translateData(responseType, data) {
    switch(responseType){
        case 'stream':
            return data;
        case 'json':
            return JSON.parse(JSON.stringify(data));
        case 'arraybuffer':
            return JSON.parse(Buffer.from(data).toString('utf8'));
        case 'blob':
            return JSON.parse(data.text());
        default:
            return data;
    }
}
/**
 * An experimental error redactor.
 *
 * @param config Config to potentially redact properties of
 * @param response Config to potentially redact properties of
 *
 * @experimental
 */ function defaultErrorRedactor(data) {
    const REDACT = '<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.';
    function redactHeaders(headers) {
        if (!headers) return;
        headers.forEach((_, key)=>{
            // any casing of `Authentication`
            // any casing of `Authorization`
            // anything containing secret, such as 'client secret'
            if (/^authentication$/i.test(key) || /^authorization$/i.test(key) || /secret/i.test(key)) headers.set(key, REDACT);
        });
    }
    function redactString(obj, key) {
        if (typeof obj === 'object' && obj !== null && typeof obj[key] === 'string') {
            const text = obj[key];
            if (/grant_type=/i.test(text) || /assertion=/i.test(text) || /secret/i.test(text)) {
                obj[key] = REDACT;
            }
        }
    }
    function redactObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return;
        } else if (obj instanceof FormData || obj instanceof URLSearchParams || 'forEach' in obj && 'set' in obj) {
            obj.forEach((_, key)=>{
                if ([
                    'grant_type',
                    'assertion'
                ].includes(key) || /secret/.test(key)) {
                    obj.set(key, REDACT);
                }
            });
        } else {
            if ('grant_type' in obj) {
                obj['grant_type'] = REDACT;
            }
            if ('assertion' in obj) {
                obj['assertion'] = REDACT;
            }
            if ('client_secret' in obj) {
                obj['client_secret'] = REDACT;
            }
        }
    }
    if (data.config) {
        redactHeaders(data.config.headers);
        redactString(data.config, 'data');
        redactObject(data.config.data);
        redactString(data.config, 'body');
        redactObject(data.config.body);
        if (data.config.url.searchParams.has('token')) {
            data.config.url.searchParams.set('token', REDACT);
        }
        if (data.config.url.searchParams.has('client_secret')) {
            data.config.url.searchParams.set('client_secret', REDACT);
        }
    }
    if (data.response) {
        defaultErrorRedactor({
            config: data.response.config
        });
        redactHeaders(data.response.headers);
        // workaround for `node-fetch`'s `.data` deprecation...
        if (data.response.bodyUsed) {
            redactString(data.response, 'data');
            redactObject(data.response.data);
        }
    }
    return data;
}
}),
"[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/gaxios.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Gaxios = void 0;
const extend_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/extend/index.js [app-route] (ecmascript)"));
const https_1 = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
const common_js_1 = __turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/common.js [app-route] (ecmascript)");
const retry_js_1 = __turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/retry.js [app-route] (ecmascript)");
const stream_1 = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const interceptor_js_1 = __turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/interceptor.js [app-route] (ecmascript)");
const randomUUID = async ()=>globalThis.crypto?.randomUUID() || (await __turbopack_context__.A("[externals]/crypto [external] (crypto, cjs, async loader)")).randomUUID();
const HTTP_STATUS_NO_CONTENT = 204;
class Gaxios {
    agentCache = new Map();
    /**
     * Default HTTP options that will be used for every HTTP request.
     */ defaults;
    /**
     * Interceptors
     */ interceptors;
    /**
     * The Gaxios class is responsible for making HTTP requests.
     * @param defaults The default set of options to be used for this instance.
     */ constructor(defaults){
        this.defaults = defaults || {};
        this.interceptors = {
            request: new interceptor_js_1.GaxiosInterceptorManager(),
            response: new interceptor_js_1.GaxiosInterceptorManager()
        };
    }
    /**
     * A {@link fetch `fetch`} compliant API for {@link Gaxios}.
     *
     * @remarks
     *
     * This is useful as a drop-in replacement for `fetch` API usage.
     *
     * @example
     *
     * ```ts
     * const gaxios = new Gaxios();
     * const myFetch: GaxiosOptions['fetchImplementation'] = (...args) => gaxios.fetch(...args);
     * await myFetch('https://example.com');
     * ```
     *
     * @param args `fetch` API or `Gaxios#request` parameters
     * @returns the {@link Response} with Gaxios-added properties
     */ fetch(...args) {
        // Up to 2 parameters in either overload
        const input = args[0];
        const init = args[1];
        let url = undefined;
        const headers = new Headers();
        // prepare URL
        if (typeof input === 'string') {
            url = new URL(input);
        } else if (input instanceof URL) {
            url = input;
        } else if (input && input.url) {
            url = new URL(input.url);
        }
        // prepare headers
        if (input && typeof input === 'object' && 'headers' in input) {
            _a.mergeHeaders(headers, input.headers);
        }
        if (init) {
            _a.mergeHeaders(headers, new Headers(init.headers));
        }
        // prepare request
        if (typeof input === 'object' && !(input instanceof URL)) {
            // input must have been a non-URL object
            return this.request({
                ...init,
                ...input,
                headers,
                url
            });
        } else {
            // input must have been a string or URL
            return this.request({
                ...init,
                headers,
                url
            });
        }
    }
    /**
     * Perform an HTTP request with the given options.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */ async request(opts = {}) {
        let prepared = await this.#prepareRequest(opts);
        prepared = await this.#applyRequestInterceptors(prepared);
        return this.#applyResponseInterceptors(this._request(prepared));
    }
    async _defaultAdapter(config) {
        const fetchImpl = config.fetchImplementation || this.defaults.fetchImplementation || await _a.#getFetch();
        // node-fetch v3 warns when `data` is present
        // https://github.com/node-fetch/node-fetch/issues/1000
        const preparedOpts = {
            ...config
        };
        delete preparedOpts.data;
        const res = await fetchImpl(config.url, preparedOpts);
        const data = await this.getResponseData(config, res);
        if (!Object.getOwnPropertyDescriptor(res, 'data')?.configurable) {
            // Work-around for `node-fetch` v3 as accessing `data` would otherwise throw
            Object.defineProperties(res, {
                data: {
                    configurable: true,
                    writable: true,
                    enumerable: true,
                    value: data
                }
            });
        }
        // Keep object as an instance of `Response`
        return Object.assign(res, {
            config,
            data
        });
    }
    /**
     * Internal, retryable version of the `request` method.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */ async _request(opts) {
        try {
            let translatedResponse;
            if (opts.adapter) {
                translatedResponse = await opts.adapter(opts, this._defaultAdapter.bind(this));
            } else {
                translatedResponse = await this._defaultAdapter(opts);
            }
            if (!opts.validateStatus(translatedResponse.status)) {
                if (opts.responseType === 'stream') {
                    const response = [];
                    for await (const chunk of translatedResponse.data){
                        response.push(chunk);
                    }
                    translatedResponse.data = Buffer.concat(response.map((c)=>typeof c === 'string' ? Buffer.from(c) : c)).toString('utf8');
                }
                const errorInfo = common_js_1.GaxiosError.extractAPIErrorFromResponse(translatedResponse, `Request failed with status code ${translatedResponse.status}`);
                throw new common_js_1.GaxiosError(errorInfo?.message, opts, translatedResponse, errorInfo);
            }
            return translatedResponse;
        } catch (e) {
            let err;
            if (e instanceof common_js_1.GaxiosError) {
                err = e;
            } else if (e instanceof Error) {
                err = new common_js_1.GaxiosError(e.message, opts, undefined, e);
            } else if (opts.signal?.aborted) {
                err = new common_js_1.GaxiosError(`The operation was aborted: ${e}`, opts, undefined, e);
                err.code = 'AbortError';
            } else {
                err = new common_js_1.GaxiosError('Unexpected Gaxios Error', opts, undefined, e);
            }
            // When `opts.timeout` is configured, `#appendTimeoutToSignal` attaches
            // `AbortSignal.timeout(opts.timeout)` to `opts.signal`, which sets
            // `opts.signal.reason` to a `TimeoutError` `DOMException` when it fires.
            // However, `node-fetch` rejects an aborted signal with a generic
            // `AbortError` ('The user aborted a request.') rather than
            // `opts.signal.reason`, and Bun's native `AbortSignal.timeout` uses the
            // message 'The operation timed out.' instead of V8's 'The operation was
            // aborted due to timeout'. Normalizing `err.code = 'TimeoutError'` and
            // ensuring `err.message` describes the timeout allows `getRetryConfig` /
            // `shouldRetryRequest` to recognize the error as a retriable timeout.
            if (!err.response && opts.signal?.aborted && opts.signal.reason?.name === 'TimeoutError') {
                err.code = 'TimeoutError';
                if (!/timeout|timed out/i.test(err.message)) {
                    err.message = 'The operation was aborted due to timeout';
                }
            } else if (!err.response && opts.signal?.aborted && err.code !== 'TimeoutError') {
                err.code ||= 'AbortError';
            }
            const { shouldRetry, config } = await (0, retry_js_1.getRetryConfig)(err);
            if (shouldRetry && config) {
                err.config.retryConfig.currentRetryAttempt = config.retryConfig.currentRetryAttempt;
                // The error's config could be redacted - therefore we only want to
                // copy the retry state over to the existing config
                opts.retryConfig = err.config?.retryConfig;
                if (typeof err.config?.timeout === 'number') {
                    opts.timeout = err.config.timeout;
                }
                // re-prepare timeout for the next request
                this.#appendTimeoutToSignal(opts);
                return this._request(opts);
            }
            if (opts.errorRedactor) {
                opts.errorRedactor(err);
            }
            throw err;
        }
    }
    async getResponseData(opts, res) {
        if (res.status === HTTP_STATUS_NO_CONTENT) {
            return '';
        }
        if (opts.maxContentLength && res.headers.has('content-length') && opts.maxContentLength < Number.parseInt(res.headers?.get('content-length') || '')) {
            throw new common_js_1.GaxiosError("Response's `Content-Length` is over the limit.", opts, Object.assign(res, {
                config: opts
            }));
        }
        switch(opts.responseType){
            case 'stream':
                return res.body;
            case 'json':
                {
                    const data = await res.text();
                    try {
                        return JSON.parse(data);
                    } catch  {
                        return data;
                    }
                }
            case 'arraybuffer':
                return res.arrayBuffer();
            case 'blob':
                return res.blob();
            case 'text':
                return res.text();
            default:
                return this.getResponseDataFromContentType(res);
        }
    }
    #urlMayUseProxy(url, noProxy = []) {
        const candidate = new URL(url);
        const noProxyList = [
            ...noProxy
        ];
        const noProxyEnvList = (process.env.NO_PROXY ?? process.env.no_proxy)?.split(',') || [];
        for (const rule of noProxyEnvList){
            noProxyList.push(rule.trim());
        }
        for (const rule of noProxyList){
            // Match regex
            if (rule instanceof RegExp) {
                if (rule.test(candidate.toString())) {
                    return false;
                }
            } else if (rule instanceof URL) {
                if (rule.origin === candidate.origin) {
                    return false;
                }
            } else if (rule.startsWith('*.') || rule.startsWith('.')) {
                const cleanedRule = rule.replace(/^\*\./, '.');
                if (candidate.hostname.endsWith(cleanedRule)) {
                    return false;
                }
            } else if (rule === candidate.origin || rule === candidate.hostname || rule === candidate.href) {
                return false;
            }
        }
        return true;
    }
    /**
     * Applies the request interceptors. The request interceptors are applied after the
     * call to prepareRequest is completed.
     *
     * @param {GaxiosOptionsPrepared} options The current set of options.
     *
     * @returns {Promise<GaxiosOptionsPrepared>} Promise that resolves to the set of options or response after interceptors are applied.
     */ async #applyRequestInterceptors(options) {
        let promiseChain = Promise.resolve(options);
        for (const interceptor of this.interceptors.request.values()){
            if (interceptor) {
                promiseChain = promiseChain.then(interceptor.resolved, interceptor.rejected);
            }
        }
        return promiseChain;
    }
    /**
     * Applies the response interceptors. The response interceptors are applied after the
     * call to request is made.
     *
     * @param {GaxiosOptionsPrepared} options The current set of options.
     *
     * @returns {Promise<GaxiosOptionsPrepared>} Promise that resolves to the set of options or response after interceptors are applied.
     */ async #applyResponseInterceptors(response) {
        let promiseChain = Promise.resolve(response);
        for (const interceptor of this.interceptors.response.values()){
            if (interceptor) {
                promiseChain = promiseChain.then(interceptor.resolved, interceptor.rejected);
            }
        }
        return promiseChain;
    }
    /**
     * Validates the options, merges them with defaults, and prepare request.
     *
     * @param options The original options passed from the client.
     * @returns Prepared options, ready to make a request
     */ async #prepareRequest(options) {
        // Prepare Headers - copy in order to not mutate the original objects
        const preparedHeaders = new Headers(this.defaults.headers);
        _a.mergeHeaders(preparedHeaders, options.headers);
        // Merge options
        const opts = (0, extend_1.default)(true, {}, this.defaults, options);
        if (!opts.url) {
            throw new Error('URL is required.');
        }
        if (opts.baseURL) {
            opts.url = new URL(opts.url, opts.baseURL);
        }
        // don't modify the properties of a default or provided URL
        opts.url = new URL(opts.url);
        if (opts.params) {
            if (opts.paramsSerializer) {
                let additionalQueryParams = opts.paramsSerializer(opts.params);
                if (additionalQueryParams.startsWith('?')) {
                    additionalQueryParams = additionalQueryParams.slice(1);
                }
                const prefix = opts.url.toString().includes('?') ? '&' : '?';
                opts.url = opts.url + prefix + additionalQueryParams;
            } else {
                const url = opts.url instanceof URL ? opts.url : new URL(opts.url);
                for (const [key, value] of new URLSearchParams(opts.params)){
                    url.searchParams.append(key, value);
                }
                opts.url = url;
            }
        }
        if (typeof options.maxContentLength === 'number') {
            opts.size = options.maxContentLength;
        }
        if (typeof options.maxRedirects === 'number') {
            opts.follow = options.maxRedirects;
        }
        const shouldDirectlyPassData = typeof opts.data === 'string' || opts.data instanceof ArrayBuffer || opts.data instanceof Blob || globalThis.File && opts.data instanceof File || opts.data instanceof FormData || opts.data instanceof stream_1.Readable || opts.data instanceof ReadableStream || opts.data instanceof String || opts.data instanceof URLSearchParams || ArrayBuffer.isView(opts.data) || // `Buffer` (Node.js), `DataView`, `TypedArray`
        /**
             * @deprecated `node-fetch` or another third-party's request types
             */ [
            'Blob',
            'File',
            'FormData'
        ].includes(opts.data?.constructor?.name || '');
        if (opts.multipart?.length) {
            const boundary = await randomUUID();
            preparedHeaders.set('content-type', `multipart/related; boundary=${boundary}`);
            opts.body = stream_1.Readable.from(this.getMultipartRequest(opts.multipart, boundary));
        } else if (shouldDirectlyPassData) {
            opts.body = opts.data;
        } else if (typeof opts.data === 'object') {
            if (preparedHeaders.get('Content-Type') === 'application/x-www-form-urlencoded') {
                // If www-form-urlencoded content type has been set, but data is
                // provided as an object, serialize the content
                opts.body = opts.paramsSerializer ? opts.paramsSerializer(opts.data) : new URLSearchParams(opts.data);
            } else {
                if (!preparedHeaders.has('content-type')) {
                    preparedHeaders.set('content-type', 'application/json');
                }
                opts.body = JSON.stringify(opts.data);
            }
        } else if (opts.data) {
            opts.body = opts.data;
        }
        opts.validateStatus = opts.validateStatus || this.validateStatus;
        opts.responseType = opts.responseType || 'unknown';
        if (!preparedHeaders.has('accept') && opts.responseType === 'json') {
            preparedHeaders.set('accept', 'application/json');
        }
        const proxy = opts.proxy || process?.env?.HTTPS_PROXY || process?.env?.https_proxy || process?.env?.HTTP_PROXY || process?.env?.http_proxy;
        if (opts.agent) {
        // don't do any of the following options - use the user-provided agent.
        } else if (proxy && this.#urlMayUseProxy(opts.url, opts.noProxy)) {
            const HttpsProxyAgent = await _a.#getProxyAgent();
            if (this.agentCache.has(proxy)) {
                opts.agent = this.agentCache.get(proxy);
            } else {
                opts.agent = new HttpsProxyAgent(proxy, {
                    cert: opts.cert,
                    key: opts.key
                });
                this.agentCache.set(proxy, opts.agent);
            }
        } else if (opts.cert && opts.key) {
            // Configure client for mTLS
            if (this.agentCache.has(opts.key)) {
                opts.agent = this.agentCache.get(opts.key);
            } else {
                opts.agent = new https_1.Agent({
                    cert: opts.cert,
                    key: opts.key
                });
                this.agentCache.set(opts.key, opts.agent);
            }
        }
        if (typeof opts.errorRedactor !== 'function' && opts.errorRedactor !== false) {
            opts.errorRedactor = common_js_1.defaultErrorRedactor;
        }
        if (opts.body && !('duplex' in opts)) {
            /**
             * required for Node.js and the type isn't available today
             * @link https://github.com/nodejs/node/issues/46221
             * @link https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1483
             */ opts.duplex = 'half';
        }
        this.#appendTimeoutToSignal(opts);
        return Object.assign(opts, {
            headers: preparedHeaders,
            url: opts.url instanceof URL ? opts.url : new URL(opts.url)
        });
    }
    #callerSignals = new WeakMap();
    #appendTimeoutToSignal(opts) {
        if (opts.timeout) {
            if (!this.#callerSignals.has(opts)) {
                this.#callerSignals.set(opts, opts.signal ?? undefined);
            }
            const callerSignal = this.#callerSignals.get(opts);
            const timeoutSignal = AbortSignal.timeout(opts.timeout);
            if (callerSignal) {
                opts.signal = AbortSignal.any([
                    callerSignal,
                    timeoutSignal
                ]);
            } else {
                opts.signal = timeoutSignal;
            }
        }
    }
    /**
     * By default, throw for any non-2xx status code
     * @param status status code from the HTTP response
     */ validateStatus(status) {
        return status >= 200 && status < 300;
    }
    /**
     * Attempts to parse a response by looking at the Content-Type header.
     * @param {Response} response the HTTP response.
     * @returns a promise that resolves to the response data.
     */ async getResponseDataFromContentType(response) {
        let contentType = response.headers.get('Content-Type');
        if (contentType === null) {
            // Maintain existing functionality by calling text()
            return response.text();
        }
        contentType = contentType.toLowerCase();
        if (contentType.includes('application/json')) {
            let data = await response.text();
            try {
                data = JSON.parse(data);
            } catch  {
            // continue
            }
            return data;
        } else if (contentType.match(/^text\//)) {
            return response.text();
        } else {
            // If the content type is something not easily handled, just return the raw data (blob)
            return response.blob();
        }
    }
    /**
     * Creates an async generator that yields the pieces of a multipart/related request body.
     * This implementation follows the spec: https://www.ietf.org/rfc/rfc2387.txt. However, recursive
     * multipart/related requests are not currently supported.
     *
     * @param {GaxiosMultipartOptions[]} multipartOptions the pieces to turn into a multipart/related body.
     * @param {string} boundary the boundary string to be placed between each part.
     */ async *getMultipartRequest(multipartOptions, boundary) {
        const finale = `--${boundary}--`;
        for (const currentPart of multipartOptions){
            const partContentType = currentPart.headers.get('Content-Type') || 'application/octet-stream';
            const preamble = `--${boundary}\r\nContent-Type: ${partContentType}\r\n\r\n`;
            yield preamble;
            if (typeof currentPart.content === 'string') {
                yield currentPart.content;
            } else {
                yield* currentPart.content;
            }
            yield '\r\n';
        }
        yield finale;
    }
    /**
     * A cache for the lazily-loaded proxy agent.
     *
     * Should use {@link Gaxios[#getProxyAgent]} to retrieve.
     */ // using `import` to dynamically import the types here
    static #proxyAgent;
    /**
     * A cache for the lazily-loaded fetch library.
     *
     * Should use {@link Gaxios[#getFetch]} to retrieve.
     */ //
    static #fetch;
    static #bunFetch;
    /**
     * Imports, caches, and returns a proxy agent - if not already imported
     *
     * @returns A proxy agent
     */ static async #getProxyAgent() {
        this.#proxyAgent ||= (await __turbopack_context__.A("[project]/node_modules/https-proxy-agent/dist/index.js [app-route] (ecmascript, async loader)")).HttpsProxyAgent;
        return this.#proxyAgent;
    }
    static #createBunFetch() {
        return async (input, init)=>{
            const rawInit = init ? {
                ...init
            } : undefined;
            if (rawInit) {
                const proxyAgent = rawInit.agent;
                if (proxyAgent?.proxy) {
                    rawInit.proxy = proxyAgent.proxy.toString();
                } else {
                    delete rawInit.proxy;
                }
                const cert = rawInit.cert ?? proxyAgent?.connectOpts?.cert;
                const key = rawInit.key ?? proxyAgent?.connectOpts?.key;
                if (cert && key) {
                    rawInit.tls = {
                        ...rawInit.tls,
                        cert,
                        key
                    };
                }
            }
            let fetchInit = rawInit;
            if (fetchInit?.body && typeof fetchInit.body === 'object' && typeof fetchInit.body.pipe === 'function' && typeof stream_1.Readable.toWeb === 'function' && (typeof ReadableStream === 'undefined' || !(fetchInit.body instanceof ReadableStream))) {
                let stream;
                if (fetchInit.body instanceof stream_1.Readable && !fetchInit.body.readableObjectMode) {
                    stream = fetchInit.body;
                } else {
                    const passThrough = new stream_1.PassThrough();
                    const src = fetchInit.body;
                    (0, stream_1.pipeline)(src, passThrough, ()=>{});
                    stream = passThrough;
                }
                fetchInit = {
                    ...fetchInit,
                    body: stream_1.Readable.toWeb(stream)
                };
            }
            let res;
            try {
                res = await globalThis.fetch(input, fetchInit);
            } catch (err) {
                const errorObj = err;
                if (errorObj?.code === 'ConnectionRefused' || errorObj?.code === 'FailedToOpenSocket') {
                    errorObj.code = 'ECONNREFUSED';
                } else if (errorObj?.code === 'ConnectionReset' || errorObj?.code === 'ConnectionClosed') {
                    errorObj.code = 'ECONNRESET';
                }
                if (!(err instanceof Error) && err && typeof err === 'object' && !init?.signal?.aborted) {
                    throw Object.assign(new Error(errorObj.message || errorObj.code || 'Error'), err);
                }
                throw err;
            }
            const maxSize = rawInit?.size ?? rawInit?.maxContentLength ?? 0;
            if (res?.body && typeof stream_1.Readable.fromWeb === 'function' && !(res.body instanceof stream_1.Readable)) {
                let nodeStream;
                const rawBody = res.body;
                const origText = res.text.bind(res);
                const origJson = res.json.bind(res);
                const origArrayBuffer = res.arrayBuffer.bind(res);
                const origBlob = res.blob.bind(res);
                const readBuffer = async ()=>{
                    nodeStream ||= stream_1.Readable.fromWeb(rawBody);
                    const chunks = [];
                    let totalBytes = 0;
                    for await (const chunk of nodeStream){
                        const bytes = chunk;
                        totalBytes += bytes.byteLength;
                        if (maxSize > 0 && totalBytes > maxSize) {
                            throw Object.assign(new Error(`content size at ${String(input?.url ?? input)} over limit: ${maxSize}`), {
                                type: 'max-size'
                            });
                        }
                        chunks.push(bytes);
                    }
                    return Buffer.concat(chunks, totalBytes);
                };
                Object.defineProperty(res, 'body', {
                    get () {
                        nodeStream ||= stream_1.Readable.fromWeb(rawBody);
                        return nodeStream;
                    },
                    configurable: true,
                    enumerable: true
                });
                res.text = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origText();
                    return (await readBuffer()).toString('utf8');
                };
                res.json = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origJson();
                    return JSON.parse(await res.text());
                };
                res.arrayBuffer = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origArrayBuffer();
                    const buf = await readBuffer();
                    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                };
                res.blob = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origBlob();
                    const buf = await readBuffer();
                    const contentType = res.headers?.get?.('content-type') ?? '';
                    return new Blob([
                        buf
                    ], contentType ? {
                        type: contentType
                    } : undefined);
                };
            }
            return res;
        };
    }
    static async #getFetch() {
        const hasWindow = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if ('Bun' in globalThis && typeof globalThis.fetch === 'function') {
            this.#bunFetch ||= this.#createBunFetch();
            return this.#bunFetch;
        }
        this.#fetch ||= (await __turbopack_context__.A("[project]/node_modules/node-fetch/src/index.js [app-route] (ecmascript, async loader)")).default;
        return this.#fetch;
    }
    /**
     * Merges headers.
     * If the base headers do not exist a new `Headers` object will be returned.
     *
     * @remarks
     *
     * Using this utility can be helpful when the headers are not known to exist:
     * - if they exist as `Headers`, that instance will be used
     *   - it improves performance and allows users to use their existing references to their `Headers`
     * - if they exist in another form (`HeadersInit`), they will be used to create a new `Headers` object
     * - if the base headers do not exist a new `Headers` object will be created
     *
     * @param base headers to append/overwrite to
     * @param append headers to append/overwrite with
     * @returns the base headers instance with merged `Headers`
     */ static mergeHeaders(base, ...append) {
        base = base instanceof Headers ? base : new Headers(base);
        for (const headers of append){
            const add = headers instanceof Headers ? headers : new Headers(headers);
            add.forEach((value, key)=>{
                // set-cookie is the only header that would repeat.
                // A bit of background: https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
                key === 'set-cookie' ? base.append(key, value) : base.set(key, value);
            });
        }
        return base;
    }
}
exports.Gaxios = Gaxios;
_a = Gaxios;
}),
"[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.instance = exports.Gaxios = exports.GaxiosError = void 0;
exports.request = request;
const gaxios_js_1 = __turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/gaxios.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Gaxios", {
    enumerable: true,
    get: function() {
        return gaxios_js_1.Gaxios;
    }
});
var common_js_1 = __turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/common.js [app-route] (ecmascript)");
Object.defineProperty(exports, "GaxiosError", {
    enumerable: true,
    get: function() {
        return common_js_1.GaxiosError;
    }
});
__exportStar(__turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/interceptor.js [app-route] (ecmascript)"), exports);
/**
 * The default instance used when the `request` method is directly
 * invoked.
 */ exports.instance = new gaxios_js_1.Gaxios();
/**
 * Make an HTTP request using the given options.
 * @param opts Options for the request
 */ async function request(opts) {
    return exports.instance.request(opts);
}
}),
"[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/interceptor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2024 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GaxiosInterceptorManager = void 0;
/**
 * Class to manage collections of GaxiosInterceptors for both requests and responses.
 */ class GaxiosInterceptorManager extends Set {
}
exports.GaxiosInterceptorManager = GaxiosInterceptorManager;
}),
"[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/retry.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRetryConfig = getRetryConfig;
async function getRetryConfig(err) {
    let config = getConfig(err);
    if (!err || !err.config || !config && !err.config.retry) {
        return {
            shouldRetry: false
        };
    }
    config = config || {};
    config.currentRetryAttempt = config.currentRetryAttempt || 0;
    config.retry = config.retry === undefined || config.retry === null ? 3 : config.retry;
    config.httpMethodsToRetry = config.httpMethodsToRetry || [
        'GET',
        'HEAD',
        'PUT',
        'OPTIONS',
        'DELETE'
    ];
    config.noResponseRetries = config.noResponseRetries === undefined || config.noResponseRetries === null ? 2 : config.noResponseRetries;
    config.retryDelayMultiplier = config.retryDelayMultiplier ? config.retryDelayMultiplier : 2;
    config.timeOfFirstRequest = config.timeOfFirstRequest ? config.timeOfFirstRequest : Date.now();
    config.totalTimeout = config.totalTimeout ? config.totalTimeout : Number.MAX_SAFE_INTEGER;
    config.maxRetryDelay = config.maxRetryDelay ? config.maxRetryDelay : Number.MAX_SAFE_INTEGER;
    // If this wasn't in the list of status codes where we want
    // to automatically retry, return.
    const retryRanges = [
        // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        // 1xx - Retry (Informational, request still processing)
        // 2xx - Do not retry (Success)
        // 3xx - Do not retry (Redirect)
        // 4xx - Do not retry (Client errors)
        // 408 - Retry ("Request Timeout")
        // 429 - Retry ("Too Many Requests")
        // 5xx - Retry (Server errors)
        [
            100,
            199
        ],
        [
            408,
            408
        ],
        [
            429,
            429
        ],
        [
            500,
            599
        ]
    ];
    config.statusCodesToRetry = config.statusCodesToRetry || retryRanges;
    // Put the config back into the err
    err.config.retryConfig = config;
    // Determine if we should retry the request
    const shouldRetryFn = config.shouldRetry || shouldRetryRequest;
    if (!await shouldRetryFn(err)) {
        return {
            shouldRetry: false,
            config: err.config
        };
    }
    const delay = getNextRetryDelay(config);
    // We're going to retry!  Increment the counter.
    err.config.retryConfig.currentRetryAttempt += 1;
    // Create a promise that invokes the retry after the backOffDelay
    const backoff = config.retryBackoff ? config.retryBackoff(err, delay) : new Promise((resolve)=>{
        setTimeout(resolve, delay);
    });
    // Notify the user if they added an `onRetryAttempt` handler
    if (config.onRetryAttempt) {
        await config.onRetryAttempt(err);
    }
    // Return the promise in which recalls Gaxios to retry the request
    await backoff;
    return {
        shouldRetry: true,
        config: err.config
    };
}
/**
 * Determine based on config if we should retry the request.
 * @param err The GaxiosError passed to the interceptor.
 */ function shouldRetryRequest(err) {
    const config = getConfig(err);
    // Classify the error as a timeout if `err.code` is already `'TimeoutError'`
    // (e.g., extracted from a `DOMException` cause or normalized in `_request`)
    // or if the request's `AbortSignal` aborted with a `'TimeoutError'` reason
    // from `AbortSignal.timeout()` (which can happen when `node-fetch` or a
    // custom/shimmed fetch adapter in Node.js or Bun rejects with a generic
    // `AbortError` instead of propagating `signal.reason`).
    const isTimeoutError = err.code === 'TimeoutError' || err.config?.signal?.reason?.name === 'TimeoutError';
    // User-initiated aborts (`signal.aborted` or `AbortError`) should not be
    // retried, except when the abort was triggered by a request timeout.
    if (err.config?.signal?.aborted && !isTimeoutError || err.code === 'AbortError' && !isTimeoutError) {
        return false;
    }
    // If there's no config, or retries are disabled, return.
    if (!config || config.retry === 0) {
        return false;
    }
    // Check if this error has no response (ETIMEDOUT, ENOTFOUND, etc)
    if (!err.response && (config.currentRetryAttempt || 0) >= config.noResponseRetries) {
        return false;
    }
    // Only retry with configured HttpMethods.
    if (!config.httpMethodsToRetry || !config.httpMethodsToRetry.includes(err.config.method?.toUpperCase() || 'GET')) {
        return false;
    }
    // If this wasn't in the list of status codes where we want
    // to automatically retry, return.
    if (err.response && err.response.status) {
        let isInRange = false;
        for (const [min, max] of config.statusCodesToRetry){
            const status = err.response.status;
            if (status >= min && status <= max) {
                isInRange = true;
                break;
            }
        }
        if (!isInRange) {
            return false;
        }
    }
    // If we are out of retry attempts, return
    config.currentRetryAttempt = config.currentRetryAttempt || 0;
    if (config.currentRetryAttempt >= config.retry) {
        return false;
    }
    return true;
}
/**
 * Acquire the raxConfig object from an GaxiosError if available.
 * @param err The Gaxios error with a config object.
 */ function getConfig(err) {
    if (err && err.config && err.config.retryConfig) {
        return err.config.retryConfig;
    }
    return;
}
/**
 * Gets the delay to wait before the next retry.
 *
 * @param {RetryConfig} config The current set of retry options
 * @returns {number} the amount of ms to wait before the next retry attempt.
 */ function getNextRetryDelay(config) {
    // Calculate time to wait with exponential backoff.
    // If this is the first retry, look for a configured retryDelay.
    const retryDelay = config.currentRetryAttempt ? 0 : config.retryDelay ?? 100;
    // Formula: retryDelay + ((retryDelayMultiplier^currentRetryAttempt - 1 / 2) * 1000)
    const calculatedDelay = retryDelay + (Math.pow(config.retryDelayMultiplier, config.currentRetryAttempt) - 1) / 2 * 1000;
    const maxAllowableDelay = config.totalTimeout - (Date.now() - config.timeOfFirstRequest);
    return Math.min(calculatedDelay, maxAllowableDelay, config.maxRetryDelay);
}
}),
"[project]/node_modules/gcp-metadata/node_modules/gaxios/build/cjs/src/util.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2023 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const pkg = __turbopack_context__.r("[project]/node_modules/gcp-metadata/node_modules/gaxios/package.json.[json].cjs [app-route] (ecmascript)");
module.exports = {
    pkg
};
}),
"[project]/node_modules/gcp-metadata/node_modules/gaxios/package.json.[json].cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "name": "gaxios",
    "version": "8.3.3",
    "description": "A simple common HTTP client specifically for Google APIs and services.",
    "main": "build/cjs/src/index.js",
    "types": "build/cjs/src/index.d.ts",
    "files": [
        "build/cjs/src",
        "build/esm/src",
        "build/esm/package.json",
        "!build/**/*.map"
    ],
    "exports": {
        ".": {
            "import": {
                "types": "./build/esm/src/index.d.ts",
                "default": "./build/esm/src/index.js"
            },
            "require": {
                "types": "./build/cjs/src/index.d.ts",
                "default": "./build/cjs/src/index.js"
            }
        },
        "./build/src/common": {
            "import": "./build/esm/src/common.js",
            "require": "./build/cjs/src/common.js"
        },
        "./package.json": "./package.json"
    },
    "repository": {
        "type": "git",
        "directory": "core/packages/gaxios",
        "url": "https://github.com/googleapis/google-cloud-node.git"
    },
    "keywords": [
        "google"
    ],
    "engines": {
        "node": ">=22"
    },
    "author": "Google, LLC",
    "license": "Apache-2.0",
    "devDependencies": {
        "@babel/plugin-proposal-private-methods": "^7.18.6",
        "@types/cors": "^2.8.6",
        "@types/express": "^5.0.0",
        "@types/extend": "^3.0.1",
        "@types/mocha": "^10.0.10",
        "@types/multiparty": "4.2.1",
        "@types/mv": "^2.1.0",
        "@types/ncp": "^2.0.8",
        "@types/node": "^24.0.0",
        "@types/sinon": "^21.0.0",
        "@types/tmp": "^0.2.6",
        "assert": "^2.0.0",
        "browserify": "^17.0.0",
        "c8": "^10.1.3",
        "cors": "^2.8.5",
        "express": "^5.0.0",
        "gts": "^6.0.2",
        "is-docker": "^3.0.0",
        "jsdoc": "^4.0.4",
        "jsdoc-fresh": "^6.1.0",
        "jsdoc-region-tag": "^5.1.0",
        "karma": "^6.0.0",
        "karma-chrome-launcher": "^3.0.0",
        "karma-coverage": "^2.0.0",
        "karma-firefox-launcher": "^2.0.0",
        "karma-mocha": "^2.0.0",
        "karma-remap-coverage": "^0.1.5",
        "karma-sourcemap-loader": "^0.4.0",
        "karma-webpack": "^5.0.0",
        "mocha": "^11.1.0",
        "multiparty": "^4.2.1",
        "mv": "^2.1.1",
        "ncp": "^2.0.0",
        "nock": "14.0.5",
        "null-loader": "^4.0.1",
        "pack-n-play": "^5.3.0",
        "puppeteer": "^24.0.0",
        "sinon": "21.0.3",
        "stream-browserify": "^3.0.0",
        "tmp": "0.2.7",
        "ts-loader": "^9.5.2",
        "typescript": "5.8.3",
        "undici-types": "^7.24.1",
        "webpack": "^5.97.1",
        "webpack-cli": "^6.0.1"
    },
    "dependencies": {
        "extend": "^3.0.2",
        "https-proxy-agent": "^7.0.1",
        "node-fetch": "^3.3.2"
    },
    "homepage": "https://github.com/googleapis/google-cloud-node/tree/main/core/packages/gaxios",
    "scripts": {
        "lint": "gts check --no-inline-config",
        "test": "node ../../../bin/run-test.cjs build/esm/test",
        "presystem-test": "npm run compile",
        "system-test": "mocha build/esm/system-test --timeout 80000",
        "compile": "tsc -b ./tsconfig.json ./tsconfig.cjs.json && node utils/enable-esm.mjs",
        "fix": "gts fix",
        "pretest": "npm run compile",
        "webpack": "webpack",
        "prebrowser-test": "npm run compile",
        "browser-test": "node build/browser-test/browser-test-runner.js",
        "docs": "jsdoc -c .jsdoc.js",
        "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
        "prelint": "cd samples; npm link ../; npm install",
        "clean": "gts clean"
    }
};
}),
"[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GaxiosError = exports.GAXIOS_ERROR_SYMBOL = void 0;
exports.defaultErrorRedactor = defaultErrorRedactor;
const extend_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/extend/index.js [app-route] (ecmascript)"));
const util_cjs_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/util.cjs [app-route] (ecmascript)"));
const pkg = util_cjs_1.default.pkg;
/**
 * Support `instanceof` operator for `GaxiosError`s in different versions of this library.
 *
 * @see {@link GaxiosError[Symbol.hasInstance]}
 */ exports.GAXIOS_ERROR_SYMBOL = Symbol.for(`${pkg.name}-gaxios-error`);
class GaxiosError extends Error {
    config;
    response;
    /**
     * An error code.
     * Can be a system error code, DOMException error name, or any error's 'code' property where it is a `string`.
     *
     * It is only a `number` when the cause is sourced from an API-level error (AIP-193).
     *
     * @see {@link https://nodejs.org/api/errors.html#errorcode error.code}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMException#error_names DOMException#error_names}
     * @see {@link https://google.aip.dev/193#http11json-representation AIP-193}
     *
     * @example
     * 'ECONNRESET'
     *
     * @example
     * 'TimeoutError'
     *
     * @example
     * 500
     */ code;
    /**
     * An HTTP Status code.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Response/status Response#status}
     *
     * @example
     * 500
     */ status;
    /**
     * @deprecated use {@link GaxiosError.cause} instead.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause Error#cause}
     *
     * @privateRemarks
     *
     * We will want to remove this property later as the modern `cause` property is better suited
     * for displaying and relaying nested errors. Keeping this here makes the resulting
     * error log larger than it needs to be.
     *
     */ error;
    /**
     * Support `instanceof` operator for `GaxiosError` across builds/duplicated files.
     *
     * @see {@link GAXIOS_ERROR_SYMBOL}
     * @see {@link GaxiosError[Symbol.hasInstance]}
     * @see {@link https://github.com/microsoft/TypeScript/issues/13965#issuecomment-278570200}
     * @see {@link https://stackoverflow.com/questions/46618852/require-and-instanceof}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/@@hasInstance#reverting_to_default_instanceof_behavior}
     */ [exports.GAXIOS_ERROR_SYMBOL] = pkg.version;
    /**
     * Support `instanceof` operator for `GaxiosError` across builds/duplicated files.
     *
     * @see {@link GAXIOS_ERROR_SYMBOL}
     * @see {@link GaxiosError[GAXIOS_ERROR_SYMBOL]}
     */ static [Symbol.hasInstance](instance) {
        if (instance && typeof instance === 'object' && exports.GAXIOS_ERROR_SYMBOL in instance && instance[exports.GAXIOS_ERROR_SYMBOL] === pkg.version) {
            return true;
        }
        // fallback to native
        return Function.prototype[Symbol.hasInstance].call(GaxiosError, instance);
    }
    constructor(message, config, response, cause){
        super(message, {
            cause
        });
        this.config = config;
        this.response = response;
        this.error = cause instanceof Error ? cause : undefined;
        // deep-copy config as we do not want to mutate
        // the existing config for future retries/use
        this.config = (0, extend_1.default)(true, {}, config);
        if (this.response) {
            this.response.config = (0, extend_1.default)(true, {}, this.response.config);
        }
        if (this.response) {
            try {
                this.response.data = translateData(this.config.responseType, // workaround for `node-fetch`'s `.data` deprecation...
                this.response?.bodyUsed ? this.response?.data : undefined);
            } catch  {
            // best effort - don't throw an error within an error
            // we could set `this.response.config.responseType = 'unknown'`, but
            // that would mutate future calls with this config object.
            }
            this.status = this.response.status;
        }
        if (cause instanceof DOMException) {
            // The DOMException's equivalent to code is its name
            // E.g.: name = `TimeoutError`, code = number
            // https://developer.mozilla.org/en-US/docs/Web/API/DOMException/name
            this.code = cause.name;
        } else if (cause && typeof cause === 'object' && 'code' in cause && (typeof cause.code === 'string' || typeof cause.code === 'number')) {
            this.code = cause.code;
        }
    }
    /**
     * An AIP-193 conforming error extractor.
     *
     * @see {@link https://google.aip.dev/193#http11json-representation AIP-193}
     *
     * @internal
     * @expiremental
     *
     * @param res the response object
     * @returns the extracted error information
     */ static extractAPIErrorFromResponse(res, defaultErrorMessage = 'The request failed') {
        let message = defaultErrorMessage;
        // Use res.data as the error message
        if (typeof res.data === 'string') {
            message = res.data;
        }
        if (res.data && typeof res.data === 'object' && 'error' in res.data && res.data.error && !res.ok) {
            if (typeof res.data.error === 'string') {
                return {
                    message: res.data.error,
                    code: res.status,
                    status: res.statusText
                };
            }
            if (typeof res.data.error === 'object') {
                // extract status from data.message
                message = 'message' in res.data.error && typeof res.data.error.message === 'string' ? res.data.error.message : message;
                // extract status from data.error
                const status = 'status' in res.data.error && typeof res.data.error.status === 'string' ? res.data.error.status : res.statusText;
                // extract code from data.error
                const code = 'code' in res.data.error && typeof res.data.error.code === 'number' ? res.data.error.code : res.status;
                if ('errors' in res.data.error && Array.isArray(res.data.error.errors)) {
                    const errorMessages = [];
                    for (const e of res.data.error.errors){
                        if (typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
                            errorMessages.push(e.message);
                        }
                    }
                    return Object.assign({
                        message: errorMessages.join('\n') || message,
                        code,
                        status
                    }, res.data.error);
                }
                return Object.assign({
                    message,
                    code,
                    status
                }, res.data.error);
            }
        }
        return {
            message,
            code: res.status,
            status: res.statusText
        };
    }
}
exports.GaxiosError = GaxiosError;
function translateData(responseType, data) {
    switch(responseType){
        case 'stream':
            return data;
        case 'json':
            return JSON.parse(JSON.stringify(data));
        case 'arraybuffer':
            return JSON.parse(Buffer.from(data).toString('utf8'));
        case 'blob':
            return JSON.parse(data.text());
        default:
            return data;
    }
}
/**
 * An experimental error redactor.
 *
 * @param config Config to potentially redact properties of
 * @param response Config to potentially redact properties of
 *
 * @experimental
 */ function defaultErrorRedactor(data) {
    const REDACT = '<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.';
    function redactHeaders(headers) {
        if (!headers) return;
        headers.forEach((_, key)=>{
            // any casing of `Authentication`
            // any casing of `Authorization`
            // anything containing secret, such as 'client secret'
            if (/^authentication$/i.test(key) || /^authorization$/i.test(key) || /secret/i.test(key)) headers.set(key, REDACT);
        });
    }
    function redactString(obj, key) {
        if (typeof obj === 'object' && obj !== null && typeof obj[key] === 'string') {
            const text = obj[key];
            if (/grant_type=/i.test(text) || /assertion=/i.test(text) || /secret/i.test(text)) {
                obj[key] = REDACT;
            }
        }
    }
    function redactObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return;
        } else if (obj instanceof FormData || obj instanceof URLSearchParams || 'forEach' in obj && 'set' in obj) {
            obj.forEach((_, key)=>{
                if ([
                    'grant_type',
                    'assertion'
                ].includes(key) || /secret/.test(key)) {
                    obj.set(key, REDACT);
                }
            });
        } else {
            if ('grant_type' in obj) {
                obj['grant_type'] = REDACT;
            }
            if ('assertion' in obj) {
                obj['assertion'] = REDACT;
            }
            if ('client_secret' in obj) {
                obj['client_secret'] = REDACT;
            }
        }
    }
    if (data.config) {
        redactHeaders(data.config.headers);
        redactString(data.config, 'data');
        redactObject(data.config.data);
        redactString(data.config, 'body');
        redactObject(data.config.body);
        if (data.config.url.searchParams.has('token')) {
            data.config.url.searchParams.set('token', REDACT);
        }
        if (data.config.url.searchParams.has('client_secret')) {
            data.config.url.searchParams.set('client_secret', REDACT);
        }
    }
    if (data.response) {
        defaultErrorRedactor({
            config: data.response.config
        });
        redactHeaders(data.response.headers);
        // workaround for `node-fetch`'s `.data` deprecation...
        if (data.response.bodyUsed) {
            redactString(data.response, 'data');
            redactObject(data.response.data);
        }
    }
    return data;
}
}),
"[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/gaxios.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Gaxios = void 0;
const extend_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/extend/index.js [app-route] (ecmascript)"));
const https_1 = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
const common_js_1 = __turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/common.js [app-route] (ecmascript)");
const retry_js_1 = __turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/retry.js [app-route] (ecmascript)");
const stream_1 = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
const interceptor_js_1 = __turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/interceptor.js [app-route] (ecmascript)");
const randomUUID = async ()=>globalThis.crypto?.randomUUID() || (await __turbopack_context__.A("[externals]/crypto [external] (crypto, cjs, async loader)")).randomUUID();
const HTTP_STATUS_NO_CONTENT = 204;
class Gaxios {
    agentCache = new Map();
    /**
     * Default HTTP options that will be used for every HTTP request.
     */ defaults;
    /**
     * Interceptors
     */ interceptors;
    /**
     * The Gaxios class is responsible for making HTTP requests.
     * @param defaults The default set of options to be used for this instance.
     */ constructor(defaults){
        this.defaults = defaults || {};
        this.interceptors = {
            request: new interceptor_js_1.GaxiosInterceptorManager(),
            response: new interceptor_js_1.GaxiosInterceptorManager()
        };
    }
    /**
     * A {@link fetch `fetch`} compliant API for {@link Gaxios}.
     *
     * @remarks
     *
     * This is useful as a drop-in replacement for `fetch` API usage.
     *
     * @example
     *
     * ```ts
     * const gaxios = new Gaxios();
     * const myFetch: GaxiosOptions['fetchImplementation'] = (...args) => gaxios.fetch(...args);
     * await myFetch('https://example.com');
     * ```
     *
     * @param args `fetch` API or `Gaxios#request` parameters
     * @returns the {@link Response} with Gaxios-added properties
     */ fetch(...args) {
        // Up to 2 parameters in either overload
        const input = args[0];
        const init = args[1];
        let url = undefined;
        const headers = new Headers();
        // prepare URL
        if (typeof input === 'string') {
            url = new URL(input);
        } else if (input instanceof URL) {
            url = input;
        } else if (input && input.url) {
            url = new URL(input.url);
        }
        // prepare headers
        if (input && typeof input === 'object' && 'headers' in input) {
            _a.mergeHeaders(headers, input.headers);
        }
        if (init) {
            _a.mergeHeaders(headers, new Headers(init.headers));
        }
        // prepare request
        if (typeof input === 'object' && !(input instanceof URL)) {
            // input must have been a non-URL object
            return this.request({
                ...init,
                ...input,
                headers,
                url
            });
        } else {
            // input must have been a string or URL
            return this.request({
                ...init,
                headers,
                url
            });
        }
    }
    /**
     * Perform an HTTP request with the given options.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */ async request(opts = {}) {
        let prepared = await this.#prepareRequest(opts);
        prepared = await this.#applyRequestInterceptors(prepared);
        return this.#applyResponseInterceptors(this._request(prepared));
    }
    async _defaultAdapter(config) {
        const fetchImpl = config.fetchImplementation || this.defaults.fetchImplementation || await _a.#getFetch();
        // node-fetch v3 warns when `data` is present
        // https://github.com/node-fetch/node-fetch/issues/1000
        const preparedOpts = {
            ...config
        };
        delete preparedOpts.data;
        const res = await fetchImpl(config.url, preparedOpts);
        const data = await this.getResponseData(config, res);
        if (!Object.getOwnPropertyDescriptor(res, 'data')?.configurable) {
            // Work-around for `node-fetch` v3 as accessing `data` would otherwise throw
            Object.defineProperties(res, {
                data: {
                    configurable: true,
                    writable: true,
                    enumerable: true,
                    value: data
                }
            });
        }
        // Keep object as an instance of `Response`
        return Object.assign(res, {
            config,
            data
        });
    }
    /**
     * Internal, retryable version of the `request` method.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */ async _request(opts) {
        try {
            let translatedResponse;
            if (opts.adapter) {
                translatedResponse = await opts.adapter(opts, this._defaultAdapter.bind(this));
            } else {
                translatedResponse = await this._defaultAdapter(opts);
            }
            if (!opts.validateStatus(translatedResponse.status)) {
                if (opts.responseType === 'stream') {
                    const response = [];
                    for await (const chunk of translatedResponse.data){
                        response.push(chunk);
                    }
                    translatedResponse.data = Buffer.concat(response.map((c)=>typeof c === 'string' ? Buffer.from(c) : c)).toString('utf8');
                }
                const errorInfo = common_js_1.GaxiosError.extractAPIErrorFromResponse(translatedResponse, `Request failed with status code ${translatedResponse.status}`);
                throw new common_js_1.GaxiosError(errorInfo?.message, opts, translatedResponse, errorInfo);
            }
            return translatedResponse;
        } catch (e) {
            let err;
            if (e instanceof common_js_1.GaxiosError) {
                err = e;
            } else if (e instanceof Error) {
                err = new common_js_1.GaxiosError(e.message, opts, undefined, e);
            } else if (opts.signal?.aborted) {
                err = new common_js_1.GaxiosError(`The operation was aborted: ${e}`, opts, undefined, e);
                err.code = 'AbortError';
            } else {
                err = new common_js_1.GaxiosError('Unexpected Gaxios Error', opts, undefined, e);
            }
            // When `opts.timeout` is configured, `#appendTimeoutToSignal` attaches
            // `AbortSignal.timeout(opts.timeout)` to `opts.signal`, which sets
            // `opts.signal.reason` to a `TimeoutError` `DOMException` when it fires.
            // However, `node-fetch` rejects an aborted signal with a generic
            // `AbortError` ('The user aborted a request.') rather than
            // `opts.signal.reason`, and Bun's native `AbortSignal.timeout` uses the
            // message 'The operation timed out.' instead of V8's 'The operation was
            // aborted due to timeout'. Normalizing `err.code = 'TimeoutError'` and
            // ensuring `err.message` describes the timeout allows `getRetryConfig` /
            // `shouldRetryRequest` to recognize the error as a retriable timeout.
            if (!err.response && opts.signal?.aborted && opts.signal.reason?.name === 'TimeoutError') {
                err.code = 'TimeoutError';
                if (!/timeout|timed out/i.test(err.message)) {
                    err.message = 'The operation was aborted due to timeout';
                }
            } else if (!err.response && opts.signal?.aborted && err.code !== 'TimeoutError') {
                err.code ||= 'AbortError';
            }
            const { shouldRetry, config } = await (0, retry_js_1.getRetryConfig)(err);
            if (shouldRetry && config) {
                err.config.retryConfig.currentRetryAttempt = config.retryConfig.currentRetryAttempt;
                // The error's config could be redacted - therefore we only want to
                // copy the retry state over to the existing config
                opts.retryConfig = err.config?.retryConfig;
                if (typeof err.config?.timeout === 'number') {
                    opts.timeout = err.config.timeout;
                }
                // re-prepare timeout for the next request
                this.#appendTimeoutToSignal(opts);
                return this._request(opts);
            }
            if (opts.errorRedactor) {
                opts.errorRedactor(err);
            }
            throw err;
        }
    }
    async getResponseData(opts, res) {
        if (res.status === HTTP_STATUS_NO_CONTENT) {
            return '';
        }
        if (opts.maxContentLength && res.headers.has('content-length') && opts.maxContentLength < Number.parseInt(res.headers?.get('content-length') || '')) {
            throw new common_js_1.GaxiosError("Response's `Content-Length` is over the limit.", opts, Object.assign(res, {
                config: opts
            }));
        }
        switch(opts.responseType){
            case 'stream':
                return res.body;
            case 'json':
                {
                    const data = await res.text();
                    try {
                        return JSON.parse(data);
                    } catch  {
                        return data;
                    }
                }
            case 'arraybuffer':
                return res.arrayBuffer();
            case 'blob':
                return res.blob();
            case 'text':
                return res.text();
            default:
                return this.getResponseDataFromContentType(res);
        }
    }
    #urlMayUseProxy(url, noProxy = []) {
        const candidate = new URL(url);
        const noProxyList = [
            ...noProxy
        ];
        const noProxyEnvList = (process.env.NO_PROXY ?? process.env.no_proxy)?.split(',') || [];
        for (const rule of noProxyEnvList){
            noProxyList.push(rule.trim());
        }
        for (const rule of noProxyList){
            // Match regex
            if (rule instanceof RegExp) {
                if (rule.test(candidate.toString())) {
                    return false;
                }
            } else if (rule instanceof URL) {
                if (rule.origin === candidate.origin) {
                    return false;
                }
            } else if (rule.startsWith('*.') || rule.startsWith('.')) {
                const cleanedRule = rule.replace(/^\*\./, '.');
                if (candidate.hostname.endsWith(cleanedRule)) {
                    return false;
                }
            } else if (rule === candidate.origin || rule === candidate.hostname || rule === candidate.href) {
                return false;
            }
        }
        return true;
    }
    /**
     * Applies the request interceptors. The request interceptors are applied after the
     * call to prepareRequest is completed.
     *
     * @param {GaxiosOptionsPrepared} options The current set of options.
     *
     * @returns {Promise<GaxiosOptionsPrepared>} Promise that resolves to the set of options or response after interceptors are applied.
     */ async #applyRequestInterceptors(options) {
        let promiseChain = Promise.resolve(options);
        for (const interceptor of this.interceptors.request.values()){
            if (interceptor) {
                promiseChain = promiseChain.then(interceptor.resolved, interceptor.rejected);
            }
        }
        return promiseChain;
    }
    /**
     * Applies the response interceptors. The response interceptors are applied after the
     * call to request is made.
     *
     * @param {GaxiosOptionsPrepared} options The current set of options.
     *
     * @returns {Promise<GaxiosOptionsPrepared>} Promise that resolves to the set of options or response after interceptors are applied.
     */ async #applyResponseInterceptors(response) {
        let promiseChain = Promise.resolve(response);
        for (const interceptor of this.interceptors.response.values()){
            if (interceptor) {
                promiseChain = promiseChain.then(interceptor.resolved, interceptor.rejected);
            }
        }
        return promiseChain;
    }
    /**
     * Validates the options, merges them with defaults, and prepare request.
     *
     * @param options The original options passed from the client.
     * @returns Prepared options, ready to make a request
     */ async #prepareRequest(options) {
        // Prepare Headers - copy in order to not mutate the original objects
        const preparedHeaders = new Headers(this.defaults.headers);
        _a.mergeHeaders(preparedHeaders, options.headers);
        // Merge options
        const opts = (0, extend_1.default)(true, {}, this.defaults, options);
        if (!opts.url) {
            throw new Error('URL is required.');
        }
        if (opts.baseURL) {
            opts.url = new URL(opts.url, opts.baseURL);
        }
        // don't modify the properties of a default or provided URL
        opts.url = new URL(opts.url);
        if (opts.params) {
            if (opts.paramsSerializer) {
                let additionalQueryParams = opts.paramsSerializer(opts.params);
                if (additionalQueryParams.startsWith('?')) {
                    additionalQueryParams = additionalQueryParams.slice(1);
                }
                const prefix = opts.url.toString().includes('?') ? '&' : '?';
                opts.url = opts.url + prefix + additionalQueryParams;
            } else {
                const url = opts.url instanceof URL ? opts.url : new URL(opts.url);
                for (const [key, value] of new URLSearchParams(opts.params)){
                    url.searchParams.append(key, value);
                }
                opts.url = url;
            }
        }
        if (typeof options.maxContentLength === 'number') {
            opts.size = options.maxContentLength;
        }
        if (typeof options.maxRedirects === 'number') {
            opts.follow = options.maxRedirects;
        }
        const shouldDirectlyPassData = typeof opts.data === 'string' || opts.data instanceof ArrayBuffer || opts.data instanceof Blob || globalThis.File && opts.data instanceof File || opts.data instanceof FormData || opts.data instanceof stream_1.Readable || opts.data instanceof ReadableStream || opts.data instanceof String || opts.data instanceof URLSearchParams || ArrayBuffer.isView(opts.data) || // `Buffer` (Node.js), `DataView`, `TypedArray`
        /**
             * @deprecated `node-fetch` or another third-party's request types
             */ [
            'Blob',
            'File',
            'FormData'
        ].includes(opts.data?.constructor?.name || '');
        if (opts.multipart?.length) {
            const boundary = await randomUUID();
            preparedHeaders.set('content-type', `multipart/related; boundary=${boundary}`);
            opts.body = stream_1.Readable.from(this.getMultipartRequest(opts.multipart, boundary));
        } else if (shouldDirectlyPassData) {
            opts.body = opts.data;
        } else if (typeof opts.data === 'object') {
            if (preparedHeaders.get('Content-Type') === 'application/x-www-form-urlencoded') {
                // If www-form-urlencoded content type has been set, but data is
                // provided as an object, serialize the content
                opts.body = opts.paramsSerializer ? opts.paramsSerializer(opts.data) : new URLSearchParams(opts.data);
            } else {
                if (!preparedHeaders.has('content-type')) {
                    preparedHeaders.set('content-type', 'application/json');
                }
                opts.body = JSON.stringify(opts.data);
            }
        } else if (opts.data) {
            opts.body = opts.data;
        }
        opts.validateStatus = opts.validateStatus || this.validateStatus;
        opts.responseType = opts.responseType || 'unknown';
        if (!preparedHeaders.has('accept') && opts.responseType === 'json') {
            preparedHeaders.set('accept', 'application/json');
        }
        const proxy = opts.proxy || process?.env?.HTTPS_PROXY || process?.env?.https_proxy || process?.env?.HTTP_PROXY || process?.env?.http_proxy;
        if (opts.agent) {
        // don't do any of the following options - use the user-provided agent.
        } else if (proxy && this.#urlMayUseProxy(opts.url, opts.noProxy)) {
            const HttpsProxyAgent = await _a.#getProxyAgent();
            if (this.agentCache.has(proxy)) {
                opts.agent = this.agentCache.get(proxy);
            } else {
                opts.agent = new HttpsProxyAgent(proxy, {
                    cert: opts.cert,
                    key: opts.key
                });
                this.agentCache.set(proxy, opts.agent);
            }
        } else if (opts.cert && opts.key) {
            // Configure client for mTLS
            if (this.agentCache.has(opts.key)) {
                opts.agent = this.agentCache.get(opts.key);
            } else {
                opts.agent = new https_1.Agent({
                    cert: opts.cert,
                    key: opts.key
                });
                this.agentCache.set(opts.key, opts.agent);
            }
        }
        if (typeof opts.errorRedactor !== 'function' && opts.errorRedactor !== false) {
            opts.errorRedactor = common_js_1.defaultErrorRedactor;
        }
        if (opts.body && !('duplex' in opts)) {
            /**
             * required for Node.js and the type isn't available today
             * @link https://github.com/nodejs/node/issues/46221
             * @link https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1483
             */ opts.duplex = 'half';
        }
        this.#appendTimeoutToSignal(opts);
        return Object.assign(opts, {
            headers: preparedHeaders,
            url: opts.url instanceof URL ? opts.url : new URL(opts.url)
        });
    }
    #callerSignals = new WeakMap();
    #appendTimeoutToSignal(opts) {
        if (opts.timeout) {
            if (!this.#callerSignals.has(opts)) {
                this.#callerSignals.set(opts, opts.signal ?? undefined);
            }
            const callerSignal = this.#callerSignals.get(opts);
            const timeoutSignal = AbortSignal.timeout(opts.timeout);
            if (callerSignal) {
                opts.signal = AbortSignal.any([
                    callerSignal,
                    timeoutSignal
                ]);
            } else {
                opts.signal = timeoutSignal;
            }
        }
    }
    /**
     * By default, throw for any non-2xx status code
     * @param status status code from the HTTP response
     */ validateStatus(status) {
        return status >= 200 && status < 300;
    }
    /**
     * Attempts to parse a response by looking at the Content-Type header.
     * @param {Response} response the HTTP response.
     * @returns a promise that resolves to the response data.
     */ async getResponseDataFromContentType(response) {
        let contentType = response.headers.get('Content-Type');
        if (contentType === null) {
            // Maintain existing functionality by calling text()
            return response.text();
        }
        contentType = contentType.toLowerCase();
        if (contentType.includes('application/json')) {
            let data = await response.text();
            try {
                data = JSON.parse(data);
            } catch  {
            // continue
            }
            return data;
        } else if (contentType.match(/^text\//)) {
            return response.text();
        } else {
            // If the content type is something not easily handled, just return the raw data (blob)
            return response.blob();
        }
    }
    /**
     * Creates an async generator that yields the pieces of a multipart/related request body.
     * This implementation follows the spec: https://www.ietf.org/rfc/rfc2387.txt. However, recursive
     * multipart/related requests are not currently supported.
     *
     * @param {GaxiosMultipartOptions[]} multipartOptions the pieces to turn into a multipart/related body.
     * @param {string} boundary the boundary string to be placed between each part.
     */ async *getMultipartRequest(multipartOptions, boundary) {
        const finale = `--${boundary}--`;
        for (const currentPart of multipartOptions){
            const partContentType = currentPart.headers.get('Content-Type') || 'application/octet-stream';
            const preamble = `--${boundary}\r\nContent-Type: ${partContentType}\r\n\r\n`;
            yield preamble;
            if (typeof currentPart.content === 'string') {
                yield currentPart.content;
            } else {
                yield* currentPart.content;
            }
            yield '\r\n';
        }
        yield finale;
    }
    /**
     * A cache for the lazily-loaded proxy agent.
     *
     * Should use {@link Gaxios[#getProxyAgent]} to retrieve.
     */ // using `import` to dynamically import the types here
    static #proxyAgent;
    /**
     * A cache for the lazily-loaded fetch library.
     *
     * Should use {@link Gaxios[#getFetch]} to retrieve.
     */ //
    static #fetch;
    static #bunFetch;
    /**
     * Imports, caches, and returns a proxy agent - if not already imported
     *
     * @returns A proxy agent
     */ static async #getProxyAgent() {
        this.#proxyAgent ||= (await __turbopack_context__.A("[project]/node_modules/https-proxy-agent/dist/index.js [app-route] (ecmascript, async loader)")).HttpsProxyAgent;
        return this.#proxyAgent;
    }
    static #createBunFetch() {
        return async (input, init)=>{
            const rawInit = init ? {
                ...init
            } : undefined;
            if (rawInit) {
                const proxyAgent = rawInit.agent;
                if (proxyAgent?.proxy) {
                    rawInit.proxy = proxyAgent.proxy.toString();
                } else {
                    delete rawInit.proxy;
                }
                const cert = rawInit.cert ?? proxyAgent?.connectOpts?.cert;
                const key = rawInit.key ?? proxyAgent?.connectOpts?.key;
                if (cert && key) {
                    rawInit.tls = {
                        ...rawInit.tls,
                        cert,
                        key
                    };
                }
            }
            let fetchInit = rawInit;
            if (fetchInit?.body && typeof fetchInit.body === 'object' && typeof fetchInit.body.pipe === 'function' && typeof stream_1.Readable.toWeb === 'function' && (typeof ReadableStream === 'undefined' || !(fetchInit.body instanceof ReadableStream))) {
                let stream;
                if (fetchInit.body instanceof stream_1.Readable && !fetchInit.body.readableObjectMode) {
                    stream = fetchInit.body;
                } else {
                    const passThrough = new stream_1.PassThrough();
                    const src = fetchInit.body;
                    (0, stream_1.pipeline)(src, passThrough, ()=>{});
                    stream = passThrough;
                }
                fetchInit = {
                    ...fetchInit,
                    body: stream_1.Readable.toWeb(stream)
                };
            }
            let res;
            try {
                res = await globalThis.fetch(input, fetchInit);
            } catch (err) {
                const errorObj = err;
                if (errorObj?.code === 'ConnectionRefused' || errorObj?.code === 'FailedToOpenSocket') {
                    errorObj.code = 'ECONNREFUSED';
                } else if (errorObj?.code === 'ConnectionReset' || errorObj?.code === 'ConnectionClosed') {
                    errorObj.code = 'ECONNRESET';
                }
                if (!(err instanceof Error) && err && typeof err === 'object' && !init?.signal?.aborted) {
                    throw Object.assign(new Error(errorObj.message || errorObj.code || 'Error'), err);
                }
                throw err;
            }
            const maxSize = rawInit?.size ?? rawInit?.maxContentLength ?? 0;
            if (res?.body && typeof stream_1.Readable.fromWeb === 'function' && !(res.body instanceof stream_1.Readable)) {
                let nodeStream;
                const rawBody = res.body;
                const origText = res.text.bind(res);
                const origJson = res.json.bind(res);
                const origArrayBuffer = res.arrayBuffer.bind(res);
                const origBlob = res.blob.bind(res);
                const readBuffer = async ()=>{
                    nodeStream ||= stream_1.Readable.fromWeb(rawBody);
                    const chunks = [];
                    let totalBytes = 0;
                    for await (const chunk of nodeStream){
                        const bytes = chunk;
                        totalBytes += bytes.byteLength;
                        if (maxSize > 0 && totalBytes > maxSize) {
                            throw Object.assign(new Error(`content size at ${String(input?.url ?? input)} over limit: ${maxSize}`), {
                                type: 'max-size'
                            });
                        }
                        chunks.push(bytes);
                    }
                    return Buffer.concat(chunks, totalBytes);
                };
                Object.defineProperty(res, 'body', {
                    get () {
                        nodeStream ||= stream_1.Readable.fromWeb(rawBody);
                        return nodeStream;
                    },
                    configurable: true,
                    enumerable: true
                });
                res.text = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origText();
                    return (await readBuffer()).toString('utf8');
                };
                res.json = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origJson();
                    return JSON.parse(await res.text());
                };
                res.arrayBuffer = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origArrayBuffer();
                    const buf = await readBuffer();
                    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                };
                res.blob = async ()=>{
                    if (!nodeStream && maxSize <= 0) return origBlob();
                    const buf = await readBuffer();
                    const contentType = res.headers?.get?.('content-type') ?? '';
                    return new Blob([
                        buf
                    ], contentType ? {
                        type: contentType
                    } : undefined);
                };
            }
            return res;
        };
    }
    static async #getFetch() {
        const hasWindow = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if ('Bun' in globalThis && typeof globalThis.fetch === 'function') {
            this.#bunFetch ||= this.#createBunFetch();
            return this.#bunFetch;
        }
        this.#fetch ||= (await __turbopack_context__.A("[project]/node_modules/node-fetch/src/index.js [app-route] (ecmascript, async loader)")).default;
        return this.#fetch;
    }
    /**
     * Merges headers.
     * If the base headers do not exist a new `Headers` object will be returned.
     *
     * @remarks
     *
     * Using this utility can be helpful when the headers are not known to exist:
     * - if they exist as `Headers`, that instance will be used
     *   - it improves performance and allows users to use their existing references to their `Headers`
     * - if they exist in another form (`HeadersInit`), they will be used to create a new `Headers` object
     * - if the base headers do not exist a new `Headers` object will be created
     *
     * @param base headers to append/overwrite to
     * @param append headers to append/overwrite with
     * @returns the base headers instance with merged `Headers`
     */ static mergeHeaders(base, ...append) {
        base = base instanceof Headers ? base : new Headers(base);
        for (const headers of append){
            const add = headers instanceof Headers ? headers : new Headers(headers);
            add.forEach((value, key)=>{
                // set-cookie is the only header that would repeat.
                // A bit of background: https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
                key === 'set-cookie' ? base.append(key, value) : base.set(key, value);
            });
        }
        return base;
    }
}
exports.Gaxios = Gaxios;
_a = Gaxios;
}),
"[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.instance = exports.Gaxios = exports.GaxiosError = void 0;
exports.request = request;
const gaxios_js_1 = __turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/gaxios.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Gaxios", {
    enumerable: true,
    get: function() {
        return gaxios_js_1.Gaxios;
    }
});
var common_js_1 = __turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/common.js [app-route] (ecmascript)");
Object.defineProperty(exports, "GaxiosError", {
    enumerable: true,
    get: function() {
        return common_js_1.GaxiosError;
    }
});
__exportStar(__turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/interceptor.js [app-route] (ecmascript)"), exports);
/**
 * The default instance used when the `request` method is directly
 * invoked.
 */ exports.instance = new gaxios_js_1.Gaxios();
/**
 * Make an HTTP request using the given options.
 * @param opts Options for the request
 */ async function request(opts) {
    return exports.instance.request(opts);
}
}),
"[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/interceptor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2024 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GaxiosInterceptorManager = void 0;
/**
 * Class to manage collections of GaxiosInterceptors for both requests and responses.
 */ class GaxiosInterceptorManager extends Set {
}
exports.GaxiosInterceptorManager = GaxiosInterceptorManager;
}),
"[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/retry.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRetryConfig = getRetryConfig;
async function getRetryConfig(err) {
    let config = getConfig(err);
    if (!err || !err.config || !config && !err.config.retry) {
        return {
            shouldRetry: false
        };
    }
    config = config || {};
    config.currentRetryAttempt = config.currentRetryAttempt || 0;
    config.retry = config.retry === undefined || config.retry === null ? 3 : config.retry;
    config.httpMethodsToRetry = config.httpMethodsToRetry || [
        'GET',
        'HEAD',
        'PUT',
        'OPTIONS',
        'DELETE'
    ];
    config.noResponseRetries = config.noResponseRetries === undefined || config.noResponseRetries === null ? 2 : config.noResponseRetries;
    config.retryDelayMultiplier = config.retryDelayMultiplier ? config.retryDelayMultiplier : 2;
    config.timeOfFirstRequest = config.timeOfFirstRequest ? config.timeOfFirstRequest : Date.now();
    config.totalTimeout = config.totalTimeout ? config.totalTimeout : Number.MAX_SAFE_INTEGER;
    config.maxRetryDelay = config.maxRetryDelay ? config.maxRetryDelay : Number.MAX_SAFE_INTEGER;
    // If this wasn't in the list of status codes where we want
    // to automatically retry, return.
    const retryRanges = [
        // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        // 1xx - Retry (Informational, request still processing)
        // 2xx - Do not retry (Success)
        // 3xx - Do not retry (Redirect)
        // 4xx - Do not retry (Client errors)
        // 408 - Retry ("Request Timeout")
        // 429 - Retry ("Too Many Requests")
        // 5xx - Retry (Server errors)
        [
            100,
            199
        ],
        [
            408,
            408
        ],
        [
            429,
            429
        ],
        [
            500,
            599
        ]
    ];
    config.statusCodesToRetry = config.statusCodesToRetry || retryRanges;
    // Put the config back into the err
    err.config.retryConfig = config;
    // Determine if we should retry the request
    const shouldRetryFn = config.shouldRetry || shouldRetryRequest;
    if (!await shouldRetryFn(err)) {
        return {
            shouldRetry: false,
            config: err.config
        };
    }
    const delay = getNextRetryDelay(config);
    // We're going to retry!  Increment the counter.
    err.config.retryConfig.currentRetryAttempt += 1;
    // Create a promise that invokes the retry after the backOffDelay
    const backoff = config.retryBackoff ? config.retryBackoff(err, delay) : new Promise((resolve)=>{
        setTimeout(resolve, delay);
    });
    // Notify the user if they added an `onRetryAttempt` handler
    if (config.onRetryAttempt) {
        await config.onRetryAttempt(err);
    }
    // Return the promise in which recalls Gaxios to retry the request
    await backoff;
    return {
        shouldRetry: true,
        config: err.config
    };
}
/**
 * Determine based on config if we should retry the request.
 * @param err The GaxiosError passed to the interceptor.
 */ function shouldRetryRequest(err) {
    const config = getConfig(err);
    // Classify the error as a timeout if `err.code` is already `'TimeoutError'`
    // (e.g., extracted from a `DOMException` cause or normalized in `_request`)
    // or if the request's `AbortSignal` aborted with a `'TimeoutError'` reason
    // from `AbortSignal.timeout()` (which can happen when `node-fetch` or a
    // custom/shimmed fetch adapter in Node.js or Bun rejects with a generic
    // `AbortError` instead of propagating `signal.reason`).
    const isTimeoutError = err.code === 'TimeoutError' || err.config?.signal?.reason?.name === 'TimeoutError';
    // User-initiated aborts (`signal.aborted` or `AbortError`) should not be
    // retried, except when the abort was triggered by a request timeout.
    if (err.config?.signal?.aborted && !isTimeoutError || err.code === 'AbortError' && !isTimeoutError) {
        return false;
    }
    // If there's no config, or retries are disabled, return.
    if (!config || config.retry === 0) {
        return false;
    }
    // Check if this error has no response (ETIMEDOUT, ENOTFOUND, etc)
    if (!err.response && (config.currentRetryAttempt || 0) >= config.noResponseRetries) {
        return false;
    }
    // Only retry with configured HttpMethods.
    if (!config.httpMethodsToRetry || !config.httpMethodsToRetry.includes(err.config.method?.toUpperCase() || 'GET')) {
        return false;
    }
    // If this wasn't in the list of status codes where we want
    // to automatically retry, return.
    if (err.response && err.response.status) {
        let isInRange = false;
        for (const [min, max] of config.statusCodesToRetry){
            const status = err.response.status;
            if (status >= min && status <= max) {
                isInRange = true;
                break;
            }
        }
        if (!isInRange) {
            return false;
        }
    }
    // If we are out of retry attempts, return
    config.currentRetryAttempt = config.currentRetryAttempt || 0;
    if (config.currentRetryAttempt >= config.retry) {
        return false;
    }
    return true;
}
/**
 * Acquire the raxConfig object from an GaxiosError if available.
 * @param err The Gaxios error with a config object.
 */ function getConfig(err) {
    if (err && err.config && err.config.retryConfig) {
        return err.config.retryConfig;
    }
    return;
}
/**
 * Gets the delay to wait before the next retry.
 *
 * @param {RetryConfig} config The current set of retry options
 * @returns {number} the amount of ms to wait before the next retry attempt.
 */ function getNextRetryDelay(config) {
    // Calculate time to wait with exponential backoff.
    // If this is the first retry, look for a configured retryDelay.
    const retryDelay = config.currentRetryAttempt ? 0 : config.retryDelay ?? 100;
    // Formula: retryDelay + ((retryDelayMultiplier^currentRetryAttempt - 1 / 2) * 1000)
    const calculatedDelay = retryDelay + (Math.pow(config.retryDelayMultiplier, config.currentRetryAttempt) - 1) / 2 * 1000;
    const maxAllowableDelay = config.totalTimeout - (Date.now() - config.timeOfFirstRequest);
    return Math.min(calculatedDelay, maxAllowableDelay, config.maxRetryDelay);
}
}),
"[project]/node_modules/google-auth-library/node_modules/gaxios/build/cjs/src/util.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2023 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const pkg = __turbopack_context__.r("[project]/node_modules/google-auth-library/node_modules/gaxios/package.json.[json].cjs [app-route] (ecmascript)");
module.exports = {
    pkg
};
}),
"[project]/node_modules/google-auth-library/node_modules/gaxios/package.json.[json].cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "name": "gaxios",
    "version": "8.3.3",
    "description": "A simple common HTTP client specifically for Google APIs and services.",
    "main": "build/cjs/src/index.js",
    "types": "build/cjs/src/index.d.ts",
    "files": [
        "build/cjs/src",
        "build/esm/src",
        "build/esm/package.json",
        "!build/**/*.map"
    ],
    "exports": {
        ".": {
            "import": {
                "types": "./build/esm/src/index.d.ts",
                "default": "./build/esm/src/index.js"
            },
            "require": {
                "types": "./build/cjs/src/index.d.ts",
                "default": "./build/cjs/src/index.js"
            }
        },
        "./build/src/common": {
            "import": "./build/esm/src/common.js",
            "require": "./build/cjs/src/common.js"
        },
        "./package.json": "./package.json"
    },
    "repository": {
        "type": "git",
        "directory": "core/packages/gaxios",
        "url": "https://github.com/googleapis/google-cloud-node.git"
    },
    "keywords": [
        "google"
    ],
    "engines": {
        "node": ">=22"
    },
    "author": "Google, LLC",
    "license": "Apache-2.0",
    "devDependencies": {
        "@babel/plugin-proposal-private-methods": "^7.18.6",
        "@types/cors": "^2.8.6",
        "@types/express": "^5.0.0",
        "@types/extend": "^3.0.1",
        "@types/mocha": "^10.0.10",
        "@types/multiparty": "4.2.1",
        "@types/mv": "^2.1.0",
        "@types/ncp": "^2.0.8",
        "@types/node": "^24.0.0",
        "@types/sinon": "^21.0.0",
        "@types/tmp": "^0.2.6",
        "assert": "^2.0.0",
        "browserify": "^17.0.0",
        "c8": "^10.1.3",
        "cors": "^2.8.5",
        "express": "^5.0.0",
        "gts": "^6.0.2",
        "is-docker": "^3.0.0",
        "jsdoc": "^4.0.4",
        "jsdoc-fresh": "^6.1.0",
        "jsdoc-region-tag": "^5.1.0",
        "karma": "^6.0.0",
        "karma-chrome-launcher": "^3.0.0",
        "karma-coverage": "^2.0.0",
        "karma-firefox-launcher": "^2.0.0",
        "karma-mocha": "^2.0.0",
        "karma-remap-coverage": "^0.1.5",
        "karma-sourcemap-loader": "^0.4.0",
        "karma-webpack": "^5.0.0",
        "mocha": "^11.1.0",
        "multiparty": "^4.2.1",
        "mv": "^2.1.1",
        "ncp": "^2.0.0",
        "nock": "14.0.5",
        "null-loader": "^4.0.1",
        "pack-n-play": "^5.3.0",
        "puppeteer": "^24.0.0",
        "sinon": "21.0.3",
        "stream-browserify": "^3.0.0",
        "tmp": "0.2.7",
        "ts-loader": "^9.5.2",
        "typescript": "5.8.3",
        "undici-types": "^7.24.1",
        "webpack": "^5.97.1",
        "webpack-cli": "^6.0.1"
    },
    "dependencies": {
        "extend": "^3.0.2",
        "https-proxy-agent": "^7.0.1",
        "node-fetch": "^3.3.2"
    },
    "homepage": "https://github.com/googleapis/google-cloud-node/tree/main/core/packages/gaxios",
    "scripts": {
        "lint": "gts check --no-inline-config",
        "test": "node ../../../bin/run-test.cjs build/esm/test",
        "presystem-test": "npm run compile",
        "system-test": "mocha build/esm/system-test --timeout 80000",
        "compile": "tsc -b ./tsconfig.json ./tsconfig.cjs.json && node utils/enable-esm.mjs",
        "fix": "gts fix",
        "pretest": "npm run compile",
        "webpack": "webpack",
        "prebrowser-test": "npm run compile",
        "browser-test": "node build/browser-test/browser-test-runner.js",
        "docs": "jsdoc -c .jsdoc.js",
        "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
        "prelint": "cd samples; npm link ../; npm install",
        "clean": "gts clean"
    }
};
}),
"[project]/node_modules/google-logging-utils/build/src/colours.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Colours = void 0;
/**
 * Handles figuring out if we can use ANSI colours and handing out the escape codes.
 *
 * This is for package-internal use only, and may change at any time.
 *
 * @private
 * @internal
 */ class Colours {
    static enabled = false;
    static reset = '';
    static bright = '';
    static dim = '';
    static red = '';
    static green = '';
    static yellow = '';
    static blue = '';
    static magenta = '';
    static cyan = '';
    static white = '';
    static grey = '';
    /**
     * @param stream The stream (e.g. process.stderr)
     * @returns true if the stream should have colourization enabled
     */ static isEnabled(stream) {
        return stream && // May happen in browsers.
        stream.isTTY && (typeof stream.getColorDepth === 'function' ? stream.getColorDepth() > 2 : true);
    }
    static refresh() {
        Colours.enabled = Colours.isEnabled(process?.stderr);
        if (!this.enabled) {
            Colours.reset = '';
            Colours.bright = '';
            Colours.dim = '';
            Colours.red = '';
            Colours.green = '';
            Colours.yellow = '';
            Colours.blue = '';
            Colours.magenta = '';
            Colours.cyan = '';
            Colours.white = '';
            Colours.grey = '';
        } else {
            Colours.reset = '\u001b[0m';
            Colours.bright = '\u001b[1m';
            Colours.dim = '\u001b[2m';
            Colours.red = '\u001b[31m';
            Colours.green = '\u001b[32m';
            Colours.yellow = '\u001b[33m';
            Colours.blue = '\u001b[34m';
            Colours.magenta = '\u001b[35m';
            Colours.cyan = '\u001b[36m';
            Colours.white = '\u001b[37m';
            Colours.grey = '\u001b[90m';
        }
    }
}
exports.Colours = Colours;
Colours.refresh();
}),
"[project]/node_modules/google-logging-utils/build/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2021-2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogSeverity = void 0;
__exportStar(__turbopack_context__.r("[project]/node_modules/google-logging-utils/build/src/logging-utils.js [app-route] (ecmascript)"), exports);
// 🌟 ADDED EXPORT FOR TYPES 🌟
var types_1 = __turbopack_context__.r("[project]/node_modules/google-logging-utils/build/src/types.js [app-route] (ecmascript)");
Object.defineProperty(exports, "LogSeverity", {
    enumerable: true,
    get: function() {
        return types_1.LogSeverity;
    }
});
}),
"[project]/node_modules/google-logging-utils/build/src/logging-utils.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright 2021-2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.env = exports.DebugLogBackendBase = exports.placeholder = exports.AdhocDebugLogger = void 0;
exports.getNodeBackend = getNodeBackend;
exports.getDebugBackend = getDebugBackend;
exports.getStructuredBackend = getStructuredBackend;
exports.setBackend = setBackend;
exports.log = log;
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const process = __importStar(__turbopack_context__.r("[externals]/process [external] (process, cjs)"));
const util = __importStar(__turbopack_context__.r("[externals]/util [external] (util, cjs)"));
const colours_1 = __turbopack_context__.r("[project]/node_modules/google-logging-utils/build/src/colours.js [app-route] (ecmascript)");
const types_1 = __turbopack_context__.r("[project]/node_modules/google-logging-utils/build/src/types.js [app-route] (ecmascript)");
// Some functions (as noted) are based on the Node standard library, from
// the following file:
//
// https://github.com/nodejs/node/blob/main/lib/internal/util/debuglog.js
// NOTE: The previous 'export declare interface AdhocDebugLogger' was correctly removed.
/**
 * Our logger instance. This actually contains the meat of dealing
 * with log lines, including EventEmitter. This contains the function
 * that will be passed back to users of the package.
 */ class AdhocDebugLogger extends events_1.EventEmitter {
    // Our namespace (system/subsystem/etc)
    namespace;
    // The function we'll call with new log lines.
    // Should be built in Node util stuff, or the "debug" package, or whatever.
    upstream;
    // Self-referential function wrapper that calls invoke() on us.
    func;
    /**
     * @param upstream The backend will pass a function that will be
     * called whenever our logger function is invoked.
     */ constructor(namespace, upstream){
        super();
        this.namespace = namespace;
        this.upstream = upstream;
        this.func = Object.assign(this.invoke.bind(this), {
            // Also add an instance pointer back to us.
            instance: this,
            // And pull over the EventEmitter functionality.
            on: (event, listener)=>this.on(event, listener)
        });
        // Convenience methods for log levels.
        this.func.debug = (...args)=>this.invokeSeverity(types_1.LogSeverity.DEBUG, ...args);
        this.func.info = (...args)=>this.invokeSeverity(types_1.LogSeverity.INFO, ...args);
        this.func.warn = (...args)=>this.invokeSeverity(types_1.LogSeverity.WARNING, ...args);
        this.func.error = (...args)=>this.invokeSeverity(types_1.LogSeverity.ERROR, ...args);
        this.func.sublog = (namespace)=>log(namespace, this.func);
    }
    invoke(fields, ...args) {
        // Push out any upstream logger first.
        if (this.upstream) {
            try {
                this.upstream(fields, ...args);
            } catch (e) {
            // Swallow exceptions to avoid interfering with other logging.
            }
        }
        // Emit sink events.
        try {
            this.emit('log', fields, args);
        } catch (e) {
        // Swallow exceptions to avoid interfering with other logging.
        }
    }
    invokeSeverity(severity, ...args) {
        this.invoke({
            severity
        }, ...args);
    }
}
exports.AdhocDebugLogger = AdhocDebugLogger;
/**
 * This can be used in place of a real logger while waiting for Promises or disabling logging.
 */ exports.placeholder = new AdhocDebugLogger('', ()=>{}).func;
// 🌟 REMOVED: AdhocDebugLogCallable, AdhocDebugLogFunction, DebugLogBackend declarations
/**
 * The base class for debug logging backends. It's possible to use this, but the
 * same non-guarantees above still apply (unstable interface, etc).
 *
 * @private
 * @internal
 */ class DebugLogBackendBase {
    cached = new Map();
    filters = [];
    filtersSet = false;
    constructor(){
        // Look for the Node config variable for what systems to enable. We'll store
        // these for the log method below, which will call setFilters() once.
        let nodeFlag = process.env[exports.env.nodeEnables] ?? '*';
        if (nodeFlag === 'all' || nodeFlag === 'true') {
            nodeFlag = '*';
        }
        this.filters = nodeFlag.split(',');
    }
    log(namespace, fields, ...args) {
        try {
            if (!this.filtersSet) {
                this.setFilters();
                this.filtersSet = true;
            }
            let logger = this.cached.get(namespace);
            if (!logger) {
                logger = this.makeLogger(namespace);
                this.cached.set(namespace, logger);
            }
            logger(fields, ...args);
        } catch (e) {
            // Silently ignore all errors; we don't want them to interfere with
            // the user's running app.
            // e;
            console.error(e);
        }
    }
}
exports.DebugLogBackendBase = DebugLogBackendBase;
// The basic backend. This one definitely works, but it's less feature-filled.
//
// Rather than using util.debuglog, this implements the same basic logic directly.
// The reason for this decision is that debuglog checks the value of the
// NODE_DEBUG environment variable before any user code runs; we therefore
// can't pipe our own enables into it (and util.debuglog will never print unless
// the user duplicates it into NODE_DEBUG, which isn't reasonable).
//
class NodeBackend extends DebugLogBackendBase {
    // Default to allowing all systems, since we gate earlier based on whether the
    // variable is empty.
    enabledRegexp = /.*/g;
    isEnabled(namespace) {
        return this.enabledRegexp.test(namespace);
    }
    makeLogger(namespace) {
        if (!this.enabledRegexp.test(namespace)) {
            return ()=>{};
        }
        return (fields, ...args)=>{
            // TODO: `fields` needs to be turned into a string here, one way or another.
            const nscolour = `${colours_1.Colours.green}${namespace}${colours_1.Colours.reset}`;
            const pid = `${colours_1.Colours.yellow}${process.pid}${colours_1.Colours.reset}`;
            let level;
            switch(fields.severity){
                case types_1.LogSeverity.ERROR:
                    level = `${colours_1.Colours.red}${fields.severity}${colours_1.Colours.reset}`;
                    break;
                case types_1.LogSeverity.INFO:
                    level = `${colours_1.Colours.magenta}${fields.severity}${colours_1.Colours.reset}`;
                    break;
                case types_1.LogSeverity.WARNING:
                    level = `${colours_1.Colours.yellow}${fields.severity}${colours_1.Colours.reset}`;
                    break;
                default:
                    level = fields.severity ?? types_1.LogSeverity.DEFAULT;
                    break;
            }
            const msg = util.formatWithOptions({
                colors: colours_1.Colours.enabled
            }, ...args);
            const filteredFields = Object.assign({}, fields);
            delete filteredFields.severity;
            const fieldsJson = Object.getOwnPropertyNames(filteredFields).length ? JSON.stringify(filteredFields) : '';
            const fieldsColour = fieldsJson ? `${colours_1.Colours.grey}${fieldsJson}${colours_1.Colours.reset}` : '';
            console.error('%s [%s|%s] %s%s', pid, nscolour, level, msg, fieldsJson ? ` ${fieldsColour}` : '');
        };
    }
    // Regexp patterns below are from here:
    // https://github.com/nodejs/node/blob/c0aebed4b3395bd65d54b18d1fd00f071002ac20/lib/internal/util/debuglog.js#L36
    setFilters() {
        const totalFilters = this.filters.join(',');
        const regexp = totalFilters.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*/g, '.*').replace(/,/g, '$|^');
        this.enabledRegexp = new RegExp(`^${regexp}$`, 'i');
    }
}
/**
 * @returns A backend based on Node util.debuglog; this is the default.
 */ function getNodeBackend() {
    return new NodeBackend();
}
class DebugBackend extends DebugLogBackendBase {
    debugPkg;
    constructor(pkg){
        super();
        this.debugPkg = pkg;
    }
    makeLogger(namespace) {
        const debugLogger = this.debugPkg(namespace);
        return (fields, ...args)=>{
            // TODO: `fields` needs to be turned into a string here.
            debugLogger(args[0], ...args.slice(1));
        };
    }
    setFilters() {
        const existingFilters = process.env['NODE_DEBUG'] ?? '';
        process.env['NODE_DEBUG'] = `${existingFilters}${existingFilters ? ',' : ''}${this.filters.join(',')}`;
    }
}
/**
 * Creates a "debug" package backend. The user must call require('debug') and pass
 * the resulting object to this function.
 *
 * ```
 *  setBackend(getDebugBackend(require('debug')))
 * ```
 *
 * https://www.npmjs.com/package/debug
 *
 * Note: Google does not explicitly endorse or recommend this package; it's just
 * being provided as an option.
 *
 * @returns A backend based on the npm "debug" package.
 */ function getDebugBackend(debugPkg) {
    return new DebugBackend(debugPkg);
}
/**
 * This pretty much works like the Node logger, but it outputs structured
 * logging JSON matching Google Cloud's ingestion specs. Rather than handling
 * its own output, it wraps another backend. The passed backend must be a subclass
 * of `DebugLogBackendBase` (any of the backends exposed by this package will work).
 */ class StructuredBackend extends DebugLogBackendBase {
    upstream;
    constructor(upstream){
        super();
        this.upstream = upstream ?? undefined;
    }
    makeLogger(namespace) {
        const debugLogger = this.upstream?.makeLogger(namespace);
        return (fields, ...args)=>{
            const severity = fields.severity ?? types_1.LogSeverity.INFO;
            const json = Object.assign({
                severity,
                message: util.format(...args)
            }, fields);
            const jsonString = JSON.stringify(json);
            if (debugLogger) {
                debugLogger(fields, jsonString);
            } else {
                console.log('%s', jsonString);
            }
        };
    }
    setFilters() {
        this.upstream?.setFilters();
    }
}
/**
 * Creates a "structured logging" backend. This pretty much works like the
 * Node logger, but it outputs structured logging JSON matching Google
 * Cloud's ingestion specs instead of plain text.
 *
 * ```
 *  setBackend(getStructuredBackend())
 * ```
 *
 * @param upstream If you want to use something besides the Node backend to
 *   write the actual log lines into, pass that here.
 * @returns A backend based on Google Cloud structured logging.
 */ function getStructuredBackend(upstream) {
    return new StructuredBackend(upstream);
}
/**
 * The environment variables that we standardized on, for all ad-hoc logging.
 */ exports.env = {
    /**
     * Filter wildcards specific to the Node syntax, and similar to the built-in
     * utils.debuglog() environment variable. If missing, disables logging.
     */ nodeEnables: 'GOOGLE_SDK_NODE_LOGGING'
};
// Keep a copy of all namespaced loggers so users can reliably .on() them.
// Note that these cached functions will need to deal with changes in the backend.
const loggerCache = new Map();
// Our current global backend. This might be:
let cachedBackend = undefined;
/**
 * Set the backend to use for our log output.
 * - A backend object
 * - null to disable logging
 * - undefined for "nothing yet", defaults to the Node backend
 *
 * @param backend Results from one of the get*Backend() functions.
 */ function setBackend(backend) {
    cachedBackend = backend;
    loggerCache.clear();
}
/**
 * Creates a logging function. Multiple calls to this with the same namespace
 * will produce the same logger, with the same event emitter hooks.
 *
 * Namespaces can be a simple string ("system" name), or a qualified string
 * (system:subsystem), which can be used for filtering, or for "system:*".
 *
 * @param namespace The namespace, a descriptive text string.
 * @returns A function you can call that works similar to console.log().
 */ function log(namespace, parent) {
    // If the enable environment variable isn't set, do nothing. The user
    // can still choose to set a backend of their choice using the manual
    // `setBackend()`.
    if (!cachedBackend) {
        const enablesFlag = process.env[exports.env.nodeEnables];
        if (!enablesFlag) {
            return exports.placeholder;
        }
    }
    // This might happen mostly if the typings are dropped in a user's code,
    // or if they're calling from JavaScript.
    if (!namespace) {
        return exports.placeholder;
    }
    // Handle sub-loggers.
    if (parent) {
        namespace = `${parent.instance.namespace}:${namespace}`;
    }
    // Reuse loggers so things like event sinks are persistent.
    const existing = loggerCache.get(namespace);
    if (existing) {
        return existing.func;
    }
    // Do we have a backend yet?
    if (cachedBackend === null) {
        // Explicitly disabled.
        return exports.placeholder;
    } else if (cachedBackend === undefined) {
        // One hasn't been made yet, so default to Node.
        cachedBackend = getNodeBackend();
    }
    // The logger is further wrapped so we can handle the backend changing out.
    const logger = (()=>{
        let previousBackend = undefined;
        const newLogger = new AdhocDebugLogger(namespace, (fields, ...args)=>{
            if (previousBackend !== cachedBackend) {
                // Did the user pass a custom backend?
                if (cachedBackend === null) {
                    // Explicitly disabled.
                    return;
                } else if (cachedBackend === undefined) {
                    // One hasn't been made yet, so default to Node.
                    cachedBackend = getNodeBackend();
                }
                previousBackend = cachedBackend;
            }
            cachedBackend?.log(namespace, fields, ...args);
        });
        return newLogger;
    })();
    loggerCache.set(namespace, logger);
    return logger.func;
}
}),
"[project]/node_modules/google-logging-utils/build/src/types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogSeverity = void 0;
/**
 * Possible log levels. These are a subset of Cloud Observability levels.
 * https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
 */ var LogSeverity;
(function(LogSeverity) {
    LogSeverity["DEFAULT"] = "DEFAULT";
    LogSeverity["DEBUG"] = "DEBUG";
    LogSeverity["INFO"] = "INFO";
    LogSeverity["WARNING"] = "WARNING";
    LogSeverity["ERROR"] = "ERROR";
})(LogSeverity || (exports.LogSeverity = LogSeverity = {}));
}),
"[project]/node_modules/json-bigint/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var json_stringify = __turbopack_context__.r("[project]/node_modules/json-bigint/lib/stringify.js [app-route] (ecmascript)").stringify;
var json_parse = __turbopack_context__.r("[project]/node_modules/json-bigint/lib/parse.js [app-route] (ecmascript)");
module.exports = function(options) {
    return {
        parse: json_parse(options),
        stringify: json_stringify
    };
};
//create the default method members with no options applied for backwards compatibility
module.exports.parse = json_parse();
module.exports.stringify = json_stringify;
}),
"[project]/node_modules/json-bigint/lib/parse.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var BigNumber = null;
// regexpxs extracted from
// (c) BSD-3-Clause
// https://github.com/fastify/secure-json-parse/graphs/contributors and https://github.com/hapijs/bourne/graphs/contributors
const suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
const suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
/*
    json_parse.js
    2012-06-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    This file creates a json_parse function.
    During create you can (optionally) specify some behavioural switches

        require('json-bigint')(options)

            The optional options parameter holds switches that drive certain
            aspects of the parsing process:
            * options.strict = true will warn about duplicate-key usage in the json.
              The default (strict = false) will silently ignore those and overwrite
              values for keys that are in duplicate use.

    The resulting function follows this signature:
        json_parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = json_parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/ /*members "", "\"", "\/", "\\", at, b, call, charAt, f, fromCharCode,
    hasOwnProperty, message, n, name, prototype, push, r, t, text
*/ var json_parse = function(options) {
    'use strict';
    // This is a function that can parse a JSON text, producing a JavaScript
    // data structure. It is a simple, recursive descent parser. It does not use
    // eval or regular expressions, so it can be used as a model for implementing
    // a JSON parser in other languages.
    // We are defining the function inside of another function to avoid creating
    // global variables.
    // Default options one can override by passing options to the parse()
    var _options = {
        strict: false,
        storeAsString: false,
        alwaysParseAsBig: false,
        useNativeBigInt: false,
        protoAction: 'error',
        constructorAction: 'error'
    };
    // If there are options, then use them to override the default _options
    if (options !== undefined && options !== null) {
        if (options.strict === true) {
            _options.strict = true;
        }
        if (options.storeAsString === true) {
            _options.storeAsString = true;
        }
        _options.alwaysParseAsBig = options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
        _options.useNativeBigInt = options.useNativeBigInt === true ? options.useNativeBigInt : false;
        if (typeof options.constructorAction !== 'undefined') {
            if (options.constructorAction === 'error' || options.constructorAction === 'ignore' || options.constructorAction === 'preserve') {
                _options.constructorAction = options.constructorAction;
            } else {
                throw new Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`);
            }
        }
        if (typeof options.protoAction !== 'undefined') {
            if (options.protoAction === 'error' || options.protoAction === 'ignore' || options.protoAction === 'preserve') {
                _options.protoAction = options.protoAction;
            } else {
                throw new Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`);
            }
        }
    }
    var at, ch, escapee = {
        '"': '"',
        '\\': '\\',
        '/': '/',
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t'
    }, text, error = function(m) {
        // Call error when something is wrong.
        throw {
            name: 'SyntaxError',
            message: m,
            at: at,
            text: text
        };
    }, next = function(c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }
        // Get the next character. When there are no more characters,
        // return the empty string.
        ch = text.charAt(at);
        at += 1;
        return ch;
    }, number = function() {
        // Parse a number value.
        var number, string = '';
        if (ch === '-') {
            string = '-';
            next('-');
        }
        while(ch >= '0' && ch <= '9'){
            string += ch;
            next();
        }
        if (ch === '.') {
            string += '.';
            while(next() && ch >= '0' && ch <= '9'){
                string += ch;
            }
        }
        if (ch === 'e' || ch === 'E') {
            string += ch;
            next();
            if (ch === '-' || ch === '+') {
                string += ch;
                next();
            }
            while(ch >= '0' && ch <= '9'){
                string += ch;
                next();
            }
        }
        number = +string;
        if (!isFinite(number)) {
            error('Bad number');
        } else {
            if (BigNumber == null) BigNumber = __turbopack_context__.r("[project]/node_modules/bignumber.js/bignumber.js [app-route] (ecmascript)");
            //if (number > 9007199254740992 || number < -9007199254740992)
            // Bignumber has stricter check: everything with length > 15 digits disallowed
            if (string.length > 15) return _options.storeAsString ? string : _options.useNativeBigInt ? BigInt(string) : new BigNumber(string);
            else return !_options.alwaysParseAsBig ? number : _options.useNativeBigInt ? BigInt(number) : new BigNumber(number);
        }
    }, string = function() {
        // Parse a string value.
        var hex, i, string = '', uffff;
        // When parsing for string values, we must look for " and \ characters.
        if (ch === '"') {
            var startAt = at;
            while(next()){
                if (ch === '"') {
                    if (at - 1 > startAt) string += text.substring(startAt, at - 1);
                    next();
                    return string;
                }
                if (ch === '\\') {
                    if (at - 1 > startAt) string += text.substring(startAt, at - 1);
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for(i = 0; i < 4; i += 1){
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                    startAt = at;
                }
            }
        }
        error('Bad string');
    }, white = function() {
        // Skip whitespace.
        while(ch && ch <= ' '){
            next();
        }
    }, word = function() {
        // true, false, or null.
        switch(ch){
            case 't':
                next('t');
                next('r');
                next('u');
                next('e');
                return true;
            case 'f':
                next('f');
                next('a');
                next('l');
                next('s');
                next('e');
                return false;
            case 'n':
                next('n');
                next('u');
                next('l');
                next('l');
                return null;
        }
        error("Unexpected '" + ch + "'");
    }, value, array = function() {
        // Parse an array value.
        var array = [];
        if (ch === '[') {
            next('[');
            white();
            if (ch === ']') {
                next(']');
                return array; // empty array
            }
            while(ch){
                array.push(value());
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error('Bad array');
    }, object = function() {
        // Parse an object value.
        var key, object = Object.create(null);
        if (ch === '{') {
            next('{');
            white();
            if (ch === '}') {
                next('}');
                return object; // empty object
            }
            while(ch){
                key = string();
                white();
                next(':');
                if (_options.strict === true && Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"');
                }
                if (suspectProtoRx.test(key) === true) {
                    if (_options.protoAction === 'error') {
                        error('Object contains forbidden prototype property');
                    } else if (_options.protoAction === 'ignore') {
                        value();
                    } else {
                        object[key] = value();
                    }
                } else if (suspectConstructorRx.test(key) === true) {
                    if (_options.constructorAction === 'error') {
                        error('Object contains forbidden constructor property');
                    } else if (_options.constructorAction === 'ignore') {
                        value();
                    } else {
                        object[key] = value();
                    }
                } else {
                    object[key] = value();
                }
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error('Bad object');
    };
    value = function() {
        // Parse a JSON value. It could be an object, an array, a string, a number,
        // or a word.
        white();
        switch(ch){
            case '{':
                return object();
            case '[':
                return array();
            case '"':
                return string();
            case '-':
                return number();
            default:
                return ch >= '0' && ch <= '9' ? number() : word();
        }
    };
    // Return the json_parse function. It will have access to all of the above
    // functions and variables.
    return function(source, reviver) {
        var result;
        text = source + '';
        at = 0;
        ch = ' ';
        result = value();
        white();
        if (ch) {
            error('Syntax error');
        }
        // If there is a reviver function, we recursively walk the new structure,
        // passing each name/value pair to the reviver function for possible
        // transformation, starting with a temporary root object that holds the result
        // in an empty key. If there is not a reviver function, we simply return the
        // result.
        return typeof reviver === 'function' ? function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                Object.keys(value).forEach(function(k) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                });
            }
            return reviver.call(holder, key, value);
        }({
            '': result
        }, '') : result;
    };
};
module.exports = json_parse;
}),
"[project]/node_modules/json-bigint/lib/stringify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var BigNumber = __turbopack_context__.r("[project]/node_modules/bignumber.js/bignumber.js [app-route] (ecmascript)");
/*
    json2.js
    2013-05-26

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/ /*jslint evil: true, regexp: true */ /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/ // Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
var JSON = module.exports;
(function() {
    'use strict';
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }, rep;
    function quote(string) {
        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        // Produce a string from holder[key].
        var i, k, v, length, mind = gap, partial, value = holder[key], isBigNumber = value != null && (value instanceof BigNumber || BigNumber.isBigNumber(value));
        // If the value has a toJSON method, call it to obtain a replacement value.
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        // What happens next depends on the value's type.
        switch(typeof value){
            case 'string':
                if (isBigNumber) {
                    return value;
                } else {
                    return quote(value);
                }
            case 'number':
                // JSON numbers must be finite. Encode non-finite numbers as null.
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
            case 'bigint':
                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.
                return String(value);
            // If the type is 'object', we might be dealing with an object or an array or
            // null.
            case 'object':
                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.
                if (!value) {
                    return 'null';
                }
                // Make an array to hold the partial results of stringifying this object value.
                gap += indent;
                partial = [];
                // Is the value an array?
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.
                    length = value.length;
                    for(i = 0; i < length; i += 1){
                        partial[i] = str(i, value) || 'null';
                    }
                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                // If the replacer is an array, use it to select the members to be stringified.
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for(i = 0; i < length; i += 1){
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    // Otherwise, iterate through all of the keys in the object.
                    Object.keys(value).forEach(function(k) {
                        var v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    });
                }
                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    // If the JSON object does not yet have a stringify method, give it one.
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function(value, replacer, space) {
            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.
            var i;
            gap = '';
            indent = '';
            // If the space parameter is a number, make an indent string containing that
            // many spaces.
            if (typeof space === 'number') {
                for(i = 0; i < space; i += 1){
                    indent += ' ';
                }
            // If the space parameter is a string, it will be used as the indent string.
            } else if (typeof space === 'string') {
                indent = space;
            }
            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.
            return str('', {
                '': value
            });
        };
    }
})();
}),
"[project]/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var jws = __turbopack_context__.r("[project]/node_modules/jws/index.js [app-route] (ecmascript)");
module.exports = function(jwt, options) {
    options = options || {};
    var decoded = jws.decode(jwt, options);
    if (!decoded) {
        return null;
    }
    var payload = decoded.payload;
    //try parse the payload
    if (typeof payload === 'string') {
        try {
            var obj = JSON.parse(payload);
            if (obj !== null && typeof obj === 'object') {
                payload = obj;
            }
        } catch (e) {}
    }
    //return header if `complete` option is enabled.  header includes claims
    //such as `kid` and `alg` used to select the key within a JWKS needed to
    //verify the signature
    if (options.complete === true) {
        return {
            header: decoded.header,
            payload: payload,
            signature: decoded.signature
        };
    }
    return payload;
};
}),
"[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    decode: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)"),
    verify: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/verify.js [app-route] (ecmascript)"),
    sign: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/sign.js [app-route] (ecmascript)"),
    JsonWebTokenError: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)"),
    NotBeforeError: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)"),
    TokenExpiredError: __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)")
};
}),
"[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = function(message, error) {
    Error.call(this, message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'JsonWebTokenError';
    this.message = message;
    if (error) this.inner = error;
};
JsonWebTokenError.prototype = Object.create(Error.prototype);
JsonWebTokenError.prototype.constructor = JsonWebTokenError;
module.exports = JsonWebTokenError;
}),
"[project]/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
var NotBeforeError = function(message, date) {
    JsonWebTokenError.call(this, message);
    this.name = 'NotBeforeError';
    this.date = date;
};
NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
NotBeforeError.prototype.constructor = NotBeforeError;
module.exports = NotBeforeError;
}),
"[project]/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var JsonWebTokenError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
var TokenExpiredError = function(message, expiredAt) {
    JsonWebTokenError.call(this, message);
    this.name = 'TokenExpiredError';
    this.expiredAt = expiredAt;
};
TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
TokenExpiredError.prototype.constructor = TokenExpiredError;
module.exports = TokenExpiredError;
}),
"[project]/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const semver = __turbopack_context__.r("[project]/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '>=15.7.0');
}),
"[project]/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var semver = __turbopack_context__.r("[project]/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '^6.12.0 || >=8.0.0');
}),
"[project]/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const semver = __turbopack_context__.r("[project]/node_modules/semver/index.js [app-route] (ecmascript)");
module.exports = semver.satisfies(process.version, '>=16.9.0');
}),
"[project]/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var ms = __turbopack_context__.r("[project]/node_modules/ms/index.js [app-route] (ecmascript)");
module.exports = function(time, iat) {
    var timestamp = iat || Math.floor(Date.now() / 1000);
    if (typeof time === 'string') {
        var milliseconds = ms(time);
        if (typeof milliseconds === 'undefined') {
            return;
        }
        return Math.floor(timestamp + milliseconds / 1000);
    } else if (typeof time === 'number') {
        return timestamp + time;
    } else {
        return;
    }
};
}),
"[project]/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const ASYMMETRIC_KEY_DETAILS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js [app-route] (ecmascript)");
const RSA_PSS_KEY_DETAILS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js [app-route] (ecmascript)");
const allowedAlgorithmsForKeys = {
    'ec': [
        'ES256',
        'ES384',
        'ES512'
    ],
    'rsa': [
        'RS256',
        'PS256',
        'RS384',
        'PS384',
        'RS512',
        'PS512'
    ],
    'rsa-pss': [
        'PS256',
        'PS384',
        'PS512'
    ]
};
const allowedCurves = {
    ES256: 'prime256v1',
    ES384: 'secp384r1',
    ES512: 'secp521r1'
};
module.exports = function(algorithm, key) {
    if (!algorithm || !key) return;
    const keyType = key.asymmetricKeyType;
    if (!keyType) return;
    const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
    if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
    }
    if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(', ')}.`);
    }
    /*
   * Ignore the next block from test coverage because it gets executed
   * conditionally depending on the Node version. Not ignoring it would
   * prevent us from reaching the target % of coverage for versions of
   * Node under 15.7.0.
   */ /* istanbul ignore next */ if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch(keyType){
            case 'ec':
                const keyCurve = key.asymmetricKeyDetails.namedCurve;
                const allowedCurve = allowedCurves[algorithm];
                if (keyCurve !== allowedCurve) {
                    throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
                }
                break;
            case 'rsa-pss':
                if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
                    const length = parseInt(algorithm.slice(-3), 10);
                    const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
                    if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
                    }
                    if (saltLength !== undefined && saltLength > length >> 3) {
                        throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
                    }
                }
                break;
        }
    }
};
}),
"[project]/node_modules/jsonwebtoken/sign.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const timespan = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)");
const PS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)");
const validateAsymmetricKey = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)");
const jws = __turbopack_context__.r("[project]/node_modules/jws/index.js [app-route] (ecmascript)");
const includes = __turbopack_context__.r("[project]/node_modules/lodash.includes/index.js [app-route] (ecmascript)");
const isBoolean = __turbopack_context__.r("[project]/node_modules/lodash.isboolean/index.js [app-route] (ecmascript)");
const isInteger = __turbopack_context__.r("[project]/node_modules/lodash.isinteger/index.js [app-route] (ecmascript)");
const isNumber = __turbopack_context__.r("[project]/node_modules/lodash.isnumber/index.js [app-route] (ecmascript)");
const isPlainObject = __turbopack_context__.r("[project]/node_modules/lodash.isplainobject/index.js [app-route] (ecmascript)");
const isString = __turbopack_context__.r("[project]/node_modules/lodash.isstring/index.js [app-route] (ecmascript)");
const once = __turbopack_context__.r("[project]/node_modules/lodash.once/index.js [app-route] (ecmascript)");
const { KeyObject, createSecretKey, createPrivateKey } = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const SUPPORTED_ALGS = [
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'HS256',
    'HS384',
    'HS512',
    'none'
];
if (PS_SUPPORTED) {
    SUPPORTED_ALGS.splice(3, 0, 'PS256', 'PS384', 'PS512');
}
const sign_options_schema = {
    expiresIn: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
    },
    notBefore: {
        isValid: function(value) {
            return isInteger(value) || isString(value) && value;
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
    },
    audience: {
        isValid: function(value) {
            return isString(value) || Array.isArray(value);
        },
        message: '"audience" must be a string or array'
    },
    algorithm: {
        isValid: includes.bind(null, SUPPORTED_ALGS),
        message: '"algorithm" must be a valid string enum value'
    },
    header: {
        isValid: isPlainObject,
        message: '"header" must be an object'
    },
    encoding: {
        isValid: isString,
        message: '"encoding" must be a string'
    },
    issuer: {
        isValid: isString,
        message: '"issuer" must be a string'
    },
    subject: {
        isValid: isString,
        message: '"subject" must be a string'
    },
    jwtid: {
        isValid: isString,
        message: '"jwtid" must be a string'
    },
    noTimestamp: {
        isValid: isBoolean,
        message: '"noTimestamp" must be a boolean'
    },
    keyid: {
        isValid: isString,
        message: '"keyid" must be a string'
    },
    mutatePayload: {
        isValid: isBoolean,
        message: '"mutatePayload" must be a boolean'
    },
    allowInsecureKeySizes: {
        isValid: isBoolean,
        message: '"allowInsecureKeySizes" must be a boolean'
    },
    allowInvalidAsymmetricKeyTypes: {
        isValid: isBoolean,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
    }
};
const registered_claims_schema = {
    iat: {
        isValid: isNumber,
        message: '"iat" should be a number of seconds'
    },
    exp: {
        isValid: isNumber,
        message: '"exp" should be a number of seconds'
    },
    nbf: {
        isValid: isNumber,
        message: '"nbf" should be a number of seconds'
    }
};
function validate(schema, allowUnknown, object, parameterName) {
    if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
    }
    Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
            if (!allowUnknown) {
                throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
            }
            return;
        }
        if (!validator.isValid(object[key])) {
            throw new Error(validator.message);
        }
    });
}
function validateOptions(options) {
    return validate(sign_options_schema, false, options, 'options');
}
function validatePayload(payload) {
    return validate(registered_claims_schema, true, payload, 'payload');
}
const options_to_payload = {
    'audience': 'aud',
    'issuer': 'iss',
    'subject': 'sub',
    'jwtid': 'jti'
};
const options_for_objects = [
    'expiresIn',
    'notBefore',
    'noTimestamp',
    'audience',
    'issuer',
    'subject',
    'jwtid'
];
module.exports = function(payload, secretOrPrivateKey, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    } else {
        options = options || {};
    }
    const isObjectPayload = typeof payload === 'object' && !Buffer.isBuffer(payload);
    const header = Object.assign({
        alg: options.algorithm || 'HS256',
        typ: isObjectPayload ? 'JWT' : undefined,
        kid: options.keyid
    }, options.header);
    function failure(err) {
        if (callback) {
            return callback(err);
        }
        throw err;
    }
    if (!secretOrPrivateKey && options.algorithm !== 'none') {
        return failure(new Error('secretOrPrivateKey must have a value'));
    }
    if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
            secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_) {
            try {
                secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === 'string' ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
            } catch (_) {
                return failure(new Error('secretOrPrivateKey is not valid key material'));
            }
        }
    }
    if (header.alg.startsWith('HS') && secretOrPrivateKey.type !== 'secret') {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
    } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== 'private') {
            return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith('ES') && secretOrPrivateKey.asymmetricKeyDetails !== undefined && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
            return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
    }
    if (typeof payload === 'undefined') {
        return failure(new Error('payload is required'));
    } else if (isObjectPayload) {
        try {
            validatePayload(payload);
        } catch (error) {
            return failure(error);
        }
        if (!options.mutatePayload) {
            payload = Object.assign({}, payload);
        }
    } else {
        const invalid_options = options_for_objects.filter(function(opt) {
            return typeof options[opt] !== 'undefined';
        });
        if (invalid_options.length > 0) {
            return failure(new Error('invalid ' + invalid_options.join(',') + ' option for ' + typeof payload + ' payload'));
        }
    }
    if (typeof payload.exp !== 'undefined' && typeof options.expiresIn !== 'undefined') {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    }
    if (typeof payload.nbf !== 'undefined' && typeof options.notBefore !== 'undefined') {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    }
    try {
        validateOptions(options);
    } catch (error) {
        return failure(error);
    }
    if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
            validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
            return failure(error);
        }
    }
    const timestamp = payload.iat || Math.floor(Date.now() / 1000);
    if (options.noTimestamp) {
        delete payload.iat;
    } else if (isObjectPayload) {
        payload.iat = timestamp;
    }
    if (typeof options.notBefore !== 'undefined') {
        try {
            payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.nbf === 'undefined') {
            return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    if (typeof options.expiresIn !== 'undefined' && typeof payload === 'object') {
        try {
            payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
            return failure(err);
        }
        if (typeof payload.exp === 'undefined') {
            return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
    }
    Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== 'undefined') {
            if (typeof payload[claim] !== 'undefined') {
                return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
            }
            payload[claim] = options[key];
        }
    });
    const encoding = options.encoding || 'utf8';
    if (typeof callback === 'function') {
        callback = callback && once(callback);
        jws.createSign({
            header: header,
            privateKey: secretOrPrivateKey,
            payload: payload,
            encoding: encoding
        }).once('error', callback).once('done', function(signature) {
            // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
            if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
                return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
            }
            callback(null, signature);
        });
    } else {
        let signature = jws.sign({
            header: header,
            payload: payload,
            secret: secretOrPrivateKey,
            encoding: encoding
        });
        // TODO: Remove in favor of the modulus length check before signing once node 15+ is the minimum supported version
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
    }
};
}),
"[project]/node_modules/jsonwebtoken/verify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const JsonWebTokenError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/JsonWebTokenError.js [app-route] (ecmascript)");
const NotBeforeError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/NotBeforeError.js [app-route] (ecmascript)");
const TokenExpiredError = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/TokenExpiredError.js [app-route] (ecmascript)");
const decode = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/decode.js [app-route] (ecmascript)");
const timespan = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/timespan.js [app-route] (ecmascript)");
const validateAsymmetricKey = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js [app-route] (ecmascript)");
const PS_SUPPORTED = __turbopack_context__.r("[project]/node_modules/jsonwebtoken/lib/psSupported.js [app-route] (ecmascript)");
const jws = __turbopack_context__.r("[project]/node_modules/jws/index.js [app-route] (ecmascript)");
const { KeyObject, createSecretKey, createPublicKey } = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const PUB_KEY_ALGS = [
    'RS256',
    'RS384',
    'RS512'
];
const EC_KEY_ALGS = [
    'ES256',
    'ES384',
    'ES512'
];
const RSA_KEY_ALGS = [
    'RS256',
    'RS384',
    'RS512'
];
const HS_ALGS = [
    'HS256',
    'HS384',
    'HS512'
];
if (PS_SUPPORTED) {
    PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
    RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
}
module.exports = function(jwtString, secretOrPublicKey, options, callback) {
    if (typeof options === 'function' && !callback) {
        callback = options;
        options = {};
    }
    if (!options) {
        options = {};
    }
    //clone this object since we are going to mutate it.
    options = Object.assign({}, options);
    let done;
    if (callback) {
        done = callback;
    } else {
        done = function(err, data) {
            if (err) throw err;
            return data;
        };
    }
    if (options.clockTimestamp && typeof options.clockTimestamp !== 'number') {
        return done(new JsonWebTokenError('clockTimestamp must be a number'));
    }
    if (options.nonce !== undefined && (typeof options.nonce !== 'string' || options.nonce.trim() === '')) {
        return done(new JsonWebTokenError('nonce must be a non-empty string'));
    }
    if (options.allowInvalidAsymmetricKeyTypes !== undefined && typeof options.allowInvalidAsymmetricKeyTypes !== 'boolean') {
        return done(new JsonWebTokenError('allowInvalidAsymmetricKeyTypes must be a boolean'));
    }
    const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!jwtString) {
        return done(new JsonWebTokenError('jwt must be provided'));
    }
    if (typeof jwtString !== 'string') {
        return done(new JsonWebTokenError('jwt must be a string'));
    }
    const parts = jwtString.split('.');
    if (parts.length !== 3) {
        return done(new JsonWebTokenError('jwt malformed'));
    }
    let decodedToken;
    try {
        decodedToken = decode(jwtString, {
            complete: true
        });
    } catch (err) {
        return done(err);
    }
    if (!decodedToken) {
        return done(new JsonWebTokenError('invalid token'));
    }
    const header = decodedToken.header;
    let getSecret;
    if (typeof secretOrPublicKey === 'function') {
        if (!callback) {
            return done(new JsonWebTokenError('verify must be called asynchronous if secret or public key is provided as a callback'));
        }
        getSecret = secretOrPublicKey;
    } else {
        getSecret = function(header, secretCallback) {
            return secretCallback(null, secretOrPublicKey);
        };
    }
    return getSecret(header, function(err, secretOrPublicKey) {
        if (err) {
            return done(new JsonWebTokenError('error in secret or public key callback: ' + err.message));
        }
        const hasSignature = parts[2].trim() !== '';
        if (!hasSignature && secretOrPublicKey) {
            return done(new JsonWebTokenError('jwt signature is required'));
        }
        if (hasSignature && !secretOrPublicKey) {
            return done(new JsonWebTokenError('secret or public key must be provided'));
        }
        if (!hasSignature && !options.algorithms) {
            return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey != null && !(secretOrPublicKey instanceof KeyObject)) {
            try {
                secretOrPublicKey = createPublicKey(secretOrPublicKey);
            } catch (_) {
                try {
                    secretOrPublicKey = createSecretKey(typeof secretOrPublicKey === 'string' ? Buffer.from(secretOrPublicKey) : secretOrPublicKey);
                } catch (_) {
                    return done(new JsonWebTokenError('secretOrPublicKey is not valid key material'));
                }
            }
        }
        if (!options.algorithms) {
            if (secretOrPublicKey.type === 'secret') {
                options.algorithms = HS_ALGS;
            } else if ([
                'rsa',
                'rsa-pss'
            ].includes(secretOrPublicKey.asymmetricKeyType)) {
                options.algorithms = RSA_KEY_ALGS;
            } else if (secretOrPublicKey.asymmetricKeyType === 'ec') {
                options.algorithms = EC_KEY_ALGS;
            } else {
                options.algorithms = PUB_KEY_ALGS;
            }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
            return done(new JsonWebTokenError('invalid algorithm'));
        }
        if (header.alg.startsWith('HS') && secretOrPublicKey.type !== 'secret') {
            return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey.type !== 'public') {
            return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
            try {
                validateAsymmetricKey(header.alg, secretOrPublicKey);
            } catch (e) {
                return done(e);
            }
        }
        let valid;
        try {
            valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey);
        } catch (e) {
            return done(e);
        }
        if (!valid) {
            return done(new JsonWebTokenError('invalid signature'));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== 'undefined' && !options.ignoreNotBefore) {
            if (typeof payload.nbf !== 'number') {
                return done(new JsonWebTokenError('invalid nbf value'));
            }
            if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
                return done(new NotBeforeError('jwt not active', new Date(payload.nbf * 1000)));
            }
        }
        if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
            if (typeof payload.exp !== 'number') {
                return done(new JsonWebTokenError('invalid exp value'));
            }
            if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
            }
        }
        if (options.audience) {
            const audiences = Array.isArray(options.audience) ? options.audience : [
                options.audience
            ];
            const target = Array.isArray(payload.aud) ? payload.aud : [
                payload.aud
            ];
            const match = target.some(function(targetAudience) {
                return audiences.some(function(audience) {
                    return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
                });
            });
            if (!match) {
                return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
            }
        }
        if (options.issuer) {
            const invalid_issuer = typeof options.issuer === 'string' && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
            if (invalid_issuer) {
                return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
            }
        }
        if (options.subject) {
            if (payload.sub !== options.subject) {
                return done(new JsonWebTokenError('jwt subject invalid. expected: ' + options.subject));
            }
        }
        if (options.jwtid) {
            if (payload.jti !== options.jwtid) {
                return done(new JsonWebTokenError('jwt jwtid invalid. expected: ' + options.jwtid));
            }
        }
        if (options.nonce) {
            if (payload.nonce !== options.nonce) {
                return done(new JsonWebTokenError('jwt nonce invalid. expected: ' + options.nonce));
            }
        }
        if (options.maxAge) {
            if (typeof payload.iat !== 'number') {
                return done(new JsonWebTokenError('iat required when maxAge is specified'));
            }
            const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
            if (typeof maxAgeTimestamp === 'undefined') {
                return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
            }
            if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
                return done(new TokenExpiredError('maxAge exceeded', new Date(maxAgeTimestamp * 1000)));
            }
        }
        if (options.complete === true) {
            const signature = decodedToken.signature;
            return done(null, {
                header: header,
                payload: payload,
                signature: signature
            });
        }
        return done(null, payload);
    });
};
}),
"[project]/node_modules/jwa/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
var formatEcdsa = __turbopack_context__.r("[project]/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
var MSG_INVALID_SECRET = 'secret must be a string or buffer';
var MSG_INVALID_VERIFIER_KEY = 'key must be a string or a buffer';
var MSG_INVALID_SIGNER_KEY = 'key must be a string, a buffer or an object';
var supportsKeyObjects = typeof crypto.createPublicKey === 'function';
if (supportsKeyObjects) {
    MSG_INVALID_VERIFIER_KEY += ' or a KeyObject';
    MSG_INVALID_SECRET += 'or a KeyObject';
}
function checkIsPublicKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key !== 'object') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.type !== 'string') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.asymmetricKeyType !== 'string') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
    if (typeof key.export !== 'function') {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
    }
}
;
function checkIsPrivateKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return;
    }
    if (typeof key === 'object') {
        return;
    }
    throw typeError(MSG_INVALID_SIGNER_KEY);
}
;
function checkIsSecretKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }
    if (typeof key === 'string') {
        return key;
    }
    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key !== 'object') {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (key.type !== 'secret') {
        throw typeError(MSG_INVALID_SECRET);
    }
    if (typeof key.export !== 'function') {
        throw typeError(MSG_INVALID_SECRET);
    }
}
function fromBase64(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function toBase64(base64url) {
    base64url = base64url.toString();
    var padding = 4 - base64url.length % 4;
    if (padding !== 4) {
        for(var i = 0; i < padding; ++i){
            base64url += '=';
        }
    }
    return base64url.replace(/\-/g, '+').replace(/_/g, '/');
}
function typeError(template) {
    var args = [].slice.call(arguments, 1);
    var errMsg = util.format.bind(util, template).apply(null, args);
    return new TypeError(errMsg);
}
function bufferOrString(obj) {
    return Buffer.isBuffer(obj) || typeof obj === 'string';
}
function normalizeInput(thing) {
    if (!bufferOrString(thing)) thing = JSON.stringify(thing);
    return thing;
}
function createHmacSigner(bits) {
    return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac('sha' + bits, secret);
        var sig = (hmac.update(thing), hmac.digest('base64'));
        return fromBase64(sig);
    };
}
var bufferEqual;
var timingSafeEqual = 'timingSafeEqual' in crypto ? function timingSafeEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    return crypto.timingSafeEqual(a, b);
} : function timingSafeEqual(a, b) {
    if (!bufferEqual) {
        bufferEqual = __turbopack_context__.r("[project]/node_modules/buffer-equal-constant-time/index.js [app-route] (ecmascript)");
    }
    return bufferEqual(a, b);
};
function createHmacVerifier(bits) {
    return function verify(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return timingSafeEqual(Buffer.from(signature), Buffer.from(computedSig));
    };
}
function createKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        // Even though we are specifying "RSA" here, this works with ECDSA
        // keys as well.
        var signer = crypto.createSign('RSA-SHA' + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, 'base64'));
        return fromBase64(sig);
    };
}
function createKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify('RSA-SHA' + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, 'base64');
    };
}
function createPSSKeySigner(bits) {
    return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign('RSA-SHA' + bits);
        var sig = (signer.update(thing), signer.sign({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, 'base64'));
        return fromBase64(sig);
    };
}
function createPSSKeyVerifier(bits) {
    return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify('RSA-SHA' + bits);
        verifier.update(thing);
        return verifier.verify({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, 'base64');
    };
}
function createECDSASigner(bits) {
    var inner = createKeySigner(bits);
    return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, 'ES' + bits);
        return signature;
    };
}
function createECDSAVerifer(bits) {
    var inner = createKeyVerifier(bits);
    return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, 'ES' + bits).toString('base64');
        var result = inner(thing, signature, publicKey);
        return result;
    };
}
function createNoneSigner() {
    return function sign() {
        return '';
    };
}
function createNoneVerifier() {
    return function verify(thing, signature) {
        return signature === '';
    };
}
module.exports = function jwa(algorithm) {
    var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
    };
    var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
    };
    var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
    if (!match) throw typeError(MSG_INVALID_ALGORITHM, algorithm);
    var algo = (match[1] || match[3]).toLowerCase();
    var bits = match[2];
    return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
    };
};
}),
"[project]/node_modules/jwks-rsa/src/JwksClient.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const logger = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")('jwks');
const { retrieveSigningKeys } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/utils.js [app-route] (ecmascript)");
const { request, cacheSigningKey, rateLimitSigningKey, getKeysInterceptor, callbackSupport } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/wrappers/index.js [app-route] (ecmascript)");
const JwksError = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/JwksError.js [app-route] (ecmascript)");
const SigningKeyNotFoundError = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/SigningKeyNotFoundError.js [app-route] (ecmascript)");
class JwksClient {
    constructor(options){
        this.options = {
            rateLimit: false,
            cache: true,
            timeout: 30000,
            ...options
        };
        // Initialize wrappers.
        if (this.options.getKeysInterceptor) {
            this.getSigningKey = getKeysInterceptor(this, options);
        }
        if (this.options.rateLimit) {
            this.getSigningKey = rateLimitSigningKey(this, options);
        }
        if (this.options.cache) {
            this.getSigningKey = cacheSigningKey(this, options);
        }
        this.getSigningKey = callbackSupport(this, options);
    }
    async getKeys() {
        logger(`Fetching keys from '${this.options.jwksUri}'`);
        try {
            const res = await request({
                uri: this.options.jwksUri,
                headers: this.options.requestHeaders,
                agent: this.options.requestAgent,
                timeout: this.options.timeout,
                fetcher: this.options.fetcher
            });
            logger('Keys:', res.keys);
            return res.keys;
        } catch (err) {
            const { errorMsg } = err;
            logger('Failure:', errorMsg || err);
            const error = errorMsg ? new JwksError(errorMsg) : err;
            error.isEndpointUnavailable = true;
            throw error;
        }
    }
    async getSigningKeys() {
        const keys = await this.getKeys();
        if (!keys || !keys.length) {
            throw new JwksError('The JWKS endpoint did not contain any keys');
        }
        const signingKeys = await retrieveSigningKeys(keys);
        if (!signingKeys.length) {
            throw new JwksError('The JWKS endpoint did not contain any signing keys');
        }
        logger('Signing Keys:', signingKeys);
        return signingKeys;
    }
    async getSigningKey(kid) {
        logger(`Fetching signing key for '${kid}'`);
        const keys = await this.getSigningKeys();
        const kidDefined = kid !== undefined && kid !== null;
        if (!kidDefined && keys.length > 1) {
            logger('No KID specified and JWKS endpoint returned more than 1 key');
            throw new SigningKeyNotFoundError('No KID specified and JWKS endpoint returned more than 1 key');
        }
        const key = keys.find((k)=>!kidDefined || k.kid === kid);
        if (key) {
            return key;
        } else {
            logger(`Unable to find a signing key that matches '${kid}'`);
            throw new SigningKeyNotFoundError(`Unable to find a signing key that matches '${kid}'`);
        }
    }
}
module.exports = {
    JwksClient
};
}),
"[project]/node_modules/jwks-rsa/src/errors/ArgumentError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

function ArgumentError(message) {
    Error.call(this, message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ArgumentError';
    this.message = message;
}
ArgumentError.prototype = Object.create(Error.prototype);
ArgumentError.prototype.constructor = ArgumentError;
module.exports = ArgumentError;
}),
"[project]/node_modules/jwks-rsa/src/errors/JwksError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

function JwksError(message) {
    Error.call(this, message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'JwksError';
    this.message = message;
}
JwksError.prototype = Object.create(Error.prototype);
JwksError.prototype.constructor = JwksError;
module.exports = JwksError;
}),
"[project]/node_modules/jwks-rsa/src/errors/JwksRateLimitError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

function JwksRateLimitError(message) {
    Error.call(this, message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'JwksRateLimitError';
    this.message = message;
}
JwksRateLimitError.prototype = Object.create(Error.prototype);
JwksRateLimitError.prototype.constructor = JwksRateLimitError;
module.exports = JwksRateLimitError;
}),
"[project]/node_modules/jwks-rsa/src/errors/SigningKeyNotFoundError.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

function SigningKeyNotFoundError(message) {
    Error.call(this, message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'SigningKeyNotFoundError';
    this.message = message;
}
SigningKeyNotFoundError.prototype = Object.create(Error.prototype);
SigningKeyNotFoundError.prototype.constructor = SigningKeyNotFoundError;
module.exports = SigningKeyNotFoundError;
}),
"[project]/node_modules/jwks-rsa/src/errors/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    ArgumentError: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/ArgumentError.js [app-route] (ecmascript)"),
    JwksError: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/JwksError.js [app-route] (ecmascript)"),
    JwksRateLimitError: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/JwksRateLimitError.js [app-route] (ecmascript)"),
    SigningKeyNotFoundError: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/SigningKeyNotFoundError.js [app-route] (ecmascript)")
};
}),
"[project]/node_modules/jwks-rsa/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { JwksClient } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/JwksClient.js [app-route] (ecmascript)");
const errors = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/index.js [app-route] (ecmascript)");
const { hapiJwt2Key, hapiJwt2KeyAsync } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/hapi.js [app-route] (ecmascript)");
const { expressJwtSecret } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/express.js [app-route] (ecmascript)");
const { koaJwtSecret } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/koa.js [app-route] (ecmascript)");
const { passportJwtSecret } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/passport.js [app-route] (ecmascript)");
module.exports = (options)=>{
    return new JwksClient(options);
};
module.exports.JwksClient = JwksClient;
module.exports.ArgumentError = errors.ArgumentError;
module.exports.JwksError = errors.JwksError;
module.exports.JwksRateLimitError = errors.JwksRateLimitError;
module.exports.SigningKeyNotFoundError = errors.SigningKeyNotFoundError;
module.exports.expressJwtSecret = expressJwtSecret;
module.exports.hapiJwt2Key = hapiJwt2Key;
module.exports.hapiJwt2KeyAsync = hapiJwt2KeyAsync;
module.exports.koaJwtSecret = koaJwtSecret;
module.exports.passportJwtSecret = passportJwtSecret;
}),
"[project]/node_modules/jwks-rsa/src/integrations/config.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const allowedSignatureAlg = [
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'EdDSA'
];
module.exports = allowedSignatureAlg;
}),
"[project]/node_modules/jwks-rsa/src/integrations/express.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { ArgumentError } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/index.js [app-route] (ecmascript)");
const { JwksClient } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/JwksClient.js [app-route] (ecmascript)");
const supportedAlg = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/config.js [app-route] (ecmascript)");
const handleSigningKeyError = (err, cb)=>{
    // If we didn't find a match, can't provide a key.
    if (err && err.name === 'SigningKeyNotFoundError') {
        return cb(null);
    }
    // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
    if (err) {
        return cb(err);
    }
};
module.exports.expressJwtSecret = function(options) {
    if (options === null || options === undefined) {
        throw new ArgumentError('An options object must be provided when initializing expressJwtSecret');
    }
    const client = new JwksClient(options);
    const onError = options.handleSigningKeyError || handleSigningKeyError;
    const expressJwt7Provider = async (req, token)=>{
        if (!token) {
            return;
        }
        const header = token.header;
        if (!header || !supportedAlg.includes(header.alg)) {
            return;
        }
        try {
            const key = await client.getSigningKey(header.kid);
            return key.publicKey || key.rsaPublicKey;
        } catch (err) {
            return new Promise((resolve, reject)=>{
                onError(err, (newError)=>{
                    if (!newError) {
                        return resolve();
                    }
                    reject(newError);
                });
            });
        }
    };
    return function secretProvider(req, header, payload, cb) {
        //This function has 4 parameters to make it work with express-jwt@6
        //but it also supports express-jwt@7 which only has 2.
        if (arguments.length === 4) {
            expressJwt7Provider(req, {
                header
            }).then((key)=>{
                setImmediate(cb, null, key);
            }).catch((err)=>{
                setImmediate(cb, err);
            });
            return;
        }
        return expressJwt7Provider(req, arguments[1]);
    };
};
}),
"[project]/node_modules/jwks-rsa/src/integrations/hapi.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { ArgumentError } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/index.js [app-route] (ecmascript)");
const { JwksClient } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/JwksClient.js [app-route] (ecmascript)");
const supportedAlg = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/config.js [app-route] (ecmascript)");
const handleSigningKeyError = (err, cb)=>{
    // If we didn't find a match, can't provide a key.
    if (err && err.name === 'SigningKeyNotFoundError') {
        return cb(err, null, null);
    }
    // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
    if (err) {
        return cb(err, null, null);
    }
};
/**
 * Call hapiJwt2Key as a Promise
 * @param {object} options 
 * @returns {Promise}
 */ module.exports.hapiJwt2KeyAsync = (options)=>{
    const secretProvider = module.exports.hapiJwt2Key(options);
    return function(decoded) {
        return new Promise((resolve, reject)=>{
            const cb = (err, key)=>{
                !key || err ? reject(err) : resolve({
                    key
                });
            };
            secretProvider(decoded, cb);
        });
    };
};
module.exports.hapiJwt2Key = function(options) {
    if (options === null || options === undefined) {
        throw new ArgumentError('An options object must be provided when initializing hapiJwt2Key');
    }
    const client = new JwksClient(options);
    const onError = options.handleSigningKeyError || handleSigningKeyError;
    return function secretProvider(decoded, cb) {
        // We cannot find a signing certificate if there is no header (no kid).
        if (!decoded || !decoded.header) {
            return cb(new Error('Cannot find a signing certificate if there is no header'), null, null);
        }
        if (!supportedAlg.includes(decoded.header.alg)) {
            return cb(new Error('Unsupported algorithm ' + decoded.header.alg + ' supplied.'), null, null);
        }
        client.getSigningKey(decoded.header.kid).then((key)=>{
            return cb(null, key.publicKey || key.rsaPublicKey, key);
        }).catch((err)=>{
            return onError(err, (newError)=>cb(newError, null, null));
        });
    };
};
}),
"[project]/node_modules/jwks-rsa/src/integrations/koa.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { ArgumentError } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/index.js [app-route] (ecmascript)");
const { JwksClient } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/JwksClient.js [app-route] (ecmascript)");
const supportedAlg = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/config.js [app-route] (ecmascript)");
module.exports.koaJwtSecret = function(options = {}) {
    if (!options.jwksUri) {
        throw new ArgumentError('No JWKS provided. Please provide a jwksUri');
    }
    const client = new JwksClient(options);
    return function secretProvider({ alg, kid } = {}) {
        return new Promise((resolve, reject)=>{
            if (!supportedAlg.includes(alg)) {
                return reject(new Error('Missing / invalid token algorithm'));
            }
            client.getSigningKey(kid).then((key)=>{
                resolve(key.publicKey || key.rsaPublicKey);
            }).catch((err)=>{
                if (options.handleSigningKeyError) {
                    return options.handleSigningKeyError(err).then(reject);
                }
                return reject(err);
            });
        });
    };
};
}),
"[project]/node_modules/jwks-rsa/src/integrations/passport.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const jose = __turbopack_context__.r("[project]/node_modules/jose/dist/webapi/index.js [app-route] (ecmascript)");
const { ArgumentError } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/index.js [app-route] (ecmascript)");
const { JwksClient } = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/JwksClient.js [app-route] (ecmascript)");
const supportedAlg = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/integrations/config.js [app-route] (ecmascript)");
const handleSigningKeyError = (err, cb)=>{
    // If we didn't find a match, can't provide a key.
    if (err && err.name === 'SigningKeyNotFoundError') {
        return cb(null);
    }
    // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
    if (err) {
        return cb(err);
    }
};
module.exports.passportJwtSecret = function(options) {
    if (options === null || options === undefined) {
        throw new ArgumentError('An options object must be provided when initializing passportJwtSecret');
    }
    if (!options.jwksUri) {
        throw new ArgumentError('No JWKS provided. Please provide a jwksUri');
    }
    const client = new JwksClient(options);
    const onError = options.handleSigningKeyError || handleSigningKeyError;
    return function secretProvider(req, rawJwtToken, cb) {
        let decoded;
        try {
            decoded = {
                payload: jose.decodeJwt(rawJwtToken),
                header: jose.decodeProtectedHeader(rawJwtToken)
            };
        } catch (err) {
            decoded = null;
        }
        if (!decoded || !supportedAlg.includes(decoded.header.alg)) {
            return cb(null, null);
        }
        client.getSigningKey(decoded.header.kid).then((key)=>{
            cb(null, key.publicKey || key.rsaPublicKey);
        }).catch((err)=>{
            onError(err, (newError)=>cb(newError, null));
        });
    };
};
}),
"[project]/node_modules/jwks-rsa/src/utils.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const jose = __turbopack_context__.r("[project]/node_modules/jose/dist/webapi/index.js [app-route] (ecmascript)");
const JwksError = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/JwksError.js [app-route] (ecmascript)");
function resolveAlg(jwk) {
    if (jwk.alg) {
        return jwk.alg;
    }
    if (jwk.kty === 'RSA') {
        return 'RS256';
    }
    if (jwk.kty === 'EC') {
        switch(jwk.crv){
            case 'P-256':
                return 'ES256';
            case 'P-384':
                return 'ES384';
            case 'P-521':
                return 'ES512';
        }
    }
    if (jwk.kty === 'OKP') {
        switch(jwk.crv){
            case 'Ed25519':
            case 'Ed448':
                return 'EdDSA';
        }
    }
    throw new JwksError('Unsupported JWK');
}
async function retrieveSigningKeys(jwks) {
    const results = [];
    jwks = jwks.filter(({ use })=>use === 'sig' || use === undefined).filter(({ kty })=>kty === 'RSA' || kty === 'EC' || kty === 'OKP');
    for (const jwk of jwks){
        try {
            const key = await jose.importJWK({
                ...jwk,
                ext: true
            }, resolveAlg(jwk));
            if (key.type !== 'public') {
                continue;
            }
            let getSpki;
            switch(key[Symbol.toStringTag]){
                case 'CryptoKey':
                    {
                        const spki = await jose.exportSPKI(key);
                        getSpki = ()=>spki;
                        break;
                    }
                case 'KeyObject':
                // Assume legacy Node.js version without the Symbol.toStringTag backported
                // Fall through
                default:
                    getSpki = ()=>key.export({
                            format: 'pem',
                            type: 'spki'
                        });
            }
            results.push({
                get publicKey () {
                    return getSpki();
                },
                get rsaPublicKey () {
                    return getSpki();
                },
                getPublicKey () {
                    return getSpki();
                },
                ...typeof jwk.kid === 'string' && jwk.kid ? {
                    kid: jwk.kid
                } : undefined,
                ...typeof jwk.alg === 'string' && jwk.alg ? {
                    alg: jwk.alg
                } : undefined
            });
        } catch (err) {
            continue;
        }
    }
    return results;
}
module.exports = {
    retrieveSigningKeys
};
}),
"[project]/node_modules/jwks-rsa/src/wrappers/cache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const logger = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")('jwks');
const memoizer = __turbopack_context__.r("[project]/node_modules/lru-memoizer/lib/index.js [app-route] (ecmascript)");
const { LRUCache } = __turbopack_context__.r("[project]/node_modules/lru-cache/dist/commonjs/node/index.min.js [app-route] (ecmascript)");
const { promisify, callbackify } = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function cacheWrapper(client, { cacheMaxEntries = 5, cacheMaxAge = 600000, cacheMaxAgeFallback, onStaleCacheFallback }) {
    logger(`Configured caching of signing keys. Max: ${cacheMaxEntries} / Age: ${cacheMaxAge}${cacheMaxAgeFallback ? ` / Fallback: ${cacheMaxAgeFallback}` : ''}`);
    /**
   * cacheMaxAgeFallback: when the JWKS endpoint is unreachable and cacheMaxAge has expired,
   * rather than immediately failing to return a signing key, the lib can continue serving
   * the last known good key for an additional window (cacheMaxAgeFallback ms). This prevents
   * callers from failing on every getSigningKey call during a transient JWKS endpoint downtime.
   *
   * Two load variants: with cacheMaxAgeFallback, maintain a stale-key store so a failed
   * refresh can fall back to the last known good key within the window. Without it, skip
   * the extra cache entirely to avoid any overhead.
   */ let load;
    if (cacheMaxAgeFallback) {
        const staleCache = new LRUCache({
            max: cacheMaxEntries
        });
        const getSigningKey = client.getSigningKey.bind(client);
        load = callbackify(async (kid)=>{
            try {
                const key = await getSigningKey(kid);
                staleCache.set(kid, {
                    key,
                    fetchedAt: Date.now()
                });
                return key;
            } catch (err) {
                if (err.isEndpointUnavailable) {
                    const stale = staleCache.get(kid);
                    if (stale && Date.now() - stale.fetchedAt < cacheMaxAge + cacheMaxAgeFallback) {
                        logger(`JWKS endpoint unavailable, serving stale signing key for '${kid}': ${err.message}`);
                        if (onStaleCacheFallback) {
                            onStaleCacheFallback(err, kid, stale.key);
                        }
                        return stale.key;
                    }
                    logger(`JWKS endpoint unavailable and no valid stale entry for '${kid}', fallback window expired or key never fetched`);
                }
                throw err;
            }
        });
    } else {
        load = callbackify(client.getSigningKey.bind(client));
    }
    return promisify(memoizer({
        hash: (kid)=>kid,
        load,
        ttl: cacheMaxAge,
        max: cacheMaxEntries
    }));
}
module.exports.default = cacheWrapper;
}),
"[project]/node_modules/jwks-rsa/src/wrappers/callbackSupport.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { callbackify } = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
const callbackSupport = (client)=>{
    const getSigningKey = client.getSigningKey.bind(client);
    return (kid, cb)=>{
        if (cb) {
            const callbackFunc = callbackify(getSigningKey);
            return callbackFunc(kid, cb);
        }
        return getSigningKey(kid);
    };
};
module.exports.default = callbackSupport;
}),
"[project]/node_modules/jwks-rsa/src/wrappers/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    request: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/wrappers/request.js [app-route] (ecmascript)").default,
    cacheSigningKey: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/wrappers/cache.js [app-route] (ecmascript)").default,
    rateLimitSigningKey: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/wrappers/rateLimit.js [app-route] (ecmascript)").default,
    getKeysInterceptor: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/wrappers/interceptor.js [app-route] (ecmascript)").default,
    callbackSupport: __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/wrappers/callbackSupport.js [app-route] (ecmascript)").default
};
}),
"[project]/node_modules/jwks-rsa/src/wrappers/interceptor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const retrieveSigningKeys = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/utils.js [app-route] (ecmascript)").retrieveSigningKeys;
/**
 * Uses getKeysInterceptor to allow users to retrieve keys from a file,
 * external cache, or provided object before falling back to the jwksUri endpoint
 */ function getKeysInterceptor(client, { getKeysInterceptor }) {
    const getSigningKey = client.getSigningKey.bind(client);
    return async (kid)=>{
        const keys = await getKeysInterceptor();
        let signingKeys;
        if (keys && keys.length) {
            signingKeys = await retrieveSigningKeys(keys);
        }
        if (signingKeys && signingKeys.length) {
            const key = signingKeys.find((k)=>!kid || k.kid === kid);
            if (key) {
                return key;
            }
        }
        return getSigningKey(kid);
    };
}
module.exports.default = getKeysInterceptor;
}),
"[project]/node_modules/jwks-rsa/src/wrappers/rateLimit.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const logger = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")('jwks');
const { RateLimiter } = __turbopack_context__.r("[project]/node_modules/limiter/index.js [app-route] (ecmascript)");
const JwksRateLimitError = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/JwksRateLimitError.js [app-route] (ecmascript)");
function rateLimitWrapper(client, { jwksRequestsPerMinute = 10 }) {
    const getSigningKey = client.getSigningKey.bind(client);
    const limiter = new RateLimiter(jwksRequestsPerMinute, 'minute', true);
    logger(`Configured rate limiting to JWKS endpoint at ${jwksRequestsPerMinute}/minute`);
    return async (kid)=>await new Promise((resolve, reject)=>{
            limiter.removeTokens(1, async (err, remaining)=>{
                if (err) {
                    reject(err);
                }
                logger('Requests to the JWKS endpoint available for the next minute:', remaining);
                if (remaining < 0) {
                    logger('Too many requests to the JWKS endpoint');
                    reject(new JwksRateLimitError('Too many requests to the JWKS endpoint'));
                } else {
                    try {
                        const key = await getSigningKey(kid);
                        resolve(key);
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
}
module.exports.default = rateLimitWrapper;
}),
"[project]/node_modules/jwks-rsa/src/wrappers/request.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const http = __turbopack_context__.r("[externals]/http [external] (http, cjs)");
const https = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
const ArgumentError = __turbopack_context__.r("[project]/node_modules/jwks-rsa/src/errors/ArgumentError.js [app-route] (ecmascript)");
module.exports.default = (options)=>{
    if (options.fetcher) {
        return options.fetcher(options.uri);
    }
    return new Promise((resolve, reject)=>{
        let url;
        try {
            url = new URL(options.uri);
        } catch (err) {
            throw new ArgumentError('Invalid JWKS URI: The provided URI is not a valid URL.');
        }
        const { hostname, port, protocol, pathname, search } = url;
        const path = pathname + search;
        const requestOptions = {
            hostname,
            path,
            port,
            method: 'GET',
            ...options.headers && {
                headers: {
                    ...options.headers
                }
            },
            ...options.timeout && {
                timeout: options.timeout
            },
            ...options.agent && {
                agent: options.agent
            }
        };
        const httpRequestLib = protocol === 'https:' ? https : http;
        const httpRequest = httpRequestLib.request(requestOptions, (res)=>{
            let rawData = '';
            res.setEncoding('utf8');
            res.on('data', (chunk)=>{
                rawData += chunk;
            });
            res.on('end', ()=>{
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    const errorMsg = res.body && (res.body.message || res.body) || res.statusMessage || `Http Error ${res.statusCode}`;
                    reject({
                        errorMsg
                    });
                } else {
                    try {
                        resolve(rawData && JSON.parse(rawData));
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
        httpRequest.on('timeout', ()=>httpRequest.destroy()).on('error', (e)=>reject(e)).end();
    });
};
}),
"[project]/node_modules/jws/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global exports*/ var SignStream = __turbopack_context__.r("[project]/node_modules/jws/lib/sign-stream.js [app-route] (ecmascript)");
var VerifyStream = __turbopack_context__.r("[project]/node_modules/jws/lib/verify-stream.js [app-route] (ecmascript)");
var ALGORITHMS = [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512'
];
exports.ALGORITHMS = ALGORITHMS;
exports.sign = SignStream.sign;
exports.verify = VerifyStream.verify;
exports.decode = VerifyStream.decode;
exports.isValid = VerifyStream.isValid;
exports.createSign = function createSign(opts) {
    return new SignStream(opts);
};
exports.createVerify = function createVerify(opts) {
    return new VerifyStream(opts);
};
}),
"[project]/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module, process*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function DataStream(data) {
    this.buffer = null;
    this.writable = true;
    this.readable = true;
    // No input
    if (!data) {
        this.buffer = Buffer.alloc(0);
        return this;
    }
    // Stream
    if (typeof data.pipe === 'function') {
        this.buffer = Buffer.alloc(0);
        data.pipe(this);
        return this;
    }
    // Buffer or String
    // or Object (assumedly a passworded key)
    if (data.length || typeof data === 'object') {
        this.buffer = data;
        this.writable = false;
        process.nextTick((function() {
            this.emit('end', data);
            this.readable = false;
            this.emit('close');
        }).bind(this));
        return this;
    }
    throw new TypeError('Unexpected data type (' + typeof data + ')');
}
util.inherits(DataStream, Stream);
DataStream.prototype.write = function write(data) {
    this.buffer = Buffer.concat([
        this.buffer,
        Buffer.from(data)
    ]);
    this.emit('data', data);
};
DataStream.prototype.end = function end(data) {
    if (data) this.write(data);
    this.emit('end', data);
    this.emit('close');
    this.writable = false;
    this.readable = false;
};
module.exports = DataStream;
}),
"[project]/node_modules/jws/lib/sign-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var DataStream = __turbopack_context__.r("[project]/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)");
var jwa = __turbopack_context__.r("[project]/node_modules/jwa/index.js [app-route] (ecmascript)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var toString = __turbopack_context__.r("[project]/node_modules/jws/lib/tostring.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function base64url(string, encoding) {
    return Buffer.from(string, encoding).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function jwsSecuredInput(header, payload, encoding) {
    encoding = encoding || 'utf8';
    var encodedHeader = base64url(toString(header), 'binary');
    var encodedPayload = base64url(toString(payload), encoding);
    return util.format('%s.%s', encodedHeader, encodedPayload);
}
function jwsSign(opts) {
    var header = opts.header;
    var payload = opts.payload;
    var secretOrKey = opts.secret || opts.privateKey;
    var encoding = opts.encoding;
    var algo = jwa(header.alg);
    var securedInput = jwsSecuredInput(header, payload, encoding);
    var signature = algo.sign(securedInput, secretOrKey);
    return util.format('%s.%s', securedInput, signature);
}
function SignStream(opts) {
    var secret = opts.secret;
    secret = secret == null ? opts.privateKey : secret;
    secret = secret == null ? opts.key : secret;
    if (/^hs/i.test(opts.header.alg) === true && secret == null) {
        throw new TypeError('secret must be a string or buffer or a KeyObject');
    }
    var secretStream = new DataStream(secret);
    this.readable = true;
    this.header = opts.header;
    this.encoding = opts.encoding;
    this.secret = this.privateKey = this.key = secretStream;
    this.payload = new DataStream(opts.payload);
    this.secret.once('close', (function() {
        if (!this.payload.writable && this.readable) this.sign();
    }).bind(this));
    this.payload.once('close', (function() {
        if (!this.secret.writable && this.readable) this.sign();
    }).bind(this));
}
util.inherits(SignStream, Stream);
SignStream.prototype.sign = function sign() {
    try {
        var signature = jwsSign({
            header: this.header,
            payload: this.payload.buffer,
            secret: this.secret.buffer,
            encoding: this.encoding
        });
        this.emit('done', signature);
        this.emit('data', signature);
        this.emit('end');
        this.readable = false;
        return signature;
    } catch (e) {
        this.readable = false;
        this.emit('error', e);
        this.emit('close');
    }
};
SignStream.sign = jwsSign;
module.exports = SignStream;
}),
"[project]/node_modules/jws/lib/tostring.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer;
module.exports = function toString(obj) {
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || Buffer.isBuffer(obj)) return obj.toString();
    return JSON.stringify(obj);
};
}),
"[project]/node_modules/jws/lib/verify-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*global module*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var DataStream = __turbopack_context__.r("[project]/node_modules/jws/lib/data-stream.js [app-route] (ecmascript)");
var jwa = __turbopack_context__.r("[project]/node_modules/jwa/index.js [app-route] (ecmascript)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var toString = __turbopack_context__.r("[project]/node_modules/jws/lib/tostring.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
function isObject(thing) {
    return Object.prototype.toString.call(thing) === '[object Object]';
}
function safeJsonParse(thing) {
    if (isObject(thing)) return thing;
    try {
        return JSON.parse(thing);
    } catch (e) {
        return undefined;
    }
}
function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split('.', 1)[0];
    return safeJsonParse(Buffer.from(encodedHeader, 'base64').toString('binary'));
}
function securedInputFromJWS(jwsSig) {
    return jwsSig.split('.', 2).join('.');
}
function signatureFromJWS(jwsSig) {
    return jwsSig.split('.')[2];
}
function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || 'utf8';
    var payload = jwsSig.split('.')[1];
    return Buffer.from(payload, 'base64').toString(encoding);
}
function isValidJws(string) {
    return JWS_REGEX.test(string) && !!headerFromJWS(string);
}
function jwsVerify(jwsSig, algorithm, secretOrKey) {
    if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
    }
    jwsSig = toString(jwsSig);
    var signature = signatureFromJWS(jwsSig);
    var securedInput = securedInputFromJWS(jwsSig);
    var algo = jwa(algorithm);
    return algo.verify(securedInput, signature, secretOrKey);
}
function jwsDecode(jwsSig, opts) {
    opts = opts || {};
    jwsSig = toString(jwsSig);
    if (!isValidJws(jwsSig)) return null;
    var header = headerFromJWS(jwsSig);
    if (!header) return null;
    var payload = payloadFromJWS(jwsSig);
    if (header.typ === 'JWT' || opts.json) payload = JSON.parse(payload, opts.encoding);
    return {
        header: header,
        payload: payload,
        signature: signatureFromJWS(jwsSig)
    };
}
function VerifyStream(opts) {
    opts = opts || {};
    var secretOrKey = opts.secret;
    secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
    secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
    if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
        throw new TypeError('secret must be a string or buffer or a KeyObject');
    }
    var secretStream = new DataStream(secretOrKey);
    this.readable = true;
    this.algorithm = opts.algorithm;
    this.encoding = opts.encoding;
    this.secret = this.publicKey = this.key = secretStream;
    this.signature = new DataStream(opts.signature);
    this.secret.once('close', (function() {
        if (!this.signature.writable && this.readable) this.verify();
    }).bind(this));
    this.signature.once('close', (function() {
        if (!this.secret.writable && this.readable) this.verify();
    }).bind(this));
}
util.inherits(VerifyStream, Stream);
VerifyStream.prototype.verify = function verify() {
    try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit('done', valid, obj);
        this.emit('data', valid);
        this.emit('end');
        this.readable = false;
        return valid;
    } catch (e) {
        this.readable = false;
        this.emit('error', e);
        this.emit('close');
    }
};
VerifyStream.decode = jwsDecode;
VerifyStream.isValid = isValidJws;
VerifyStream.verify = jwsVerify;
module.exports = VerifyStream;
}),
"[project]/node_modules/limiter/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

exports.RateLimiter = __turbopack_context__.r("[project]/node_modules/limiter/lib/rateLimiter.js [app-route] (ecmascript)");
exports.TokenBucket = __turbopack_context__.r("[project]/node_modules/limiter/lib/tokenBucket.js [app-route] (ecmascript)");
}),
"[project]/node_modules/limiter/lib/clock.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var getMilliseconds = function() {
    if (typeof process !== 'undefined' && process.hrtime) {
        var hrtime = process.hrtime();
        var seconds = hrtime[0];
        var nanoseconds = hrtime[1];
        return seconds * 1e3 + Math.floor(nanoseconds / 1e6);
    }
    return new Date().getTime();
};
module.exports = getMilliseconds;
}),
"[project]/node_modules/limiter/lib/rateLimiter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var TokenBucket = __turbopack_context__.r("[project]/node_modules/limiter/lib/tokenBucket.js [app-route] (ecmascript)");
var getMilliseconds = __turbopack_context__.r("[project]/node_modules/limiter/lib/clock.js [app-route] (ecmascript)");
/**
 * A generic rate limiter. Underneath the hood, this uses a token bucket plus
 * an additional check to limit how many tokens we can remove each interval.
 * @author John Hurliman <jhurliman@jhurliman.org>
 *
 * @param {Number} tokensPerInterval Maximum number of tokens that can be
 *  removed at any given moment and over the course of one interval.
 * @param {String|Number} interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param {Boolean} fireImmediately Optional. Whether or not the callback
 *  will fire immediately when rate limiting is in effect (default is false).
 */ var RateLimiter = function(tokensPerInterval, interval, fireImmediately) {
    this.tokenBucket = new TokenBucket(tokensPerInterval, tokensPerInterval, interval, null);
    // Fill the token bucket to start
    this.tokenBucket.content = tokensPerInterval;
    this.curIntervalStart = getMilliseconds();
    this.tokensThisInterval = 0;
    this.fireImmediately = fireImmediately;
};
RateLimiter.prototype = {
    tokenBucket: null,
    curIntervalStart: 0,
    tokensThisInterval: 0,
    fireImmediately: false,
    /**
   * Remove the requested number of tokens and fire the given callback. If the
   * rate limiter contains enough tokens and we haven't spent too many tokens
   * in this interval already, this will happen immediately. Otherwise, the
   * removal and callback will happen when enough tokens become available.
   * @param {Number} count The number of tokens to remove.
   * @param {Function} callback(err, remainingTokens)
   * @returns {Boolean} True if the callback was fired immediately, otherwise
   *  false.
   */ removeTokens: function(count, callback) {
        // Make sure the request isn't for more than we can handle
        if (count > this.tokenBucket.bucketSize) {
            process.nextTick(callback.bind(null, 'Requested tokens ' + count + ' exceeds maximum tokens per interval ' + this.tokenBucket.bucketSize, null));
            return false;
        }
        var self = this;
        var now = getMilliseconds();
        // Advance the current interval and reset the current interval token count
        // if needed
        if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
            this.curIntervalStart = now;
            this.tokensThisInterval = 0;
        }
        // If we don't have enough tokens left in this interval, wait until the
        // next interval
        if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) {
            if (this.fireImmediately) {
                process.nextTick(callback.bind(null, null, -1));
            } else {
                var waitInterval = Math.ceil(this.curIntervalStart + this.tokenBucket.interval - now);
                setTimeout(function() {
                    self.tokenBucket.removeTokens(count, afterTokensRemoved);
                }, waitInterval);
            }
            return false;
        }
        // Remove the requested number of tokens from the token bucket
        return this.tokenBucket.removeTokens(count, afterTokensRemoved);
        //TURBOPACK unreachable
        ;
        function afterTokensRemoved(err, tokensRemaining) {
            if (err) return callback(err, null);
            self.tokensThisInterval += count;
            callback(null, tokensRemaining);
        }
    },
    /**
   * Attempt to remove the requested number of tokens and return immediately.
   * If the bucket (and any parent buckets) contains enough tokens and we
   * haven't spent too many tokens in this interval already, this will return
   * true. Otherwise, false is returned.
   * @param {Number} count The number of tokens to remove.
   * @param {Boolean} True if the tokens were successfully removed, otherwise
   *  false.
   */ tryRemoveTokens: function(count) {
        // Make sure the request isn't for more than we can handle
        if (count > this.tokenBucket.bucketSize) return false;
        var now = getMilliseconds();
        // Advance the current interval and reset the current interval token count
        // if needed
        if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
            this.curIntervalStart = now;
            this.tokensThisInterval = 0;
        }
        // If we don't have enough tokens left in this interval, return false
        if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) return false;
        // Try to remove the requested number of tokens from the token bucket
        var removed = this.tokenBucket.tryRemoveTokens(count);
        if (removed) {
            this.tokensThisInterval += count;
        }
        return removed;
    },
    /**
   * Returns the number of tokens remaining in the TokenBucket.
   * @returns {Number} The number of tokens remaining.
   */ getTokensRemaining: function() {
        this.tokenBucket.drip();
        return this.tokenBucket.content;
    }
};
module.exports = RateLimiter;
}),
"[project]/node_modules/limiter/lib/tokenBucket.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * A hierarchical token bucket for rate limiting. See
 * http://en.wikipedia.org/wiki/Token_bucket for more information.
 * @author John Hurliman <jhurliman@cull.tv>
 *
 * @param {Number} bucketSize Maximum number of tokens to hold in the bucket.
 *  Also known as the burst rate.
 * @param {Number} tokensPerInterval Number of tokens to drip into the bucket
 *  over the course of one interval.
 * @param {String|Number} interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param {TokenBucket} parentBucket Optional. A token bucket that will act as
 *  the parent of this bucket.
 */ var TokenBucket = function(bucketSize, tokensPerInterval, interval, parentBucket) {
    this.bucketSize = bucketSize;
    this.tokensPerInterval = tokensPerInterval;
    if (typeof interval === 'string') {
        switch(interval){
            case 'sec':
            case 'second':
                this.interval = 1000;
                break;
            case 'min':
            case 'minute':
                this.interval = 1000 * 60;
                break;
            case 'hr':
            case 'hour':
                this.interval = 1000 * 60 * 60;
                break;
            case 'day':
                this.interval = 1000 * 60 * 60 * 24;
                break;
            default:
                throw new Error('Invaid interval ' + interval);
        }
    } else {
        this.interval = interval;
    }
    this.parentBucket = parentBucket;
    this.content = 0;
    this.lastDrip = +new Date();
};
TokenBucket.prototype = {
    bucketSize: 1,
    tokensPerInterval: 1,
    interval: 1000,
    parentBucket: null,
    content: 0,
    lastDrip: 0,
    /**
   * Remove the requested number of tokens and fire the given callback. If the
   * bucket (and any parent buckets) contains enough tokens this will happen
   * immediately. Otherwise, the removal and callback will happen when enough
   * tokens become available.
   * @param {Number} count The number of tokens to remove.
   * @param {Function} callback(err, remainingTokens)
   * @returns {Boolean} True if the callback was fired immediately, otherwise
   *  false.
   */ removeTokens: function(count, callback) {
        var self = this;
        // Is this an infinite size bucket?
        if (!this.bucketSize) {
            process.nextTick(callback.bind(null, null, count, Number.POSITIVE_INFINITY));
            return true;
        }
        // Make sure the bucket can hold the requested number of tokens
        if (count > this.bucketSize) {
            process.nextTick(callback.bind(null, 'Requested tokens ' + count + ' exceeds bucket size ' + this.bucketSize, null));
            return false;
        }
        // Drip new tokens into this bucket
        this.drip();
        // If we don't have enough tokens in this bucket, come back later
        if (count > this.content) return comeBackLater();
        if (this.parentBucket) {
            // Remove the requested from the parent bucket first
            return this.parentBucket.removeTokens(count, function(err, remainingTokens) {
                if (err) return callback(err, null);
                // Check that we still have enough tokens in this bucket
                if (count > self.content) return comeBackLater();
                // Tokens were removed from the parent bucket, now remove them from
                // this bucket and fire the callback. Note that we look at the current
                // bucket and parent bucket's remaining tokens and return the smaller
                // of the two values
                self.content -= count;
                callback(null, Math.min(remainingTokens, self.content));
            });
        } else {
            // Remove the requested tokens from this bucket and fire the callback
            this.content -= count;
            process.nextTick(callback.bind(null, null, this.content));
            return true;
        }
        //TURBOPACK unreachable
        ;
        function comeBackLater() {
            // How long do we need to wait to make up the difference in tokens?
            var waitInterval = Math.ceil((count - self.content) * (self.interval / self.tokensPerInterval));
            setTimeout(function() {
                self.removeTokens(count, callback);
            }, waitInterval);
            return false;
        }
    },
    /**
   * Attempt to remove the requested number of tokens and return immediately.
   * If the bucket (and any parent buckets) contains enough tokens this will
   * return true, otherwise false is returned.
   * @param {Number} count The number of tokens to remove.
   * @param {Boolean} True if the tokens were successfully removed, otherwise
   *  false.
   */ tryRemoveTokens: function(count) {
        // Is this an infinite size bucket?
        if (!this.bucketSize) return true;
        // Make sure the bucket can hold the requested number of tokens
        if (count > this.bucketSize) return false;
        // Drip new tokens into this bucket
        this.drip();
        // If we don't have enough tokens in this bucket, return false
        if (count > this.content) return false;
        // Try to remove the requested tokens from the parent bucket
        if (this.parentBucket && !this.parentBucket.tryRemoveTokens(count)) return false;
        // Remove the requested tokens from this bucket and return
        this.content -= count;
        return true;
    },
    /**
   * Add any new tokens to the bucket since the last drip.
   * @returns {Boolean} True if new tokens were added, otherwise false.
   */ drip: function() {
        if (!this.tokensPerInterval) {
            this.content = this.bucketSize;
            return;
        }
        var now = +new Date();
        var deltaMS = Math.max(now - this.lastDrip, 0);
        this.lastDrip = now;
        var dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
        this.content = Math.min(this.content + dripAmount, this.bucketSize);
    }
};
module.exports = TokenBucket;
}),
"[project]/node_modules/lodash.clonedeep/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the size to enable large array optimizations. */ var LARGE_ARRAY_SIZE = 200;
/** Used to stand-in for `undefined` hash values. */ var HASH_UNDEFINED = '__lodash_hash_undefined__';
/** Used as references for various `Number` constants. */ var MAX_SAFE_INTEGER = 9007199254740991;
/** `Object#toString` result references. */ var argsTag = '[object Arguments]', arrayTag = '[object Array]', boolTag = '[object Boolean]', dateTag = '[object Date]', errorTag = '[object Error]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', mapTag = '[object Map]', numberTag = '[object Number]', objectTag = '[object Object]', promiseTag = '[object Promise]', regexpTag = '[object RegExp]', setTag = '[object Set]', stringTag = '[object String]', symbolTag = '[object Symbol]', weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]', dataViewTag = '[object DataView]', float32Tag = '[object Float32Array]', float64Tag = '[object Float64Array]', int8Tag = '[object Int8Array]', int16Tag = '[object Int16Array]', int32Tag = '[object Int32Array]', uint8Tag = '[object Uint8Array]', uint8ClampedTag = '[object Uint8ClampedArray]', uint16Tag = '[object Uint16Array]', uint32Tag = '[object Uint32Array]';
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */ var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to match `RegExp` flags from their coerced string values. */ var reFlags = /\w*$/;
/** Used to detect host constructors (Safari). */ var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Used to identify `toStringTag` values supported by `_.clone`. */ var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
/** Detect free variable `global` from Node.js. */ var freeGlobal = ("TURBOPACK compile-time value", "object") == 'object' && /*TURBOPACK member replacement*/ __turbopack_context__.g && /*TURBOPACK member replacement*/ __turbopack_context__.g.Object === Object && /*TURBOPACK member replacement*/ __turbopack_context__.g;
/** Detect free variable `self`. */ var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */ var root = freeGlobal || freeSelf || Function('return this')();
/** Detect free variable `exports`. */ var freeExports = ("TURBOPACK compile-time value", "object") == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */ var freeModule = freeExports && ("TURBOPACK compile-time value", "object") == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */ var moduleExports = freeModule && freeModule.exports === freeExports;
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */ function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
}
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */ function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
}
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */ function arrayEach(array, iteratee) {
    var index = -1, length = array ? array.length : 0;
    while(++index < length){
        if (iteratee(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */ function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while(++index < length){
        array[offset + index] = values[index];
    }
    return array;
}
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */ function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array ? array.length : 0;
    if (initAccum && length) {
        accumulator = array[++index];
    }
    while(++index < length){
        accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
}
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n){
        result[index] = iteratee(index);
    }
    return result;
}
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */ function getValue(object, key) {
    return object == null ? undefined : object[key];
}
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */ function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
        try {
            result = !!(value + '');
        } catch (e) {}
    }
    return result;
}
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */ function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
        result[++index] = [
            key,
            value
        ];
    });
    return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */ function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
        result[++index] = value;
    });
    return result;
}
/** Used for built-in method references. */ var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to detect overreaching core-js shims. */ var coreJsData = root['__core-js_shared__'];
/** Used to detect methods masquerading as native. */ var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
}();
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Used to detect if a method is native. */ var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/** Built-in value references. */ var Buffer = moduleExports ? root.Buffer : undefined, Symbol = root.Symbol, Uint8Array = root.Uint8Array, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined, nativeKeys = overArg(Object.keys, Object);
/* Built-in method references that are verified to be native. */ var DataView = getNative(root, 'DataView'), Map = getNative(root, 'Map'), Promise = getNative(root, 'Promise'), Set = getNative(root, 'Set'), WeakMap = getNative(root, 'WeakMap'), nativeCreate = getNative(Object, 'create');
/** Used to detect maps, sets, and weakmaps. */ var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
/** Used to convert symbols to primitives and strings. */ var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */ function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
}
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
}
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */ function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
}
// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */ function listCacheClear() {
    this.__data__ = [];
}
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
        return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
        data.pop();
    } else {
        splice.call(data, index, 1);
    }
    return true;
}
/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
}
/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
}
/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */ function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
        data.push([
            key,
            value
        ]);
    } else {
        data[index][1] = value;
    }
    return this;
}
// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */ function mapCacheClear() {
    this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
    };
}
/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
}
/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function mapCacheGet(key) {
    return getMapData(this, key).get(key);
}
/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function mapCacheHas(key) {
    return getMapData(this, key).has(key);
}
/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */ function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
}
// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function Stack(entries) {
    this.__data__ = new ListCache(entries);
}
/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */ function stackClear() {
    this.__data__ = new ListCache;
}
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function stackDelete(key) {
    return this.__data__['delete'](key);
}
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function stackGet(key) {
    return this.__data__.get(key);
}
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function stackHas(key) {
    return this.__data__.has(key);
}
/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */ function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([
                key,
                value
            ]);
            return this;
        }
        cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
}
// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for(var key in value){
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
            result.push(key);
        }
    }
    return result;
}
/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */ function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
        object[key] = value;
    }
}
/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function assocIndexOf(array, key) {
    var length = array.length;
    while(length--){
        if (eq(array[length][0], key)) {
            return length;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */ function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
}
/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */ function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
        return result;
    }
    if (!isObject(value)) {
        return value;
    }
    var isArr = isArray(value);
    if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
            return copyArray(value, result);
        }
    } else {
        var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
        if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || isFunc && !object) {
            if (isHostObject(value)) {
                return object ? value : {};
            }
            result = initCloneObject(isFunc ? {} : value);
            if (!isDeep) {
                return copySymbols(value, baseAssign(result, value));
            }
        } else {
            if (!cloneableTags[tag]) {
                return object ? value : {};
            }
            result = initCloneByTag(value, tag, baseClone, isDeep);
        }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) {
        return stacked;
    }
    stack.set(value, result);
    if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
    }
    arrayEach(props || value, function(subValue, key) {
        if (props) {
            key = subValue;
            subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
    });
    return result;
}
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */ function baseCreate(proto) {
    return isObject(proto) ? objectCreate(proto) : {};
}
/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */ function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ function baseGetTag(value) {
    return objectToString.call(value);
}
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */ function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
        return false;
    }
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
}
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    var result = [];
    for(var key in Object(object)){
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
        }
    }
    return result;
}
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */ function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
        return buffer.slice();
    }
    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
}
/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */ function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
}
/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */ function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */ function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor);
}
/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */ function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
}
/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */ function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor);
}
/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */ function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */ function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */ function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while(++index < length){
        array[index] = source[index];
    }
    return array;
}
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */ function copyObject(source, props, object, customizer) {
    object || (object = {});
    var index = -1, length = props.length;
    while(++index < length){
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
        assignValue(object, key, newValue === undefined ? source[key] : newValue);
    }
    return object;
}
/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */ function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
}
/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */ function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
}
/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */ function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */ function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
}
/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */ var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ var getTag = baseGetTag;
// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set) != setTag || WeakMap && getTag(new WeakMap) != weakMapTag) {
    getTag = function(value) {
        var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : undefined;
        if (ctorString) {
            switch(ctorString){
                case dataViewCtorString:
                    return dataViewTag;
                case mapCtorString:
                    return mapTag;
                case promiseCtorString:
                    return promiseTag;
                case setCtorString:
                    return setTag;
                case weakMapCtorString:
                    return weakMapTag;
            }
        }
        return result;
    };
}
/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */ function initCloneArray(array) {
    var length = array.length, result = array.constructor(length);
    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */ function initCloneObject(object) {
    return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */ function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch(tag){
        case arrayBufferTag:
            return cloneArrayBuffer(object);
        case boolTag:
        case dateTag:
            return new Ctor(+object);
        case dataViewTag:
            return cloneDataView(object, isDeep);
        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
            return cloneTypedArray(object, isDeep);
        case mapTag:
            return cloneMap(object, isDeep, cloneFunc);
        case numberTag:
        case stringTag:
            return new Ctor(object);
        case regexpTag:
            return cloneRegExp(object);
        case setTag:
            return cloneSet(object, isDeep, cloneFunc);
        case symbolTag:
            return cloneSymbol(object);
    }
}
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */ function isKeyable(value) {
    var type = typeof value;
    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */ function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
}
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
}
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */ function toSource(func) {
    if (func != null) {
        try {
            return funcToString.call(func);
        } catch (e) {}
        try {
            return func + '';
        } catch (e) {}
    }
    return '';
}
/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */ function cloneDeep(value) {
    return baseClone(value, true, true);
}
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */ function eq(value, other) {
    return value === other || value !== value && other !== other;
}
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */ function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}
/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */ var isBuffer = nativeIsBuffer || stubFalse;
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
}
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */ function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */ function stubArray() {
    return [];
}
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */ function stubFalse() {
    return false;
}
module.exports = cloneDeep;
}),
"[project]/node_modules/lodash.includes/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var argsTag = '[object Arguments]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', stringTag = '[object String]', symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */ function arrayMap(array, iteratee) {
    var index = -1, length = array ? array.length : 0, result = Array(length);
    while(++index < length){
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while(fromRight ? index-- : ++index < length){
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
    }
    var index = fromIndex - 1, length = array.length;
    while(++index < length){
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
}
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */ function baseIsNaN(value) {
    return value !== value;
}
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n){
        result[index] = iteratee(index);
    }
    return result;
}
/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */ function baseValues(object, props) {
    return arrayMap(props, function(key) {
        return object[key];
    });
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var objectProto = Object.prototype;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeKeys = overArg(Object.keys, Object), nativeMax = Math.max;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for(var key in value){
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
            result.push(key);
        }
    }
    return result;
}
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    var result = [];
    for(var key in Object(object)){
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
        }
    }
    return result;
}
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
}
/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */ function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
    }
    return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */ function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
}
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */ function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */ function values(object) {
    return object ? baseValues(object, keys(object)) : [];
}
module.exports = includes;
}),
"[project]/node_modules/lodash.isboolean/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var boolTag = '[object Boolean]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */ function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
module.exports = isBoolean;
}),
"[project]/node_modules/lodash.isinteger/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */ function isInteger(value) {
    return typeof value == 'number' && value == toInteger(value);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = isInteger;
}),
"[project]/node_modules/lodash.isnumber/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var numberTag = '[object Number]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */ function isNumber(value) {
    return typeof value == 'number' || isObjectLike(value) && objectToString.call(value) == numberTag;
}
module.exports = isNumber;
}),
"[project]/node_modules/lodash.isplainobject/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** `Object#toString` result references. */ var objectTag = '[object Object]';
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */ function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
        try {
            result = !!(value + '');
        } catch (e) {}
    }
    return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/** Used for built-in method references. */ var funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */ var objectCtorString = funcToString.call(Object);
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var getPrototype = overArg(Object.getPrototypeOf, Object);
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */ function isPlainObject(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
module.exports = isPlainObject;
}),
"[project]/node_modules/lodash.isstring/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */ /** `Object#toString` result references. */ var stringTag = '[object String]';
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */ function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}
module.exports = isString;
}),
"[project]/node_modules/lodash.once/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the `TypeError` message for "Functions" methods. */ var FUNC_ERROR_TEXT = 'Expected a function';
/** Used as references for various `Number` constants. */ var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308, NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */ function before(n, func) {
    var result;
    if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    n = toInteger(n);
    return function() {
        if (--n > 0) {
            result = func.apply(this, arguments);
        }
        if (n <= 1) {
            func = undefined;
        }
        return result;
    };
}
/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */ function once(func) {
    return before(2, func);
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */ function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */ function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = once;
}),
"[project]/node_modules/lru-cache/dist/commonjs/node/index.min.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var j = (u, t)=>()=>(t || u((t = {
            exports: {}
        }).exports, t), t.exports);
var I = j((O)=>{
    "use strict";
    Object.defineProperty(O, "__esModule", {
        value: !0
    });
    O.tracing = O.metrics = void 0;
    var U = __turbopack_context__.r("[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)");
    O.metrics = (0, U.channel)("lru-cache:metrics");
    O.tracing = (0, U.tracingChannel)("lru-cache");
});
var P = j((R)=>{
    "use strict";
    Object.defineProperty(R, "__esModule", {
        value: !0
    });
    R.defaultPerf = void 0;
    R.defaultPerf = typeof performance == "object" && performance && typeof performance.now == "function" ? performance : Date;
});
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.LRUCache = void 0;
var g = I(), N = P(), C = ()=>g.metrics.hasSubscribers || g.tracing.hasSubscribers, k = new Set, G = typeof process == "object" && process ? process : {}, V = (u, t, e, i)=>{
    typeof G.emitWarning == "function" ? G.emitWarning(u, t, e, i) : console.error(`[${e}] ${t}: ${u}`);
}, q = (u)=>!k.has(u);
var T = (u)=>!!u && u === Math.floor(u) && u > 0 && isFinite(u), H = (u)=>T(u) ? u <= Math.pow(2, 8) ? Uint8Array : u <= Math.pow(2, 16) ? Uint16Array : u <= Math.pow(2, 32) ? Uint32Array : u <= Number.MAX_SAFE_INTEGER ? W : null : null, W = class extends Array {
    constructor(t){
        super(t), this.fill(0);
    }
}, L = class u {
    heap;
    length;
    static #o = !1;
    static create(t) {
        let e = H(t);
        if (!e) return [];
        u.#o = !0;
        let i = new u(t, e);
        return u.#o = !1, i;
    }
    constructor(t, e){
        if (!u.#o) throw new TypeError("instantiate Stack using Stack.create(n)");
        this.heap = new e(t), this.length = 0;
    }
    push(t) {
        this.heap[this.length++] = t;
    }
    pop() {
        return this.heap[--this.length];
    }
}, M = class u {
    #o;
    #c;
    #m;
    #W;
    #S;
    #x;
    #j;
    #w;
    get perf() {
        return this.#w;
    }
    ttl;
    ttlResolution;
    ttlAutopurge;
    updateAgeOnGet;
    updateAgeOnHas;
    allowStale;
    noDisposeOnSet;
    noUpdateTTL;
    maxEntrySize;
    sizeCalculation;
    noDeleteOnFetchRejection;
    noDeleteOnStaleGet;
    allowStaleOnFetchAbort;
    allowStaleOnFetchRejection;
    ignoreFetchAbort;
    backgroundFetchSize;
    #n;
    #b;
    #s;
    #i;
    #t;
    #l;
    #u;
    #a;
    #h;
    #_;
    #r;
    #y;
    #F;
    #d;
    #g;
    #T;
    #U;
    #f;
    #R;
    static unsafeExposeInternals(t) {
        return {
            starts: t.#F,
            ttls: t.#d,
            autopurgeTimers: t.#g,
            sizes: t.#y,
            keyMap: t.#s,
            keyList: t.#i,
            valList: t.#t,
            next: t.#l,
            prev: t.#u,
            get head () {
                return t.#a;
            },
            get tail () {
                return t.#h;
            },
            free: t.#_,
            isBackgroundFetch: (e)=>t.#e(e),
            backgroundFetch: (e, i, s, n)=>t.#G(e, i, s, n),
            moveToTail: (e)=>t.#M(e),
            indexes: (e)=>t.#A(e),
            rindexes: (e)=>t.#z(e),
            isStale: (e)=>t.#p(e)
        };
    }
    get max() {
        return this.#o;
    }
    get maxSize() {
        return this.#c;
    }
    get calculatedSize() {
        return this.#b;
    }
    get size() {
        return this.#n;
    }
    get fetchMethod() {
        return this.#x;
    }
    get memoMethod() {
        return this.#j;
    }
    get dispose() {
        return this.#m;
    }
    get onInsert() {
        return this.#W;
    }
    get disposeAfter() {
        return this.#S;
    }
    constructor(t){
        let { max: e = 0, ttl: i, ttlResolution: s = 1, ttlAutopurge: n, updateAgeOnGet: o, updateAgeOnHas: l, allowStale: h, dispose: r, onInsert: c, disposeAfter: w, noDisposeOnSet: y, noUpdateTTL: d, maxSize: p = 0, maxEntrySize: f = 0, sizeCalculation: _, fetchMethod: a, memoMethod: S, noDeleteOnFetchRejection: F, noDeleteOnStaleGet: b, allowStaleOnFetchRejection: m, allowStaleOnFetchAbort: A, ignoreFetchAbort: z, backgroundFetchSize: x = 1, perf: v } = t;
        if (this.backgroundFetchSize = x, v !== void 0 && typeof v?.now != "function") throw new TypeError("perf option must have a now() method if specified");
        if (this.#w = v ?? N.defaultPerf, e !== 0 && !T(e)) throw new TypeError("max option must be a nonnegative integer");
        let E = e ? H(e) : Array;
        if (!E) throw new Error("invalid max value: " + e);
        if (this.#o = e, this.#c = p, this.maxEntrySize = f || this.#c, this.sizeCalculation = _, this.sizeCalculation) {
            if (!this.#c && !this.maxEntrySize) throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
            if (typeof this.sizeCalculation != "function") throw new TypeError("sizeCalculation set to non-function");
        }
        if (S !== void 0 && typeof S != "function") throw new TypeError("memoMethod must be a function if defined");
        if (this.#j = S, a !== void 0 && typeof a != "function") throw new TypeError("fetchMethod must be a function if specified");
        if (this.#x = a, this.#U = !!a, this.#s = new Map, this.#i = Array.from({
            length: e
        }).fill(void 0), this.#t = Array.from({
            length: e
        }).fill(void 0), this.#l = new E(e), this.#u = new E(e), this.#a = 0, this.#h = 0, this.#_ = L.create(e), this.#n = 0, this.#b = 0, typeof r == "function" && (this.#m = r), typeof c == "function" && (this.#W = c), typeof w == "function" ? (this.#S = w, this.#r = []) : (this.#S = void 0, this.#r = void 0), this.#T = !!this.#m, this.#R = !!this.#W, this.#f = !!this.#S, this.noDisposeOnSet = !!y, this.noUpdateTTL = !!d, this.noDeleteOnFetchRejection = !!F, this.allowStaleOnFetchRejection = !!m, this.allowStaleOnFetchAbort = !!A, this.ignoreFetchAbort = !!z, this.maxEntrySize !== 0) {
            if (this.#c !== 0 && !T(this.#c)) throw new TypeError("maxSize must be a positive integer if specified");
            if (!T(this.maxEntrySize)) throw new TypeError("maxEntrySize must be a positive integer if specified");
            this.#X();
        }
        if (this.allowStale = !!h, this.noDeleteOnStaleGet = !!b, this.updateAgeOnGet = !!o, this.updateAgeOnHas = !!l, this.ttlResolution = T(s) || s === 0 ? s : 1, this.ttlAutopurge = !!n, this.ttl = i || 0, this.ttl) {
            if (!T(this.ttl)) throw new TypeError("ttl must be a positive integer if specified");
            this.#k();
        }
        if (this.#o === 0 && this.ttl === 0 && this.#c === 0) throw new TypeError("At least one of max, maxSize, or ttl is required");
        if (!this.ttlAutopurge && !this.#o && !this.#c) {
            let D = "LRU_CACHE_UNBOUNDED";
            q(D) && (k.add(D), V("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", D, u));
        }
    }
    getRemainingTTL(t) {
        return this.#s.has(t) ? 1 / 0 : 0;
    }
    #k() {
        let t = new W(this.#o), e = new W(this.#o);
        this.#d = t, this.#F = e;
        let i = this.ttlAutopurge ? Array.from({
            length: this.#o
        }) : void 0;
        this.#g = i, this.#H = (h, r, c = this.#w.now())=>{
            e[h] = r !== 0 ? c : 0, t[h] = r, s(h, r);
        }, this.#D = (h)=>{
            e[h] = t[h] !== 0 ? this.#w.now() : 0, s(h, t[h]);
        };
        let s = this.ttlAutopurge ? (h, r)=>{
            if (i?.[h] && (clearTimeout(i[h]), i[h] = void 0), r && r !== 0 && i) {
                let c = setTimeout(()=>{
                    this.#p(h) ? (this.#v(this.#i[h], "expire"), i[h] = void 0) : s(h, l(h));
                }, r + 1);
                c.unref && c.unref(), i[h] = c;
            }
        } : ()=>{};
        this.#E = (h, r)=>{
            if (t[r]) {
                let c = t[r], w = e[r];
                if (!c || !w) return;
                h.ttl = c, h.start = w, h.now = n || o();
                let y = h.now - w;
                h.remainingTTL = c - y;
            }
        };
        let n = 0, o = ()=>{
            let h = this.#w.now();
            if (this.ttlResolution > 0) {
                n = h;
                let r = setTimeout(()=>n = 0, this.ttlResolution);
                r.unref && r.unref();
            }
            return h;
        };
        this.getRemainingTTL = (h)=>{
            let r = this.#s.get(h);
            return r === void 0 ? 0 : l(r);
        };
        let l = (h)=>{
            let r = t[h], c = e[h];
            if (!r || !c) return 1 / 0;
            let w = (n || o()) - c;
            return r - w;
        };
        this.#p = (h)=>{
            let r = e[h], c = t[h];
            return !!c && !!r && (n || o()) - r > c;
        };
    }
    #D = ()=>{};
    #E = ()=>{};
    #H = ()=>{};
    #p = ()=>!1;
    #X() {
        let t = new W(this.#o);
        this.#b = 0, this.#y = t, this.#C = (e)=>{
            this.#b -= t[e], t[e] = 0;
        }, this.#N = (e, i, s, n)=>{
            if (!T(s)) {
                if (this.#e(i)) return this.backgroundFetchSize;
                if (n) {
                    if (typeof n != "function") throw new TypeError("sizeCalculation must be a function");
                    if (s = n(i, e), !T(s)) throw new TypeError("sizeCalculation return invalid (expect positive integer)");
                } else throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
            }
            return s;
        }, this.#I = (e, i, s)=>{
            if (t[e] = i, this.#c) {
                let n = this.#c - t[e];
                for(; this.#b > n;)this.#P(!0);
            }
            this.#b += t[e], s && (s.entrySize = i, s.totalCalculatedSize = this.#b);
        };
    }
    #C = (t)=>{};
    #I = (t, e, i)=>{};
    #N = (t, e, i, s)=>{
        if (i || s) throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
        return 0;
    };
    *#A({ allowStale: t = this.allowStale } = {}) {
        if (this.#n) for(let e = this.#h; this.#V(e) && ((t || !this.#p(e)) && (yield e), e !== this.#a);)e = this.#u[e];
    }
    *#z({ allowStale: t = this.allowStale } = {}) {
        if (this.#n) for(let e = this.#a; this.#V(e) && ((t || !this.#p(e)) && (yield e), e !== this.#h);)e = this.#l[e];
    }
    #V(t) {
        return t !== void 0 && this.#s.get(this.#i[t]) === t;
    }
    *entries() {
        for (let t of this.#A())this.#t[t] !== void 0 && this.#i[t] !== void 0 && !this.#e(this.#t[t]) && (yield [
            this.#i[t],
            this.#t[t]
        ]);
    }
    *rentries() {
        for (let t of this.#z())this.#t[t] !== void 0 && this.#i[t] !== void 0 && !this.#e(this.#t[t]) && (yield [
            this.#i[t],
            this.#t[t]
        ]);
    }
    *keys() {
        for (let t of this.#A()){
            let e = this.#i[t];
            e !== void 0 && !this.#e(this.#t[t]) && (yield e);
        }
    }
    *rkeys() {
        for (let t of this.#z()){
            let e = this.#i[t];
            e !== void 0 && !this.#e(this.#t[t]) && (yield e);
        }
    }
    *values() {
        for (let t of this.#A())this.#t[t] !== void 0 && !this.#e(this.#t[t]) && (yield this.#t[t]);
    }
    *rvalues() {
        for (let t of this.#z())this.#t[t] !== void 0 && !this.#e(this.#t[t]) && (yield this.#t[t]);
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    [Symbol.toStringTag] = "LRUCache";
    find(t, e = {}) {
        for (let i of this.#A()){
            let s = this.#t[i], n = this.#e(s) ? s.__staleWhileFetching : s;
            if (n !== void 0 && t(n, this.#i[i], this)) return this.#L(this.#i[i], e);
        }
    }
    forEach(t, e = this) {
        for (let i of this.#A()){
            let s = this.#t[i], n = this.#e(s) ? s.__staleWhileFetching : s;
            n !== void 0 && t.call(e, n, this.#i[i], this);
        }
    }
    rforEach(t, e = this) {
        for (let i of this.#z()){
            let s = this.#t[i], n = this.#e(s) ? s.__staleWhileFetching : s;
            n !== void 0 && t.call(e, n, this.#i[i], this);
        }
    }
    purgeStale() {
        let t = !1;
        for (let e of this.#z({
            allowStale: !0
        }))this.#p(e) && (this.#v(this.#i[e], "expire"), t = !0);
        return t;
    }
    info(t) {
        let e = this.#s.get(t);
        if (e === void 0) return;
        let i = this.#t[e], s = this.#e(i) ? i.__staleWhileFetching : i;
        if (s === void 0) return;
        let n = {
            value: s
        };
        if (this.#d && this.#F) {
            let o = this.#d[e], l = this.#F[e];
            if (o && l) {
                let h = o - (this.#w.now() - l);
                n.ttl = h, n.start = Date.now();
            }
        }
        return this.#y && (n.size = this.#y[e]), n;
    }
    dump() {
        let t = [];
        for (let e of this.#A({
            allowStale: !0
        })){
            let i = this.#i[e], s = this.#t[e], n = this.#e(s) ? s.__staleWhileFetching : s;
            if (n === void 0 || i === void 0) continue;
            let o = {
                value: n
            };
            if (this.#d && this.#F) {
                o.ttl = this.#d[e];
                let l = this.#w.now() - this.#F[e];
                o.start = Math.floor(Date.now() - l);
            }
            this.#y && (o.size = this.#y[e]), t.unshift([
                i,
                o
            ]);
        }
        return t;
    }
    load(t) {
        this.clear();
        for (let [e, i] of t){
            if (i.start) {
                let s = Date.now() - i.start;
                i.start = this.#w.now() - s;
            }
            this.#O(e, i.value, i);
        }
    }
    set(t, e, i = {}) {
        let { status: s = g.metrics.hasSubscribers ? {} : void 0 } = i;
        i.status = s, s && (s.op = "set", s.key = t, e !== void 0 && (s.value = e), s.cache = this);
        let n = this.#O(t, e, i);
        return s && g.metrics.hasSubscribers && g.metrics.publish(s), n;
    }
    #O(t, e, i, s) {
        let { ttl: n = this.ttl, start: o, noDisposeOnSet: l = this.noDisposeOnSet, sizeCalculation: h = this.sizeCalculation, status: r } = i, c = this.#e(e);
        if (e === void 0) return r && (r.set = "deleted"), this.delete(t), this;
        let { noUpdateTTL: w = this.noUpdateTTL } = i;
        r && !c && (r.value = e);
        let y = this.#N(t, e, i.size || 0, h, r);
        if (this.maxEntrySize && y > this.maxEntrySize) return this.#v(t, "set"), r && (r.set = "miss", r.maxEntrySizeExceeded = !0), this;
        let d = this.#n === 0 ? void 0 : this.#s.get(t);
        if (d === void 0) d = this.#n === 0 ? this.#h : this.#_.length !== 0 ? this.#_.pop() : this.#n === this.#o ? this.#P(!1) : this.#n, this.#i[d] = t, this.#t[d] = e, this.#s.set(t, d), this.#l[this.#h] = d, this.#u[d] = this.#h, this.#h = d, this.#n++, this.#I(d, y, r), r && (r.set = "add"), w = !1, this.#R && !c && this.#W?.(e, t, "add");
        else {
            this.#M(d);
            let p = this.#t[d];
            if (e !== p) {
                if (!l) if (this.#e(p)) {
                    p !== s && p.__abortController.abort(new Error("replaced"));
                    let { __staleWhileFetching: f } = p;
                    f !== void 0 && f !== e && (this.#T && this.#m?.(f, t, "set"), this.#f && this.#r?.push([
                        f,
                        t,
                        "set"
                    ]));
                } else this.#T && this.#m?.(p, t, "set"), this.#f && this.#r?.push([
                    p,
                    t,
                    "set"
                ]);
                if (this.#C(d), this.#I(d, y, r), this.#t[d] = e, !c) {
                    let f = p && this.#e(p) ? p.__staleWhileFetching : p, _ = f === void 0 ? "add" : e !== f ? "replace" : "update";
                    r && (r.set = _, f !== void 0 && (r.oldValue = f)), this.#R && this.onInsert?.(e, t, _);
                }
            } else c || (r && (r.set = "update"), this.#R && this.onInsert?.(e, t, "update"));
        }
        if (n !== 0 && !this.#d && this.#k(), this.#d && (w || this.#H(d, n, o), r && this.#E(r, d)), !l && this.#f && this.#r) {
            let p = this.#r, f;
            for(; f = p?.shift();)this.#S?.(...f);
        }
        return this;
    }
    pop() {
        try {
            for(; this.#n;){
                let t = this.#t[this.#a];
                if (this.#P(!0), this.#e(t)) {
                    if (t.__staleWhileFetching) return t.__staleWhileFetching;
                } else if (t !== void 0) return t;
            }
        } finally{
            if (this.#f && this.#r) {
                let t = this.#r, e;
                for(; e = t?.shift();)this.#S?.(...e);
            }
        }
    }
    #P(t) {
        let e = this.#a, i = this.#i[e], s = this.#t[e], n = this.#e(s);
        n && s.__abortController.abort(new Error("evicted"));
        let o = n ? s.__staleWhileFetching : s;
        return (this.#T || this.#f) && o !== void 0 && (this.#T && this.#m?.(o, i, "evict"), this.#f && this.#r?.push([
            o,
            i,
            "evict"
        ])), this.#C(e), this.#g?.[e] && (clearTimeout(this.#g[e]), this.#g[e] = void 0), t && (this.#i[e] = void 0, this.#t[e] = void 0, this.#_.push(e)), this.#n === 1 ? (this.#a = this.#h = 0, this.#_.length = 0) : this.#a = this.#l[e], this.#s.delete(i), this.#n--, e;
    }
    has(t, e = {}) {
        let { status: i = g.metrics.hasSubscribers ? {} : void 0 } = e;
        e.status = i, i && (i.op = "has", i.key = t, i.cache = this);
        let s = this.#Y(t, e);
        return g.metrics.hasSubscribers && g.metrics.publish(i), s;
    }
    #Y(t, e = {}) {
        let { updateAgeOnHas: i = this.updateAgeOnHas, status: s } = e, n = this.#s.get(t);
        if (n !== void 0) {
            let o = this.#t[n];
            if (this.#e(o) && o.__staleWhileFetching === void 0) return !1;
            if (this.#p(n)) s && (s.has = "stale", this.#E(s, n));
            else return i && this.#D(n), s && (s.has = "hit", this.#E(s, n)), !0;
        } else s && (s.has = "miss");
        return !1;
    }
    peek(t, e = {}) {
        let { status: i = C() ? {} : void 0 } = e;
        i && (i.op = "peek", i.key = t, i.cache = this), e.status = i;
        let s = this.#J(t, e);
        return g.metrics.hasSubscribers && g.metrics.publish(i), s;
    }
    #J(t, e) {
        let { status: i, allowStale: s = this.allowStale } = e, n = this.#s.get(t);
        if (n === void 0 || !s && this.#p(n)) {
            i && (i.peek = n === void 0 ? "miss" : "stale");
            return;
        }
        let o = this.#t[n], l = this.#e(o) ? o.__staleWhileFetching : o;
        return i && (l !== void 0 ? (i.peek = "hit", i.value = l) : i.peek = "miss"), l;
    }
    #G(t, e, i, s) {
        let n = e === void 0 ? void 0 : this.#t[e];
        if (this.#e(n)) return n;
        let o = new AbortController, { signal: l } = i;
        l?.addEventListener("abort", ()=>o.abort(l.reason), {
            signal: o.signal
        });
        let h = {
            signal: o.signal,
            options: i,
            context: s
        }, r = (f, _ = !1)=>{
            let { aborted: a } = o.signal, S = i.ignoreFetchAbort && f !== void 0, F = i.ignoreFetchAbort || !!(i.allowStaleOnFetchAbort && f !== void 0);
            if (i.status && (a && !_ ? (i.status.fetchAborted = !0, i.status.fetchError = o.signal.reason, S && (i.status.fetchAbortIgnored = !0)) : i.status.fetchResolved = !0), a && !S && !_) return w(o.signal.reason, F);
            let b = d, m = this.#t[e];
            return (m === d || m === void 0 && S && _) && (f === void 0 ? b.__staleWhileFetching !== void 0 ? this.#t[e] = b.__staleWhileFetching : this.#v(t, "fetch") : (i.status && (i.status.fetchUpdated = !0), this.#O(t, f, h.options, b))), f;
        }, c = (f)=>(i.status && (i.status.fetchRejected = !0, i.status.fetchError = f), w(f, !1)), w = (f, _)=>{
            let { aborted: a } = o.signal, S = a && i.allowStaleOnFetchAbort, F = S || i.allowStaleOnFetchRejection, b = F || i.noDeleteOnFetchRejection, m = d;
            if (this.#t[e] === d && (!b || !_ && m.__staleWhileFetching === void 0 ? this.#v(t, "fetch") : S || (this.#t[e] = m.__staleWhileFetching)), F) return i.status && m.__staleWhileFetching !== void 0 && (i.status.returnedStale = !0), m.__staleWhileFetching;
            if (m.__returned === m) throw f;
        }, y = (f, _)=>{
            let a = this.#x?.(t, n, h);
            o.signal.addEventListener("abort", ()=>{
                (!i.ignoreFetchAbort || i.allowStaleOnFetchAbort) && (f(void 0), i.allowStaleOnFetchAbort && (f = (S)=>r(S, !0)));
            }), a && a instanceof Promise ? a.then((S)=>f(S === void 0 ? void 0 : S), _) : a !== void 0 && f(a);
        };
        i.status && (i.status.fetchDispatched = !0);
        let d = new Promise(y).then(r, c), p = Object.assign(d, {
            __abortController: o,
            __staleWhileFetching: n,
            __returned: void 0
        });
        return e === void 0 ? (this.#O(t, p, {
            ...h.options,
            status: void 0
        }), e = this.#s.get(t)) : this.#t[e] = p, p;
    }
    #e(t) {
        if (!this.#U) return !1;
        let e = t;
        return !!e && e instanceof Promise && e.hasOwnProperty("__staleWhileFetching") && e.__abortController instanceof AbortController;
    }
    fetch(t, e = {}) {
        let i = g.tracing.hasSubscribers, { status: s = C() ? {} : void 0 } = e;
        e.status = s, s && e.context && (s.context = e.context);
        let n = this.#q(t, e);
        return s && i && (s.trace = !0, g.tracing.tracePromise(()=>n, s).catch(()=>{})), n;
    }
    async #q(t, e = {}) {
        let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n = this.noDeleteOnStaleGet, ttl: o = this.ttl, noDisposeOnSet: l = this.noDisposeOnSet, size: h = 0, sizeCalculation: r = this.sizeCalculation, noUpdateTTL: c = this.noUpdateTTL, noDeleteOnFetchRejection: w = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection: y = this.allowStaleOnFetchRejection, ignoreFetchAbort: d = this.ignoreFetchAbort, allowStaleOnFetchAbort: p = this.allowStaleOnFetchAbort, context: f, forceRefresh: _ = !1, status: a, signal: S } = e;
        if (a && (a.op = "fetch", a.key = t, _ && (a.forceRefresh = !0), a.cache = this), !this.#U) return a && (a.fetch = "get"), this.#L(t, {
            allowStale: i,
            updateAgeOnGet: s,
            noDeleteOnStaleGet: n,
            status: a
        });
        let F = {
            allowStale: i,
            updateAgeOnGet: s,
            noDeleteOnStaleGet: n,
            ttl: o,
            noDisposeOnSet: l,
            size: h,
            sizeCalculation: r,
            noUpdateTTL: c,
            noDeleteOnFetchRejection: w,
            allowStaleOnFetchRejection: y,
            allowStaleOnFetchAbort: p,
            ignoreFetchAbort: d,
            status: a,
            signal: S
        }, b = this.#s.get(t);
        if (b === void 0) {
            a && (a.fetch = "miss");
            let m = this.#G(t, b, F, f);
            return m.__returned = m;
        } else {
            let m = this.#t[b];
            if (this.#e(m)) {
                let E = i && m.__staleWhileFetching !== void 0;
                return a && (a.fetch = "inflight", E && (a.returnedStale = !0)), E ? m.__staleWhileFetching : m.__returned = m;
            }
            let A = this.#p(b);
            if (!_ && !A) return a && (a.fetch = "hit"), this.#M(b), s && this.#D(b), a && this.#E(a, b), m;
            let z = this.#G(t, b, F, f), v = z.__staleWhileFetching !== void 0 && i;
            return a && (a.fetch = A ? "stale" : "refresh", v && A && (a.returnedStale = !0)), v ? z.__staleWhileFetching : z.__returned = z;
        }
    }
    forceFetch(t, e = {}) {
        let i = g.tracing.hasSubscribers, { status: s = C() ? {} : void 0 } = e;
        e.status = s, s && e.context && (s.context = e.context);
        let n = this.#K(t, e);
        return s && i && (s.trace = !0, g.tracing.tracePromise(()=>n, s).catch(()=>{})), n;
    }
    async #K(t, e = {}) {
        let i = await this.#q(t, e);
        if (i === void 0) throw new Error("fetch() returned undefined");
        return i;
    }
    memo(t, e = {}) {
        let { status: i = g.metrics.hasSubscribers ? {} : void 0 } = e;
        e.status = i, i && (i.op = "memo", i.key = t, e.context && (i.context = e.context), i.cache = this);
        let s = this.#Q(t, e);
        return i && (i.value = s), g.metrics.hasSubscribers && g.metrics.publish(i), s;
    }
    #Q(t, e = {}) {
        let i = this.#j;
        if (!i) throw new Error("no memoMethod provided to constructor");
        let { context: s, status: n, forceRefresh: o, ...l } = e;
        n && o && (n.forceRefresh = !0);
        let h = this.#L(t, l), r = o || h === void 0;
        if (n && (n.memo = r ? "miss" : "hit", r || (n.value = h)), !r) return h;
        let c = i(t, h, {
            options: l,
            context: s
        });
        return n && (n.value = c), this.#O(t, c, l), c;
    }
    get(t, e = {}) {
        let { status: i = g.metrics.hasSubscribers ? {} : void 0 } = e;
        e.status = i, i && (i.op = "get", i.key = t, i.cache = this);
        let s = this.#L(t, e);
        return i && (s !== void 0 && (i.value = s), g.metrics.hasSubscribers && g.metrics.publish(i)), s;
    }
    #L(t, e = {}) {
        let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n = this.noDeleteOnStaleGet, status: o } = e, l = this.#s.get(t);
        if (l === void 0) {
            o && (o.get = "miss");
            return;
        }
        let h = this.#t[l], r = this.#e(h);
        return o && this.#E(o, l), this.#p(l) ? r ? (o && (o.get = "stale-fetching"), i && h.__staleWhileFetching !== void 0 ? (o && (o.returnedStale = !0), h.__staleWhileFetching) : void 0) : (n || this.#v(t, "expire"), o && (o.get = "stale"), i ? (o && (o.returnedStale = !0), h) : void 0) : (o && (o.get = r ? "fetching" : "hit"), this.#M(l), s && this.#D(l), r ? h.__staleWhileFetching : h);
    }
    #B(t, e) {
        this.#u[e] = t, this.#l[t] = e;
    }
    #M(t) {
        t !== this.#h && (t === this.#a ? this.#a = this.#l[t] : this.#B(this.#u[t], this.#l[t]), this.#B(this.#h, t), this.#h = t);
    }
    delete(t) {
        return this.#v(t, "delete");
    }
    #v(t, e) {
        g.metrics.hasSubscribers && g.metrics.publish({
            op: "delete",
            delete: e,
            key: t,
            cache: this
        });
        let i = !1;
        if (this.#n !== 0) {
            let s = this.#s.get(t);
            if (s !== void 0) if (this.#g?.[s] && (clearTimeout(this.#g[s]), this.#g[s] = void 0), i = !0, this.#n === 1) this.#$(e);
            else {
                this.#C(s);
                let n = this.#t[s];
                if (this.#e(n) ? n.__abortController.abort(new Error("deleted")) : (this.#T || this.#f) && (this.#T && this.#m?.(n, t, e), this.#f && this.#r?.push([
                    n,
                    t,
                    e
                ])), this.#s.delete(t), this.#i[s] = void 0, this.#t[s] = void 0, s === this.#h) this.#h = this.#u[s];
                else if (s === this.#a) this.#a = this.#l[s];
                else {
                    let o = this.#u[s];
                    this.#l[o] = this.#l[s];
                    let l = this.#l[s];
                    this.#u[l] = this.#u[s];
                }
                this.#n--, this.#_.push(s);
            }
        }
        if (this.#f && this.#r?.length) {
            let s = this.#r, n;
            for(; n = s?.shift();)this.#S?.(...n);
        }
        return i;
    }
    clear() {
        return this.#$("delete");
    }
    #$(t) {
        for (let e of this.#z({
            allowStale: !0
        })){
            let i = this.#t[e];
            if (this.#e(i)) i.__abortController.abort(new Error("deleted"));
            else {
                let s = this.#i[e];
                this.#T && this.#m?.(i, s, t), this.#f && this.#r?.push([
                    i,
                    s,
                    t
                ]);
            }
        }
        if (this.#s.clear(), this.#t.fill(void 0), this.#i.fill(void 0), this.#d && this.#F) {
            this.#d.fill(0), this.#F.fill(0);
            for (let e of this.#g ?? [])e !== void 0 && clearTimeout(e);
            this.#g?.fill(void 0);
        }
        if (this.#y && this.#y.fill(0), this.#a = 0, this.#h = 0, this.#_.length = 0, this.#b = 0, this.#n = 0, this.#f && this.#r) {
            let e = this.#r, i;
            for(; i = e?.shift();)this.#S?.(...i);
        }
    }
};
exports.LRUCache = M;
}),
"[project]/node_modules/lru-memoizer/lib/async.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.asyncMemoizer = void 0;
const lru_cache_1 = __turbopack_context__.r("[project]/node_modules/lru-cache/dist/commonjs/node/index.min.js [app-route] (ecmascript)");
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const lodash_clonedeep_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/lodash.clonedeep/index.js [app-route] (ecmascript)"));
const freeze_1 = __turbopack_context__.r("[project]/node_modules/lru-memoizer/lib/freeze.js [app-route] (ecmascript)");
const sync_1 = __turbopack_context__.r("[project]/node_modules/lru-memoizer/lib/sync.js [app-route] (ecmascript)");
function asyncMemoizer(options) {
    const cache = new lru_cache_1.LRUCache(options);
    const load = options.load;
    const hash = options.hash;
    const bypass = options.bypass;
    const itemTTL = options.itemTTL;
    const freeze = options.freeze;
    const clone = options.clone;
    const queueTTL = options.queueTTL || 1000;
    const loading = new Map();
    const emitter = new events_1.EventEmitter();
    const memoizerMethods = Object.assign({
        del,
        reset: ()=>cache.clear(),
        keys: ()=>[
                ...cache.keys()
            ],
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter)
    }, options);
    if (options.disable) {
        return Object.assign(load, memoizerMethods);
    }
    function del(...args) {
        const key = hash(...args);
        cache.delete(key);
    }
    function add(key, parameters, result) {
        if (freeze) {
            result.forEach(freeze_1.deepFreeze);
        }
        if (itemTTL) {
            cache.set(key, result, {
                ttl: itemTTL(...parameters.concat(result))
            });
        } else {
            cache.set(key, result);
        }
    }
    function runCallbacks(callbacks, args) {
        for (const callback of callbacks){
            // Simulate async call when returning from cache
            // and yield between callback resolution
            if (clone) {
                setImmediate(callback, ...args.map(lodash_clonedeep_1.default));
            } else {
                setImmediate(callback, ...args);
            }
        }
    }
    function emit(event, ...parameters) {
        emitter.emit(event, ...parameters);
    }
    function memoizedFunction(...args) {
        const parameters = args.slice(0, -1);
        const callback = args.slice(-1).pop();
        let key;
        if (bypass && bypass(...parameters)) {
            emit('miss', ...parameters);
            return load(...args);
        }
        if (parameters.length === 0 && !hash) {
            //the load function only receives callback.
            key = '_';
        } else {
            key = hash(...parameters);
        }
        const fromCache = cache.get(key);
        if (fromCache) {
            emit('hit', ...parameters);
            // found, invoke callback
            return runCallbacks([
                callback
            ], [
                null
            ].concat(fromCache));
        }
        const pendingLoad = loading.get(key);
        if (pendingLoad && pendingLoad.expiresAt > Date.now()) {
            // request already in progress, queue and return
            pendingLoad.queue.push(callback);
            emit('queue', ...parameters);
            return;
        }
        emit('miss', ...parameters);
        const started = Date.now();
        // no pending request or not resolved before expiration
        // create a new queue and invoke load
        const queue = [
            callback
        ];
        loading.set(key, {
            queue,
            expiresAt: started + queueTTL
        });
        const loadHandler = (...args)=>{
            const err = args[0];
            if (!err) {
                add(key, parameters, args.slice(1));
            }
            // this can potentially delete a different queue than `queue` if
            // this callback was called after expiration.
            // that will only cause a new call to be performed and a new queue to be
            // created
            loading.delete(key);
            emit('loaded', Date.now() - started, ...parameters);
            runCallbacks(queue, args);
        };
        load(...parameters, loadHandler);
    }
    ;
    return Object.assign(memoizedFunction, memoizerMethods);
}
exports.asyncMemoizer = asyncMemoizer;
asyncMemoizer.sync = sync_1.syncMemoizer;
}),
"[project]/node_modules/lru-memoizer/lib/freeze.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// From https://raw.githubusercontent.com/nikoskalogridis/deep-freeze/fb921b32064dce1645197be2bf975fe0385450b0/index.js
// which is sadly, no longer maintained
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepFreeze = void 0;
function deepFreeze(o) {
    if (o) {
        Object.freeze(o);
        Object.getOwnPropertyNames(o).forEach(function(prop) {
            if (o.hasOwnProperty(prop) && o[prop] !== null && (typeof o[prop] === 'object' || typeof o[prop] === 'function') && o[prop].constructor !== Buffer && !Object.isFrozen(o[prop])) {
                deepFreeze(o[prop]);
            }
        });
    }
    return o;
}
exports.deepFreeze = deepFreeze;
;
}),
"[project]/node_modules/lru-memoizer/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const async_1 = __turbopack_context__.r("[project]/node_modules/lru-memoizer/lib/async.js [app-route] (ecmascript)");
module.exports = async_1.asyncMemoizer;
}),
"[project]/node_modules/lru-memoizer/lib/sync.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.syncMemoizer = void 0;
const lru_cache_1 = __turbopack_context__.r("[project]/node_modules/lru-cache/dist/commonjs/node/index.min.js [app-route] (ecmascript)");
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const lodash_clonedeep_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/lodash.clonedeep/index.js [app-route] (ecmascript)"));
const freeze_1 = __turbopack_context__.r("[project]/node_modules/lru-memoizer/lib/freeze.js [app-route] (ecmascript)");
function syncMemoizer(options) {
    const cache = new lru_cache_1.LRUCache(options);
    const load = options.load;
    const hash = options.hash;
    const bypass = options.bypass;
    const itemTTL = options.itemTTL;
    const freeze = options.freeze;
    const clone = options.clone;
    const emitter = new events_1.EventEmitter();
    const defaultResult = Object.assign({
        del,
        reset: ()=>cache.clear(),
        keys: ()=>[
                ...cache.keys()
            ],
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter)
    }, options);
    if (options.disable) {
        return Object.assign(load, defaultResult);
    }
    function del() {
        const key = hash(...arguments);
        cache.delete(key);
    }
    function emit(event, ...parameters) {
        emitter.emit(event, ...parameters);
    }
    function isPromise(result) {
        // detect native, bluebird, A+ promises
        return result && result.then && typeof result.then === 'function';
    }
    function processResult(result) {
        let res = result;
        if (clone) {
            if (isPromise(res)) {
                res = res.then(lodash_clonedeep_1.default);
            } else {
                res = (0, lodash_clonedeep_1.default)(res);
            }
        }
        if (freeze) {
            if (isPromise(res)) {
                res = res.then(freeze_1.deepFreeze);
            } else {
                (0, freeze_1.deepFreeze)(res);
            }
        }
        return res;
    }
    const result = function(...args) {
        if (bypass && bypass(...args)) {
            emit('miss', ...args);
            return load(...args);
        }
        var key = hash(...args);
        var fromCache = cache.get(key);
        if (fromCache) {
            emit('hit', ...args);
            return processResult(fromCache);
        }
        emit('miss', ...args);
        const result = load(...args);
        if (itemTTL) {
            // @ts-ignore
            cache.set(key, result, {
                ttl: itemTTL(...args.concat([
                    result
                ]))
            });
        } else {
            cache.set(key, result);
        }
        return processResult(result);
    };
    return Object.assign(result, defaultResult);
}
exports.syncMemoizer = syncMemoizer;
}),
"[project]/node_modules/ms/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Helpers.
 */ var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
        return parse(val);
    } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch(type){
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
}),
"[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ /* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return buffer.SlowBuffer(size);
};
}),
"[project]/node_modules/semver/classes/comparator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const ANY = Symbol('SemVer ANY');
// hoisted class for cyclic dependency
class Comparator {
    static get ANY() {
        return ANY;
    }
    constructor(comp, options){
        options = parseOptions(options);
        if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
                return comp;
            } else {
                comp = comp.value;
            }
        }
        comp = comp.trim().split(/\s+/).join(' ');
        debug('comparator', comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
            this.value = '';
        } else {
            this.value = this.operator + this.semver.version;
        }
        debug('comp', this);
    }
    parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== undefined ? m[1] : '';
        if (this.operator === '=') {
            this.operator = '';
        }
        // if it literally is just '>' or '' then allow anything.
        if (!m[2]) {
            this.semver = ANY;
        } else {
            this.semver = new SemVer(m[2], this.options.loose);
        }
    }
    toString() {
        return this.value;
    }
    test(version) {
        debug('Comparator.test', version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
            return true;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
            throw new TypeError('a Comparator is required');
        }
        if (this.operator === '') {
            if (this.value === '') {
                return true;
            }
            return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
            if (comp.value === '') {
                return true;
            }
            return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        // Special cases where nothing can possibly be lower
        if (options.includePrerelease && (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
            return false;
        }
        if (!options.includePrerelease && (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
            return false;
        }
        // Same direction increasing (> or >=)
        if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
            return true;
        }
        // Same direction decreasing (< or <=)
        if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
            return true;
        }
        // same SemVer and both sides are inclusive (<= or >=)
        if (this.semver.version === comp.semver.version && this.operator.includes('=') && comp.operator.includes('=')) {
            return true;
        }
        // opposite directions less than
        if (cmp(this.semver, '<', comp.semver, options) && this.operator.startsWith('>') && comp.operator.startsWith('<')) {
            return true;
        }
        // opposite directions greater than
        if (cmp(this.semver, '>', comp.semver, options) && this.operator.startsWith('<') && comp.operator.startsWith('>')) {
            return true;
        }
        return false;
    }
}
module.exports = Comparator;
const parseOptions = __turbopack_context__.r("[project]/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
}),
"[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SPACE_CHARACTERS = /\s+/g;
// hoisted class for cyclic dependency
class Range {
    constructor(range, options){
        options = parseOptions(options);
        if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
                return range;
            } else {
                return new Range(range.raw, options);
            }
        }
        if (range instanceof Comparator) {
            // just put it in the set and return
            this.raw = range.value;
            this.set = [
                [
                    range
                ]
            ];
            this.formatted = undefined;
            return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        // First reduce all whitespace as much as possible so we do not have to rely
        // on potentially slow regexes like \s*. This is then stored and used for
        // future error messages as well.
        this.raw = range.trim().replace(SPACE_CHARACTERS, ' ');
        // First, split on ||
        this.set = this.raw.split('||')// map the range to a 2d array of comparators
        .map((r)=>this.parseRange(r.trim()))// throw out any comparator lists that are empty
        // this generally means that it was not a valid range, which is allowed
        // in loose mode, but will still throw if the WHOLE range is invalid.
        .filter((c)=>c.length);
        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        // if we have any that are not the null set, throw out null sets.
        if (this.set.length > 1) {
            // keep the first one, in case they're all null sets
            const first = this.set[0];
            this.set = this.set.filter((c)=>!isNullSet(c[0]));
            if (this.set.length === 0) {
                this.set = [
                    first
                ];
            } else if (this.set.length > 1) {
                // if we have any that are *, then the range is just *
                for (const c of this.set){
                    if (c.length === 1 && isAny(c[0])) {
                        this.set = [
                            c
                        ];
                        break;
                    }
                }
            }
        }
        this.formatted = undefined;
    }
    get range() {
        if (this.formatted === undefined) {
            this.formatted = '';
            for(let i = 0; i < this.set.length; i++){
                if (i > 0) {
                    this.formatted += '||';
                }
                const comps = this.set[i];
                for(let k = 0; k < comps.length; k++){
                    if (k > 0) {
                        this.formatted += ' ';
                    }
                    this.formatted += comps[k].toString().trim();
                }
            }
        }
        return this.formatted;
    }
    format() {
        return this.range;
    }
    toString() {
        return this.range;
    }
    parseRange(range) {
        // strip build metadata so it can't bleed into the version
        range = range.replace(BUILDSTRIPRE, '');
        // memoize range parsing for performance.
        // this is a very hot path, and fully deterministic.
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ':' + range;
        const cached = cache.get(memoKey);
        if (cached) {
            return cached;
        }
        const loose = this.options.loose;
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug('hyphen replace', range);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = trimComparatorWhitespace(range);
        debug('comparator trim', range);
        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug('tilde trim', range);
        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug('caret trim', range);
        // At this point, the range is completely trimmed and
        // ready to be split into comparators.
        let rangeList = range.split(' ').map((comp)=>parseComparator(comp, this.options)).join(' ').split(/\s+/)// >=0.0.0 is equivalent to *
        .map((comp)=>replaceGTE0(comp, this.options));
        if (loose) {
            // in loose mode, throw out any that are not valid comparators
            rangeList = rangeList.filter((comp)=>{
                debug('loose invalid filter', comp, this.options);
                return !!comp.match(re[t.COMPARATORLOOSE]);
            });
        }
        debug('range list', rangeList);
        // if any comparators are the null set, then replace with JUST null set
        // if more than one comparator, remove any * comparators
        // also, don't include the same comparator more than once
        const rangeMap = new Map();
        const comparators = rangeList.map((comp)=>new Comparator(comp, this.options));
        for (const comp of comparators){
            if (isNullSet(comp)) {
                return [
                    comp
                ];
            }
            rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has('')) {
            rangeMap.delete('');
        }
        const result = [
            ...rangeMap.values()
        ];
        cache.set(memoKey, result);
        return result;
    }
    intersects(range, options) {
        if (!(range instanceof Range)) {
            throw new TypeError('a Range is required');
        }
        return this.set.some((thisComparators)=>{
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators)=>{
                return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator)=>{
                    return rangeComparators.every((rangeComparator)=>{
                        return thisComparator.intersects(rangeComparator, options);
                    });
                });
            });
        });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        for(let i = 0; i < this.set.length; i++){
            if (testSet(this.set[i], version, this.options)) {
                return true;
            }
        }
        return false;
    }
}
module.exports = Range;
const LRU = __turbopack_context__.r("[project]/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)");
const cache = new LRU();
const parseOptions = __turbopack_context__.r("[project]/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const trimComparatorWhitespace = __turbopack_context__.r("[project]/node_modules/semver/internal/trim-comparator-whitespace.js [app-route] (ecmascript)");
const { safeRe: re, src, t, tildeTrimReplace, caretTrimReplace } = __turbopack_context__.r("[project]/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __turbopack_context__.r("[project]/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
// unbounded global build-metadata stripper used by parseRange
const BUILDSTRIPRE = new RegExp(src[t.BUILD], 'g');
const isNullSet = (c)=>c.value === '<0.0.0-0';
const isAny = (c)=>c.value === '';
// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options)=>{
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while(result && remainingComparators.length){
        result = remainingComparators.every((otherComparator)=>{
            return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
    }
    return result;
};
// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options)=>{
    comp = comp.replace(re[t.BUILD], '');
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp;
};
const isX = (id)=>!id || id.toLowerCase() === 'x' || id === '*';
const invalidXRangeOrder = (M, m, p)=>isX(M) && !isX(m) || isX(m) && p && !isX(p);
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceTilde(c, options)).join(' ');
};
const replaceTilde = (comp, options)=>{
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    // if we're including prereleases in the match, then the lower bound is
    // -0, the lowest possible prerelease value, just like x-ranges and carets.
    // this keeps `~1.2` equivalent to the `1.2.x` x-range it's documented as.
    const z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('tilde', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else if (pr) {
            debug('replaceTilde pr', pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug('tilde return', ret);
        return ret;
    });
};
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceCaret(c, options)).join(' ');
};
const replaceCaret = (comp, options)=>{
    debug('caret', comp, options);
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    const z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('caret', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            if (M === '0') {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        } else if (pr) {
            debug('replaceCaret pr', pr);
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        } else {
            debug('no pr');
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        debug('caret return', ret);
        return ret;
    });
};
const replaceXRanges = (comp, options)=>{
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map((c)=>replaceXRange(c, options)).join(' ');
};
const replaceXRange = (comp, options)=>{
    comp = comp.trim();
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr)=>{
        debug('xRange', comp, ret, gtlt, M, m, p, pr);
        if (invalidXRangeOrder(M, m, p)) {
            return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
            gtlt = '';
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
            if (gtlt === '>' || gtlt === '<') {
                // nothing is allowed
                ret = '<0.0.0-0';
            } else {
                // nothing is forbidden
                ret = '*';
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }
            if (gtlt === '<') {
                pr = '-0';
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug('xRange return', ret);
        return ret;
    });
};
// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options)=>{
    debug('replaceStars', comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], '');
};
const replaceGTE0 = (comp, options)=>{
    debug('replaceGTE0', comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '');
};
// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
// TODO build?
const hyphenReplace = (incPr)=>($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr)=>{
        if (isX(fM)) {
            from = '';
        } else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
        } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
        } else if (fpr) {
            from = `>=${from}`;
        } else {
            from = `>=${from}${incPr ? '-0' : ''}`;
        }
        if (isX(tM)) {
            to = '';
        } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
            to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
    };
const testSet = (set, version, options)=>{
    for(let i = 0; i < set.length; i++){
        if (!set[i].test(version)) {
            return false;
        }
    }
    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for(let i = 0; i < set.length; i++){
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
                continue;
            }
            if (set[i].semver.prerelease.length > 0) {
                const allowed = set[i].semver;
                if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                    return true;
                }
            }
        }
        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }
    return true;
};
}),
"[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = __turbopack_context__.r("[project]/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __turbopack_context__.r("[project]/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const parseOptions = __turbopack_context__.r("[project]/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { compareIdentifiers } = __turbopack_context__.r("[project]/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
const isPrereleaseIdentifier = (prerelease, identifier)=>{
    const identifiers = identifier.split('.');
    if (identifiers.length > prerelease.length) {
        return false;
    }
    for(let i = 0; i < identifiers.length; i++){
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
            return false;
        }
    }
    return true;
};
class SemVer {
    constructor(version, options){
        options = parseOptions(options);
        if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
                return version;
            } else {
                version = version.version;
            }
        } else if (typeof version !== 'string') {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
            throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError('Invalid major version');
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError('Invalid minor version');
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError('Invalid patch version');
        }
        // numberify any prerelease numeric ids
        if (!m[4]) {
            this.prerelease = [];
        } else {
            this.prerelease = m[4].split('.').map((id)=>{
                if (/^[0-9]+$/.test(id)) {
                    const num = +id;
                    if (num >= 0 && num < MAX_SAFE_INTEGER) {
                        return num;
                    }
                }
                return id;
            });
        }
        this.build = m[5] ? m[5].split('.') : [];
        this.format();
    }
    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
    }
    toString() {
        return this.version;
    }
    compare(other) {
        debug('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof SemVer)) {
            if (typeof other === 'string' && other === this.version) {
                return 0;
            }
            other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
            return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        if (this.major < other.major) {
            return -1;
        }
        if (this.major > other.major) {
            return 1;
        }
        if (this.minor < other.minor) {
            return -1;
        }
        if (this.minor > other.minor) {
            return 1;
        }
        if (this.patch < other.patch) {
            return -1;
        }
        if (this.patch > other.patch) {
            return 1;
        }
        return 0;
    }
    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }
        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    compareBuild(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            debug('build compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
        if (release.startsWith('pre')) {
            if (!identifier && identifierBase === false) {
                throw new Error('invalid increment argument: identifier is empty');
            }
            // Avoid an invalid semver results
            if (identifier) {
                const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
                if (!match || match[1] !== identifier) {
                    throw new Error(`invalid identifier: ${identifier}`);
                }
            }
        }
        switch(release){
            case 'premajor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'preminor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'prepatch':
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc('patch', identifier, identifierBase);
                this.inc('pre', identifier, identifierBase);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case 'prerelease':
                if (this.prerelease.length === 0) {
                    this.inc('patch', identifier, identifierBase);
                }
                this.inc('pre', identifier, identifierBase);
                break;
            case 'release':
                if (this.prerelease.length === 0) {
                    throw new Error(`version ${this.raw} is not a prerelease`);
                }
                this.prerelease.length = 0;
                break;
            case 'major':
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                    this.major++;
                }
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'minor':
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) {
                    this.minor++;
                }
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'patch':
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) {
                    this.patch++;
                }
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case 'pre':
                {
                    const base = Number(identifierBase) ? 1 : 0;
                    if (this.prerelease.length === 0) {
                        this.prerelease = [
                            base
                        ];
                    } else {
                        let i = this.prerelease.length;
                        while(--i >= 0){
                            if (typeof this.prerelease[i] === 'number') {
                                this.prerelease[i]++;
                                i = -2;
                            }
                        }
                        if (i === -1) {
                            // didn't increment anything
                            if (identifier === this.prerelease.join('.') && identifierBase === false) {
                                throw new Error('invalid increment argument: identifier already exists');
                            }
                            this.prerelease.push(base);
                        }
                    }
                    if (identifier) {
                        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                        let prerelease = [
                            identifier,
                            base
                        ];
                        if (identifierBase === false) {
                            prerelease = [
                                identifier
                            ];
                        }
                        if (isPrereleaseIdentifier(this.prerelease, identifier)) {
                            const prereleaseBase = this.prerelease[identifier.split('.').length];
                            if (isNaN(prereleaseBase)) {
                                this.prerelease = prerelease;
                            }
                        } else {
                            this.prerelease = prerelease;
                        }
                    }
                    break;
                }
            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
            this.raw += `+${this.build.join('.')}`;
        }
        return this;
    }
}
module.exports = SemVer;
}),
"[project]/node_modules/semver/functions/clean.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const clean = (version, options)=>{
    const s = parse(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null;
};
module.exports = clean;
}),
"[project]/node_modules/semver/functions/cmp.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const eq = __turbopack_context__.r("[project]/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = (a, op, b, loose)=>{
    switch(op){
        case '===':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a === b;
        case '!==':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a !== b;
        case '':
        case '=':
        case '==':
            return eq(a, b, loose);
        case '!=':
            return neq(a, b, loose);
        case '>':
            return gt(a, b, loose);
        case '>=':
            return gte(a, b, loose);
        case '<':
            return lt(a, b, loose);
        case '<=':
            return lte(a, b, loose);
        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }
};
module.exports = cmp;
}),
"[project]/node_modules/semver/functions/coerce.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const coerce = (version, options)=>{
    if (version instanceof SemVer) {
        return version;
    }
    if (typeof version === 'number') {
        version = String(version);
    }
    if (typeof version !== 'string') {
        return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
    } else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)){
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
                match = next;
            }
            coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
        return null;
    }
    const major = match[2];
    const minor = match[3] || '0';
    const patch = match[4] || '0';
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : '';
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : '';
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
};
module.exports = coerce;
}),
"[project]/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compareBuild = (a, b, loose)=>{
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
module.exports = compareBuild;
}),
"[project]/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const compareLoose = (a, b)=>compare(a, b, true);
module.exports = compareLoose;
}),
"[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compare = (a, b, loose)=>new SemVer(a, loose).compare(new SemVer(b, loose));
module.exports = compare;
}),
"[project]/node_modules/semver/functions/diff.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const diff = (version1, version2)=>{
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
        return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
        // Going from prerelease -> no prerelease requires some special casing
        // If the low version has only a major, then it will always be a major
        // Some examples:
        // 1.0.0-1 -> 1.0.0
        // 1.0.0-1 -> 1.1.1
        // 1.0.0-1 -> 2.0.0
        if (!lowVersion.patch && !lowVersion.minor) {
            return 'major';
        }
        // If the main part has no difference
        if (lowVersion.compareMain(highVersion) === 0) {
            if (lowVersion.minor && !lowVersion.patch) {
                return 'minor';
            }
            return 'patch';
        }
    }
    // add the `pre` prefix if we are going to a prerelease version
    const prefix = highHasPre ? 'pre' : '';
    if (v1.major !== v2.major) {
        return prefix + 'major';
    }
    if (v1.minor !== v2.minor) {
        return prefix + 'minor';
    }
    if (v1.patch !== v2.patch) {
        return prefix + 'patch';
    }
    // high and low are prereleases
    return 'prerelease';
};
module.exports = diff;
}),
"[project]/node_modules/semver/functions/eq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const eq = (a, b, loose)=>compare(a, b, loose) === 0;
module.exports = eq;
}),
"[project]/node_modules/semver/functions/gt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gt = (a, b, loose)=>compare(a, b, loose) > 0;
module.exports = gt;
}),
"[project]/node_modules/semver/functions/gte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gte = (a, b, loose)=>compare(a, b, loose) >= 0;
module.exports = gte;
}),
"[project]/node_modules/semver/functions/inc.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const inc = (version, release, options, identifier, identifierBase)=>{
    if (typeof options === 'string') {
        identifierBase = identifier;
        identifier = options;
        options = undefined;
    }
    try {
        return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
        return null;
    }
};
module.exports = inc;
}),
"[project]/node_modules/semver/functions/lt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lt = (a, b, loose)=>compare(a, b, loose) < 0;
module.exports = lt;
}),
"[project]/node_modules/semver/functions/lte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lte = (a, b, loose)=>compare(a, b, loose) <= 0;
module.exports = lte;
}),
"[project]/node_modules/semver/functions/major.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const major = (a, loose)=>new SemVer(a, loose).major;
module.exports = major;
}),
"[project]/node_modules/semver/functions/minor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const minor = (a, loose)=>new SemVer(a, loose).minor;
module.exports = minor;
}),
"[project]/node_modules/semver/functions/neq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const neq = (a, b, loose)=>compare(a, b, loose) !== 0;
module.exports = neq;
}),
"[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = (version, options, throwErrors = false)=>{
    if (version instanceof SemVer) {
        return version;
    }
    try {
        return new SemVer(version, options);
    } catch (er) {
        if (!throwErrors) {
            return null;
        }
        throw er;
    }
};
module.exports = parse;
}),
"[project]/node_modules/semver/functions/patch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const patch = (a, loose)=>new SemVer(a, loose).patch;
module.exports = patch;
}),
"[project]/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const prerelease = (version, options)=>{
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
module.exports = prerelease;
}),
"[project]/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = (a, b, loose)=>compare(b, a, loose);
module.exports = rcompare;
}),
"[project]/node_modules/semver/functions/rsort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const rsort = (list, loose)=>list.sort((a, b)=>compareBuild(b, a, loose));
module.exports = rsort;
}),
"[project]/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = (version, range, options)=>{
    try {
        range = new Range(range, options);
    } catch (er) {
        return false;
    }
    return range.test(version);
};
module.exports = satisfies;
}),
"[project]/node_modules/semver/functions/sort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = (list, loose)=>list.sort((a, b)=>compareBuild(a, b, loose));
module.exports = sort;
}),
"[project]/node_modules/semver/functions/truncate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const truncate = (version, truncation, options)=>{
    if (!constants.RELEASE_TYPES.includes(truncation)) {
        return null;
    }
    const clonedVersion = cloneInputVersion(version, options);
    return clonedVersion && doTruncation(clonedVersion, truncation);
};
const cloneInputVersion = (version, options)=>{
    const versionStringToParse = version instanceof SemVer ? version.version : version;
    return parse(versionStringToParse, options);
};
const doTruncation = (version, truncation)=>{
    if (isPrerelease(truncation)) {
        return version.version;
    }
    version.prerelease = [];
    switch(truncation){
        case 'major':
            version.minor = 0;
            version.patch = 0;
            break;
        case 'minor':
            version.patch = 0;
            break;
    }
    return version.format();
};
const isPrerelease = (type)=>{
    return type.startsWith('pre');
};
module.exports = truncate;
}),
"[project]/node_modules/semver/functions/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = (version, options)=>{
    const v = parse(version, options);
    return v ? v.version : null;
};
module.exports = valid;
}),
"[project]/node_modules/semver/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// just pre-load all the stuff that index.js lazily exports
const internalRe = __turbopack_context__.r("[project]/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const identifiers = __turbopack_context__.r("[project]/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = __turbopack_context__.r("[project]/node_modules/semver/functions/valid.js [app-route] (ecmascript)");
const clean = __turbopack_context__.r("[project]/node_modules/semver/functions/clean.js [app-route] (ecmascript)");
const inc = __turbopack_context__.r("[project]/node_modules/semver/functions/inc.js [app-route] (ecmascript)");
const diff = __turbopack_context__.r("[project]/node_modules/semver/functions/diff.js [app-route] (ecmascript)");
const major = __turbopack_context__.r("[project]/node_modules/semver/functions/major.js [app-route] (ecmascript)");
const minor = __turbopack_context__.r("[project]/node_modules/semver/functions/minor.js [app-route] (ecmascript)");
const patch = __turbopack_context__.r("[project]/node_modules/semver/functions/patch.js [app-route] (ecmascript)");
const prerelease = __turbopack_context__.r("[project]/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = __turbopack_context__.r("[project]/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)");
const compareLoose = __turbopack_context__.r("[project]/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)");
const compareBuild = __turbopack_context__.r("[project]/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = __turbopack_context__.r("[project]/node_modules/semver/functions/sort.js [app-route] (ecmascript)");
const rsort = __turbopack_context__.r("[project]/node_modules/semver/functions/rsort.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const eq = __turbopack_context__.r("[project]/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const coerce = __turbopack_context__.r("[project]/node_modules/semver/functions/coerce.js [app-route] (ecmascript)");
const truncate = __turbopack_context__.r("[project]/node_modules/semver/functions/truncate.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const toComparators = __turbopack_context__.r("[project]/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)");
const maxSatisfying = __turbopack_context__.r("[project]/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)");
const minSatisfying = __turbopack_context__.r("[project]/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)");
const minVersion = __turbopack_context__.r("[project]/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)");
const validRange = __turbopack_context__.r("[project]/node_modules/semver/ranges/valid.js [app-route] (ecmascript)");
const outside = __turbopack_context__.r("[project]/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = __turbopack_context__.r("[project]/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)");
const ltr = __turbopack_context__.r("[project]/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)");
const intersects = __turbopack_context__.r("[project]/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)");
const simplifyRange = __turbopack_context__.r("[project]/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)");
const subset = __turbopack_context__.r("[project]/node_modules/semver/ranges/subset.js [app-route] (ecmascript)");
module.exports = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    truncate,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers
};
}),
"[project]/node_modules/semver/internal/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;
// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
// ECMAScript whitespace and line terminators matched by \s.
const WHITESPACE_CHARACTERS = [
    '\t',
    '\n',
    '\v',
    '\f',
    '\r',
    ' ',
    '\u00a0',
    '\u1680',
    '\u2000',
    '\u2001',
    '\u2002',
    '\u2003',
    '\u2004',
    '\u2005',
    '\u2006',
    '\u2007',
    '\u2008',
    '\u2009',
    '\u200a',
    '\u2028',
    '\u2029',
    '\u202f',
    '\u205f',
    '\u3000',
    '\ufeff'
];
const RELEASE_TYPES = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease'
];
module.exports = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    WHITESPACE_CHARACTERS,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 0b001,
    FLAG_LOOSE: 0b010
};
}),
"[project]/node_modules/semver/internal/debug.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args)=>console.error('SEMVER', ...args) : ()=>{};
module.exports = debug;
}),
"[project]/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b)=>{
    if (typeof a === 'number' && typeof b === 'number') {
        return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b)=>compareIdentifiers(b, a);
module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
};
}),
"[project]/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

class LRUCache {
    constructor(){
        this.max = 1000;
        this.map = new Map();
    }
    get(key) {
        const value = this.map.get(key);
        if (value === undefined) {
            return undefined;
        } else {
            // Remove the key from the map and add it to the end
            this.map.delete(key);
            this.map.set(key, value);
            return value;
        }
    }
    delete(key) {
        return this.map.delete(key);
    }
    set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== undefined) {
            // If cache is full, delete the least recently used item
            if (this.map.size >= this.max) {
                const firstKey = this.map.keys().next().value;
                this.delete(firstKey);
            }
            this.map.set(key, value);
        }
        return this;
    }
}
module.exports = LRUCache;
}),
"[project]/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// parse out just the options we care about
const looseOption = Object.freeze({
    loose: true
});
const emptyOpts = Object.freeze({});
const parseOptions = (options)=>{
    if (!options) {
        return emptyOpts;
    }
    if (typeof options !== 'object') {
        return looseOption;
    }
    return options;
};
module.exports = parseOptions;
}),
"[project]/node_modules/semver/internal/re.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = __turbopack_context__.r("[project]/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
exports = module.exports = {};
// The actual regexps go on exports.re
const re = exports.re = [];
const safeRe = exports.safeRe = [];
const src = exports.src = [];
const safeSrc = exports.safeSrc = [];
const t = exports.t = {};
let R = 0;
const LETTERDASHNUMBER = '[a-zA-Z0-9-]';
// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
    [
        '\\s',
        1
    ],
    [
        '\\d',
        MAX_LENGTH
    ],
    [
        LETTERDASHNUMBER,
        MAX_SAFE_BUILD_LENGTH
    ]
];
const makeSafeRegex = (value)=>{
    for (const [token, max] of safeRegexReplacements){
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
};
const createToken = (name, value, isGlobal)=>{
    const safe = makeSafeRegex(value);
    const index = R++;
    debug(name, index, value);
    t[name] = index;
    src[index] = value;
    safeSrc[index] = safe;
    re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined);
};
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '\\d+');
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
// ## Main Version
// Three dot-separated numeric identifiers.
createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
// Non-numeric identifiers include numeric identifiers but can be longer.
// Therefore non-numeric identifiers must go first.
createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
createToken('FULL', `^${src[t.FULLPLAIN]}$`);
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
createToken('GTLT', '((?:<|>)?=?)');
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifier, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCEPLAIN', `${'(^|[^\\d])' + '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
createToken('COERCEFULL', src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?` + `(?:${src[t.BUILD]})?` + `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);
createToken('COERCERTLFULL', src[t.COERCEFULL], true);
// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');
createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';
createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');
createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';
createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$');
}),
"[project]/node_modules/semver/internal/trim-comparator-whitespace.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// @ts-check
// Reproduce safeRe[COMPARATORTRIM] replacement boundaries, not version
// validation. Each end-index finder returns an exclusive end, or its start
// on no match.
// Positions count from zero. An end of 3 means characters 0, 1, and 2 were read;
// range.slice(start, end) gives the matched text, not a converted number.
const { MAX_LENGTH, MAX_SAFE_BUILD_LENGTH, WHITESPACE_CHARACTERS } = __turbopack_context__.r("[project]/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
/**
 * Remembers the last two rows of digits so their characters need not be reread.
 * Positions start at -1 until a row has been found.
 *
 * @typedef {object} DigitRunCache
 * @property {number} start The first character of the most recently found row.
 * @property {number} end The position after that row's last character.
 * @property {number} previousStart The first character of the previous row.
 * @property {number} previousEnd The position after the previous row.
 */ // One entry per UTF-16 code unit keeps membership checks constant-time.
const whitespace = new Uint8Array(0x10000);
for (const char of WHITESPACE_CHARACTERS){
    whitespace[char.charCodeAt(0)] = 1;
}
/**
 * Checks whether a character is whitespace, like a space, tab, or newline.
 * Looking past the end of the string returns false.
 *
 * @param {string|undefined} char One character, or undefined past the string's end.
 * @returns {boolean} Whether the character is whitespace.
 * @example isWhitespace(' ') // true
 * @example isWhitespace('1') // false
 */ const isWhitespace = (char)=>char !== undefined && whitespace[char.charCodeAt(0)] === 1;
/**
 * Checks for v, =, or whitespace before the version number.
 * These are historical version prefixes, not range operators:
 * < and > are handled separately, as are tilde and caret ranges.
 *
 * @param {string|undefined} char One character to check.
 * @returns {boolean} Whether the character can belong to a version prefix.
 * @example isVersionPrefix('=') // true
 * @example isVersionPrefix('>') // false
 */ const isVersionPrefix = (char)=>char === 'v' || char === '=' || isWhitespace(char);
/**
 * Checks whether a character is one of the digits 0 through 9.
 *
 * @param {string|undefined} char One character to check.
 * @returns {boolean} Whether the character is an ASCII digit.
 * @example isDigit('7') // true
 * @example isDigit('.') // false
 */ const isDigit = (char)=>char !== undefined && char >= '0' && char <= '9';
/**
 * Checks whether a character is an English letter, uppercase or lowercase.
 *
 * @param {string|undefined} char One character to check.
 * @returns {boolean} Whether the character is an ASCII letter.
 * @example isLetter('b') // true
 * @example isLetter('7') // false
 */ const isLetter = (char)=>char !== undefined && (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z');
/**
 * Checks for a letter, digit, or hyphen: the characters allowed inside
 * prerelease and build names such as beta-1.
 *
 * @param {string|undefined} char One character to check.
 * @returns {boolean} Whether the character can be part of an identifier.
 * @example isIdentifierCharacter('-') // true
 * @example isIdentifierCharacter('.') // false; dots separate identifiers
 */ const isIdentifierCharacter = (char)=>isDigit(char) || isLetter(char) || char === '-';
/**
 * Checks whether a version component can begin here: with a digit or
 * a wildcard such as x, X, or *.
 *
 * @param {string|undefined} char One character to check.
 * @returns {boolean} Whether a number or wildcard can start with this character.
 * @example isVersionStart('x') // true
 * @example isVersionStart('v') // false; v belongs to the prefix
 */ const isVersionStart = (char)=>isDigit(char) || char === 'x' || char === 'X' || char === '*';
/**
 * Finds the end of a row of digits, but returns no more than limit digits.
 * Remembers the last two rows so looking at them again does not reread them.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position of the first character to check.
 * @param {number} limit The most digit characters the returned match can include.
 * @param {DigitRunCache} digitRuns Shared cache of digit-run positions, updated in place.
 * @returns {number} The position after the matched digits, or start if none match.
 * @example findDigitsEndIndex('123abc', 0, 10, digitRuns) // 3, pointing at a
 * @example findDigitsEndIndex('123abc', 0, 2, digitRuns) // 2, pointing at the unread 3
 */ const findDigitsEndIndex = (range, start, limit, digitRuns)=>{
    if (!isDigit(range[start])) {
        return start;
    }
    if (start >= digitRuns.start && start < digitRuns.end) {
        return Math.min(start + limit, digitRuns.end);
    }
    if (start >= digitRuns.previousStart && start < digitRuns.previousEnd) {
        return Math.min(start + limit, digitRuns.previousEnd);
    }
    let end = start + 1;
    while(isDigit(range[end])){
        end++;
    }
    // A failed full version can rewind from its second run to its first.
    digitRuns.previousStart = digitRuns.start;
    digitRuns.previousEnd = digitRuns.end;
    digitRuns.start = start;
    digitRuns.end = end;
    return Math.min(start + limit, end);
};
/**
 * Reads a number using the old regex's length and leading-zero rules.
 * Strict mode reads just the first zero in 012; loose mode can read all three.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position where the number should begin.
 * @param {boolean} loose Whether to allow leading zeros.
 * @param {DigitRunCache} digitRuns Shared digit-run cache, updated as needed.
 * @returns {number} The position after the matched digits, not their numeric value.
 * @example findVersionNumberEndIndex('012', 0, false, digitRuns) // 1
 * @example findVersionNumberEndIndex('012', 0, true, digitRuns) // 3
 */ const findVersionNumberEndIndex = (range, start, loose, digitRuns)=>{
    if (!loose && range[start] === '0') {
        return start + 1;
    }
    // Strict syntax allows an initial nonzero digit plus MAX_LENGTH digits.
    return findDigitsEndIndex(range, start, loose ? MAX_LENGTH : MAX_LENGTH + 1, digitRuns);
};
/**
 * Reads one piece of a prerelease name, such as beta or 1 in beta.1.
 * Tries the letter-or-hyphen form first, then the number-only form.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position where the identifier should begin.
 * @param {boolean} loose Whether numeric identifiers may have leading zeros.
 * @param {DigitRunCache} digitRuns Shared digit-run cache, updated as needed.
 * @returns {number} The position after the identifier, or start if none matches.
 * @example findPrereleaseIdentifierEndIndex('beta.1', 0, false, digitRuns) // 4, at the dot
 * @example findPrereleaseIdentifierEndIndex('001beta', 0, false, digitRuns) // 7
 */ const findPrereleaseIdentifierEndIndex = (range, start, loose, digitRuns)=>{
    const digitsEnd = findDigitsEndIndex(range, start, MAX_LENGTH, digitRuns);
    // The legacy regex tries a nonnumeric identifier before a numeric one.
    if (isLetter(range[digitsEnd]) || range[digitsEnd] === '-') {
        let end = digitsEnd + 1;
        const limit = end + MAX_SAFE_BUILD_LENGTH;
        while(end < limit && isIdentifierCharacter(range[end])){
            end++;
        }
        return end;
    }
    return findVersionNumberEndIndex(range, start, loose, digitRuns);
};
/**
 * Reads a prerelease suffix such as -beta.1, one dot-separated piece at a time.
 * Loose mode also allows the name without its opening hyphen.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position where the suffix should begin, including -.
 * @param {boolean} loose Whether the opening hyphen is optional and zeros allowed.
 * @param {DigitRunCache} digitRuns Shared digit-run cache, updated as needed.
 * @returns {number} The position after the matched suffix, or start if absent.
 * @example findPrereleaseEndIndex('-beta.1+sha', 0, false, digitRuns) // 7, at the plus
 * @example findPrereleaseEndIndex('beta', 0, false, digitRuns) // 0; no opening hyphen
 */ const findPrereleaseEndIndex = (range, start, loose, digitRuns)=>{
    const hyphen = range[start] === '-';
    if (!loose && !hyphen) {
        return start;
    }
    const identifierStart = start + (hyphen ? 1 : 0);
    let end = findPrereleaseIdentifierEndIndex(range, identifierStart, loose, digitRuns);
    if (end === identifierStart) {
        if (!loose || !hyphen) {
            return start;
        }
        // In loose syntax, a lone hyphen can itself be the identifier.
        end = findPrereleaseIdentifierEndIndex(range, start, loose, digitRuns);
    }
    while(range[end] === '.'){
        const next = findPrereleaseIdentifierEndIndex(range, end + 1, loose, digitRuns);
        if (next === end + 1) {
            break;
        }
        end = next;
    }
    return end;
};
/**
 * Reads one build-name piece, such as sha or 123 in +sha.123.
 * Stops at a disallowed character or the old regex's length limit.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position where the identifier should begin.
 * @returns {number} The position after the identifier, or start if none matches.
 * @example findBuildIdentifierEndIndex('sha.123', 0) // 3, at the dot
 * @example findBuildIdentifierEndIndex('001', 0) // 3; leading zeros are allowed
 */ const findBuildIdentifierEndIndex = (range, start)=>{
    let end = start;
    while(end - start < MAX_SAFE_BUILD_LENGTH && isIdentifierCharacter(range[end])){
        end++;
    }
    return end;
};
/**
 * Reads optional build metadata such as +sha.123.
 * Leaves the position unchanged if there is no plus sign followed by a name.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position where the opening + should be.
 * @returns {number} The position after the matched metadata, or start if absent.
 * @example findBuildEndIndex('+sha.123 <2', 0) // 8, at the space
 * @example findBuildEndIndex('+', 0) // 0; a plus sign alone is not a match
 */ const findBuildEndIndex = (range, start)=>{
    if (range[start] !== '+') {
        return start;
    }
    let end = findBuildIdentifierEndIndex(range, start + 1);
    if (end === start + 1) {
        return start;
    }
    while(range[end] === '.'){
        const next = findBuildIdentifierEndIndex(range, end + 1);
        if (next === end + 1) {
            break;
        }
        end = next;
    }
    return end;
};
/**
 * Reads three numbers separated by dots, then any prerelease and build suffixes.
 * Uses loose rules, so forms such as 01.02.03beta can match here.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position of the first number, after any prefix.
 * @param {DigitRunCache} digitRuns Shared digit-run cache, updated as needed.
 * @returns {number} The position after the version match, or start if none matches.
 * @example findLooseFullVersionEndIndex('1.2.3-beta+sha <2', 0, digitRuns) // 14
 * @example findLooseFullVersionEndIndex('1.2', 0, digitRuns) // 0; needs three numbers
 */ const findLooseFullVersionEndIndex = (range, start, digitRuns)=>{
    let end = start;
    for(let component = 0; component < 3; component++){
        const next = findVersionNumberEndIndex(range, end, true, digitRuns);
        if (next === end) {
            return start;
        }
        end = next;
        if (component < 2) {
            if (range[end] !== '.') {
                return start;
            }
            end++;
        }
    }
    const prereleaseEnd = findPrereleaseEndIndex(range, end, true, digitRuns);
    return findBuildEndIndex(range, prereleaseEnd);
};
/**
 * Reads one component of a partial or wildcard version, such as 2 or x in 2.x.
 * Numbers use strict leading-zero rules; wildcards take up one character.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position where the component should begin.
 * @param {DigitRunCache} digitRuns Shared digit-run cache, updated as needed.
 * @returns {number} The position after the component, or start if none matches.
 * @example findPartialVersionComponentEndIndex('2.x', 0, digitRuns) // 1, at the dot
 * @example findPartialVersionComponentEndIndex('2.x', 2, digitRuns) // 3, after x
 */ const findPartialVersionComponentEndIndex = (range, start, digitRuns)=>{
    if (isDigit(range[start])) {
        return findVersionNumberEndIndex(range, start, false, digitRuns);
    }
    return isVersionStart(range[start]) ? start + 1 : start;
};
/**
 * Reads up to three components, allowing forms such as 1, 1.2, or 1.x.
 * After the third component, also reads any strict prerelease and build suffixes.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position of a number or wildcard, after any prefix.
 * @param {DigitRunCache} digitRuns Shared digit-run cache, updated as needed.
 * @returns {number} The position after the matched version text.
 * @example findPartialVersionEndIndex('1.x <2', 0, digitRuns) // 3, at the space
 * @example findPartialVersionEndIndex('1.', 0, digitRuns) // 1; the trailing dot is unread
 */ const findPartialVersionEndIndex = (range, start, digitRuns)=>{
    let end = findPartialVersionComponentEndIndex(range, start, digitRuns);
    for(let component = 0; component < 2; component++){
        if (range[end] !== '.') {
            return end;
        }
        const next = findPartialVersionComponentEndIndex(range, end + 1, digitRuns);
        if (next === end + 1) {
            return end;
        }
        end = next;
    }
    const prereleaseEnd = findPrereleaseEndIndex(range, end, false, digitRuns);
    return findBuildEndIndex(range, prereleaseEnd);
};
/**
 * Finds where a version match ends, without deciding whether the range is valid.
 * Tries a loose full version first, then a partial or wildcard version, just
 * like the old regex's LOOSEPLAIN and XRANGEPLAIN alternatives.
 *
 * @param {string} range The text to read; it is not changed.
 * @param {number} start The position of a number or wildcard, after any prefix.
 * @param {DigitRunCache} digitRuns Shared digit-run cache, updated as needed.
 * @returns {number} The position where scanning the next candidate can resume.
 * @example findVersionEndIndex('1.2.3 <2', 0, digitRuns) // 5, at the space
 * @example findVersionEndIndex('1.x <2', 0, digitRuns) // 3, at the space
 */ const findVersionEndIndex = (range, start, digitRuns)=>{
    const fullVersionEnd = findLooseFullVersionEndIndex(range, start, digitRuns);
    return fullVersionEnd !== start ? fullVersionEnd : findPartialVersionEndIndex(range, start, digitRuns);
};
/**
 * Finds the one whitespace character the old replacement would remove.
 * Keeps leading whitespace, skips an optional operator, and checks immediately
 * after it. Returns -1 if there is nothing to remove.
 *
 * @param {string} range The text containing a candidate already found by the caller.
 * @param {number} matchStart The candidate's position, including leading whitespace.
 * @returns {number} The position of the removable whitespace, or -1 if absent.
 * @example findRemovableWhitespaceIndex(' > 1', 0) // 2; keep the space at position 0
 * @example findRemovableWhitespaceIndex('>1', 0) // -1
 */ const findRemovableWhitespaceIndex = (range, matchStart)=>{
    let position = matchStart;
    if (isWhitespace(range[position])) {
        position++;
    }
    if (range[position] === '<' || range[position] === '>') {
        position++;
    }
    if (range[position] === '=') {
        position++;
    }
    return isWhitespace(range[position]) ? position : -1;
};
/**
 * Joins an operator to its version, turning > 1.2.3 into >1.2.3.
 * Copies everything else according to the old regex's matching rules.
 * Moves forward through prefixes and whole versions to avoid repeatedly
 * searching the same characters on long inputs.
 *
 * @param {string} range The range text to process; the original string is unchanged.
 * @returns {string} The range with matched operator whitespace removed.
 * @example trimComparatorWhitespace('> 1.2.3 < 2') // '>1.2.3 <2'
 * @example trimComparatorWhitespace('> invalid') // '> invalid'
 */ const trimComparatorWhitespace = (range)=>{
    let result = '';
    let copyFrom = 0;
    let cursor = 0;
    const digitRuns = {
        start: -1,
        end: -1,
        previousStart: -1,
        previousEnd: -1
    };
    while(cursor < range.length){
        const matchStart = cursor;
        if (range[cursor] === '<' || range[cursor] === '>') {
            cursor++;
        } else if (!isVersionPrefix(range[cursor]) && !isVersionStart(range[cursor])) {
            cursor++;
            continue;
        }
        // Consume a v/=/whitespace run once, even when no version follows it.
        while(cursor < range.length && isVersionPrefix(range[cursor])){
            cursor++;
        }
        if (!isVersionStart(range[cursor])) {
            continue;
        }
        const whitespacePosition = findRemovableWhitespaceIndex(range, matchStart);
        if (whitespacePosition !== -1) {
            result += range.slice(copyFrom, whitespacePosition);
            copyFrom = whitespacePosition + 1;
        }
        // Skip the entire match, so a prerelease's trailing v cannot be
        // reconsidered as the prefix of another version.
        cursor = findVersionEndIndex(range, cursor, digitRuns);
    }
    return result + range.slice(copyFrom);
};
module.exports = trimComparatorWhitespace;
}),
"[project]/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Determine if version is greater than all the versions possible in the range.
const outside = __turbopack_context__.r("[project]/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = (version, range, options)=>outside(version, range, '>', options);
module.exports = gtr;
}),
"[project]/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const intersects = (r1, r2, options)=>{
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
};
module.exports = intersects;
}),
"[project]/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const outside = __turbopack_context__.r("[project]/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options)=>outside(version, range, '<', options);
module.exports = ltr;
}),
"[project]/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const maxSatisfying = (versions, range, options)=>{
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new SemVer(max, options);
            }
        }
    });
    return max;
};
module.exports = maxSatisfying;
}),
"[project]/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const minSatisfying = (versions, range, options)=>{
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new SemVer(min, options);
            }
        }
    });
    return min;
};
module.exports = minSatisfying;
}),
"[project]/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const minVersion = (range, loose)=>{
    range = new Range(range, loose);
    let minver = new SemVer('0.0.0');
    if (range.test(minver)) {
        return minver;
    }
    minver = new SemVer('0.0.0-0');
    if (range.test(minver)) {
        return minver;
    }
    minver = null;
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator)=>{
            // Clone to avoid manipulating the comparator's semver object.
            const compver = new SemVer(comparator.semver.version);
            switch(comparator.operator){
                case '>':
                    if (compver.prerelease.length === 0) {
                        compver.patch++;
                    } else {
                        compver.prerelease.push(0);
                    }
                    compver.raw = compver.format();
                /* fallthrough */ case '':
                case '>=':
                    if (!setMin || gt(compver, setMin)) {
                        setMin = compver;
                    }
                    break;
                case '<':
                case '<=':
                    break;
                /* istanbul ignore next */ default:
                    throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
        }
    }
    if (minver && range.test(minver)) {
        return minver;
    }
    return null;
};
module.exports = minVersion;
}),
"[project]/node_modules/semver/ranges/outside.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const outside = (version, range, hilo, options)=>{
    version = new SemVer(version, options);
    range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch(hilo){
        case '>':
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = '>';
            ecomp = '>=';
            break;
        case '<':
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = '<';
            ecomp = '<=';
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisfies the range it is not outside
    if (satisfies(version, range, options)) {
        return false;
    }
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator)=>{
            if (comparator.semver === ANY) {
                comparator = new Comparator('>=0.0.0');
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
                high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
                low = comparator;
            }
        });
        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) {
            return false;
        }
        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
        }
    }
    return true;
};
module.exports = outside;
}),
"[project]/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __turbopack_context__.r("[project]/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
module.exports = (versions, range, options)=>{
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b)=>compare(a, b, options));
    for (const version of v){
        const included = satisfies(version, range, options);
        if (included) {
            prev = version;
            if (!first) {
                first = version;
            }
        } else {
            if (prev) {
                set.push([
                    first,
                    prev
                ]);
            }
            prev = null;
            first = null;
        }
    }
    if (first) {
        set.push([
            first,
            null
        ]);
    }
    const ranges = [];
    for (const [min, max] of set){
        if (min === max) {
            ranges.push(min);
        } else if (!max && min === v[0]) {
            ranges.push('*');
        } else if (!max) {
            ranges.push(`>=${min}`);
        } else if (min === v[0]) {
            ranges.push(`<=${max}`);
        } else {
            ranges.push(`${min} - ${max}`);
        }
    }
    const simplified = ranges.join(' || ');
    const original = typeof range.raw === 'string' ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
};
}),
"[project]/node_modules/semver/ranges/subset.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const satisfies = __turbopack_context__.r("[project]/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If LT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true
const subset = (sub, dom, options = {})=>{
    if (sub === dom) {
        return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set){
        for (const simpleDom of dom.set){
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
                continue OUTER;
            }
        }
        // the null set is a subset of everything, but null simple ranges in
        // a complex range should be ignored.  so if we saw a non-null range,
        // then we know this isn't a subset, but if EVERY simple range was null,
        // then it is a subset.
        if (sawNonNull) {
            return false;
        }
    }
    return true;
};
const minimumVersionWithPreRelease = [
    new Comparator('>=0.0.0-0')
];
const minimumVersion = [
    new Comparator('>=0.0.0')
];
const simpleSubset = (sub, dom, options)=>{
    if (sub === dom) {
        return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
        } else if (options.includePrerelease) {
            sub = minimumVersionWithPreRelease;
        } else {
            sub = minimumVersion;
        }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
            return true;
        } else {
            dom = minimumVersion;
        }
    }
    const eqSet = new Set();
    let gt, lt;
    for (const c of sub){
        if (c.operator === '>' || c.operator === '>=') {
            gt = higherGT(gt, c, options);
        } else if (c.operator === '<' || c.operator === '<=') {
            lt = lowerLT(lt, c, options);
        } else {
            eqSet.add(c.semver);
        }
    }
    if (eqSet.size > 1) {
        return null;
    }
    let gtltComp;
    if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
            return null;
        } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
            return null;
        }
    }
    // will iterate one or zero times
    for (const eq of eqSet){
        if (gt && !satisfies(eq, String(gt), options)) {
            return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
            return null;
        }
        for (const c of dom){
            if (!satisfies(eq, String(c), options)) {
                return false;
            }
        }
        return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    // if the subset has a prerelease, we need a comparator in the superset
    // with the same tuple and a prerelease, or it's not a subset
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    // exception: <1.2.3-0 is the same as <1.2.3
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
    }
    for (const c of dom){
        hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
        hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
        if (gt) {
            if (needDomGTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
                    needDomGTPre = false;
                }
            }
            if (c.operator === '>' || c.operator === '>=') {
                higher = higherGT(gt, c, options);
                if (higher === c && higher !== gt) {
                    return false;
                }
            } else if (gt.operator === '>=' && !c.test(gt.semver)) {
                return false;
            }
        }
        if (lt) {
            if (needDomLTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
                    needDomLTPre = false;
                }
            }
            if (c.operator === '<' || c.operator === '<=') {
                lower = lowerLT(lt, c, options);
                if (lower === c && lower !== lt) {
                    return false;
                }
            } else if (lt.operator === '<=' && !c.test(lt.semver)) {
                return false;
            }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
        }
    }
    // if there was a < or >, and nothing in the dom, then must be false
    // UNLESS it was limited by another range in the other direction.
    // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
    }
    // we needed a prerelease range in a specific tuple, but didn't get one
    // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
    // because it includes prereleases in the 1.2.3 tuple
    if (needDomGTPre || needDomLTPre) {
        return false;
    }
    return true;
};
// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === '>' && a.operator === '>=' ? b : a;
};
// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === '<' && a.operator === '<=' ? b : a;
};
module.exports = subset;
}),
"[project]/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
// Mostly just for testing and legacy API reasons
const toComparators = (range, options)=>new Range(range, options).set.map((comp)=>comp.map((c)=>c.value).join(' ').trim().split(' '));
module.exports = toComparators;
}),
"[project]/node_modules/semver/ranges/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const validRange = (range, options)=>{
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new Range(range, options).range || '*';
    } catch (er) {
        return null;
    }
};
module.exports = validRange;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0lcmqv7jro6nv._.js.map
module.exports = [
"[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
var mod = await __turbopack_context__.y("pg-587764f78a6c7a9c");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
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
"[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compare",
    ()=>compare,
    "compareSync",
    ()=>compareSync,
    "decodeBase64",
    ()=>decodeBase64,
    "default",
    ()=>__TURBOPACK__default__export__,
    "encodeBase64",
    ()=>encodeBase64,
    "genSalt",
    ()=>genSalt,
    "genSaltSync",
    ()=>genSaltSync,
    "getRounds",
    ()=>getRounds,
    "getSalt",
    ()=>getSalt,
    "hash",
    ()=>hash,
    "hashSync",
    ()=>hashSync,
    "setRandomFallback",
    ()=>setRandomFallback,
    "truncates",
    ()=>truncates
]);
/*
 Copyright (c) 2012 Nevins Bartolomeo <nevins.bartolomeo@gmail.com>
 Copyright (c) 2012 Shane Girish <shaneGirish@gmail.com>
 Copyright (c) 2025 Daniel Wirtz <dcode@dcode.io>

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */ // The Node.js crypto module is used as a fallback for the Web Crypto API. When
// building for the browser, inclusion of the crypto module should be disabled,
// which the package hints at in its package.json for bundlers that support it.
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
/**
 * The random implementation to use as a fallback.
 * @type {?function(number):!Array.<number>}
 * @inner
 */ var randomFallback = null;
/**
 * Generates cryptographically secure random bytes.
 * @function
 * @param {number} len Bytes length
 * @returns {!Array.<number>} Random bytes
 * @throws {Error} If no random implementation is available
 * @inner
 */ function randomBytes(len) {
    // Web Crypto API. Globally available in the browser and in Node.js >=23.
    try {
        return crypto.getRandomValues(new Uint8Array(len));
    } catch  {}
    // Node.js crypto module for non-browser environments.
    try {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(len);
    } catch  {}
    // Custom fallback specified with `setRandomFallback`.
    if (!randomFallback) {
        throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
    }
    return randomFallback(len);
}
function setRandomFallback(random) {
    randomFallback = random;
}
function genSaltSync(rounds, seed_length) {
    rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
    if (typeof rounds !== "number") throw Error("Illegal arguments: " + typeof rounds + ", " + typeof seed_length);
    if (rounds < 4) rounds = 4;
    else if (rounds > 31) rounds = 31;
    var salt = [];
    salt.push("$2b$");
    if (rounds < 10) salt.push("0");
    salt.push(rounds.toString());
    salt.push("$");
    salt.push(base64_encode(randomBytes(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN)); // May throw
    return salt.join("");
}
function genSalt(rounds, seed_length, callback) {
    if (typeof seed_length === "function") callback = seed_length, seed_length = undefined; // Not supported.
    if (typeof rounds === "function") callback = rounds, rounds = undefined;
    if (typeof rounds === "undefined") rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
    else if (typeof rounds !== "number") throw Error("illegal arguments: " + typeof rounds);
    function _async(callback) {
        nextTick(function() {
            // Pretty thin, but salting is fast enough
            try {
                callback(null, genSaltSync(rounds));
            } catch (err) {
                callback(err);
            }
        });
    }
    if (callback) {
        if (typeof callback !== "function") throw Error("Illegal callback: " + typeof callback);
        _async(callback);
    } else return new Promise(function(resolve, reject) {
        _async(function(err, res) {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
function hashSync(password, salt) {
    if (typeof salt === "undefined") salt = GENSALT_DEFAULT_LOG2_ROUNDS;
    if (typeof salt === "number") salt = genSaltSync(salt);
    if (typeof password !== "string" || typeof salt !== "string") throw Error("Illegal arguments: " + typeof password + ", " + typeof salt);
    return _hash(password, salt);
}
function hash(password, salt, callback, progressCallback) {
    function _async(callback) {
        if (typeof password === "string" && typeof salt === "number") genSalt(salt, function(err, salt) {
            _hash(password, salt, callback, progressCallback);
        });
        else if (typeof password === "string" && typeof salt === "string") _hash(password, salt, callback, progressCallback);
        else nextTick(callback.bind(this, Error("Illegal arguments: " + typeof password + ", " + typeof salt)));
    }
    if (callback) {
        if (typeof callback !== "function") throw Error("Illegal callback: " + typeof callback);
        _async(callback);
    } else return new Promise(function(resolve, reject) {
        _async(function(err, res) {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
/**
 * Compares two strings of the same length in constant time.
 * @param {string} known Must be of the correct length
 * @param {string} unknown Must be the same length as `known`
 * @returns {boolean}
 * @inner
 */ function safeStringCompare(known, unknown) {
    var diff = known.length ^ unknown.length;
    for(var i = 0; i < known.length; ++i){
        diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
    }
    return diff === 0;
}
function compareSync(password, hash) {
    if (typeof password !== "string" || typeof hash !== "string") throw Error("Illegal arguments: " + typeof password + ", " + typeof hash);
    if (hash.length !== 60) return false;
    return safeStringCompare(hashSync(password, hash.substring(0, hash.length - 31)), hash);
}
function compare(password, hashValue, callback, progressCallback) {
    function _async(callback) {
        if (typeof password !== "string" || typeof hashValue !== "string") {
            nextTick(callback.bind(this, Error("Illegal arguments: " + typeof password + ", " + typeof hashValue)));
            return;
        }
        if (hashValue.length !== 60) {
            nextTick(callback.bind(this, null, false));
            return;
        }
        hash(password, hashValue.substring(0, 29), function(err, comp) {
            if (err) callback(err);
            else callback(null, safeStringCompare(comp, hashValue));
        }, progressCallback);
    }
    if (callback) {
        if (typeof callback !== "function") throw Error("Illegal callback: " + typeof callback);
        _async(callback);
    } else return new Promise(function(resolve, reject) {
        _async(function(err, res) {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
function getRounds(hash) {
    if (typeof hash !== "string") throw Error("Illegal arguments: " + typeof hash);
    return parseInt(hash.split("$")[2], 10);
}
function getSalt(hash) {
    if (typeof hash !== "string") throw Error("Illegal arguments: " + typeof hash);
    if (hash.length !== 60) throw Error("Illegal hash length: " + hash.length + " != 60");
    return hash.substring(0, 29);
}
function truncates(password) {
    if (typeof password !== "string") throw Error("Illegal arguments: " + typeof password);
    return utf8Length(password) > 72;
}
/**
 * Continues with the callback after yielding to the event loop.
 * @function
 * @param {function(...[*])} callback Callback to execute
 * @inner
 */ var nextTick = typeof setImmediate === "function" ? setImmediate : typeof scheduler === "object" && typeof scheduler.postTask === "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
/** Calculates the byte length of a string encoded as UTF8. */ function utf8Length(string) {
    var len = 0, c = 0;
    for(var i = 0; i < string.length; ++i){
        c = string.charCodeAt(i);
        if (c < 128) len += 1;
        else if (c < 2048) len += 2;
        else if ((c & 0xfc00) === 0xd800 && (string.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
            ++i;
            len += 4;
        } else len += 3;
    }
    return len;
}
/** Converts a string to an array of UTF8 bytes. */ function utf8Array(string) {
    var offset = 0, c1, c2;
    var buffer = new Array(utf8Length(string));
    for(var i = 0, k = string.length; i < k; ++i){
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 0xfc00) === 0xd800 && ((c2 = string.charCodeAt(i + 1)) & 0xfc00) === 0xdc00) {
            c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        }
    }
    return buffer;
}
// A base64 implementation for the bcrypt algorithm. This is partly non-standard.
/**
 * bcrypt's own non-standard base64 dictionary.
 * @type {!Array.<string>}
 * @const
 * @inner
 **/ var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
/**
 * @type {!Array.<number>}
 * @const
 * @inner
 **/ var BASE64_INDEX = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    -1,
    -1,
    -1,
    -1,
    -1
];
/**
 * Encodes a byte array to base64 with up to len bytes of input.
 * @param {!Array.<number>} b Byte array
 * @param {number} len Maximum input length
 * @returns {string}
 * @inner
 */ function base64_encode(b, len) {
    var off = 0, rs = [], c1, c2;
    if (len <= 0 || len > b.length) throw Error("Illegal len: " + len);
    while(off < len){
        c1 = b[off++] & 0xff;
        rs.push(BASE64_CODE[c1 >> 2 & 0x3f]);
        c1 = (c1 & 0x03) << 4;
        if (off >= len) {
            rs.push(BASE64_CODE[c1 & 0x3f]);
            break;
        }
        c2 = b[off++] & 0xff;
        c1 |= c2 >> 4 & 0x0f;
        rs.push(BASE64_CODE[c1 & 0x3f]);
        c1 = (c2 & 0x0f) << 2;
        if (off >= len) {
            rs.push(BASE64_CODE[c1 & 0x3f]);
            break;
        }
        c2 = b[off++] & 0xff;
        c1 |= c2 >> 6 & 0x03;
        rs.push(BASE64_CODE[c1 & 0x3f]);
        rs.push(BASE64_CODE[c2 & 0x3f]);
    }
    return rs.join("");
}
/**
 * Decodes a base64 encoded string to up to len bytes of output.
 * @param {string} s String to decode
 * @param {number} len Maximum output length
 * @returns {!Array.<number>}
 * @inner
 */ function base64_decode(s, len) {
    var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
    if (len <= 0) throw Error("Illegal len: " + len);
    while(off < slen - 1 && olen < len){
        code = s.charCodeAt(off++);
        c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        code = s.charCodeAt(off++);
        c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        if (c1 == -1 || c2 == -1) break;
        o = c1 << 2 >>> 0;
        o |= (c2 & 0x30) >> 4;
        rs.push(String.fromCharCode(o));
        if (++olen >= len || off >= slen) break;
        code = s.charCodeAt(off++);
        c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        if (c3 == -1) break;
        o = (c2 & 0x0f) << 4 >>> 0;
        o |= (c3 & 0x3c) >> 2;
        rs.push(String.fromCharCode(o));
        if (++olen >= len || off >= slen) break;
        code = s.charCodeAt(off++);
        c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
        o = (c3 & 0x03) << 6 >>> 0;
        o |= c4;
        rs.push(String.fromCharCode(o));
        ++olen;
    }
    var res = [];
    for(off = 0; off < olen; off++)res.push(rs[off].charCodeAt(0));
    return res;
}
/**
 * @type {number}
 * @const
 * @inner
 */ var BCRYPT_SALT_LEN = 16;
/**
 * @type {number}
 * @const
 * @inner
 */ var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
/**
 * @type {number}
 * @const
 * @inner
 */ var BLOWFISH_NUM_ROUNDS = 16;
/**
 * @type {number}
 * @const
 * @inner
 */ var MAX_EXECUTION_TIME = 100;
/**
 * @type {Array.<number>}
 * @const
 * @inner
 */ var P_ORIG = [
    0x243f6a88,
    0x85a308d3,
    0x13198a2e,
    0x03707344,
    0xa4093822,
    0x299f31d0,
    0x082efa98,
    0xec4e6c89,
    0x452821e6,
    0x38d01377,
    0xbe5466cf,
    0x34e90c6c,
    0xc0ac29b7,
    0xc97c50dd,
    0x3f84d5b5,
    0xb5470917,
    0x9216d5d9,
    0x8979fb1b
];
/**
 * @type {Array.<number>}
 * @const
 * @inner
 */ var S_ORIG = [
    0xd1310ba6,
    0x98dfb5ac,
    0x2ffd72db,
    0xd01adfb7,
    0xb8e1afed,
    0x6a267e96,
    0xba7c9045,
    0xf12c7f99,
    0x24a19947,
    0xb3916cf7,
    0x0801f2e2,
    0x858efc16,
    0x636920d8,
    0x71574e69,
    0xa458fea3,
    0xf4933d7e,
    0x0d95748f,
    0x728eb658,
    0x718bcd58,
    0x82154aee,
    0x7b54a41d,
    0xc25a59b5,
    0x9c30d539,
    0x2af26013,
    0xc5d1b023,
    0x286085f0,
    0xca417918,
    0xb8db38ef,
    0x8e79dcb0,
    0x603a180e,
    0x6c9e0e8b,
    0xb01e8a3e,
    0xd71577c1,
    0xbd314b27,
    0x78af2fda,
    0x55605c60,
    0xe65525f3,
    0xaa55ab94,
    0x57489862,
    0x63e81440,
    0x55ca396a,
    0x2aab10b6,
    0xb4cc5c34,
    0x1141e8ce,
    0xa15486af,
    0x7c72e993,
    0xb3ee1411,
    0x636fbc2a,
    0x2ba9c55d,
    0x741831f6,
    0xce5c3e16,
    0x9b87931e,
    0xafd6ba33,
    0x6c24cf5c,
    0x7a325381,
    0x28958677,
    0x3b8f4898,
    0x6b4bb9af,
    0xc4bfe81b,
    0x66282193,
    0x61d809cc,
    0xfb21a991,
    0x487cac60,
    0x5dec8032,
    0xef845d5d,
    0xe98575b1,
    0xdc262302,
    0xeb651b88,
    0x23893e81,
    0xd396acc5,
    0x0f6d6ff3,
    0x83f44239,
    0x2e0b4482,
    0xa4842004,
    0x69c8f04a,
    0x9e1f9b5e,
    0x21c66842,
    0xf6e96c9a,
    0x670c9c61,
    0xabd388f0,
    0x6a51a0d2,
    0xd8542f68,
    0x960fa728,
    0xab5133a3,
    0x6eef0b6c,
    0x137a3be4,
    0xba3bf050,
    0x7efb2a98,
    0xa1f1651d,
    0x39af0176,
    0x66ca593e,
    0x82430e88,
    0x8cee8619,
    0x456f9fb4,
    0x7d84a5c3,
    0x3b8b5ebe,
    0xe06f75d8,
    0x85c12073,
    0x401a449f,
    0x56c16aa6,
    0x4ed3aa62,
    0x363f7706,
    0x1bfedf72,
    0x429b023d,
    0x37d0d724,
    0xd00a1248,
    0xdb0fead3,
    0x49f1c09b,
    0x075372c9,
    0x80991b7b,
    0x25d479d8,
    0xf6e8def7,
    0xe3fe501a,
    0xb6794c3b,
    0x976ce0bd,
    0x04c006ba,
    0xc1a94fb6,
    0x409f60c4,
    0x5e5c9ec2,
    0x196a2463,
    0x68fb6faf,
    0x3e6c53b5,
    0x1339b2eb,
    0x3b52ec6f,
    0x6dfc511f,
    0x9b30952c,
    0xcc814544,
    0xaf5ebd09,
    0xbee3d004,
    0xde334afd,
    0x660f2807,
    0x192e4bb3,
    0xc0cba857,
    0x45c8740f,
    0xd20b5f39,
    0xb9d3fbdb,
    0x5579c0bd,
    0x1a60320a,
    0xd6a100c6,
    0x402c7279,
    0x679f25fe,
    0xfb1fa3cc,
    0x8ea5e9f8,
    0xdb3222f8,
    0x3c7516df,
    0xfd616b15,
    0x2f501ec8,
    0xad0552ab,
    0x323db5fa,
    0xfd238760,
    0x53317b48,
    0x3e00df82,
    0x9e5c57bb,
    0xca6f8ca0,
    0x1a87562e,
    0xdf1769db,
    0xd542a8f6,
    0x287effc3,
    0xac6732c6,
    0x8c4f5573,
    0x695b27b0,
    0xbbca58c8,
    0xe1ffa35d,
    0xb8f011a0,
    0x10fa3d98,
    0xfd2183b8,
    0x4afcb56c,
    0x2dd1d35b,
    0x9a53e479,
    0xb6f84565,
    0xd28e49bc,
    0x4bfb9790,
    0xe1ddf2da,
    0xa4cb7e33,
    0x62fb1341,
    0xcee4c6e8,
    0xef20cada,
    0x36774c01,
    0xd07e9efe,
    0x2bf11fb4,
    0x95dbda4d,
    0xae909198,
    0xeaad8e71,
    0x6b93d5a0,
    0xd08ed1d0,
    0xafc725e0,
    0x8e3c5b2f,
    0x8e7594b7,
    0x8ff6e2fb,
    0xf2122b64,
    0x8888b812,
    0x900df01c,
    0x4fad5ea0,
    0x688fc31c,
    0xd1cff191,
    0xb3a8c1ad,
    0x2f2f2218,
    0xbe0e1777,
    0xea752dfe,
    0x8b021fa1,
    0xe5a0cc0f,
    0xb56f74e8,
    0x18acf3d6,
    0xce89e299,
    0xb4a84fe0,
    0xfd13e0b7,
    0x7cc43b81,
    0xd2ada8d9,
    0x165fa266,
    0x80957705,
    0x93cc7314,
    0x211a1477,
    0xe6ad2065,
    0x77b5fa86,
    0xc75442f5,
    0xfb9d35cf,
    0xebcdaf0c,
    0x7b3e89a0,
    0xd6411bd3,
    0xae1e7e49,
    0x00250e2d,
    0x2071b35e,
    0x226800bb,
    0x57b8e0af,
    0x2464369b,
    0xf009b91e,
    0x5563911d,
    0x59dfa6aa,
    0x78c14389,
    0xd95a537f,
    0x207d5ba2,
    0x02e5b9c5,
    0x83260376,
    0x6295cfa9,
    0x11c81968,
    0x4e734a41,
    0xb3472dca,
    0x7b14a94a,
    0x1b510052,
    0x9a532915,
    0xd60f573f,
    0xbc9bc6e4,
    0x2b60a476,
    0x81e67400,
    0x08ba6fb5,
    0x571be91f,
    0xf296ec6b,
    0x2a0dd915,
    0xb6636521,
    0xe7b9f9b6,
    0xff34052e,
    0xc5855664,
    0x53b02d5d,
    0xa99f8fa1,
    0x08ba4799,
    0x6e85076a,
    0x4b7a70e9,
    0xb5b32944,
    0xdb75092e,
    0xc4192623,
    0xad6ea6b0,
    0x49a7df7d,
    0x9cee60b8,
    0x8fedb266,
    0xecaa8c71,
    0x699a17ff,
    0x5664526c,
    0xc2b19ee1,
    0x193602a5,
    0x75094c29,
    0xa0591340,
    0xe4183a3e,
    0x3f54989a,
    0x5b429d65,
    0x6b8fe4d6,
    0x99f73fd6,
    0xa1d29c07,
    0xefe830f5,
    0x4d2d38e6,
    0xf0255dc1,
    0x4cdd2086,
    0x8470eb26,
    0x6382e9c6,
    0x021ecc5e,
    0x09686b3f,
    0x3ebaefc9,
    0x3c971814,
    0x6b6a70a1,
    0x687f3584,
    0x52a0e286,
    0xb79c5305,
    0xaa500737,
    0x3e07841c,
    0x7fdeae5c,
    0x8e7d44ec,
    0x5716f2b8,
    0xb03ada37,
    0xf0500c0d,
    0xf01c1f04,
    0x0200b3ff,
    0xae0cf51a,
    0x3cb574b2,
    0x25837a58,
    0xdc0921bd,
    0xd19113f9,
    0x7ca92ff6,
    0x94324773,
    0x22f54701,
    0x3ae5e581,
    0x37c2dadc,
    0xc8b57634,
    0x9af3dda7,
    0xa9446146,
    0x0fd0030e,
    0xecc8c73e,
    0xa4751e41,
    0xe238cd99,
    0x3bea0e2f,
    0x3280bba1,
    0x183eb331,
    0x4e548b38,
    0x4f6db908,
    0x6f420d03,
    0xf60a04bf,
    0x2cb81290,
    0x24977c79,
    0x5679b072,
    0xbcaf89af,
    0xde9a771f,
    0xd9930810,
    0xb38bae12,
    0xdccf3f2e,
    0x5512721f,
    0x2e6b7124,
    0x501adde6,
    0x9f84cd87,
    0x7a584718,
    0x7408da17,
    0xbc9f9abc,
    0xe94b7d8c,
    0xec7aec3a,
    0xdb851dfa,
    0x63094366,
    0xc464c3d2,
    0xef1c1847,
    0x3215d908,
    0xdd433b37,
    0x24c2ba16,
    0x12a14d43,
    0x2a65c451,
    0x50940002,
    0x133ae4dd,
    0x71dff89e,
    0x10314e55,
    0x81ac77d6,
    0x5f11199b,
    0x043556f1,
    0xd7a3c76b,
    0x3c11183b,
    0x5924a509,
    0xf28fe6ed,
    0x97f1fbfa,
    0x9ebabf2c,
    0x1e153c6e,
    0x86e34570,
    0xeae96fb1,
    0x860e5e0a,
    0x5a3e2ab3,
    0x771fe71c,
    0x4e3d06fa,
    0x2965dcb9,
    0x99e71d0f,
    0x803e89d6,
    0x5266c825,
    0x2e4cc978,
    0x9c10b36a,
    0xc6150eba,
    0x94e2ea78,
    0xa5fc3c53,
    0x1e0a2df4,
    0xf2f74ea7,
    0x361d2b3d,
    0x1939260f,
    0x19c27960,
    0x5223a708,
    0xf71312b6,
    0xebadfe6e,
    0xeac31f66,
    0xe3bc4595,
    0xa67bc883,
    0xb17f37d1,
    0x018cff28,
    0xc332ddef,
    0xbe6c5aa5,
    0x65582185,
    0x68ab9802,
    0xeecea50f,
    0xdb2f953b,
    0x2aef7dad,
    0x5b6e2f84,
    0x1521b628,
    0x29076170,
    0xecdd4775,
    0x619f1510,
    0x13cca830,
    0xeb61bd96,
    0x0334fe1e,
    0xaa0363cf,
    0xb5735c90,
    0x4c70a239,
    0xd59e9e0b,
    0xcbaade14,
    0xeecc86bc,
    0x60622ca7,
    0x9cab5cab,
    0xb2f3846e,
    0x648b1eaf,
    0x19bdf0ca,
    0xa02369b9,
    0x655abb50,
    0x40685a32,
    0x3c2ab4b3,
    0x319ee9d5,
    0xc021b8f7,
    0x9b540b19,
    0x875fa099,
    0x95f7997e,
    0x623d7da8,
    0xf837889a,
    0x97e32d77,
    0x11ed935f,
    0x16681281,
    0x0e358829,
    0xc7e61fd6,
    0x96dedfa1,
    0x7858ba99,
    0x57f584a5,
    0x1b227263,
    0x9b83c3ff,
    0x1ac24696,
    0xcdb30aeb,
    0x532e3054,
    0x8fd948e4,
    0x6dbc3128,
    0x58ebf2ef,
    0x34c6ffea,
    0xfe28ed61,
    0xee7c3c73,
    0x5d4a14d9,
    0xe864b7e3,
    0x42105d14,
    0x203e13e0,
    0x45eee2b6,
    0xa3aaabea,
    0xdb6c4f15,
    0xfacb4fd0,
    0xc742f442,
    0xef6abbb5,
    0x654f3b1d,
    0x41cd2105,
    0xd81e799e,
    0x86854dc7,
    0xe44b476a,
    0x3d816250,
    0xcf62a1f2,
    0x5b8d2646,
    0xfc8883a0,
    0xc1c7b6a3,
    0x7f1524c3,
    0x69cb7492,
    0x47848a0b,
    0x5692b285,
    0x095bbf00,
    0xad19489d,
    0x1462b174,
    0x23820e00,
    0x58428d2a,
    0x0c55f5ea,
    0x1dadf43e,
    0x233f7061,
    0x3372f092,
    0x8d937e41,
    0xd65fecf1,
    0x6c223bdb,
    0x7cde3759,
    0xcbee7460,
    0x4085f2a7,
    0xce77326e,
    0xa6078084,
    0x19f8509e,
    0xe8efd855,
    0x61d99735,
    0xa969a7aa,
    0xc50c06c2,
    0x5a04abfc,
    0x800bcadc,
    0x9e447a2e,
    0xc3453484,
    0xfdd56705,
    0x0e1e9ec9,
    0xdb73dbd3,
    0x105588cd,
    0x675fda79,
    0xe3674340,
    0xc5c43465,
    0x713e38d8,
    0x3d28f89e,
    0xf16dff20,
    0x153e21e7,
    0x8fb03d4a,
    0xe6e39f2b,
    0xdb83adf7,
    0xe93d5a68,
    0x948140f7,
    0xf64c261c,
    0x94692934,
    0x411520f7,
    0x7602d4f7,
    0xbcf46b2e,
    0xd4a20068,
    0xd4082471,
    0x3320f46a,
    0x43b7d4b7,
    0x500061af,
    0x1e39f62e,
    0x97244546,
    0x14214f74,
    0xbf8b8840,
    0x4d95fc1d,
    0x96b591af,
    0x70f4ddd3,
    0x66a02f45,
    0xbfbc09ec,
    0x03bd9785,
    0x7fac6dd0,
    0x31cb8504,
    0x96eb27b3,
    0x55fd3941,
    0xda2547e6,
    0xabca0a9a,
    0x28507825,
    0x530429f4,
    0x0a2c86da,
    0xe9b66dfb,
    0x68dc1462,
    0xd7486900,
    0x680ec0a4,
    0x27a18dee,
    0x4f3ffea2,
    0xe887ad8c,
    0xb58ce006,
    0x7af4d6b6,
    0xaace1e7c,
    0xd3375fec,
    0xce78a399,
    0x406b2a42,
    0x20fe9e35,
    0xd9f385b9,
    0xee39d7ab,
    0x3b124e8b,
    0x1dc9faf7,
    0x4b6d1856,
    0x26a36631,
    0xeae397b2,
    0x3a6efa74,
    0xdd5b4332,
    0x6841e7f7,
    0xca7820fb,
    0xfb0af54e,
    0xd8feb397,
    0x454056ac,
    0xba489527,
    0x55533a3a,
    0x20838d87,
    0xfe6ba9b7,
    0xd096954b,
    0x55a867bc,
    0xa1159a58,
    0xcca92963,
    0x99e1db33,
    0xa62a4a56,
    0x3f3125f9,
    0x5ef47e1c,
    0x9029317c,
    0xfdf8e802,
    0x04272f70,
    0x80bb155c,
    0x05282ce3,
    0x95c11548,
    0xe4c66d22,
    0x48c1133f,
    0xc70f86dc,
    0x07f9c9ee,
    0x41041f0f,
    0x404779a4,
    0x5d886e17,
    0x325f51eb,
    0xd59bc0d1,
    0xf2bcc18f,
    0x41113564,
    0x257b7834,
    0x602a9c60,
    0xdff8e8a3,
    0x1f636c1b,
    0x0e12b4c2,
    0x02e1329e,
    0xaf664fd1,
    0xcad18115,
    0x6b2395e0,
    0x333e92e1,
    0x3b240b62,
    0xeebeb922,
    0x85b2a20e,
    0xe6ba0d99,
    0xde720c8c,
    0x2da2f728,
    0xd0127845,
    0x95b794fd,
    0x647d0862,
    0xe7ccf5f0,
    0x5449a36f,
    0x877d48fa,
    0xc39dfd27,
    0xf33e8d1e,
    0x0a476341,
    0x992eff74,
    0x3a6f6eab,
    0xf4f8fd37,
    0xa812dc60,
    0xa1ebddf8,
    0x991be14c,
    0xdb6e6b0d,
    0xc67b5510,
    0x6d672c37,
    0x2765d43b,
    0xdcd0e804,
    0xf1290dc7,
    0xcc00ffa3,
    0xb5390f92,
    0x690fed0b,
    0x667b9ffb,
    0xcedb7d9c,
    0xa091cf0b,
    0xd9155ea3,
    0xbb132f88,
    0x515bad24,
    0x7b9479bf,
    0x763bd6eb,
    0x37392eb3,
    0xcc115979,
    0x8026e297,
    0xf42e312d,
    0x6842ada7,
    0xc66a2b3b,
    0x12754ccc,
    0x782ef11c,
    0x6a124237,
    0xb79251e7,
    0x06a1bbe6,
    0x4bfb6350,
    0x1a6b1018,
    0x11caedfa,
    0x3d25bdd8,
    0xe2e1c3c9,
    0x44421659,
    0x0a121386,
    0xd90cec6e,
    0xd5abea2a,
    0x64af674e,
    0xda86a85f,
    0xbebfe988,
    0x64e4c3fe,
    0x9dbc8057,
    0xf0f7c086,
    0x60787bf8,
    0x6003604d,
    0xd1fd8346,
    0xf6381fb0,
    0x7745ae04,
    0xd736fccc,
    0x83426b33,
    0xf01eab71,
    0xb0804187,
    0x3c005e5f,
    0x77a057be,
    0xbde8ae24,
    0x55464299,
    0xbf582e61,
    0x4e58f48f,
    0xf2ddfda2,
    0xf474ef38,
    0x8789bdc2,
    0x5366f9c3,
    0xc8b38e74,
    0xb475f255,
    0x46fcd9b9,
    0x7aeb2661,
    0x8b1ddf84,
    0x846a0e79,
    0x915f95e2,
    0x466e598e,
    0x20b45770,
    0x8cd55591,
    0xc902de4c,
    0xb90bace1,
    0xbb8205d0,
    0x11a86248,
    0x7574a99e,
    0xb77f19b6,
    0xe0a9dc09,
    0x662d09a1,
    0xc4324633,
    0xe85a1f02,
    0x09f0be8c,
    0x4a99a025,
    0x1d6efe10,
    0x1ab93d1d,
    0x0ba5a4df,
    0xa186f20f,
    0x2868f169,
    0xdcb7da83,
    0x573906fe,
    0xa1e2ce9b,
    0x4fcd7f52,
    0x50115e01,
    0xa70683fa,
    0xa002b5c4,
    0x0de6d027,
    0x9af88c27,
    0x773f8641,
    0xc3604c06,
    0x61a806b5,
    0xf0177a28,
    0xc0f586e0,
    0x006058aa,
    0x30dc7d62,
    0x11e69ed7,
    0x2338ea63,
    0x53c2dd94,
    0xc2c21634,
    0xbbcbee56,
    0x90bcb6de,
    0xebfc7da1,
    0xce591d76,
    0x6f05e409,
    0x4b7c0188,
    0x39720a3d,
    0x7c927c24,
    0x86e3725f,
    0x724d9db9,
    0x1ac15bb4,
    0xd39eb8fc,
    0xed545578,
    0x08fca5b5,
    0xd83d7cd3,
    0x4dad0fc4,
    0x1e50ef5e,
    0xb161e6f8,
    0xa28514d9,
    0x6c51133c,
    0x6fd5c7e7,
    0x56e14ec4,
    0x362abfce,
    0xddc6c837,
    0xd79a3234,
    0x92638212,
    0x670efa8e,
    0x406000e0,
    0x3a39ce37,
    0xd3faf5cf,
    0xabc27737,
    0x5ac52d1b,
    0x5cb0679e,
    0x4fa33742,
    0xd3822740,
    0x99bc9bbe,
    0xd5118e9d,
    0xbf0f7315,
    0xd62d1c7e,
    0xc700c47b,
    0xb78c1b6b,
    0x21a19045,
    0xb26eb1be,
    0x6a366eb4,
    0x5748ab2f,
    0xbc946e79,
    0xc6a376d2,
    0x6549c2c8,
    0x530ff8ee,
    0x468dde7d,
    0xd5730a1d,
    0x4cd04dc6,
    0x2939bbdb,
    0xa9ba4650,
    0xac9526e8,
    0xbe5ee304,
    0xa1fad5f0,
    0x6a2d519a,
    0x63ef8ce2,
    0x9a86ee22,
    0xc089c2b8,
    0x43242ef6,
    0xa51e03aa,
    0x9cf2d0a4,
    0x83c061ba,
    0x9be96a4d,
    0x8fe51550,
    0xba645bd6,
    0x2826a2f9,
    0xa73a3ae1,
    0x4ba99586,
    0xef5562e9,
    0xc72fefd3,
    0xf752f7da,
    0x3f046f69,
    0x77fa0a59,
    0x80e4a915,
    0x87b08601,
    0x9b09e6ad,
    0x3b3ee593,
    0xe990fd5a,
    0x9e34d797,
    0x2cf0b7d9,
    0x022b8b51,
    0x96d5ac3a,
    0x017da67d,
    0xd1cf3ed6,
    0x7c7d2d28,
    0x1f9f25cf,
    0xadf2b89b,
    0x5ad6b472,
    0x5a88f54c,
    0xe029ac71,
    0xe019a5e6,
    0x47b0acfd,
    0xed93fa9b,
    0xe8d3c48d,
    0x283b57cc,
    0xf8d56629,
    0x79132e28,
    0x785f0191,
    0xed756055,
    0xf7960e44,
    0xe3d35e8c,
    0x15056dd4,
    0x88f46dba,
    0x03a16125,
    0x0564f0bd,
    0xc3eb9e15,
    0x3c9057a2,
    0x97271aec,
    0xa93a072a,
    0x1b3f6d9b,
    0x1e6321f5,
    0xf59c66fb,
    0x26dcf319,
    0x7533d928,
    0xb155fdf5,
    0x03563482,
    0x8aba3cbb,
    0x28517711,
    0xc20ad9f8,
    0xabcc5167,
    0xccad925f,
    0x4de81751,
    0x3830dc8e,
    0x379d5862,
    0x9320f991,
    0xea7a90c2,
    0xfb3e7bce,
    0x5121ce64,
    0x774fbe32,
    0xa8b6e37e,
    0xc3293d46,
    0x48de5369,
    0x6413e680,
    0xa2ae0810,
    0xdd6db224,
    0x69852dfd,
    0x09072166,
    0xb39a460a,
    0x6445c0dd,
    0x586cdecf,
    0x1c20c8ae,
    0x5bbef7dd,
    0x1b588d40,
    0xccd2017f,
    0x6bb4e3bb,
    0xdda26a7e,
    0x3a59ff45,
    0x3e350a44,
    0xbcb4cdd5,
    0x72eacea8,
    0xfa6484bb,
    0x8d6612ae,
    0xbf3c6f47,
    0xd29be463,
    0x542f5d9e,
    0xaec2771b,
    0xf64e6370,
    0x740e0d8d,
    0xe75b1357,
    0xf8721671,
    0xaf537d5d,
    0x4040cb08,
    0x4eb4e2cc,
    0x34d2466a,
    0x0115af84,
    0xe1b00428,
    0x95983a1d,
    0x06b89fb4,
    0xce6ea048,
    0x6f3f3b82,
    0x3520ab82,
    0x011a1d4b,
    0x277227f8,
    0x611560b1,
    0xe7933fdc,
    0xbb3a792b,
    0x344525bd,
    0xa08839e1,
    0x51ce794b,
    0x2f32c9b7,
    0xa01fbac9,
    0xe01cc87e,
    0xbcc7d1f6,
    0xcf0111c3,
    0xa1e8aac7,
    0x1a908749,
    0xd44fbd9a,
    0xd0dadecb,
    0xd50ada38,
    0x0339c32a,
    0xc6913667,
    0x8df9317c,
    0xe0b12b4f,
    0xf79e59b7,
    0x43f5bb3a,
    0xf2d519ff,
    0x27d9459c,
    0xbf97222c,
    0x15e6fc2a,
    0x0f91fc71,
    0x9b941525,
    0xfae59361,
    0xceb69ceb,
    0xc2a86459,
    0x12baa8d1,
    0xb6c1075e,
    0xe3056a0c,
    0x10d25065,
    0xcb03a442,
    0xe0ec6e0e,
    0x1698db3b,
    0x4c98a0be,
    0x3278e964,
    0x9f1f9532,
    0xe0d392df,
    0xd3a0342b,
    0x8971f21e,
    0x1b0a7441,
    0x4ba3348c,
    0xc5be7120,
    0xc37632d8,
    0xdf359f8d,
    0x9b992f2e,
    0xe60b6f47,
    0x0fe3f11d,
    0xe54cda54,
    0x1edad891,
    0xce6279cf,
    0xcd3e7e6f,
    0x1618b166,
    0xfd2c1d05,
    0x848fd2c5,
    0xf6fb2299,
    0xf523f357,
    0xa6327623,
    0x93a83531,
    0x56cccd02,
    0xacf08162,
    0x5a75ebb5,
    0x6e163697,
    0x88d273cc,
    0xde966292,
    0x81b949d0,
    0x4c50901b,
    0x71c65614,
    0xe6c6c7bd,
    0x327a140a,
    0x45e1d006,
    0xc3f27b9a,
    0xc9aa53fd,
    0x62a80f00,
    0xbb25bfe2,
    0x35bdd2f6,
    0x71126905,
    0xb2040222,
    0xb6cbcf7c,
    0xcd769c2b,
    0x53113ec0,
    0x1640e3d3,
    0x38abbd60,
    0x2547adf0,
    0xba38209c,
    0xf746ce76,
    0x77afa1c5,
    0x20756060,
    0x85cbfe4e,
    0x8ae88dd8,
    0x7aaaf9b0,
    0x4cf9aa7e,
    0x1948c25c,
    0x02fb8a8c,
    0x01c36ae4,
    0xd6ebe1f9,
    0x90d4f869,
    0xa65cdea0,
    0x3f09252d,
    0xc208e69f,
    0xb74e6132,
    0xce77e25b,
    0x578fdfe3,
    0x3ac372e6
];
/**
 * @type {Array.<number>}
 * @const
 * @inner
 */ var C_ORIG = [
    0x4f727068,
    0x65616e42,
    0x65686f6c,
    0x64657253,
    0x63727944,
    0x6f756274
];
/**
 * @param {Array.<number>} lr
 * @param {number} off
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @returns {Array.<number>}
 * @inner
 */ function _encipher(lr, off, P, S) {
    // This is our bottleneck: 1714/1905 ticks / 90% - see profile.txt
    var n, l = lr[off], r = lr[off + 1];
    l ^= P[0];
    /*
    for (var i=0, k=BLOWFISH_NUM_ROUNDS-2; i<=k;)
        // Feistel substitution on left word
        n  = S[l >>> 24],
        n += S[0x100 | ((l >> 16) & 0xff)],
        n ^= S[0x200 | ((l >> 8) & 0xff)],
        n += S[0x300 | (l & 0xff)],
        r ^= n ^ P[++i],
        // Feistel substitution on right word
        n  = S[r >>> 24],
        n += S[0x100 | ((r >> 16) & 0xff)],
        n ^= S[0x200 | ((r >> 8) & 0xff)],
        n += S[0x300 | (r & 0xff)],
        l ^= n ^ P[++i];
    */ //The following is an unrolled version of the above loop.
    //Iteration 0
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[1];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[2];
    //Iteration 1
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[3];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[4];
    //Iteration 2
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[5];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[6];
    //Iteration 3
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[7];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[8];
    //Iteration 4
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[9];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[10];
    //Iteration 5
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[11];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[12];
    //Iteration 6
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[13];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[14];
    //Iteration 7
    n = S[l >>> 24];
    n += S[0x100 | l >> 16 & 0xff];
    n ^= S[0x200 | l >> 8 & 0xff];
    n += S[0x300 | l & 0xff];
    r ^= n ^ P[15];
    n = S[r >>> 24];
    n += S[0x100 | r >> 16 & 0xff];
    n ^= S[0x200 | r >> 8 & 0xff];
    n += S[0x300 | r & 0xff];
    l ^= n ^ P[16];
    lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
    lr[off + 1] = l;
    return lr;
}
/**
 * @param {Array.<number>} data
 * @param {number} offp
 * @returns {{key: number, offp: number}}
 * @inner
 */ function _streamtoword(data, offp) {
    for(var i = 0, word = 0; i < 4; ++i)word = word << 8 | data[offp] & 0xff, offp = (offp + 1) % data.length;
    return {
        key: word,
        offp: offp
    };
}
/**
 * @param {Array.<number>} key
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @inner
 */ function _key(key, P, S) {
    var offset = 0, lr = [
        0,
        0
    ], plen = P.length, slen = S.length, sw;
    for(var i = 0; i < plen; i++)sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
    for(i = 0; i < plen; i += 2)lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
    for(i = 0; i < slen; i += 2)lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
/**
 * Expensive key schedule Blowfish.
 * @param {Array.<number>} data
 * @param {Array.<number>} key
 * @param {Array.<number>} P
 * @param {Array.<number>} S
 * @inner
 */ function _ekskey(data, key, P, S) {
    var offp = 0, lr = [
        0,
        0
    ], plen = P.length, slen = S.length, sw;
    for(var i = 0; i < plen; i++)sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
    offp = 0;
    for(i = 0; i < plen; i += 2)sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
    for(i = 0; i < slen; i += 2)sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
/**
 * Internaly crypts a string.
 * @param {Array.<number>} b Bytes to crypt
 * @param {Array.<number>} salt Salt bytes to use
 * @param {number} rounds Number of rounds
 * @param {function(Error, Array.<number>=)=} callback Callback receiving the error, if any, and the resulting bytes. If
 *  omitted, the operation will be performed synchronously.
 *  @param {function(number)=} progressCallback Callback called with the current progress
 * @returns {!Array.<number>|undefined} Resulting bytes if callback has been omitted, otherwise `undefined`
 * @inner
 */ function _crypt(b, salt, rounds, callback, progressCallback) {
    var cdata = C_ORIG.slice(), clen = cdata.length, err;
    // Validate
    if (rounds < 4 || rounds > 31) {
        err = Error("Illegal number of rounds (4-31): " + rounds);
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    if (salt.length !== BCRYPT_SALT_LEN) {
        err = Error("Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN);
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    rounds = 1 << rounds >>> 0;
    var P, S, i = 0, j;
    //Use typed arrays when available - huge speedup!
    if (typeof Int32Array === "function") {
        P = new Int32Array(P_ORIG);
        S = new Int32Array(S_ORIG);
    } else {
        P = P_ORIG.slice();
        S = S_ORIG.slice();
    }
    _ekskey(salt, b, P, S);
    /**
   * Calcualtes the next round.
   * @returns {Array.<number>|undefined} Resulting array if callback has been omitted, otherwise `undefined`
   * @inner
   */ function next() {
        if (progressCallback) progressCallback(i / rounds);
        if (i < rounds) {
            var start = Date.now();
            for(; i < rounds;){
                i = i + 1;
                _key(b, P, S);
                _key(salt, P, S);
                if (Date.now() - start > MAX_EXECUTION_TIME) break;
            }
        } else {
            for(i = 0; i < 64; i++)for(j = 0; j < clen >> 1; j++)_encipher(cdata, j << 1, P, S);
            var ret = [];
            for(i = 0; i < clen; i++)ret.push((cdata[i] >> 24 & 0xff) >>> 0), ret.push((cdata[i] >> 16 & 0xff) >>> 0), ret.push((cdata[i] >> 8 & 0xff) >>> 0), ret.push((cdata[i] & 0xff) >>> 0);
            if (callback) {
                callback(null, ret);
                return;
            } else return ret;
        }
        if (callback) nextTick(next);
    }
    // Async
    if (typeof callback !== "undefined") {
        next();
    // Sync
    } else {
        var res;
        while(true)if (typeof (res = next()) !== "undefined") return res || [];
    }
}
/**
 * Internally hashes a password.
 * @param {string} password Password to hash
 * @param {?string} salt Salt to use, actually never null
 * @param {function(Error, string=)=} callback Callback receiving the error, if any, and the resulting hash. If omitted,
 *  hashing is performed synchronously.
 *  @param {function(number)=} progressCallback Callback called with the current progress
 * @returns {string|undefined} Resulting hash if callback has been omitted, otherwise `undefined`
 * @inner
 */ function _hash(password, salt, callback, progressCallback) {
    var err;
    if (typeof password !== "string" || typeof salt !== "string") {
        err = Error("Invalid string / salt: Not a string");
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    // Validate the salt
    var minor, offset;
    if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
        err = Error("Invalid salt version: " + salt.substring(0, 2));
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    if (salt.charAt(2) === "$") minor = String.fromCharCode(0), offset = 3;
    else {
        minor = salt.charAt(2);
        if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
            err = Error("Invalid salt revision: " + salt.substring(2, 4));
            if (callback) {
                nextTick(callback.bind(this, err));
                return;
            } else throw err;
        }
        offset = 4;
    }
    // Extract number of rounds
    if (salt.charAt(offset + 2) > "$") {
        err = Error("Missing salt rounds");
        if (callback) {
            nextTick(callback.bind(this, err));
            return;
        } else throw err;
    }
    var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
    password += minor >= "a" ? "\x00" : "";
    var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
    /**
   * Finishes hashing.
   * @param {Array.<number>} bytes Byte array
   * @returns {string}
   * @inner
   */ function finish(bytes) {
        var res = [];
        res.push("$2");
        if (minor >= "a") res.push(minor);
        res.push("$");
        if (rounds < 10) res.push("0");
        res.push(rounds.toString());
        res.push("$");
        res.push(base64_encode(saltb, saltb.length));
        res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
        return res.join("");
    }
    // Sync
    if (typeof callback == "undefined") return finish(_crypt(passwordb, saltb, rounds));
    else {
        _crypt(passwordb, saltb, rounds, function(err, bytes) {
            if (err) callback(err, null);
            else callback(null, finish(bytes));
        }, progressCallback);
    }
}
function encodeBase64(bytes, length) {
    return base64_encode(bytes, length);
}
function decodeBase64(string, length) {
    return base64_decode(string, length);
}
const __TURBOPACK__default__export__ = {
    setRandomFallback,
    genSaltSync,
    genSalt,
    hashSync,
    hash,
    compareSync,
    compare,
    getRounds,
    getSalt,
    truncates,
    encodeBase64,
    decodeBase64
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1jle-mwklv-h0._.js.map